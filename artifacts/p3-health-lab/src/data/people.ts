import egideKalisaPhoto from '@assets/1._Dr._Egide_Kalisa_1790358118214.webp';
import mdPervezKabirPhoto from '@assets/2._Dr._Md_Pervez_Kabir_1790358118262.jpeg';
import augustineOmodiekePhoto from '@assets/Augustine_Omodieke_(2)_1790358118959.jpg';
import dorothyNamatovuPhoto from '@assets/Dorothy_Namatovu1)_1790358118875.png';
import emilyAirhartPhoto from '@assets/Emily_Airhart1)_1790358118999.png';
import francisAcquahPhoto from '@assets/Francis_N._Acquah_1790358118740.webp';
import angeLisaIkireziPhoto from '@assets/IKIREZI_Ange_Lisa3_1790358118788.webp';
import dioumacorFayePhoto from '@assets/Dioumacor_FAYE_(1)_1790358118917.png';
import victoriaBurseyPhoto from '@assets/Victoria_Bursey_1790358119044.png';
import adolpheNdikubwimanaPhoto from '@assets/Adolphe_Ndikubwimana_profile.jpg';
import allisonPertProfilePhoto from '@assets/Allison_Pert_profile.jpg';
import farhanaRamizaPhoto from '@assets/Farhana_Rokaiya_Ramiza_profile.jpg';
import oluwaseunBajulayePhoto from '@assets/Oluwaseun_Bajulaye_profile.jpg';

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
  linkedin?: string;
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
    photo: egideKalisaPhoto,
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
        { name: 'Dr. Md Pervez Kabir', role: 'Postdoctoral Fellow', photo: mdPervezKabirPhoto, institution: 'Western University', linkedin: 'https://www.linkedin.com/in/md-pervez-kabir-781837168/' },
      ],
    },
    {
      id: 'phd',
      title: 'PhD Students — Western University',
      members: [
        { name: 'Allison Pert', role: 'PhD Student', photo: allisonPertProfilePhoto, institution: 'Western University', linkedin: 'https://www.linkedin.com/in/allisonpert/' },
        { name: 'Augustine Omodieke', role: 'PhD Student', photo: augustineOmodiekePhoto, institution: 'Western University', researchFocus: 'Environmental epidemiology; air pollution; health economics', linkedin: 'https://www.linkedin.com/in/augustine-omodieke/' },
        { name: 'Francis Acquah', role: 'PhD Student', photo: francisAcquahPhoto, institution: 'Western University', linkedin: 'https://www.linkedin.com/in/francis-n-acquah-a39aa1219/' },
        { name: 'Daniel Twum', role: 'PhD Student', photo: '/img/people/daniel-twum.jpg', institution: 'Western University', linkedin: 'https://www.linkedin.com/in/dr-daniel-twum-mbbs-pt-msc-cic-17025b189/' },
        { name: 'Abdul Rasheed Rasheed', role: 'PhD Student', photo: '/img/people/abdoul-rasheed.jpg', institution: 'Western University', linkedin: 'https://www.linkedin.com/in/abdulrasheed-rasheed/' },
      ],
    },
    {
      id: 'masters',
      title: 'MSc Students — Western University',
      members: [
        { name: 'Zoha Irfan', role: 'MSc Student', institution: 'Western University', researchFocus: 'PAHs; air pollution; exposure science', linkedin: 'https://www.linkedin.com/in/zoha-irfan-296062308/' },
        { name: 'Oluwaseun Bajulaye', role: 'MSc Student', photo: oluwaseunBajulayePhoto, institution: 'Western University', linkedin: 'https://www.linkedin.com/in/oyinbajulaye/' },
        { name: 'Farhana Ramiza', role: 'MSc Student', photo: farhanaRamizaPhoto, institution: 'Western University', linkedin: 'https://www.linkedin.com/in/farhana-rokaiya-ramiza-56b558238/' },
        { name: 'Ignatius Atuguba', role: 'MSc Student', photo: '/img/people/ignatius-atuguba.jpg', institution: 'Western University', linkedin: 'https://www.linkedin.com/in/ignatiusatuguba/' },
      ],
    },
    {
      id: 'global-health-interns',
      title: 'Global Health MSc Interns',
      members: [
        { name: 'Jiaxuan Zhang', role: 'MSc Global Health Intern', photo: '/img/people/jiaxuan-zhang.jpg', institution: 'Western University', linkedin: 'https://www.linkedin.com/in/jxbravo/' },
        { name: 'Arshia Mohammadi-Sanjani', role: 'MSc Global Health Intern', photo: '/img/people/arshia-mohammadi-sanjani.jpg', institution: 'Western University', linkedin: 'https://www.linkedin.com/in/arshiasanjani/' },
        { name: 'Ihsan Khalifa', role: 'MSc Global Health Intern', photo: '/img/people/ihsan-khalifa.jpg', institution: 'Western University', linkedin: 'https://www.linkedin.com/in/ihsankhalifa/' },
        { name: 'Harini Kumaraverl', role: 'MSc Global Health Intern', photo: '/img/people/harini-kumaraverl.jpg', institution: 'Western University', linkedin: 'https://www.linkedin.com/in/harini-kumaraverl-33b4a9372/' },
        { name: 'Yuheng Lu', role: 'MSc Global Health Intern', institution: 'Western University' },
        { name: 'Haiyan Li', role: 'MSc Global Health Intern', photo: '/img/people/haiyan-li.jpg', institution: 'Western University', linkedin: 'https://www.linkedin.com/in/haiyan2657/' },
      ],
    },
    {
      id: 'staff',
      title: 'Research Assistants',
      members: [
        { name: 'Ruiming Han', role: 'Research Assistant, MSc', institution: 'Western University', researchFocus: 'Air pollution; PAHs; metals; exposure analysis', linkedin: 'https://www.linkedin.com/in/ruiming-han-858b7823b/' },
        { name: 'Natasha Fortin', role: 'Research Assistant, MSc', photo: '/img/people/natasha-fortin.jpg', institution: 'Western University', linkedin: 'https://www.linkedin.com/in/natasha-fortin-59751a26b/' },
        { name: 'Sydney Lessard', role: 'Research Assistant, MSc', photo: '/img/people/sydney-lessard.jpg', institution: 'Western University', linkedin: 'https://www.linkedin.com/in/sydneylessard/' },
        { name: 'Jiaqi Bi', role: 'Research Assistant, MSc', photo: '/img/people/jiaqi-bi.jpg', institution: 'Western University', linkedin: 'https://www.linkedin.com/in/jiaqi-bi-10189a126/' },
        { name: 'Shaikh Sumeet Jamil', role: 'Research Assistant', photo: '/img/people/sumeet-jamil.jpg', institution: 'Western University', linkedin: 'https://www.linkedin.com/in/sumeet-jamil-1a28ba233/' },
        { name: 'Sharika Jalali', role: 'Research Assistant', photo: '/img/people/sharika-jalali.jpg', institution: 'Western University', linkedin: 'https://www.linkedin.com/in/sharikajalali/' },
        { name: 'Innocent Twagirayezu', role: 'Research Assistant, PhD', photo: '/img/people/innocent-twagirayezu.jpg', institution: 'Western University', linkedin: 'https://www.linkedin.com/in/innocent-twagirayezu-6277141b7/' },
      ],
    },
    {
      id: 'international-phd',
      title: 'International / Externally Co-supervised PhD Students',
      members: [
        { name: 'Patrick Karakwende', role: 'PhD Student', linkedin: 'https://www.linkedin.com/in/patrick-karakwende-984440144/' },
        { name: 'Adolphe Ndikubwimana', role: 'PhD Student', photo: adolpheNdikubwimanaPhoto, institution: 'University of Rwanda', country: 'Rwanda', linkedin: 'https://www.linkedin.com/in/adolphe-atuhire-140847116/' },
        { name: 'Deborah', role: 'PhD Student', institution: 'University of Ibadan', country: 'Nigeria' },
        { name: 'Nibagwire', role: 'PhD Student', institution: 'University of Ibadan', country: 'Nigeria' },
        { name: 'Franck Kwabe', role: 'PhD Student', institution: 'ISP Bukavu', country: 'DR Congo' },
      ],
    },
    {
      id: 'visiting-international',
      title: 'Visiting International Students',
      members: [
        { name: 'Dioumacor Faye', role: 'PhD Student', photo: dioumacorFayePhoto, institution: 'Visiting International Student', country: 'Senegal' },
        { name: 'Dorothy Namatovu', role: 'MSc Student', photo: dorothyNamatovuPhoto, institution: 'Visiting International Student', country: 'Uganda' },
        { name: 'Ange Lisa Ikirezi', role: 'MSc Student', photo: angeLisaIkireziPhoto, institution: 'Visiting International Student', country: 'Rwanda' },
        { name: 'Marie Ange Tuyime', role: 'Undergraduate Student', institution: 'Visiting International Student', country: 'Rwanda' },
        { name: 'Isabel Ajagu', role: 'MSc Student / Visiting Scholar', photo: '/img/people/isabel-ajagu.jpg', institution: 'Visiting International Student', country: 'Nigeria', linkedin: 'https://www.linkedin.com/in/isabelajagu/' },
      ],
    },
  ],
  former: [
    { name: 'Victoria Bursey', role: 'Undergraduate Researcher', photo: victoriaBurseyPhoto, currentPosition: 'MSc Public Health, University of Toronto', now: 'MSc Public Health, University of Toronto', status: 'Alumni', href: 'https://www.linkedin.com/in/victoria-bursey-1b4871237' },
    { name: 'Emily Airhart', role: 'Undergraduate Researcher', photo: emilyAirhartPhoto, currentPosition: 'MSc Student, University of Toronto', now: 'MSc Student, University of Toronto', status: 'Alumni', href: 'https://www.linkedin.com/in/emily-airhart-443799a5' },
    { name: 'Shagun Chander', role: 'Undergraduate Researcher', photo: '/images/alumni/shagun-chander.jpg', status: 'Alumni', href: 'https://www.linkedin.com/in/shagunchander/' },
    { name: 'Allison Pert', role: 'MSc Student', photo: allisonPertProfilePhoto, now: 'PhD Student at Western University, P3 Health Lab', status: 'Alumni', linkedin: 'https://www.linkedin.com/in/allisonpert/' },
    { name: 'Augustine Omodieke', role: 'MSc Student', photo: augustineOmodiekePhoto, now: 'PhD Student at Western University, P3 Health Lab', status: 'Alumni', linkedin: 'https://www.linkedin.com/in/augustine-omodieke/' },
  ],
  collaborators: [],
};
