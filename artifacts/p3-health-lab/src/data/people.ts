import mdPervezKabirPhoto from '@assets/2._Dr._Md_Pervez_Kabir_1790358118262.jpeg';
import allisonPertPhoto from '@assets/Allison_Pert0_1790358118374.webp';
import augustineOmodiekePhoto from '@assets/Augustine_Omodieke_(2)_1790358118959.jpg';
import oluWaseunBajulayePhoto from '@assets/Bajulaye_Oluwaseun_Oyindamola_1790358118831.webp';
import dorothyNamatovuPhoto from '@assets/Dorothy_Namatovu1)_1790358118875.png';
import farhanaRamizaPhoto from '@assets/Farhana_Rokaiya_Ramiza_1790358118660.webp';
import francisAcquahPhoto from '@assets/Francis_N._Acquah_1790358118740.webp';
import angeLisaIkireziPhoto from '@assets/IKIREZI_Ange_Lisa3_1790358118788.webp';
import zohaIrfanPhoto from '@assets/Zoha_Irfan-9_1790358118502.webp';

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
  href?: string;
};

type PersonSection = {
  id: string;
  title: string;
  members: PersonRecord[];
};

type FormerPerson = PersonRecord & {
  now?: string;
};

export const people: {
  director: PersonRecord & { affiliation: string; focus: string };
  sections: PersonSection[];
  former: FormerPerson[];
  collaborators: { name: string; description: string }[];
} = {
  director: {
    name: 'Dr. Egide Kalisa',
    role: 'Assistant Professor; Director, HELTH/P3 Health Lab',
    photo: '/images/profile-egide-purple-square.webp',
    affiliation: 'Western University',
    institution: 'Western University',
    focus: 'Environmental health; air pollution; climate change; children’s health; environmental justice; One Health; exposure science',
    researchFocus: 'Environmental health; air pollution; climate change; children’s health; environmental justice; One Health; exposure science',
    href: '',
  },
  sections: [
    {
      id: 'postdoctoral',
      title: 'Postdoctoral Fellows',
      members: [
        { name: 'Dr. Md Pervez Kabir', role: 'Postdoctoral Fellow', photo: mdPervezKabirPhoto, institution: 'Western University' },
      ],
    },
    {
      id: 'phd',
      title: 'PhD Students — Western University',
      members: [
        { name: 'Allison Pert', role: 'PhD Student', photo: allisonPertPhoto, institution: 'Western University', formerRole: 'MSc Student', status: 'Alumni / Current PhD' },
        { name: 'Augustine Omodieke', role: 'PhD Student', photo: augustineOmodiekePhoto, institution: 'Western University', researchFocus: 'Environmental epidemiology; air pollution; health economics', formerRole: 'MSc Student', status: 'Alumni / Current PhD' },
        { name: 'Francis Acquah', role: 'PhD Student', photo: francisAcquahPhoto, institution: 'Western University' },
        { name: 'Daniel Twum', role: 'PhD Student', institution: 'Western University' },
        { name: 'Abdul Rasheed Rasheed', role: 'PhD Student', institution: 'Western University' },
      ],
    },
    {
      id: 'masters',
      title: 'MSc Students — Western University',
      members: [
        { name: 'Zoha Irfan', role: 'MSc Student', photo: zohaIrfanPhoto, institution: 'Western University', researchFocus: 'PAHs; air pollution; exposure science' },
        { name: 'Oluwaseun Bajulaye', role: 'MSc Student', photo: oluWaseunBajulayePhoto, institution: 'Western University' },
        { name: 'Farhana Ramiza', role: 'MSc Student', photo: farhanaRamizaPhoto, institution: 'Western University' },
        { name: 'Ignatius Atuguba', role: 'MSc Student', institution: 'Western University' },
      ],
    },
    {
      id: 'global-health-interns',
      title: 'Global Health MSc Interns',
      members: [
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
      members: [
        { name: 'Ruiming Han', role: 'Research Assistant, MSc', institution: 'Western University', researchFocus: 'Air pollution; PAHs; metals; exposure analysis' },
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
      members: [
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
      members: [
        { name: 'Dioumacor Faye', role: 'PhD Student', photo: '/images/dioumacor-faye.webp', institution: 'Visiting International Student', country: 'Senegal' },
        { name: 'Dorothy Namatovu', role: 'MSc Student', photo: dorothyNamatovuPhoto, institution: 'Visiting International Student', country: 'Uganda' },
        { name: 'Ange Lisa Ikirezi', role: 'MSc Student', photo: angeLisaIkireziPhoto, institution: 'Visiting International Student', country: 'Rwanda' },
        { name: 'Marie Ange Tuyime', role: 'Undergraduate Student', institution: 'Visiting International Student', country: 'Rwanda' },
        { name: 'Isabel Ajagu', role: 'MSc Student / Visiting Scholar', institution: 'Visiting International Student', country: 'Nigeria' },
      ],
    },
  ],
  former: [
    { name: 'Victoria Bursey', role: 'Undergraduate Researcher', photo: '/images/victoria-bursey.webp', currentPosition: 'MSc Public Health, University of Toronto', now: 'MSc Public Health, University of Toronto', status: 'Alumni' },
    { name: 'Emily Airhart', role: 'Undergraduate Researcher', photo: '/images/emily-airhart.webp', currentPosition: 'MSc Student, University of Toronto', now: 'MSc Student, University of Toronto', status: 'Alumni' },
    { name: 'Shagun Chander', role: 'Undergraduate Researcher', institution: 'Western University', status: 'Current' },
  ],
  collaborators: [],
};
