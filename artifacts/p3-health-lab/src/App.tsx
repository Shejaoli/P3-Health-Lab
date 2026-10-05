import { type MouseEvent as ReactMouseEvent, type ReactNode, useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowUpRight, ChevronRight, Check, CircleArrowUp, ExternalLink, UserRound, X } from 'lucide-react';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AdminGate, AdminLoginPanel, AdminUploadGate } from '@/admin/AdminApp';
import { useGetPublicNews, useGetPublicOpportunities, useGetPublicProfile, useGetPublicTeaching } from '@workspace/api-client-react';
import logo from '@assets/p3_logo_1789065448410.png';
import labFilm from '@assets/VID-20260925-WA0008_1790438330372.mp4';
import humekanezaLogo from '@assets/IMG-20260910-WA0000_1790353414570.jpg';
import egideKalisaPhoto from '@assets/1._Dr._Egide_Kalisa_1790358118214.webp';
import mdPervezKabirPhoto from '@assets/2._Dr._Md_Pervez_Kabir_1790358118262.jpeg';
import allisonPertPhoto from '@assets/Allison_Pert0_1790358118374.webp';
import augustineOmodiekePhoto from '@assets/Augustine_Omodieke_(2)_1790358118959.jpg';
import oluWaseunBajulayePhoto from '@assets/Bajulaye_Oluwaseun_Oyindamola_1790358118831.webp';
import dioumacorFayePhoto from '@assets/Dioumacor_FAYE_(1)_1790358118917.png';
import dorothyNamatovuPhoto from '@assets/Dorothy_Namatovu1)_1790358118875.png';
import emilyAirhartPhoto from '@assets/Emily_Airhart1)_1790358118999.png';
import farhanaRamizaPhoto from '@assets/Farhana_Rokaiya_Ramiza_1790358118660.webp';
import francisAcquahPhoto from '@assets/Francis_N._Acquah_1790358118740.webp';
import angeLisaIkireziPhoto from '@assets/IKIREZI_Ange_Lisa3_1790358118788.webp';
import victoriaBurseyPhoto from '@assets/Victoria_Bursey_1790358119044.png';
import zohaIrfanPhoto from '@assets/Zoha_Irfan-9_1790358118502.webp';

const queryClient = new QueryClient();
const googleScholarUrl = 'https://scholar.google.co.nz/citations?user=yAPiYq8AAAAJ&hl=en';

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

const researchPrograms: {
  id: string;
  title: string;
  text: string;
  image: string;
  imageAlt: string;
  questions: string[];
  projects: { label: string; href?: string }[];
}[] = [
  {
    id: 'air-we-breathe',
    title: 'The Air We Breathe: Beyond PM2.5',
    text: 'Understanding the chemical and biological mixtures that shape what people actually breathe.',
    image: 'research-air-monitoring.jpg',
    imageAlt: 'Air-quality sampling instruments beside a road and trees.',
    questions: [
      'What does PM2.5 mass miss about chemical and biological composition?',
      'How do source mixtures vary across places and seasons?',
      'How can passive and low-cost monitoring expand exposure science?',
    ],
    projects: [
      { label: 'Beyond PM2.5' },
      { label: 'APAM-Net' },
      { label: 'Canadian air microbiome' },
      { label: 'Amazon air microbiome' },
    ],
  },
  {
    id: 'children-schools-exposure',
    title: 'Children, Schools & Personal Exposure',
    text: 'Studying children’s exposure across the school day, in classrooms, and along routes to school.',
    image: 'research-children-exposure.jpg',
    imageAlt: 'A researcher demonstrates air-quality monitoring equipment to children indoors.',
    questions: [
      'How do children’s exposures vary across classrooms, school days, and journeys to school?',
      'Which practical changes can support cleaner air in classrooms and school zones?',
      'How can personal and school-based monitoring inform healthier learning environments?',
    ],
    projects: [
      { label: '24-Hour Schoolchild' },
      { label: 'Cleaner classrooms', href: '/projects#classroom-clean-air-interventions' },
      { label: 'Routes to school', href: '/projects#clean-air-school-zones' },
      { label: 'CLEAN RIDE' },
    ],
  },
  {
    id: 'climate-wildfire-resilience',
    title: 'Climate, Wildfire & Environmental Resilience',
    text: 'Examining how climate-related hazards, including heat and wildfire smoke, affect exposure and health.',
    image: 'research-climate-monitoring.jpg',
    imageAlt: 'Outdoor weather and air-monitoring equipment at a fenced field site in winter.',
    questions: [
      'How do heat and air pollution combine to shape environmental exposure?',
      'How do wildfire smoke and other climate hazards affect communities?',
      'Which locally relevant strategies can strengthen protection and resilience?',
    ],
    projects: [
      { label: 'BREATHE-East Africa' },
      { label: 'Heat x air pollution' },
      { label: 'Wildfire protection', href: '/projects#equitable-air-quality-communication' },
    ],
  },
  {
    id: 'healthy-equitable-mobility',
    title: 'Healthy & Equitable Mobility',
    text: 'Connecting transportation, everyday exposure, and healthier, more equitable ways to move.',
    image: 'research-healthy-mobility.jpg',
    imageAlt: 'A field researcher carrying exposure monitors while walking on a tree-lined street.',
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
    image: 'research-citizen-science.jpg',
    imageAlt: 'Students observe a researcher demonstrating air-quality monitoring equipment.',
    questions: [
      'How can citizen science make environmental exposures visible and useful to communities?',
      'How can young people participate in environmental-health research and decision-making?',
      'How can research support more equitable access to information and action?',
    ],
    projects: [
      { label: 'Making the Invisible Visible', href: '/projects#making-the-invisible-visible' },
      { label: 'ACB youth' },
      { label: 'SHARED SKIES', href: '/projects#shared-skies' },
      { label: 'I Am an Air Quality Scientist', href: '/projects#i-am-an-air-quality-scientist' },
    ],
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

type ResearchMapLocation = {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  mapX: number;
  mapY: number;
  projectSlug: string;
  projectTitle: string;
  description: string;
  displayOrder: number;
};

const researchMapLocations: ResearchMapLocation[] = [
  {
    id: 'rwanda',
    name: 'Rwanda',
    country: 'Rwanda',
    latitude: -1.94,
    longitude: 29.87,
    mapX: 58.3,
    mapY: 51.1,
    projectSlug: projects[0].slug,
    projectTitle: projects[0].title,
    description: projects[0].description[0],
    displayOrder: 1,
  },
  {
    id: 'hamilton',
    name: 'Hamilton',
    country: 'Canada',
    latitude: 43.26,
    longitude: -79.87,
    mapX: 23.8,
    mapY: 23.5,
    projectSlug: projects[7].slug,
    projectTitle: projects[7].title,
    description: projects[7].description[0],
    displayOrder: 2,
  },
  {
    id: 'london',
    name: 'London',
    country: 'Canada',
    latitude: 42.98,
    longitude: -81.25,
    mapX: 30.8,
    mapY: 34.5,
    projectSlug: projects[7].slug,
    projectTitle: projects[7].title,
    description: projects[7].description[0],
    displayOrder: 3,
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

const featuredProjects = [
  { title: 'HumekaNeza School Air-Quality Campaign', slug: 'school-air-quality-campaign', text: 'The original HumekaNeza campaign was launched in schools in Rwanda to improve children’s understanding of air pollution and empower them to participate in solutions.' },
  { title: 'I Am an Air Quality Scientist', slug: 'i-am-an-air-quality-scientist', text: 'Students become citizen scientists by using air-quality monitors and other scientific tools to investigate pollution in their schools and communities.' },
  { title: 'One Sensor Per School', slug: 'one-sensor-per-school', text: 'This initiative aims to make air pollution visible by placing low-cost air-quality sensors in participating schools.' },
];

type PersonRecord = {
  name: string;
  role: string;
  photo?: string;
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
        photo: egideKalisaPhoto,
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
        photo: mdPervezKabirPhoto,
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
        photo: allisonPertPhoto,
        institution: 'Western University',
        formerRole: 'MSc Student',
        status: 'Alumni / Current PhD',
      },
      {
        name: 'Augustine Omodieke',
        role: 'PhD Student',
        photo: augustineOmodiekePhoto,
        institution: 'Western University',
        researchFocus: 'Environmental epidemiology; air pollution; health economics',
        formerRole: 'MSc Student',
        status: 'Alumni / Current PhD',
      },
      { name: 'Francis Acquah', role: 'PhD Student', photo: francisAcquahPhoto, institution: 'Western University' },
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
        photo: zohaIrfanPhoto,
        institution: 'Western University',
        researchFocus: 'PAHs; air pollution; exposure science',
      },
      { name: 'Oluwaseun Bajulaye', role: 'MSc Student', photo: oluWaseunBajulayePhoto, institution: 'Western University' },
      { name: 'Farhana Ramiza', role: 'MSc Student', photo: farhanaRamizaPhoto, institution: 'Western University' },
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
      { name: 'Dioumacor Faye', role: 'PhD Student', photo: dioumacorFayePhoto, institution: 'Visiting International Student', country: 'Senegal' },
      { name: 'Dorothy Namatovu', role: 'MSc Student', photo: dorothyNamatovuPhoto, institution: 'Visiting International Student', country: 'Uganda' },
      { name: 'Ange Lisa Ikirezi', role: 'MSc Student', photo: angeLisaIkireziPhoto, institution: 'Visiting International Student', country: 'Rwanda' },
      { name: 'Marie Ange Tuyime', role: 'Undergraduate Student', institution: 'Visiting International Student', country: 'Rwanda' },
      { name: 'Isabel Ajagu', role: 'MSc Student / Visiting Scholar', institution: 'Visiting International Student', country: 'Nigeria' },
    ],
  },
  {
    id: 'undergraduate-alumni',
    title: 'Undergraduate Alumni',
    people: [
      { name: 'Victoria Bursey', role: 'Undergraduate Researcher', photo: victoriaBurseyPhoto, currentPosition: 'MSc Public Health, University of Toronto', status: 'Alumni' },
      { name: 'Emily Airhart', role: 'Undergraduate Researcher', photo: emilyAirhartPhoto, currentPosition: 'MSc Student, University of Toronto', status: 'Alumni' },
      { name: 'Shagun Chander', role: 'Undergraduate Researcher', institution: 'Western University', status: 'Current' },
    ],
  },
];

function Shell({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [adminEntryOpen, setAdminEntryOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openMobileMenu, setOpenMobileMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const adminClickRef = useRef({ count: 0, lastClick: 0 });
  const nav: { label: string; href: string; external?: boolean; children?: [string, string][] }[] = [
    { label: 'Research', href: '/research' },
    { label: 'Global Research Map', href: '/research-map' },
    { label: 'People', href: '/people' },
    { label: 'Publications', href: googleScholarUrl, external: true },
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
            ) : item.external
              ? <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className="nav-link" data-testid={`link-nav-${item.label.toLowerCase()}`}>{item.label}<ExternalLink size={12} aria-hidden="true" /></a>
              : <Link key={item.href} href={item.href} className={`nav-link ${isActive(item.href) ? 'active' : ''}`} data-testid={`link-nav-${item.label.toLowerCase()}`}>{item.label}</Link>)}
          </nav>
          <button className={`menu-btn ${menuOpen ? 'is-open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} data-testid="button-mobile-menu">
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
          ) : item.external
            ? <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className="mobile-link" onClick={() => setMenuOpen(false)} data-testid={`link-mobile-${item.label.toLowerCase().replaceAll(' ', '-')}`}>{item.label}<ExternalLink size={13} aria-hidden="true" /></a>
            : <Link key={item.href} href={item.href} className={`mobile-link ${isActive(item.href) ? 'active' : ''}`} data-testid={`link-mobile-${item.label.toLowerCase().replaceAll(' ', '-')}`}>{item.label}</Link>)}
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
  const { data } = useGetPublicProfile();
  const profile = data?.contact;
  const directorDetails = [profile?.name, profile?.directorRole].filter((value): value is string => Boolean(value)).join(", ");
  const footerEmail = profile?.labEmail ?? profile?.contactEmail;
  return <footer className="footer">
    <div className="container-wide footer-compact">
      <div className="footer-id">
        <button type="button" className="footer-logo-button" onClick={onLogoClick} aria-label="P3 Health Lab logo"><img className="footer-logo" src={logo} alt="" /></button>
        <div>
          <p className="footer-name">{profile?.labName || "P3 Health Lab"}</p>
          {(directorDetails || profile?.university) && <p>{directorDetails}{directorDetails && profile?.university && <br />}{profile?.university}</p>}
        </div>
      </div>
      <div className="footer-links">
        {footerEmail
          ? <a href={`mailto:${footerEmail}`} data-testid="link-footer-email">{footerEmail}</a>
          : <Link href="/contact" data-testid="link-footer-email">Contact</Link>}
        <Link href="/about" data-testid="link-footer-about">About</Link>
        <Link href="/humekaneza" data-testid="link-footer-humekaneza">HumekaNeza</Link>
        <a href={googleScholarUrl} target="_blank" rel="noopener noreferrer" data-testid="link-footer-google-scholar">Google Scholar <ExternalLink size={12} aria-hidden="true" /></a>
        <a href="https://www.uwo.ca" target="_blank" rel="noreferrer" data-testid="link-western">Western University <ExternalLink size={12} aria-hidden="true" /></a>
      </div>
    </div>
    <div className="container-wide footer-bottom"><span>© {new Date().getFullYear()} P3 Health Lab</span></div>
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
  const { data: newsData, isLoading: isNewsLoading, isError: isNewsError } = useGetPublicNews();
  const latestNews = (newsData?.news ?? []).slice(0, 2);
  const schoolProgram = researchPrograms.find((program) => program.id === 'children-schools-exposure');
  const director = peopleGroups[0].people[0];
  const mappedCountries = Array.from(new Set(researchMapLocations.map((location) => location.country)));

  return <>
    <section className="home-hero" aria-labelledby="home-title">
      <div className="container-wide home-hero-inner">
        <div className="home-hero-media">
          <img src="/images/home-classroom-fieldwork.jpg" alt="Dr. Egide Kalisa teaching students during a classroom air-quality workshop." />
        </div>
        <div className="home-hero-copy">
          <h1 id="home-title">P3 Health Lab</h1>
          <span className="home-hero-eyebrow">People · Place · Planet</span>
          <p className="home-hero-summary">Professor-led environmental health research on air pollution, climate, children, mobility and environmental justice.</p>
          <div className="home-hero-identity">
            <strong>{director.name}</strong>
            <span>{director.role}</span>
            <span>{director.institution}</span>
          </div>
          <div className="home-hero-actions">
            <Link href="/research" className="button-primary" data-testid="link-home-hero-research">Explore research <ArrowUpRight size={15} aria-hidden="true" /></Link>
            <Link href="/people" className="home-hero-secondary" data-testid="link-home-hero-people">Meet the team <ChevronRight size={15} aria-hidden="true" /></Link>
          </div>
        </div>
      </div>
    </section>

    <section className="home-block home-research-block" aria-labelledby="home-research-title">
      <div className="container-wide">
        <div className="home-block-head">
          <div><span className="eyebrow">Research / programs</span><h2 id="home-research-title">Research programs</h2></div>
          <Link href="/research" className="text-link" data-testid="link-home-research-all">All research <ArrowUpRight size={14} aria-hidden="true" /></Link>
        </div>
        <div className="home-research-layout">
          {schoolProgram && <Link href={`/research#${schoolProgram.id}`} className="home-school-teaser" data-testid="card-home-school-program">
            <img src={`/images/${schoolProgram.image}`} alt={schoolProgram.imageAlt} />
            <div className="home-school-teaser-copy">
              <span className="eyebrow">Children &amp; schools</span>
              <h3>{schoolProgram.title}</h3>
              <p>{schoolProgram.text}</p>
              <span className="home-inline-action">Explore this program <ArrowUpRight size={14} aria-hidden="true" /></span>
            </div>
          </Link>}
          <ul className="home-list home-program-list">
            {researchPrograms.filter((program) => program.id !== schoolProgram?.id).map((program, index) => <li key={program.id}><Link href={`/research#${program.id}`} data-testid={`card-home-research-${index}`}><h3>{program.title}</h3><p>{program.text}</p></Link></li>)}
          </ul>
        </div>
      </div>
    </section>

    <section className="home-block home-projects-block" aria-labelledby="home-projects-title">
      <div className="container-wide">
        <div className="home-block-head"><div><span className="eyebrow">Selected work</span><h2 id="home-projects-title">Featured projects</h2></div><Link href="/projects" className="text-link" data-testid="link-home-projects-all">All projects <ArrowUpRight size={14} aria-hidden="true" /></Link></div>
        <div className="home-projects-layout">
          <ul className="home-list home-project-list">
            {featuredProjects.map((project, index) => <li key={project.title}><Link href={`/projects#${project.slug}`} data-testid={`card-home-project-${index}`}><h3>{project.title}</h3><p>{project.text}</p></Link></li>)}
          </ul>
          <figure className="home-methods-photo">
            <img src="/images/research-air-monitoring.jpg" alt="Field air-quality monitoring equipment beside a road and trees." />
            <figcaption>Field monitoring in the environments where people live and move.</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section className="home-block home-footprint-block" aria-labelledby="home-footprint-title">
      <div className="container-wide home-footprint-layout">
        <div className="home-footprint-copy">
          <span className="eyebrow">Global footprint</span>
          <h2 id="home-footprint-title">Research across connected communities.</h2>
          <p>Current verified project settings include {mappedCountries.join(' and ')}. The map shows locations named in existing project records.</p>
          <Link href="/research-map" className="text-link" data-testid="link-home-research-map">Explore the global research map <ArrowUpRight size={14} aria-hidden="true" /></Link>
        </div>
        <Link href="/research-map" className="home-map-preview" aria-label="Open the global research map showing Rwanda, Hamilton and London">
          <div className="home-map-canvas" aria-hidden="true">
            <svg viewBox="0 0 1000 480" preserveAspectRatio="none">
              <g className="home-map-graticule"><path d="M0 80H1000M0 160H1000M0 240H1000M0 320H1000M0 400H1000" /><path d="M125 0V480M250 0V480M375 0V480M500 0V480M625 0V480M750 0V480M875 0V480" /></g>
              <path className="home-map-contour" d="M92 147c42-29 86-30 126-4 26 17 45 13 73 5 31-9 65 2 89 29 19 22 33 34 70 39 35 5 55 23 57 48 2 25-24 38-65 31-43-7-74 11-111 18-39 8-72-7-99-27-25-18-53-32-82-48-35-19-70-60-58-91Zm488 125c30-25 64-35 96-24 28 10 42 30 63 44 23 15 53 14 72 36 15 18 9 40-12 50-32 15-67-5-88-17-24-14-45-15-74-10-31 6-66-7-73-32-5-17 1-34 16-47Zm224-212c21-12 48-9 67 5 15 11 20 28 13 41-11 19-42 21-64 9-19-10-35-32-26-47 3-4 6-6 10-8Z" />
            </svg>
            {researchMapLocations.map((location) => <span className="home-map-marker" key={location.id} style={{ left: `${location.mapX}%`, top: `${location.mapY}%` }}><span className="home-map-marker-dot" /><span className="home-map-marker-label">{location.name}</span></span>)}
          </div>
          <ul className="home-map-key">
            {researchMapLocations.map((location) => <li key={location.id}><strong>{location.name}</strong><span>{location.country}</span></li>)}
          </ul>
        </Link>
      </div>
    </section>

    <section className="home-block home-team-block" aria-labelledby="home-team-title">
      <div className="container-wide home-team-layout">
        <div className="home-team-copy">
          <span className="eyebrow">Meet the team</span>
          <h2 id="home-team-title">People behind the work.</h2>
          <p>P3 Health Lab is led by Dr. Egide Kalisa at Western University, with students and researchers working across environmental health and exposure science.</p>
          <Link href="/people" className="text-link" data-testid="link-home-people">Meet the full team <ArrowUpRight size={14} aria-hidden="true" /></Link>
        </div>
        <article className="home-team-lead">
          {director.photo && <img src={director.photo} alt={`Portrait of ${director.name}.`} />}
          <div><strong>{director.name}</strong><span>{director.role}</span><span>{director.institution}</span></div>
        </article>
      </div>
    </section>

    <section className="home-block home-scholar-news-block" aria-labelledby="home-scholar-news-title">
      <div className="container-wide">
        <div className="home-block-head"><div><span className="eyebrow">Publications &amp; updates</span><h2 id="home-scholar-news-title">Google Scholar and latest news</h2></div></div>
        <div className="home-scholar-news-layout">
          <div className="home-scholar-feature">
            <span className="eyebrow">Publications</span>
            <h3>Dr. Egide Kalisa on Google Scholar</h3>
            <p>Find the current list of publications, citations, and scholarly activity on Google Scholar.</p>
            <a href={googleScholarUrl} target="_blank" rel="noopener noreferrer" className="text-link" data-testid="link-home-publications">View Google Scholar <ExternalLink size={14} aria-hidden="true" /></a>
          </div>
          <div className="home-latest-news">
            <div className="home-latest-news-heading"><h3>Latest news</h3><Link href="/news" className="text-link" data-testid="link-home-news">All news <ArrowUpRight size={14} aria-hidden="true" /></Link></div>
            {isNewsLoading && <p className="home-news-state" role="status">Loading news and updates…</p>}
            {isNewsError && <p className="home-news-state" role="alert">News and updates could not be loaded. Please try again later.</p>}
            {!isNewsLoading && !isNewsError && latestNews.length === 0 && <p className="home-news-state" role="status">News and updates will be posted here when available.</p>}
            {!isNewsLoading && !isNewsError && latestNews.length > 0 && <div className="home-news-list">
              {latestNews.map((item, index) => {
                const displayDate = formatNewsDate(item.date);
                return <article className="home-news-item" key={`${item.headline}-${item.date ?? 'undated'}-${index}`}>
                  {displayDate && <time dateTime={displayDate.dateTime}>{displayDate.label}</time>}
                  <div><h4>{item.headline}</h4>{item.summary.trim() && <p>{item.summary}</p>}</div>
                </article>;
              })}
            </div>}
          </div>
        </div>
      </div>
    </section>
  </>;
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

function PageHero({ eyebrow, title, text, action }: { eyebrow: string; title: ReactNode; text: string; action?: ReactNode }) {
  return <section className="page-hero" data-reveal="up"><div className="container-wide"><span className="eyebrow">{eyebrow}</span><h1 className="display">{title}</h1><p>{text}</p>{action && <div className="hero-actions">{action}</div>}</div></section>;
}

function Research() {
  return <div className="research-page">
    <PageHero eyebrow="Research" title="From Exposure Science to Intervention" text="We study what people breathe and experience across homes, schools, streets, and changing climates. Our five research programs connect exposure science with community-engaged research and practical, evidence-led solutions." />

    <nav className="research-program-nav" aria-label="Research programs">
      <div className="container-wide">
        <ol>
          {researchPrograms.map((program, index) => <li key={program.id}>
            <a href={`#${program.id}`} data-testid={`link-research-anchor-${index}`}>
              <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              {program.title}
            </a>
          </li>)}
        </ol>
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
            <div className="research-program-content">
              <figure className="research-program-figure">
                <img
                  src={`${import.meta.env.BASE_URL}images/${program.image}`}
                  alt={program.imageAlt}
                  width="1040"
                  height="720"
                  loading="lazy"
                  decoding="async"
                  data-testid={`img-research-${program.id}`}
                />
              </figure>
              <div className="research-program-details">
                <section aria-labelledby={`research-questions-title-${program.id}`}>
                  <h3 id={`research-questions-title-${program.id}`}>Research questions</h3>
                  <ul className="research-question-list">
                    {program.questions.map((question, questionIndex) => <li key={question} data-testid={`text-research-question-${program.id}-${questionIndex}`}>{question}</li>)}
                  </ul>
                </section>
                <section aria-labelledby={`research-projects-title-${program.id}`}>
                  <h3 id={`research-projects-title-${program.id}`}>Current projects</h3>
                  <ul className="research-project-list">
                    {program.projects.map((project, projectIndex) => <li key={project.label}>
                      {project.href
                        ? <Link href={project.href} data-testid={`link-research-project-${program.id}-${projectIndex}`}>{project.label}</Link>
                        : <span>{project.label}</span>}
                    </li>)}
                  </ul>
                </section>
              </div>
            </div>
            <nav className="research-program-resources" aria-label={`Related resources for ${program.title}`}>
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

    <section className="research-context" aria-labelledby="research-context-title">
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
          <div id="research-methods">
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
          <li><Link href="/projects" className="text-link" data-testid="link-research-projects">Projects</Link></li>
          <li><Link href="/research-map" className="text-link" data-testid="link-research-map">Global Research Map</Link></li>
          <li><a href={googleScholarUrl} target="_blank" rel="noopener noreferrer" className="text-link" data-testid="link-research-publications">Google Scholar <ExternalLink size={14} aria-hidden="true" /></a></li>
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
          <div className="projects-humeka-identity">
            <img src={humekanezaLogo} alt="HumekaNeza Breathe Easy logo with a tree and roots" width="1600" height="1600" loading="lazy" decoding="async" data-testid="img-projects-humekaneza-logo" />
            <div className="projects-humeka-copy">
              <span className="eyebrow">HumekaNeza initiative</span>
              <Link href="/humekaneza" className="text-link" data-testid="link-projects-humekaneza">About HumekaNeza <ArrowUpRight size={14} aria-hidden="true" /></Link>
            </div>
          </div>
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
        <div className="projects-related-link">
          <Link href="/research-map" className="text-link" data-testid="link-projects-research-map">View global research map <ArrowUpRight size={14} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  </>;
}

function ResearchMap() {
  const [selectedId, setSelectedId] = useState(researchMapLocations[0].id);
  const selectedLocation = researchMapLocations.find((location) => location.id === selectedId) ?? researchMapLocations[0];

  return <>
    <PageHero
      eyebrow="Global Research Map"
      title={<>Research Across <em>Communities</em></>}
      text="A geographic view of communities and settings connected to P3 Health Lab research and initiatives."
    />
    <section className="section research-map-section" data-reveal="up">
      <div className="container-wide">
        <div className="research-map-layout">
          <div className="research-map-visual-panel">
            <div className="research-map-heading">
              <div>
                <span className="eyebrow">Verified locations</span>
                <h2>Connected settings, clearly placed.</h2>
              </div>
              <span className="research-map-count">{researchMapLocations.length} locations</span>
            </div>
            <div className="research-map-canvas" aria-label="Schematic geographic view of verified P3 Health Lab locations">
              <svg className="research-map-grid" viewBox="0 0 1000 480" aria-hidden="true">
                <g className="research-map-graticule">
                  <path d="M0 80H1000M0 160H1000M0 240H1000M0 320H1000M0 400H1000" />
                  <path d="M125 0V480M250 0V480M375 0V480M500 0V480M625 0V480M750 0V480M875 0V480" />
                </g>
                <path className="research-map-contour" d="M92 147c42-29 86-30 126-4 26 17 45 13 73 5 31-9 65 2 89 29 19 22 33 34 70 39 35 5 55 23 57 48 2 25-24 38-65 31-43-7-74 11-111 18-39 8-72-7-99-27-25-18-53-32-82-48-35-19-70-60-58-91Zm488 125c30-25 64-35 96-24 28 10 42 30 63 44 23 15 53 14 72 36 15 18 9 40-12 50-32 15-67-5-88-17-24-14-45-15-74-10-31 6-66-7-73-32-5-17 1-34 16-47Zm224-212c21-12 48-9 67 5 15 11 20 28 13 41-11 19-42 21-64 9-19-10-35-32-26-47 3-4 6-6 10-8Z" />
              </svg>
              {researchMapLocations.map((location) => (
                <button
                  type="button"
                  className={`research-map-marker ${selectedId === location.id ? 'is-selected' : ''}`}
                  key={location.id}
                  style={{ left: `${location.mapX}%`, top: `${location.mapY}%` }}
                  onClick={() => setSelectedId(location.id)}
                  aria-label={`Show verified research connected to ${location.name}, ${location.country}`}
                  aria-pressed={selectedId === location.id}
                >
                  <span className="research-map-marker-dot" aria-hidden="true" />
                  <span className="research-map-marker-label">{location.name}</span>
                </button>
              ))}
            </div>
            <p className="research-map-note">Schematic geographic view, not to scale. Locations appear only where existing project content names the setting.</p>
          </div>
          <aside className="research-map-detail" aria-live="polite">
            <span className="eyebrow">Selected location</span>
            <h2>{selectedLocation.name}</h2>
            <p className="research-map-country">{selectedLocation.country}</p>
            <p>{selectedLocation.description}</p>
            <div className="research-map-detail-record">
              <span className="eyebrow">Connected initiative</span>
              <strong>{selectedLocation.projectTitle}</strong>
              <Link className="text-link" href={`/projects#${selectedLocation.projectSlug}`}>View project record <ArrowUpRight size={14} aria-hidden="true" /></Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
    <section className="section section-tinted research-map-list-section" data-reveal="up">
      <div className="container-wide">
        <div className="section-head">
          <div><span className="eyebrow">Accessible location list</span><h2>The same record, in plain text.</h2></div>
          <p>Select a location to update the map detail, or follow the project link to read the full verified record.</p>
        </div>
        <div className="research-map-location-list">
          {researchMapLocations.map((location) => (
            <article className={`research-map-list-item ${selectedId === location.id ? 'is-selected' : ''}`} key={location.id}>
              <button type="button" onClick={() => setSelectedId(location.id)} aria-pressed={selectedId === location.id}>
                <span className="research-map-list-index">{String(location.displayOrder).padStart(2, '0')}</span>
                <span><strong>{location.name}</strong><small>{location.country}</small></span>
                <ChevronRight size={16} aria-hidden="true" />
              </button>
              <div className="research-map-list-record">
                <span>{location.projectTitle}</span>
                <Link className="text-link" href={`/projects#${location.projectSlug}`}>Project record <ArrowUpRight size={14} aria-hidden="true" /></Link>
              </div>
            </article>
          ))}
        </div>
        <p className="research-map-incomplete">Additional research locations will appear here as verified information becomes available.</p>
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
                      <div className={`person-record-photo ${person.photo ? '' : 'is-empty'}`}>
                        {person.photo
                          ? <img src={person.photo} alt={`${person.name} portrait`} loading="lazy" />
                          : <div className="person-record-placeholder">
                              <UserRound size={34} strokeWidth={1.5} aria-hidden="true" />
                              <span>Portrait not provided</span>
                            </div>}
                      </div>
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
  const orcid = getExternalLink('ORCID');
  const additionalProfileLinks = externalLinks.filter(({ label }) => ['CV', 'Publication Profile', 'CV / Publication Profile'].includes(label));

  return <div className="publications-page">
    <PageHero
      eyebrow="Publications"
      title="Research & Scholarship"
      text="P3 Health Lab contributes research across environmental health, air pollution, exposure science, climate change, children’s environmental health, environmental microbiology, antimicrobial resistance, clinical trials, One Health, and global health."
    />
    <section className="section publications-content" data-reveal="up">
      <div className="container-wide">
        <p className="publications-intro">Our work spans observational studies, exposure assessment, laboratory and field-based research, randomized controlled trials, community-engaged research, and interdisciplinary collaborations.</p>
        <div className="publication-profile-grid">
          <article className="publication-profile-record">
            <span className="eyebrow">Google Scholar</span>
            <h2>Google Scholar</h2>
            <p>For the most up-to-date list of publications, citations, and scholarly impact:</p>
            <a href={googleScholar.url} target="_blank" rel="noopener noreferrer" data-testid="link-publications-google-scholar">View Dr. Egide Kalisa’s Publications on Google Scholar <ArrowUpRight size={14} aria-hidden="true" /></a>
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

function formatNewsDate(value: Date | string | null) {
  if (!value) return null;
  const date = value instanceof Date
    ? value
    : new Date(value.length === 10 ? `${value}T00:00:00Z` : value);
  if (Number.isNaN(date.getTime())) return null;
  return {
    dateTime: date.toISOString().slice(0, 10),
    label: new Intl.DateTimeFormat('en', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    }).format(date),
  };
}

function News() {
  const { data, isLoading, isError } = useGetPublicNews();
  const newsItems = data?.news ?? [];

  return <div className="news-page">
    <PageHero eyebrow="News" title="News" text="Updates from P3 Health Lab." />
    <section className="section" aria-labelledby="news-section-title" data-reveal="up">
      <div className="container-wide">
        <div className="section-head">
          <div><span className="eyebrow">News</span><h2 id="news-section-title">News and updates</h2></div>
        </div>
        {isLoading && <p className="news-state" role="status">Loading news and updates…</p>}
        {isError && <p className="news-state" role="alert">News and updates could not be loaded. Please try again later.</p>}
        {!isLoading && !isError && newsItems.length === 0 && (
          <p className="news-empty-state" role="status" data-testid="empty-news">News and updates will be posted here when available.</p>
        )}
        {!isLoading && !isError && newsItems.length > 0 && (
          <div className="news-list">
            {newsItems.map((item, index) => {
              const displayDate = formatNewsDate(item.date);
              return <article
                className={`news-item${displayDate ? '' : ' news-item-no-date'}`}
                key={`${item.headline}-${item.date ?? 'undated'}-${index}`}
              >
                {displayDate && <time className="news-item-date" dateTime={displayDate.dateTime}>{displayDate.label}</time>}
                <div className="news-item-copy">
                  <h3>{item.headline}</h3>
                  {item.summary.trim() && <p className="news-item-summary">{item.summary}</p>}
                  {item.body.trim() && <p className="news-item-body">{item.body}</p>}
                </div>
              </article>;
            })}
          </div>
        )}
      </div>
    </section>
  </div>;
}

function Contact() {
  const { data, isLoading } = useGetPublicProfile();
  const profile = data?.contact;
  const contactRows: Array<{ label: string; value: string }> = [
    { label: "Department", value: profile?.department ?? "" },
    { label: "University", value: profile?.university ?? "" },
    { label: "Office", value: profile?.office ?? "" },
    { label: "Email", value: profile?.contactEmail ?? "" },
  ].filter(({ value }) => Boolean(value.trim()));

  return <>
    <PageHero eyebrow="Contact / 09" title={<>A clear way to <em>connect.</em></>} text="Verified contact details for P3 Health Lab / HELTH Lab." />
    <section className="section" data-reveal="up">
      <div className="container-wide contact-profile-grid">
        <div>
          <span className="eyebrow">Faculty contact</span>
          <h2>{profile?.name || "P3 Health Lab"}</h2>
          {profile?.appointment && <div className="intro-stat"><b>01</b><span>{profile.appointment}</span></div>}
          {profile?.directorRole && <div className="intro-stat" style={{ marginTop: 24 }}><b>02</b><span>{profile.directorRole}</span></div>}
        </div>
        <div>
          <p className="intro-copy">Connect with <mark>the lab.</mark></p>
          <p className="tiny-copy">Use the verified contact information below.</p>
          {isLoading && !contactRows.length && <p className="contact-loading" role="status">Loading contact information…</p>}
          {contactRows.length > 0 && <dl className="contact-detail-list">
            {contactRows.map(({ label, value }) => <div key={label}>
              <dt>{label}</dt>
              <dd>{label === "Email" ? <a href={`mailto:${value}`} data-testid="link-contact-email">{value}</a> : value}</dd>
            </div>)}
          </dl>}
          {!isLoading && !contactRows.length && <p className="contact-loading" role="status">Contact information is not currently available.</p>}
          {profile?.labEmail && <p className="general-lab-contact">General lab inquiries: <a href={`mailto:${profile.labEmail}`}>{profile.labEmail}</a></p>}
        </div>
      </div>
    </section>
  </>;
}

function Teaching() {
  const teachingQuery = useGetPublicTeaching();
  const courses = teachingQuery.data?.courses ?? [];
  const teachingAcademicYears = Array.from(new Set(courses.map(({ academicYear }) => academicYear)));
  const [currentAcademicYear, ...previousAcademicYears] = teachingAcademicYears;
  const renderYear = (year: string) => {
    const yearCourses = courses.filter((course) => course.academicYear === year);
    return (
      <div className="teaching-year" key={year} data-reveal="up">
        <div className="teaching-year-heading">
          <span className="eyebrow">Academic year</span>
          <h3>{year}</h3>
        </div>
        <div className="teaching-course-list">
          {yearCourses.map((course, index) => (
            <article className="teaching-course-row" key={`${year}-${course.courseCode}`} data-testid={`course-${year}-${index}`}>
              <span className="course-code">{course.courseCode}</span>
              <h4>{course.title}</h4>
            </article>
          ))}
        </div>
      </div>
    );
  };

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
        {teachingQuery.isLoading && <p className="contact-loading" role="status">Loading course information…</p>}
        {teachingQuery.isError && <p className="contact-loading" role="alert">Course information is temporarily unavailable.</p>}
        {!teachingQuery.isLoading && !teachingQuery.isError && courses.length === 0 && <p className="contact-loading" role="status">No courses are currently published.</p>}
        {currentAcademicYear && <div className="teaching-course-block teaching-current">{renderYear(currentAcademicYear)}</div>}
        <div className="teaching-course-block">
          <div className="teaching-section-heading">
            <div><span className="eyebrow">Previous Teaching</span><h2>Previous courses</h2></div>
          </div>
          <div className="teaching-year-grid">
            {previousAcademicYears.map(renderYear)}
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
  const approach = [
    { number: '01', title: 'Learn', text: 'Explore air pollution, environmental exposures and health through workshops, demonstrations and school-based learning.' },
    { number: '02', title: 'Measure', text: 'Use low-cost sensors and other monitoring tools to notice how air quality changes around school and community.' },
    { number: '03', title: 'Understand', text: 'Make sense of observations together: what might shape the air, what the information can tell us, and what it cannot.' },
    { number: '04', title: 'Act', text: 'Turn learning into practical steps—from reducing idling to sharing clear messages with families and school communities.' },
  ];
  const activities = [
    ['Try the air-quality flag', 'Connect air-quality information with classroom conversations and daily decisions.'],
    ['Become a young air scientist', 'Ask questions, use monitors and explore what measurements reveal about the places we learn.'],
    ['Make the invisible visible', 'Create posters, presentations and other ways to share environmental-health knowledge.'],
    ['Talk with family and community', 'Bring learning beyond the classroom through discussion, communication and shared ideas.'],
    ['Explore a cleaner school day', 'Consider idling, school routes, classroom air and outdoor activities as part of healthier environments.'],
  ];
  const initiatives = [
    { slug: 'making-the-invisible-visible', title: 'Making the Invisible Visible', label: 'Youth knowledge & participation', text: 'Youth ambassador learning, behaviour-change workshops, family dialogue and youth-created knowledge-translation products.' },
    { slug: 'shared-skies', title: 'SHARED SKIES / Global Classroom', label: 'Learning across communities', text: projects[5].description[1] },
    { slug: 'one-sensor-per-school', title: 'One Sensor Per School', label: 'School monitoring', text: projects[2].description[1] },
    { slug: 'clean-air-school-zones', title: 'Clean Air School Zones', label: 'Behaviour-change work', text: 'Anti-idling campaigns, safer school travel and community engagement around cleaner school environments.' },
  ];
  return <div className="humeka-page">
    <section className="humeka-masthead" aria-labelledby="humeka-title">
      <div className="container-wide humeka-masthead-inner">
        <div className="humeka-masthead-copy">
          <div className="humeka-brandline">
            <img src={humekanezaLogo} alt="HumekaNeza Breathe Easy emblem" width="1600" height="1600" data-testid="img-humekaneza-logo" />
            <span className="eyebrow">P3 Health Lab · Western University</span>
          </div>
          <h1 id="humeka-title">HumekaNeza<small>Breathe Easy</small></h1>
          <p className="humeka-tagline">Empowering schools and communities through air-quality citizen science.</p>
          <div className="humeka-hero-credits">
            <span>Child- and youth-centred environmental health</span>
            <span>Led by Dr. Egide Kalisa</span>
          </div>
          <a className="humeka-hero-link" href="#humeka-approach" data-testid="link-humekaneza-explore">Explore the approach <ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>
        <figure className="humeka-hero-photo">
          <img src="/images/home-classroom-fieldwork.jpg" alt="A school workshop in a bright brick classroom, with a facilitator speaking to students gathered around desks." fetchPriority="high" data-testid="img-humekaneza-classroom" />
          <figcaption><span>Learning together, in a real school setting</span><span>HumekaNeza · Rwanda</span></figcaption>
        </figure>
        <div className="humeka-orbit-label" aria-hidden="true">People <i /> Planet <i /> Place</div>
      </div>
    </section>

    <section className="humeka-intro section" aria-labelledby="humeka-intro-title" data-reveal="up">
      <div className="container-wide humeka-intro-grid">
        <div><span className="eyebrow">A little about us</span><h2 id="humeka-intro-title">Start with a question.<br /><em>Find a way forward.</em></h2></div>
        <div className="humeka-prose">
          <p>HumekaNeza is a child- and youth-centred environmental-health initiative founded by Dr. Egide Kalisa and led through P3 Health Lab at Western University. It began with school-based air-quality education in Rwanda, empowering children to understand air pollution and take part in solutions.</p>
          <p>Today, the work connects schools and communities to environmental-health learning, citizen science, research and practical action. Young people investigate their surroundings, make sense of what they learn, and share ideas that can support healthier schools, homes and communities.</p>
        </div>
      </div>
    </section>

    <section className="humeka-community section" aria-labelledby="humeka-community-title" data-reveal="up">
      <div className="container-wide">
        <div className="humeka-community-heading">
          <div><span className="eyebrow">Schools &amp; communities</span><h2 id="humeka-community-title">Air-quality questions live in everyday places.</h2></div>
          <p>Classrooms, streets and shared spaces are where people learn about the air around them—and where practical questions begin.</p>
        </div>
        <div className="humeka-community-gallery">
          <figure className="humeka-community-photo">
            <img src="/images/research-citizen-science.jpg" alt="Participants explore air-quality monitoring equipment during a citizen-science activity." loading="lazy" decoding="async" data-testid="img-humekaneza-field-monitor" />
            <figcaption><strong>Learning through citizen science</strong><span>People working with air-quality monitoring tools</span></figcaption>
          </figure>
          <figure className="humeka-community-photo">
            <img src="/images/research-healthy-mobility.jpg" alt="A field researcher wearing an air-quality monitoring pack walks along a roadside in Rwanda as traffic passes." loading="lazy" decoding="async" data-testid="img-humekaneza-community-route" />
            <figcaption><strong>Learning from daily routes</strong><span>People, movement and the air around us</span></figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section className="humeka-process section" id="humeka-approach" aria-labelledby="humeka-process-title" data-reveal="up">
      <div className="container-wide">
        <div className="humeka-section-heading">
          <span className="eyebrow">The HumekaNeza learning loop</span>
          <h2 id="humeka-process-title">From curiosity<br />to community action.</h2>
          <p>Four connected steps make environmental-health science tangible—and put young people’s questions at the centre.</p>
        </div>
        <ol className="humeka-process-list">
          {approach.map((step) => <li className="humeka-process-step" key={step.number} data-testid={`step-humekaneza-${step.title.toLowerCase()}`}>
            <span className="humeka-step-number">{step.number}</span><div><h3>{step.title}</h3><p>{step.text}</p></div>
          </li>)}
        </ol>
      </div>
    </section>

    <section className="humeka-activities section" aria-labelledby="humeka-activities-title" data-reveal="up">
      <div className="container-wide">
        <div className="humeka-section-heading humeka-activity-heading">
          <span className="eyebrow">A school day, with fresh eyes</span><h2 id="humeka-activities-title">Learning you can take<br />back to the classroom.</h2>
          <p>Possible ways to take part across HumekaNeza’s connected work.</p>
        </div>
        <div className="humeka-activity-layout">
          <ul className="humeka-activity-list">
            {activities.map(([title, text], index) => <li key={title} data-testid={`activity-humekaneza-${index + 1}`}><span className="humeka-activity-index">0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}
          </ul>
        </div>
      </div>
    </section>

    <section className="humeka-initiatives-section section" aria-labelledby="humeka-initiatives-title" data-reveal="up">
      <div className="container-wide">
        <div className="humeka-section-heading humeka-feature-head">
          <div><span className="eyebrow">Connected initiatives</span><h2 id="humeka-initiatives-title">Different places.<br /><em>Shared questions.</em></h2></div>
          <p>Projects bring together school learning, youth knowledge, community participation and environmental-health research.</p>
        </div>
        <div className="humeka-initiative-featured">
          <figure className="humeka-initiative-photo">
            <img src="/images/research-children-exposure.jpg" alt="A researcher demonstrates air-quality monitoring equipment to children gathered around a table." loading="lazy" decoding="async" data-testid="img-humekaneza-initiative-learning" />
            <figcaption><strong>Hands-on environmental-health learning</strong><span>A P3 Health Lab school activity</span></figcaption>
          </figure>
          <ul className="humeka-feature-grid">
            {initiatives.map((item, index) => <li key={item.slug} className={`humeka-feature-card humeka-feature-card-${index + 1}`}>
              <span className="humeka-feature-label">{item.label}</span>
              <h3>{item.title}</h3><p>{item.text}</p>
              <Link href={`/projects#${item.slug}`} data-testid={`link-humekaneza-project-${item.slug}`}>Explore initiative <ArrowUpRight size={15} aria-hidden="true" /></Link>
            </li>)}
          </ul>
        </div>
      </div>
    </section>

    <section className="humeka-evidence section" aria-labelledby="humeka-evidence-title" data-reveal="up">
      <div className="container-wide humeka-evidence-grid">
        <div className="humeka-section-heading">
          <span className="eyebrow">Learning in practice</span><h2 id="humeka-evidence-title">Research that stays close to real life.</h2>
          <p>HumekaNeza connects questions from schools and communities with P3 Health Lab’s broader work in exposure science, children’s environmental health and citizen science.</p>
          <Link className="humeka-evidence-link" href="/research" data-testid="link-humekaneza-research">Explore P3 research <ArrowUpRight size={15} aria-hidden="true" /></Link>
        </div>
        <div className="humeka-evidence-notes">
          <article><span className="eyebrow">In schools</span><h3>Learning by observing and measuring</h3><p>The Rwanda campaign includes school-based education, low-cost monitoring, air-quality flag activities and student-led environmental monitoring.</p></article>
          <article><span className="eyebrow">With young people</span><h3>Making knowledge shareable</h3><p>Making the Invisible Visible includes youth ambassador learning, behaviour-change workshops, family dialogue and youth-created knowledge-translation products.</p></article>
          <nav className="humeka-proof-links" aria-label="Explore lab evidence and updates">
            <a href={googleScholarUrl} target="_blank" rel="noopener noreferrer" data-testid="link-humekaneza-publications">Google Scholar <ExternalLink size={14} aria-hidden="true" /></a>
            <Link href="/news" data-testid="link-humekaneza-news">Lab news <ArrowUpRight size={14} aria-hidden="true" /></Link>
            <Link href="/projects#classroom-clean-air-interventions" data-testid="link-humekaneza-classroom-research">Classroom research <ArrowUpRight size={14} aria-hidden="true" /></Link>
          </nav>
        </div>
      </div>
    </section>

    <section className="humeka-partners" aria-label="P3 Health Lab and Western University affiliation">
      <div className="container-wide humeka-partners-inner">
        <span className="eyebrow">Institutional affiliation</span>
        <div className="humeka-affiliation-mark"><img src={logo} alt="P3 Health Lab emblem" width="1600" height="1600" loading="lazy" decoding="async" data-testid="img-humekaneza-p3-logo" /><strong>P3 Health Lab</strong></div>
        <a className="humeka-western-mark" href="https://www.uwo.ca" target="_blank" rel="noopener noreferrer" data-testid="link-humekaneza-western">Western University <ExternalLink size={13} aria-hidden="true" /></a>
        <p>HumekaNeza is part of P3 Health Lab’s research, collaboration and community-engaged work.</p>
      </div>
    </section>

    <section className="humeka-contact section" id="get-involved" aria-labelledby="humeka-contact-title" data-reveal="up">
      <div className="container-wide humeka-contact-inner">
        <div><span className="eyebrow">Schools · families · collaborators</span><h2 id="humeka-contact-title">Have a question<br />for HumekaNeza?</h2></div>
        <div><p>We welcome conversations with teachers, students, families, community organizations, researchers and environmental-health partners.</p>
          <div className="humeka-contact-actions">
            <a className="button-primary" href="mailto:p3healthlab@uwo.ca" data-testid="link-humekaneza-partner">Email P3 Health Lab <ArrowUpRight size={15} aria-hidden="true" /></a>
            <Link className="button-secondary" href="/contact" data-testid="link-humekaneza-contact">Contact page <ArrowUpRight size={15} aria-hidden="true" /></Link>
          </div>
        </div>
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

function GetInvolved() {
  const { data, isLoading, isError } = useGetPublicOpportunities();
  const { data: profileData } = useGetPublicProfile();
  const opportunities = data?.opportunities ?? [];
  const generalEmail = profileData?.contact.labEmail ?? profileData?.contact.contactEmail;

  return <>
    <PageHero eyebrow="Get involved / 06" title={<>Join the <em>lab.</em></>} text="Browse published opportunities by audience. General questions are welcome through the lab’s verified contact path." />
    <section className="section" id="opportunities" data-reveal="up">
      <div className="container-wide">
        <div className="section-head">
          <div><span className="eyebrow">Prospective members</span><h2>Opportunities</h2></div>
          <p>Only published, current listings appear here.</p>
        </div>
        {isLoading && <p className="opportunities-empty" role="status">Loading opportunity information…</p>}
        {isError && <p className="opportunities-empty" role="alert">Opportunity information could not be loaded. Please check again later.</p>}
        <div className="opportunity-category-list">
          {opportunityCategories.map((category, index) => {
            const categoryOpportunities = opportunities.filter((opportunity) => opportunity.category === category);
            return <section className="opportunity-category" key={category} data-testid={`card-opportunity-${index}`}>
              <h3>{category}</h3>
              <div className="opportunity-record-list">
                {categoryOpportunities.length > 0 ? categoryOpportunities.map((opportunity, opportunityIndex) => (
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
                )) : !isLoading && !isError && <p className="opportunities-empty" role="status">Opportunity information will be posted here when available.</p>}
              </div>
            </section>;
          })}
        </div>
      </div>
    </section>
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
    <Route path="/research" component={Research} />
    <Route path="/research-map" component={ResearchMap} />
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