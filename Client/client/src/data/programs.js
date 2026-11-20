const make = (code, full, level, faculty, affiliation, subjects, careers, extra = {}) => ({
  code,
  full,
  level,                                   // 'Bachelor' | 'Master'
  faculty,
  affiliation,
  duration:    level === 'Bachelor' ? '4 Years' : '2 Years',
  semesters:   level === 'Bachelor' ? 8 : 4,
  seats:       extra.seats || 40,
  fee:         extra.fee || 'Contact college',
  eligibility: extra.eligibility || (level === 'Bachelor'
    ? 'Passed 10+2 or equivalent from a recognized board (check university rules for your stream)'
    : "Bachelor's degree in a relevant discipline from a recognized university"),
  color:       extra.color || '#1565C0',
  subjects,
  careers,
  syllabus:    extra.syllabus || null,     // paste detailed semester syllabus here if you have it
})

const TU = 'Tribhuvan University (TU)'
const PU = 'Pokhara University (PU)'

export const programs = [
  // ───────── Management (keep your existing syllabus arrays in `syllabus`) ─────────
  make('BBA', 'Bachelor of Business Administration', 'Bachelor', 'Management', PU,
    ['Management', 'Accounting', 'Marketing', 'Finance', 'Economics'],
    ['Business Manager', 'Entrepreneur', 'HR Manager', 'Marketing Executive'], { color: '#1565C0', seats: 60 }),
  make('BBS', 'Bachelor of Business Studies', 'Bachelor', 'Management', TU,
    ['Business Statistics', 'Financial Accounting', 'Business Law', 'Management'],
    ['Accountant', 'Finance Officer', 'Bank Officer', 'Tax Consultant'], { color: '#E65100', seats: 80 }),
  make('MBA', 'Master of Business Administration', 'Master', 'Management', PU,
    ['Strategic Management', 'Corporate Finance', 'Leadership', 'Research Methods'],
    ['Business Consultant', 'Operations Manager', 'Finance Director'], { color: '#C62828' }),
  make('MBS', 'Master of Business Studies', 'Master', 'Management', TU,
    ['Advanced Accounting', 'Business Research', 'Tax Management', 'Audit'],
    ['Tax Consultant', 'Auditor', 'Financial Analyst'], { color: '#00695C' }),

  // ───────── Computer / IT ─────────
  make('BCA', 'Bachelor of Computer Applications', 'Bachelor', 'Computer & IT', TU,
    ['Programming', 'Data Structures', 'Web Technology', 'Database Systems', 'Networks'],
    ['Software Developer', 'Web Developer', 'System Analyst', 'IT Manager'], { color: '#2E7D32', seats: 60 }),
  make('BSc CSIT', 'Bachelor of Science in Computer Science and Information Technology', 'Bachelor', 'Computer & IT', TU,
    ['Programming & Algorithms', 'Data Structures', 'Computer Architecture', 'Databases', 'Operating Systems', 'Artificial Intelligence', 'Networks'],
    ['Software Engineer', 'Data Analyst', 'Network Engineer', 'Researcher'],
    { color: '#1B5E20', seats: 48, eligibility: 'Passed 10+2 Science (with Mathematics) or equivalent' }),
  make('BIT', 'Bachelor in Information Technology', 'Bachelor', 'Computer & IT', PU,
    ['Programming', 'Web & Mobile Development', 'Databases', 'Networking', 'Software Engineering'],
    ['IT Officer', 'Developer', 'System Administrator', 'Tester'], { color: '#00838F' }),
  make('BCIS', 'Bachelor of Computer Information Systems', 'Bachelor', 'Computer & IT', PU,
    ['Information Systems', 'Database Management', 'Business Intelligence', 'E-Commerce'],
    ['IT Consultant', 'Database Admin', 'Project Manager'], { color: '#6A1B9A' }),
  make('MCA', 'Master of Computer Applications', 'Master', 'Computer & IT', TU,
    ['Advanced Algorithms', 'Software Engineering', 'Cloud Computing', 'Data Mining', 'Research Methodology'],
    ['Senior Developer', 'Solution Architect', 'IT Manager', 'Lecturer']),
  make('MIT', 'Master in Information Technology', 'Master', 'Computer & IT', PU,
    ['Advanced Databases', 'Information Security', 'Distributed Systems', 'IT Project Management', 'Research Methods'],
    ['IT Manager', 'Security Analyst', 'Consultant', 'Lecturer'], { color: '#00695C' }),

  // ───────── Science ─────────
  make('BSc Physics', 'Bachelor of Science in Physics', 'Bachelor', 'Science', TU,
    ['Mechanics', 'Electricity & Magnetism', 'Quantum Physics', 'Thermodynamics', 'Electronics', 'Mathematical Physics'],
    ['Researcher', 'Lecturer', 'Lab Scientist', 'Technician'], { color: '#3949AB', eligibility: 'Passed 10+2 Science (Physics & Mathematics) or equivalent' }),
  make('BSc Chemistry', 'Bachelor of Science in Chemistry', 'Bachelor', 'Science', TU,
    ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Analytical Chemistry', 'Lab Practicals'],
    ['Chemist', 'Quality Control Officer', 'Researcher', 'Lecturer'], { color: '#D81B60', eligibility: 'Passed 10+2 Science (Chemistry) or equivalent' }),
  make('BSc Mathematics', 'Bachelor of Science in Mathematics', 'Bachelor', 'Science', TU,
    ['Calculus', 'Linear Algebra', 'Differential Equations', 'Real Analysis', 'Numerical Methods'],
    ['Data Analyst', 'Actuary Trainee', 'Lecturer', 'Researcher'], { color: '#5E35B1', eligibility: 'Passed 10+2 Science (Mathematics) or equivalent' }),
  make('BSc Statistics', 'Bachelor of Science in Statistics', 'Bachelor', 'Science', TU,
    ['Probability', 'Statistical Inference', 'Regression', 'Sampling Methods', 'Statistical Computing'],
    ['Statistician', 'Data Analyst', 'Survey Officer', 'Researcher'], { color: '#039BE5' }),
  make('BSc Environment', 'Bachelor of Science in Environmental Science', 'Bachelor', 'Science', TU,
    ['Ecology', 'Environmental Chemistry', 'Climate Change', 'Waste Management', 'Environmental Impact Assessment'],
    ['Environmental Officer', 'EIA Consultant', 'Conservation Officer', 'Researcher'], { color: '#43A047' }),
  make('BSc Biology', 'Bachelor of Science in Biology', 'Bachelor', 'Science', TU,
    ['Botany', 'Zoology', 'Genetics', 'Microbiology', 'Ecology'],
    ['Biologist', 'Lab Technician', 'Researcher', 'Lecturer'], { color: '#7CB342', eligibility: 'Passed 10+2 Science (Biology) or equivalent' }),
  make('MSc Physics', 'Master of Science in Physics', 'Master', 'Science', TU,
    ['Classical & Quantum Mechanics', 'Solid State Physics', 'Nuclear Physics', 'Research Methodology'],
    ['Researcher', 'Lecturer', 'Scientist'], { color: '#3949AB' }),
  make('MSc Environmental Science', 'Master of Science in Environmental Science', 'Master', 'Science', TU,
    ['Environmental Management', 'Pollution Control', 'Climate Science', 'Natural Resource Management', 'Research Methods'],
    ['Environmental Consultant', 'Policy Analyst', 'Researcher', 'NGO Program Officer'], { color: '#43A047' }),

  // ───────── Humanities & Social Sciences ─────────
  make('BA', 'Bachelor of Arts', 'Bachelor', 'Humanities & Social Sciences', TU,
    ['Languages', 'Sociology', 'Economics', 'Political Science', 'History', 'Population Studies'],
    ['Teacher', 'Civil Service Aspirant', 'Journalist', 'NGO Officer'], { color: '#8D6E63', seats: 80 }),
  make('BA Social Sciences', 'Bachelor of Arts in Social Sciences', 'Bachelor', 'Humanities & Social Sciences', TU,
    ['Sociology', 'Anthropology', 'Social Research', 'Development Studies', 'Gender Studies'],
    ['Social Worker', 'Development Officer', 'Researcher', 'NGO Officer'], { color: '#AD1457' }),
  make('MA Economics', 'Master of Arts in Economics', 'Master', 'Humanities & Social Sciences', TU,
    ['Microeconomics', 'Macroeconomics', 'Econometrics', 'Development Economics', 'Research Methods'],
    ['Economist', 'Bank Officer', 'Policy Analyst', 'Lecturer'], { color: '#EF6C00' }),
  make('MA Sociology', 'Master of Arts in Sociology', 'Master', 'Humanities & Social Sciences', TU,
    ['Sociological Theory', 'Social Research Methods', 'Social Change', 'Gender & Society'],
    ['Researcher', 'Social Development Officer', 'Lecturer'], { color: '#AD1457' }),
  make('MA English', 'Master of Arts in English', 'Master', 'Humanities & Social Sciences', TU,
    ['British & American Literature', 'Literary Theory', 'Linguistics', 'Research Writing'],
    ['Lecturer', 'Writer', 'Editor', 'Translator'], { color: '#6D4C41' }),
  make('MA Nepali', 'Master of Arts in Nepali', 'Master', 'Humanities & Social Sciences', TU,
    ['Nepali Literature', 'Nepali Linguistics', 'Literary Criticism', 'Research Methodology'],
    ['Lecturer', 'Writer', 'Editor', 'Media Professional'], { color: '#C62828' }),
  make('MA Population Studies', 'Master of Arts in Population Studies', 'Master', 'Humanities & Social Sciences', TU,
    ['Demography', 'Population Policy', 'Migration Studies', 'Reproductive Health', 'Statistical Methods'],
    ['Demographer', 'Program Officer', 'Researcher', 'Census/Survey Officer'], { color: '#00897B' }),
  make('MA Rural Development', 'Master of Arts in Rural Development', 'Master', 'Humanities & Social Sciences', TU,
    ['Rural Development Theory', 'Project Planning', 'Local Governance', 'Community Development'],
    ['Development Officer', 'NGO/INGO Manager', 'Local Government Officer'], { color: '#558B2F' }),
  make('MA Anthropology', 'Master of Arts in Anthropology', 'Master', 'Humanities & Social Sciences', TU,
    ['Anthropological Theory', 'Ethnography', 'Cultural Studies', 'Research Methods'],
    ['Researcher', 'Cultural Heritage Officer', 'Lecturer'], { color: '#6A1B9A' }),
]

export const levels   = ['All', 'Bachelor', 'Master']
export const faculties = ['All', ...new Set(programs.map((p) => p.faculty))]

// Used by Admission form, Admin forms, Register etc.
export const PROGRAM_CODES = programs.map((p) => p.code)