const benefits = ["إجابات موثّقة", "سياق كل محاضرة", "شرح بصوت دكتورك"];

export default function Home() {
  return (
    <main className="landing" dir="rtl">
      <div className="ambient ambientOne" aria-hidden="true" />
      <div className="ambient ambientTwo" aria-hidden="true" />
      <div className="mesh" aria-hidden="true" />

      <header className="topbar">
        <a className="brand" href="#home" aria-label="Doctor AI - الرئيسية">
          <span className="brandMark" aria-hidden="true">
            <span className="brandCore">D</span>
            <span className="brandSpark">✦</span>
          </span>
          <span className="brandText">
            <strong>DOCTOR AI</strong>
            <small>منصتك التعليمية الذكية</small>
          </span>
        </a>

        <nav className="navLinks" aria-label="التنقل الرئيسي">
          <a className="active" href="#home">الرئيسية</a>
          <a href="#journey">كيف تعمل؟</a>
          <a href="#features">المميزات</a>
        </nav>

        <div className="authActions">
          <button className="loginButton" type="button">تسجيل الدخول</button>
          <button className="signupButton" type="button">
            إنشاء حساب
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </header>

      <section className="hero" id="home">
        <div className="heroCopy">
          <div className="eyebrow">
            <span className="liveDot" aria-hidden="true" />
            تعليم طبي يفهمك
            <span className="eyebrowLine" aria-hidden="true" />
          </div>

          <p className="typeLabel" dir="ltr" aria-label="Welcome, Doctor.">
            <span>Welcome, Doctor.</span>
          </p>

          <h1>
            كل محاضرة أصبحت
            <span className="gradientText"> بداية لفهمٍ لا ينتهي.</span>
          </h1>

          <p className="heroLead">
            ارفع محاضرتك، ناقشها مع مساعد ذكي يفهم سياقها، وحوّل ساعات
            المذاكرة إلى لحظات فهم حقيقية تبقى معك.
          </p>

          <div className="heroActions" id="start">
            <button className="primaryCta" type="button">
              ابدأ رحلة الفهم
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

        <div className="productStage" aria-label="معاينة منصة Doctor AI">
          <div className="orbit orbitOne" aria-hidden="true" />
          <div className="orbit orbitTwo" aria-hidden="true" />

          <div className="floatingPill pillPdf">
            <span className="pdfIcon">PDF</span>
            <span><strong>تم تحليل المحاضرة</strong><small>جاهزة للمناقشة</small></span>
            <i>✓</i>
          </div>

          <div className="floatingPill pillContext">
            <span className="contextIcon">◎</span>
            <span><strong>فهم سياقي</strong><small>إجابة من محتواك</small></span>
          </div>

          <article className="appWindow">
            <div className="windowTop">
              <div className="windowTitle">
                <span className="miniLogo">D</span>
                <span><strong>مساحة الفهم</strong><small>AI Study Room</small></span>
              </div>
              <div className="windowTools">
                <button type="button" aria-label="الإشعارات">●</button>
                <span className="avatar">AM</span>
              </div>
            </div>

            <div className="courseBar">
              <div>
                <span className="courseIcon" aria-hidden="true">⌁</span>
                <span><strong>Microbiology</strong><small>المحاضرة الرابعة</small></span>
              </div>
              <span className="statusPill"><i /> متصل بالمحاضرة</span>
            </div>

            <div className="lectureCard">
              <div className="lectureMeta">
                <span className="documentIcon" aria-hidden="true">PDF</span>
                <span><strong>مراحل نمو البكتيريا</strong><small>42 صفحة · د. أحمد محمود</small></span>
              </div>
              <div className="progressBlock">
                <span>86%</span>
                <div><i /></div>
              </div>
            </div>

            <div className="chatPanel">
              <div className="chatHeader">
                <div>
                  <span className="aiOrb" aria-hidden="true">✦</span>
                  <span><strong>المساعد الذكي</strong><small>يفهم هذه المحاضرة بالكامل</small></span>
                </div>
                <span className="thinking"><i /> جاهز للإجابة</span>
              </div>

              <div className="messages">
                <div className="userMessage">
                  ما الفرق بين <b dir="ltr">Lag phase</b> و <b dir="ltr">Log phase</b>؟
                </div>
                <div className="aiMessage">
                  <span className="messageSpark" aria-hidden="true">✦</span>
                  <div>
                    في مرحلة <b dir="ltr">Lag phase</b> تتأقلم البكتيريا مع البيئة الجديدة،
                    بينما تبدأ في <b dir="ltr">Log phase</b> بالانقسام السريع بمعدل ثابت.
                    <div className="sourceTag">المصدر: صفحات 12–14 من المحاضرة</div>
                  </div>
                </div>
              </div>

              <div className="questionBox">
                <span>اسأل عن أي نقطة في المحاضرة...</span>
                <button type="button" aria-label="إرسال السؤال">↑</button>
              </div>
            </div>
          </article>

          <div className="creditBadge">
            <span aria-hidden="true">✦</span>
            <div><strong>+493</strong><small>رصيد متاح</small></div>
          </div>
        </div>
      </section>

      <section className="journeyStrip" id="journey" aria-label="رحلة استخدام المنصة">
        <div className="journeyIntro">
          <span>رحلة واحدة. فهم أعمق.</span>
          <strong>من الملف إلى الإجابة في لحظات.</strong>
        </div>
        <div className="journeySteps">
          <div><b>01</b><span><strong>ارفع</strong><small>PDF أو تسجيل صوتي</small></span></div>
          <i aria-hidden="true">←</i>
          <div><b>02</b><span><strong>افهم</strong><small>تلخيص ونقاط مركّزة</small></span></div>
          <i aria-hidden="true">←</i>
          <div><b>03</b><span><strong>ناقش</strong><small>إجابات من محاضرتك</small></span></div>
        </div>
      </section>
    </main>
  );
}
