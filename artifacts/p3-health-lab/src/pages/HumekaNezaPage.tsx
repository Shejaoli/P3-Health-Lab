import { useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Link } from 'wouter';
import './humeka-neza-page.css';

const programs: {
  title: string;
  label: string;
  text: string;
  image?: string;
  alt?: string;
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
    image: '/images/humekaneza/air-quality-flag-program.jpg',
    alt: 'Students hold an Air Quality Flag during an outdoor school activity.',
  },
  {
    title: 'Anti-idling at the gate',
    label: 'Act',
    text: 'School communities discuss how idling vehicles contribute to pollution around drop-off and pick-up.',
    image: '/images/humekaneza/anti-idling-at-the-gate.jpg',
    alt: 'Students speak with a driver at a school gate as part of an anti-idling activity.',
  },
  {
    title: 'One tree per student',
    label: 'Act · Protect',
    text: 'Tree planting is part of the initiative’s vision for greener school environments.',
    image: '/images/humekaneza/one-tree-per-student.jpg',
    alt: 'Illustration of students planting trees in a school yard beside a busy road.',
  },
  {
    title: 'Cleaner classrooms',
    label: 'Measure · Protect',
    text: 'School-based learning connects indoor air, practical monitoring and cleaner classroom environments.',
    image: '/images/humekaneza/cleaner-classrooms.jpg',
    alt: 'Illustration of students learning in a classroom with an air-quality monitor.',
  },
  {
    title: 'Cleaner routes to school',
    label: 'Move · Act',
    text: 'Children explore how everyday routes and travel choices shape the air they breathe.',
    image: '/images/humekaneza/cleaner-routes-to-school.jpg',
    alt: 'Illustration of a child walking a road between home and school with air-quality monitors.',
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

type DetailedInitiative = {
  slug: string;
  title: string;
  subtitle?: string;
  location?: string;
  description: string;
  activities?: string[];
  focus?: string[];
  process?: string;
  closing?: string;
  images: { src: string; alt: string; fit?: 'contain' }[];
};

const detailedInitiatives: DetailedInitiative[] = [
  {
    slug: 'school-air-quality-campaign',
    title: 'HumekaNeza School Air-Quality Campaign',
    description: 'The original HumekaNeza campaign was launched in schools in Rwanda to improve children’s understanding of air pollution and empower them to participate in solutions.',
    activities: [
      'school-based air-quality education',
      'low-cost monitoring',
      'Air Quality Flag Programs',
      'anti-idling campaigns',
      'student-led environmental monitoring',
      'classroom air-cleaning activities',
      'cleaner route and outdoor-activity guidance',
      'tree planting and greener school environments',
      'creative communication through posters and letters to families',
    ],
    images: [],
  },
  {
    slug: 'i-am-an-air-quality-scientist',
    title: 'I Am an Air Quality Scientist',
    description: 'Students become citizen scientists by using air-quality monitors and other scientific tools to investigate pollution in their schools and communities. The initiative introduces children to environmental-health science while building scientific literacy, curiosity, confidence, and practical understanding of environmental data.',
    images: [],
  },
  {
    slug: 'one-sensor-per-school',
    title: 'One Sensor Per School',
    description: 'This initiative aims to make air pollution visible by placing low-cost air-quality sensors in participating schools. Students and teachers can observe how air pollution changes throughout the day and explore how traffic, weather, indoor activities, and other factors affect the air they breathe.',
    images: [
      { src: '/images/p3/projects/03-one-sensor-per-school/school-courtyard-sensor-trees.jpg', alt: 'Air-quality monitoring equipment installed in a tree-lined school courtyard.' },
    ],
  },
  {
    slug: 'classroom-clean-air-interventions',
    title: 'Classroom Clean-Air Interventions',
    description: 'HumekaNeza supports research evaluating practical approaches to improve classroom air quality, including the use of portable air purifiers. These interventions examine changes in indoor air pollution and explore potential effects on student health, learning, comfort, attendance, and academic performance.',
    images: [
      { src: '/images/p3/projects/04-classroom-clean-air/classroom-air-purifier-diagram.jpg', alt: 'Diagram showing an air purifier cleaning air in a classroom.' },
      { src: '/images/p3/projects/04-classroom-clean-air/green-classroom-illustration.jpg', alt: 'Illustration of a greener, more sustainable classroom.' },
    ],
  },

  {
    slug: 'clean-air-school-zones',
    title: 'Clean Air School Zones',
    description: 'This initiative focuses on reducing traffic-related air pollution around schools.',
    activities: ['anti-idling campaigns', 'safer school travel', 'awareness around drop-off and pick-up emissions', 'low-emission school zones', 'engagement with parents and school communities'],
    images: [
      { src: '/images/p3/projects/05-clean-air-school-zones/school-zone-traffic-sensors.jpg', alt: 'Air-quality sensors monitor traffic near a school zone.' },
      { src: '/images/p3/projects/05-clean-air-school-zones/children-walking-to-school-guide.jpg', alt: 'Illustrated guide to children walking to school by a cleaner route.', fit: 'contain' },
      { src: '/images/p3/projects/05-clean-air-school-zones/school-bus-drop-off.jpg', alt: 'School bus drop-off area near a school.' },
      { src: '/images/p3/projects/05-clean-air-school-zones/ebus-vs-diesel-school-bus.jpg', alt: 'Illustration comparing an electric school bus with a diesel bus.', fit: 'contain' },
    ],
  },
  {
    slug: 'shared-skies',
    title: 'Shared Skies',
    description: 'Shared Skies connects students across countries through environmental-health education and citizen science. Students collect and compare air-quality information from their communities and share findings through virtual exchanges, presentations, and Global Classroom activities. The initiative helps children recognize that air pollution is both a local and global challenge.',
    images: [{ src: '/images/p3/projects/06-shared-skies/canada-rwanda-global-classroom.png', alt: 'Graphic connecting a Canada–Rwanda classroom exchange.', fit: 'contain' }],
  },
  {
    slug: 'making-the-invisible-visible',
    title: 'Making the Invisible Visible',
    subtitle: "Engaging African, Caribbean and Black Children and Youth in Canada's Chemicals Management Plan",
    description: "Making the Invisible Visible strengthens the knowledge, capacity, and meaningful participation of African, Caribbean and Black children and youth in understanding chemicals, health, and Canada's Chemicals Management Plan.",
    activities: ['ACB Youth CMP Advisory and Knowledge Translation Council', 'Youth CMP Knowledge Ambassador training', 'behaviour-change workshops', '"I Am a CMP Scientist" activities', 'From Sample to Decision learning experiences', 'family and community dialogue', 'Global Classroom activities', 'youth-created knowledge-translation products', 'Ontario Youth CMP Conference'],
    process: 'LISTEN → LEARN → SEE → TRANSLATE → SHARE → ACT → FEEDBACK',
    images: [{ src: '/images/p3/projects/07-making-the-invisible-visible/school-interventions-circle.png', alt: 'Illustrated overview of school-based air-quality interventions.', fit: 'contain' }],
  },
  {
    slug: 'equitable-air-quality-communication',
    title: 'Equitable Air-Quality Communication & Preparedness',
    subtitle: 'Supporting Black Youth and Families in Hamilton and London',
    location: 'Hamilton and London',
    description: 'This community-engaged initiative works with Black youth, families, and community partners to understand how people experience, access, interpret, trust, and act on air-quality information.',
    focus: ['lived experiences of poor air quality and wildfire smoke', 'access to and understanding of AQHI and wildfire-smoke messaging', 'trust in environmental-health information', 'environmental justice', 'social, cultural, and structural barriers to protective action', 'co-designed communication and preparedness strategies'],
    closing: 'The project centres community voices and aims to make air-quality information more relevant, accessible, trusted, and actionable.',
    images: [
      { src: '/images/p3/projects/08-equitable-air-quality-communication/children-walking-in-smoke.jpg', alt: 'Children walk along a road on a smoky day.' },
      { src: '/images/p3/projects/08-equitable-air-quality-communication/smoky-industry-illustration.jpg', alt: 'Illustration of industrial air pollution and exposure risks.', fit: 'contain' },
    ],
  },];

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
            <a href="#stories" onClick={closeMenu}>Stories</a>
          </nav>
          <a className="hn-nav-cta" href="#get-involved" onClick={closeMenu}>Get involved <ArrowUpRight size={15} aria-hidden="true" /></a>
        </div>
      </header>

      <main id="top">
        <section className="hn-hero" aria-labelledby="hn-title">
          <img
            className="hn-hero-image"
            src="/images/humekaneza/about-school-traffic.jpg"
            alt="Illustration of traffic and a school building in an urban neighborhood."
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
              <strong>Breathe more</strong>
              <h2>More air for their body size</h2>
              <p>Children breathe faster and take in more air per kilogram of body weight than adults.</p>
            </article>
            <article className="hn-fact">
              <strong>Still growing</strong>
              <h2>Developing lungs need protection</h2>
              <p>Children's lungs and immune systems are still developing, making them more vulnerable to air pollution.</p>
            </article>
            <article className="hn-fact">
              <strong>Health for life</strong>
              <h2>Cleaner air supports healthy futures</h2>
              <p>Early exposure to air pollution can affect lung growth and increase health risks later in life.</p>
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
            </div>
            <div className="hn-about-collage" aria-label="Illustrations of school environments and clean-air learning">
              <img className="hn-collage-large" src="/images/humekaneza/school-route-illustration.jpg" alt="Illustration of a school zone with lower-emission routes and cleaner transport." loading="lazy" decoding="async" />
              <img className="hn-collage-illustration" src="/images/p3/projects/06-shared-skies/canada-rwanda-global-classroom.png" alt="Graphic connecting a Canada–Rwanda classroom exchange." loading="lazy" decoding="async" />
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
                  {program.image && <img className={program.imageFit === 'contain' ? 'hn-image-contain' : undefined} src={program.image} alt={program.alt ?? ''} loading="lazy" decoding="async" />}
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
            <p>Student-identifiable photographs are withheld while their consent and permissions are confirmed. The programme descriptions and non-identifying illustrations remain available below.</p>
          </div>
        </section>

        <section id="detailed-initiatives" className="hn-section hn-detailed-initiatives" aria-labelledby="hn-detailed-initiatives-title">
          <div className="hn-container">
            <div className="hn-section-heading">
              <span className="hn-eyebrow">Detailed community and school initiatives</span>
              <h2 id="hn-detailed-initiatives-title">Learning, monitoring and action in schools.</h2>
            </div>
            <div className="hn-detailed-initiative-list">
              {detailedInitiatives.map((initiative) => <article id={initiative.slug} className="hn-detailed-initiative" key={initiative.slug}>
                <div><h3>{initiative.title}</h3>{initiative.subtitle && <p className="hn-initiative-subtitle">{initiative.subtitle}</p>}{initiative.location && <p className="hn-initiative-location">{initiative.location}</p>}<p>{initiative.description}</p>{initiative.activities && <ul>{initiative.activities.map((activity) => <li key={activity}>{activity}</li>)}</ul>}{initiative.focus && <><strong>Focus</strong><ul>{initiative.focus.map((item) => <li key={item}>{item}</li>)}</ul></>}{initiative.process && <p className="hn-initiative-process">{initiative.process}</p>}{initiative.closing && <p>{initiative.closing}</p>}</div>
                {initiative.images.length > 0 && <div className="hn-detailed-initiative-images">{initiative.images.map((image) => <img className={image.fit === 'contain' ? 'is-diagram' : undefined} src={image.src} alt={image.alt} loading="lazy" decoding="async" key={image.src} />)}</div>}
              </article>)}
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
            <div className="hn-initiatives" aria-label="Related initiatives">
              <article>
                <img src="/images/p3/research/program-2-children-schools/school-neighbourhood-traffic-illustration.jpg" alt="Illustration of traffic and exposure around a school neighbourhood." loading="lazy" decoding="async" />
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

        <section className="hn-section hn-news" id="stories" aria-labelledby="hn-news-title">
          <div className="hn-container">
            <div className="hn-section-heading">
              <span className="hn-eyebrow">In the press</span>
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
              <Link className="hn-button hn-button-outline" href="/research-project">See related research projects <ArrowUpRight size={15} aria-hidden="true" /></Link>
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
            <Link href="/research-project">Research Project</Link>
            <Link href="/research-map">Global Map</Link>
            <Link href="/opportunity">Opportunity</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <p>A P3 Health Lab initiative · Western University</p>
        </div>
      </footer>
    </div>
  );
}
