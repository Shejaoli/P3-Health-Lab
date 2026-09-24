import { type MouseEvent as ReactMouseEvent, type ReactNode, useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowUpRight, ChevronRight, Check, CircleArrowUp, ExternalLink, X } from 'lucide-react';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AdminGate, AdminLoginPanel, AdminUploadGate } from '@/admin/AdminApp';
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

const researchThemes: { id: string; title: string; text: string; more: string; related?: { label: string; href: string } }[] = [
  {
    id: 'air-pollution',
    title: 'Air Pollution & Environmental Health',
    text: 'We investigate ambient, household, and personal air pollution exposures and their impacts on human health.',
    more: 'Our work examines where exposures occur, who is most affected, and how exposure can be reduced through monitoring, epidemiology, and intervention research.',
  },
  {
    id: 'exposure-science',
    title: 'Exposure Science, Environmental Microbiology & AMR',
    text: 'We use passive and active environmental sampling to characterize complex chemical and biological exposures across indoor and outdoor environments.',
    more: 'Our research includes particulate matter, gases, organic pollutants, metals, bioaerosols, microbial communities, the aerobiome, and antimicrobial resistance.',
  },
  {
    id: 'climate',
    title: 'Climate Change, Wildfires & Extreme Heat',
    text: 'We study the health impacts of wildfire smoke, extreme heat, and compound climate-related exposures.',
    more: 'Our work focuses on exposure, vulnerability, adaptation, resilience, and strategies to protect populations during increasingly frequent extreme environmental events.',
  },
  {
    id: 'children',
    title: 'Children’s Environmental Health',
    text: 'We investigate environmental exposures affecting children across homes, schools, transportation systems, and communities.',
    more: 'Our work combines exposure monitoring, epidemiology, citizen science, education, and youth engagement to support healthier environments for children and families.',
    related: { label: 'HumekaNeza', href: '/humekaneza' },
  },
  {
    id: 'clinical-trials',
    title: 'Clinical Trials & Environmental Health Interventions',
    text: 'We design and evaluate randomized controlled trials and real-world interventions to reduce harmful environmental exposures and improve health.',
    more: 'Our work includes clean-cooking and household air-pollution interventions using cleaner fuels such as LPG, with outcomes including exposure reduction, lung function, and blood pressure. We also evaluate classroom air-cleaning interventions, including portable air purifiers, and examine effects on indoor air quality, health, learning, and academic performance.',
    related: { label: 'Classroom Clean-Air Interventions', href: '/projects' },
  },
  {
    id: 'global-health',
    title: 'Global Health, One Health & Sustainable Cities',
    text: 'We apply Global Health and One Health perspectives to study connections among human, animal, environmental, and ecosystem health.',
    more: 'Our research also examines sustainable transport, e-mobility, environmental justice, urban environments, and healthy-city solutions across diverse global settings.',
  },
];

type Project = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string[];
  activities?: string[];
  focus?: string[];
  location?: string;
  closing?: string;
  process?: string;
};

const projects: Project[] = [
  {
    id: 'school-air-quality-campaign',
    slug: 'school-air-quality-campaign',
    title: 'HumekaNeza School Air-Quality Campaign',
    location: 'Rwanda',
    description: [
      'The original HumekaNeza campaign was launched in schools in Rwanda to improve children’s understanding of air pollution and empower them to participate in solutions.',
    ],
    activities: [
      'school-based air-quality education',
      'low-cost air-quality monitoring',
      'Air Quality Flag Programs',
      'anti-idling campaigns',
      'student-led environmental monitoring',
      'classroom air-cleaning activities',
      'cleaner-route and outdoor-activity guidance',
      'tree planting and greener school environments',
      'creative communication through posters and letters to families',
    ],
    closing: 'The campaign transforms schools into living environmental-health laboratories where children learn by observing, measuring, communicating, and acting.',
  },
  {
    id: 'i-am-an-air-quality-scientist',
    slug: 'i-am-an-air-quality-scientist',
    title: 'I Am an Air Quality Scientist',
    description: [
      'Students become citizen scientists by using air-quality monitors and other scientific tools to investigate pollution in their schools and communities.',
      'The initiative introduces children to environmental-health science while building scientific literacy, curiosity, confidence, and practical understanding of environmental data.',
    ],
  },
  {
    id: 'one-sensor-per-school',
    slug: 'one-sensor-per-school',
    title: 'One Sensor Per School',
    description: [
      'This initiative aims to make air pollution visible by placing low-cost air-quality sensors in participating schools.',
      'Students and teachers can observe how air pollution changes throughout the day and explore how traffic, weather, indoor activities, and other factors affect the air they breathe.',
    ],
  },
  {
    id: 'classroom-clean-air-interventions',
    slug: 'classroom-clean-air-interventions',
    title: 'Classroom Clean-Air Interventions',
    description: [
      'HumekaNeza supports research evaluating practical approaches to improve classroom air quality, including the use of portable air purifiers.',
      'These interventions examine changes in indoor air pollution and explore potential effects on student health, learning, comfort, attendance, and academic performance.',
    ],
  },
  {
    id: 'clean-air-school-zones',
    slug: 'clean-air-school-zones',
    title: 'Clean Air School Zones',
    description: [
      'This initiative focuses on reducing traffic-related air pollution around schools.',
    ],
    activities: [
      'anti-idling campaigns',
      'safer school travel',
      'awareness around drop-off and pick-up emissions',
      'low-emission school zones',
      'engagement with parents and school communities',
    ],
  },
  {
    id: 'shared-skies',
    slug: 'shared-skies',
    title: 'Shared Skies',
    description: [
      'Shared Skies connects students across countries through environmental-health education and citizen science.',
      'Students collect and compare air-quality information from their communities and share findings through virtual exchanges, presentations, and Global Classroom activities.',
      'The initiative helps children recognize that air pollution is both a local and global challenge.',
    ],
  },
  {
    id: 'making-the-invisible-visible',
    slug: 'making-the-invisible-visible',
    title: 'Making the Invisible Visible',
    subtitle: "Engaging African, Caribbean and Black Children and Youth in Canada's Chemicals Management Plan",
    description: [
      "Making the Invisible Visible strengthens the knowledge, capacity, and meaningful participation of African, Caribbean and Black children and youth in understanding chemicals, health, and Canada's Chemicals Management Plan.",
    ],
    activities: [
      'ACB Youth CMP Advisory and Knowledge Translation Council',
      'Youth CMP Knowledge Ambassador training',
      'behaviour-change workshops',
      '"I Am a CMP Scientist" activities',
      'From Sample to Decision learning experiences',
      'family and community dialogue',
      'Global Classroom activities',
      'youth-created knowledge-translation products',
      'Ontario Youth CMP Conference',
    ],
    process: 'LISTEN → LEARN → SEE → TRANSLATE → SHARE → ACT → FEEDBACK',
  },
  {
    id: 'equitable-air-quality-communication',
    slug: 'equitable-air-quality-communication',
    title: 'Equitable Air-Quality Communication & Preparedness',
    subtitle: 'Supporting Black Youth and Families in Hamilton and London',
    location: 'Hamilton and London',
    description: [
      'This community-engaged initiative works with Black youth, families, and community partners to understand how people experience, access, interpret, trust, and act on air-quality information.',
    ],
    focus: [
      'lived experiences of poor air quality and wildfire smoke',
      'access to and understanding of AQHI and wildfire-smoke messaging',
      'trust in environmental-health information',
      'environmental justice',
      'social, cultural, and structural barriers to protective action',
      'co-designed communication and preparedness strategies',
    ],
    closing: 'The project centres community voices and aims to make air-quality information more relevant, accessible, trusted, and actionable.',
  },
];

const featuredProjects = [
  { title: 'HumekaNeza School Air-Quality Campaign', text: 'The original HumekaNeza campaign was launched in schools in Rwanda to improve children’s understanding of air pollution and empower them to participate in solutions.' },
  { title: 'I Am an Air Quality Scientist', text: 'Students become citizen scientists by using air-quality monitors and other scientific tools to investigate pollution in their schools and communities.' },
  { title: 'One Sensor Per School', text: 'This initiative aims to make air pollution visible by placing low-cost air-quality sensors in participating schools.' },
];

type PersonRecord = {
  name: string;
  role: string;
  institution?: string;
  country?: string;
  currentPosition?: string;
  formerRole?: string;
  researchFocus?: string;
  status?: string;
};

const peopleGroups: { id: string; title: string; people: PersonRecord[] }[] = [
  {
    id: 'principal-investigator',
    title: 'Principal Investigator',
    people: [
      {
        name: 'Dr. Egide Kalisa',
        role: 'Assistant Professor; Director, HELTH/P3 Health Lab',
        institution: 'Western University',
        researchFocus: 'Environmental health; air pollution; climate change; children’s health; environmental justice; One Health; exposure science',
      },
    ],
  },
  {
    id: 'postdoctoral',
    title: 'Postdoctoral Fellows',
    people: [
      {
        name: 'Dr. Md Pervez Kabir',
        role: 'Postdoctoral Fellow',
        institution: 'Western University',
      },
    ],
  },
  {
    id: 'phd',
    title: 'PhD Students — Western University',
    people: [
      {
        name: 'Allison Pert',
        role: 'PhD Student',
        institution: 'Western University',
        formerRole: 'MSc Student',
        status: 'Alumni / Current PhD',
      },
      {
        name: 'Augustine Omodieke',
        role: 'PhD Student',
        institution: 'Western University',
        researchFocus: 'Environmental epidemiology; air pollution; health economics',
        formerRole: 'MSc Student',
        status: 'Alumni / Current PhD',
      },
      { name: 'Francis Acquah', role: 'PhD Student', institution: 'Western University' },
      { name: 'Daniel Twum', role: 'PhD Student', institution: 'Western University' },
      { name: 'Abdul Rasheed Rasheed', role: 'PhD Student', institution: 'Western University' },
    ],
  },
  {
    id: 'masters',
    title: 'MSc Students — Western University',
    people: [
      {
        name: 'Zoha Irfan',
        role: 'MSc Student',
        institution: 'Western University',
        researchFocus: 'PAHs; air pollution; exposure science',
      },
      { name: 'Oluwaseun Bajulaye', role: 'MSc Student', institution: 'Western University' },
      { name: 'Farhana Ramiza', role: 'MSc Student', institution: 'Western University' },
      { name: 'Ignatius Atuguba', role: 'MSc Student', institution: 'Western University' },
    ],
  },
  {
    id: 'global-health-interns',
    title: 'Global Health MSc Interns',
    people: [
      { name: 'Jiaxuan Zhang', role: 'MSc Global Health Intern', institution: 'Western University' },
      { name: 'Arshia Mohammadi-Sanjani', role: 'MSc Global Health Intern', institution: 'Western University' },
      { name: 'Ihsan Khalifa', role: 'MSc Global Health Intern', institution: 'Western University' },
      { name: 'Harini Kumaraverl', role: 'MSc Global Health Intern', institution: 'Western University' },
      { name: 'Yuheng Lu', role: 'MSc Global Health Intern', institution: 'Western University' },
      { name: 'Haiyan Li', role: 'MSc Global Health Intern', institution: 'Western University' },
    ],
  },
  {
    id: 'staff',
    title: 'Research Assistants',
    people: [
      {
        name: 'Ruiming Han',
        role: 'Research Assistant, MSc',
        institution: 'Western University',
        researchFocus: 'Air pollution; PAHs; metals; exposure analysis',
      },
      { name: 'Natasha Fortin', role: 'Research Assistant, MSc', institution: 'Western University' },
      { name: 'Sydney Lessard', role: 'Research Assistant, MSc', institution: 'Western University' },
      { name: 'Jiaqi Bi', role: 'Research Assistant, MSc', institution: 'Western University' },
      { name: 'Shaikh Sumeet Jamil', role: 'Research Assistant', institution: 'Western University' },
      { name: 'Sharika Jalali', role: 'Research Assistant', institution: 'Western University' },
      { name: 'Innocent Twagirayezu', role: 'Research Assistant, PhD', institution: 'Western University' },
    ],
  },
  {
    id: 'international-phd',
    title: 'International / Externally Co-supervised PhD Students',
    people: [
      { name: 'Patrick Karakwende', role: 'PhD Student' },
      { name: 'Adolphe Ndikubwimana', role: 'PhD Student', institution: 'University of Rwanda', country: 'Rwanda' },
      { name: 'Deborah', role: 'PhD Student', institution: 'University of Ibadan', country: 'Nigeria' },
      { name: 'Nibagwire', role: 'PhD Student', institution: 'University of Ibadan', country: 'Nigeria' },
      { name: 'Franck Kwabe', role: 'PhD Student', institution: 'ISP Bukavu', country: 'DR Congo' },
    ],
  },
  {
    id: 'visiting-international',
    title: 'Visiting International Students',
    people: [
      { name: 'Dioumacor Faye', role: 'PhD Student', institution: 'Visiting International Student', country: 'Senegal' },
      { name: 'Dorothy Namatovu', role: 'MSc Student', institution: 'Visiting International Student', country: 'Uganda' },
      { name: 'Ange Lisa Ikirezi', role: 'MSc Student', institution: 'Visiting International Student', country: 'Rwanda' },
      { name: 'Marie Ange Tuyime', role: 'Undergraduate Student', institution: 'Visiting International Student', country: 'Rwanda' },
      { name: 'Isabel Ajagu', role: 'MSc Student / Visiting Scholar', institution: 'Visiting International Student', country: 'Nigeria' },
    ],
  },
  {
    id: 'undergraduate-alumni',
    title: 'Undergraduate Alumni',
    people: [
      { name: 'Victoria Bursey', role: 'Undergraduate Researcher', currentPosition: 'MSc Public Health, University of Toronto', status: 'Alumni' },
      { name: 'Emily Airhart', role: 'Undergraduate Researcher', currentPosition: 'MSc Student, University of Toronto', status: 'Alumni' },
      { name: 'Shagun Chander', role: 'Undergraduate Researcher', institution: 'Western University', status: 'Current' },
    ],
  },
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
  const [location, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [adminEntryOpen, setAdminEntryOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openMobileMenu, setOpenMobileMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const adminClickRef = useRef({ count: 0, lastClick: 0 });
  const nav: { label: string; href: string; children?: [string, string][] }[] = [
    { label: 'Research', href: '/research' },
    { label: 'People', href: '/people' },
    { label: 'Publications', href: '/publications' },
    { label: 'Teaching', href: '/teaching' },
    { label: 'Projects', href: '/projects' },
    { label: 'News', href: '/news' },
    { label: 'Join the Lab', href: '/get-involved' },
    { label: 'Contact', href: '/contact' },
  ];
  const isActive = (href: string) => href === '/' ? location === '/' : location === href || location.startsWith(`${href}/`);
  const handleSubnavClick = (event: ReactMouseEvent<HTMLAnchorElement>, href: string) => {
    setOpenMenu(null);
    setOpenMobileMenu(null);
    setMenuOpen(false);

    const targetUrl = new URL(href, window.location.href);
    if (!targetUrl.hash || targetUrl.pathname !== window.location.pathname) return;

    const target = document.getElementById(decodeURIComponent(targetUrl.hash.slice(1)));
    if (!target) return;

    event.preventDefault();
    window.history.replaceState(null, '', `${targetUrl.pathname}${targetUrl.hash}`);
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  useScrollReveal(location);
  useEffect(() => {
    setMenuOpen(false);
    setOpenMenu(null);
    setOpenMobileMenu(null);
    const hash = window.location.hash;
    const frame = window.requestAnimationFrame(() => {
      const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.title = location === '/' ? 'P3 Health Lab · People, Planet, Place' : `P3 Health Lab · ${location.slice(1).replace('-', ' ')}`;
    return () => window.cancelAnimationFrame(frame);
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
  const handleAdminLogoClick = () => {
    const now = Date.now();
    if (now - adminClickRef.current.lastClick > 1400) adminClickRef.current.count = 0;
    adminClickRef.current.count += 1;
    adminClickRef.current.lastClick = now;
    if (adminClickRef.current.count === 3) {
      adminClickRef.current.count = 0;
      setAdminEntryOpen(true);
    }
  };
  if (location.startsWith('/admin') || location === '/upload') return <div className="admin-route-shell">{children}</div>;
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
                  {item.children.map(([childLabel, childHref]) => <Link key={childHref} href={childHref} className="dropdown-link" onClick={(event) => handleSubnavClick(event, childHref)}>{childLabel}</Link>)}
                </div>}
              </div>
            ) : <Link key={item.href} href={item.href} className={`nav-link ${isActive(item.href) ? 'active' : ''}`} data-testid={`link-nav-${item.label.toLowerCase()}`}>{item.label}</Link>)}
          </nav>
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
                {item.children.map(([childLabel, childHref]) => <Link key={childHref} href={childHref} className="mobile-sublink" onClick={(event) => handleSubnavClick(event, childHref)} data-testid={`link-mobile-${childLabel.toLowerCase().replaceAll(' ', '-')}`}>{childLabel}</Link>)}
              </div>}
            </div>
          ) : <Link key={item.href} href={item.href} className={`mobile-link ${isActive(item.href) ? 'active' : ''}`} data-testid={`link-mobile-${item.label.toLowerCase().replaceAll(' ', '-')}`}>{item.label}</Link>)}
        </nav>}
      </header>
      <main>{children}</main>
      <Footer onLogoClick={handleAdminLogoClick} />
      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
      {adminEntryOpen && <AdminLoginPanel onClose={() => setAdminEntryOpen(false)} onAuthenticated={() => { setAdminEntryOpen(false); setLocation('/admin/dashboard'); }} />}
    </div>
  );
}

function Footer({ onLogoClick }: { onLogoClick: () => void }) {
  return <footer className="footer">
    <div className="container-wide footer-compact">
      <div className="footer-id">
        <button type="button" className="footer-logo-button" onClick={onLogoClick} aria-label="P3 Health Lab logo"><img className="footer-logo" src={logo} alt="" /></button>
        <div>
          <p className="footer-name">P3 Health Lab</p>
          <p>Dr. Egide Kalisa, Director<br />Western University, London, Ontario, Canada</p>
        </div>
      </div>
      <div className="footer-links">
        <a href="mailto:p3healthlab@uwo.ca" data-testid="link-footer-email">p3healthlab@uwo.ca</a>
        <Link href="/about" data-testid="link-footer-about">About</Link>
        <Link href="/humekaneza" data-testid="link-footer-humekaneza">HumekaNeza</Link>
        <a href="https://www.uwo.ca" target="_blank" rel="noreferrer" data-testid="link-western">Western University <ExternalLink size={12} aria-hidden="true" /></a>
      </div>
    </div>
    <div className="container-wide footer-bottom"><span>© {new Date().getFullYear()} P3 Health Lab</span></div>
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
      {sent ? <div className="success-note" role="status" data-testid="status-contact-success"><strong>Your message is ready to send.</strong><br />Your email app should open with the lab’s address and your message.</div> : <form onSubmit={(event) => { event.preventDefault(); const formData = new FormData(event.currentTarget); const name = String(formData.get('name') ?? ''); const email = String(formData.get('email') ?? ''); const message = String(formData.get('message') ?? ''); const body = `Name: ${name}\nEmail: ${email}\n\n${message}`; window.location.href = `mailto:p3healthlab@uwo.ca?subject=${encodeURIComponent('P3 Health Lab enquiry')}&body=${encodeURIComponent(body)}`; setSent(true); }} data-testid="form-contact">
        <div className="field"><label htmlFor="contact-name">Your name</label><input id="contact-name" name="name" required placeholder="Name" data-testid="input-contact-name" /></div>
        <div className="field"><label htmlFor="contact-email">Email</label><input id="contact-email" name="email" type="email" required placeholder="you@example.com" data-testid="input-contact-email" /></div>
        <div className="field"><label htmlFor="contact-message">How can we work together?</label><textarea id="contact-message" name="message" required placeholder="Tell us a little about your idea, question, or project." data-testid="input-contact-message" /></div>
        <button className="button-primary" type="submit" data-testid="button-submit-contact">Send to the lab <ArrowUpRight size={14} aria-hidden="true" /></button>
      </form>}
      {sent && <button className="button-primary" onClick={onClose} data-testid="button-done-contact">Close</button>}
    </div>
  </div>;
}

function Home() {
  return <>
    <section className="home-hero" aria-labelledby="home-title">
      <div className="container-wide">
        <span className="eyebrow">P3 Health Lab · People · Planet · Place</span>
        <h1 id="home-title"><span>Understanding exposures.</span> <span>Designing interventions.</span> <span>Improving health.</span></h1>
        <p className="home-lede">We study how environmental exposures, climate change, and the places where people live, learn, work, and move influence health—and design interventions to reduce those risks.</p>
        <div className="home-identity"><strong>Dr. Egide Kalisa</strong><span>Assistant Professor, Western University</span><span>Director, P3 Health Lab / HELTH Lab</span></div>
        <div className="hero-actions"><Link href="/research" className="button-primary" data-testid="link-hero-research">Explore Our Research</Link><Link href="/people" className="button-secondary" data-testid="link-hero-people">Meet Our People</Link></div>
      </div>
    </section>

    <section className="home-block" aria-labelledby="home-intro-title">
      <div className="container-wide home-intro">
        <h2 id="home-intro-title">Addressing the growing health impacts of environmental change</h2>
        <p>At P3 Health Lab, led by Dr. Egide Kalisa at Western University, we study how environmental exposures and the places where people live, learn, work, and move shape human health. Our research combines exposure science, epidemiology, passive and active environmental sampling, environmental microbiology, citizen science, artificial intelligence, and population-health methods to better understand chemical and biological exposures, including air pollution, bioaerosols, microbial communities, and antimicrobial resistance.</p>
        <Link href="/research" className="text-link" data-testid="link-home-intro-research">Explore our research</Link>
      </div>
    </section>

    <section className="home-block" aria-labelledby="home-research-title">
      <div className="container-wide">
        <div className="home-block-head"><h2 id="home-research-title">Research areas</h2><Link href="/research" className="text-link" data-testid="link-home-research-all">All research</Link></div>
        <ul className="home-list">
          {researchThemes.map((theme, index) => <li key={theme.id}><Link href={`/research#${theme.id}`} data-testid={`card-home-research-${index}`}><h3>{theme.title}</h3><p>{theme.text}</p></Link></li>)}
        </ul>
      </div>
    </section>

    <section className="home-block" aria-labelledby="home-projects-title">
      <div className="container-wide">
        <div className="home-block-head"><h2 id="home-projects-title">Featured projects</h2><Link href="/projects" className="text-link" data-testid="link-home-projects-all">All projects</Link></div>
        <ul className="home-list">
          {featuredProjects.map((project, index) => <li key={project.title}><Link href="/projects" data-testid={`card-home-project-${index}`}><h3>{project.title}</h3><p>{project.text}</p></Link></li>)}
        </ul>
      </div>
    </section>

    <section className="home-block" aria-label="Publications and team">
      <div className="container-wide home-pair">
        <Link href="/publications" data-testid="link-home-publications"><h2>Publications</h2><p>Research and scholarship from the lab.</p></Link>
        <Link href="/people" data-testid="link-home-people"><h2>Meet the Team</h2><p>The people of P3 Health Lab.</p></Link>
      </div>
    </section>

    <section className="home-join" aria-labelledby="home-join-title">
      <div className="container-wide home-join-inner">
        <div><h2 id="home-join-title">Join the Lab</h2><p>P3 Health Lab welcomes questions from students, researchers, and potential collaborators.</p></div>
        <Link href="/get-involved" className="button-primary" data-testid="link-home-get-involved">How to join</Link>
      </div>
    </section>
  </>;
}

function PageHero({ eyebrow, title, text, action }: { eyebrow: string; title: ReactNode; text: string; action?: ReactNode }) {
  return <section className="page-hero" data-reveal="up"><div className="container-wide"><span className="eyebrow">{eyebrow}</span><h1 className="display">{title}</h1><p>{text}</p>{action && <div className="hero-actions">{action}</div>}</div></section>;
}

function Research() {
  return <div className="research-page">
    <PageHero eyebrow="Research" title="From Exposure Science to Intervention" text="P3 Health Lab examines how environmental exposures, climate change, and the places where people live, learn, work, and move influence health. Our research integrates exposure assessment, epidemiology, environmental microbiology, intervention science, and global health to understand environmental risks and develop practical solutions." />

    <section className="research-intro" aria-label="Methods and research areas">
      <div className="container-wide research-intro-grid">
        <div>
          <h2>Methods</h2>
          <p>Our research combines exposure science, epidemiology, passive and active environmental sampling, environmental microbiology, citizen science, artificial intelligence, and population-health methods.</p>
        </div>
        <nav aria-label="Research areas">
          <h2>Research areas</h2>
          <ul>
            {researchThemes.map((theme, index) => <li key={theme.id}><a href={`#${theme.id}`} data-testid={`link-research-anchor-${index}`}>{theme.title}</a></li>)}
          </ul>
        </nav>
      </div>
    </section>

    <section className="research-themes" aria-label="Research areas in detail">
      <div className="container-wide">
        {researchThemes.map((theme, index) => <article className="theme" id={theme.id} key={theme.id} data-testid={`card-research-${index}`}>
          <h2>{theme.title}</h2>
          <div className="theme-body">
            {index === 0 && <figure className="theme-figure"><img src={`${import.meta.env.BASE_URL}images/air-pollution-environmental-health.jpg`} alt="Illustration of a city skyline and river with people in the foreground" width="1040" height="460" loading="lazy" /><figcaption>Illustrative image</figcaption></figure>}
            <p>{theme.text}</p>
            <p>{theme.more}</p>
            {theme.related && <p className="theme-related">Related: <Link href={theme.related.href} className="text-link">{theme.related.label}</Link></p>}
          </div>
        </article>)}
      </div>
    </section>

    <section className="home-block research-more" aria-label="Related pages">
      <div className="container-wide">
        <ul className="research-links">
          <li><Link href="/projects" className="text-link" data-testid="link-research-projects">Projects</Link></li>
          <li><Link href="/publications" className="text-link" data-testid="link-research-publications">Publications</Link></li>
          <li><Link href="/people" className="text-link" data-testid="link-research-people">People</Link></li>
        </ul>
      </div>
    </section>
  </div>;
}

function Projects() {
  return <>
    <PageHero eyebrow="Projects" title="Projects" text="Initiatives connected to HumekaNeza, the lab's child- and youth-centred environmental-health initiative." />
    <section className="section projects-section" data-reveal="up">
      <div className="container-wide">
        <div className="projects-list">
          {projects.map((project, index) => <article className="project-entry" id={project.slug} key={project.id} data-testid={`project-${project.slug}`}>
            <div className="project-entry-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</div>
            <div className="project-entry-content">
              <div className="project-entry-heading">
                <div>
                  <h2>{project.title}</h2>
                  {project.subtitle && <p className="project-subtitle">{project.subtitle}</p>}
                </div>
                {project.location && <span className="project-location">{project.location}</span>}
              </div>
              <div className="project-entry-body">
                <div>
                  {project.description.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
                {(project.activities || project.focus) && <div className="project-focus">
                  <h3>{project.activities ? 'Activities' : 'Focus'}</h3>
                  <ul>{(project.activities ?? project.focus)?.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>}
                {project.process && <p className="project-process">{project.process}</p>}
                {project.closing && <p className="project-closing">{project.closing}</p>}
              </div>
            </div>
          </article>)}
        </div>
      </div>
    </section>
  </>;
}

function People() {
  return (
    <>
      <PageHero
        eyebrow="People / 02"
        title={<>The people behind the <em>work.</em></>}
        text="P3 Health Lab / HELTH Lab is directed by Dr. Egide Kalisa at Western University. Current and former team members are listed with the roles and affiliations provided."
      />
      <section className="section people-section" data-reveal="up">
        <div className="container-wide">
          <div className="section-head">
            <div>
              <span className="eyebrow">People at P3 Health Lab</span>
              <h2>A careful record of the lab team.</h2>
            </div>
            <p>Roles, affiliations, and research interests are included only where supplied.</p>
          </div>
          <div className="people-groups">
            {peopleGroups.map((group) => (
              <section className={`people-group ${group.id === 'principal-investigator' ? 'people-group-featured' : ''}`} id={group.id} key={group.id}>
                <h2>{group.title}</h2>
                <div className="people-record-grid">
                  {group.people.map((person) => (
                    <article className="person-record" key={person.name} data-testid={`card-person-${person.name.toLowerCase().replaceAll(' ', '-')}`}>
                      <h3>{person.name}</h3>
                      <dl className="person-record-details">
                        <div>
                          <dt>Role</dt>
                          <dd>{person.role}</dd>
                        </div>
                        {person.institution && (
                          <div>
                            <dt>Institution</dt>
                            <dd>{person.institution}</dd>
                          </div>
                        )}
                        {person.country && (
                          <div>
                            <dt>Country</dt>
                            <dd>{person.country}</dd>
                          </div>
                        )}
                        {person.currentPosition && (
                          <div>
                            <dt>Current position</dt>
                            <dd>{person.currentPosition}</dd>
                          </div>
                        )}
                        {person.formerRole && (
                          <div>
                            <dt>Former role</dt>
                            <dd>{person.formerRole}</dd>
                          </div>
                        )}
                        {person.researchFocus && (
                          <div>
                            <dt>Research focus</dt>
                            <dd>{person.researchFocus}</dd>
                          </div>
                        )}
                      </dl>
                      {person.status && <p className="person-record-status">{person.status}</p>}
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
      <section className="contact-band" id="join" data-reveal="up">
        <div className="container-wide contact-grid">
          <div><span className="eyebrow">Join the lab</span><h2>Bring a question, not a template.</h2></div>
          <Link href="/get-involved" className="button-primary" data-testid="link-people-join">Find your pathway <ArrowUpRight size={15} aria-hidden="true" /></Link>
        </div>
      </section>
    </>
  );
}

function About() {
  return <><PageHero eyebrow="About / 07" title={<>Dr. Egide <em>Kalisa.</em></>} text="Assistant Professor at Western University and Director of P3 Health Lab / HELTH Lab." /><section className="section" data-reveal="up"><div className="container-wide intro-grid"><div><span className="eyebrow">Academic profile</span><div className="intro-stat"><b>01</b><span>Assistant Professor · Western University</span></div><div className="intro-stat" style={{ marginTop: 30 }}><b>02</b><span>Director · P3 Health Lab / HELTH Lab</span></div></div><div><p className="intro-copy">Research across <mark>people, planet, and place.</mark></p><p className="tiny-copy">Dr. Egide Kalisa’s work examines how environmental exposures, climate change, and the places where people live, learn, work, and move influence health, with attention to practical interventions.</p></div></div></section><section className="section section-tinted" data-reveal="up"><div className="container-wide"><div className="section-head"><div><span className="eyebrow">Research interests</span><h2>Questions grounded in environmental health.</h2></div><p>These areas reflect the research themes already established across the P3 Health Lab record.</p></div><div className="focus-grid">{researchThemes.map((topic, index) => <article className="focus-item" key={topic.id} data-reveal="up" style={{ transitionDelay: `${index * 70}ms` }}><span className="focus-number">{String(index + 1).padStart(2, '0')}</span><h3>{topic.title}</h3><p>{topic.text}</p></article>)}</div></div></section></>;
}

function Publications() {
  return <><PageHero eyebrow="Scholarship / 03" title={<>Evidence worth <em>sharing.</em></>} text="Publication details will be listed here as source records are verified." /><section className="section" data-reveal="up"><div className="container-wide"><div className="section-head"><div><span className="eyebrow">Publication record</span><h2>A careful record is being prepared.</h2></div><p>No publication entries are shown until their bibliographic details can be checked against reliable source material.</p></div><div className="publication-list"><div className="publication-empty" data-testid="empty-publications"><span className="publication-year">Pending</span><div><h3>Verified publication records are not available yet.</h3><p>Titles, authors, journals, years, DOIs, citation counts, findings, and publication links will be added only when they are verified.</p><p>Google Scholar will be the primary external destination once its profile URL is confirmed. ORCID, CV PDF, and Western University profile links will be added only after their destinations are verified.</p></div><span className="pub-type">Record pending</span></div></div></div></section></>;
}

function News() {
  return <><PageHero eyebrow="News / 08" title={<>The work, <em>as it unfolds.</em></>} text="Verified news from P3 Health Lab will be shared here as records become available." /><section className="section" data-reveal="up"><div className="container-wide"><div className="section-head"><div><span className="eyebrow">Lab news</span><h2>A careful record is being prepared.</h2></div><p>No verified news items are currently available in the project material.</p></div><div className="publication-list"><div className="publication-empty news-empty" data-testid="empty-news"><span className="publication-year">Pending</span><div><h3>Verified lab news is not available yet.</h3><p>Dates, headlines, summaries, images, and links will be added only when source records are verified.</p></div><span className="pub-type">Record pending</span></div></div></div></section></>;
}

function Contact() {
  return <><PageHero eyebrow="Contact / 09" title={<>A clear way to <em>connect.</em></>} text="P3 Health Lab / HELTH Lab is directed by Dr. Egide Kalisa at Western University." /><section className="section" data-reveal="up"><div className="container-wide intro-grid"><div><span className="eyebrow">Lab contact</span><h2>Dr. Egide Kalisa</h2><div className="intro-stat"><b>01</b><span>Assistant Professor · Western University</span></div><div className="intro-stat" style={{ marginTop: 30 }}><b>02</b><span>Director · P3 Health Lab / HELTH Lab</span></div></div><div><p className="intro-copy">Connect with <mark>the lab.</mark></p><p className="tiny-copy">For inquiries, use the verified lab email.</p><a className="button-secondary" href="mailto:p3healthlab@uwo.ca" data-testid="link-contact-email">p3healthlab@uwo.ca <ArrowUpRight size={14} aria-hidden="true" /></a></div></div></section><section className="section section-tinted" data-reveal="up"><div className="container-wide section-head"><div><span className="eyebrow">Location</span><h2>Western University</h2></div><div><p>London, Ontario<br />Canada</p><a className="button-secondary" href="https://www.uwo.ca" target="_blank" rel="noreferrer" data-testid="link-contact-western">Visit Western University <ExternalLink size={12} aria-hidden="true" /></a></div></div></section><section className="section" data-reveal="up"><div className="container-wide section-head"><div><span className="eyebrow">Additional details</span><h2>Contact information is being updated.</h2></div><p>No verified phone number, office number, department, or additional academic profile links are currently available.</p></div></section></>;
}

function Teaching() {
  const renderYear = (year: keyof typeof courses) => (
    <div className="teaching-year" key={year} data-reveal="up">
      <div className="teaching-year-heading">
        <span className="eyebrow">Academic year</span>
        <h3>{year}</h3>
      </div>
      <div className="teaching-course-list">
        {courses[year].map((course, index) => (
          <article className="teaching-course-row" key={`${year}-${course.code}`} data-testid={`course-${year}-${index}`}>
            <span className="course-code">{course.code}</span>
            <h4>{course.title}</h4>
          </article>
        ))}
      </div>
    </div>
  );

  const teachingRoutes = [
    ['Research', '/research'],
    ['People', '/people'],
    ['Publications', '/publications'],
    ['Teaching', '/teaching'],
    ['Projects', '/projects'],
    ['Contact', '/contact'],
  ] as const;

  return <div className="teaching-page">
    <PageHero
      eyebrow="Teaching / 04"
      title="Teaching"
      text="Teaching in global health and One Health connects foundational knowledge with field-based learning, interdisciplinary collaboration, and real-world environmental and population-health challenges."
    />
    <section className="section teaching-courses" aria-labelledby="teaching-courses-title" data-reveal="up">
      <div className="container-wide">
        <div className="teaching-section-heading">
          <div><span className="eyebrow">Current Teaching</span><h2 id="teaching-courses-title">Current courses</h2></div>
          <p>Course codes and titles are listed by academic year.</p>
        </div>
        <div className="teaching-course-block teaching-current">{renderYear('2026–2027')}</div>
        <div className="teaching-course-block">
          <div className="teaching-section-heading">
            <div><span className="eyebrow">Previous Teaching</span><h2>Previous courses</h2></div>
          </div>
          <div className="teaching-year-grid">
            {renderYear('2025–2026')}
            {renderYear('2024–2025')}
          </div>
        </div>
      </div>
    </section>
    <section className="section section-tinted teaching-details-section" aria-label="Teaching approach" data-reveal="up">
      <div className="container-wide teaching-detail-grid">
        <article className="teaching-detail">
          <span className="eyebrow">Teaching Philosophy</span>
          <h2>Teaching Philosophy</h2>
          <p>Teaching connects global health, One Health, environmental health, and field-based learning. It emphasizes interdisciplinary learning, practical experience, critical thinking, and connecting evidence to real-world health challenges.</p>
        </article>
        <article className="teaching-detail">
          <span className="eyebrow">Graduate Supervision</span>
          <h2>Graduate Supervision</h2>
          <p>Graduate supervision is connected to the lab’s research areas, including environmental health, exposure science, air pollution, climate-health, One Health, global health, epidemiology, and intervention research.</p>
        </article>
        <article className="teaching-detail">
          <span className="eyebrow">Experiential &amp; Field-Based Teaching</span>
          <h2>Experiential &amp; Field-Based Teaching</h2>
          <p>The International Field School supports field-based learning and interdisciplinary learning, connecting evidence with real-world health challenges.</p>
        </article>
      </div>
    </section>
    <section className="section teaching-links-section" aria-labelledby="teaching-links-title" data-reveal="up">
      <div className="container-wide">
        <div className="teaching-section-heading">
          <div><span className="eyebrow">Explore the lab</span><h2 id="teaching-links-title">Related pages</h2></div>
        </div>
        <nav className="teaching-links" aria-label="Related P3 Health Lab pages">
          {teachingRoutes.map(([label, href]) => <Link className="teaching-route-link" href={href} key={href}>{label}</Link>)}
        </nav>
      </div>
    </section>
  </div>;
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
  const categories = [
    ['01', 'PhD Students'],
    ['02', 'MSc Students'],
    ['03', 'Postdoctoral Fellows'],
    ['04', 'Undergraduate Researchers'],
    ['05', 'Visiting Researchers & Students'],
  ];
  return <><PageHero eyebrow="Get involved / 06" title={<>Join the <em>lab.</em></>} text="P3 Health Lab welcomes questions from students, researchers, and potential collaborators. Current recruitment details are not specified in the available project material." /><section className="section" id="opportunities" data-reveal="up"><div className="container-wide"><div className="section-head"><div><span className="eyebrow">Prospective members</span><h2>Opportunities are not currently specified.</h2></div><p>The lab’s available materials identify these academic categories, but do not confirm current openings or eligibility.</p></div><div className="path-grid">{categories.map(([number, title], index) => <article className="path-card" key={title} data-reveal="scale" style={{ transitionDelay: `${index * 70}ms` }} data-testid={`card-opportunity-${index}`}><div className="card-number"><span>{number}</span></div><h3>{title}</h3><p>Current availability is not provided.</p></article>)}</div></div></section><section className="section section-tinted" data-reveal="up"><div className="container-wide section-head"><div><span className="eyebrow">Application information</span><h2>Requirements and deadlines are not published.</h2></div><p>Funding, application deadlines, required documents, and other recruitment instructions are not currently specified in the verified project material.</p></div></section><section className="contact-band" id="contact" data-reveal="up"><div className="container-wide contact-grid"><div><span className="eyebrow">Contact the lab</span><h2>Ask about the current path.</h2><p>For a current question about joining or collaborating, use the lab’s existing contact address.</p></div><a className="button-primary" href="mailto:p3healthlab@uwo.ca" data-testid="link-involved-email">Email the lab <ArrowUpRight size={15} aria-hidden="true" /></a></div></section></>;
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
    <Route path="/news" component={News} />
    <Route path="/contact" component={Contact} />
    <Route path="/teaching" component={Teaching} />
    <Route path="/humekaneza" component={Humekaneza} />
    <Route path="/get-involved" component={GetInvolved} />
    <Route path="/upload" component={AdminUploadGate} />
    <Route path="/admin" component={AdminGate} />
    <Route path="/admin/login" component={AdminGate} />
    <Route path="/admin/dashboard" component={AdminGate} />
    <Route path="/admin/people" component={AdminGate} />
    <Route path="/admin/projects" component={AdminGate} />
    <Route path="/admin/news" component={AdminGate} />
    <Route path="/admin/media" component={AdminGate} />
    <Route path="/admin/research-areas" component={AdminGate} />
    <Route path="/admin/teaching" component={AdminGate} />
    <Route path="/admin/profile" component={AdminGate} />
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