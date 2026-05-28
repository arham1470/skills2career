require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const CompanyProfile = require("../models/CompanyProfile");
const SeekerProfile = require("../models/SeekerProfile");
const Internship = require("../models/Internship");
const Application = require("../models/Application");
const Institution = require("../models/Institution");
const Course = require("../models/Course");

// ============ INTERNSHIP SEED DATA ============
const employers = [
  {
    email: "employer1@test.com",
    password: "Test@123",
    company: {
      companyName: "TechNova Solutions",
      industry: "Information Technology",
      description: "A leading IT solutions provider specializing in web and mobile applications.",
      website: "https://technova.test",
      contactEmail: "hr@technova.test",
      contactPhone: "0112345678",
      location: "Colombo",
    },
    internships: [
      {
        title: "Frontend Developer Intern",
        category: "Software Development",
        location: "Colombo",
        mode: "Hybrid",
        salaryMin: 30000,
        salaryMax: 50000,
        coreSkills: ["React", "JavaScript", "HTML", "CSS"],
        additionalSkills: ["TypeScript", "Tailwind CSS"],
        description: "Work on modern web UIs using React and Tailwind CSS.",
        responsibilities: "Build and maintain frontend components, collaborate with designers.",
        status: "Active",
      },
      {
        title: "Backend Developer Intern",
        category: "Software Development",
        location: "Colombo",
        mode: "On-site",
        salaryMin: 35000,
        salaryMax: 55000,
        coreSkills: ["Node.js", "Express", "MongoDB"],
        additionalSkills: ["REST API", "Docker"],
        description: "Develop and maintain server-side applications using Node.js.",
        responsibilities: "Build APIs, manage databases, write unit tests.",
        status: "Active",
      },
      {
        title: "UI/UX Design Intern",
        category: "Design",
        location: "Colombo",
        mode: "Remote",
        salaryMin: 25000,
        salaryMax: 40000,
        coreSkills: ["Figma", "Adobe XD", "UI Design"],
        additionalSkills: ["Prototyping", "User Research"],
        description: "Design intuitive interfaces for web and mobile products.",
        responsibilities: "Create wireframes, prototypes, and design systems.",
        status: "Active",
      },
      {
        title: "QA Engineering Intern",
        category: "Quality Assurance",
        location: "Colombo",
        mode: "On-site",
        salaryMin: 28000,
        salaryMax: 42000,
        coreSkills: ["Manual Testing", "Selenium", "Test Cases"],
        additionalSkills: ["JIRA", "Agile"],
        description: "Ensure product quality through manual and automated testing.",
        responsibilities: "Write test cases, perform regression testing, report bugs.",
        status: "Active",
      },
    ],
  },
  {
    email: "employer2@test.com",
    password: "Test@123",
    company: {
      companyName: "GreenLeaf Marketing",
      industry: "Digital Marketing",
      description: "Creative digital marketing agency helping brands grow online.",
      website: "https://greenleaf.test",
      contactEmail: "careers@greenleaf.test",
      contactPhone: "0119876543",
      location: "Kandy",
    },
    internships: [
      {
        title: "Digital Marketing Intern",
        category: "Marketing",
        location: "Kandy",
        mode: "Hybrid",
        salaryMin: 20000,
        salaryMax: 35000,
        coreSkills: ["SEO", "Social Media Marketing", "Google Analytics"],
        additionalSkills: ["Content Writing", "Canva"],
        description: "Plan and execute digital marketing campaigns across platforms.",
        responsibilities: "Manage social media, run ads, analyze campaign metrics.",
        status: "Active",
      },
      {
        title: "Content Writer Intern",
        category: "Marketing",
        location: "Kandy",
        mode: "Remote",
        salaryMin: 18000,
        salaryMax: 30000,
        coreSkills: ["Content Writing", "Copywriting", "SEO Writing"],
        additionalSkills: ["WordPress", "Grammarly"],
        description: "Create engaging blog posts, articles, and social media content.",
        responsibilities: "Write SEO-optimized content, proofread, maintain content calendar.",
        status: "Active",
      },
      {
        title: "Graphic Design Intern",
        category: "Design",
        location: "Kandy",
        mode: "On-site",
        salaryMin: 22000,
        salaryMax: 38000,
        coreSkills: ["Adobe Photoshop", "Illustrator", "Canva"],
        additionalSkills: ["Video Editing", "Branding"],
        description: "Design visuals for social media, ads, and branding materials.",
        responsibilities: "Create graphics, maintain brand consistency, support campaigns.",
        status: "Active",
      },
      {
        title: "Data Analyst Intern",
        category: "Data Science",
        location: "Kandy",
        mode: "Remote",
        salaryMin: 30000,
        salaryMax: 50000,
        coreSkills: ["Python", "SQL", "Excel"],
        additionalSkills: ["Power BI", "Tableau"],
        description: "Analyze marketing data to derive actionable business insights.",
        responsibilities: "Build dashboards, run queries, prepare reports.",
        status: "Active",
      },
    ],
  },
  {
    email: "employer3@test.com",
    password: "Test@123",
    company: {
      companyName: "BuildRight Engineering",
      industry: "Engineering & Construction",
      description: "A civil engineering firm focused on sustainable infrastructure projects.",
      website: "https://buildright.test",
      contactEmail: "jobs@buildright.test",
      contactPhone: "0117654321",
      location: "Galle",
    },
    internships: [
      {
        title: "Civil Engineering Intern",
        category: "Engineering",
        location: "Galle",
        mode: "On-site",
        salaryMin: 25000,
        salaryMax: 40000,
        coreSkills: ["AutoCAD", "Structural Analysis", "Site Management"],
        additionalSkills: ["Revit", "MS Project"],
        description: "Assist in designing and supervising construction projects.",
        responsibilities: "Draft plans, conduct site visits, assist project managers.",
        status: "Active",
      },
      {
        title: "Project Coordinator Intern",
        category: "Management",
        location: "Galle",
        mode: "Hybrid",
        salaryMin: 22000,
        salaryMax: 38000,
        coreSkills: ["Project Management", "MS Office", "Communication"],
        additionalSkills: ["Trello", "Time Management"],
        description: "Support project coordination and scheduling activities.",
        responsibilities: "Track timelines, coordinate teams, prepare status reports.",
        status: "Active",
      },
      {
        title: "Environmental Analyst Intern",
        category: "Engineering",
        location: "Galle",
        mode: "On-site",
        salaryMin: 24000,
        salaryMax: 40000,
        coreSkills: ["Environmental Science", "GIS", "Data Collection"],
        additionalSkills: ["Report Writing", "Field Research"],
        description: "Conduct environmental impact assessments for construction projects.",
        responsibilities: "Collect field data, analyze environmental factors, write reports.",
        status: "Active",
      },
      {
        title: "Full Stack Developer Intern",
        category: "Software Development",
        location: "Galle",
        mode: "Remote",
        salaryMin: 35000,
        salaryMax: 55000,
        coreSkills: ["React", "Node.js", "MongoDB", "Express"],
        additionalSkills: ["Git", "REST API"],
        description: "Build internal tools and dashboards for project tracking.",
        responsibilities: "Develop full-stack features, fix bugs, write documentation.",
        status: "Active",
      },
    ],
  },
];

const seekers = [
  {
    email: "seeker1@test.com",
    password: "Test@123",
    profile: {
      fullName: "Amal Perera",
      phone: "0771234567",
      address: "45 Galle Road, Colombo 03",
      profileTitle: "Aspiring Software Developer",
      summary: "A motivated computer science undergraduate with hands-on experience in React, Node.js and Python. Passionate about building web applications.",
      availability: "Immediate",
      skills: ["JavaScript", "React", "Node.js", "Python", "MongoDB", "HTML", "CSS"],
      coreSkills: ["React", "Node.js", "JavaScript"],
      additionalSkills: ["TypeScript", "Git", "Docker", "REST API"],
      languages: [
        { language: "English", level: "Fluent" },
        { language: "Sinhala", level: "Native" },
      ],
      education: [
        {
          institution: "University of Colombo",
          qualificationLevel: "BSc Computer Science",
          description: "Specializing in Software Engineering",
          startDate: "2022-10",
          endDate: "2026-06",
          current: true,
        },
      ],
      experience: [
        {
          company: "Freelance",
          role: "Web Developer",
          description: "Built portfolio websites and small business sites using React.",
          startDate: "2024-01",
          endDate: "2024-12",
          current: false,
        },
      ],
      preferences: {
        categories: ["Software Development", "Data Science"],
        workingMode: ["Remote", "Hybrid"],
        expectedSalary: "40000",
        preferredLocations: ["Colombo", "Remote"],
      },
    },
    applyTo: [0, 1, 7, 11],
  },
  {
    email: "seeker2@test.com",
    password: "Test@123",
    profile: {
      fullName: "Kavindi Silva",
      phone: "0789876543",
      address: "12 Temple Street, Kandy",
      profileTitle: "Creative Designer & Marketing Enthusiast",
      summary: "Design-focused graduate skilled in UI/UX, graphic design and digital marketing. Eager to contribute creative solutions.",
      availability: "1 Week",
      skills: ["Figma", "Adobe Photoshop", "Illustrator", "Canva", "SEO", "Social Media Marketing"],
      coreSkills: ["Figma", "Adobe Photoshop", "UI Design"],
      additionalSkills: ["Canva", "Content Writing", "Video Editing"],
      languages: [
        { language: "English", level: "Fluent" },
        { language: "Sinhala", level: "Native" },
        { language: "Tamil", level: "Basic" },
      ],
      education: [
        {
          institution: "University of Peradeniya",
          qualificationLevel: "BA in Design",
          description: "Specializing in Visual Communication",
          startDate: "2021-09",
          endDate: "2025-06",
          current: false,
        },
      ],
      experience: [
        {
          company: "Creative Hub Agency",
          role: "Graphic Design Trainee",
          description: "Created social media graphics and marketing materials.",
          startDate: "2024-06",
          endDate: "2024-12",
          current: false,
        },
      ],
      preferences: {
        categories: ["Design", "Marketing"],
        workingMode: ["On-site", "Hybrid"],
        expectedSalary: "30000",
        preferredLocations: ["Kandy", "Colombo"],
      },
    },
    applyTo: [2, 4, 5, 6],
  },
];

// ============ CAREER PATHWAY SEED DATA ============
const careerPathwayInstitutions = [
  {
    name: "BCAS Campus",
    location: "Kandy, Sri Lanka",
    type: "college",
    website: "https://bcas.lk",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
  },
  {
    name: "ESOFT Metro Campus",
    location: "Colombo, Sri Lanka",
    type: "institute",
    website: "https://esoft.lk",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
  },
  {
    name: "ICBT Campus",
    location: "Colombo, Sri Lanka",
    type: "college",
    website: "https://icbt.lk",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf03?w=800&q=80",
  },
  {
    name: "SLIIT",
    location: "Malabe, Sri Lanka",
    type: "university",
    website: "https://sliit.lk",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
  },
  {
    name: "NSBM Green University",
    location: "Homagama, Sri Lanka",
    type: "university",
    website: "https://nsbm.ac.lk",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
  },
  {
    name: "University of Colombo",
    location: "Colombo, Sri Lanka",
    type: "university",
    website: "https://cmb.ac.lk",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80",
  },
  {
    name: "IIT - Informatics Institute of Technology",
    location: "Colombo, Sri Lanka",
    type: "institute",
    website: "https://iit.ac.lk",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
  },
  {
    name: "APIIT Sri Lanka",
    location: "Colombo, Sri Lanka",
    type: "institute",
    website: "https://apiit.lk",
    image: "https://images.unsplash.com/photo-1592280771886-63e4ab5e5797?w=800&q=80",
  },
  {
    name: "General Sir John Kotelawala Defence University",
    location: "Ratmalana, Sri Lanka",
    type: "university",
    website: "https://kdu.ac.lk",
    image: "https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=800&q=80",
  },
  {
    name: "Royal Institute Colombo",
    location: "Colombo, Sri Lanka",
    type: "institute",
    website: "https://royalinstitute.org",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
  },
  {
    name: "NIBM - National Institute of Business Management",
    location: "Colombo, Sri Lanka",
    type: "institute",
    website: "https://nibm.lk",
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80",
  },
  {
    name: "Ocean University of Sri Lanka",
    location: "Matara, Sri Lanka",
    type: "university",
    website: "https://oceanuni.lk",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
  },
];

async function seedCareerPathway() {
  console.log("--- Seeding Career Pathway Data ---\n");

  await Institution.deleteMany({});
  await Course.deleteMany({});
  console.log("Cleared existing Career Pathway data.");

  const institutions = await Institution.insertMany(careerPathwayInstitutions);
  console.log(`Inserted ${institutions.length} institutions.`);

  const courses = [
    // BCAS Campus (0)
    { institution: institutions[0]._id, name: "HND in Computing", educationLevel: "HND", description: "Higher National Diploma in Computing with software development, database design and networking focus.", duration: "2 years", requirements: { alStream: "Any", alPasses: 2, otherRequirements: "Pass in Mathematics at O/L" } },
    { institution: institutions[0]._id, name: "Diploma in Business Management", educationLevel: "O/L", description: "Foundation diploma covering business strategy, marketing and management principles.", duration: "1 year", requirements: { olPasses: 6, olMandatorySubjects: ["Mathematics", "English"], otherRequirements: "" } },
    { institution: institutions[0]._id, name: "BSc (Hons) Business Management", educationLevel: "Bachelor", entryType: "Top-Up", acceptedFields: ["Business / Management", "Any"], acceptedQualificationTypes: ["HND", "Diploma"], acceptedQualificationNames: ["Pearson HND", "SLIATE HND", "NIBM Diploma", "BCAS Diploma"], description: "UK degree in business management with 1 year top-up after HND completion.", duration: "1 year (top-up)", requirements: { gpa: 2.5, requiredField: "Business / Management", otherRequirements: "Completion of HND or equivalent diploma" } },
    { institution: institutions[0]._id, name: "Foundation in IT", educationLevel: "O/L", description: "Pre-HND foundation course for O/L qualified students to enter computing programmes.", duration: "6 months", requirements: { olPasses: 5, olMandatorySubjects: ["Mathematics"], otherRequirements: "" } },

    // ESOFT Metro Campus (1)
    { institution: institutions[1]._id, name: "Level 3 Diploma in Information Technology", educationLevel: "O/L", description: "Entry-level IT diploma covering programming fundamentals, databases and web design.", duration: "1 year", requirements: { olPasses: 6, olMandatorySubjects: ["Mathematics", "English"], otherRequirements: "" } },
    { institution: institutions[1]._id, name: "HND in Software Engineering", educationLevel: "HND", description: "Software engineering diploma with practical project work in Java, Python and cloud deployment.", duration: "2 years", requirements: { alStream: "Any", alPasses: 2, otherRequirements: "O/L Math pass required" } },
    { institution: institutions[1]._id, name: "Diploma in English", educationLevel: "O/L", description: "Professional English diploma for career advancement and workplace communication.", duration: "6 months", requirements: { olPasses: 6, otherRequirements: "" } },
    { institution: institutions[1]._id, name: "BSc (Hons) Computer Science", educationLevel: "Bachelor", entryType: "Normal Entry", acceptedFields: ["IT / Computing", "Engineering", "Any"], acceptedQualificationTypes: [], acceptedQualificationNames: [], description: "UK honours degree in computer science with AI and machine learning modules.", duration: "3 years", requirements: { gpa: 3.0, requiredField: "IT / Computing", otherRequirements: "A/L with 3 passes or foundation completion" } },

    // ICBT Campus (2)
    { institution: institutions[2]._id, name: "HND in Business Management", educationLevel: "HND", description: "Pearson HND in business with marketing, HR, finance and entrepreneurship modules.", duration: "2 years", requirements: { alStream: "Any", alPasses: 2, otherRequirements: "" } },
    { institution: institutions[2]._id, name: "Diploma in Network Engineering", educationLevel: "O/L", description: "Cisco and CompTIA aligned networking diploma with hands-on lab sessions.", duration: "1 year", requirements: { olPasses: 6, olMandatorySubjects: ["Mathematics", "Science"], otherRequirements: "" } },
    { institution: institutions[2]._id, name: "BSc (Hons) Information Technology", educationLevel: "Bachelor", entryType: "Top-Up", acceptedFields: ["IT / Computing", "Software Engineering", "Any"], acceptedQualificationTypes: ["HND", "Diploma"], acceptedQualificationNames: ["Pearson HND", "SLIATE HND", "NIBM Diploma", "ESOFT Diploma"], description: "UK degree top-up programme after HND completion in IT or Computing.", duration: "1 year", requirements: { gpa: 2.5, requiredField: "IT / Computing", otherRequirements: "HND in IT or Computing" } },
    { institution: institutions[2]._id, name: "Foundation Certificate", educationLevel: "O/L", description: "Pre-university foundation for O/L qualified students to enter degree pathways.", duration: "8 months", requirements: { olPasses: 5, otherRequirements: "" } },

    // SLIIT (3)
    { institution: institutions[3]._id, name: "BSc (Hons) in Information Technology", educationLevel: "Bachelor", entryType: "Normal Entry", acceptedFields: ["IT / Computing", "Software Engineering", "Any"], acceptedQualificationTypes: [], acceptedQualificationNames: [], description: "UGC-approved degree in IT with software engineering and cloud computing specialization.", duration: "4 years", requirements: { gpa: 2.0, requiredField: "IT / Computing", otherRequirements: "3 passes in A/L (any stream) or foundation" } },
    { institution: institutions[3]._id, name: "BSc (Hons) in Computer Systems & Network Engineering", educationLevel: "Bachelor", entryType: "Normal Entry", acceptedFields: ["Engineering", "IT / Computing", "Any"], acceptedQualificationTypes: [], acceptedQualificationNames: [], description: "Networking and systems engineering degree with Cisco and AWS certifications.", duration: "4 years", requirements: { gpa: 2.0, requiredField: "Engineering", otherRequirements: "3 passes in A/L (any stream) or foundation" } },
    { institution: institutions[3]._id, name: "Foundation in Information Technology", educationLevel: "O/L", description: "SLIIT foundation for O/L qualified students to enter degree programmes in IT.", duration: "1 year", requirements: { olPasses: 6, olMandatorySubjects: ["Mathematics", "English", "Science"], otherRequirements: "" } },
    { institution: institutions[3]._id, name: "MSc in Information Technology", educationLevel: "Bachelor", entryType: "Normal Entry", acceptedFields: ["IT / Computing", "Software Engineering", "Any"], acceptedQualificationTypes: ["Bachelor"], acceptedQualificationNames: [], description: "Postgraduate degree for IT professionals with research and industry projects.", duration: "2 years", requirements: { gpa: 3.0, requiredField: "IT / Computing", otherRequirements: "Bachelor's degree in IT/Computing related field" } },

    // NSBM Green University (4)
    { institution: institutions[4]._id, name: "BSc (Hons) Computer Science", educationLevel: "Bachelor", entryType: "Normal Entry", acceptedFields: ["IT / Computing", "Software Engineering", "Any"], acceptedQualificationTypes: [], acceptedQualificationNames: [], description: "Computer science degree with AI, data science and cybersecurity electives.", duration: "4 years", requirements: { gpa: 2.0, requiredField: "IT / Computing", otherRequirements: "3 passes in A/L (any stream)" } },
    { institution: institutions[4]._id, name: "BSc (Hons) Software Engineering", educationLevel: "Bachelor", entryType: "Normal Entry", acceptedFields: ["IT / Computing", "Software Engineering", "Any"], acceptedQualificationTypes: [], acceptedQualificationNames: [], description: "Software engineering degree with one-year industry placement and agile training.", duration: "4 years", requirements: { gpa: 2.0, requiredField: "IT / Computing", otherRequirements: "3 passes in A/L (any stream)" } },
    { institution: institutions[4]._id, name: "Diploma in Management and IT", educationLevel: "O/L", description: "Dual-focus diploma covering business management and information technology fundamentals.", duration: "1 year", requirements: { olPasses: 6, olMandatorySubjects: ["Mathematics", "English"], otherRequirements: "" } },
    { institution: institutions[4]._id, name: "Foundation in Science and Technology", educationLevel: "O/L", description: "Foundation programme for technology and science degree pathways.", duration: "1 year", requirements: { olPasses: 5, olMandatorySubjects: ["Mathematics", "Science"], otherRequirements: "" } },

    // University of Colombo (5)
    { institution: institutions[5]._id, name: "BSc in Information Systems", educationLevel: "Bachelor", entryType: "Normal Entry", acceptedFields: ["IT / Computing", "Science", "Any"], acceptedQualificationTypes: [], acceptedQualificationNames: [], description: "Public university degree in information systems with business process and ERP modules.", duration: "3 years", requirements: { gpa: 2.5, requiredField: "IT / Computing", otherRequirements: "Good A/L results + UGC selection" } },
    { institution: institutions[5]._id, name: "BSc in Physical Science", educationLevel: "Bachelor", entryType: "Normal Entry", acceptedFields: ["Science", "Any"], acceptedQualificationTypes: [], acceptedQualificationNames: [], description: "Physical science degree with IT and computational physics specialization options.", duration: "3 years", requirements: { gpa: 2.5, requiredField: "Science", otherRequirements: "A/L Science stream with good results" } },
    { institution: institutions[5]._id, name: "Diploma in Library and Information Science", educationLevel: "A/L", description: "Diploma for A/L qualified students in library science and information management.", duration: "1 year", requirements: { alStream: "Any", alPasses: 3, otherRequirements: "" } },
    { institution: institutions[5]._id, name: "Certificate in Computer Science", educationLevel: "O/L", description: "Certificate programme introducing programming, algorithms and computer fundamentals.", duration: "6 months", requirements: { olPasses: 6, olMandatorySubjects: ["Mathematics"], otherRequirements: "" } },

    // IIT (6)
    { institution: institutions[6]._id, name: "BEng (Hons) Software Engineering", educationLevel: "Bachelor", entryType: "Normal Entry", acceptedFields: ["Engineering", "IT / Computing", "Any"], acceptedQualificationTypes: [], acceptedQualificationNames: [], description: "British Computer Society accredited software engineering degree with DevOps focus.", duration: "4 years", requirements: { gpa: 2.5, requiredField: "Engineering", otherRequirements: "3 passes in A/L (any stream) + IIT aptitude test" } },
    { institution: institutions[6]._id, name: "BSc (Hons) Computer Science", educationLevel: "Bachelor", entryType: "Normal Entry", acceptedFields: ["IT / Computing", "Software Engineering", "Any"], acceptedQualificationTypes: [], acceptedQualificationNames: [], description: "Computer science degree with cybersecurity, ethical hacking and blockchain modules.", duration: "4 years", requirements: { gpa: 2.5, requiredField: "IT / Computing", otherRequirements: "3 passes in A/L (any stream)" } },
    { institution: institutions[6]._id, name: "Foundation Certificate in Higher Education", educationLevel: "O/L", description: "Foundation for O/L students to enter IIT degree programmes in IT and Engineering.", duration: "1 year", requirements: { olPasses: 6, olMandatorySubjects: ["Mathematics", "English"], otherRequirements: "" } },
    { institution: institutions[6]._id, name: "HND in Computing", educationLevel: "HND", description: "Pearson HND in computing with software development and systems analysis modules.", duration: "2 years", requirements: { alStream: "Any", alPasses: 2, otherRequirements: "" } },

    // APIIT Sri Lanka (7)
    { institution: institutions[7]._id, name: "BSc (Hons) Computer Science", educationLevel: "Bachelor", entryType: "Normal Entry", acceptedFields: ["IT / Computing", "Software Engineering", "Any"], acceptedQualificationTypes: [], acceptedQualificationNames: [], description: "Staffordshire University UK degree in computer science with game development option.", duration: "3 years", requirements: { gpa: 2.5, requiredField: "IT / Computing", otherRequirements: "3 passes in A/L (any stream) or APIIT foundation" } },
    { institution: institutions[7]._id, name: "BSc (Hons) Software Engineering", educationLevel: "Bachelor", entryType: "Normal Entry", acceptedFields: ["IT / Computing", "Software Engineering", "Any"], acceptedQualificationTypes: [], acceptedQualificationNames: [], description: "Software engineering degree with mobile app development and cloud architecture focus.", duration: "3 years", requirements: { gpa: 2.5, requiredField: "IT / Computing", otherRequirements: "3 passes in A/L (any stream) or APIIT foundation" } },
    { institution: institutions[7]._id, name: "Foundation in IT", educationLevel: "O/L", description: "Foundation programme for O/L students to enter APIIT degree pathways.", duration: "1 year", requirements: { olPasses: 6, olMandatorySubjects: ["Mathematics", "English"], otherRequirements: "" } },
    { institution: institutions[7]._id, name: "Diploma in Business Administration", educationLevel: "O/L", description: "Business diploma for O/L qualified students covering HR, finance and marketing.", duration: "1 year", requirements: { olPasses: 6, olMandatorySubjects: ["Mathematics", "English"], otherRequirements: "" } },

    // KDU (8)
    { institution: institutions[8]._id, name: "BSc in Defence and Strategic Studies", educationLevel: "Bachelor", entryType: "Normal Entry", acceptedFields: ["Any"], acceptedQualificationTypes: [], acceptedQualificationNames: [], description: "Defence university degree with IT, cybersecurity and strategic communication components.", duration: "3 years", requirements: { gpa: 2.0, requiredField: "Any", otherRequirements: "3 passes in A/L + defence clearance" } },
    { institution: institutions[8]._id, name: "BSc in Management and Information Technology", educationLevel: "Bachelor", entryType: "Normal Entry", acceptedFields: ["Business / Management", "IT / Computing", "Any"], acceptedQualificationTypes: [], acceptedQualificationNames: [], description: "Management and IT combined degree programme with ERP and data analytics.", duration: "4 years", requirements: { gpa: 2.0, requiredField: "Any", otherRequirements: "3 passes in A/L (any stream)" } },
    { institution: institutions[8]._id, name: "Diploma in Logistics Management", educationLevel: "A/L", description: "Logistics diploma for A/L qualified students covering supply chain and operations.", duration: "1 year", requirements: { alStream: "Any", alPasses: 2, otherRequirements: "" } },
    { institution: institutions[8]._id, name: "Certificate in IT Fundamentals", educationLevel: "O/L", description: "IT certificate for O/L qualified students introducing hardware, software and networks.", duration: "6 months", requirements: { olPasses: 5, otherRequirements: "" } },

    // Royal Institute Colombo (9)
    { institution: institutions[9]._id, name: "Diploma in Accounting and Finance", educationLevel: "O/L", description: "Accounting diploma for O/L qualified students with QuickBooks and Excel training.", duration: "1 year", requirements: { olPasses: 6, olMandatorySubjects: ["Mathematics", "Commerce"], otherRequirements: "" } },
    { institution: institutions[9]._id, name: "HND in Business", educationLevel: "HND", description: "Business HND for A/L qualified students with HR, marketing and finance streams.", duration: "2 years", requirements: { alStream: "Commerce", alPasses: 2, otherRequirements: "" } },
    { institution: institutions[9]._id, name: "BSc in Business Management", educationLevel: "Bachelor", entryType: "Direct Entry", acceptedFields: ["Business / Management", "Any"], acceptedQualificationTypes: ["HND", "Diploma", "A/L"], acceptedQualificationNames: ["Pearson HND", "SLIATE HND"], description: "Business management degree programme with entrepreneurship and digital marketing.", duration: "3 years", requirements: { gpa: 2.0, requiredField: "Business / Management", otherRequirements: "A/L 3 passes or HND completion" } },
    { institution: institutions[9]._id, name: "Foundation in Business", educationLevel: "O/L", description: "Foundation programme for business degree entry covering economics and business maths.", duration: "1 year", requirements: { olPasses: 6, olMandatorySubjects: ["Mathematics", "English"], otherRequirements: "" } },

    // NIBM (10)
    { institution: institutions[10]._id, name: "HND in Information Technology", educationLevel: "HND", description: "NIBM HND in IT with software development, database administration and web technologies.", duration: "2 years", requirements: { alStream: "Any", alPasses: 2, otherRequirements: "" } },
    { institution: institutions[10]._id, name: "Diploma in Human Resource Management", educationLevel: "O/L", description: "HR diploma covering recruitment, training, labour law and organizational behaviour.", duration: "1 year", requirements: { olPasses: 6, olMandatorySubjects: ["Mathematics", "English"], otherRequirements: "" } },
    { institution: institutions[10]._id, name: "BSc (Hons) Business Management", educationLevel: "Bachelor", entryType: "Top-Up", acceptedFields: ["Business / Management", "Any"], acceptedQualificationTypes: ["HND", "Diploma"], acceptedQualificationNames: ["NIBM HND", "SLIATE HND", "Pearson HND"], description: "Top-up degree after HND or Diploma in business-related fields.", duration: "1 year (top-up)", requirements: { gpa: 2.5, requiredField: "Business / Management", otherRequirements: "HND in Business or equivalent" } },
    { institution: institutions[10]._id, name: "Certificate in Digital Marketing", educationLevel: "O/L", description: "Short certificate in social media marketing, SEO and Google Analytics.", duration: "3 months", requirements: { olPasses: 5, otherRequirements: "" } },

    // Ocean University (11)
    { institution: institutions[11]._id, name: "BSc in Maritime Studies", educationLevel: "Bachelor", entryType: "Normal Entry", acceptedFields: ["Any"], acceptedQualificationTypes: [], acceptedQualificationNames: [], description: "Maritime studies degree with logistics, shipping law and port management.", duration: "3 years", requirements: { gpa: 2.0, requiredField: "Any", otherRequirements: "3 passes in A/L (any stream)" } },
    { institution: institutions[11]._id, name: "Diploma in Logistics and Supply Chain", educationLevel: "O/L", description: "Logistics diploma for O/L qualified students with SAP and inventory management.", duration: "1 year", requirements: { olPasses: 6, olMandatorySubjects: ["Mathematics"], otherRequirements: "" } },
    { institution: institutions[11]._id, name: "HND in Marine Engineering", educationLevel: "HND", description: "Marine engineering HND with naval architecture and ship systems modules.", duration: "2 years", requirements: { alStream: "Any", alPasses: 2, otherRequirements: "Science background preferred" } },
    { institution: institutions[11]._id, name: "Foundation in Maritime Studies", educationLevel: "O/L", description: "Foundation for O/L students to enter maritime and logistics degree programmes.", duration: "1 year", requirements: { olPasses: 5, olMandatorySubjects: ["Mathematics", "Science"], otherRequirements: "" } },
  ];

  await Course.insertMany(courses);
  console.log(`Inserted ${courses.length} courses.\n`);
  console.log("Career Pathway test scenarios:");
  console.log("- O/L with 6 passes + Math + English: ~14 courses");
  console.log("- A/L with 2 passes (Any stream): ~8 courses");
  console.log("- Diploma holder: should now see HND programmes");
  console.log("- HND holder: should now see Bachelor Top-Up programmes");
  console.log("- Bachelor with GPA 2.5+: ~10 courses\n");
}

// ============ MAIN SEED ============
async function seed() {
  await connectDB();
  console.log("Starting seed...\n");

  const allInternships = [];

  for (const emp of employers) {
    let user = await User.findOne({ email: emp.email });
    if (user) {
      console.log(`Employer ${emp.email} already exists, skipping user creation.`);
    } else {
      user = await User.create({ email: emp.email, password: emp.password, role: "employer", isVerified: true });
      console.log(`Employer created: ${emp.email}`);
    }

    let company = await CompanyProfile.findOne({ user: user._id });
    if (!company) {
      company = await CompanyProfile.create({ user: user._id, ...emp.company });
      console.log(`   Company: ${emp.company.companyName}`);
    }

    for (const internData of emp.internships) {
      let internship = await Internship.findOne({ title: internData.title, postedBy: user._id });
      if (!internship) {
        internship = await Internship.create({
          ...internData,
          company: emp.company.companyName,
          postedBy: user._id,
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });
        console.log(`   Internship: ${internData.title}`);
      }
      allInternships.push(internship);
    }
    console.log("");
  }

  for (const sk of seekers) {
    let user = await User.findOne({ email: sk.email });
    if (user) {
      console.log(`Seeker ${sk.email} already exists, skipping user creation.`);
    } else {
      user = await User.create({ email: sk.email, password: sk.password, role: "seeker", isVerified: true });
      console.log(`Seeker created: ${sk.email}`);
    }

    let profile = await SeekerProfile.findOne({ user: user._id });
    if (!profile) {
      profile = await SeekerProfile.create({ user: user._id, ...sk.profile });
      console.log(`   Profile: ${sk.profile.fullName}`);
    }

    for (const idx of sk.applyTo) {
      const internship = allInternships[idx];
      if (!internship) {
        console.log(`   Internship index ${idx} not found, skipping.`);
        continue;
      }
      const exists = await Application.findOne({ internship: internship._id, student: user._id });
      if (!exists) {
        await Application.create({ internship: internship._id, student: user._id, status: "Pending" });
        console.log(`   Applied to: ${internship.title}`);
      }
    }
    console.log("");
  }

  // Seed Career Pathway data
  await seedCareerPathway();

  console.log("Seed complete!");
  console.log("\n--- Test Credentials ---");
  console.log("Employers:  employer1@test.com / employer2@test.com / employer3@test.com");
  console.log("Seekers:    seeker1@test.com / seeker2@test.com");
  console.log("Password:   Test@123 (all accounts)");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
