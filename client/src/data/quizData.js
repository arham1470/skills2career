// Career Assessment Quiz Data
// Each option maps to career categories with point values (+5 or +10)

export const CAREER_CATEGORIES = {
  "Software Engineering": {
    id: "software-engineering",
    skills: ["JavaScript", "React", "Node.js", "TypeScript", "Git", "System Design"],
    internships: ["Frontend Developer Intern", "Web Developer Intern", "Full Stack Developer Intern", "Software Engineering Intern"],
  },
  "Data Science": {
    id: "data-science",
    skills: ["Python", "SQL", "Machine Learning", "Pandas", "NumPy", "Data Visualization"],
    internships: ["Data Analyst Intern", "Data Science Intern", "Business Intelligence Intern", "ML Engineering Intern"],
  },
  "Cybersecurity": {
    id: "cybersecurity",
    skills: ["Network Security", "Ethical Hacking", "Linux", "Risk Assessment", "Cryptography", "Incident Response"],
    internships: ["Cybersecurity Analyst Intern", "Security Operations Intern", "Penetration Testing Intern", "Risk Analyst Intern"],
  },
  "IT / Networking": {
    id: "it-networking",
    skills: ["Network Administration", "Cloud Computing", "System Administration", "Troubleshooting", "AWS/Azure", "Docker"],
    internships: ["IT Support Intern", "Cloud Engineer Intern", "DevOps Intern", "Network Administrator Intern"],
  },
  "Finance / Accounting": {
    id: "finance",
    skills: ["Financial Analysis", "Excel", "Accounting", "Data Analysis", "Investment Analysis", "Risk Management"],
    internships: ["Financial Analyst Intern", "Accounting Intern", "Investment Banking Intern", "Risk Management Intern"],
  },
  "Healthcare / Biotech": {
    id: "healthcare",
    skills: ["Medical Research", "Data Analysis", "Bioinformatics", "Clinical Trials", "Healthcare Management", "Patient Care"],
    internships: ["Clinical Research Intern", "Healthcare Analyst Intern", "Biotech Research Intern", "Health Informatics Intern"],
  },
  "Marketing / Digital Marketing": {
    id: "marketing",
    skills: ["SEO", "Social Media Marketing", "Content Strategy", "Google Analytics", "Copywriting", "Brand Management"],
    internships: ["Digital Marketing Intern", "Social Media Intern", "Content Marketing Intern", "Marketing Analyst Intern"],
  },
  "UI/UX Design": {
    id: "ui-ux-design",
    skills: ["Figma", "User Research", "Wireframing", "Prototyping", "Design Systems", "Interaction Design"],
    internships: ["UI/UX Design Intern", "Product Design Intern", "Graphic Design Intern", "User Research Intern"],
  },
  "Product Management": {
    id: "product-management",
    skills: ["Agile/Scrum", "Market Research", "Data Analysis", "Roadmapping", "Stakeholder Management", "A/B Testing"],
    internships: ["Product Management Intern", "Associate Product Manager", "Business Analyst Intern", "Strategy Intern"],
  },
  "Business / Management / Consulting": {
    id: "business-management",
    skills: ["Strategic Planning", "Operations Management", "Leadership", "Problem Solving", "Communication", "Project Management"],
    internships: ["Management Consulting Intern", "Operations Intern", "Business Strategy Intern", "Management Trainee"],
  },
  "Sales / Business Development": {
    id: "sales",
    skills: ["Negotiation", "Relationship Building", "CRM", "Presentation", "Market Analysis", "Closing Deals"],
    internships: ["Sales Intern", "Business Development Intern", "Account Management Intern", "Inside Sales Representative"],
  },
  "HR / Human Resources": {
    id: "hr",
    skills: ["Recruitment", "Employee Relations", "Performance Management", "HR Analytics", "Training & Development", "Conflict Resolution"],
    internships: ["HR Intern", "Talent Acquisition Intern", "Recruiting Coordinator", "People Operations Intern"],
  },
  "Core Engineering (Mechanical / Electrical / Civil)": {
    id: "core-engineering",
    skills: ["AutoCAD / SolidWorks", "Technical Drawing", "Thermodynamics / Circuits / Structures", "MATLAB", "Project Planning", "Quality Control"],
    internships: ["Mechanical Engineering Intern", "Electrical Engineering Intern", "Civil Engineering Intern", "Design Engineer Intern"],
  },
  "Legal / Law": {
    id: "legal",
    skills: ["Legal Research", "Contract Drafting", "Compliance", "Negotiation", "Critical Analysis", "Case Law"],
    internships: ["Legal Intern", "Paralegal Intern", "Compliance Intern", "Corporate Law Intern"],
  },
  "Education / Teaching": {
    id: "education",
    skills: ["Curriculum Design", "Public Speaking", "Mentoring", "Assessment Design", "EdTech Tools", "Subject Matter Expertise"],
    internships: ["Teaching Intern", "Instructional Design Intern", "EdTech Product Intern", "Curriculum Developer Intern"],
  },
  "Content / Media / Journalism": {
    id: "content-media",
    skills: ["Writing & Editing", "Storytelling", "SEO Writing", "Social Media Content", "Video Production", "Audience Research"],
    internships: ["Content Writer Intern", "Journalism Intern", "Video Production Intern", "Social Media Content Intern"],
  },
  "Research / Science": {
    id: "research-science",
    skills: ["Scientific Method", "Data Collection", "Lab Techniques", "Academic Writing", "Statistical Analysis", "Peer Review"],
    internships: ["Research Assistant", "Lab Technician Intern", "R&D Intern", "Scientific Research Intern"],
  },
  "Government / Civil Services / Public Administration": {
    id: "government",
    skills: ["Policy Analysis", "Public Administration", "Regulatory Compliance", "Research", "Report Writing", "Stakeholder Engagement"],
    internships: ["Policy Research Intern", "Public Administration Intern", "Government Affairs Intern", "Civil Service Trainee"],
  },
  "Creative Arts (Animation / Graphic Design / Illustration)": {
    id: "creative-arts",
    skills: ["Adobe Creative Suite", "Animation", "Illustration", "Color Theory", "Visual Storytelling", "Motion Graphics"],
    internships: ["Graphic Design Intern", "Animation Intern", "Illustration Intern", "Motion Graphics Intern"],
  },
  "Psychology / Social Work / Counseling": {
    id: "psychology",
    skills: ["Active Listening", "Counseling Techniques", "Behavioral Analysis", "Mental Health First Aid", "Case Management", "Empathy"],
    internships: ["Counseling Intern", "Social Work Intern", "Mental Health Intern", "Research Assistant (Psychology)"],
  },
  "Hospitality / Tourism / Event Management": {
    id: "hospitality",
    skills: ["Customer Service", "Event Planning", "Operations", "Vendor Management", "Crisis Management", "Cultural Awareness"],
    internships: ["Hotel Management Intern", "Event Planning Intern", "Tourism Intern", "Food & Beverage Intern"],
  },
  "Entrepreneurship / Startups": {
    id: "entrepreneurship",
    skills: ["Business Modeling", "Pitching", "Financial Planning", "Networking", "Innovation", "Risk Management"],
    internships: ["Startup Intern", "Founder Associate", "Venture Capital Intern", "Business Development (Startup)"],
  },
};

// Helper to build option with points
const opt = (text, points) => ({ text, points });

export const QUIZ_SECTIONS = [
  {
    id: "interests",
    title: "Interests",
    description: "What subjects and activities excite you the most?",
    questions: [
      {
        id: "int-1",
        text: "Which subject interests you the most?",
        options: [
          opt("Mathematics", { "Data Science": 10, "Finance": 5, "Core Engineering (Mechanical / Electrical / Civil)": 5 }),
          opt("Programming / Computer Science", { "Software Engineering": 10, "Cybersecurity": 5, "IT / Networking": 5 }),
          opt("Accounting / Economics / Business", { "Finance": 10, "Business / Management / Consulting": 5, "Entrepreneurship / Startups": 5 }),
          opt("Biology / Medicine", { "Healthcare / Biotech": 10, "Psychology / Social Work / Counseling": 5 }),
          opt("Arts / Design / Animation", { "UI/UX Design": 10, "Creative Arts (Animation / Graphic Design / Illustration)": 10, "Marketing": 5 }),
          opt("Psychology / Communication / Sociology", { "Psychology / Social Work / Counseling": 10, "HR / Human Resources": 5, "Marketing": 5 }),
          opt("Law / Political Science / Governance", { "Legal / Law": 10, "Government / Civil Services / Public Administration": 10 }),
          opt("Physics / Chemistry / Engineering Sciences", { "Core Engineering (Mechanical / Electrical / Civil)": 10, "Research / Science": 10 }),
          opt("Journalism / Literature / Media", { "Content / Media / Journalism": 10, "Education / Teaching": 5 }),
        ],
      },
      {
        id: "int-2",
        text: "What type of project would you enjoy working on?",
        options: [
          opt("Building a mobile app or website", { "Software Engineering": 10, "UI/UX Design": 5 }),
          opt("Analyzing large datasets to find trends", { "Data Science": 10, "Finance": 5 }),
          opt("Securing a network from hackers", { "Cybersecurity": 10, "IT / Networking": 5 }),
          opt("Designing a marketing campaign", { "Marketing": 10, "Product Management": 5 }),
          opt("Creating visual designs or animations", { "Creative Arts (Animation / Graphic Design / Illustration)": 10, "UI/UX Design": 5 }),
          opt("Researching a new medical treatment", { "Healthcare / Biotech": 10, "Research / Science": 5 }),
          opt("Drafting legal contracts or analyzing policies", { "Legal / Law": 10, "Government / Civil Services / Public Administration": 5 }),
          opt("Planning an event or managing hospitality", { "Hospitality / Tourism / Event Management": 10, "Marketing": 5 }),
          opt("Building a business plan or pitching to investors", { "Entrepreneurship / Startups": 10, "Business / Management / Consulting": 5 }),
        ],
      },
      {
        id: "int-3",
        text: "In your free time, you are most likely to:",
        options: [
          opt("Code personal projects or learn new tech", { "Software Engineering": 10, "IT / Networking": 5 }),
          opt("Read about financial markets or investing", { "Finance": 10 }),
          opt("Watch tech review or cybersecurity videos", { "Cybersecurity": 10, "IT / Networking": 5 }),
          opt("Browse design portfolios or create art", { "Creative Arts (Animation / Graphic Design / Illustration)": 10, "UI/UX Design": 5 }),
          opt("Follow health, fitness, or science content", { "Healthcare / Biotech": 10, "Research / Science": 5 }),
          opt("Engage with brands and social media trends", { "Marketing": 10, "Content / Media / Journalism": 5 }),
          opt("Write blogs, stories, or make videos", { "Content / Media / Journalism": 10, "Marketing": 5 }),
          opt("Volunteer, mentor, or help people", { "Psychology / Social Work / Counseling": 10, "Education / Teaching": 5, "HR / Human Resources": 5 }),
          opt("Read about startups, leadership, or business", { "Entrepreneurship / Startups": 10, "Business / Management / Consulting": 5 }),
        ],
      },
      {
        id: "int-4",
        text: "Which industry excites you the most?",
        options: [
          opt("Technology / Software / AI", { "Software Engineering": 10, "Data Science": 5, "Cybersecurity": 5 }),
          opt("Banking / Finance / Fintech", { "Finance": 10, "Data Science": 5, "Entrepreneurship / Startups": 5 }),
          opt("Healthcare / Pharmaceuticals / Wellness", { "Healthcare / Biotech": 10, "Psychology / Social Work / Counseling": 5 }),
          opt("Media / Entertainment / Advertising", { "Marketing": 10, "Content / Media / Journalism": 10, "Creative Arts (Animation / Graphic Design / Illustration)": 5 }),
          opt("E-commerce / Startups / Ventures", { "Entrepreneurship / Startups": 10, "Product Management": 5, "Marketing": 5 }),
          opt("Government / Defense / Public Sector", { "Cybersecurity": 10, "Government / Civil Services / Public Administration": 10, "Legal / Law": 5 }),
          opt("Education / EdTech", { "Education / Teaching": 10, "Content / Media / Journalism": 5 }),
          opt("Manufacturing / Energy / Construction", { "Core Engineering (Mechanical / Electrical / Civil)": 10, "IT / Networking": 5 }),
          opt("Hospitality / Travel / Events", { "Hospitality / Tourism / Event Management": 10, "Marketing": 5 }),
        ],
      },
      {
        id: "int-5",
        text: "What kind of problems do you like solving?",
        options: [
          opt("Logical and mathematical puzzles", { "Data Science": 10, "Finance": 5, "Software Engineering": 5, "Core Engineering (Mechanical / Electrical / Civil)": 5 }),
          opt("Real-world user experience challenges", { "UI/UX Design": 10, "Product Management": 5, "Hospitality / Tourism / Event Management": 5 }),
          opt("Security threats and vulnerabilities", { "Cybersecurity": 10 }),
          opt("Business growth and market challenges", { "Marketing": 10, "Sales / Business Development": 10, "Entrepreneurship / Startups": 5 }),
          opt("System failures and infrastructure issues", { "IT / Networking": 10, "Core Engineering (Mechanical / Electrical / Civil)": 5 }),
          opt("Scientific and medical mysteries", { "Healthcare / Biotech": 10, "Research / Science": 5 }),
          opt("Legal disputes and compliance gaps", { "Legal / Law": 10, "Government / Civil Services / Public Administration": 5 }),
          opt("Human behavior and social dynamics", { "Psychology / Social Work / Counseling": 10, "HR / Human Resources": 5 }),
        ],
      },
      {
        id: "int-6",
        text: "Which type of content do you prefer reading?",
        options: [
          opt("Tech blogs and coding tutorials", { "Software Engineering": 10, "IT / Networking": 5 }),
          opt("Financial reports and market news", { "Finance": 10 }),
          opt("Data science case studies and research", { "Data Science": 10 }),
          opt("Design inspiration and UX articles", { "UI/UX Design": 10, "Creative Arts (Animation / Graphic Design / Illustration)": 5 }),
          opt("Marketing case studies and brand stories", { "Marketing": 10, "Content / Media / Journalism": 5 }),
          opt("Medical journals and health discoveries", { "Healthcare / Biotech": 10, "Research / Science": 5 }),
          opt("Legal briefs, policy papers, and case law", { "Legal / Law": 10, "Government / Civil Services / Public Administration": 5 }),
          opt("Fiction, poetry, or journalistic articles", { "Content / Media / Journalism": 10, "Education / Teaching": 5 }),
          opt("Biographies of entrepreneurs and leaders", { "Entrepreneurship / Startups": 10, "Business / Management / Consulting": 5 }),
        ],
      },
      {
        id: "int-7",
        text: "If you could attend a workshop, which would you choose?",
        options: [
          opt("Hackathon or coding bootcamp", { "Software Engineering": 10, "IT / Networking": 5 }),
          opt("Data visualization and analytics workshop", { "Data Science": 10 }),
          opt("Ethical hacking or capture-the-flag event", { "Cybersecurity": 10 }),
          opt("Design thinking or portfolio review", { "UI/UX Design": 10, "Creative Arts (Animation / Graphic Design / Illustration)": 5 }),
          opt("Digital marketing or SEO masterclass", { "Marketing": 10, "Content / Media / Journalism": 5 }),
          opt("Healthcare innovation or biotech summit", { "Healthcare / Biotech": 10, "Research / Science": 5 }),
          opt("Moot court or legal debate competition", { "Legal / Law": 10 }),
          opt("Teaching pedagogy or EdTech seminar", { "Education / Teaching": 10 }),
          opt("Startup pitch day or venture workshop", { "Entrepreneurship / Startups": 10, "Business / Management / Consulting": 5 }),
        ],
      },
      {
        id: "int-8",
        text: "Which statement resonates with you most?",
        options: [
          opt("I love building things that people use every day.", { "Software Engineering": 10, "Product Management": 5, "Core Engineering (Mechanical / Electrical / Civil)": 5 }),
          opt("I enjoy uncovering insights hidden in numbers.", { "Data Science": 10, "Finance": 5 }),
          opt("Protecting people and systems excites me.", { "Cybersecurity": 10, "Legal / Law": 5 }),
          opt("I want to influence how people think and buy.", { "Marketing": 10, "Sales / Business Development": 5 }),
          opt("Making technology accessible and beautiful matters to me.", { "UI/UX Design": 10, "Creative Arts (Animation / Graphic Design / Illustration)": 5 }),
          opt("Improving human health is my ultimate goal.", { "Healthcare / Biotech": 10, "Psychology / Social Work / Counseling": 5 }),
          opt("I want to shape policies that impact society.", { "Government / Civil Services / Public Administration": 10, "Legal / Law": 5 }),
          opt("Helping others grow and learn is my passion.", { "Education / Teaching": 10, "HR / Human Resources": 5 }),
          opt("I want to build something of my own.", { "Entrepreneurship / Startups": 10 }),
        ],
      },
      {
        id: "int-9",
        text: "If you could work in any environment, which would you prefer?",
        options: [
          opt("A fast-paced tech startup", { "Software Engineering": 10, "Entrepreneurship / Startups": 10, "Data Science": 5 }),
          opt("A structured corporate office", { "Finance": 10, "Business / Management / Consulting": 5, "Legal / Law": 5 }),
          opt("A creative studio or agency", { "Creative Arts (Animation / Graphic Design / Illustration)": 10, "UI/UX Design": 10, "Marketing": 5 }),
          opt("A hospital, lab, or research center", { "Healthcare / Biotech": 10, "Research / Science": 10 }),
          opt("A classroom or educational institute", { "Education / Teaching": 10 }),
          opt("A hotel, resort, or event venue", { "Hospitality / Tourism / Event Management": 10 }),
          opt("A government building or public office", { "Government / Civil Services / Public Administration": 10, "Legal / Law": 5 }),
          opt("A workshop, factory, or construction site", { "Core Engineering (Mechanical / Electrical / Civil)": 10 }),
          opt("From anywhere — remote and flexible", { "Software Engineering": 5, "Content / Media / Journalism": 5, "Marketing": 5 }),
        ],
      },
    ],
  },
  {
    id: "personality",
    title: "Personality",
    description: "How do you think, act, and interact with others?",
    questions: [
      {
        id: "per-1",
        text: "How do you prefer to work?",
        options: [
          opt("Independently on deep technical problems", { "Software Engineering": 10, "Data Science": 10, "Research / Science": 5 }),
          opt("In a team with clear roles and collaboration", { "Product Management": 10, "Software Engineering": 5, "Core Engineering (Mechanical / Electrical / Civil)": 5 }),
          opt("Leading and influencing others toward a goal", { "Marketing": 10, "Business / Management / Consulting": 10, "Sales / Business Development": 5 }),
          opt("Helping and advising people directly", { "Healthcare / Biotech": 10, "Psychology / Social Work / Counseling": 10, "HR / Human Resources": 5 }),
          opt("Flexibly switching between creative and analytical tasks", { "UI/UX Design": 10, "Creative Arts (Animation / Graphic Design / Illustration)": 10, "Marketing": 5 }),
          opt("Monitoring systems and responding to alerts", { "Cybersecurity": 10, "IT / Networking": 5 }),
          opt("Following structured protocols with precision", { "Legal / Law": 10, "Government / Civil Services / Public Administration": 5, "Finance": 5 }),
          opt("Teaching, mentoring, or guiding others", { "Education / Teaching": 10, "HR / Human Resources": 5 }),
        ],
      },
      {
        id: "per-2",
        text: "When faced with a challenge, you typically:",
        options: [
          opt("Break it into logical steps and code a solution", { "Software Engineering": 10 }),
          opt("Research data and evidence to make a decision", { "Data Science": 10, "Finance": 5, "Research / Science": 5 }),
          opt("Think creatively and brainstorm many ideas", { "UI/UX Design": 10, "Creative Arts (Animation / Graphic Design / Illustration)": 10, "Marketing": 5 }),
          opt("Assess risks and plan contingencies", { "Cybersecurity": 10, "Finance": 5, "Business / Management / Consulting": 5 }),
          opt("Collaborate with others to find the best path", { "Product Management": 10, "HR / Human Resources": 5 }),
          opt("Follow protocols and ensure compliance", { "Legal / Law": 10, "Healthcare / Biotech": 5, "Government / Civil Services / Public Administration": 5 }),
          opt("Negotiate, persuade, or find a win-win", { "Sales / Business Development": 10, "Legal / Law": 5 }),
          opt("Empathize and consider human impact first", { "Psychology / Social Work / Counseling": 10, "Education / Teaching": 5 }),
        ],
      },
      {
        id: "per-3",
        text: "How do you make important decisions?",
        options: [
          opt("Based on data, numbers, and logical reasoning", { "Data Science": 10, "Finance": 10, "Core Engineering (Mechanical / Electrical / Civil)": 5 }),
          opt("By trusting my intuition and gut feeling", { "UI/UX Design": 10, "Entrepreneurship / Startups": 5, "Marketing": 5 }),
          opt("After consulting with experts or mentors", { "Healthcare / Biotech": 10, "Product Management": 5, "Education / Teaching": 5 }),
          opt("By evaluating potential risks and outcomes", { "Cybersecurity": 10, "Finance": 5, "Business / Management / Consulting": 5 }),
          opt("Through experimentation and iteration", { "Software Engineering": 10, "Product Management": 5, "Research / Science": 5 }),
          opt("By following established guidelines and procedures", { "IT / Networking": 10, "Legal / Law": 5, "Government / Civil Services / Public Administration": 5 }),
          opt("By considering what is fair and ethical for everyone", { "Legal / Law": 10, "Psychology / Social Work / Counseling": 5, "HR / Human Resources": 5 }),
          opt("By gathering diverse opinions and building consensus", { "HR / Human Resources": 10, "Business / Management / Consulting": 5, "Education / Teaching": 5 }),
        ],
      },
      {
        id: "per-4",
        text: "In a group project, which role suits you best?",
        options: [
          opt("The Developer — building the actual product", { "Software Engineering": 10, "IT / Networking": 5, "Core Engineering (Mechanical / Electrical / Civil)": 5 }),
          opt("The Analyst — researching and presenting data", { "Data Science": 10, "Finance": 5, "Research / Science": 5 }),
          opt("The Designer — crafting the look and feel", { "UI/UX Design": 10, "Creative Arts (Animation / Graphic Design / Illustration)": 5 }),
          opt("The Marketer — pitching and promoting the idea", { "Marketing": 10, "Sales / Business Development": 5, "Content / Media / Journalism": 5 }),
          opt("The Manager — organizing tasks and deadlines", { "Product Management": 10, "Business / Management / Consulting": 5 }),
          opt("The Guardian — ensuring quality and security", { "Cybersecurity": 10, "Healthcare / Biotech": 5, "Legal / Law": 5 }),
          opt("The Connector — bringing people together", { "HR / Human Resources": 10, "Psychology / Social Work / Counseling": 5 }),
          opt("The Teacher — explaining and mentoring teammates", { "Education / Teaching": 10, "Business / Management / Consulting": 5 }),
          opt("The Visionary — coming up with the big idea", { "Entrepreneurship / Startups": 10, "Product Management": 5 }),
        ],
      },
      {
        id: "per-5",
        text: "How do you handle stress or tight deadlines?",
        options: [
          opt("Focus intensely and code until it's done", { "Software Engineering": 10 }),
          opt("Prioritize data-driven decisions to save time", { "Data Science": 10, "Finance": 5 }),
          opt("Stay calm and follow checklists and protocols", { "Cybersecurity": 10, "IT / Networking": 5, "Legal / Law": 5 }),
          opt("Delegate and coordinate the team", { "Product Management": 10, "Business / Management / Consulting": 5 }),
          opt("Take short creative breaks to refresh my mind", { "UI/UX Design": 10, "Creative Arts (Animation / Graphic Design / Illustration)": 5 }),
          opt("Break tasks into smaller health-focused routines", { "Healthcare / Biotech": 10, "Psychology / Social Work / Counseling": 5 }),
          opt("Talk it through with colleagues or mentors", { "HR / Human Resources": 10, "Education / Teaching": 5 }),
          opt("Trust my instincts and adapt quickly", { "Entrepreneurship / Startups": 10, "Sales / Business Development": 5 }),
        ],
      },
      {
        id: "per-6",
        text: "Which of these describes your ideal workday?",
        options: [
          opt("Deep focus, minimal meetings, shipping code", { "Software Engineering": 10, "Data Science": 5 }),
          opt("Analyzing dashboards and presenting insights", { "Data Science": 10, "Finance": 5, "Business / Management / Consulting": 5 }),
          opt("Sketching wireframes and testing with users", { "UI/UX Design": 10, "Creative Arts (Animation / Graphic Design / Illustration)": 5 }),
          opt("Meeting clients, pitching, and closing deals", { "Sales / Business Development": 10, "Marketing": 5, "Finance": 5 }),
          opt("Monitoring alerts and responding to incidents", { "Cybersecurity": 10, "IT / Networking": 5 }),
          opt("Coordinating teams and defining product roadmaps", { "Product Management": 10, "Business / Management / Consulting": 5 }),
          opt("Teaching a class or designing a curriculum", { "Education / Teaching": 10 }),
          opt("Writing articles, filming, or editing content", { "Content / Media / Journalism": 10, "Marketing": 5 }),
          opt("Working on-site at a construction or manufacturing project", { "Core Engineering (Mechanical / Electrical / Civil)": 10 }),
        ],
      },
      {
        id: "per-7",
        text: "What motivates you the most in a career?",
        options: [
          opt("Creating innovative technology", { "Software Engineering": 10, "IT / Networking": 5 }),
          opt("Solving complex analytical problems", { "Data Science": 10, "Finance": 5, "Core Engineering (Mechanical / Electrical / Civil)": 5 }),
          opt("Protecting organizations and individuals", { "Cybersecurity": 10, "Legal / Law": 5 }),
          opt("Helping people stay healthy", { "Healthcare / Biotech": 10, "Psychology / Social Work / Counseling": 5 }),
          opt("Shaping how brands connect with audiences", { "Marketing": 10, "Content / Media / Journalism": 5 }),
          opt("Building products that users love", { "Product Management": 10, "UI/UX Design": 5 }),
          opt("Making a positive impact on society", { "Government / Civil Services / Public Administration": 10, "Education / Teaching": 5, "Psychology / Social Work / Counseling": 5 }),
          opt("Achieving financial freedom and independence", { "Finance": 10, "Entrepreneurship / Startups": 5, "Sales / Business Development": 5 }),
          opt("Expressing creativity and originality", { "Creative Arts (Animation / Graphic Design / Illustration)": 10, "UI/UX Design": 5 }),
        ],
      },
      {
        id: "per-8",
        text: "How do you prefer to interact with people?",
        options: [
          opt("Minimal interaction — I prefer working alone", { "Software Engineering": 10, "Data Science": 10, "Research / Science": 5 }),
          opt("Small teams with focused collaboration", { "Product Management": 10, "UI/UX Design": 5, "Core Engineering (Mechanical / Electrical / Civil)": 5 }),
          opt("Large groups where I can network and influence", { "Sales / Business Development": 10, "Marketing": 5, "Business / Management / Consulting": 5 }),
          opt("One-on-one mentoring or counseling sessions", { "Psychology / Social Work / Counseling": 10, "Education / Teaching": 10, "HR / Human Resources": 5 }),
          opt("Leading presentations and public speaking", { "Marketing": 10, "Content / Media / Journalism": 5, "Education / Teaching": 5 }),
          opt("Negotiating and persuading in high-stakes situations", { "Sales / Business Development": 10, "Legal / Law": 5 }),
          opt("Serving and helping customers or guests", { "Hospitality / Tourism / Event Management": 10, "Healthcare / Biotech": 5 }),
          opt("Building communities and managing relationships", { "HR / Human Resources": 10, "Marketing": 5 }),
        ],
      },
      {
        id: "per-9",
        text: "Which value is most important to you in a workplace?",
        options: [
          opt("Innovation and cutting-edge technology", { "Software Engineering": 10, "Data Science": 5, "Cybersecurity": 5 }),
          opt("Stability and structured growth", { "Finance": 10, "Government / Civil Services / Public Administration": 10, "Legal / Law": 5 }),
          opt("Creativity and freedom of expression", { "Creative Arts (Animation / Graphic Design / Illustration)": 10, "UI/UX Design": 10, "Content / Media / Journalism": 5 }),
          opt("Helping others and social impact", { "Healthcare / Biotech": 10, "Psychology / Social Work / Counseling": 10, "Education / Teaching": 5 }),
          opt("Competition and high rewards", { "Sales / Business Development": 10, "Finance": 5, "Entrepreneurship / Startups": 5 }),
          opt("Work-life balance and flexibility", { "Education / Teaching": 5, "Content / Media / Journalism": 5, "Marketing": 5 }),
          opt("Recognition and leadership opportunities", { "Business / Management / Consulting": 10, "Product Management": 5 }),
          opt("Learning and personal development", { "Research / Science": 10, "Education / Teaching": 5, "Software Engineering": 5 }),
        ],
      },
    ],
  },
  {
    id: "skills",
    title: "Skills / Aptitude",
    description: "What are you naturally good at or eager to learn?",
    questions: [
      {
        id: "skl-1",
        text: "Which technical skill do you feel most confident in (or want to learn)?",
        options: [
          opt("Writing and debugging code", { "Software Engineering": 10, "Cybersecurity": 5 }),
          opt("Working with data and statistics", { "Data Science": 10, "Finance": 5 }),
          opt("Designing visual interfaces or artwork", { "UI/UX Design": 10, "Creative Arts (Animation / Graphic Design / Illustration)": 10, "Marketing": 5 }),
          opt("Setting up networks or cloud systems", { "IT / Networking": 10, "Cybersecurity": 5 }),
          opt("Analyzing financial statements or markets", { "Finance": 10 }),
          opt("Understanding biological or chemical systems", { "Healthcare / Biotech": 10, "Research / Science": 5 }),
          opt("Drafting documents or legal arguments", { "Legal / Law": 10, "Content / Media / Journalism": 5 }),
          opt("Building physical prototypes or machines", { "Core Engineering (Mechanical / Electrical / Civil)": 10 }),
          opt("Planning events or managing logistics", { "Hospitality / Tourism / Event Management": 10, "Business / Management / Consulting": 5 }),
        ],
      },
      {
        id: "skl-2",
        text: "Which tool or platform would you like to master?",
        options: [
          opt("VS Code, GitHub, and cloud IDEs", { "Software Engineering": 10, "IT / Networking": 5 }),
          opt("Python, Jupyter, and SQL databases", { "Data Science": 10, "Finance": 5 }),
          opt("Figma, Adobe Creative Suite, or Blender", { "UI/UX Design": 10, "Creative Arts (Animation / Graphic Design / Illustration)": 10, "Marketing": 5 }),
          opt("Wireshark, Kali Linux, and SIEM tools", { "Cybersecurity": 10 }),
          opt("Excel, Tableau, and Power BI", { "Finance": 10, "Data Science": 5, "Business / Management / Consulting": 5 }),
          opt("AWS, Docker, and Kubernetes", { "IT / Networking": 10, "Software Engineering": 5 }),
          opt("AutoCAD, SolidWorks, or MATLAB", { "Core Engineering (Mechanical / Electrical / Civil)": 10 }),
          opt("WordPress, Canva, or social media schedulers", { "Content / Media / Journalism": 10, "Marketing": 5 }),
          opt("CRM tools like Salesforce or HubSpot", { "Sales / Business Development": 10, "Marketing": 5 }),
        ],
      },
      {
        id: "skl-3",
        text: "How comfortable are you with mathematics?",
        options: [
          opt("Very comfortable — I enjoy advanced math", { "Data Science": 10, "Finance": 10, "Software Engineering": 5, "Core Engineering (Mechanical / Electrical / Civil)": 10 }),
          opt("Moderate — I can apply it when needed", { "Software Engineering": 10, "IT / Networking": 5, "Cybersecurity": 5, "Business / Management / Consulting": 5 }),
          opt("Basic — I prefer practical applications", { "UI/UX Design": 10, "Marketing": 5, "Product Management": 5, "Hospitality / Tourism / Event Management": 5 }),
          opt("Minimal — I focus on communication and creativity", { "Marketing": 10, "Content / Media / Journalism": 5, "Creative Arts (Animation / Graphic Design / Illustration)": 5 }),
          opt("Strong in statistics and probability", { "Data Science": 10, "Finance": 5, "Research / Science": 5 }),
          opt("Strong in biological and life sciences", { "Healthcare / Biotech": 10, "Research / Science": 5 }),
          opt("I prefer qualitative and conceptual thinking", { "Legal / Law": 10, "Psychology / Social Work / Counseling": 5, "Education / Teaching": 5 }),
        ],
      },
      {
        id: "skl-4",
        text: "Which soft skill is your strongest?",
        options: [
          opt("Logical thinking and problem decomposition", { "Software Engineering": 10, "Data Science": 5, "Core Engineering (Mechanical / Electrical / Civil)": 5 }),
          opt("Communication and storytelling", { "Marketing": 10, "Content / Media / Journalism": 10, "Product Management": 5 }),
          opt("Attention to detail and precision", { "Cybersecurity": 10, "Finance": 5, "Legal / Law": 5 }),
          opt("Creativity and visual thinking", { "UI/UX Design": 10, "Creative Arts (Animation / Graphic Design / Illustration)": 10, "Marketing": 5 }),
          opt("Empathy and understanding user needs", { "Healthcare / Biotech": 10, "UI/UX Design": 5, "Psychology / Social Work / Counseling": 10 }),
          opt("Leadership and team coordination", { "Product Management": 10, "Business / Management / Consulting": 10, "HR / Human Resources": 5 }),
          opt("Persuasion and negotiation", { "Sales / Business Development": 10, "Legal / Law": 5 }),
          opt("Patience and mentoring ability", { "Education / Teaching": 10, "HR / Human Resources": 5, "Psychology / Social Work / Counseling": 5 }),
        ],
      },
      {
        id: "skl-5",
        text: "How do you approach learning something new?",
        options: [
          opt("Build a project to apply concepts hands-on", { "Software Engineering": 10, "IT / Networking": 5, "Core Engineering (Mechanical / Electrical / Civil)": 5 }),
          opt("Read research papers and case studies", { "Data Science": 10, "Healthcare / Biotech": 5, "Research / Science": 10 }),
          opt("Follow tutorials and replicate examples", { "UI/UX Design": 10, "Creative Arts (Animation / Graphic Design / Illustration)": 5, "Marketing": 5 }),
          opt("Join communities and learn from peers", { "Cybersecurity": 10, "Software Engineering": 5, "Entrepreneurship / Startups": 5 }),
          opt("Take structured courses and get certified", { "Finance": 10, "IT / Networking": 5, "Legal / Law": 5, "Education / Teaching": 5 }),
          opt("Experiment and iterate based on feedback", { "Product Management": 10, "Marketing": 5, "Entrepreneurship / Startups": 5 }),
          opt("Shadow experts and learn on the job", { "Hospitality / Tourism / Event Management": 10, "Sales / Business Development": 5, "HR / Human Resources": 5 }),
          opt("Debate, discuss, and challenge ideas", { "Legal / Law": 10, "Government / Civil Services / Public Administration": 5, "Education / Teaching": 5 }),
        ],
      },
      {
        id: "skl-6",
        text: "Which task would you perform best?",
        options: [
          opt("Writing clean, efficient code", { "Software Engineering": 10 }),
          opt("Cleaning and analyzing messy datasets", { "Data Science": 10 }),
          opt("Detecting and patching security flaws", { "Cybersecurity": 10 }),
          opt("Configuring servers and deploying apps", { "IT / Networking": 10, "Software Engineering": 5 }),
          opt("Preparing financial forecasts and budgets", { "Finance": 10 }),
          opt("Designing a user-friendly mobile app screen", { "UI/UX Design": 10 }),
          opt("Writing a compelling article or script", { "Content / Media / Journalism": 10, "Marketing": 5 }),
          opt("Counseling someone through a difficult time", { "Psychology / Social Work / Counseling": 10 }),
          opt("Pitching a product to a potential client", { "Sales / Business Development": 10, "Marketing": 5 }),
        ],
      },
      {
        id: "skl-7",
        text: "Which emerging technology or trend excites you the most?",
        options: [
          opt("Generative AI and large language models", { "Software Engineering": 10, "Data Science": 10 }),
          opt("Blockchain and decentralized finance", { "Finance": 10, "Cybersecurity": 5 }),
          opt("Zero-trust architecture and quantum-safe security", { "Cybersecurity": 10 }),
          opt("AI in healthcare and drug discovery", { "Healthcare / Biotech": 10, "Data Science": 5 }),
          opt("No-code / low-code platforms", { "Product Management": 10, "UI/UX Design": 5 }),
          opt("Cloud-native and edge computing", { "IT / Networking": 10, "Software Engineering": 5 }),
          opt("Green energy and sustainable engineering", { "Core Engineering (Mechanical / Electrical / Civil)": 10, "Research / Science": 5 }),
          opt("EdTech and online learning innovations", { "Education / Teaching": 10, "Content / Media / Journalism": 5 }),
          opt("Creator economy and digital media platforms", { "Content / Media / Journalism": 10, "Creative Arts (Animation / Graphic Design / Illustration)": 5, "Marketing": 5 }),
        ],
      },
      {
        id: "skl-8",
        text: "Rate your interest in the following area (highest interest):",
        options: [
          opt("Building and maintaining software products", { "Software Engineering": 10, "IT / Networking": 5 }),
          opt("Using data to drive business decisions", { "Data Science": 10, "Finance": 5, "Product Management": 5 }),
          opt("Defending digital assets and privacy", { "Cybersecurity": 10 }),
          opt("Managing money, investments, and risk", { "Finance": 10 }),
          opt("Improving health outcomes through innovation", { "Healthcare / Biotech": 10 }),
          opt("Creating compelling user experiences and brands", { "UI/UX Design": 10, "Creative Arts (Animation / Graphic Design / Illustration)": 5, "Marketing": 5 }),
          opt("Shaping laws, policies, and governance", { "Legal / Law": 10, "Government / Civil Services / Public Administration": 5 }),
          opt("Helping people learn, grow, and thrive", { "Education / Teaching": 10, "Psychology / Social Work / Counseling": 5, "HR / Human Resources": 5 }),
          opt("Starting and scaling new ventures", { "Entrepreneurship / Startups": 10, "Business / Management / Consulting": 5, "Sales / Business Development": 5 }),
        ],
      },
    ],
  },
];

// Calculate results from selected answers
export function calculateResults(selectedAnswers) {
  const scores = {};
  Object.keys(CAREER_CATEGORIES).forEach((cat) => (scores[cat] = 0));

  QUIZ_SECTIONS.forEach((section) => {
    section.questions.forEach((q) => {
      const ans = selectedAnswers[q.id];
      if (ans == null) return;
      const option = q.options[ans];
      if (!option || !option.points) return;
      Object.entries(option.points).forEach(([cat, pts]) => {
        scores[cat] = (scores[cat] || 0) + pts;
      });
    });
  });

  // Calculate max possible raw score for normalization
  let maxPossible = 0;
  QUIZ_SECTIONS.forEach((section) => {
    section.questions.forEach((q) => {
      const maxQ = Math.max(...q.options.map((o) => {
        return Math.max(...Object.values(o.points || {}));
      }));
      maxPossible += maxQ;
    });
  });

  const results = Object.entries(scores)
    .map(([career, score]) => ({
      career,
      score,
      percentage: Math.min(100, Math.round((score / maxPossible) * 100)),
      ...CAREER_CATEGORIES[career],
    }))
    .sort((a, b) => b.score - a.score);

  return results;
}
