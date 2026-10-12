import { useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Link } from 'wouter';
import './humeka-neza-page.css';

const programs: {
  title: string;
  label: string;
  text: string;
  image: string;
  alt: string;
  imageFit?: 'contain';
}[] = [
  {
    title: 'Hands-on air science',
    label: 'Learn · Measure',
    text: 'Students use monitors and experiments to ask questions about the air around their school.',
    image: '/images/humekaneza/program-air-science-illustration.jpg',
    alt: 'Illustration of students learning to use air-quality science equipment.',
    imageFit: 'contain',
  },
  {
    title: 'Air Quality Flag Program',
    label: 'Learn · Protect',
    text: 'The green and red flag activity helps schools connect air-quality information with outdoor play decisions.',
    image: '/images/humekaneza/school-outdoor-air-quality-awareness.jpg',
    alt: 'Students hold a message about healthy outdoor activity at a school event.',
  },
  {
    title: 'Anti-idling at the gate',
    label: 'Act',
    text: 'School communities discuss how idling vehicles contribute to pollution around drop-off and pick-up.',
    image: '/images/humekaneza/school-gate-activity.jpg',
    alt: 'Students and an adult gather beside a car during a school-gate activity.',
  },
  {
    title: 'One tree per student',
    label: 'Act · Protect',
    text: 'Tree planting is part of the initiative’s vision for greener school environments.',
    image: '/images/p3/projects/03-one-sensor-per-school/school-courtyard-sensor-trees.jpg',
    alt: 'Illustration of a school courtyard with students and newly planted trees.',
  },
  {
    title: 'Cleaner classrooms',
    label: 'Measure · Protect',
    text: 'School-based learning connects indoor air, practical monitoring and cleaner classroom environments.',
    image: '/images/p3/projects/04-classroom-clean-air/green-classroom-students-sign.jpg',
    alt: 'Students take part in a classroom clean-air activity.',
  },
  {
    title: 'Cleaner routes to school',
    label: 'Move · Act',
    text: 'Children explore how everyday routes and travel choices shape the air they breathe.',
    image: '/images/humekaneza/school-route-illustration.jpg',
    alt: 'Illustration of a school zone with lower-emission routes and cleaner transport.',
    imageFit: 'contain',
  },
];

const videos = [
  {
    title: 'How children in Rwanda advocate for better air quality',
    organisation: 'Western University · The Impact Project',
    id: 'J6brEhfvNbY',
  },
  {
    title: '#AroundTheWorld (Ep. 4: Rwanda & New Zealand)',
    organisation: 'AroundTheWorld',
    id: 'zQKyoFKwn_k',
  },
  {
    title: 'COVID-19 for kids #AroundTheWorld',
    organisation: 'AroundTheWorld',
    id: 'LDpdui-Cnjk',
  },
];

const schoolPhotos = [
  {
    title: 'Outdoor learning',
    image: '/images/humekaneza/school-community-learning.jpg',
    alt: 'Schoolchildren and educators gather outdoors for a community learning activity.',
  },
  {
    title: 'Sensor demonstration',
    image: '/images/humekaneza/school-sensor-demonstration.jpg',
    alt: 'Two students examine air-quality monitoring equipment during a classroom activity.',
  },
  {
    title: 'Anti-idling day',
    image: '/images/humekaneza/school-anti-idling-activity.jpg',
    alt: 'HumekaNeza school outreach includes a student wearing a no-idling message and an awareness conversation beside a car.',
  },
  {
    title: 'School workshop',
    image: '/images/humekaneza/school-workshop.jpg',
    alt: 'An educator leads an air-quality workshop with students in a classroom.',
  },
  {
    title: 'Recording observations',
    image: '/images/humekaneza/student-recording-observations.jpg',
    alt: 'A student writes observations in a notebook during a school activity.',
  },
];

export function HumekaNezaPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="humeka-site">
      <header className="hn-header">
        <div className="hn-header-inner">
          <a className="hn-brand" href="#top" onClick={closeMenu} aria-label="HumekaNeza home">
            <img src="/images/design-reference/logo-humekaneza.png" alt="" width="72" height="72" />
            <span><strong>HumekaNeza</strong><small>Breathe Easy</small></span>
          </a>
          <button
            className="hn-menu-button"
            type="button"
            aria-label={menuOpen ? 'Close HumekaNeza navigation' : 'Open HumekaNeza navigation'}
            aria-expanded={menuOpen}
            aria-controls="hn-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
          <nav className={`hn-navigation${menuOpen ? ' is-open' : ''}`} id="hn-navigation" aria-label="HumekaNeza navigation">
            <a href="#about" onClick={closeMenu}>About</a>
            <a href="#what-we-do" onClick={closeMenu}>What we do</a>
            <a href="#in-schools" onClick={closeMenu}>In schools</a>
            <a href="#videos" onClick={closeMenu}>Videos</a>
            <a href="#journey" onClick={closeMenu}>Our journey</a>
            <a href="#news" onClick={closeMenu}>News</a>
          </nav>
          <a className="hn-nav-cta" href="#get-involved" onClick={closeMenu}>Get involved <ArrowUpRight size={15} aria-hidden="true" /></a>
        </div>
      </header>

      <main id="top">
        <section className="hn-hero" aria-labelledby="hn-title">
          <img
            className="hn-hero-image"
            src="/images/design-reference/hn-hero.jpg"
            alt="An educator leads an air-quality learning activity with students in a classroom."
            fetchPriority="high"
          />
          <div className="hn-hero-shade" aria-hidden="true" />
          <div className="hn-hero-inner">
            <div className="hn-hero-copy">
              <span className="hn-eyebrow">Humeka neza · Breathe easy</span>
              <h1 id="hn-title">Clean air for every child, starting at the school gate.</h1>
              <p>HumekaNeza brings air-quality learning, citizen science and practical action into schools and communities.</p>
              <div className="hn-hero-actions">
                <a className="hn-button hn-button-light" href="#videos">Watch the story <ArrowUpRight size={15} aria-hidden="true" /></a>
                <a className="hn-button hn-button-outline" href="#get-involved">Bring HumekaNeza to your school <ArrowUpRight size={15} aria-hidden="true" /></a>
              </div>
            </div>
            <aside className="hn-flag-card" aria-labelledby="hn-flag-title">
              <span className="hn-eyebrow">A simple signal for school communities</span>
              <h2 id="hn-flag-title">The Air Quality Flag</h2>
              <p>Green means it is appropriate to play outside. Red means stay indoors.</p>
              <div className="hn-flag-visual" role="img" aria-label="Air Quality Flag: green means play outside; red means stay indoors.">
                <span className="hn-flag-pole" aria-hidden="true" />
                <span className="hn-flag-cloth hn-flag-cloth-green" aria-hidden="true">GREEN</span>
                <span className="hn-flag-cloth hn-flag-cloth-red" aria-hidden="true">RED</span>
              </div>
              <div className="hn-flag-key">
                <span><i className="hn-flag-green" aria-hidden="true" />Green <small>Play outside</small></span>
                <span><i className="hn-flag-red" aria-hidden="true" />Red <small>Stay indoors</small></span>
              </div>
            </aside>
          </div>
          <a className="hn-scroll-cue" href="#facts">Scroll to explore <span aria-hidden="true">↓</span></a>
        </section>

        <section className="hn-facts" id="facts" aria-label="HumekaNeza research facts">
          <div className="hn-container hn-facts-grid">
            <article className="hn-fact">
              <strong>2×</strong>
              <h2>pollution at drop-off</h2>
              <p>Associated with the 2023 school air-quality study cited in the supplied design brief.</p>
            </article>
            <article className="hn-fact">
              <strong>30%</strong>
              <h2>less on car-free Sundays</h2>
              <p>Car-free day air-pollution finding; the supplied P3 project material cites <em>Frontiers in Future Transportation</em> (2026).</p>
            </article>
            <article className="hn-fact">
              <strong>401</strong>
              <h2>Kigali school readings compared with Ontario’s Highway 401</h2>
              <p>The comparison is named in the supplied design brief; its full study citation was not included.</p>
            </article>
          </div>
        </section>

        <section className="hn-section hn-about" id="about" aria-labelledby="hn-about-title">
          <div className="hn-container hn-about-grid">
            <div className="hn-section-heading">
              <span className="hn-eyebrow">About HumekaNeza</span>
              <h2 id="hn-about-title">A school-based idea, growing into shared action.</h2>
              <p>Founded in 2024 by Dr. Egide Kalisa, HumekaNeza began with air-quality education at Kigali Parents School and Dove International Montessori School. The work invites students to learn about air pollution, make observations and take part in practical responses.</p>
              <blockquote>“Just publishing a paper, that is not enough…”</blockquote>
              <p className="hn-quote-note">A guiding thought from the supplied HumekaNeza design reference.</p>
            </div>
            <div className="hn-about-collage" aria-label="HumekaNeza school learning photographs and illustrations">
              <img className="hn-collage-large" src="/images/humekaneza/about-classroom-activity.jpg" alt="An educator presents an air-quality lesson to students in a classroom." loading="lazy" decoding="async" />
              <img className="hn-collage-illustration" src="/images/humekaneza/about-school-traffic.jpg" alt="Illustration of traffic and a school building in an urban neighborhood." loading="lazy" decoding="async" />
              <img className="hn-collage-illustration" src="/images/humekaneza/program-cleaner-classrooms-illustration.jpg" alt="Illustration of children taking part in a classroom air-quality activity." loading="lazy" decoding="async" />
              <span className="hn-collage-caption">Learning · measuring · sharing</span>
            </div>
          </div>
        </section>

        <section className="hn-section hn-programs" id="what-we-do" aria-labelledby="hn-programs-title">
          <div className="hn-container">
            <div className="hn-section-heading hn-centered">
              <span className="hn-eyebrow">What we do</span>
              <h2 id="hn-programs-title">Small actions make air science part of the school day.</h2>
              <p>Activities connect learning, measurement and practical choices with the places children live and learn.</p>
            </div>
            <div className="hn-program-grid">
              {programs.map((program) => (
                <article className="hn-program-card" key={program.title}>
                  <img className={program.imageFit === 'contain' ? 'hn-image-contain' : undefined} src={program.image} alt={program.alt} loading="lazy" decoding="async" />
                  <div className="hn-program-copy">
                    <span className="hn-card-label">{program.label}</span>
                    <h3>{program.title}</h3>
                    <p>{program.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="hn-section hn-schools" id="in-schools" aria-labelledby="hn-schools-title">
          <div className="hn-container">
            <div className="hn-section-heading hn-schools-heading">
              <div><span className="hn-eyebrow">In schools</span><h2 id="hn-schools-title">Questions begin in the places children know.</h2></div>
              <p>School lessons and community activities make air-quality science visible through observation, monitoring and discussion.</p>
            </div>
            <div className="hn-school-mosaic">
              {schoolPhotos.map((photo, index) => (
                <figure className={`hn-school-tile hn-school-tile-${index + 1}`} key={photo.title}>
                  <img src={photo.image} alt={photo.alt} loading="lazy" decoding="async" />
                  <figcaption>{photo.title}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="hn-section hn-voices" aria-labelledby="hn-voices-title">
          <div className="hn-container hn-voices-grid">
            <div>
              <span className="hn-eyebrow">Students’ voice</span>
              <h2 id="hn-voices-title">“Enough is enough. No to air pollution!”</h2>
              <p>Young people share what they want adults and their communities to understand about clean air.</p>
              <ul className="hn-voice-notes">
                <li>“My mom idles less than your mom”</li>
                <li>“Dear Dad… stop polluting at my school”</li>
                <li>“I won't leave until my Dad buys me a sensor!”</li>
              </ul>
            </div>
            <div className="hn-poster-board" aria-label="Student-created environmental-health posters">
              <figure className="hn-poster hn-poster-one">
                <img src="/images/p3/projects/01-humekaneza-school-campaign/child-poster-enough-is-enough.jpg" alt="A student-created poster says “Enough is Enough” and calls attention to air pollution." loading="lazy" decoding="async" />
                <figcaption>Enough is enough</figcaption>
              </figure>
              <figure className="hn-poster hn-poster-two">
                <img src="/images/humekaneza/students-environment-poster.jpg" alt="A student-created poster calls for action to protect the environment." loading="lazy" decoding="async" />
                <figcaption>Care for the places we share</figcaption>
              </figure>
              <figure className="hn-poster hn-poster-three">
                <img src="/images/humekaneza/student-pencil-portrait.jpg" alt="A student's pencil portrait drawing on a sheet of paper." loading="lazy" decoding="async" />
                <figcaption>A student’s drawing</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="hn-section hn-videos" id="videos" aria-labelledby="hn-videos-title">
          <div className="hn-container">
            <div className="hn-section-heading hn-centered">
              <span className="hn-eyebrow">Videos</span>
              <h2 id="hn-videos-title">See the story in young people’s own world.</h2>
            </div>
            <div className="hn-video-grid">
              {videos.map((video, index) => (
                <article className={`hn-video-card${index === 0 ? ' hn-video-featured' : ''}`} key={video.id}>
                  <div className="hn-video-frame">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${video.id}`}
                      title={video.title}
                      loading="lazy"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                  <div className="hn-video-copy">
                    <span className="hn-card-label">{video.organisation}</span>
                    <h3>{video.title}</h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="hn-section hn-journey" id="journey" aria-labelledby="hn-journey-title">
          <div className="hn-container">
            <div className="hn-section-heading hn-centered">
              <span className="hn-eyebrow">Our journey</span>
              <h2 id="hn-journey-title">Evidence to a wider vision.</h2>
              <p className="hn-vision">Green, healthy schools across Africa and Canada</p>
            </div>
            <ol className="hn-timeline">
              <li><span className="hn-timeline-year">2023</span><strong>Evidence</strong><p>School air-quality research helps frame the need for learning and action.</p></li>
              <li><span className="hn-timeline-year">2024</span><strong>Launch</strong><p>HumekaNeza begins its school-based work in Kigali.</p></li>
              <li className="hn-timeline-next"><span className="hn-timeline-year">Next</span><strong>Clean classrooms</strong><p>A future goal in the supplied design brief.</p></li>
              <li className="hn-timeline-next"><span className="hn-timeline-year">Next</span><strong>Electric school buses</strong><p>A future goal in the supplied design brief.</p></li>
            </ol>
            <div className="hn-initiatives" aria-label="Related initiatives">
              <article>
                <img src="/images/design-reference/sensors-kids.jpg" alt="Students learn with air-quality monitoring equipment." loading="lazy" decoding="async" />
                <span>01</span><strong>One Sensor per School</strong>
              </article>
              <article>
                <img src="/images/design-reference/green-street.jpg" alt="Illustration of a greener school street." loading="lazy" decoding="async" />
                <span>02</span><strong>One Tree per Child</strong>
              </article>
              <article>
                <img src="/images/humeka-app-phone-illustration.webp" alt="Illustration of the Humeka air-quality app on a phone." loading="lazy" decoding="async" />
                <span>03</span><strong>HUMEKA app</strong><small>In development</small>
              </article>
            </div>
          </div>
        </section>

        <section className="hn-section hn-news" id="news" aria-labelledby="hn-news-title">
          <div className="hn-container">
            <div className="hn-section-heading">
              <span className="hn-eyebrow">In the news</span>
              <h2 id="hn-news-title">Stories from schools and communities.</h2>
            </div>
            <div className="hn-news-grid">
              <a href="https://magazine.westernu.ca/healing-rwanda/" target="_blank" rel="noopener noreferrer">
                <span className="hn-card-label">Western Alumni Magazine · Fall 2024</span>
                <h3>Healing Rwanda</h3>
                <span className="hn-news-link">Read the story <ArrowUpRight size={15} aria-hidden="true" /></span>
              </a>
              <a href="https://en.igihe.com/news/article/empowering-rwandan-schools-with-air-quality-education-and-action" target="_blank" rel="noopener noreferrer">
                <span className="hn-card-label">IGIHE · 30 March 2024</span>
                <h3>Empowering Rwandan schools with air quality education and action</h3>
                <span className="hn-news-link">Read the story <ArrowUpRight size={15} aria-hidden="true" /></span>
              </a>
              <a href="https://www.youtube.com/watch?v=J6brEhfvNbY" target="_blank" rel="noopener noreferrer">
                <span className="hn-card-label">Western University · The Impact Project</span>
                <h3>How children in Rwanda advocate for better air quality</h3>
                <span className="hn-news-link">Watch the video <ArrowUpRight size={15} aria-hidden="true" /></span>
              </a>
            </div>
          </div>
        </section>

        <section className="hn-get-involved" id="get-involved" aria-labelledby="hn-get-involved-title">
          <div className="hn-container">
            <div className="hn-involved-heading">
              <div><span className="hn-eyebrow">Get involved</span><h2 id="hn-get-involved-title">There is a place for you in the conversation.</h2></div>
              <p>HumekaNeza welcomes connections with people who support healthier schools and communities.</p>
            </div>
            <ul className="hn-audiences">
              <li>Schools</li>
              <li>Parents</li>
              <li>Partners and funders</li>
              <li>Students and researchers</li>
            </ul>
            <div className="hn-involved-actions">
              <Link className="hn-button hn-button-light" href="/contact">Contact the team <ArrowUpRight size={15} aria-hidden="true" /></Link>
              <Link className="hn-button hn-button-outline" href="/projects">See related research projects <ArrowUpRight size={15} aria-hidden="true" /></Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="hn-footer">
        <div className="hn-container hn-footer-grid">
          <div className="hn-footer-brand">
            <img src="/images/design-reference/logo-humekaneza.png" alt="" width="88" height="88" loading="lazy" decoding="async" />
            <div><strong>HumekaNeza</strong><span>Founded 2024 by Dr. Egide Kalisa.</span></div>
          </div>
          <nav aria-label="P3 Health Lab links">
            <Link href="/">P3 Health Lab</Link>
            <Link href="/research">Research</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/news">News</Link>
          </nav>
          <p>A P3 Health Lab initiative · Western University</p>
        </div>
      </footer>
    </div>
  );
}
