require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const CompanyProfile = require("../models/CompanyProfile");
const SeekerProfile = require("../models/SeekerProfile");
const Internship = require("../models/Internship");
const Application = require("../models/Application");

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
