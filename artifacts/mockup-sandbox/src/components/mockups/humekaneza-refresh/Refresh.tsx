import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import './Refresh.css';

const approach = [
  {
    number: '01',
    title: 'Learn',
    text: 'Explore air pollution, environmental exposures and health through workshops and school-based learning.',
  },
  {
    number: '02',
    title: 'Measure',
    text: 'Use low-cost sensors and monitoring tools to notice how air quality changes around school and community.',
  },
  {
    number: '03',
    title: 'Understand',
    text: 'Make sense of observations together—and be clear about what the information can and cannot tell us.',
  },
  {
    number: '04',
    title: 'Act',
    text: 'Turn learning into practical steps and useful conversations with families and school communities.',
  },
];

const activities = [
  ['Try the air-quality flag', 'Connect air-quality information with classroom conversations and daily decisions.'],
  ['Become a young air scientist', 'Ask questions, use monitors and explore what measurements reveal about places we learn.'],
  ['Make the invisible visible', 'Create posters, presentations and other ways to share environmental-health knowledge.'],
  ['Talk with family and community', 'Bring learning beyond the classroom through discussion and shared ideas.'],
  ['Explore a cleaner school day', 'Consider idling, school routes, classroom air and outdoor activities.'],
];

const initiatives = [
  {
    label: 'A school-based beginning',
    title: 'Rwanda school air-quality campaign',
    text: 'School-based air-quality education, low-cost monitoring, air-quality flag activities and student-led environmental monitoring.',
    href: '/projects#school-air-quality-campaign',
  },
  {
    label: 'Youth knowledge & participation',
    title: 'Making the Invisible Visible',
    text: 'Youth ambassador learning, behaviour-change workshops, family dialogue and youth-created knowledge-translation products.',
    href: '/projects#making-the-invisible-visible',
  },
  {
    label: 'Learning across communities',
    title: 'SHARED SKIES / Global Classroom',
    text: 'Students compare air-quality information from their communities and share findings through virtual exchanges and presentations.',
    href: '/projects#shared-skies',
  },
  {
    label: 'Evidence into everyday practice',
    title: 'School monitoring',
    text: 'Low-cost monitoring and student-led environmental learning help bring attention to the air around school.',
    href: '/projects#one-sensor-per-school',
  },
  {
    label: 'Learning that travels',
    title: 'Behaviour-change learning',
    text: 'Workshops, family conversations and youth-created materials make environmental-health knowledge easier to share.',
    href: '/projects#making-the-invisible-visible',
  },
];

export function Refresh() {
  return (
    <main className="hn-refresh">
      <section className="hn-hero" aria-labelledby="hn-title">
        <div className="hn-wrap hn-hero-layout">
          <div className="hn-hero-copy">
            <div className="hn-identity">
              <img src="/__mockup/images/humekaneza-mark.jpg" alt="" />
              <span>Led through P3 Health Lab · Western University</span>
            </div>
            <p className="hn-kicker">Child- and youth-centred environmental health</p>
            <h1 id="hn-title">Humeka<span>Neza</span></h1>
            <p className="hn-breathe">Breathe easy.</p>
            <p className="hn-hero-sentence">
              Young people learning about the air around them—and finding ways to make it better.
            </p>
            <p className="hn-founder">Founded by Dr. Egide Kalisa</p>
            <a className="hn-text-link" href="#hn-approach">
              Meet the learning loop <ArrowDownRight size={17} aria-hidden="true" />
            </a>
          </div>
          <figure className="hn-hero-image">
            <img
              src="/__mockup/images/home-classroom-fieldwork.jpg"
              alt="A facilitator leads a school workshop in a bright brick classroom as students gather around desks."
              fetchPriority="high"
            />
            <figcaption>
              <span>Learning together, in a real school setting</span>
              <span>Rwanda · HumekaNeza</span>
            </figcaption>
          </figure>
          <span className="hn-hero-side-note" aria-hidden="true">People / Planet / Place</span>
        </div>
      </section>

      <section className="hn-intro hn-section" aria-labelledby="hn-intro-title">
        <div className="hn-wrap hn-intro-layout">
          <div className="hn-intro-heading">
            <span className="hn-kicker">A little about us</span>
            <h2 id="hn-intro-title">Start with a question.<br /><em>Find a way forward.</em></h2>
          </div>
          <div className="hn-prose">
            <p>
              HumekaNeza is a child- and youth-centred environmental-health initiative founded by
              Dr. Egide Kalisa and led through P3 Health Lab at Western University. It began with
              school-based air-quality education in Rwanda.
            </p>
            <p>
              Today, the work connects schools and communities with environmental-health learning,
              citizen science, research and practical action. Young people investigate their
              surroundings, make sense of what they learn and share ideas with the people around them.
            </p>
          </div>
        </div>
      </section>

      <section className="hn-field" aria-labelledby="hn-field-title">
        <div className="hn-wrap">
          <div className="hn-field-heading">
            <div>
              <span className="hn-kicker">Schools &amp; communities</span>
              <h2 id="hn-field-title">Air-quality questions live<br />in everyday places.</h2>
            </div>
            <p>Classrooms, streets and shared spaces are where people learn about the air around them—and where practical questions begin.</p>
          </div>
          <div className="hn-field-gallery">
            <figure className="hn-field-photo hn-field-photo-wide">
              <img
                src="/__mockup/images/research-children-exposure.jpg"
                alt="A researcher demonstrates air-quality monitoring equipment to children gathered around a table."
                loading="lazy"
                decoding="async"
              />
              <figcaption><strong>Hands-on learning</strong><span>Environmental health, explored together</span></figcaption>
            </figure>
            <figure className="hn-field-photo hn-field-photo-small">
              <img
                src="/__mockup/images/research-air-monitoring.jpg"
                alt="Air-quality monitoring equipment set up outdoors beside a tree-lined road."
                loading="lazy"
                decoding="async"
              />
              <figcaption><strong>Monitoring shared environments</strong><span>Tools for asking better questions</span></figcaption>
            </figure>
            <figure className="hn-field-photo hn-field-photo-route">
              <img
                src="/__mockup/images/research-healthy-mobility.jpg"
                alt="A field researcher wearing an air-quality monitoring pack walks along a roadside in Rwanda as traffic passes."
                loading="lazy"
                decoding="async"
              />
              <figcaption><strong>Learning from daily routes</strong><span>People, movement and the air around us</span></figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="hn-process hn-section" id="hn-approach" aria-labelledby="hn-process-title">
        <div className="hn-wrap">
          <div className="hn-process-intro">
            <span className="hn-kicker">The HumekaNeza learning loop</span>
            <h2 id="hn-process-title">From curiosity<br />to community action.</h2>
            <p>Four connected steps make environmental-health science tangible—and put young people’s questions at the centre.</p>
          </div>
          <ol className="hn-process-list">
            {approach.map((step) => (
              <li className="hn-process-step" key={step.number}>
                <span className="hn-step-number">{step.number}</span>
                <div><h3>{step.title}</h3><p>{step.text}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="hn-activities hn-section" aria-labelledby="hn-activities-title">
        <div className="hn-wrap hn-activities-layout">
          <div className="hn-activities-intro">
            <span className="hn-kicker">A school day, with fresh eyes</span>
            <h2 id="hn-activities-title">Small ways to<br />start noticing.</h2>
            <p>Possible activities across HumekaNeza’s connected school and community work.</p>
            <img
              src="/__mockup/images/research-citizen-science.jpg"
              alt="Community members take part in a citizen-science activity."
              loading="lazy"
              decoding="async"
            />
            <span className="hn-image-note">Questions first. Then observation.</span>
          </div>
          <ol className="hn-activity-list">
            {activities.map(([title, text], index) => (
              <li key={title}>
                <span className="hn-activity-index">0{index + 1}</span>
                <div><h3>{title}</h3><p>{text}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="hn-work hn-section" aria-labelledby="hn-work-title">
        <div className="hn-wrap">
          <div className="hn-work-heading">
            <div>
              <span className="hn-kicker">Connected initiatives</span>
              <h2 id="hn-work-title">Different places.<br /><em>Shared questions.</em></h2>
            </div>
            <p>From school-based air-quality learning to youth-created knowledge, these projects bring environmental-health research closer to everyday life.</p>
          </div>
          <div className="hn-work-content">
            <figure className="hn-work-image">
              <img
                src="/__mockup/images/research-citizen-science.jpg"
                alt="Participants engaging in a community citizen-science activity."
                loading="lazy"
                decoding="async"
              />
              <figcaption><span>Fieldwork is a conversation</span><span>Observe · discuss · share</span></figcaption>
            </figure>
            <ol className="hn-work-list">
              {initiatives.map((item, index) => (
                <li key={`${item.title}-${index}`}>
                  <span className="hn-work-index">0{index + 1}</span>
                  <div className="hn-work-copy">
                    <span className="hn-work-label">{item.label}</span>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                  <a href={item.href} aria-label={`Explore ${item.title}`}>
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="hn-evidence hn-section" aria-labelledby="hn-evidence-title">
        <div className="hn-wrap hn-evidence-layout">
          <div className="hn-evidence-lead">
            <span className="hn-kicker">Learning in practice</span>
            <h2 id="hn-evidence-title">Research that stays close to real life.</h2>
            <p>HumekaNeza connects questions from schools and communities with P3 Health Lab’s broader work in exposure science, children’s environmental health and citizen science.</p>
            <a className="hn-text-link" href="/research">
              Explore P3 research <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
          <div className="hn-evidence-notes">
            <article>
              <span className="hn-kicker">In schools</span>
              <h3>Observe, measure, ask again.</h3>
              <p>The Rwanda campaign includes school-based education, low-cost monitoring, air-quality flag activities and student-led environmental monitoring.</p>
            </article>
            <article>
              <span className="hn-kicker">With young people</span>
              <h3>Make knowledge shareable.</h3>
              <p>Making the Invisible Visible includes youth ambassador learning, behaviour-change workshops, family dialogue and youth-created knowledge-translation products.</p>
            </article>
            <nav className="hn-proof-links" aria-label="Explore related research and updates">
              <a href="/publications">Publications <ArrowUpRight size={14} aria-hidden="true" /></a>
              <a href="/news">Lab news <ArrowUpRight size={14} aria-hidden="true" /></a>
              <a href="/projects#classroom-clean-air-interventions">Classroom research <ArrowUpRight size={14} aria-hidden="true" /></a>
            </nav>
          </div>
        </div>
      </section>

      <section className="hn-affiliations" aria-label="Institutional affiliations">
        <div className="hn-wrap hn-affiliation-row">
          <span className="hn-kicker">Led through</span>
          <strong className="hn-p3"><img src="/__mockup/images/p3-logo.png" alt="" />P3 <span>Health Lab</span></strong>
          <span className="hn-affiliation-divider" aria-hidden="true" />
          <a href="https://www.uwo.ca" target="_blank" rel="noopener noreferrer">
            Western University <ArrowUpRight size={14} aria-hidden="true" />
          </a>
          <p>Research, collaboration and community-engaged work.</p>
        </div>
      </section>

      <section className="hn-contact hn-section" id="get-involved" aria-labelledby="hn-contact-title">
        <div className="hn-wrap hn-contact-layout">
          <div>
            <span className="hn-kicker">Schools · families · collaborators</span>
            <h2 id="hn-contact-title">Have a question<br />for HumekaNeza?</h2>
          </div>
          <div className="hn-contact-copy">
            <p>We welcome conversations with teachers, students, families, community organizations, researchers and environmental-health partners.</p>
            <a className="hn-contact-button" href="mailto:p3healthlab@uwo.ca">
              Email P3 Health Lab <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <a className="hn-contact-secondary" href="/contact">Or visit the contact page <ArrowUpRight size={14} aria-hidden="true" /></a>
          </div>
        </div>
      </section>
    </main>
  );
}
