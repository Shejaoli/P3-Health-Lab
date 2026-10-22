import { Fragment, type MouseEvent as ReactMouseEvent, type ReactNode, useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowUpRight, ChevronRight, Check, CircleArrowUp, ExternalLink, X } from 'lucide-react';
import { Link, Redirect, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AdminGate, AdminLoginPanel, AdminUploadGate } from '@/admin/AdminApp';
import { useGetPublicOpportunities, useGetPublicProfile, useGetPublicTeaching } from '@workspace/api-client-react';
import { people } from '@/data/people';
import { publications } from '@/data/publications';
import { HumekaNezaPage } from '@/pages/HumekaNezaPage';
import { GlobalResearchMapPage } from '@/pages/GlobalResearchMapPage';
import { ContactPageSection } from '@/pages/ContactPageSection';
import '@/pages/p3-home-projects.css';
import labFilm from '@assets/VID-20260925-WA0008_1790438330372.mp4';

const queryClient = new QueryClient();
const googleScholarUrl = 'https://scholar.google.co.nz/citations?user=yAPiYq8AAAAJ&hl=en';
const publicationCovers = [
  { src: '/images/p3/publications-covers/acs-est-air-cover-a.jpg', alt: 'Cover of ACS ES&T Air.', width: 1860, height: 2474 },
  { src: '/images/p3/publications-covers/acs-est-air-cover-b.jpg', alt: 'Cover of another ACS ES&T Air issue.', width: 1860, height: 2474 },
  { src: '/images/p3/publications-covers/environmental-science-advances-cover.jpg', alt: 'Cover of Environmental Science: Advances.', width: 800, height: 1047 },
];
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
    const revealInitialViewport = window.requestAnimationFrame(() => {
      elements.forEach((element) => {
        const bounds = element.getBoundingClientRect();
        if (bounds.top < window.innerHeight && bounds.bottom > 0) element.classList.add('is-visible');
      });
    });
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(revealInitialViewport);
    };
  }, [routeKey]);
}

type ResearchImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  fit?: 'cover' | 'contain';
};

const researchPrograms: {
  id: string;
  title: string;
  text: string;
  image?: string;
  imageAlt?: string;
  gallery: ResearchImage[];
  questions: string[];
  projects: { label: string; href?: string; logo?: string }[];
}[] = [
  {
    id: 'air-we-breathe',
    title: 'The Air We Breathe: Beyond PM2.5',
    text: 'Understanding the chemical and biological mixtures that shape what people actually breathe.',
    image: 'research-air-monitoring-upright.jpg',
    imageAlt: 'Air-quality sampling instruments beside a road and trees.',
    gallery: [
      { src: 'p3/research/program-1-air-we-breathe/chemical-biological-mixture-diagram.png', alt: 'Diagram of chemical and biological mixtures in the air.', width: 2285, height: 880, fit: 'contain' },
      { src: 'p3/research/program-1-air-we-breathe/canadian-air-microbiome-study-design.jpg', alt: 'Study design for measuring the Canadian air microbiome.', width: 9600, height: 6900, fit: 'contain' },
      { src: 'p3/research/program-1-air-we-breathe/air-sampling-field-illustration.png', alt: 'Illustration of air sampling in the field.', width: 2240, height: 1260, fit: 'contain' },
      { src: 'p3/research/program-1-air-we-breathe/pollution-sources-illustration.png', alt: 'Illustration of common sources of air pollution.', width: 1770, height: 420, fit: 'contain' },
    ],
    questions: [
      'What does PM2.5 mass miss about chemical and biological composition?',
      'How do source mixtures vary across places and seasons?',
      'How can passive and low-cost monitoring expand exposure science?',
    ],
    projects: [
      { label: 'Beyond PM2.5' },
      { label: 'APAM-Net', logo: '/images/p3/logos/project/bacana-logo.png' },
      { label: 'Canadian air microbiome' },
      { label: 'Amazon air microbiome' },
    ],
  },
  {
    id: 'children-schools-exposure',
    title: 'Children, Schools & Personal Exposure',
    text: 'Studying children’s exposure across the school day, in classrooms, and along routes to school.',
    gallery: [
      { src: 'p3/research/program-2-children-schools/school-neighbourhood-traffic-illustration.jpg', alt: 'Illustration of traffic and exposure around a school neighbourhood.', width: 856, height: 609, fit: 'contain' },
      { src: 'p3/research/program-2-children-schools/indoor-exposure-house-model.jpg', alt: 'Model illustrating indoor exposure across different parts of a home.', width: 4093, height: 2894, fit: 'contain' },
    ],
    questions: [
      'How do children’s exposures vary across classrooms, school days, and journeys to school?',
      'Which practical changes can support cleaner air in classrooms and school zones?',
      'How can personal and school-based monitoring inform healthier learning environments?',
    ],
    projects: [
      { label: '24-Hour Schoolchild' },
      { label: 'Routes to school', href: '/research-project#clean-air-school-zones' },
      { label: 'CLEAN RIDE' },
    ],
  },
  {
    id: 'climate-wildfire-resilience',
    title: 'Climate, Wildfire & Environmental Resilience',
    text: 'Examining how climate-related hazards, including heat and wildfire smoke, affect exposure and health.',
    image: 'research-climate-monitoring.jpg',
    imageAlt: 'Outdoor weather and air-monitoring equipment at a fenced field site in winter.',
    gallery: [
      { src: 'p3/research/program-3-climate-wildfire/kigali-greenspace-map.png', alt: 'Map of green spaces in Kigali.', width: 1040, height: 734, fit: 'contain' },
      { src: 'p3/projects/08-equitable-air-quality-communication/smoky-industry-illustration.jpg', alt: 'Illustration of industrial air pollution and exposure risks.', width: 4093, height: 2894, fit: 'contain' },
    ],
    questions: [
      'How do heat and air pollution combine to shape environmental exposure?',
      'How do wildfire smoke and other climate hazards affect communities?',
      'Which locally relevant strategies can strengthen protection and resilience?',
    ],
    projects: [
      { label: 'BREATHE-East Africa' },
      { label: 'Heat x air pollution' },
      { label: 'Wildfire protection', href: '/research-project#equitable-air-quality-communication' },
    ],
  },
  {
    id: 'healthy-equitable-mobility',
    title: 'Healthy & Equitable Mobility',
    text: 'Connecting transportation, everyday exposure, and healthier, more equitable ways to move.',
    image: 'research-healthy-mobility.jpg',
    imageAlt: 'A field researcher carrying exposure monitors while walking on a tree-lined street.',
    gallery: [
      { src: 'p3/research/program-4-mobility/commute-mode-exposure-clean.png', alt: 'Diagram comparing exposure across different commute modes.', width: 5267, height: 2858, fit: 'contain' },
      { src: 'p3/research/program-4-mobility/cyclists-illustration.jpg', alt: 'Illustration of people cycling as an active travel option.', width: 742, height: 525, fit: 'contain' },
      { src: 'p3/research/program-4-mobility/green-electric-bus-illustration.jpg', alt: 'Illustration of an electric bus in a greener transport system.', width: 748, height: 529, fit: 'contain' },
      { src: 'p3/research/program-4-mobility/bike-with-sensor-photo-b.jpg', alt: 'A bicycle equipped with a sensor for exposure monitoring.', width: 612, height: 816 },
    ],
    questions: [
      'How do transport patterns shape exposure along everyday routes?',
      'Which mobility choices can reduce exposure while supporting active travel?',
      'How do transport, urban environments, and equity intersect in different places?',
    ],
    projects: [
      { label: 'MOVE-Africa' },
      { label: 'MOVE-Canada' },
      { label: 'Rwanda healthy mobility' },
    ],
  },
  {
    id: 'citizen-science-environmental-justice',
    title: 'Citizen Science & Environmental Justice',
    text: 'Supporting meaningful community participation in environmental-health research and action.',
    gallery: [],
    questions: [
      'How can citizen science make environmental exposures visible and useful to communities?',
      'How can young people participate in environmental-health research and decision-making?',
      'How can research support more equitable access to information and action?',
    ],
    projects: [
      { label: 'Making the Invisible Visible', href: '/research-project#making-the-invisible-visible' },
      { label: 'ACB youth' },
      { label: 'SHARED SKIES', href: '/research-project#shared-skies' },
    ],
  },
];

type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  fit?: 'cover' | 'contain';
};

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
  images: ProjectImage[];
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
    images: [
      { src: '/images/p3/projects/01-humekaneza-school-campaign/child-poster-enough-is-enough.jpg', alt: 'A child-created poster calling attention to air pollution.', width: 1920, height: 1280 },
      { src: '/images/p3/projects/01-humekaneza-school-campaign/child-poster-stop-cutting-trees.jpg', alt: 'A child-created poster encouraging protection of trees.', width: 1920, height: 1281 },
    ],
  },
  {
    id: 'i-am-an-air-quality-scientist',
    slug: 'i-am-an-air-quality-scientist',
    title: 'I Am an Air Quality Scientist',
    description: [
      'Students become citizen scientists by using air-quality monitors and other scientific tools to investigate pollution in their schools and communities.',
      'The initiative introduces children to environmental-health science while building scientific literacy, curiosity, confidence, and practical understanding of environmental data.',
    ],
    images: [],
  },
  {
    id: 'one-sensor-per-school',
    slug: 'one-sensor-per-school',
    title: 'One Sensor Per School',
    description: [
      'This initiative aims to make air pollution visible by placing low-cost air-quality sensors in participating schools.',
      'Students and teachers can observe how air pollution changes throughout the day and explore how traffic, weather, indoor activities, and other factors affect the air they breathe.',
    ],
    images: [
      { src: '/images/p3/projects/03-one-sensor-per-school/school-courtyard-sensor-trees.jpg', alt: 'Air-quality monitoring equipment installed in a tree-lined school courtyard.', width: 1920, height: 1083 },
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
    images: [
      { src: '/images/p3/projects/04-classroom-clean-air/classroom-air-purifier-diagram.jpg', alt: 'Diagram showing an air purifier cleaning air in a classroom.', width: 1448, height: 1086, fit: 'contain' },
      { src: '/images/p3/projects/04-classroom-clean-air/green-classroom-illustration.jpg', alt: 'Illustration of a greener, more sustainable classroom.', width: 1833, height: 1033, fit: 'contain' },
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
    images: [
      { src: '/images/p3/projects/05-clean-air-school-zones/school-zone-traffic-sensors.jpg', alt: 'Air-quality sensors monitor traffic near a school zone.', width: 1833, height: 1033 },
      { src: '/images/p3/projects/05-clean-air-school-zones/children-walking-to-school-guide.jpg', alt: 'Illustrated guide to children walking to school by a cleaner route.', width: 1166, height: 831, fit: 'contain' },
      { src: '/images/p3/projects/05-clean-air-school-zones/school-bus-drop-off.jpg', alt: 'School bus drop-off area near a school.', width: 1684, height: 1191 },
      { src: '/images/p3/projects/05-clean-air-school-zones/ebus-vs-diesel-school-bus.jpg', alt: 'Illustration comparing an electric school bus with a diesel bus.', width: 1920, height: 1358, fit: 'contain' },
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
    images: [
      { src: '/images/p3/projects/06-shared-skies/canada-rwanda-global-classroom.png', alt: 'Graphic connecting a Canada–Rwanda classroom exchange.', width: 1920, height: 1111, fit: 'contain' },
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
    images: [
      { src: '/images/p3/projects/07-making-the-invisible-visible/school-interventions-circle.png', alt: 'Illustrated overview of school-based air-quality interventions.', width: 1920, height: 1082, fit: 'contain' },
    ],
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
    images: [
      { src: '/images/p3/projects/08-equitable-air-quality-communication/children-walking-in-smoke.jpg', alt: 'Children walk along a road on a smoky day.', width: 694, height: 489 },
      { src: '/images/p3/projects/08-equitable-air-quality-communication/smoky-industry-illustration.jpg', alt: 'Illustration of industrial air pollution and exposure risks.', width: 1920, height: 1358, fit: 'contain' },
    ],
  },
];

const profileResearchInterests = [
  'Air Pollution',
  'Climate Change',
  'Children’s Environmental Health',
  'Environmental Justice',
  'One Health',
  'Exposure Science',
] as const;

const funderLogos = [
  { src: '/images/funder-logo-01.png', alt: 'Environment and Climate Change Canada and Canada wordmark' },
  { src: '/images/funder-logo-02.png', alt: 'Natural Sciences and Engineering Research Council of Canada, NSERC and CRSNG' },
  { src: '/images/funder-logo-03.png', alt: 'Canadian Institutes of Health Research, CIHR and IRSC' },
  { src: '/images/funder-logo-04.png', alt: 'Social Sciences and Humanities Research Council of Canada, SSHRC and CRSH' },
  { src: '/images/funder-logo-05.png', alt: 'American Geophysical Union, AGU' },
  { src: '/images/funder-logo-06.png', alt: 'National Institutes of Health, NIH' },
  { src: '/images/funder-logo-07.png', alt: 'Schulich School of Medicine & Dentistry at Western University' },
  { src: '/images/funder-logo-08.png', alt: 'UNESCO and The World Academy of Sciences (TWAS)' },
  { src: '/images/funder-logo-09.png', alt: 'National Council for Science and Technology, NCST' },
];

function Shell({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [adminEntryOpen, setAdminEntryOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openMobileMenu, setOpenMobileMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const adminClickRef = useRef({ count: 0, lastClick: 0 });
  const nav: { label: string; href: string; external?: boolean; children?: [string, string][] }[] = [
    { label: 'Research Project', href: '/research-project' },
    { label: 'Global Map', href: '/research-map' },
    { label: 'People', href: '/people' },
    { label: 'Publications', href: '/publications' },
    { label: 'HumekaNeza', href: '/humekaneza' },
    { label: 'Teaching', href: '/teaching' },
    { label: 'Opportunity', href: '/opportunity' },
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
    const pageTitle = location === '/humekaneza'
      ? 'HumekaNeza · Clean Air for Every Child'
      : location === '/' ? 'P3 Health Lab · People, Place, Planet' : `P3 Health Lab · ${location.slice(1).replace('-', ' ')}`;
    document.title = pageTitle;
    const description = location === '/humekaneza'
      ? 'HumekaNeza brings air-quality learning, citizen science and practical action into schools and communities.'
      : 'P3 Health Lab at Western University studies environmental exposures and health with communities across Canada and Africa.';
    let descriptionTag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!descriptionTag) {
      descriptionTag = document.createElement('meta');
      descriptionTag.name = 'description';
      document.head.append(descriptionTag);
    }
    descriptionTag.content = description;
    return () => window.cancelAnimationFrame(frame);
  }, [location]);
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (menuOpen) menuButtonRef.current?.focus();
        setOpenMenu(null);
        setOpenMobileMenu(null);
        setMenuOpen(false);
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
  }, [menuOpen]);
  useEffect(() => {
    const openContact = () => setContactOpen(true);
    window.addEventListener('open-contact', openContact);
    return () => window.removeEventListener('open-contact', openContact);
  }, []);
  const handleAdminLogoClick = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    const now = Date.now();
    if (now - adminClickRef.current.lastClick > 1400) adminClickRef.current.count = 0;
    adminClickRef.current.count += 1;
    adminClickRef.current.lastClick = now;
    if (adminClickRef.current.count === 3) {
      adminClickRef.current.count = 0;
      event.preventDefault();
      setAdminEntryOpen(true);
    }
  };
  if (location.startsWith('/admin') || location === '/upload') return <div className="admin-route-shell">{children}</div>;
  if (location === '/humekaneza') return <>{children}</>;
  return (
    <div className="site-shell noise">
      <header className="site-header" ref={navRef}>
        <div className="container-wide header-inner">
          <Link href="/" className="brand" aria-label="P3 Health Lab home" data-testid="link-brand">
            <img src="/images/p3-mark.png" alt="" />
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
            ) : item.external
              ? <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className="nav-link" data-testid={`link-nav-${item.label.toLowerCase()}`}>{item.label}<ExternalLink size={12} aria-hidden="true" /></a>
              : <Link key={item.href} href={item.href} className={`nav-link ${isActive(item.href) ? 'active' : ''}`} data-testid={`link-nav-${item.label.toLowerCase()}`}>{item.label}</Link>)}
          </nav>
          <button ref={menuButtonRef} className={`menu-btn ${menuOpen ? 'is-open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="mobile-navigation" data-testid="button-mobile-menu">
            <span className="hamburger-icon" aria-hidden="true"><span /><span /><span /></span>
          </button>
        </div>
        <nav id="mobile-navigation" className="mobile-menu" aria-label="Mobile navigation" hidden={!menuOpen}>
          {nav.map((item) => item.children ? (
            <div className="mobile-dropdown" key={item.href}>
              <button className={`mobile-link mobile-trigger ${isActive(item.href) ? 'active' : ''}`} aria-expanded={openMobileMenu === item.label} onClick={() => setOpenMobileMenu(openMobileMenu === item.label ? null : item.label)}>
                {item.label}<ChevronRight className={openMobileMenu === item.label ? 'chevron-open' : ''} size={16} aria-hidden="true" />
              </button>
                {openMobileMenu === item.label && <div className="mobile-submenu">
                {item.children.map(([childLabel, childHref]) => <Link key={childHref} href={childHref} className="mobile-sublink" onClick={(event) => handleSubnavClick(event, childHref)} data-testid={`link-mobile-${childLabel.toLowerCase().replaceAll(' ', '-')}`}>{childLabel}</Link>)}
              </div>}
            </div>
          ) : item.external
            ? <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className="mobile-link" onClick={() => setMenuOpen(false)} data-testid={`link-mobile-${item.label.toLowerCase().replaceAll(' ', '-')}`}>{item.label}<ExternalLink size={13} aria-hidden="true" /></a>
            : <Link key={item.href} href={item.href} className={`mobile-link ${isActive(item.href) ? 'active' : ''}`} data-testid={`link-mobile-${item.label.toLowerCase().replaceAll(' ', '-')}`}>{item.label}</Link>)}
        </nav>
      </header>
      <main>{children}</main>
      <Footer onLogoClick={handleAdminLogoClick} />
      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
      {adminEntryOpen && <AdminLoginPanel onClose={() => setAdminEntryOpen(false)} onAuthenticated={() => { setAdminEntryOpen(false); setLocation('/admin/dashboard'); }} />}
    </div>
  );
}

function Footer({ onLogoClick }: { onLogoClick: (event: ReactMouseEvent<HTMLAnchorElement>) => void }) {
  return <footer className="footer">
    <div className="container-wide footer-grid">
      <section className="footer-contact" aria-label="P3 Health Lab contact">
        <Link href="/" className="footer-brandline" onClick={onLogoClick} aria-label="P3 Health Lab home">
          <img src="/images/p3-mark.png" alt="" width="40" height="40" />
          <span><strong>P3 Health Lab</strong><small>People · Place · Planet</small></span>
        </Link>
        <div className="footer-contact-copy">
          <strong>Dr. Egide Kalisa</strong>
          <span>Epidemiology &amp; Biostatistics, Schulich School of Medicine &amp; Dentistry</span>
          <span>Western University, London, Ontario, Canada</span>
        </div>
        <a className="footer-contact-button" href="https://www.schulich.uwo.ca/epibio/people/faculty/core_faculty/dr_egide_kalisa.html" target="_blank" rel="noopener noreferrer">
          Contact via Western profile <ExternalLink size={13} aria-hidden="true" />
        </a>
      </section>
      <nav className="footer-column" aria-label="Explore">
        <h2>Explore</h2>
        <Link href="/research-project">Research Project</Link>
        <Link href="/research-map">Global Map</Link>
        <Link href="/people">People</Link>
        <Link href="/publications">Publications</Link>
        <Link href="/humekaneza">HumekaNeza</Link>
        <Link href="/teaching">Teaching</Link>
        <Link href="/opportunity">Opportunity</Link>
        <Link href="/contact">Contact</Link>
      </nav>
      <nav className="footer-column" aria-label="Elsewhere">
        <h2>Elsewhere</h2>
        <a href="https://www.schulich.uwo.ca/epibio/people/faculty/core_faculty/dr_egide_kalisa.html" target="_blank" rel="noopener noreferrer">Western faculty profile</a>
        <a href="https://www.linkedin.com/in/egide-kalisa-1b8b40321/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="https://magazine.westernu.ca/healing-rwanda/" target="_blank" rel="noopener noreferrer">Western Alumni Magazine: Healing Rwanda</a>
        <a href="https://www.youtube.com/watch?v=J6brEhfvNbY" target="_blank" rel="noopener noreferrer">The Impact Project video</a>
        <a href="https://egidekalisa.com" target="_blank" rel="noopener noreferrer">egidekalisa.com</a>
      </nav>
    </div>
    <div className="container-wide footer-bottom">
      <span>© {new Date().getFullYear()} P3 Health Lab, Western University</span>
      <span>Research for cleaner air, healthier lives, brighter tomorrows.</span>
    </div>
  </footer>;
}

function ContactModal({ onClose }: { onClose: () => void }) {
  const [sent, setSent] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { data: profileData, isLoading: isProfileLoading } = useGetPublicProfile();
  const contactEmail = profileData?.contact.contactEmail ?? profileData?.contact.labEmail;
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
      {sent ? <div className="success-note" role="status" data-testid="status-contact-success"><strong>Your message is ready to send.</strong><br />Your email app should open with the verified contact address and your message.</div>
        : isProfileLoading && !contactEmail ? <p className="success-note" role="status">Loading verified contact information…</p>
          : !contactEmail ? <p className="success-note" role="status">Contact information is not currently available.</p>
            : <form onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const name = String(formData.get('name') ?? '');
              const email = String(formData.get('email') ?? '');
              const message = String(formData.get('message') ?? '');
              const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
              window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent('P3 Health Lab enquiry')}&body=${encodeURIComponent(body)}`;
              setSent(true);
            }} data-testid="form-contact">
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
  const director = people.director;

  const programDescriptions = [
    'The chemical and biological mixtures that shape what people actually breathe, from fine particles to airborne microbes.',
    'Children’s exposures across home, school, travel and daily life, and how practical changes can support cleaner air.',
    'Climate-related air-pollution risks, including heat and wildfire smoke, and locally relevant ways to protect people.',
    'How transport systems and mobility policies influence exposure, health and equity in Africa and Canada.',
    'Partnering with communities to make environmental risks visible, understandable and actionable.',
  ];
  const programImages = [
    ['/images/design-reference/sampler-illus.jpg', 'Illustration of a researcher deploying a passive air sampler.'],
    ['/images/p3/research/program-2-children-schools/indoor-exposure-house-model.jpg', 'Model illustrating indoor exposure across different parts of a home.'],
    ['/images/design-reference/house.jpg', 'Illustration of a home and indoor air pathways.'],
    ['/images/design-reference/ebus.jpg', 'Illustration of electric and diesel school buses.'],
    ['/images/design-reference/global-classroom.jpg', 'Illustration of students in Canada and Africa connected through a global classroom.'],
  ];

  return <div className="p3-home">
    <section className="p3-home-hero" aria-labelledby="home-title">
      <div className="container-wide p3-home-hero-grid">
        <div className="p3-home-hero-copy">
          <div className="p3-home-affiliations"><span>Assistant Professor • Schulich School of Medicine &amp; Dentistry • Western University</span></div>
          <h1 id="home-title">{director.name}</h1>
          <p className="p3-home-tagline">Research for cleaner air, healthier lives, brighter tomorrows.</p>
          <p className="p3-home-intro">I lead the P3 Health Lab’s research on what people breathe: air’s chemical and biological mixtures, from fine particles and polycyclic aromatic hydrocarbons to airborne microbes and environmental DNA. With communities, schools and governments across Canada and Africa, we turn evidence into cleaner air and fairer health.</p>
          <div className="p3-home-actions">
            <Link href="/research-project" className="p3-home-primary" data-testid="link-home-hero-research">Explore our research <ArrowUpRight size={15} aria-hidden="true" /></Link>
            <a href="#research-framework" className="p3-home-secondary">Research framework</a>
          </div>
          <Link href="/opportunity" className="p3-home-opportunity">Prospective students &amp; collaborators <span>Explore opportunities <ArrowUpRight size={14} aria-hidden="true" /></span></Link>
          <div className="p3-home-profile-links" aria-label="Dr. Egide Kalisa profiles">
            <a href="https://www.schulich.uwo.ca/epibio/people/faculty/core_faculty/dr_egide_kalisa.html" target="_blank" rel="noopener noreferrer">Western faculty profile ↗</a>
            <a href="https://www.linkedin.com/in/egide-kalisa-1b8b40321/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
            <Link href="/publications">Publications</Link>
          </div>
        </div>
        <figure className="p3-home-portrait">
          <img src="/images/design-reference/portrait.jpg" alt={`Portrait of ${director.name}.`} width="1000" height="1250" fetchPriority="high" decoding="async" />
          <figcaption><img src="/images/p3-mark.png" alt="" width="52" height="52" /><span><strong>Director, P3 Health Lab</strong>Western University · London, Ontario</span></figcaption>
        </figure>
      </div>
    </section>

    <section className="p3-roles" aria-label="Roles and service">
      <div className="container-wide">
        <div className="p3-role"><small>Lab</small>Director, P3 Health Lab</div>
        <div className="p3-role"><small>Editorial</small>Associate Editor, Frontiers in Sustainable Cities</div>
        <div className="p3-role"><small>Policy</small>Subject-matter expert, Canada’s Federal Environmental Justice Technical Working Group</div>
        <div className="p3-role"><small>Community</small>Founder of HumekaNeza, a school clean-air program in Rwanda</div>
      </div>
    </section>

    <section className="p3-home-section p3-home-framework" id="research-framework" aria-labelledby="p3-framework-title">
      <div className="container-wide">
        <div className="p3-section-heading"><div><span className="eyebrow">Research framework</span><h2 id="p3-framework-title">Healthy people, healthy places, a healthy planet.</h2></div><p>We link environmental exposures to health outcomes using exposure science, environmental justice, One Health and global-health approaches.</p></div>
        <div className="p3-triad">
          <article><span className="p3-triad-mark" aria-hidden="true">P</span><h3>People</h3><p>Healthy individuals and communities. We study respiratory and cardiovascular health, children’s environmental health, infectious disease and the microbiome.</p><ul className="p3-chip-list"><li>Asthma</li><li>Lung function</li><li>Children</li><li>Microbiome</li></ul></article>
          <article><span className="p3-triad-mark" aria-hidden="true">PL</span><h3>Place</h3><p>Built and natural environments. We measure air pollution, green space, noise, light and mobility where people live, learn and travel.</p><ul className="p3-chip-list"><li>PM2.5 · NOx · O3</li><li>PAHs</li><li>Green space</li><li>E-mobility</li></ul></article>
          <article><span className="p3-triad-mark" aria-hidden="true">P3</span><h3>Planet</h3><p>A sustainable and resilient future. We study heatwaves, wildfire smoke, airborne bacteria, fungi and eDNA, and climate-related health inequity.</p><ul className="p3-chip-list"><li>Aerobiome</li><li>eDNA</li><li>Wildfires</li><li>Heat</li></ul></article>
        </div>
      </div>
    </section>

    <section className="p3-home-section" aria-labelledby="p3-programs-title">
      <div className="container-wide">
        <div className="p3-section-heading"><div><span className="eyebrow">Research programs</span><h2 id="p3-programs-title">Five connected programs.</h2></div><Link href="/research-project" className="p3-text-link">All projects <ArrowUpRight size={14} aria-hidden="true" /></Link></div>
        <p className="p3-program-context">The framework above is a broad overview; these programs describe areas of research in more detail.</p>
        <div className="p3-program-rows">
          {researchPrograms.map((program, index) => <Link className="p3-program-row" href={`/research-project#${program.id}`} key={program.id}>
            <span className="p3-program-number">{['I', 'II', 'III', 'IV', 'V'][index]}</span><h3>{program.title}</h3><p>{programDescriptions[index]}</p><img src={programImages[index][0]} alt={programImages[index][1]} loading="lazy" decoding="async" />
          </Link>)}
        </div>
      </div>
    </section>

    <section className="p3-home-section" aria-labelledby="p3-updates-title">
      <div className="container-wide p3-home-scholar-grid">
        <div className="p3-scholar-copy"><span className="eyebrow">Publications</span><h2 id="p3-updates-title">Research and updates.</h2><p>Find the current list of publications, citations, and scholarly activity through Google Scholar.</p><a href={googleScholarUrl} target="_blank" rel="noopener noreferrer" className="p3-text-link" data-testid="link-home-publications">View Google Scholar <ExternalLink size={14} aria-hidden="true" /></a>
          <ol className="p3-pubs-list">
            <li><span>2026</span><div><h3>Passive sampling reveals composition of airborne bacteria and fungi across five East African cities</h3><p>Kalisa E, et al. · <em>npj Clean Air</em></p></div></li>
            <li><span>2026</span><div><h3>The effect of air purifiers in improving classroom air quality in a primary school in Rwanda</h3><p>Kalisa E, Han R. · <em>Atmospheric Environment: X</em></p></div></li>
            <li><span>2025</span><div><h3>Heatwaves amplify air pollution risks in Sub-Saharan Africa</h3><p>Kalisa E, Sudmant A. · <em>Scientific Reports</em></p></div></li>
          </ol>
          <Link href="/publications" className="p3-text-link">All publications <ArrowUpRight size={14} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>

    <section className="p3-funders-section" aria-labelledby="p3-funders-title">
      <div className="container-wide"><h2 id="p3-funders-title">Thank you to the funders and project partners who make this research possible.</h2><ul className="p3-funders-grid">{funderLogos.map((funder) => <li key={funder.src}><img src={funder.src} alt={funder.alt} width="240" height="120" loading="lazy" decoding="async" /></li>)}</ul></div>
    </section>
  </div>;
}

function HomeFilmSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    let isVisible = false;
    let observer: IntersectionObserver | undefined;
    let retryTimer: number | undefined;

    const playWhileVisible = () => {
      if (!isVisible || document.hidden) return;
      video.volume = 0.5;
      video.muted = false;
      if (!video.paused && !video.ended) return;
      if (video.ended) video.currentTime = 0;
      const playAttempt = video.play();
      playAttempt?.catch(() => {
        // Browsers may defer audible autoplay until the visitor interacts.
        // Keep the requested 50% volume and retry on the next interaction.
      });
    };

    const handleVisibility = () => {
      if (document.hidden) {
        video.pause();
      } else {
        playWhileVisible();
      }
    };

    const retryAfterInteraction = () => {
      if (!isVisible) return;
      window.clearTimeout(retryTimer);
      retryTimer = window.setTimeout(playWhileVisible, 0);
    };

    observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        playWhileVisible();
      } else {
        video.pause();
        video.currentTime = 0;
      }
    }, { threshold: [0, 0.15] });

    observer.observe(section);
    video.addEventListener('pause', playWhileVisible);
    video.addEventListener('ended', playWhileVisible);
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('pointerdown', retryAfterInteraction, { passive: true });
    window.addEventListener('keydown', retryAfterInteraction);

    return () => {
      observer?.disconnect();
      video.removeEventListener('pause', playWhileVisible);
      video.removeEventListener('ended', playWhileVisible);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pointerdown', retryAfterInteraction);
      window.removeEventListener('keydown', retryAfterInteraction);
      window.clearTimeout(retryTimer);
      video.pause();
    };
  }, []);

  const blockVideoInteraction = (event: ReactMouseEvent<HTMLVideoElement>) => {
    event.preventDefault();
  };

  return (
    <section className="home-film-section" ref={sectionRef} aria-labelledby="home-film-title">
      <div className="container-wide">
        <div className="home-film-heading">
          <div>
            <span className="eyebrow">P3 Health Lab / In motion</span>
            <h2 id="home-film-title">The air around us shapes how we live.</h2>
          </div>
          <p>A short film about clean air, environmental health, and the places that shape wellbeing.</p>
        </div>
        <div className="home-film-frame">
          <video
            ref={videoRef}
            className="home-film-video"
            src={labFilm}
            autoPlay
            loop
            playsInline
            preload="metadata"
            controls={false}
            controlsList="nodownload noplaybackrate noremoteplayback"
            disablePictureInPicture
            disableRemotePlayback
            aria-label="P3 Health Lab film about clean air and environmental health"
            onContextMenu={blockVideoInteraction}
            onClick={blockVideoInteraction}
            onDragStart={blockVideoInteraction}
          />
          <div className="home-film-caption" aria-hidden="true">
            <span>Clean air · Healthy people · Thriving planet</span>
            <span>24 sec / loop</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function PageHero({ eyebrow, title, text, action, className }: { eyebrow: string; title: ReactNode; text: string; action?: ReactNode; className?: string }) {
  return <section className={`page-hero${className ? ` ${className}` : ''}`} data-reveal="up"><div className="container-wide"><span className="eyebrow">{eyebrow}</span><h1 className="display">{title}</h1><p>{text}</p>{action && <div className="hero-actions">{action}</div>}</div></section>;
}

function ResearchProject() {
  const [activeProjectFilter, setActiveProjectFilter] = useState(() => window.location.hash.match(/^#p([1-5])$/)?.[1] ?? 'all');
  const recentPublication = [...publications].sort((a, b) => b.date.localeCompare(a.date))[0];
  const frameworkCards = [
    {
      number: '01',
      title: 'Environmental exposures',
      subtitle: 'What we study',
      accent: 'navy',
      rows: [
        ['Air pollution', 'Particles, gases and source mixtures'],
        ['Built environment', 'Green space, noise, light and mobility'],
        ['Chemical exposures', 'PAHs, nitro-PAHs and trace metals'],
        ['Biological exposures', 'Airborne bacteria, fungi and eDNA'],
        ['Climate & environmental change', 'Heat, wildfire smoke and co-exposures'],
      ],
    },
    {
      number: '02',
      title: 'Cross-cutting approaches',
      subtitle: 'How we investigate and act',
      accent: 'purple',
      rows: [
        ['Exposure science', 'Monitoring, mixture and risk analysis; spatial statistics and epidemiology'],
        ['Environmental justice', 'Exposure disparities, citizen science and meaningful community participation'],
        ['One Health & planetary health', 'Connections among people, ecosystems and environmental change'],
        ['Global health', 'Partnerships, implementation science and evidence for policy and practice'],
      ],
    },
    {
      number: '03',
      title: 'Health & biological responses',
      subtitle: 'What we seek to understand',
      accent: 'teal',
      rows: [
        ['Respiratory health', 'Asthma, lung function and lung cancer'],
        ['Cardiovascular health', ''],
        ["Children's environmental health", ''],
        ['Infectious disease', ''],
        ['Microbiome', ''],
        ['Population health & equity', 'Health inequalities and protection'],
      ],
    },
  ];
  return <div className="research-page">
    <section className="research-project-hero p3-purple-hero" aria-labelledby="research-project-title">
      <div className="container-wide">
        <span className="eyebrow">Research</span>
        <h1 id="research-project-title">From Exposure Science to Intervention</h1>
        <p>We study what people breathe and experience across homes, schools, streets, and changing climates. Our five research programs connect exposure science with community-engaged research and practical, evidence-led solutions.</p>
      </div>
    </section>

    <section className="research-framework-section" aria-labelledby="research-framework-title">
      <div className="container-wide">
        <div className="section-head">
          <div><span className="eyebrow">P3 Health Lab / People · Place · Planet</span><h2 id="research-framework-title">Research framework</h2></div>
          <p>Understanding environmental exposures to inform healthier, more equitable communities.</p>
        </div>
        <div className="research-framework-cards">
          {frameworkCards.map((card, index) => <article className={`research-framework-card is-${card.accent}`} key={card.number}>
            <span className="framework-card-number">{card.number}</span>
            <h3>{card.title}</h3>
            <p className="framework-card-subtitle">{card.subtitle}</p>
            <dl>{card.rows.map(([term, description]) => <div key={term}><dt>{term}</dt>{description && <dd>{description}</dd>}</div>)}</dl>
            {index < frameworkCards.length - 1 && <span className="framework-card-arrow" aria-hidden="true">→</span>}
          </article>)}
        </div>
        <div className="research-to-action">
          <span className="eyebrow">Research to action</span>
          <p>Evidence for cleaner air, practical interventions and equitable policy.</p>
          <div className="research-to-action-pillars">
            <div><strong>People</strong><span>Healthy individuals and communities</span></div>
            <div><strong>Place</strong><span>Healthy built and natural environments</span></div>
            <div><strong>Planet</strong><span>A sustainable and resilient future</span></div>
          </div>
        </div>
      </div>
    </section>

    <nav className="research-program-nav" aria-label="Research page contents">
      <div className="container-wide research-program-nav-groups">
        <div className="research-program-nav-group">
          <h2>Five research programs</h2>
          <ol>
            {researchPrograms.map((program, index) => <li key={program.id}>
              <a href={`#${program.id}`} data-testid={`link-research-anchor-${index}`}>
                <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                {program.title}
              </a>
            </li>)}
          </ol>
        </div>
        <div className="research-program-nav-group">
          <h2>Explore the project details</h2>
          <ul>
            <li><a href="#flagship-projects">Flagship projects</a></li>
            <li><a href="#research-project-catalog">Full project catalog</a></li>
            <li><a href="#project-methods">Methods and tools</a></li>
            <li><a href="/humekaneza#detailed-initiatives">Community and school initiatives on HumekaNeza</a></li>
          </ul>
        </div>
      </div>
    </nav>

    <section className="research-programs" aria-label="Research programs in detail">
      <div className="container-wide">
        {researchPrograms.map((program, index) => <article className="research-program" id={program.id} key={program.id} aria-labelledby={`research-program-title-${program.id}`} data-testid={`card-research-${index}`}>
          <header className="research-program-head">
            <span className="research-program-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <h2 id={`research-program-title-${program.id}`}>{program.title}</h2>
          </header>
          <div className="research-program-main">
            <p className="research-program-summary">{program.text}</p>
            <div className={`research-program-content${program.image ? '' : ' has-no-image'}`}>
              {(program.image || program.gallery.length > 0) && <div className="research-program-media">
                {program.image && <figure className="research-program-figure">
                  <img
                    src={`${import.meta.env.BASE_URL}images/${program.image}`}
                    alt={program.imageAlt ?? ''}
                    width="1040"
                    height="720"
                    loading="lazy"
                    decoding="async"
                    data-testid={`img-research-${program.id}`}
                  />
                </figure>}
                {program.gallery.length > 0 && <div className="research-program-gallery" aria-label={`Images related to ${program.title}`}>
                  {program.gallery.map((image) => <figure className={`research-program-gallery-image${image.fit === 'contain' ? ' is-diagram' : ''}`} key={image.src}>
                    <img
                      src={`${import.meta.env.BASE_URL}images/${image.src}`}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      loading="lazy"
                      decoding="async"
                    />
                  </figure>)}
                </div>}
              </div>}
              <div className="research-program-details">
                <section aria-labelledby={`research-questions-title-${program.id}`}>
                  <h3 id={`research-questions-title-${program.id}`}>Research questions</h3>
                  <ul className="research-question-list">
                    {program.questions.map((question, questionIndex) => <li key={question} data-testid={`text-research-question-${program.id}-${questionIndex}`}>{question}</li>)}
                  </ul>
                </section>
                <section aria-labelledby={`research-projects-title-${program.id}`}>
                  <h3 id={`research-projects-title-${program.id}`}>Related project names</h3>
                  <ul className="research-project-list">
                    {program.projects.map((project, projectIndex) => <li key={project.label}>
                      {project.href
                        ? <Link href={project.href} data-testid={`link-research-project-${program.id}-${projectIndex}`}>{project.logo && <img className="research-project-logo" src={project.logo} alt="" width="32" height="42" loading="lazy" decoding="async" />}{project.label}</Link>
                        : <span>{project.logo && <img className="research-project-logo" src={project.logo} alt="" width="32" height="42" loading="lazy" decoding="async" />}{project.label}</span>}
                    </li>)}
                  </ul>
                </section>
              </div>
            </div>
            <nav className="research-program-resources" aria-label={`Related resources for ${program.title}`}>
              <a href={`#p${index + 1}`} onClick={() => setActiveProjectFilter(String(index + 1))} data-testid={`link-research-catalog-${program.id}`}>Full program catalog</a>
              <a href="#research-methods" data-testid={`link-research-methods-${program.id}`}>Methods</a>
              <Link href="/research-map" data-testid={`link-research-places-${program.id}`}>Study locations</Link>
              <a href={googleScholarUrl} target="_blank" rel="noopener noreferrer" data-testid={`link-research-outputs-${program.id}`}>
                Selected outputs <ExternalLink size={13} aria-hidden="true" />
              </a>
            </nav>
          </div>
        </article>)}
      </div>
    </section>

    {recentPublication && <section className="section research-recent-publication" aria-labelledby="research-recent-publication-title">
      <div className="container-wide">
        <div className="section-head">
          <div><span className="eyebrow">Recent publication</span><h2 id="research-recent-publication-title">Selected output</h2></div>
        </div>
        <ul className="publication-list" data-testid="list-research-recent-publications">
          <li className="publication-row">
            <span className="publication-year">{recentPublication.year}</span>
            <div>
              <h3><a href={recentPublication.url} target="_blank" rel="noopener noreferrer">{recentPublication.title}</a></h3>
              <p>{recentPublication.authors.join(', ')} · <em>{recentPublication.journal}</em>, Article {recentPublication.articleNumber}. DOI: {recentPublication.doi}</p>
            </div>
            <a href={recentPublication.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${recentPublication.title} on ScienceDirect`}>View article <ArrowUpRight size={14} aria-hidden="true" /></a>
          </li>
        </ul>
      </div>
    </section>}

    <section className="research-wum-air section" aria-labelledby="research-wum-air-title">
      <div className="container-wide">
        <div className="section-head">
          <div><span className="eyebrow">Field research</span><h2 id="research-wum-air-title">Mobile Air Quality Monitoring Trailer (WUM-AIR): Empowering Communities to Tackle Air Pollution</h2></div>
          <p>Mobile monitoring supports air-quality research in the places where people live, learn and work.</p>
        </div>
        <div className="research-wum-air-gallery">
          <figure>
            <img src="/images/wum-air-trailer-illustration.webp" alt="Illustration of the WUM-AIR mobile air-quality monitoring trailer." width="1200" height="800" loading="lazy" decoding="async" />
            <figcaption>WUM-AIR mobile monitoring trailer</figcaption>
          </figure>
          <figure>
            <img src="/images/wum-air-field-photo.webp" alt="A researcher conducts field monitoring with WUM-AIR equipment." width="1200" height="800" loading="lazy" decoding="async" />
            <figcaption>Field research with WUM-AIR</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section className="research-context" id="research-methods" aria-labelledby="research-context-title">
      <div className="container-wide">
        <h2 id="research-context-title">Research domains, methods &amp; health outcomes</h2>
        <div className="research-context-grid">
          <div id="research-domains">
            <h3>Research domains</h3>
            <ul className="research-context-list">
              <li>Air pollution</li><li>Built environment</li><li>Chemical exposures</li>
              <li>Biological exposures</li><li>Climate &amp; environmental change</li><li>One Health / global health</li>
            </ul>
          </div>
          <div>
            <h3>Methods</h3>
            <ul className="research-context-list">
              <li>Exposure assessment</li><li>Mixture analysis</li><li>Risk assessment</li>
              <li>Spatial statistics</li><li>Epidemiology</li><li>Citizen science</li>
            </ul>
          </div>
          <div id="health-outcomes">
            <h3>Health outcomes</h3>
            <ul className="research-context-list">
              <li>Respiratory health</li><li>Cardiovascular disease</li><li>Children’s environmental health</li>
              <li>Asthma / lung cancer</li><li>Infectious disease</li><li>Microbiome</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section className="home-block research-more" aria-label="Related pages">
      <div className="container-wide">
        <ul className="research-links">
          <li><Link href="/research-project" className="text-link" data-testid="link-research-projects">Research Project</Link></li>
          <li><Link href="/research-map" className="text-link" data-testid="link-research-map">Global Research Map</Link></li>
          <li><a href={googleScholarUrl} target="_blank" rel="noopener noreferrer" className="text-link" data-testid="link-research-publications">Google Scholar <ExternalLink size={14} aria-hidden="true" /></a></li>
          <li><Link href="/people" className="text-link" data-testid="link-research-people">People</Link></li>
        </ul>
      </div>
    </section>
    <Projects integrated activeFilter={activeProjectFilter} onFilterChange={setActiveProjectFilter} />
    <div className="p3-home research-project-support">
      <section className="p3-home-section" aria-labelledby="research-field-title">
        <div className="container-wide">
          <div className="p3-section-heading"><div><span className="eyebrow">In the field</span><h2 id="research-field-title">Where the data come from.</h2></div></div>
          <div className="p3-field-grid">
            <figure><img src="/images/design-reference/field-sampler-city.jpg" alt="A passive air sampler mounted above a dense hillside city in East Africa." loading="lazy" decoding="async" /><figcaption>Passive air sampler above an East African city</figcaption></figure>
            <figure><img src="/images/design-reference/field-calibrate.jpg" alt="Researcher calibrating reference air-monitoring instruments." loading="lazy" decoding="async" /><figcaption>Calibrating reference instruments</figcaption></figure>
            <figure><img src="/images/design-reference/field-livestock-farm.png" alt="A researcher in protective equipment collecting bioaerosol samples at a livestock farm in Rwanda." loading="lazy" decoding="async" /><figcaption>Bioaerosol sampling at a livestock farm</figcaption></figure>
            <figure><img src="/images/design-reference/field-lakeside-sampler.png" alt="A passive air sampler deployed beside a lake." loading="lazy" decoding="async" /><figcaption>Lakeside sampling site</figcaption></figure>
            <figure><img src="/images/design-reference/field-cruiser.jpg" alt="Environment and Climate Change Canada mobile air-quality laboratory." loading="lazy" decoding="async" /><figcaption>ECCC's CRUISER mobile laboratory</figcaption></figure>
            <figure><img src="/images/design-reference/field-rainy-season-road.png" alt="Research vehicles crossing a muddy road to reach a remote field site during the rainy season." loading="lazy" decoding="async" /><figcaption>Reaching remote sites in the rainy season</figcaption></figure>
            <figure><img src="/images/design-reference/field-conference-presentation.png" alt="Dr. Egide Kalisa presenting research on passive samplers at an environmental health conference." loading="lazy" decoding="async" /><figcaption>Presenting results from five African cities</figcaption></figure>
          </div>
        </div>
      </section>
      <section className="p3-home-section p3-covers-section" aria-labelledby="research-covers-title">
        <div className="container-wide p3-covers-layout">
          <div className="p3-scholar-copy"><span className="eyebrow">Featured research</span><h2 id="research-covers-title">On the cover.</h2><p>Research on passive air samplers and airborne microbiomes has been featured on journal covers.</p><Link href="/publications" className="p3-text-link">Explore publications <ArrowUpRight size={14} aria-hidden="true" /></Link></div>
          <div className="p3-covers-grid">{publicationCovers.map((cover) => <figure key={cover.src}><img src={cover.src} alt={cover.alt} width={cover.width} height={cover.height} loading="lazy" decoding="async" /><figcaption>{cover.alt}</figcaption></figure>)}</div>
        </div>
      </section>
    </div>
  </div>;
}

const flagshipProjects: {
  programs: string[];
  tags: string[];
  title: string;
  text: string;
  image?: string;
  alt?: string;
  contain?: boolean;
  details: [string, string][];
  href?: string;
}[] = [
  {
    programs: ['1'],
    tags: ['I · Air we breathe', 'Aerobiome · eDNA'],
    title: 'Airborne microbiome and eDNA with passive samplers',
    text: 'Low-cost, electricity-free polyurethane foam disk samplers capture airborne bacteria, fungi and environmental DNA. After proof of concept in contrasting Canadian environments, the network spans five East African countries and is expanding to the Amazon.',
    image: 'field-sampler-city.jpg',
    alt: 'Passive air sampler mounted above a dense hillside city in East Africa.',
    details: [['Where', 'Canada · East Africa · French Guiana and Brazil'], ['With', 'York University and international partners'], ['Latest', 'npj Clean Air (2026): bacteria and fungi across five East African cities']],
  },
  {
    programs: ['1'],
    tags: ['I · Air we breathe', 'Global network'],
    title: 'GAPS and GAPS Megacities',
    text: 'As part of the Global Atmospheric Passive Sampling network, samplers have recorded atmospheric events including the Nyiragongo volcanic eruption, Saharan dust reaching the Amazon and wildfires in remote Canada. The work combines these data with satellites and machine learning.',
    image: 'snow-site.jpg',
    alt: 'Air-sampling station on a snowy site under a blue sky.',
    details: [['Output', '2024 GAPS cross-cutting review, Environmental Science: Advances']],
  },
  {
    programs: ['1'],
    tags: ['I · Air we breathe', 'Alberta'],
    title: 'PM-Health in the Oil Sands',
    text: 'With federal scientists in the Oil Sands Monitoring program, the team measures particle oxidative potential, polycyclic aromatic compounds, trace metals, the aerobiome and eDNA to understand health-relevant air pollution.',
    image: 'methods.jpg',
    alt: 'Diagram of an environmental sampling and laboratory analysis workflow.',
    details: [['Where', 'Alberta, Canada'], ['With', 'Environment and Climate Change Canada scientists']],
  },
  {
    programs: ['2'],
    tags: ['II · Children & schools', 'NSERC Discovery'],
    title: 'Indoor–outdoor air exchange in homes and school buses',
    text: 'Models help explain how outdoor pollution enters places where children spend time, including households and school buses, and identify effective ways to keep indoor air clean.',
    image: 'dropoff.jpg',
    alt: 'Illustration of cars and buses idling at a school drop-off.',
    details: [['Funding', 'NSERC Discovery Grant (RGPIN-2025-06504)']],
  },
  {
    programs: ['2', '3'],
    tags: ['II · Children & schools', 'III · Climate & wildfire'],
    title: 'Clean classrooms and DIY air purifiers',
    text: 'Commercial and do-it-yourself box-fan air purifiers are tested in classrooms and homes. In a Rwandan primary school, researchers measured classroom-air improvements during learning hours; related studies examine children’s health, learning and wildfire-smoke protection.',
    image: 'purifier-classroom.jpg',
    alt: 'Air purifier and air-quality monitor installed in a classroom.',
    details: [['Where', 'Kigali, Rwanda · London, Ontario'], ['Output', 'Atmospheric Environment: X (2026)']],
  },
  {
    programs: ['2', '3'],
    tags: ['II · Personal exposure', 'NIH R01'],
    title: 'SHEAR: household air pollution and clean cooking',
    text: 'In rural Rwanda, family members wear personal PM2.5 monitors to show who breathes the most smoke from wood-fuelled cooking, and whether cleaner fuels such as LPG reduce exposure.',
    image: 'shear-kitchen.jpg',
    alt: 'Smoke-filled rural kitchen and cooking over an open fire in Rwanda.',
    details: [['Where', 'Rural Rwanda'], ['Funding', 'U.S. National Institutes of Health (R01, 2024)'], ['Output', 'Environmental Science & Technology (2025)']],
  },
  {
    programs: ['5'],
    tags: ['V · Citizen science', 'Mobile lab'],
    title: 'WUM-AIR mobile monitoring trailer',
    text: 'Western University’s mobile air-quality monitoring trailer brings research-grade instruments to neighbourhoods, empowering communities to see and address the air pollution around them.',
    image: 'trailer.jpg',
    alt: 'Illustration of the WUM-AIR mobile air-quality monitoring trailer.',
    contain: true,
    details: [['Where', 'Ontario communities']],
  },
  {
    programs: ['2', '5'],
    tags: ['II · Children & schools', 'V · Citizen science'],
    title: 'HumekaNeza: Breathe Easy',
    text: 'A school clean-air program in Kigali, Rwanda. Students learn about air quality, work with monitors and the Air Quality Flag, and take part in practical school-community activities.',
    details: [['Where', 'Kigali, Rwanda']],
    href: '/humekaneza',
  },
];

const programCatalog = [
  {
    id: 'p1',
    number: 'I',
    title: 'The Air We Breathe: Beyond PM2.5',
    intro: 'Understanding the chemical and biological mixtures that shape what people actually breathe.',
    image: 'biochem.jpg',
    alt: 'Diagram of biological and chemical air pollutants entering the lungs.',
    items: [
      ['Beyond PM2.5', 'Looking past particle mass to the composition and toxicity of what we inhale.'],
      ['APAM-Net', 'A passive air-monitoring network for chemical and biological pollutants.'],
      ['Canadian air microbiome', 'Bacteria, fungi and eDNA in the air across contrasting Canadian environments.'],
      ['Amazon air microbiome', 'Airborne life over the Amazon, including microbes carried in Saharan dust.'],
      ['Chemical–biological mixtures', 'How PAHs, metals and microbes occur together and act on health.'],
    ],
  },
  {
    id: 'p2',
    number: 'II',
    title: 'Children, Schools & Personal Exposure',
    intro: 'Studying children’s exposures across home, school, travel and daily life.',
    image: 'sensors-kids.jpg',
    alt: 'Illustration of children with handheld air sensors.',
    items: [
      ['The 24-Hour Schoolchild', 'Following a child’s exposure through a full day at home, on the road and at school.'],
      ['Asthma and personal exposure', 'Personalized devices that link schoolchildren’s daily exposure to asthma attacks.'],
      ['Cleaner classrooms', 'Testing classroom air purifiers and their effects on health and learning.'],
      ['Less-polluted routes to school', 'Mapping walking and travel routes that cut children’s exposure.'],
      ['Clean cooking in schools', 'Cleaner cooking in school kitchens to reduce smoke exposure.'],
      ['CLEAN RIDE', 'Air quality on school buses, including the switch from diesel to electric.'],
    ],
  },
  {
    id: 'p3',
    number: 'III',
    title: 'Climate, Wildfire & Environmental Resilience',
    intro: 'Examining climate-related air-pollution risks and practical strategies for protection.',
    image: 'house.jpg',
    alt: 'Illustration of a home and indoor-air pathways.',
    items: [
      ['BREATHE-East Africa', 'Air quality and health across East African cities under a changing climate.'],
      ['Heat × air-pollution co-exposure', 'Heatwaves amplify air-pollution risks in Sub-Saharan Africa (Scientific Reports, 2025).'],
      ['Unequal protection from wildfire smoke', 'Who can and cannot protect themselves when smoke arrives.'],
      ['Seniors and DIY wildfire protection', 'Low-cost air cleaners and seniors’ storytelling for climate action and health equity.'],
    ],
  },
  {
    id: 'p4',
    number: 'IV',
    title: 'Healthy & Equitable Mobility',
    intro: 'Investigating how transport systems and mobility policies influence health and equity.',
    image: 'kigali-walk.jpg',
    alt: 'A researcher walking a Kigali street wearing a personal air monitor.',
    items: [
      ['MOVE-Africa', 'Transport, exposure and health in African cities.'],
      ['MOVE-Canada', 'The same questions for Canadian commuters and communities.'],
      ['Rwanda speed cameras', 'Health effects of traffic-safety policy on Rwanda’s roads.'],
      ['Rwanda healthy mobility', 'Kigali’s car-free days cut air pollution by up to 30% (Frontiers in Future Transportation, 2026).'],
      ['Low-emission transport benefits', 'Health, economic and climate gains from electric school buses and cleaner vehicles.'],
    ],
  },
  {
    id: 'p5',
    number: 'V',
    title: 'Citizen Science & Environmental Justice',
    intro: 'Partnering with communities to make environmental risks visible and actionable.',
    image: 'global-classroom.jpg',
    alt: 'Illustration of students in Canada and Africa linked through a global classroom.',
    items: [
      ['Making the Invisible Visible', 'Community monitoring that shows residents the air they breathe.'],
      ['ACB youth personal monitoring', 'African, Caribbean and Black youth measuring their own exposure.'],
      ['SHARED SKIES / Global Classroom', 'Students in Canada and Africa learning air science together.'],
      ['Behavioural exposure reduction', 'Simple daily changes that lower personal exposure.'],
    ],
  },
];

function Projects({
  integrated = false,
  activeFilter: providedActiveFilter,
  onFilterChange,
}: {
  integrated?: boolean;
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
} = {}) {
  const [internalActiveFilter, setInternalActiveFilter] = useState('all');
  const activeFilter = providedActiveFilter ?? internalActiveFilter;
  const updateActiveFilter = onFilterChange ?? setInternalActiveFilter;
  const filters = [
    ['all', 'All programs', ''],
    ['1', 'Air we breathe', 'I'],
    ['2', 'Children & schools', 'II'],
    ['3', 'Climate & wildfire', 'III'],
    ['4', 'Mobility', 'IV'],
    ['5', 'Citizen science', 'V'],
  ];
  const visibleFlagships = flagshipProjects.filter((project) =>
    (!integrated || project.href !== '/humekaneza')
      && (activeFilter === 'all' || project.programs.includes(activeFilter)),
  );
  const detailedProjectPrograms: Record<string, string[]> = {
    'school-air-quality-campaign': ['2', '5'],
    'i-am-an-air-quality-scientist': ['2', '5'],
    'one-sensor-per-school': ['2', '5'],
    'classroom-clean-air-interventions': ['2', '3'],
    'clean-air-school-zones': ['2', '4'],
    'shared-skies': ['2', '5'],
    'making-the-invisible-visible': ['5'],
    'equitable-air-quality-communication': ['3', '5'],
  };
  const humekaNezaProjectIds = new Set([
    'school-air-quality-campaign',
    'i-am-an-air-quality-scientist',
    'one-sensor-per-school',
    'classroom-clean-air-interventions',
  ]);
  const visibleDetailedProjects = projects.filter((project) =>
    (!integrated || !humekaNezaProjectIds.has(project.id))
      && (activeFilter === 'all' || detailedProjectPrograms[project.id]?.includes(activeFilter)),
  );

  return <div className={`p3-projects-page${integrated ? ' is-integrated' : ''}`}>
    {!integrated && <section className="p3-project-hero">
      <div className="container-wide p3-project-hero-grid">
        <div><span className="eyebrow">Projects · P3 Health Lab</span><h1>Research that follows the air.</h1><p>Five connected programs move from measuring exposure to testing interventions, closing equity gaps and creating real-world impact in Canada and Africa.</p></div>
        <div className="p3-project-lenses" aria-label="Four lenses across all projects">
          <article><strong>EXPOSURE</strong><span>What people breathe, where and when</span></article><article><strong>INTERVENTION</strong><span>What reduces it</span></article><article><strong>EQUITY</strong><span>Who carries the burden</span></article><article><strong>IMPACT</strong><span>Policy, practice and communities</span></article>
        </div>
      </div>
    </section>}
    <nav className="p3-project-filters" aria-label="Filter projects by program">
      <div className="container-wide p3-project-filters-inner">{filters.map(([id, label, number]) => <button type="button" key={id} aria-pressed={activeFilter === id} onClick={() => updateActiveFilter(id)}>{number && <span>{number}</span>}{label}</button>)}</div>
    </nav>

    <section className="p3-projects-section" id="flagship-projects" aria-labelledby="p3-flagships-title">
      <div className="container-wide">
        <div className="p3-section-heading"><div><span className="eyebrow">Flagship project snapshots</span><h2 id="p3-flagships-title">Selected work across the programs.</h2></div><p aria-live="polite">Showing {visibleFlagships.length} flagship {visibleFlagships.length === 1 ? 'project' : 'projects'}.</p></div>
        <div className="p3-flagships-grid">
          {visibleFlagships.map((project) => <article className="p3-flagship" key={project.title}>
            {project.image && <img className={project.contain ? 'is-contain' : ''} src={`/images/design-reference/${project.image}`} alt={project.alt ?? ''} loading="lazy" decoding="async" />}
            <div className="p3-flagship-body"><div className="p3-flagship-meta">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><h3>{project.title}</h3><p>{project.text}</p>
              {project.details.length > 0 && <dl>{project.details.map(([term, description]) => <Fragment key={term}><dt>{term}</dt><dd>{description}</dd></Fragment>)}</dl>}
              {project.href && <Link className="p3-text-link" href={project.href}>Visit the HumekaNeza page <ArrowUpRight size={14} aria-hidden="true" /></Link>}
            </div>
          </article>)}
        </div>
      </div>
    </section>

    <section className="p3-projects-section p3-program-catalog" id={integrated ? 'research-project-catalog' : undefined} aria-labelledby="p3-catalog-title">
      <div className="container-wide">
        <div className="p3-section-heading"><div><span className="eyebrow">{integrated ? 'Full project catalog' : 'All projects by program'}</span><h2 id="p3-catalog-title">{integrated ? 'Browse additional project records by program.' : 'Five programs, one framework.'}</h2></div><p>{integrated ? 'The catalog adds project descriptions to the related names in each program overview.' : 'The full program portfolio, organized across connected research areas.'}</p></div>
        {programCatalog.map((program) => <section className="p3-catalog-program" id={program.id} key={program.id} hidden={activeFilter !== 'all' && activeFilter !== program.id.slice(1)}>
          <div className="p3-catalog-heading"><span className="p3-catalog-number">{program.number}</span><h3>{program.title}</h3>{!integrated && <><p>{program.intro}</p><img src={`/images/design-reference/${program.image}`} alt={program.alt} loading="lazy" decoding="async" /></>}</div>
          <div className="p3-catalog-items">{program.items.filter(([title]) => !integrated || !researchPrograms.some((researchProgram) => researchProgram.projects.some((project) => project.label.toLowerCase() === title.toLowerCase()))).map(([title, text]) => <article className="p3-catalog-item" key={title}><h4>{title}</h4><p>{text}</p></article>)}</div>
        </section>)}
      </div>
    </section>

    <section className="p3-projects-section" id="project-methods" aria-labelledby="p3-methods-title">
      <div className="container-wide">
        <div className="p3-section-heading"><div><span className="eyebrow">Methods and tools</span><h2 id="p3-methods-title">How we measure.</h2></div></div>
        <div className="p3-methods-grid">
          <figure><img src="/images/design-reference/field-samplers-garden.jpg" alt="Passive air samplers, including an opened unit showing the foam disk." loading="lazy" decoding="async" /><figcaption><strong>Passive samplers</strong>Electricity-free PUF disks for chemicals, microbes and eDNA.</figcaption></figure>
          <figure><img src="/images/design-reference/field-cruiser.jpg" alt="Environment and Climate Change Canada mobile air-quality laboratory." loading="lazy" decoding="async" /><figcaption><strong>Mobile labs</strong>The WUM-AIR trailer and ECCC’s CRUISER.</figcaption></figure>
          <figure className="p3-methods-text"><div aria-hidden="true">PM₂.₅</div><figcaption><strong>Wearable monitors</strong>Personal PM2.5 sensors worn through the day.</figcaption></figure>
          <figure><img src="/images/design-reference/field-calibrate.jpg" alt="Calibrating reference air-monitoring instruments." loading="lazy" decoding="async" /><figcaption><strong>Reference instruments</strong>Regulatory-grade analyzers for calibration.</figcaption></figure>
        </div>
        <div className="p3-toolkit" aria-label="Lab and analysis toolkit"><span>GPS &amp; GIS</span><span>Air-quality models &amp; machine learning</span><span>Low-cost sensors</span><span>Passive &amp; active samplers</span><span>PCR &amp; next-generation sequencing</span><span>UPLC, GC/MS &amp; Orbitrap</span><span>Satellite data</span></div>
      </div>
    </section>

    {!integrated && visibleDetailedProjects.length > 0 && <section className="p3-projects-section p3-current-projects" id={integrated ? 'research-community-initiatives' : undefined} aria-labelledby="p3-current-projects-title">
      <div className="container-wide">
        <div className="p3-section-heading"><div><span className="eyebrow">Community project details</span><h2 id="p3-current-projects-title">Detailed community and school initiatives.</h2></div><p>Project descriptions and activities for community- and school-based initiatives.</p></div>
        <div className="projects-list">
          {visibleDetailedProjects.map((project) => <article className="project-entry" id={project.slug} key={project.id} data-testid={`project-${project.slug}`}>
            <div className="project-entry-index" aria-hidden="true">{String(projects.indexOf(project) + 1).padStart(2, '0')}</div>
            <div className="project-entry-content">
              <div className="project-entry-heading"><div><h2>{project.title}</h2>{project.subtitle && <p className="project-subtitle">{project.subtitle}</p>}</div>{project.location && <span className="project-location">{project.location}</span>}</div>
              <div className={`project-entry-layout${project.images.length ? '' : ' no-media'}`}>
                {project.images.length > 0 && <div className="project-entry-media">
                  {project.images.slice(0, 1).map((image) => <figure className={`project-entry-image${image.fit === 'contain' ? ' is-diagram' : ''}`} key={image.src}><img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async" /></figure>)}
                  {project.images.length > 1 && <div className="project-entry-image-strip">{project.images.slice(1).map((image) => <figure className={`project-entry-image${image.fit === 'contain' ? ' is-diagram' : ''}`} key={image.src}><img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async" /></figure>)}</div>}
                </div>}
                <div className={`project-entry-body${project.activities || project.focus ? '' : ' is-single-column'}`}>
                  <div>{project.description.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
                  {(project.activities || project.focus) && <div className="project-focus"><h3>{project.activities ? 'Activities' : 'Focus'}</h3><ul>{(project.activities ?? project.focus)?.map((item) => <li key={item}>{item}</li>)}</ul></div>}
                  {project.process && <p className="project-process">{project.process}</p>}
                  {project.closing && <p className="project-closing">{project.closing}</p>}
                </div>
              </div>
            </div>
          </article>)}
        </div>
        <div className="projects-related-link"><Link href="/research-map" className="p3-text-link" data-testid="link-projects-research-map">View global research map <ArrowUpRight size={14} aria-hidden="true" /></Link></div>
      </div>
    </section>}

    <section className="p3-projects-section p3-project-collab" aria-labelledby="p3-project-collab-title">
      <div className="container-wide p3-project-collab-grid"><div><span className="eyebrow">Collaborate</span><h2 id="p3-project-collab-title">Partner with the P3 Health Lab.</h2><p>We work with communities, schools, governments and researchers. If you want to host samplers, co-design a study or train with us, get in touch.</p></div><Link className="p3-project-cta" href="/contact">Contact the lab <ArrowUpRight size={15} aria-hidden="true" /></Link></div>
    </section>
  </div>;
}

function ResearchMap() {
  return <GlobalResearchMapPage />;
}

const linkedInProfiles: Record<string, string> = {
  'md pervez kabir': 'https://www.linkedin.com/in/md-pervez-kabir-781837168/',
  'allison pert': 'https://www.linkedin.com/in/allisonpert/',
  'augustine omodieke': 'https://www.linkedin.com/in/augustine-omodieke/',
  'francis acquah': 'https://www.linkedin.com/in/francis-n-acquah-a39aa1219/',
  'daniel twum': 'https://www.linkedin.com/in/dr-daniel-twum-mbbs-pt-msc-cic-17025b189/',
  'abdoul rasheed': 'https://www.linkedin.com/in/abdulrasheed-rasheed/',
  'abdul rasheed rasheed': 'https://www.linkedin.com/in/abdulrasheed-rasheed/',
  'zoha irfan': 'https://www.linkedin.com/in/zoha-irfan-296062308/',
  'oluwaseun bajulaye': 'https://www.linkedin.com/in/oyinbajulaye/',
  'farhana ramiza': 'https://www.linkedin.com/in/farhana-rokaiya-ramiza-56b558238/',
  'ignatius atuguba': 'https://www.linkedin.com/in/ignatiusatuguba/',
  'jiaxuan zhang': 'https://www.linkedin.com/in/jxbravo/',
  'arshia mohammadi sanjani': 'https://www.linkedin.com/in/arshiasanjani/',
  'ihsan khalifa': 'https://www.linkedin.com/in/ihsankhalifa/',
  'harini kumaraverl': 'https://www.linkedin.com/in/harini-kumaraverl-33b4a9372/',
  'haiyan li': 'https://www.linkedin.com/in/haiyan2657/',
  'ruiming han': 'https://www.linkedin.com/in/ruiming-han-858b7823b/',
  'natasha fortin': 'https://www.linkedin.com/in/natasha-fortin-59751a26b/',
  'sydney lessard': 'https://www.linkedin.com/in/sydneylessard/',
  'jiaqi bi': 'https://www.linkedin.com/in/jiaqi-bi-10189a126/',
  'sumeet jamil': 'https://www.linkedin.com/in/sumeet-jamil-1a28ba233/',
  'shaikh sumeet jamil': 'https://www.linkedin.com/in/sumeet-jamil-1a28ba233/',
  'sharika jalali': 'https://www.linkedin.com/in/sharikajalali/',
  'innocent twagirayezu': 'https://www.linkedin.com/in/innocent-twagirayezu-6277141b7/',
  'patrick karakwende': 'https://www.linkedin.com/in/patrick-karakwende-984440144/',
  'adolphe ndikubwimana': 'https://www.linkedin.com/in/adolphe-atuhire-140847116/',
  'isabel ajagu': 'https://www.linkedin.com/in/isabelajagu/',
};

function normalizePersonName(name: string) {
  return name
    .replace(/^(?:dr|prof)\.?\s+/i, '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function staticPersonForName(name: string) {
  const nameAliases: Record<string, string> = {
    'abdoul rasheed': 'abdul rasheed rasheed',
  };
  const normalizedName = normalizePersonName(name);
  const lookupName = nameAliases[normalizedName] ?? normalizedName;
  return [
    people.director,
    ...people.sections.flatMap((section) => section.members),
    ...people.former,
  ].find((person) => normalizePersonName(person.name) === lookupName);
}

function PersonLinkedInName({ name, href }: { name: string; href?: string | null }) {
  const staticPerson = staticPersonForName(name);
  const profileUrl = staticPerson?.linkedin || staticPerson?.href || href || linkedInProfiles[normalizePersonName(name)];
  return profileUrl
    ? <a className="pp-name" href={profileUrl} target="_blank" rel="noopener noreferrer" aria-label={`${name} on LinkedIn`}>{name}</a>
    : <span className="pp-name">{name}</span>;
}

function personInitials(name: string) {
  return name
    .replace(/^(Dr\.?|Prof\.?)\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

function PersonAvatar({ name, photo }: { name: string; photo?: string | null }) {
  const [failedPhoto, setFailedPhoto] = useState<string | null>(null);
  return photo && failedPhoto !== photo
    ? <img className="pp-photo" src={photo} alt={`Portrait of ${name}`} width="132" height="132" loading="lazy" decoding="async" onError={() => setFailedPhoto(photo)} />
    : <span className="pp-photo pp-initials" role="img" aria-label={name}>{personInitials(name)}</span>;
}

function PersonName({ person }: { person: (typeof people.sections)[number]['members'][number] | typeof people.director | (typeof people.former)[number] }) {
  return <PersonLinkedInName name={person.name} href={person.linkedin ?? person.href} />;
}

function PeoplePageHero() {
  return <section className="page-hero people-page-hero p3-purple-hero" aria-labelledby="people-page-title">
    <div className="container-wide">
      <span className="eyebrow">P3 Health Lab / People</span>
      <h1 className="display" id="people-page-title">People</h1>
    </div>
  </section>;
}

function PeopleSectionNav({ items }: { items: Array<{ id: string; label: string }> }) {
  return <nav className="pp-section-nav" aria-label="People sections">
    {items.map(({ id, label }) => <a key={id} href={`#${id}`}>{label}</a>)}
  </nav>;
}

function peopleGridClass(count: number) {
  return count === 1 ? 'pp-grid pp-grid--single' : count < 4 ? 'pp-grid pp-grid--few' : 'pp-grid';
}

function People() {
  const { director, sections, former, collaborators } = people;
  const sectionLinks = [
    { id: 'principal-investigator', label: 'Principal Investigator' },
    ...sections.map((section) => ({ id: section.id, label: section.title })),
    ...(collaborators.length ? [{ id: 'collaborating-groups', label: 'Collaborating groups and centres' }] : []),
    ...(former.length ? [{ id: 'former-students-and-alumni', label: 'Former students and alumni' }] : []),
  ];
  return (
    <div className="people-page">
      <PeoplePageHero />
      <div className="pp">
        <PeopleSectionNav items={sectionLinks} />
        <section id="principal-investigator" className="pp-section">
          <h2>Principal Investigator</h2>
          <ul className={peopleGridClass(1)}>
            <li className="pp-member">
              <PersonAvatar name={director.name} photo={director.photo} />
              <div className="pp-copy">
                <PersonName person={director} />
                {director.role && <span className="pp-role">{director.role}</span>}
                {director.affiliation && <span className="pp-aff">{director.affiliation}</span>}
                {director.focus && <p className="pp-focus">{director.focus}</p>}
              </div>
            </li>
          </ul>
        </section>

        {sections.map((section) => (
          <section key={section.id} id={section.id} className="pp-section">
            <h2>{section.title}</h2>
            <ul className={peopleGridClass(section.members.length)}>
              {section.members.map((person) => (
                <li className="pp-member" key={person.name}>
                  <PersonAvatar name={person.name} photo={person.photo} />
                  <div className="pp-copy">
                    <PersonName person={person} />
                    {person.role && <span className="pp-role">{person.role}</span>}
                    {(person.institution || person.country) && (
                      <span className="pp-aff">{[person.institution, person.country].filter(Boolean).join(', ')}</span>
                    )}
                    {person.researchFocus && <p className="pp-focus">{person.researchFocus}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}

        {collaborators.length > 0 && (
          <section id="collaborating-groups" className="pp-section">
            <h2>Collaborating groups and centres</h2>
            {collaborators.map((collaborator) => <p key={collaborator.name}><strong>{collaborator.name}.</strong> {collaborator.description}</p>)}
          </section>
        )}

        {former.length > 0 && (
          <section id="former-students-and-alumni" className="pp-section">
            <h2>Former students and alumni</h2>
            <ul className={peopleGridClass(former.length)}>
              {former.map((person) => (
                <li className="pp-member" key={person.name}>
                  <PersonAvatar name={person.name} photo={person.photo} />
                  <div className="pp-copy">
                    <PersonName person={person} />
                    {person.role && <span className="pp-role">{person.role}</span>}
                    {(person.now || person.institution || person.country) && <span className="pp-aff">{person.now ?? [person.institution, person.country].filter(Boolean).join(', ')}</span>}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

function About() {
  const { data: profileData } = useGetPublicProfile();
  const contact = profileData?.contact;
  const profileName = contact?.name?.trim() || "About P3 Health Lab";
  const profileSummary = [
    contact?.appointment,
    contact?.department,
    contact?.university,
    contact?.directorRole,
  ].filter((value): value is string => Boolean(value)).join(" · ");
  const labSummary = [
    contact?.name,
    contact?.directorRole,
    contact?.labName,
    contact?.university,
  ].filter((value): value is string => Boolean(value)).join(" · ");
  const relatedPages = [
    ['Research', '/research'],
    ['People', '/people'],
    ['Projects', '/projects'],
    ['Publications', '/publications'],
  ] as const;

  return <div className="about-profile-page">
    <PageHero
      eyebrow="About / 07"
      title={profileName}
      text={profileSummary || "Verified profile information is not currently available."}
    />
    <section className="section about-profile-identity" data-reveal="up">
      <div className="container-wide about-profile-identity-grid">
        <div>
          <span className="eyebrow">Academic profile</span>
          <h2>{profileName}</h2>
          {contact?.appointment && <p className="about-profile-role">{contact.appointment}</p>}
          {contact?.directorRole && <p className="about-profile-lab">{contact.directorRole}</p>}
        </div>
        <dl className="about-profile-facts">
          {contact?.department && <div><dt>Department</dt><dd>{contact.department}</dd></div>}
          {contact?.university && <div><dt>Institution</dt><dd>{contact.university}</dd></div>}
        </dl>
      </div>
    </section>
    <section className="section section-tinted about-profile-research" aria-labelledby="about-research-title" data-reveal="up">
      <div className="container-wide">
        <div className="section-head">
          <div><span className="eyebrow">Research</span><h2 id="about-research-title">Research</h2></div>
          <p>Research across indoor and outdoor environments, with attention to how much pollution people breathe and how those exposures can be reduced.</p>
        </div>
        <blockquote className="about-profile-statement">“My research focuses on individuals’ exposure to air pollutants in indoor and outdoor environments, understanding how much pollution people breathe, and how to reduce those exposures.”</blockquote>
        <div className="about-profile-interests" aria-label="Research interests">
          {profileResearchInterests.map((interest, index) => <div className="about-profile-interest" key={interest}><span>{String(index + 1).padStart(2, '0')}</span><h3>{interest}</h3></div>)}
        </div>
      </div>
    </section>
    <section className="section about-profile-lab-section" aria-labelledby="about-lab-title" data-reveal="up">
      <div className="container-wide about-profile-lab-grid">
        <div>
          <span className="eyebrow">About the lab</span>
          <h2 id="about-lab-title">{contact?.name ? `A lab led by ${contact.name}.` : "About the lab."}</h2>
        </div>
        <div>
          <p className="about-profile-copy">{labSummary || "Verified lab profile information is not currently available."}</p>
          <nav className="about-profile-links" aria-label="P3 Health Lab pages">
            {relatedPages.map(([label, href]) => <Link href={href} key={href}>{label}<ArrowUpRight size={14} aria-hidden="true" /></Link>)}
          </nav>
        </div>
      </div>
    </section>
    <section className="section section-tinted about-profile-contact" aria-labelledby="about-contact-title" data-reveal="up">
      <div className="container-wide about-profile-contact-grid">
        <div><span className="eyebrow">Academic / institutional contact</span><h2 id="about-contact-title">Connect with the professor.</h2></div>
        <address className="about-profile-contact-details">
          {contact?.department && <p><strong>{contact.department}</strong>{contact.university && <><br />{contact.university}</>}</p>}
          {!contact?.department && contact?.university && <p>{contact.university}</p>}
          {contact?.office && <p>Office: {contact.office}</p>}
          {contact?.contactEmail && <p><a href={`mailto:${contact.contactEmail}`}>{contact.contactEmail} <ArrowUpRight size={14} aria-hidden="true" /></a></p>}
          {!contact?.department && !contact?.university && !contact?.office && !contact?.contactEmail && <p>Contact information is not currently available.</p>}
        </address>
      </div>
    </section>
  </div>;
}

function Publications() {
  const [externalLinks, setExternalLinks] = useState<{ label: string; url: string }[]>([]);

  useEffect(() => {
    let active = true;
    fetch('/api/public/publications', { headers: { Accept: 'application/json' } })
      .then((response) => response.ok ? response.json() as Promise<{ externalLinks?: { label: string; url: string }[] }> : Promise.reject(new Error('Publication links unavailable')))
      .then((result) => {
        if (active && Array.isArray(result.externalLinks)) setExternalLinks(result.externalLinks);
      })
      .catch(() => {
        if (active) setExternalLinks([]);
      });
    return () => { active = false; };
  }, []);

  const getExternalLink = (label: string) => externalLinks.find((link) => link.label === label);
  const googleScholar = {
    label: 'Google Scholar',
    url: 'https://scholar.google.co.nz/citations?user=yAPiYq8AAAAJ&hl=en',
  };
  const orcid = getExternalLink('ORCID') ?? { label: 'ORCID', url: 'https://orcid.org/0000-0001-9906-583X' };
  const additionalProfileLinks = externalLinks.filter(({ label }) => ['CV', 'Publication Profile', 'CV / Publication Profile'].includes(label));
  const newestFirstPublications = [...publications].sort((a, b) => b.date.localeCompare(a.date));

  return <div className="publications-page">
    <PageHero
      eyebrow="Publications"
      title="Research & Scholarship"
      text="P3 Health Lab contributes research across environmental health, air pollution, exposure science, climate change, children’s environmental health, environmental microbiology, antimicrobial resistance, clinical trials, One Health, and global health."
      className="p3-purple-hero"
    />
    <section className="section publications-content" data-reveal="up">
      <div className="container-wide">
        <p className="publications-intro">Our work spans observational studies, exposure assessment, laboratory and field-based research, randomized controlled trials, community-engaged research, and interdisciplinary collaborations.</p>
        <section className="publication-records" aria-labelledby="publication-records-title">
          <div className="section-head">
            <div><span className="eyebrow">Newest first</span><h2 id="publication-records-title">Recent publications</h2></div>
          </div>
          <ul className="publication-list" data-testid="list-publications">
            {newestFirstPublications.map((publication) => (
              <li className="publication-row" key={publication.doi}>
                <span className="publication-year">{publication.year}</span>
                <div>
                  <h3><a href={publication.url} target="_blank" rel="noopener noreferrer">{publication.title}</a></h3>
                  <p>{publication.authors.join(', ')} · <em>{publication.journal}</em>, Article {publication.articleNumber}. DOI: {publication.doi}</p>
                </div>
                <a href={publication.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${publication.title} on ScienceDirect`}>View article <ArrowUpRight size={14} aria-hidden="true" /></a>
              </li>
            ))}
          </ul>
        </section>
        <div className="publication-profile-grid">
          <article className="publication-profile-record">
            <span className="eyebrow">Google Scholar</span>
            <h2>Google Scholar</h2>
            <p>For the most up-to-date list of publications, citations, and scholarly impact:</p>
            <a href={googleScholar.url} target="_blank" rel="noopener noreferrer" data-testid="link-publications-google-scholar">View Dr. Egide Kalisa’s Publications on Google Scholar <ArrowUpRight size={14} aria-hidden="true" /></a>
            <div className="publication-covers">
              {publicationCovers.map((cover) => <a key={cover.src} href={googleScholar.url} target="_blank" rel="noopener noreferrer">
                <img src={cover.src} alt={cover.alt} width={cover.width} height={cover.height} loading="lazy" decoding="async" />
              </a>)}
            </div>
          </article>
          <article className="publication-profile-record">
            <span className="eyebrow">ORCID</span>
            <h2>ORCID</h2>
            <p>View Dr. Egide Kalisa’s ORCID profile for a persistent record of research outputs and scholarly contributions.</p>
            {orcid && <a href={orcid.url} target="_blank" rel="noreferrer">View ORCID Profile <ArrowUpRight size={14} aria-hidden="true" /></a>}
          </article>
          {additionalProfileLinks.map((link) => (
            <article className="publication-profile-record" key={`${link.label}-${link.url}`}>
              <span className="eyebrow">{link.label}</span>
              <h2>{link.label}</h2>
              <p>View the verified {link.label} for additional academic information and publication details.</p>
              <a href={link.url} target="_blank" rel="noreferrer">Open {link.label} <ArrowUpRight size={14} aria-hidden="true" /></a>
            </article>
          ))}
        </div>
        <div className="publication-themes">
          <div className="section-head">
            <div><span className="eyebrow">Research themes</span><h2>Selected Research Themes</h2></div>
          </div>
          <div className="publication-theme-list">
            {researchPrograms.map((program, index) => <div className="publication-theme" key={program.id}><span>{String(index + 1).padStart(2, '0')}</span><h3>{program.title}</h3></div>)}
          </div>
        </div>
      </div>
    </section>
  </div>;
}

function Contact() {
  return <ContactPageSection />;
}

function Teaching() {
  const teachingQuery = useGetPublicTeaching();
  const [slowLoading, setSlowLoading] = useState(false);
  const courses = teachingQuery.data?.courses ?? [];
  const academicYears = Array.from(new Set(courses.map(({ academicYear }) => academicYear)));
  const [currentAcademicYear, ...previousAcademicYears] = academicYears;

  useEffect(() => {
    if (!teachingQuery.isLoading) {
      setSlowLoading(false);
      return;
    }
    const timer = window.setTimeout(() => setSlowLoading(true), 10000);
    return () => window.clearTimeout(timer);
  }, [teachingQuery.isLoading]);

  const renderYear = (year: string) => (
    <div className="teaching-year" key={year} data-reveal="up">
      <div className="teaching-year-heading"><span className="eyebrow">Academic year</span><h3>{year}</h3></div>
      <div className="teaching-course-list">
        {courses.filter((course) => course.academicYear === year).map((course, index) => (
          <article className="teaching-course-row" key={`${year}-${course.courseCode}`} data-testid={`course-${year}-${index}`}>
            <span className="course-code">{course.courseCode}</span><h4>{course.title}</h4>
          </article>
        ))}
      </div>
    </div>
  );

  const teachingRoutes = [
    ['Research Project', '/research-project'],
    ['Global Map', '/research-map'],
    ['People', '/people'],
    ['Publications', '/publications'],
    ['Opportunity', '/opportunity'],
    ['Contact', '/contact'],
  ] as const;

  return <div className="teaching-page">
    <section className="page-hero teaching-page-hero p3-purple-hero" aria-labelledby="teaching-page-title">
      <div className="container-wide teaching-hero-grid">
        <div>
          <span className="eyebrow">Teaching / P3 Health Lab</span>
          <h1 id="teaching-page-title">Learning across disciplines and communities.</h1>
          <p>Teaching in global health and One Health connects foundational knowledge with field-based learning, interdisciplinary collaboration, and real-world environmental and population-health challenges.</p>
        </div>
        <figure className="teaching-hero-image">
          <img src="/images/design-reference/global-classroom.jpg" alt="Illustration of students in Canada and Africa connected through a global classroom." width="1920" height="1280" fetchPriority="high" decoding="async" />
          <figcaption>Knowledge grows through shared learning.</figcaption>
        </figure>
      </div>
    </section>
    <section className="section teaching-feature" aria-labelledby="teaching-feature-title">
      <div className="container-wide teaching-feature-grid">
        <div className="teaching-feature-copy">
          <span className="eyebrow">Teaching</span>
          <h2 id="teaching-feature-title">Global health and One Health, made practical</h2>
          <blockquote>“Let's make global health practical, human, and a little bit fun.”</blockquote>
          <p>Dr. Kalisa teaches graduate and undergraduate courses at Western. His classes use learning teams, case studies, simulations, debates and science-communication training.</p>
          <figure><img src="/images/design-reference/teaching-global-health-classroom.png" alt="Students take part in a graduate global health class at Western University." loading="lazy" decoding="async" /></figure>
        </div>
        <div className="teaching-feature-courses">
          <span className="eyebrow">Selected courses · Western University</span>
          <p>Course names are listed for context; current schedules and course details are not maintained here.</p>
          <ol>
            <li><span>GHS 9100</span><div><h3>Foundations of Global Health</h3><p>MSc Global Health Systems</p></div></li>
            <li><span>GHS 9112</span><div><h3>International Field School</h3><p>Global health practicum, including fieldwork in Rwanda</p></div></li>
            <li><span>MPH 9015</span><div><h3>Issues in Global Health</h3><p>Master of Public Health</p></div></li>
            <li><span>OH 3300A</span><div><h3>Foundations in One Health</h3><p>Undergraduate One Health program</p></div></li>
            <li><span>OH 3600</span><div><h3>One Health in Action</h3><p>Undergraduate One Health program</p></div></li>
          </ol>
        </div>
      </div>
    </section>
    <section className="section teaching-courses" aria-labelledby="teaching-courses-title" data-reveal="up">
      <div className="container-wide">
        <div className="teaching-section-heading">
          <div><span className="eyebrow">Published course records</span><h2 id="teaching-courses-title">Teaching in practice.</h2></div>
          <p>Published course titles and codes, organized by academic year.</p>
        </div>
        {teachingQuery.isLoading && <p className="teaching-query-message" role="status">{slowLoading ? 'Course information is taking longer than expected.' : 'Loading course information…'} {slowLoading && <button type="button" onClick={() => { setSlowLoading(false); void teachingQuery.refetch(); }}>Try again</button>}</p>}
        {teachingQuery.isError && <p className="teaching-query-message" role="alert">Course information is temporarily unavailable. <button type="button" onClick={() => { void teachingQuery.refetch(); }}>Try again</button></p>}
        {!teachingQuery.isLoading && !teachingQuery.isError && courses.length === 0 && <p className="teaching-query-message">No academic-year course records are currently published in the directory above.</p>}
        {currentAcademicYear && <div className="teaching-course-block teaching-current">{renderYear(currentAcademicYear)}</div>}
        {previousAcademicYears.length > 0 && <div className="teaching-course-block">
          <div className="teaching-section-heading"><div><span className="eyebrow">Course archive</span><h2>Previous courses.</h2></div></div>
          <div className="teaching-year-grid">{previousAcademicYears.map(renderYear)}</div>
        </div>}
      </div>
    </section>
    <section className="section section-tinted teaching-details-section" aria-label="Teaching approach" data-reveal="up">
      <div className="container-wide teaching-detail-grid">
        <article className="teaching-detail"><span className="eyebrow">Teaching Philosophy</span><h2>Learning across disciplines.</h2><p>Teaching connects global health, One Health, environmental health, and field-based learning. It emphasizes practical experience, critical thinking, and connecting evidence to real-world health challenges.</p></article>
        <article className="teaching-detail"><span className="eyebrow">Graduate Supervision</span><h2>Research-led supervision.</h2><p>Graduate supervision is connected to the lab’s research areas, including environmental health, exposure science, air pollution, climate-health, One Health, global health, epidemiology, and intervention research.</p></article>
        <article className="teaching-detail"><span className="eyebrow">Experiential Learning</span><h2>Evidence in the field.</h2><p>The International Field School supports field-based and interdisciplinary learning, connecting evidence with real-world health challenges.</p></article>
      </div>
    </section>
    <section className="section teaching-links-section" aria-labelledby="teaching-links-title" data-reveal="up">
      <div className="container-wide">
        <div className="teaching-section-heading"><div><span className="eyebrow">Explore the lab</span><h2 id="teaching-links-title">Related pages.</h2></div></div>
        <nav className="teaching-links" aria-label="Related P3 Health Lab pages">
          {teachingRoutes.map(([label, href]) => <Link className="teaching-route-link" href={href} key={href}>{label}</Link>)}
        </nav>
      </div>
    </section>
  </div>;
}

const opportunityCategories = [
  "Graduate Students",
  "Postdoctoral Researchers",
  "Research Assistants & Staff",
  "Undergraduate / Research Students",
  "Visiting Students & Scholars",
];

function Opportunity() {
  const { data, isLoading, isError, refetch } = useGetPublicOpportunities();
  const { data: profileData } = useGetPublicProfile();
  const opportunities = data?.opportunities ?? [];
  const generalEmail = profileData?.contact.labEmail ?? profileData?.contact.contactEmail;
  const [slowLoading, setSlowLoading] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setSlowLoading(false);
      return;
    }
    const timer = window.setTimeout(() => setSlowLoading(true), 10000);
    return () => window.clearTimeout(timer);
  }, [isLoading]);

  return <>
    <PageHero eyebrow="Opportunity" title={<>Opportunity at the <em>P3 Health Lab.</em></>} text="Explore current openings, research areas and contact details for prospective lab members." className="p3-purple-hero" />
    <section className="section opportunity-research" aria-labelledby="opportunity-research-title" data-reveal="up">
      <div className="container-wide">
        <div className="opportunity-interest">
          <span className="eyebrow">Prospective researchers</span>
          <h2 id="opportunity-research-title">Interdisciplinary research opportunities</h2>
          <p>I am accepting qualified postdoctoral researchers, research assistants and graduate students (PhD and MSc) interested in interdisciplinary work in statistics, GIS and related methods, with research at the intersection of:</p>
          <ul className="opportunity-research-areas">
            <li>Environmental Health and Air Pollution</li>
            <li>Climate Change: Wildfires, Heatwaves and Extreme Events</li>
            <li>Children's Environmental Health</li>
            <li>Environmental Justice and Health Equity</li>
            <li>Black, African and Caribbean Communities</li>
            <li>Immigrant and Newcomer Health</li>
            <li>Global Health, One Health and Antimicrobial Resistance (AMR)</li>
            <li>E-mobility, Sustainable Transport and Healthy Cities</li>
            <li>Chemical and Biological Exposures</li>
            <li>School-Based Environmental Health Interventions</li>
            <li>Behaviour Change and Risk Communication</li>
            <li>Citizen Science and Community-Engaged Research</li>
            <li>AI and Machine Learning</li>
          </ul>
          <address className="opportunity-contact">
            <strong>Contact: Egide Kalisa, PhD</strong>
            <a href="mailto:ekalisa2@uwo.ca">ekalisa2@uwo.ca</a>
            <a href="https://orcid.org/0000-0001-9906-583X" target="_blank" rel="noopener noreferrer">ORCID profile <ArrowUpRight size={14} aria-hidden="true" /></a>
            <span>Schulich School of Medicine &amp; Dentistry, Western University, 1465 Richmond Street, PHFM 3129, London, Ontario, Canada N6G 2M1</span>
          </address>
        </div>
      </div>
    </section>
    {(isLoading || isError || opportunities.length > 0) && (
      <section className="section" id="opportunities" data-reveal="up">
      <div className="container-wide">
        <div className="section-head">
          <div><span className="eyebrow">Prospective members</span><h2>Opportunities</h2></div>
          <p>Only published, current listings appear here.</p>
        </div>
        {isLoading && <p className="opportunities-empty" role="status">{slowLoading ? 'Opportunity information is taking longer than expected.' : 'Loading opportunity information…'} {slowLoading && <button type="button" onClick={() => { void refetch(); }}>Try again</button>}</p>}
        {isError && <p className="opportunities-empty" role="alert">Opportunity information could not be loaded. <button type="button" onClick={() => { void refetch(); }}>Try again</button></p>}
        {!isLoading && !isError && opportunities.length === 0 && <p className="opportunities-empty" role="status">No current openings are published. For general inquiries, see the <Link href="/contact">contact options</Link>.</p>}
        {!isLoading && !isError && opportunities.length > 0 && <div className="opportunity-category-list">
          {opportunityCategories.map((category, index) => {
            const categoryOpportunities = opportunities.filter((opportunity) => opportunity.category === category);
            return <section className="opportunity-category" key={category} data-testid={`card-opportunity-${index}`}>
              <h3>{category}</h3>
              <div className="opportunity-record-list">
                {categoryOpportunities.map((opportunity, opportunityIndex) => (
                  <article className="opportunity-record" key={`${opportunity.title}-${opportunityIndex}`}>
                    <div className="opportunity-record-heading">
                      <h4>{opportunity.title}</h4>
                      <span className={`opportunity-status is-${opportunity.status.toLowerCase()}`}>{opportunity.status}</span>
                    </div>
                    {opportunity.shortDescription.trim() && <p className="opportunity-short-description">{opportunity.shortDescription}</p>}
                    {opportunity.fullDetails.trim() && <div className="opportunity-prose"><p>{opportunity.fullDetails}</p></div>}
                    {opportunity.applicationInstructions.trim() && <div className="opportunity-prose"><span className="eyebrow">Application instructions</span><p>{opportunity.applicationInstructions}</p></div>}
                    {opportunity.deadline && <p className="opportunity-deadline"><span className="eyebrow">Deadline</span><time dateTime={opportunity.deadline}>{opportunity.deadline}</time></p>}
                    {(opportunity.applicationEmail || opportunity.applicationUrl) && <div className="opportunity-links">
                      {opportunity.applicationEmail && <a href={`mailto:${opportunity.applicationEmail}`}>Email {opportunity.applicationEmail} <ArrowUpRight size={14} aria-hidden="true" /></a>}
                      {opportunity.applicationUrl && <a href={opportunity.applicationUrl} target="_blank" rel="noreferrer">View application details <ArrowUpRight size={14} aria-hidden="true" /></a>}
                    </div>}
                  </article>
                ))}
              </div>
            </section>;
          })}
        </div>}
      </div>
      </section>
    )}
    <section className="contact-band" id="contact" data-reveal="up">
      <div className="container-wide contact-grid">
        <div><span className="eyebrow">General inquiries</span><h2>Ask about getting involved.</h2><p>For general questions about joining or collaborating, contact P3 Health Lab.</p></div>
        {generalEmail
          ? <a className="button-primary" href={`mailto:${generalEmail}`} data-testid="link-involved-email">Email the lab <ArrowUpRight size={15} aria-hidden="true" /></a>
          : <Link className="button-primary" href="/contact" data-testid="link-involved-email">Contact the lab <ArrowUpRight size={15} aria-hidden="true" /></Link>}
      </div>
    </section>
  </>;
}

function NotFound() {
  return <div className="not-found"><div><span className="eyebrow">P3 / 404</span><h1 className="display">Not here.</h1><p>We couldn’t find that page, but there are plenty of good places to start.</p><Link href="/" className="button-primary" data-testid="link-not-found-home">Return home <ArrowUpRight size={14} aria-hidden="true" /></Link></div></div>;
}

function Router() {
  return <RoutedErrorBoundary><Switch>
    <Route path="/" component={Home} />
    <Route path="/research">{() => <Redirect to={`/research-project${window.location.hash}`} />}</Route>
    <Route path="/research-project" component={ResearchProject} />
    <Route path="/research-map" component={ResearchMap} />
    <Route path="/projects">{() => <Redirect to={`/research-project${window.location.hash}`} />}</Route>
    <Route path="/people" component={People} />
    <Route path="/about" component={About} />
    <Route path="/publications" component={Publications} />
    <Route path="/contact" component={Contact} />
    <Route path="/teaching" component={Teaching} />
    <Route path="/humekaneza" component={HumekaNezaPage} />
    <Route path="/get-involved">{() => <Redirect to={`/opportunity${window.location.hash}`} />}</Route>
    <Route path="/opportunity" component={Opportunity} />
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