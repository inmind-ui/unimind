"use client";

import { FormEvent, useEffect, useState } from "react";
import type { CSSProperties } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./lib/supabase";

const benefits = ["AI مخصص لكليتك", "يعرف دكاترتك ومحاضراتك", "إجابات من منهجك"];

const faculties = [
  { value: "medicine", label: "كلية الطب البشري" },
  { value: "dentistry", label: "كلية طب الأسنان" },
  { value: "pharmacy", label: "كلية الصيدلة" },
  { value: "nursing", label: "كلية التمريض" },
  { value: "applied_health_sciences", label: "كلية العلوم الصحية التطبيقية" },
];

type AuthMode = "login" | "signup";
type StudentProfile = { full_name: string; faculty: string; study_year: number };

const demoQuestions = [
  {
    question: "مش فاهم.. إيه اللي حصل في محاضرة د. زياد؟",
    answer:
      "د. زياد شرح الـ Cardiac Cycle كرحلة واحدة: امتلاء البطينين في Diastole، ثم انقباضهما في Systole، وربط كل مرحلة بفتح وغلق الصمامات وتغيّر الضغط داخل القلب.",
    source: "محاضرة Cardiac Cycle · الدقائق 08:40–31:20",
  },
  {
    question: "الدكتور نبّه على إيه؟",
    answer:
      "ركّز د. زياد أكثر من مرة على Pressure–Volume Loop، والفرق بين صوتي القلب S1 وS2، وإمتى يفتح أو يقفل كل صمام. دي النقاط المعلَّمة كـ High Priority.",
    source: "تنبيهات الدكتور · 3 مواضع داخل المحاضرة",
  },
  {
    question: "تنصحني أذاكر إيه كويس؟",
    answer:
      "ابدأ بترتيب مراحل الدورة القلبية، وبعدها ارسم Pressure–Volume Loop من ذاكرتك، ثم اربط الصمامات بأصوات القلب. اختم بـ5 أسئلة قصيرة للتأكد إنك فاهم مش حافظ.",
    source: "خطة مذاكرة مبنية على محتوى المحاضرة",
  },
  {
    question: "إيه المتوقع ييجي في الامتحان؟",
    answer:
      "بناءً على تكرار وتنبيهات د. زياد: راجع سؤال مقارنة Systole وDiastole، ترتيب أحداث Cardiac Cycle، وتفسير تغيّر الضغط عند فتح وغلق الصمامات.",
    source: "توقع استرشادي من تنبيهات المحاضرة — وليس ضمانًا",
  },
];

const walkthroughSteps = [
  { label: "أسبوعك", title: "اعرف كل اللي حصل الأسبوع اللي فات", caption: "AI يجمع لك الدكاترة والمحاضرات والسكاشن في ملخص واحد، ثم يعرض تجهيز خطة أسبوعك.", duration: 9000 },
  { label: "افتح", title: "افتح محاضرتك", caption: "كل محاضرات فرقتك مرتبة وجاهزة داخل المادة.", duration: 4500 },
  { label: "البيانات", title: "اعرف تفاصيل المحاضرة", caption: "الدكتور، المدة، الموضوع، والنقاط المهمة أمامك فورًا.", duration: 4500 },
  { label: "الشرح", title: "افهم الفكرة ببساطة", caption: "شرح عربي واضح مع المصطلحات الطبية الأساسية.", duration: 4500 },
  { label: "تنبيه", title: "ركّز على كلام الدكتور", caption: "المنصة تبرز التنبيهات والنقاط المتكررة داخل المحاضرة.", duration: 4500 },
  { label: "اسأل AI", title: "اسأل عن أي نقطة", caption: "AI يعرف المحاضرة ودكتورك ويجيبك من المحتوى نفسه.", duration: 4500 },
  { label: "الامتحان", title: "اخرج بخطة مذاكرة", caption: "اعرف ماذا تراجع وما النقاط الأقرب لأسلوب الامتحان.", duration: 4500 },
];

function normalizePhone(value: string) {
  const compact = value.replace(/[\s()-]/g, "");
  if (/^01\d{9}$/.test(compact)) return `+20${compact.slice(1)}`;
  if (/^20\d{10}$/.test(compact)) return `+${compact}`;
  return compact;
}

function authErrorMessage(message: string) {
  const normalized = message.toLowerCase();
  if (normalized.includes("phone provider is disabled") || normalized.includes("phone_provider_disabled")) {
    return "تسجيل الهاتف لم يُفعّل بعد في إعدادات المنصة. تواصل مع إدارة المنصة.";
  }
  if (normalized.includes("invalid login credentials")) return "رقم الهاتف أو كلمة المرور غير صحيحة.";
  if (normalized.includes("already registered") || normalized.includes("already been registered")) {
    return "يوجد حساب مسجّل بالفعل بهذا الرقم. جرّب تسجيل الدخول.";
  }
  if (normalized.includes("rate limit")) return "تمت محاولات كثيرة. انتظر قليلًا ثم أعد المحاولة.";
  if (normalized.includes("token has expired") || normalized.includes("invalid token")) {
    return "رمز التحقق غير صحيح أو انتهت صلاحيته.";
  }
  return "تعذّر إتمام العملية الآن. راجع البيانات وحاول مرة أخرى.";
}

export default function Home() {
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [videoStep, setVideoStep] = useState(0);
  const [isDemoPlaying, setIsDemoPlaying] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [faculty, setFaculty] = useState("");
  const [studyYear, setStudyYear] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpPhone, setOtpPhone] = useState("");
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("unimind-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const frame = window.requestAnimationFrame(() => {
      setIsDarkMode(savedTheme ? savedTheme === "dark" : prefersDark);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!isDemoPlaying || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => {
      setVideoStep((current) => (current + 1) % walkthroughSteps.length);
    }, walkthroughSteps[videoStep].duration);
    return () => window.clearTimeout(timer);
  }, [isDemoPlaying, videoStep]);

  useEffect(() => {
    let active = true;

    const loadProfile = async (currentUser: User | null) => {
      if (!active) return;
      setUser(currentUser);
      if (!currentUser) {
        setProfile(null);
        return;
      }
      const { data } = await supabase
        .from("student_profiles")
        .select("full_name, faculty, study_year")
        .eq("user_id", currentUser.id)
        .maybeSingle();
      if (active && data) setProfile(data as StudentProfile);
    };

    supabase.auth.getUser().then(({ data }) => loadProfile(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      void loadProfile(session?.user ?? null);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!authMode) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        setAuthMode(null);
        setAuthError("");
        setAuthMessage("");
        setIsOtpStep(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [authMode, isSubmitting]);

  function openAuth(mode: AuthMode) {
    setAuthMode(mode);
    setAuthError("");
    setAuthMessage("");
    setIsOtpStep(false);
    setOtp("");
  }

  function closeAuth() {
    if (isSubmitting) return;
    setAuthMode(null);
    setAuthError("");
    setAuthMessage("");
    setIsOtpStep(false);
  }

  async function handleAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthError("");
    setAuthMessage("");
    setIsSubmitting(true);

    try {
      const formattedPhone = normalizePhone(phone);
      if (!/^\+[1-9]\d{7,14}$/.test(formattedPhone)) {
        setAuthError("اكتب رقم الهاتف بصيغة صحيحة، مثل 01012345678.");
        return;
      }

      if (authMode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          phone: formattedPhone,
          password,
        });
        if (error) {
          setAuthError(authErrorMessage(error.message));
          return;
        }
        setAuthMessage("تم تسجيل الدخول بنجاح. أهلًا بك في UniMind.");
        window.setTimeout(() => setAuthMode(null), 800);
        return;
      }

      if (fullName.trim().length < 3) {
        setAuthError("اكتب اسمك الكامل كما سيظهر داخل المنصة.");
        return;
      }
      if (!faculty || !studyYear) {
        setAuthError("اختر الكلية والفرقة الدراسية.");
        return;
      }
      if (password.length < 8) {
        setAuthError("كلمة المرور يجب أن تكون 8 أحرف على الأقل.");
        return;
      }
      if (password !== confirmPassword) {
        setAuthError("كلمتا المرور غير متطابقتين.");
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        phone: formattedPhone,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            faculty,
            study_year: studyYear,
          },
        },
      });

      if (error) {
        setAuthError(authErrorMessage(error.message));
        return;
      }

      if (data.session) {
        setAuthMessage("تم إنشاء حسابك وتسجيل الدخول بنجاح.");
        window.setTimeout(() => setAuthMode(null), 900);
      } else {
        setOtpPhone(formattedPhone);
        setIsOtpStep(true);
        setAuthMessage("أرسلنا رمز تحقق إلى رقم هاتفك.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function verifyOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthError("");
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: otpPhone,
        token: otp.trim(),
        type: "sms",
      });
      if (error) {
        setAuthError(authErrorMessage(error.message));
        return;
      }
      setAuthMessage("تم تأكيد رقمك وإنشاء الحساب بنجاح.");
      window.setTimeout(() => setAuthMode(null), 900);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setProfile(null);
    setUser(null);
  }

  function toggleDarkMode() {
    const nextTheme = !isDarkMode;
    setIsDarkMode(nextTheme);
    window.localStorage.setItem("unimind-theme", nextTheme ? "dark" : "light");
  }

  const videoElapsedSeconds = walkthroughSteps
    .slice(0, videoStep)
    .reduce((total, step) => total + step.duration / 1000, 0);

  return (
    <main className={`landing ${isDarkMode ? "darkMode" : ""}`} dir="rtl">
      <div className="ambient ambientOne" aria-hidden="true" />
      <div className="ambient ambientTwo" aria-hidden="true" />
      <div className="mesh" aria-hidden="true" />

      <header className="topbar">
        <a className="brand" href="#home" aria-label="UniMind - الرئيسية">
          <span className="brandMark" aria-hidden="true">
            <span className="brandCore">U</span>
            <span className="brandSpark">✦</span>
          </span>
          <span className="brandText">
            <strong>UNIMIND</strong>
            <small>منصتك التعليمية الذكية</small>
          </span>
        </a>

        <nav className="navLinks" aria-label="التنقل الرئيسي">
          <a className="active" href="#home">الرئيسية</a>
          <a href="#journey">كيف تعمل؟</a>
          <a href="#features">المميزات</a>
        </nav>

        <div className="authActions">
          <button
            className="themeButton"
            type="button"
            onClick={toggleDarkMode}
            aria-pressed={isDarkMode}
            aria-label={isDarkMode ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
            title={isDarkMode ? "الوضع الفاتح" : "الوضع الداكن"}
          >
            <span aria-hidden="true">{isDarkMode ? "☀" : "☾"}</span>
            <small>{isDarkMode ? "فاتح" : "داكن"}</small>
          </button>
          {user ? (
            <>
              <span className="studentGreeting">أهلًا، {profile?.full_name?.split(" ")[0] ?? "دكتور"}</span>
              <button className="loginButton" type="button" onClick={signOut}>تسجيل الخروج</button>
            </>
          ) : (
            <>
              <button className="loginButton" type="button" onClick={() => openAuth("login")}>تسجيل الدخول</button>
              <button className="signupButton" type="button" onClick={() => openAuth("signup")}>
                إنشاء حساب
                <span aria-hidden="true">↗</span>
              </button>
            </>
          )}
        </div>
      </header>

      <section className="hero" id="home">
        <div className="heroCopy">
          <div className="eyebrow">
            <span className="liveDot" aria-hidden="true" />
            ذكاء يعرف كليتك
            <span className="eyebrowLine" aria-hidden="true" />
          </div>

          <p className="typeLabel" dir="ltr" aria-label="Welcome, Doctor.">
            <span>Welcome, Doctor.</span>
          </p>

          <h1>
            كل محاضراتك جاهزة.
            <span className="gradientText"> ومساعد كليتك الذكي مستنيك.</span>
          </h1>

          <p className="heroLead">
            ادخل تلاقي AI مخصص لكليتك وفرقتك؛ عارف دكاترتك وموادك وكل
            محاضراتك، يشرح لك بطريقتك ويوصلك للإجابة من منهجك.
          </p>

          <div className="heroActions" id="start">
            <button className="primaryCta" type="button" onClick={() => { if (!user) openAuth("signup"); }}>
              {user ? "ادخل مساحة الفهم" : "ابدأ رحلة الفهم"}
              <span className="ctaArrow" aria-hidden="true">←</span>
            </button>
            <a className="secondaryCta" href="#journey">
              <span className="playIcon" aria-hidden="true">▶</span>
              شاهد كيف تعمل
            </a>
          </div>

          <div className="benefitRow" id="features" aria-label="مميزات المنصة">
            {benefits.map((benefit) => (
              <span key={benefit}>
                <i aria-hidden="true">✓</i>
                {benefit}
              </span>
            ))}
          </div>
        </div>

        <div className="productStage" aria-label="معاينة منصة UniMind">
          <div className="orbit orbitOne" aria-hidden="true" />
          <div className="orbit orbitTwo" aria-hidden="true" />

          <div className="floatingPill pillPdf">
            <span className="pdfIcon">PDF</span>
            <span><strong>شاهد المنصة وهي تعمل</strong><small>فيديو خطوة بخطوة</small></span>
            <i>✓</i>
          </div>

          <div className="floatingPill pillContext">
            <span className="contextIcon">◎</span>
            <span><strong>يعرف تنبيهات الدكتور</strong><small>ويحوّلها لخطة مذاكرة</small></span>
          </div>

          <article className="appWindow">
            <div className="windowTop">
              <div className="windowTitle">
                <span className="miniLogo">U</span>
                <span><strong>مساحة الفهم</strong><small>AI Study Room</small></span>
              </div>
              <div className="windowTools">
                <span className="interactiveBadge"><i /> فيديو توضيحي</span>
                <span className="avatar">ZY</span>
              </div>
            </div>

            <div className="courseBar">
              <div>
                <span className="courseIcon" aria-hidden="true">♥</span>
                <span><strong>Physiology</strong><small>الفرقة الثانية · الجهاز الدوري</small></span>
              </div>
              <span className="statusPill"><i /> المحتوى جاهز</span>
            </div>

            <div className={`walkthroughPlayer ${isDemoPlaying ? "playing" : "paused"}`} aria-label="فيديو يشرح إمكانيات المنصة خطوة بخطوة">
              <div className="walkthroughTop">
                <div>
                  <span className="recordDot" aria-hidden="true" />
                  <span>شرح المنصة في 36 ثانية</span>
                </div>
                <span dir="ltr">0:{String(Math.floor(videoElapsedSeconds)).padStart(2, "0")} / 0:36</span>
              </div>

              <div className="videoScene" aria-live="polite">
                <div className="sceneStepBadge">الخطوة {videoStep + 1} من {walkthroughSteps.length}</div>

                <div key={videoStep} className="sceneContent">
                  {videoStep === 0 && (
                    <div className="weeklyRecapScene">
                      <div className="weeklyStudentQuestion">
                        إيه اللي حصل الأسبوع اللي فات في الكلية؟
                        <span>أنت</span>
                      </div>

                      <div className="weeklyAiCard">
                        <div className="weeklyAiHead">
                          <span aria-hidden="true">✦</span>
                          <div><strong>ملخص أسبوعك جاهز</strong><small>جمعت لك المحاضرات والسكاشن من جدول فرقتك</small></div>
                          <i>4 مواد</i>
                        </div>

                        <div className="weeklySubjects">
                          <div>
                            <span className="subjectMark physiology">P</span>
                            <div>
                              <strong>Physiology · د. زياد حسن</strong>
                              <p><b>محاضرة:</b> Cardiac Cycle <i /> <b>سكشن:</b> ECG Basics — د. سلمى عادل</p>
                            </div>
                            <em>مهم</em>
                          </div>
                          <div>
                            <span className="subjectMark anatomy">A</span>
                            <div>
                              <strong>Anatomy · د. أحمد فؤاد</strong>
                              <p><b>محاضرة:</b> Mediastinum <i /> <b>سكشن:</b> Heart Dissection — د. مريم خالد</p>
                            </div>
                          </div>
                          <div>
                            <span className="subjectMark biochemistry">B</span>
                            <div>
                              <strong>Biochemistry · د. ندى سامح</strong>
                              <p><b>محاضرة:</b> Enzymes &amp; Cofactors <i /> <b>سكشن:</b> Enzyme Kinetics — د. عمر علي</p>
                            </div>
                          </div>
                          <div>
                            <span className="subjectMark histology">H</span>
                            <div>
                              <strong>Histology · د. كريم منصور</strong>
                              <p><b>محاضرة:</b> Cardiac Muscle <i /> <b>سكشن:</b> Heart Slides — د. سارة أمين</p>
                            </div>
                          </div>
                        </div>

                        <div className="weeklyPlanOffer">
                          <span aria-hidden="true">✦</span>
                          <div><strong>أجهزلك خطة مذاكرة للأسبوع ده؟</strong><small>نبدأ بالأجزاء المتأخرة والنقاط عالية الأولوية</small></div>
                          <b>جهّزها</b>
                        </div>
                      </div>
                    </div>
                  )}

                  {videoStep === 1 && (
                    <div className="videoLectureList">
                      <div className="videoSectionTitle">
                        <div><strong>محاضرات Physiology</strong><small>12 محاضرة جاهزة للفرقة الثانية</small></div>
                        <span>عرض الكل</span>
                      </div>
                      <div className="videoLectureCard muted">
                        <span className="videoLectureNumber">05</span>
                        <div><strong>Cardiac Muscle</strong><small>د. زياد حسن · 44 دقيقة</small></div>
                        <i>✓</i>
                      </div>
                      <div className="videoLectureCard selected">
                        <span className="videoPlayIcon">▶</span>
                        <div><strong>Cardiac Cycle &amp; Heart Sounds</strong><small>د. زياد حسن · المحاضرة 06</small></div>
                        <b>افتح</b>
                      </div>
                    </div>
                  )}

                  {videoStep === 2 && (
                    <div className="videoLectureDetails">
                      <div className="lectureDemoHead">
                        <div>
                          <span className="demoEyebrow">محاضرة 06 · د. زياد حسن</span>
                          <h3>Cardiac Cycle &amp; Heart Sounds</h3>
                          <p>52 دقيقة <i /> فسيولوجي <i /> الفرقة الثانية</p>
                        </div>
                        <span className="completionRing"><b>82%</b><small>مكتمل</small></span>
                      </div>
                      <div className="videoStats">
                        <span><b>18</b><small>نقطة مهمة</small></span>
                        <span><b>6</b><small>تنبيهات للدكتور</small></span>
                        <span><b>12</b><small>سؤال مراجعة</small></span>
                      </div>
                    </div>
                  )}

                  {videoStep === 3 && (
                    <div className="videoExplanationScene">
                      <div className="explanationCard">
                        <div className="explanationTitle">
                          <span aria-hidden="true">01</span>
                          <div><strong>الفكرة ببساطة</strong><small>شرح من داخل محاضرة د. زياد</small></div>
                        </div>
                        <p>
                          الدورة القلبية هي ترتيب امتلاء القلب بالدم ثم ضخه. في <b dir="ltr">Diastole</b> تمتلئ
                          البطينات، وفي <b dir="ltr">Systole</b> تنقبض لتدفع الدم للجسم والرئتين.
                        </p>
                        <div className="conceptFlow" aria-label="مراحل الدورة القلبية">
                          <span>امتلاء البطين</span><i>←</i><span>غلق الصمامات</span><i>←</i><span>ضخ الدم</span>
                        </div>
                      </div>
                      <span className="videoCaptionTag">شرح عربي + المصطلحات الطبية</span>
                    </div>
                  )}

                  {videoStep === 4 && (
                    <div className="videoAlertScene">
                      <div className="doctorAlert">
                        <span aria-hidden="true">!</span>
                        <div>
                          <strong>الدكتور نبّه هنا</strong>
                          <p>اربط تغيّر الضغط بفتح وغلق الصمامات؛ النقطة دي مهمة جدًا في الامتحان.</p>
                        </div>
                      </div>
                      <div className="focusPoints">
                        <span><i>1</i> Pressure–Volume Loop</span>
                        <span><i>2</i> الفرق بين S1 وS2</span>
                        <span><i>3</i> توقيت فتح الصمامات</span>
                      </div>
                      <div className="highPriority"><span>High Priority</span><i /></div>
                    </div>
                  )}

                  {videoStep === 5 && (
                    <div className="videoAiScene">
                      <div className="chatHeader">
                        <div>
                          <span className="aiOrb" aria-hidden="true">✦</span>
                          <span><strong>AI الخاص بكليتك</strong><small>يعرف محاضرة د. زياد بالكامل</small></span>
                        </div>
                        <span className="thinking"><i /> يجيب من المحاضرة</span>
                      </div>
                      <div className="messages demoMessages">
                        <div className="userMessage">{demoQuestions[0].question}</div>
                        <div className="aiMessage">
                          <span className="messageSpark" aria-hidden="true">✦</span>
                          <div>{demoQuestions[0].answer}<div className="sourceTag">{demoQuestions[0].source}</div></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {videoStep === 6 && (
                    <div className="videoExamScene">
                      <div className="examSceneHead">
                        <span aria-hidden="true">✓</span>
                        <div><strong>خطة مذاكرتك جاهزة</strong><small>مبنية على شرح وتنبيهات د. زياد</small></div>
                      </div>
                      <div className="examChecklist">
                        <span><i>1</i><b>ارسم Pressure–Volume Loop</b><small>أولوية عالية</small></span>
                        <span><i>2</i><b>قارن بين Systole وDiastole</b><small>سؤال متوقع</small></span>
                        <span><i>3</i><b>راجع S1 وS2 والصمامات</b><small>تأكيد الدكتور</small></span>
                      </div>
                      <div className="examDisclaimer">توقع استرشادي من تنبيهات المحاضرة — وليس ضمانًا</div>
                    </div>
                  )}
                </div>

                <div className="sceneNarration">
                  <span>{walkthroughSteps[videoStep].title}</span>
                  <p>{walkthroughSteps[videoStep].caption}</p>
                </div>
              </div>

              <div className="videoTimeline" aria-label="خطوات الفيديو">
                {walkthroughSteps.map((step, index) => (
                  <button
                    key={step.label}
                    type="button"
                    className={index === videoStep ? "active" : index < videoStep ? "done" : ""}
                    onClick={() => { setVideoStep(index); setIsDemoPlaying(false); }}
                    aria-label={`انتقل إلى خطوة ${step.title}`}
                  >
                    <i style={{ "--step-duration": `${step.duration}ms` } as CSSProperties} /><span>{step.label}</span>
                  </button>
                ))}
              </div>

              <div className="videoControls">
                <button
                  type="button"
                  onClick={() => { setVideoStep((videoStep - 1 + walkthroughSteps.length) % walkthroughSteps.length); setIsDemoPlaying(false); }}
                  aria-label="الخطوة السابقة"
                >
                  ‹
                </button>
                <button
                  className="playPause"
                  type="button"
                  onClick={() => setIsDemoPlaying((playing) => !playing)}
                  aria-label={isDemoPlaying ? "إيقاف الفيديو" : "تشغيل الفيديو"}
                >
                  {isDemoPlaying ? "Ⅱ" : "▶"}
                </button>
                <button
                  type="button"
                  onClick={() => { setVideoStep((videoStep + 1) % walkthroughSteps.length); setIsDemoPlaying(false); }}
                  aria-label="الخطوة التالية"
                >
                  ›
                </button>
                <span>{isDemoPlaying ? "الفيديو يعمل تلقائيًا" : "الفيديو متوقف"}</span>
              </div>
            </div>
          </article>

          <div className="creditBadge">
            <span aria-hidden="true">▶</span>
            <div><strong>7 خطوات</strong><small>شاهد إمكانيات المنصة</small></div>
          </div>
        </div>
      </section>

      <section className="journeyStrip" id="journey" aria-label="رحلة استخدام المنصة">
        <div className="journeyIntro">
          <span>كل كليتك في مكان واحد.</span>
          <strong>من أي محاضرة إلى فهم حقيقي في لحظات.</strong>
        </div>
        <div className="journeySteps">
          <div><b>01</b><span><strong>اختار</strong><small>كليتك وفرقتك</small></span></div>
          <i aria-hidden="true">←</i>
          <div><b>02</b><span><strong>اسأل</strong><small>AI يعرف كل محاضراتك</small></span></div>
          <i aria-hidden="true">←</i>
          <div><b>03</b><span><strong>اتقن</strong><small>شرح وإجابات من منهجك</small></span></div>
        </div>
      </section>

      {authMode && (
        <div className="authOverlay" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeAuth();
        }}>
          <section className="authModal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
            <button className="authClose" type="button" onClick={closeAuth} aria-label="إغلاق">×</button>
            <div className="authBrand" aria-hidden="true"><span>U</span>✦</div>
            <p className="authKicker">UNIMIND STUDENT ACCOUNT</p>
            <h2 id="auth-title">{isOtpStep ? "أكد رقم هاتفك" : authMode === "signup" ? "ابدأ رحلتك كطالب" : "مرحبًا بعودتك"}</h2>
            <p className="authIntro">
              {isOtpStep
                ? `أدخل الرمز المرسل إلى ${otpPhone}`
                : authMode === "signup"
                  ? "حسابك مستقل وآمن، ومحتواك يتحدد تلقائيًا حسب كليتك وفرقتك."
                  : "ادخل برقم هاتفك وكلمة المرور الخاصة بمنصة UniMind."}
            </p>

            {isOtpStep ? (
              <form className="authForm" onSubmit={verifyOtp}>
                <label>
                  رمز التحقق
                  <input
                    dir="ltr"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otp}
                    onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    required
                  />
                </label>
                {authError && <p className="authNotice error" role="alert">{authError}</p>}
                {authMessage && <p className="authNotice success" role="status">{authMessage}</p>}
                <button className="authSubmit" type="submit" disabled={isSubmitting || otp.length !== 6}>
                  {isSubmitting ? "جاري التأكيد..." : "تأكيد وإنشاء الحساب"}
                </button>
              </form>
            ) : (
              <form className="authForm" onSubmit={handleAuth}>
                {authMode === "signup" && (
                  <>
                    <label>
                      الاسم الكامل
                      <input autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="مثال: أحمد محمد علي" required />
                    </label>
                    <div className="authGrid">
                      <label>
                        الكلية
                        <select value={faculty} onChange={(event) => setFaculty(event.target.value)} required>
                          <option value="">اختر الكلية</option>
                          {faculties.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                        </select>
                      </label>
                      <label>
                        الفرقة الدراسية
                        <select value={studyYear} onChange={(event) => setStudyYear(event.target.value)} required>
                          <option value="">اختر الفرقة</option>
                          {[1, 2, 3, 4, 5, 6, 7].map((year) => <option key={year} value={year}>الفرقة {year}</option>)}
                        </select>
                      </label>
                    </div>
                  </>
                )}

                <label>
                  رقم الهاتف
                  <input dir="ltr" inputMode="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="01012345678" required />
                </label>
                <label>
                  كلمة المرور
                  <input dir="ltr" type="password" autoComplete={authMode === "signup" ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="8 أحرف على الأقل" minLength={8} required />
                </label>
                {authMode === "signup" && (
                  <label>
                    تأكيد كلمة المرور
                    <input dir="ltr" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="أعد كتابة كلمة المرور" minLength={8} required />
                  </label>
                )}

                {authError && <p className="authNotice error" role="alert">{authError}</p>}
                {authMessage && <p className="authNotice success" role="status">{authMessage}</p>}

                <button className="authSubmit" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "جاري التنفيذ..." : authMode === "signup" ? "إنشاء حساب الطالب" : "تسجيل الدخول"}
                </button>
                <button className="authSwitch" type="button" onClick={() => openAuth(authMode === "signup" ? "login" : "signup")}>
                  {authMode === "signup" ? "لديك حساب بالفعل؟ سجّل الدخول" : "طالب جديد؟ أنشئ حسابك"}
                </button>
              </form>
            )}

            <p className="authPrivacy">حساب الطالب منفصل تمامًا عن خدمات الذكاء الاصطناعي.</p>
          </section>
        </div>
      )}
    </main>
  );
}
