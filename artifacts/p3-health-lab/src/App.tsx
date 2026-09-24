import { type ReactNode, useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowUpRight, ChevronRight, Check, CircleArrowUp, ExternalLink, X } from 'lucide-react';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import logo from '@assets/p3_logo_1789065448410.png';

const queryClient = new QueryClient();

function useScrollReveal(routeKey: string) {
  useEffect(() => {
    document.documentElement.classList.add('motion-ready');
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [routeKey]);
}

const researchAreas = [
  { title: 'Air pollution & exposure science', text: 'Tracing what we breathe across homes, schools, workplaces, and the streets between them.', meta: 'Exposure · Measurement' },
  { title: 'Environmental microbiology & AMR', text: 'Understanding how microorganisms and antimicrobial resistance move through shared environments.', meta: 'One Health · Microbiology' },
  { title: 'Climate, wildfires & extreme heat', text: 'Building practical evidence for health in a changing climate, from smoke days to hot nights.', meta: 'Climate health · Resilience' },
  { title: 'Children’s environmental health', text: 'Making everyday places safer for children during the years that shape a lifetime of health.', meta: 'Early life · Equity' },
  { title: 'Clinical trials & interventions', text: 'Designing and testing interventions that can work beyond a research setting.', meta: 'Implementation · Care' },
  { title: 'Global health & sustainable cities', text: 'Learning with communities to make urban health solutions locally useful and globally relevant.', meta: 'Cities · Collaboration' },
];

const researchTopics = [
  { id: 'air-pollution', title: 'Air Pollution & Exposure Science', text: 'Measuring air pollution and other environmental exposures across the places where people live, learn, work, and move.', meta: 'Exposure · Measurement' },
  { id: 'climate', title: 'Climate Change, Wildfires & Heat', text: 'Examining how climate change, wildfire smoke, and extreme heat shape environmental health and preparedness.', meta: 'Climate health · Resilience' },
  { id: 'children', title: 'Children’s Environmental Health', text: 'Studying environmental conditions in the everyday settings that support children’s health and development.', meta: 'Early life · Equity' },
  { id: 'environmental-justice', title: 'Environmental Justice', text: 'Attending to how environmental risks, protections, and the ability to shape decisions are distributed across communities.', meta: 'Equity · Place' },
  { id: 'one-health', title: 'One Health, Bioaerosols & AMR', text: 'Connecting human, animal, and environmental health through bioaerosols and antimicrobial resistance.', meta: 'One Health · Microbiology' },
  { id: 'sustainable-transport', title: 'Sustainable Transport & Cities', text: 'Exploring how transport systems and urban form influence environmental exposures and health.', meta: 'Cities · Mobility' },
];

const projectInitiatives = [
  { title: 'HumekaNeza School Air-Quality Campaign', meta: 'HumekaNeza · School environments', text: 'A named initiative in the lab’s community air-quality work.', href: '/humekaneza' },
  { title: 'I Am an Air Quality Scientist', meta: 'HumekaNeza · Learning', text: 'A named initiative connecting air-quality questions with learning.', href: null },
  { title: 'One Sensor Per School', meta: 'HumekaNeza · Measurement', text: 'A named initiative centred on school-based air-quality measurement.', href: null },
  { title: 'Classroom Clean-Air Interventions', meta: 'HumekaNeza · Interventions', text: 'A named initiative focused on clean-air interventions in classrooms.', href: null },
  { title: 'Clean Air School Zones', meta: 'HumekaNeza · School environments', text: 'A named initiative addressing clean-air considerations around schools.', href: null },
  { title: 'Shared Skies', meta: 'HumekaNeza · Community', text: 'A named initiative in the lab’s shared-air and community work.', href: null },
  { title: 'Making the Invisible Visible', meta: 'HumekaNeza · Communication', text: 'A named initiative about making environmental-health questions easier to see and discuss.', href: null },
  { title: 'Equitable Air-Quality Communication & Preparedness', meta: 'HumekaNeza · Preparedness', text: 'A named initiative focused on equitable air-quality communication and preparedness.', href: null },
];

const homeFocuses = [
  { label: 'Environmental exposures', text: 'Air pollution, household energy use, and environmental contaminants in the places people live, learn, work, and move.' },
  { label: 'Climate and changing places', text: 'Wildfire smoke, extreme heat, and changing urban environments understood through a health lens.' },
  { label: 'Children’s environmental health', text: 'Research that makes everyday environments safer and healthier during the years that shape a lifetime.' },
  { label: 'Intervention science', text: 'Evidence, community engagement, and practical design brought together to reduce risk and improve health.' },
];

const people = [
  { initials: 'EK', name: 'Dr. Egide Kalisa', role: 'Principal Investigator · Director', institution: 'Assistant Professor · Western University', text: 'Director, P3 Health Lab / HELTH Lab.' },
];

const peopleCategories = [
  ['postdoctoral', 'Postdoctoral Fellows'],
  ['phd', 'PhD Students'],
  ['masters', 'MSc Students'],
  ['undergraduate', 'Undergraduate Researchers'],
  ['visiting', 'Visiting Researchers & Students'],
  ['staff', 'Research Assistants & Staff'],
  ['alumni', 'Alumni'],
];

const courses = {
  '2026–2027': [
    { code: 'GHS 9100', title: 'Foundations of Global Health' },
    { code: 'GHS 9112', title: 'International Field School' },
  ],
  '2025–2026': [
    { code: 'GHS 9100', title: 'Foundations of Global Health' },
    { code: 'OH 3300A', title: 'Foundations in One Health' },
    { code: 'OH 3600', title: 'One Health in Action' },
    { code: 'GHS 9112', title: 'International Field School' },
    { code: 'MPH 9015', title: 'Issues in Global Health' },
  ],
  '2024–2025': [
    { code: 'GHS 9100', title: 'Foundations of Global Health' },
    { code: 'OH 3600', title: 'One Health in Action' },
  ],
} as const;

function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openMobileMenu, setOpenMobileMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const nav = [
    {
      label: 'Research',
      href: '/research',
      children: [
        ['Research overview', '/research'],
        ...researchTopics.map((topic) => [topic.title, `/research#${topic.id}`] as [string, string]),
      ],
    },
    { label: 'Projects', href: '/projects' },
    {
      label: 'People',
      href: '/people',
      children: [
        ['All people', '/people'],
        ['Postdoctoral fellows', '/people#postdoctoral'],
        ['PhD students', '/people#phd'],
        ['Master’s students', '/people#masters'],
        ['Undergraduate & research students', '/people#undergraduate'],
        ['Visiting international students & scholars', '/people#visiting'],
        ['Research assistants & staff', '/people#staff'],
        ['Alumni', '/people#alumni'],
      ],
    },
    { label: 'About', href: '/about' },
    { label: 'Publications', href: '/publications' },
    {
      label: 'Teaching',
      href: '/teaching',
      children: [
        ['Current courses', '/teaching'],
        ['2026–2027', '/teaching#2026-2027'],
        ['2025–2026', '/teaching#2025-2026'],
        ['2024–2025', '/teaching#2024-2025'],
      ],
    },
    {
      label: 'HumekaNeza',
      href: '/humekaneza',
      children: [
        ['Overview', '/humekaneza'],
        ['Learn', '/humekaneza#learn'],
        ['Measure', '/humekaneza#measure'],
        ['Communicate', '/humekaneza#communicate'],
        ['Act', '/humekaneza#act'],
        ['Initiatives', '/humekaneza#initiatives'],
        ['Partner with us', '/get-involved#partner'],
      ],
    },
    {
      label: 'Get Involved',
      href: '/get-involved',
      children: [
        ['Collaborate', '/get-involved'],
        ['Join the lab', '/people#join'],
        ['Students & trainees', '/people#trainees'],
        ['Community partnerships', '/humekaneza#partnerships'],
        ['Contact', '/get-involved#contact'],
      ],
    },
  ];
  const isActive = (href: string) => href === '/' ? location === '/' : location === href || location.startsWith(`${href}/`);
  useScrollReveal(location);
  useEffect(() => {
    setMenuOpen(false);
    setOpenMenu(null);
    setOpenMobileMenu(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = location === '/' ? 'P3 Health Lab · People, Planet, Place' : `P3 Health Lab · ${location.slice(1).replace('-', ' ')}`;
  }, [location]);
  useEffect(() => {
    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (favicon) {
      favicon.type = 'image/png';
      favicon.href = '/p3-logo.png';
    }
  }, []);
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenMenu(null);
        setOpenMobileMenu(null);
      }
    };
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) setOpenMenu(null);
    };
    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('mousedown', closeOnOutsideClick);
    };
  }, []);
  useEffect(() => {
    const openContact = () => setContactOpen(true);
    window.addEventListener('open-contact', openContact);
    return () => window.removeEventListener('open-contact', openContact);
  }, []);
  return (
    <div className="site-shell noise">
      <header className="site-header" ref={navRef}>
        <div className="container-wide header-inner">
          <Link href="/" className="brand" aria-label="P3 Health Lab home" data-testid="link-brand">
            <img src={logo} alt="" />
            <span className="brand-copy" aria-hidden="true"><span className="brand-p3">P3</span> <span className="brand-health">Health Lab</span></span>
          </Link>
          <nav className="nav" aria-label="Primary navigation">
            {nav.map((item) => item.children ? (
              <div className="nav-dropdown" key={item.href}>
                <button className={`nav-link nav-trigger ${isActive(item.href) ? 'active' : ''}`} aria-expanded={openMenu === item.label} onClick={() => setOpenMenu(openMenu === item.label ? null : item.label)} data-testid={`button-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}>
                  {item.label}<ChevronRight className={openMenu === item.label ? 'chevron-open' : ''} size={14} aria-hidden="true" />
                </button>
                {openMenu === item.label && <div className="dropdown-panel">
                  {item.children.map(([childLabel, childHref]) => <Link key={childHref} href={childHref} className="dropdown-link" onClick={() => setOpenMenu(null)}>{childLabel}</Link>)}
                </div>}
              </div>
            ) : <Link key={item.href} href={item.href} className={`nav-link ${isActive(item.href) ? 'active' : ''}`} data-testid={`link-nav-${item.label.toLowerCase()}`}>{item.label}</Link>)}
          </nav>
          <button className="header-cta" onClick={() => setContactOpen(true)} data-testid="button-header-collaborate">Collaborate</button>
          <button className={`menu-btn ${menuOpen ? 'is-open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} data-testid="button-mobile-menu">
            <span className="hamburger-icon" aria-hidden="true"><span /><span /><span /></span>
          </button>
        </div>
        {menuOpen && <nav className="mobile-menu" aria-label="Mobile navigation">
          {nav.map((item) => item.children ? (
            <div className="mobile-dropdown" key={item.href}>
              <button className={`mobile-link mobile-trigger ${isActive(item.href) ? 'active' : ''}`} aria-expanded={openMobileMenu === item.label} onClick={() => setOpenMobileMenu(openMobileMenu === item.label ? null : item.label)}>
                {item.label}<ChevronRight className={openMobileMenu === item.label ? 'chevron-open' : ''} size={16} aria-hidden="true" />
              </button>
              {openMobileMenu === item.label && <div className="mobile-submenu">
                {item.children.map(([childLabel, childHref]) => <Link key={childHref} href={childHref} className="mobile-sublink" data-testid={`link-mobile-${childLabel.toLowerCase().replaceAll(' ', '-')}`}>{childLabel}</Link>)}
              </div>}
            </div>
          ) : <Link key={item.href} href={item.href} className={`mobile-link ${isActive(item.href) ? 'active' : ''}`} data-testid={`link-mobile-${item.label.toLowerCase().replaceAll(' ', '-')}`}>{item.label}</Link>)}
          <button className="mobile-cta" onClick={() => setContactOpen(true)} data-testid="button-mobile-collaborate">Collaborate <ArrowUpRight size={14} aria-hidden="true" /></button>
        </nav>}
      </header>
      <main>{children}</main>
      <Footer onContact={() => setContactOpen(true)} />
      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
    </div>
  );
}

function Footer({ onContact }: { onContact: () => void }) {
  return <footer className="footer">
    <div className="container-wide">
      <div className="footer-grid">
        <div>
          <img className="footer-logo" src={logo} alt="P3 Health Lab" />
          <p>Research for healthier everyday places. Led by Dr. Egide Kalisa at Western University.</p>
          <button className="button-secondary" onClick={onContact} data-testid="button-footer-contact">Connect with the lab <ArrowUpRight size={14} aria-hidden="true" /></button>
        </div>
        <div><h4>Explore</h4><Link href="/research" data-testid="link-footer-research">Research</Link><Link href="/projects" data-testid="link-footer-projects">Projects</Link><Link href="/people" data-testid="link-footer-people">People</Link><Link href="/publications" data-testid="link-footer-publications">Scholarship</Link><Link href="/teaching" data-testid="link-footer-teaching">Teaching</Link></div>
        <div><h4>In the community</h4><Link href="/humekaneza" data-testid="link-footer-humekaneza">HumekaNeza</Link><Link href="/get-involved" data-testid="link-footer-involved">Get involved</Link><a href="mailto:p3healthlab@uwo.ca" data-testid="link-footer-email">Email the lab</a></div>
        <div><h4>Find us</h4><p>Western University<br />London, Ontario<br />Canada</p><a href="https://www.uwo.ca" target="_blank" rel="noreferrer" data-testid="link-western">Western University <ExternalLink size={12} aria-hidden="true" /></a></div>
      </div>
      <div className="footer-bottom"><span>© 2025 P3 Health Lab</span><span>Research · Collaboration · Impact</span></div>
    </div>
  </footer>;
}

function ContactModal({ onClose }: { onClose: () => void }) {
  const [sent, setSent] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    modalRef.current?.querySelector<HTMLElement>('input, textarea, button')?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key === 'Tab' && modalRef.current) {
        const focusable = Array.from(modalRef.current.querySelectorAll<HTMLElement>('input, textarea, button, a[href]')).filter((element) => !element.hasAttribute('disabled'));
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="contact-title">
    <div className="modal" ref={modalRef}>
      <div className="modal-head"><div><span className="eyebrow">Open door</span><h2 id="contact-title">Start a conversation.</h2></div><button className="close-btn" onClick={onClose} aria-label="Close contact form" data-testid="button-close-contact"><X size={22} aria-hidden="true" /></button></div>
      {sent ? <div className="success-note" role="status" data-testid="status-contact-success"><strong>Message ready to go.</strong><br />Thank you for reaching out. We’ll be in touch at the lab soon.</div> : <form onSubmit={(event) => { event.preventDefault(); setSent(true); }} data-testid="form-contact">
        <div className="field"><label htmlFor="contact-name">Your name</label><input id="contact-name" required placeholder="Name" data-testid="input-contact-name" /></div>
        <div className="field"><label htmlFor="contact-email">Email</label><input id="contact-email" type="email" required placeholder="you@example.com" data-testid="input-contact-email" /></div>
        <div className="field"><label htmlFor="contact-message">How can we work together?</label><textarea id="contact-message" required placeholder="Tell us a little about your idea, question, or project." data-testid="input-contact-message" /></div>
        <button className="button-primary" type="submit" data-testid="button-submit-contact">Send to the lab <ArrowUpRight size={14} aria-hidden="true" /></button>
      </form>}
      {sent && <button className="button-primary" onClick={onClose} data-testid="button-done-contact">Close</button>}
    </div>
  </div>;
}

function Home() {
  const [, setLocation] = useLocation();
  return <>
    <section className="hero" aria-labelledby="home-title"><div className="hero-airflow" aria-hidden="true"><svg className="airflow-svg" viewBox="0 0 720 360" role="presentation"><path d="M-30 240 C120 130 205 340 365 220 S590 110 760 168" /><path d="M-40 290 C100 185 218 375 376 258 S603 158 760 208" /><path d="M30 184 C160 88 245 260 392 174 S600 80 748 130" /></svg></div><div className="container-wide hero-grid">
      <div className="hero-copy" data-reveal="up"><span className="eyebrow">P3 Health Lab · Western University</span><h1 id="home-title">Understanding exposures. Designing <em>interventions.</em> Improving health.</h1><p className="hero-lede">We study how environmental exposures, climate change, and the places where people live, learn, work, and move influence health — and design interventions to reduce those risks.</p><div className="hero-byline"><strong>Dr. Egide Kalisa</strong><span>Assistant Professor, Western University<br />Director, P3 Health Lab / HELTH Lab</span></div><div className="hero-actions"><Link href="/research" className="button-primary" data-testid="link-hero-research">Explore our research <ArrowUpRight size={15} aria-hidden="true" /></Link><Link href="/people" className="button-secondary" data-testid="link-hero-people">Meet our people <ChevronRight size={15} aria-hidden="true" /></Link></div></div>
      <div className="hero-art" data-reveal="scale" aria-label="People, planet, place visual"><div className="orb orb-main breathe"><span className="art-label one">People</span><span className="art-label two">Planet</span><span className="art-label three">Place</span><div className="art-center"><div><span>P3</span><small>one connected health story</small></div></div></div><div className="orb orb-outline breathe breathe-delay" /><div className="hero-note" data-reveal="up"><strong>Our north star</strong>Research that travels from a careful measurement to a healthier everyday life.</div></div>
    </div></section>
    <div className="strip"><div className="container-wide strip-inner"><div className="strip-item story-item" data-reveal="up" style={{ transitionDelay: '0ms' }}><strong>People</strong><span>Knowledge starts with lived experience.</span></div><div className="strip-item story-item" data-reveal="up" style={{ transitionDelay: '80ms' }}><strong>Planet</strong><span>Health is ecological, shared, and changing.</span></div><div className="strip-item story-item" data-reveal="up" style={{ transitionDelay: '160ms' }}><strong>Place</strong><span>Solutions should belong somewhere.</span></div></div></div>
    <section className="section" data-reveal="up"><div className="container-wide intro-grid"><div><span className="eyebrow">The P3 approach</span><div className="intro-stat"><b>01</b><span>Question the everyday</span></div><div className="intro-stat" style={{ marginTop: 30 }}><b>03</b><span>Return knowledge with care</span></div></div><div><p className="intro-copy">Understanding exposures. Designing interventions. <mark>Improving health.</mark></p><p className="tiny-copy">We work across disciplines and borders, with the people who live the questions. Our work is rigorous enough for a journal and useful enough for a classroom, clinic, city, or kitchen table.</p><Link href="/people" className="button-secondary" data-testid="link-home-people">Meet the people behind the work <ArrowUpRight size={14} aria-hidden="true" /></Link></div></div></section>
    <section className="section section-tinted" data-reveal="up"><div className="container-wide"><div className="section-head"><div><span className="eyebrow">The questions we carry</span><h2>Research that starts close to everyday life.</h2></div><p>Our work connects environmental health, climate, and intervention science with the communities who live the questions.</p></div><div className="focus-grid">{homeFocuses.map((focus, index) => <article className="focus-item" key={focus.label} data-reveal="up" style={{ transitionDelay: `${index * 70}ms` }}><span className="focus-number">0{index + 1}</span><h3>{focus.label}</h3><p>{focus.text}</p></article>)}</div></div></section>
    <section className="section" data-reveal="up"><div className="container-wide"><div className="section-head"><div><span className="eyebrow">What we study</span><h2>Six routes into a healthier tomorrow.</h2></div><p>Different questions, one connected lens: how environments shape health — and how better choices can shape environments.</p></div><div className="research-grid">{researchAreas.map((area, index) => <Link href="/research" className="research-card" key={area.title} data-reveal="scale" style={{ transitionDelay: `${index * 70}ms` }} data-testid={`card-home-research-${index}`}><div className="card-number"><span>0{index + 1}</span><ArrowUpRight size={17} aria-hidden="true" /></div><h3>{area.title}</h3><p>{area.text}</p><span className="card-meta">{area.meta}</span></Link>)}</div></div></section>
    <section className="section home-record-section" data-reveal="up"><div className="container-wide"><div className="section-head"><div><span className="eyebrow">A connected record</span><h2>Follow the work beyond a single page.</h2></div><p>Research is shared through questions, scholarship, teaching, and community practice. Start with the part of the record closest to you.</p></div><div className="home-record-grid"><Link href="/research" className="record-link" data-testid="link-home-record-research"><span className="record-kicker">01 · Research</span><strong>Our areas of inquiry</strong><span>From exposure science to sustainable cities.</span><ArrowUpRight size={18} aria-hidden="true" /></Link><Link href="/publications" className="record-link" data-testid="link-home-record-publications"><span className="record-kicker">02 · Scholarship</span><strong>Selected publications</strong><span>Read the evidence behind the questions.</span><ArrowUpRight size={18} aria-hidden="true" /></Link><Link href="/humekaneza" className="record-link" data-testid="link-home-record-community"><span className="record-kicker">03 · Community</span><strong>HumekaNeza</strong><span>Learning, measuring, communicating, and acting.</span><ArrowUpRight size={18} aria-hidden="true" /></Link></div></div></section>
    <section className="quote-section" data-reveal="up"><div className="container-wide"><blockquote>“A healthier tomorrow is not a distant idea. It is something we can measure, design, and practice together.”</blockquote><cite>— P3 Health Lab, London · Canada</cite></div></section>
    <section className="section home-join-section" data-reveal="up"><div className="container-wide section-head"><div><span className="eyebrow">Join the lab</span><h2>Bring curiosity, care, and a question.</h2></div><div><p>Whether you are a student, researcher, collaborator, school, or community partner, there is a place to start.</p><Link href="/get-involved" className="button-primary" data-testid="link-home-get-involved">Find your pathway <ArrowUpRight size={15} aria-hidden="true" /></Link></div></div></section>
  </>;
}

function PageHero({ eyebrow, title, text, action }: { eyebrow: string; title: ReactNode; text: string; action?: ReactNode }) {
  return <section className="page-hero" data-reveal="up"><div className="container-wide"><span className="eyebrow">{eyebrow}</span><h1 className="display">{title}</h1><p>{text}</p>{action && <div className="hero-actions">{action}</div>}</div></section>;
}

function Research() {
  const evidenceFlow = [
    { number: '01', label: 'Exposure', text: 'We begin with the environmental conditions and exposures that shape everyday health.' },
    { number: '02', label: 'Evidence', text: 'We bring measurement into conversation with lived experience, context, and the questions communities carry.' },
    { number: '03', label: 'Intervention', text: 'We study practical ways to reduce risk, strengthen health, and support change in real places.' },
  ];

  return <div className="research-page">
    <PageHero eyebrow="Research / 01" title={<>Questions that start <em>close to home.</em></>} text="We study the exposures people encounter, the environments they move through, and the interventions that make healthier choices possible." action={<Link href="/get-involved" className="button-secondary" data-testid="link-research-collaborate">Work with us <ArrowUpRight size={15} aria-hidden="true" /></Link>} />

    <section className="research-index" aria-label="Research page navigation" data-reveal="up">
      <div className="container-wide research-index-inner">
        <div className="research-index-label"><span className="eyebrow">On this page</span><span className="research-index-note">A connected record of inquiry</span></div>
        <nav className="research-anchor-nav" aria-label="Research sections">
          <a href="#research-overview" data-testid="link-research-overview"><span>01</span><strong>Overview</strong></a>
          <a href="#research-method" data-testid="link-research-method"><span>02</span><strong>From question to action</strong></a>
          {researchTopics.map((topic, index) => <a href={`#${topic.id}`} key={topic.title} data-testid={`link-research-anchor-${index}`}><span>{String(index + 3).padStart(2, '0')}</span><strong>{topic.title}</strong></a>)}
        </nav>
      </div>
    </section>

    <section className="section research-overview" id="research-overview" data-reveal="up">
      <div className="container-wide research-overview-grid">
        <div className="research-overview-mark" aria-hidden="true"><span>01</span><i /><i /><i /></div>
        <div>
          <div className="section-head research-section-head"><div><span className="eyebrow">Our areas</span><h2>From a particle in the air to a city’s big decision.</h2></div><p>Our questions are deliberately porous. The strongest work often sits at the boundary of two disciplines — or two communities.</p></div>
          <p className="research-overview-lede">Understanding exposures. Designing <em>interventions.</em> Improving health.</p>
          <div className="research-lenses" aria-label="Connections across the research programme">
            <div><span>01</span><strong>Exposures</strong><p>What people encounter in the environments around them.</p></div>
            <div><span>02</span><strong>Environments</strong><p>How homes, cities, climate, and shared spaces shape risk.</p></div>
            <div><span>03</span><strong>Health &amp; action</strong><p>Evidence that can inform care, policy, and practical change.</p></div>
          </div>
        </div>
      </div>
    </section>

    <section className="section section-tinted research-method" id="research-method" data-reveal="up">
      <div className="container-wide">
        <div className="research-method-head"><div><span className="eyebrow">How we work</span><h2 className="display">Evidence with a return address.</h2></div><p>We pair <mark>measurement</mark> with meaning — sensors with stories, trials with trust, and global questions with local knowledge.</p></div>
        <div className="evidence-flow" aria-label="How research moves from exposure to intervention">
          {evidenceFlow.map((step, index) => <article className="evidence-step" key={step.label} data-reveal="up" style={{ transitionDelay: `${index * 100}ms` }} data-testid={`step-research-flow-${step.label.toLowerCase()}`}>
            <div className="evidence-step-top"><span>{step.number}</span>{index < evidenceFlow.length - 1 && <span className="evidence-connector" aria-hidden="true" />}</div>
            <h3>{step.label}</h3>
            <p>{step.text}</p>
          </article>)}
        </div>
        <p className="research-method-foot">P3 projects are built to be shared. We publish, teach, test, translate, and listen again. That loop is how research earns its way into everyday places.</p>
      </div>
    </section>

    <section className="section research-record" aria-labelledby="research-record-title" data-reveal="up">
      <div className="container-wide">
        <div className="section-head"><div><span className="eyebrow">The research record</span><h2 id="research-record-title">Six areas of inquiry.</h2></div><p>Different questions, one connected lens: how environments shape health, and how evidence can inform healthier places.</p></div>
        <div className="research-grid">
          {researchTopics.map((topic, index) => <article className="research-card research-card-anchor" id={topic.id} key={topic.title} data-reveal="scale" style={{ transitionDelay: `${index * 70}ms` }} data-testid={`card-research-${index}`}>
            <div className="card-number"><span>0{index + 1}</span><CircleArrowUp size={17} aria-hidden="true" /></div>
            <h3>{topic.title}</h3>
            <p>{topic.text}</p>
            <span className="card-meta">{topic.meta}</span>
          </article>)}
        </div>
      </div>
    </section>

    <section className="section section-tinted research-return" data-reveal="up">
      <div className="container-wide research-return-grid">
        <div><span className="eyebrow">A connected record</span><h2>Research is shared through questions, scholarship, teaching, and community practice.</h2></div>
        <div className="research-return-links">
          <Link href="/people" className="research-return-link" data-testid="link-research-people"><span>01 · People</span><strong>Meet the lab</strong><small>See the people who carry these questions.</small><ArrowUpRight size={17} aria-hidden="true" /></Link>
          <Link href="/publications" className="research-return-link" data-testid="link-research-publications"><span>02 · Scholarship</span><strong>Selected publications</strong><small>Read the evidence behind the questions.</small><ArrowUpRight size={17} aria-hidden="true" /></Link>
          <Link href="/humekaneza" className="research-return-link" data-testid="link-research-community"><span>03 · Community</span><strong>HumekaNeza</strong><small>Learning, measuring, communicating, and acting.</small><ArrowUpRight size={17} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  </div>;
}

function Projects() {
  return <>
    <PageHero eyebrow="Projects" title={<>Research takes <em>form.</em></>} text="The lab’s work is organized through research projects and community initiatives. This page records the named initiatives currently identified in the project materials." action={<Link href="/research" className="button-secondary" data-testid="link-projects-research">See our research <ArrowUpRight size={15} aria-hidden="true" /></Link>} />
    <section className="section projects-section" data-reveal="up">
      <div className="container-wide">
        <div className="section-head">
          <div><span className="eyebrow">Current record</span><h2>Named initiatives and project directions.</h2></div>
          <p>Project details will be expanded only as verified information becomes available.</p>
        </div>
        <div className="project-grid">
          {projectInitiatives.map((project, index) => {
            const content = <><div className="project-item-top"><span>{String(index + 1).padStart(2, '0')}</span><span className="project-meta">{project.meta}</span></div><h3>{project.title}</h3><p>{project.text}</p>{project.href && <span className="project-link-note">Explore the initiative <ArrowUpRight size={14} aria-hidden="true" /></span>}</>;
            return project.href
              ? <Link href={project.href} className="project-item" key={project.title} data-testid={`link-project-${index}`}>{content}</Link>
              : <article className="project-item" key={project.title} data-testid={`card-project-${index}`}>{content}</article>;
          })}
        </div>
      </div>
    </section>
    <section className="section section-tinted project-record-note" data-reveal="up">
      <div className="container-wide project-record-grid">
        <div><span className="eyebrow">A growing record</span><h2>Projects connect research questions with the places where they matter.</h2></div>
        <div><p>As project information is verified, this record can carry research areas, related publications, images, community context, and external links without changing the site’s structure.</p><Link href="/humekaneza" className="button-secondary" data-testid="link-projects-humekaneza">Visit HumekaNeza <ArrowUpRight size={14} aria-hidden="true" /></Link></div>
      </div>
    </section>
  </>;
}

function People() {
  return <><PageHero eyebrow="People / 02" title={<>The people behind the <em>work.</em></>} text="P3 Health Lab / HELTH Lab is directed by Dr. Egide Kalisa at Western University. Additional team profiles will be published as verified information becomes available." /><section className="section people-section" data-reveal="up"><div className="container-wide"><div className="section-head"><div><span className="eyebrow">Current leadership</span><h2>A careful record of the lab team.</h2></div><p>Only confirmed team information is listed here. This page will grow without filling gaps with assumptions.</p></div><div className="people-grid people-grid-featured">{people.map((person, index) => <article className="person-card person-card-featured" key={person.name} data-reveal="up" style={{ transitionDelay: `${index * 70}ms` }} data-testid={`card-person-${index}`}><div className="person-initial" aria-hidden="true">{person.initials}</div><div className="person-card-copy"><span className="eyebrow">Principal Investigator</span><h3>{person.name}</h3><span className="person-role">{person.role}</span><p className="person-institution">{person.institution}</p><p>{person.text}</p></div></article>)}</div></div></section><section className="section section-tinted people-categories" data-reveal="up"><div className="container-wide"><div className="section-head"><div><span className="eyebrow">Team categories</span><h2>Profiles will be added with care.</h2></div><p>Names, positions, and biographies are shown only when they have been verified for publication.</p></div><div className="team-category-list">{peopleCategories.map(([id, label], index) => <article className="team-category" id={id} key={id} data-testid={`category-people-${id}`}><span className="team-category-number">{String(index + 1).padStart(2, '0')}</span><h3>{label}</h3><span className="team-category-status">No verified profiles published yet.</span></article>)}</div></div></section><section className="contact-band" id="join" data-reveal="up"><div className="container-wide contact-grid"><div><span className="eyebrow">Join the lab</span><h2>Bring a question, not a template.</h2></div><Link href="/get-involved" className="button-primary" data-testid="link-people-join">Find your pathway <ArrowUpRight size={15} aria-hidden="true" /></Link></div></section></>;
}

function About() {
  return <><PageHero eyebrow="About / 07" title={<>Dr. Egide <em>Kalisa.</em></>} text="Assistant Professor at Western University and Director of P3 Health Lab / HELTH Lab." /><section className="section" data-reveal="up"><div className="container-wide intro-grid"><div><span className="eyebrow">Academic profile</span><div className="intro-stat"><b>01</b><span>Assistant Professor · Western University</span></div><div className="intro-stat" style={{ marginTop: 30 }}><b>02</b><span>Director · P3 Health Lab / HELTH Lab</span></div></div><div><p className="intro-copy">Research across <mark>people, planet, and place.</mark></p><p className="tiny-copy">Dr. Egide Kalisa’s work examines how environmental exposures, climate change, and the places where people live, learn, work, and move influence health, with attention to practical interventions.</p></div></div></section><section className="section section-tinted" data-reveal="up"><div className="container-wide"><div className="section-head"><div><span className="eyebrow">Research interests</span><h2>Questions grounded in environmental health.</h2></div><p>These areas reflect the research themes already established across the P3 Health Lab record.</p></div><div className="focus-grid">{researchTopics.map((topic, index) => <article className="focus-item" key={topic.id} data-reveal="up" style={{ transitionDelay: `${index * 70}ms` }}><span className="focus-number">{String(index + 1).padStart(2, '0')}</span><h3>{topic.title}</h3><p>{topic.text}</p></article>)}</div></div></section></>;
}

function Publications() {
  return <><PageHero eyebrow="Scholarship / 03" title={<>Evidence worth <em>sharing.</em></>} text="Publication details will be listed here as source records are verified." /><section className="section" data-reveal="up"><div className="container-wide"><div className="section-head"><div><span className="eyebrow">Publication record</span><h2>A careful record is being prepared.</h2></div><p>No publication entries are shown until their bibliographic details can be checked against reliable source material.</p></div><div className="publication-list"><div className="publication-empty" data-testid="empty-publications"><span className="publication-year">Pending</span><div><h3>Verified publication records are not available yet.</h3><p>Titles, authors, journals, years, DOIs, citation counts, findings, and publication links will be added only when they are verified.</p><p>Google Scholar will be the primary external destination once its profile URL is confirmed. ORCID, CV PDF, and Western University profile links will be added only after their destinations are verified.</p></div><span className="pub-type">Record pending</span></div></div></div></section></>;
}

function Teaching() {
  const [year, setYear] = useState<keyof typeof courses>('2026–2027');
  return <><PageHero eyebrow="Teaching / 04" title={<>Make room for <em>better questions.</em></>} text="Teaching at P3 is an invitation to notice systems, question assumptions, and practice global health with humility." /><section className="section" data-reveal="up"><div className="container-wide"><div className="section-head"><div><span className="eyebrow">Courses by academic year</span><h2>Learning that leaves the classroom.</h2></div><p>Only course codes and titles confirmed in the available source material are shown.</p></div><div className="year-tabs">{(Object.keys(courses) as Array<keyof typeof courses>).map((item) => <button className={`year-tab ${year === item ? 'active' : ''}`} key={item} onClick={() => setYear(item)} data-testid={`button-year-${item}`}>{item}</button>)}</div><div className="course-grid"><div>{courses[year].map((course, index) => <article className="course-card" key={course.code} data-reveal="up" style={{ transitionDelay: `${index * 80}ms` }} data-testid={`card-course-${index}`}><span className="course-code">{course.code}</span><div><h3>{course.title}</h3></div><span className="course-term">Verified course</span></article>)}</div><aside className="side-panel" data-reveal="scale"><span className="eyebrow">Teaching record</span><h3>Teaching information, kept precise.</h3><p>Program, term, role, and supervision details are not shown until they are verified in the source material.</p></aside></div></div></section><section className="quote-section" data-reveal="up"><div className="container-wide"><blockquote>“The best classroom is one that sends you back into the world more attentive than before.”</blockquote><cite>P3 teaching practice</cite></div></section></>;
}

function Humekaneza() {
  const steps = [
    ['01', 'Learn', 'Build shared understanding from local experience, trusted evidence, and questions people already carry.'],
    ['02', 'Measure', 'Use accessible tools to notice patterns in air, homes, schools, and the environments we share.'],
    ['03', 'Communicate', 'Turn findings into clear stories, conversations, and choices that make sense in context.'],
    ['04', 'Act', 'Move from insight to practical change — then return, listen, and learn what happened.'],
  ];
  return <><PageHero eyebrow="HumekaNeza / 05" title={<>Breathe easy, <em>together.</em></>} text="HumekaNeza — meaning “breathe well” — is a community initiative for learning, measuring, communicating, and acting on the air around us." action={<Link href="/get-involved" className="button-secondary" data-testid="link-humekaneza-join">Join the work <ArrowUpRight size={15} aria-hidden="true" /></Link>} /><section className="section" data-reveal="up"><div className="container-wide initiative-grid"><div className="initiative-visual" data-reveal="scale"><svg className="initiative-airflow" viewBox="0 0 460 320" aria-hidden="true"><path d="M-30 194 C70 106 125 242 220 168 S370 92 490 130" /><path d="M-26 236 C84 160 132 276 238 202 S376 138 492 174" /></svg><div className="initiative-word"><span className="breathe-well">Breathe Well</span>Humeka<br />Neza<small>Community air & everyday health</small></div></div><div><span className="eyebrow">The approach</span><h2 className="display" style={{ fontSize: 'clamp(2.7rem, 5vw, 5rem)', lineHeight: .92, margin: '16px 0 20px' }}>A breath is small. The work around it is not.</h2><p className="tiny-copy" style={{ marginTop: 0 }}>HumekaNeza brings people together around a simple, practical question: what would help us breathe easier here? The answer starts with knowledge and ends with action, not a one-size-fits-all fix.</p><div className="steps">{steps.map(([number, title, text], index) => <div className="step" key={title} data-reveal="up" style={{ transitionDelay: `${index * 80}ms` }} data-testid={`step-humekaneza-${title.toLowerCase()}`}><span className="step-num">{number}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></div></div></section><section className="section section-tinted" data-reveal="up"><div className="container-wide section-head"><div><span className="eyebrow">A shared invitation</span><h2>Bring the question your neighbourhood is already asking.</h2></div><Link href="/get-involved" className="button-primary" data-testid="link-humekaneza-involved">Connect with HumekaNeza <ArrowUpRight size={15} aria-hidden="true" /></Link></div></section></>;
}

function GetInvolved() {
  const pathways = [
    ['01', 'Students', 'Find a supervisor, a project, or your first place to ask a better question.', 'Browse people'],
    ['02', 'Researchers', 'Bring methods, questions, or a collaboration that benefits from a wider lens.', 'Start a conversation'],
    ['03', 'Collaborators', 'Build something useful with us across institutions, disciplines, and borders.', 'Work together'],
    ['04', 'Schools', 'Explore tools and learning experiences for healthier school environments.', 'Talk with the lab'],
    ['05', 'Communities', 'Share what you notice. Help shape research that returns something of value.', 'Join HumekaNeza'],
  ];
  const [, setLocation] = useLocation();
  return <><PageHero eyebrow="Get involved / 06" title={<>There is a place for <em>your question.</em></>} text="P3 Health Lab grows through generous collaboration. Choose the pathway that feels closest, or send us a note and we’ll find the right door." /><section className="section" data-reveal="up"><div className="container-wide"><div className="section-head"><div><span className="eyebrow">Pathways</span><h2>Start where you are.</h2></div><p>No perfect pitch required. Curiosity, care, and a willingness to learn together are enough to begin.</p></div><div className="path-grid">{pathways.map(([number, title, text, cta], index) => <button className="path-card" key={title} onClick={() => title === 'Communities' ? setLocation('/humekaneza') : setLocation('/people')} data-reveal="scale" style={{ transitionDelay: `${index * 70}ms` }} data-testid={`button-pathway-${title.toLowerCase()}`}><div className="card-number"><span>{number}</span><ArrowUpRight size={16} aria-hidden="true" /></div><h3>{title}</h3><p>{text}</p><span className="card-meta">{cta}</span></button>)}</div></div></section><section className="contact-band" data-reveal="up"><div className="container-wide contact-grid"><h2>Not sure which door is yours?</h2><button className="button-primary" onClick={() => window.dispatchEvent(new CustomEvent('open-contact'))} data-testid="button-involved-contact">Send a note <ArrowUpRight size={15} aria-hidden="true" /></button></div></section></>;
}

function NotFound() {
  return <div className="not-found"><div><span className="eyebrow">P3 / 404</span><h1 className="display">Not here.</h1><p>We couldn’t find that page, but there are plenty of good places to start.</p><Link href="/" className="button-primary" data-testid="link-not-found-home">Return home <ArrowUpRight size={14} aria-hidden="true" /></Link></div></div>;
}

function Router() {
  return <RoutedErrorBoundary><Switch>
    <Route path="/" component={Home} />
    <Route path="/research" component={Research} />
    <Route path="/projects" component={Projects} />
    <Route path="/people" component={People} />
    <Route path="/about" component={About} />
    <Route path="/publications" component={Publications} />
    <Route path="/teaching" component={Teaching} />
    <Route path="/humekaneza" component={Humekaneza} />
    <Route path="/get-involved" component={GetInvolved} />
    <Route component={NotFound} />
  </Switch></RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><div className="page-transition" key={location}>{children}</div></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Shell><Router /></Shell></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;