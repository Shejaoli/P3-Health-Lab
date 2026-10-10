import './_group.css';
import { ArrowUpRight, ExternalLink } from 'lucide-react';

const approach = [
  ['01', 'Learn', 'Explore air pollution, environmental exposures and health through workshops, demonstrations and school-based learning.'],
  ['02', 'Measure', 'Use low-cost sensors and other monitoring tools to notice how air quality changes around school and community.'],
  ['03', 'Understand', 'Make sense of observations together: what might shape the air, what the information can tell us, and what it cannot.'],
  ['04', 'Act', 'Turn learning into practical steps—from reducing idling to sharing clear messages with families and school communities.'],
];

const activities = [
  ['Try the air-quality flag', 'Connect air-quality information with classroom conversations and daily decisions.'],
  ['Become a young air scientist', 'Ask questions, use monitors and explore what measurements reveal about the places we learn.'],
  ['Make the invisible visible', 'Create posters, presentations and other ways to share environmental-health knowledge.'],
  ['Talk with family and community', 'Bring learning beyond the classroom through discussion, communication and shared ideas.'],
  ['Explore a cleaner school day', 'Consider idling, school routes, classroom air and outdoor activities as part of healthier environments.'],
];

const initiatives = [
  ['A school-based beginning', 'Rwanda school air-quality campaign', 'School-based air-quality education, low-cost monitoring, air-quality flag activities and student-led environmental monitoring.', '/projects#school-air-quality-campaign'],
  ['Youth knowledge & participation', 'Making the Invisible Visible', 'Youth ambassador learning, behaviour-change workshops, family dialogue and youth-created knowledge-translation products.', '/projects#making-the-invisible-visible'],
  ['Learning across communities', 'SHARED SKIES / Global Classroom', 'Students compare air-quality information from their communities and share findings through virtual exchanges and presentations.', '/projects#shared-skies'],
  ['Evidence into everyday practice', 'Monitoring & behaviour-change work', 'Low-cost monitoring, student-led environmental learning and practical classroom and school-zone approaches.', '/projects#classroom-clean-air-interventions'],
];

export function Current() {
  return <main className="humeka-page">
    <section className="humeka-masthead" aria-labelledby="current-humeka-title">
      <div className="container-wide humeka-masthead-inner">
        <div className="humeka-masthead-copy">
          <div className="humeka-brandline"><img src="/__mockup/images/humekaneza-mark.jpg" alt="" /><span className="eyebrow">P3 Health Lab · Western University</span></div>
          <h1 id="current-humeka-title">HumekaNeza<small>Breathe Easy</small></h1>
          <p className="humeka-tagline">Empowering schools and communities through air-quality citizen science.</p>
          <div className="humeka-hero-credits"><span>Child- and youth-centred environmental health</span><span>Led by Dr. Egide Kalisa</span></div>
          <a className="humeka-hero-link" href="#current-approach">Explore the approach <ArrowUpRight size={16} /></a>
        </div>
        <figure className="humeka-hero-photo">
          <img src="/__mockup/images/home-classroom-fieldwork.jpg" alt="A school workshop in a bright brick classroom, with a facilitator speaking to students gathered around desks." />
          <figcaption><span>Learning together, in a real school setting</span><span>HumekaNeza · Rwanda</span></figcaption>
        </figure>
      </div>
    </section>
    <section className="humeka-intro section">
      <div className="container-wide humeka-intro-grid">
        <div><span className="eyebrow">A little about us</span><h2>Start with a question.<br /><em>Find a way forward.</em></h2></div>
        <div className="humeka-prose">
          <p>HumekaNeza is a child- and youth-centred environmental-health initiative founded by Dr. Egide Kalisa and led through P3 Health Lab at Western University. It began with school-based air-quality education in Rwanda, empowering children to understand air pollution and take part in solutions.</p>
          <p>Today, the work connects schools and communities to environmental-health learning, citizen science, research and practical action. Young people investigate their surroundings, make sense of what they learn, and share ideas that can support healthier schools, homes and communities.</p>
        </div>
      </div>
    </section>
    <section className="humeka-community section">
      <div className="container-wide">
        <div className="humeka-section-heading"><span className="eyebrow">Schools &amp; communities</span><h2>Air-quality questions live in everyday places.</h2><p>Classrooms, streets and shared spaces are where people learn about the air around them—and where practical questions begin.</p></div>
        <div className="humeka-community-gallery">
          <figure className="humeka-community-photo"><img src="/__mockup/images/research-air-monitoring.jpg" alt="Air-quality monitoring equipment beside a tree-lined road." /><figcaption><strong>Monitoring shared environments</strong><span>Field equipment in an outdoor setting</span></figcaption></figure>
          <figure className="humeka-community-photo"><img src="/__mockup/images/research-healthy-mobility.jpg" alt="A field researcher wearing an air-quality monitoring pack walks along a roadside in Rwanda as traffic passes." /><figcaption><strong>Learning from daily routes</strong><span>People, movement and the air around us</span></figcaption></figure>
        </div>
      </div>
    </section>
    <section className="humeka-process section" id="current-approach">
      <div className="container-wide">
        <div className="humeka-section-heading"><span className="eyebrow">The HumekaNeza learning loop</span><h2>From curiosity<br />to community action.</h2><p>Four connected steps make environmental-health science tangible—and put young people’s questions at the centre.</p></div>
        <ol className="humeka-process-list">{approach.map(([number, title, text]) => <li className="humeka-process-step" key={number}><span className="humeka-step-number">{number}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol>
      </div>
    </section>
    <section className="humeka-activities section">
      <div className="container-wide">
        <div className="humeka-section-heading"><span className="eyebrow">A school day, with fresh eyes</span><h2>Learning you can take<br />back to the classroom.</h2><p>Possible ways to take part across HumekaNeza’s connected work.</p></div>
        <div className="humeka-activity-layout"><ul className="humeka-activity-list">{activities.map(([title, text], index) => <li key={title}><span className="humeka-activity-index">0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ul></div>
      </div>
    </section>
    <section className="humeka-initiatives-section section">
      <div className="container-wide">
        <div className="humeka-section-heading"><span className="eyebrow">Connected initiatives</span><h2>Different places.<br /><em>Shared questions.</em></h2><p>Projects bring together school learning, youth knowledge, community participation and environmental-health research.</p></div>
        <div className="humeka-initiative-featured">
          <figure className="humeka-initiative-photo"><img src="/__mockup/images/research-children-exposure.jpg" alt="A researcher demonstrates air-quality monitoring equipment to children gathered around a table." /><figcaption><strong>Hands-on environmental-health learning</strong><br /><span>A P3 Health Lab school activity</span></figcaption></figure>
          <ul className="humeka-feature-grid">{initiatives.map(([label, title, text, href]) => <li className="humeka-feature-card" key={title}><span className="humeka-feature-label">{label}</span><h3>{title}</h3><p>{text}</p><a href={href}>Explore initiative <ArrowUpRight size={15} /></a></li>)}</ul>
        </div>
      </div>
    </section>
    <section className="humeka-evidence section">
      <div className="container-wide humeka-evidence-grid">
        <div className="humeka-section-heading"><span className="eyebrow">Learning in practice</span><h2>Research that stays close to real life.</h2><p>HumekaNeza connects questions from schools and communities with P3 Health Lab’s broader work in exposure science, children’s environmental health and citizen science.</p><a className="humeka-evidence-link" href="/research">Explore P3 research <ArrowUpRight size={15} /></a></div>
        <div className="humeka-evidence-notes"><article><span className="eyebrow">In schools</span><h3>Learning by observing and measuring</h3><p>The Rwanda campaign includes school-based education, low-cost monitoring, air-quality flag activities and student-led environmental monitoring.</p></article><article><span className="eyebrow">With young people</span><h3>Making knowledge shareable</h3><p>Making the Invisible Visible includes youth ambassador learning, behaviour-change workshops, family dialogue and youth-created knowledge-translation products.</p></article><nav className="humeka-proof-links"><a href="/publications">Publications <ArrowUpRight size={14} /></a><a href="/news">Lab news <ArrowUpRight size={14} /></a><a href="/projects#classroom-clean-air-interventions">Classroom research <ArrowUpRight size={14} /></a></nav></div>
      </div>
    </section>
    <section className="humeka-partners"><div className="container-wide humeka-partners-inner"><span className="eyebrow">Institutional affiliation</span><div className="humeka-affiliation-mark"><img src="/__mockup/images/p3-logo.png" alt="" /><strong>P3 Health Lab</strong></div><a className="humeka-western-mark" href="https://www.uwo.ca" target="_blank" rel="noreferrer">Western University <ExternalLink size={13} /></a><p>HumekaNeza is part of P3 Health Lab’s research, collaboration and community-engaged work.</p></div></section>
    <section className="humeka-contact section"><div className="container-wide humeka-contact-inner"><div><span className="eyebrow">Schools · families · collaborators</span><h2>Have a question<br />for HumekaNeza?</h2></div><div><p>We welcome conversations with teachers, students, families, community organizations, researchers and environmental-health partners.</p><div className="humeka-contact-actions"><a className="button-primary" href="mailto:p3healthlab@uwo.ca">Email P3 Health Lab <ArrowUpRight size={15} /></a><a className="button-secondary" href="/contact">Contact page <ArrowUpRight size={15} /></a></div></div></div></section>
  </main>;
}
