import { useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Link } from 'wouter';
import './humeka-neza-page.css';

const programs = [
  {
    title: 'Hands-on air science',
    label: 'Learn · Measure',
    text: 'Students use monitors and experiments to ask questions about the air around their school.',
    image: '/images/p3/projects/02-i-am-an-air-quality-scientist/students-measuring-experiment.jpg',
    alt: 'Students take part in an air-quality science experiment.',
  },
  {
    title: 'Air Quality Flag Program',
    label: 'Learn · Protect',
    text: 'The green and red flag activity helps schools connect air-quality information with outdoor play decisions.',
    image: '/images/design-reference/hn-hero.jpg',
    alt: 'A school air-quality workshop with an Air Quality Flag poster visible.',
  },
  {
    title: 'Anti-idling at the gate',
    label: 'Act',
    text: 'School communities discuss how idling vehicles contribute to pollution around drop-off and pick-up.',
    image: '/images/design-reference/dropoff.jpg',
    alt: 'Illustration of traffic and school buses around a school drop-off area.',
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
    image: '/images/p3/projects/05-clean-air-school-zones/children-walking-to-school-guide.jpg',
    alt: 'Illustration of children walking to school along a route away from traffic.',
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
    image: null,
    requiredAsset: 'hn-outdoor2.jpg',
  },
  {
    title: 'Sensor demonstration',
    image: '/images/research-citizen-science.jpg',
    alt: 'A researcher demonstrates air-quality monitoring equipment during a learning activity.',
  },
  {
    title: 'Anti-idling day',
    image: null,
    requiredAsset: 'hn-idling1.jpg',
  },
  {
    title: 'School workshop',
    image: '/images/design-reference/workshop.jpg',
    alt: 'Students take part in a HumekaNeza workshop in a Kigali classroom.',
  },
  {
    title: 'Checking air-quality readings',
    image: '/images/design-reference/field-calibrate.jpg',
    alt: 'A researcher checks readings on air-quality monitoring instruments.',
  },
];

function MissingPhoto({ asset, title }: { asset: string; title: string }) {
  return (
    <div className="hn-photo-missing" role="img" aria-label={`${title} photograph not supplied`}>
      <span className="hn-missing-mark" aria-hidden="true">+</span>
      <strong>{title}</strong>
      <code>Photo needed: {asset}</code>
    </div>
  );
}

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
            alt="Dr. Egide Kalisa leads an air-quality learning activity with students in a Kigali classroom."
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
            <div className="hn-about-collage" aria-label="HumekaNeza school learning photographs">
              <img className="hn-collage-large" src="/images/design-reference/hn-hero.jpg" alt="Students participate in an air-quality lesson in a Kigali classroom." loading="lazy" decoding="async" />
              <img src="/images/design-reference/workshop.jpg" alt="Students and educators gather for a school air-quality workshop." loading="lazy" decoding="async" />
              <img src="/images/research-citizen-science.jpg" alt="A researcher demonstrates air-quality monitoring equipment to a group." loading="lazy" decoding="async" />
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
                  <img src={program.image} alt={program.alt} loading="lazy" decoding="async" />
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
                  {photo.image
                    ? <img src={photo.image} alt={photo.alt} loading="lazy" decoding="async" />
                    : <MissingPhoto asset={photo.requiredAsset!} title={photo.title} />}
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
                <img src="/images/p3/projects/01-humekaneza-school-campaign/child-poster-stop-cutting-trees.jpg" alt="A student-created poster encourages people to stop cutting trees." loading="lazy" decoding="async" />
                <figcaption>Care for the places we share</figcaption>
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
              <article><span>01</span><strong>One Sensor per School</strong></article>
              <article><span>02</span><strong>One Tree per Child</strong></article>
              <article><span>03</span><strong>HUMEKA app</strong><small>In development</small></article>
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
