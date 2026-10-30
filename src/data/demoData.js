// ========================================================
// CareerCoach AI — Comprehensive Phase 2 Data Layer
// Centralized Reusable Data Structures:
// - Departments
// - Career Role Catalog (20+ roles with skills, categories, departments)
// - Student Profile with Academic Year, Degree, Difficulty
// - Preparation Categories & Cross-Disciplinary Pathways
// ========================================================

export const initialStudentProfile = {
  id: "student_001",
  name: "Aarav Sharma",
  email: "aarav.sharma@nit.edu.in",
  avatar: "AS",
  college: "National Institute of Technology",
  degree: "B.Tech in Computer Science & Engineering",
  departmentId: "cse",
  department: "Computer Science Engineering (CSE)",
  currentYear: "4th Year (Final Year)",
  graduationYear: "2026",
  cgpa: "8.85",
  targetRoleId: "full-stack-developer",
  targetRole: "Full-Stack Developer",
  targetTier: "Tier 1 Product Companies",
  difficultyLevel: "Intermediate", // Beginner, Intermediate, Advanced, Tier-1 Elite
  github: "https://github.com/aaravsharma-dev",
  linkedin: "https://linkedin.com/in/aarav-sharma-cs",
  resumeName: "Aarav_Sharma_Resume_2026.pdf",
  bio: "Final year B.Tech student passionate about scalable distributed architectures and modern full-stack engineering. Preparing for campus placement season.",
  skills: ["JavaScript", "React", "Node.js", "Java", "Data Structures", "SQL", "Git"],
  profileCompletion: 92,
  isTemporaryData: true
};

// 1. EXACT PHASE 2 DEPARTMENTS LIST
export const engineeringDepartments = [
  {
    id: "cse",
    name: "Computer Science Engineering (CSE)",
    shortName: "CSE",
    code: "CSE",
    icon: "Code2",
    description: "Core algorithms, data structures, operating systems, database architectures, and distributed systems.",
    activeStudents: "4,600+ preparing",
    coreSubjects: ["Data Structures & Algorithms", "OS & DBMS", "Computer Networks", "System Design"],
    defaultRoleIds: ["software-developer", "full-stack-developer", "backend-developer", "frontend-developer", "ai-ml-engineer"]
  },
  {
    id: "it",
    name: "Information Technology (IT)",
    shortName: "IT",
    code: "IT",
    icon: "Laptop",
    description: "Enterprise software, cloud infrastructure, networking protocols, information security, and web services.",
    activeStudents: "3,400+ preparing",
    coreSubjects: ["Software Engineering", "Cloud Computing", "Database Management", "Web Technologies"],
    defaultRoleIds: ["cloud-engineer", "full-stack-developer", "software-developer", "qa-engineer", "cybersecurity-analyst"]
  },
  {
    id: "aids",
    name: "Artificial Intelligence and Data Science (AI & DS)",
    shortName: "AI & DS",
    code: "AI & DS",
    icon: "BrainCircuit",
    description: "Machine learning models, deep learning frameworks, mathematical statistics, big data pipelines, and NLP.",
    activeStudents: "3,100+ preparing",
    coreSubjects: ["Machine Learning & Deep Learning", "Probability & Linear Algebra", "Data Mining", "Data Structures"],
    defaultRoleIds: ["ai-ml-engineer", "data-scientist", "data-analyst", "software-developer"]
  },
  {
    id: "mech",
    name: "Mechanical Engineering",
    shortName: "Mechanical",
    code: "MECH",
    icon: "Settings",
    description: "Thermodynamics, mechanical component design, CAD/CAM modeling, robotics kinematics, and fluid mechanics.",
    activeStudents: "2,200+ preparing",
    coreSubjects: ["Mechanics of Materials", "CAD/SolidWorks", "Fluid Dynamics", "Manufacturing Tech"],
    defaultRoleIds: ["mechanical-design-engineer", "cad-engineer", "production-engineer"]
  },
  {
    id: "bme",
    name: "Biomedical Engineering",
    shortName: "Biomedical",
    code: "BME",
    icon: "Activity",
    description: "Medical instrumentation, bio-sensors, clinical device imaging, physiological telemetry, and healthcare systems.",
    activeStudents: "1,150+ preparing",
    coreSubjects: ["Biomedical Instrumentation", "Medical Imaging & Signals", "Biomaterials", "Clinical Engineering"],
    defaultRoleIds: ["biomedical-engineer", "clinical-application-specialist"]
  },
  {
    id: "ece",
    name: "Electronics and Communication Engineering (ECE)",
    shortName: "ECE",
    code: "ECE",
    icon: "Radio",
    description: "Microcontrollers, embedded firmware, VLSI architecture, wireless communication, and signal processing.",
    activeStudents: "3,800+ preparing",
    coreSubjects: ["Embedded C/C++", "VLSI Design & Verilog", "Digital Signal Processing", "Microprocessors"],
    defaultRoleIds: ["embedded-engineer", "software-developer", "cloud-engineer"]
  },
  {
    id: "eee",
    name: "Electrical and Electronics Engineering (EEE)",
    shortName: "EEE",
    code: "EEE",
    icon: "Zap",
    description: "Power grids, power electronics, EV drive control systems, industrial automation, and micro-controllers.",
    activeStudents: "1,900+ preparing",
    coreSubjects: ["Power Systems & Grid", "Control Engineering", "Power Electronics", "Microcontrollers"],
    defaultRoleIds: ["embedded-engineer", "production-engineer", "software-developer"]
  },
  {
    id: "civil",
    name: "Civil Engineering",
    shortName: "Civil",
    code: "CIVIL",
    icon: "Building2",
    description: "Structural design, BIM coordination, geotechnical engineering, urban transport systems, and project estimation.",
    activeStudents: "1,400+ preparing",
    coreSubjects: ["Structural Mechanics", "AutoCAD & BIM", "Geotechnical Engineering", "Construction Management"],
    defaultRoleIds: ["cad-engineer", "production-engineer"]
  },
  {
    id: "other",
    name: "Other Engineering & Interdisciplinary",
    shortName: "Other",
    code: "OTHER",
    icon: "Compass",
    description: "Chemical, Aerospace, Industrial, Metallurgy, Biotechnology, and Interdisciplinary dual-degree tracks.",
    activeStudents: "1,850+ preparing",
    coreSubjects: ["Engineering Mathematics", "Problem Solving", "Systems Engineering", "Applied Computing"],
    defaultRoleIds: ["software-developer", "data-analyst", "business-analyst", "technical-support-engineer"]
  }
];

// 2. EXTENSIVE CAREER ROLE CATALOG (20+ ROLES)
export const careerRoles = [
  {
    id: "software-developer",
    title: "Software Developer",
    category: "Software & Web Development",
    avgPackage: "₹9 - ₹22 LPA",
    demandLevel: "Very High",
    difficulty: "Medium-Hard",
    recommendedDepts: ["cse", "it", "aids", "ece"],
    description: "Design, build, and test software applications, algorithms, and modular enterprise systems with robust code quality.",
    coreSkills: ["Java or C++", "Data Structures & Algorithms", "Object-Oriented Programming (OOP)", "SQL Databases", "Git & Unit Testing"],
    preparationCategories: [
      { name: "Algorithms & Problem Solving", weight: "40%" },
      { name: "Core CS (OS, DBMS, Networks)", weight: "30%" },
      { name: "Object Oriented Design & Clean Code", weight: "20%" },
      { name: "Behavioral & STAR Communication", weight: "10%" }
    ],
    companiesHiring: ["Amazon", "Microsoft", "TCS Digital", "Infosys SP", "Cisco", "Oracle"]
  },
  {
    id: "frontend-developer",
    title: "Frontend Developer",
    category: "Software & Web Development",
    avgPackage: "₹8 - ₹18 LPA",
    demandLevel: "High",
    difficulty: "Medium",
    recommendedDepts: ["cse", "it", "other"],
    description: "Build engaging, responsive, and high-performance client-side web interfaces with modern JavaScript and component architecture.",
    coreSkills: ["HTML5 / Modern CSS", "JavaScript (ES6+)", "React or Vue", "State Management", "REST API Integration", "Web Performance"],
    preparationCategories: [
      { name: "JavaScript Core & Async Patterns", weight: "35%" },
      { name: "React Ecosystem & Hooks", weight: "35%" },
      { name: "CSS Architecture & Web Vitals", weight: "15%" },
      { name: "Frontend Mock Technical Rounds", weight: "15%" }
    ],
    companiesHiring: ["Swiggy", "Razorpay", "Flipkart", "Cred", "PhonePe", "Zoho"]
  },
  {
    id: "backend-developer",
    title: "Backend Developer",
    category: "Software & Web Development",
    avgPackage: "₹10 - ₹24 LPA",
    demandLevel: "Very High",
    difficulty: "Hard",
    recommendedDepts: ["cse", "it", "aids"],
    description: "Engineer scalable server-side microservices, secure RESTful APIs, distributed message queues, and low-latency database queries.",
    coreSkills: ["Java Spring or Node.js", "Relational & NoSQL DBs", "REST / GraphQL APIs", "Microservices Architecture", "Caching (Redis)", "Docker"],
    preparationCategories: [
      { name: "Backend Architecture & REST APIs", weight: "35%" },
      { name: "Database Indexing & Query Tuning", weight: "30%" },
      { name: "Concurrency & Distributed Caching", weight: "20%" },
      { name: "System Design Interviews", weight: "15%" }
    ],
    companiesHiring: ["Google", "Atlassian", "Uber", "Salesforce", "Morgan Stanley"]
  },
  {
    id: "full-stack-developer",
    title: "Full-Stack Developer",
    category: "Software & Web Development",
    avgPackage: "₹11 - ₹26 LPA",
    demandLevel: "Very High",
    difficulty: "Hard",
    recommendedDepts: ["cse", "it", "aids"],
    description: "Bridge client and server by developing end-to-end full-stack architectures, responsive UIs, robust backend services, and cloud deployments.",
    coreSkills: ["React / Next.js", "Node.js or Java Spring", "SQL & MongoDB", "REST APIs", "System Design Basics", "Cloud Deployment"],
    preparationCategories: [
      { name: "Full-Stack End-to-End Projects", weight: "30%" },
      { name: "DSA & Problem Solving", weight: "30%" },
      { name: "System Design & Scaling", weight: "25%" },
      { name: "HR & Behavioral Rounds", weight: "15%" }
    ],
    companiesHiring: ["Amazon", "Flipkart", "Paytm", "Accenture Advanced", "Oracle"]
  },
  {
    id: "qa-engineer",
    title: "QA Engineer / Software Development Engineer in Test (SDET)",
    category: "Software & Web Development",
    avgPackage: "₹7 - ₹16 LPA",
    demandLevel: "High",
    difficulty: "Medium",
    recommendedDepts: ["cse", "it", "ece", "other"],
    description: "Design automated test suites, end-to-end regression frameworks, performance load benchmarks, and CI/CD quality gates.",
    coreSkills: ["Java or Python", "Selenium / Playwright", "API Testing (Postman/RestAssured)", "CI/CD Integration", "Test Case Design", "Performance Testing"],
    preparationCategories: [
      { name: "Test Automation Frameworks", weight: "35%" },
      { name: "Coding & Scripting Fundamentals", weight: "30%" },
      { name: "API & Performance Testing", weight: "20%" },
      { name: "Agile Quality Processes", weight: "15%" }
    ],
    companiesHiring: ["BrowserStack", "Thoughtworks", "Infosys", "Wipro", "Qualcomm"]
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    category: "Data & Artificial Intelligence",
    avgPackage: "₹7 - ₹15 LPA",
    demandLevel: "High",
    difficulty: "Medium",
    recommendedDepts: ["aids", "cse", "it"],
    description: "Synthesize business telemetry into interactive visual executive dashboards, data models, and statistical insights.",
    coreSkills: ["Advanced SQL", "Power BI or Tableau", "Python (Pandas/NumPy)", "Excel Financial/Stats", "Data Cleaning", "Business KPIs"],
    preparationCategories: [
      { name: "Advanced SQL & Window Functions", weight: "40%" },
      { name: "Dashboarding & Visual Storytelling", weight: "30%" },
      { name: "Python Exploratory Data Analysis", weight: "20%" },
      { name: "Case Studies & Product Sense", weight: "10%" }
    ],
    companiesHiring: ["Deloitte", "EY", "American Express", "Mu Sigma", "Zomato", "Fractal"]
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    category: "Data & Artificial Intelligence",
    avgPackage: "₹12 - ₹25 LPA",
    demandLevel: "Very High",
    difficulty: "Hard",
    recommendedDepts: ["aids", "cse", "it"],
    description: "Formulate hypothesis tests, statistical predictive models, recommendation systems, and multivariate regression engines.",
    coreSkills: ["Python or R", "Statistical Modeling", "Machine Learning (Scikit-Learn)", "SQL & BigQuery", "Feature Engineering", "A/B Testing"],
    preparationCategories: [
      { name: "Statistical Theory & Probability", weight: "35%" },
      { name: "ML Algorithms & Optimization", weight: "35%" },
      { name: "Python Data Science Stack", weight: "20%" },
      { name: "Product Metrics & Experimentation", weight: "10%" }
    ],
    companiesHiring: ["Walmart Global Tech", "Swiggy", "IBM", "Tiger Analytics", "Flipkart"]
  },
  {
    id: "ai-ml-engineer",
    title: "AI / Machine Learning Engineer",
    category: "Data & Artificial Intelligence",
    avgPackage: "₹14 - ₹30 LPA",
    demandLevel: "Extremely High",
    difficulty: "Hard",
    recommendedDepts: ["aids", "cse", "it", "ece"],
    description: "Train deep neural networks, fine-tune Large Language Models (LLMs), build vector search pipelines, and deploy inference microservices.",
    coreSkills: ["Python", "PyTorch or TensorFlow", "Transformers & LLMs", "Vector DBs (Pinecone/Chroma)", "Data Pipelines", "Model Deployment (ONNX/FastAPI)"],
    preparationCategories: [
      { name: "Deep Learning & Neural Architectures", weight: "35%" },
      { name: "LLM Fine-Tuning & Prompt Engineering", weight: "25%" },
      { name: "DSA & Algorithmic Rigor", weight: "25%" },
      { name: "MLOps & API Deployment", weight: "15%" }
    ],
    companiesHiring: ["Nvidia", "Adobe", "Microsoft Research", "JPMorgan Chase", "Qualcomm"]
  },
  {
    id: "cybersecurity-analyst",
    title: "Cybersecurity Analyst",
    category: "Security & Infrastructure",
    avgPackage: "₹8 - ₹19 LPA",
    demandLevel: "Very High",
    difficulty: "Medium-Hard",
    recommendedDepts: ["it", "cse", "ece", "other"],
    description: "Protect digital infrastructure, detect network intrusion threats, audit security compliance, and execute vulnerability assessments.",
    coreSkills: ["Network Security & Protocols", "Ethical Hacking / Penetration Testing", "SIEM Tools (Splunk)", "Linux Hardening", "Cryptography Basics", "OWASP Top 10"],
    preparationCategories: [
      { name: "Network Security & Protocols", weight: "35%" },
      { name: "Threat Analysis & OWASP Standards", weight: "30%" },
      { name: "Linux Administration & Scripting", weight: "20%" },
      { name: "Compliance & Incident Response", weight: "15%" }
    ],
    companiesHiring: ["Palo Alto Networks", "CrowdStrike", "Cisco", "EY Cyber", "Wipro Security"]
  },
  {
    id: "cloud-engineer",
    title: "Cloud & DevOps Engineer",
    category: "Security & Infrastructure",
    avgPackage: "₹10 - ₹22 LPA",
    demandLevel: "Very High",
    difficulty: "Medium-Hard",
    recommendedDepts: ["it", "cse", "ece"],
    description: "Architect automated CI/CD deployment pipelines, manage containerized cloud infrastructure, and maintain 99.99% system uptime.",
    coreSkills: ["AWS, Azure, or GCP", "Docker & Kubernetes", "CI/CD (GitHub Actions/Jenkins)", "Infrastructure as Code (Terraform)", "Linux Bash Scripting", "Monitoring (Prometheus)"],
    preparationCategories: [
      { name: "Cloud Architecture & Services", weight: "35%" },
      { name: "Containerization & Orchestration", weight: "30%" },
      { name: "CI/CD & Scripting Automation", weight: "20%" },
      { name: "Site Reliability & Monitoring", weight: "15%" }
    ],
    companiesHiring: ["Amazon Web Services", "Microsoft Azure", "Siemens", "Capgemini", "SAP Labs"]
  },
  {
    id: "ui-ux-designer",
    title: "UI / UX Designer",
    category: "Design & Product",
    avgPackage: "₹7 - ₹16 LPA",
    demandLevel: "High",
    difficulty: "Medium",
    recommendedDepts: ["cse", "it", "other"],
    description: "Craft intuitive, accessible user journeys, responsive design systems, interactive Figma prototypes, and user research frameworks.",
    coreSkills: ["Figma & Wireframing", "User Research & Usability Testing", "Design Systems & Tokens", "Interaction Design", "Responsive Layouts", "Accessibility (WCAG)"],
    preparationCategories: [
      { name: "Figma UI Prototyping & Systems", weight: "40%" },
      { name: "UX Research & Information Architecture", weight: "30%" },
      { name: "Design Critique & Portfolio Presentation", weight: "20%" },
      { name: "Frontend Collaboration Knowledge", weight: "10%" }
    ],
    companiesHiring: ["Swiggy", "Razorpay", "Cred", "Zoho", "Urban Company", "Infosys Experience"]
  },
  {
    id: "digital-marketer",
    title: "Digital Marketer & Growth Strategist",
    category: "Business & Growth",
    avgPackage: "₹5.5 - ₹12 LPA",
    demandLevel: "Medium-High",
    difficulty: "Beginner-Medium",
    recommendedDepts: ["it", "other"],
    description: "Drive user acquisition through technical SEO, performance advertising campaigns, content strategies, and conversion rate funnels.",
    coreSkills: ["Search Engine Optimization (SEO)", "Google Analytics 4", "Performance Ads (Meta/Google)", "Content Marketing", "Email Funnels", "A/B Testing"],
    preparationCategories: [
      { name: "Technical SEO & Web Analytics", weight: "35%" },
      { name: "Performance Marketing & Funnels", weight: "35%" },
      { name: "Growth Experimentation Frameworks", weight: "20%" },
      { name: "Spoken Pitch & Communication", weight: "10%" }
    ],
    companiesHiring: ["Zomato", "Nykaa", "Dentsu", "Byju's", "GrowthSchool"]
  },
  {
    id: "business-analyst",
    title: "Business Analyst / Product Analyst",
    category: "Business & Growth",
    avgPackage: "₹8 - ₹17 LPA",
    demandLevel: "High",
    difficulty: "Medium",
    recommendedDepts: ["cse", "it", "aids", "other"],
    description: "Bridge engineering and business stakeholders by defining product requirements, workflow diagrams, metric roadmaps, and ROI models.",
    coreSkills: ["Business Requirement Documents (BRD)", "SQL for Analytics", "Process Flow (UML/BPMN)", "Jira & Agile Sprint Planning", "Financial Metrics", "Stakeholder Communication"],
    preparationCategories: [
      { name: "Business Problem Structuring & Case Studies", weight: "35%" },
      { name: "Data Extraction & SQL Queries", weight: "30%" },
      { name: "Agile Requirements & Documentation", weight: "20%" },
      { name: "Executive Presentation Skills", weight: "15%" }
    ],
    companiesHiring: ["McKinsey Knowledge", "Deloitte", "KPMG", "Flipkart", "Accenture"]
  },
  {
    id: "technical-support-engineer",
    title: "Technical Support / Solutions Engineer",
    category: "Business & Growth",
    avgPackage: "₹6 - ₹13 LPA",
    demandLevel: "High",
    difficulty: "Beginner-Medium",
    recommendedDepts: ["it", "cse", "ece", "eee", "mech", "other"],
    description: "Provide enterprise client technical troubleshooting, API diagnostics, database incident resolution, and client success enablement.",
    coreSkills: ["Linux CLI & Networking", "SQL Query Debugging", "API Troubleshooting", "Customer Empathy & Communication", "SLA Incident Management", "Cloud Services Basics"],
    preparationCategories: [
      { name: "System Debugging & API Diagnostics", weight: "35%" },
      { name: "Database & Log Inspection", weight: "30%" },
      { name: "Customer Communication & De-escalation", weight: "25%" },
      { name: "Networking Fundamentals", weight: "10%" }
    ],
    companiesHiring: ["Salesforce", "Freshworks", "Zoho", "Dell Technologies", "Oracle Support"]
  },
  {
    id: "mechanical-design-engineer",
    title: "Mechanical Design Engineer",
    category: "Core Engineering & Manufacturing",
    avgPackage: "₹6.5 - ₹14 LPA",
    demandLevel: "Medium-High",
    difficulty: "Medium-Hard",
    recommendedDepts: ["mech", "other"],
    description: "Design mechanical assemblies, structural chassis, thermal enclosures, and kinematic components using 3D parametric CAD modeling.",
    coreSkills: ["SolidWorks / CATIA / Creo", "Geometric Dimensioning & Tolerancing (GD&T)", "Finite Element Analysis (FEA)", "Design for Manufacturing (DFM)", "Material Science", "Mechanical Vibrations"],
    preparationCategories: [
      { name: "3D CAD Modeling & Assembly", weight: "35%" },
      { name: "Structural FEA & Stress Analysis", weight: "30%" },
      { name: "GD&T & Manufacturing Tolerances", weight: "20%" },
      { name: "Core Thermodynamics & Strength of Materials", weight: "15%" }
    ],
    companiesHiring: ["Tata Motors", "Mahindra & Mahindra", "L&T", "Bosch", "Cummins", "Boeing India"]
  },
  {
    id: "cad-engineer",
    title: "CAD Engineer / Draftsman",
    category: "Core Engineering & Manufacturing",
    avgPackage: "₹5.5 - ₹12 LPA",
    demandLevel: "High",
    difficulty: "Medium",
    recommendedDepts: ["mech", "civil", "other"],
    description: "Create precision engineering blueprints, architectural layouts, HVAC ducting, and piping schematics conforming to ISO and BIS standards.",
    coreSkills: ["AutoCAD 2D/3D", "Revit BIM or SolidWorks", "Engineering Drawing Standards", "Sheet Metal Design", "BOM (Bill of Materials)", "Quality Inspection"],
    preparationCategories: [
      { name: "AutoCAD & Parametric Drafting", weight: "40%" },
      { name: "Geometric Tolerancing & Standards", weight: "30%" },
      { name: "Bill of Materials & Production Drawings", weight: "20%" },
      { name: "Core Engineering Mechanics", weight: "10%" }
    ],
    companiesHiring: ["L&T Construction", "Shapoorji Pallonji", "Tata Consulting Engineers", "Atkins", "Alstom"]
  },
  {
    id: "production-engineer",
    title: "Production & Quality Engineer",
    category: "Core Engineering & Manufacturing",
    avgPackage: "₹6 - ₹13 LPA",
    demandLevel: "High",
    difficulty: "Medium",
    recommendedDepts: ["mech", "eee", "civil", "other"],
    description: "Supervise industrial assembly lines, minimize manufacturing defects using Six Sigma, schedule supply logistics, and ensure plant safety.",
    coreSkills: ["Six Sigma & Lean Manufacturing", "Root Cause Analysis (5-Why/Fishbone)", "Quality Control & Metrology", "CNC / PLC Automation", "Supply Chain Operations", "Industrial Safety"],
    preparationCategories: [
      { name: "Lean Manufacturing & Six Sigma", weight: "35%" },
      { name: "Manufacturing Processes & Metrology", weight: "30%" },
      { name: "Root Cause Problem Solving", weight: "20%" },
      { name: "Industrial Management & Communication", weight: "15%" }
    ],
    companiesHiring: ["Maruti Suzuki", "Hero MotoCorp", "JSW Steel", "Foxconn India", "Schneider Electric"]
  },
  {
    id: "biomedical-engineer",
    title: "Biomedical Equipment Engineer",
    category: "Biomedical & Healthcare Tech",
    avgPackage: "₹6 - ₹14 LPA",
    demandLevel: "Medium-High",
    difficulty: "Medium-Hard",
    recommendedDepts: ["bme", "ece", "eee"],
    description: "Design, test, calibrate, and maintain critical hospital healthcare machinery such as patient monitors, ventilators, and dialysis systems.",
    coreSkills: ["Biomedical Sensors & Calibration", "Medical Device Safety (IEC 60601)", "Physiological Signal Processing", "Microcontroller Hardware", "Hospital Equipment Maintenance"],
    preparationCategories: [
      { name: "Biomedical Instrumentation & Circuitry", weight: "40%" },
      { name: "Regulatory Standards & Medical Safety", weight: "25%" },
      { name: "Signal Processing & Sensor Interfacing", weight: "25%" },
      { name: "Clinical Case Studies", weight: "10%" }
    ],
    companiesHiring: ["GE Healthcare", "Philips Healthcare", "Siemens Healthineers", "Mindray", "Apollo Hospitals"]
  },
  {
    id: "clinical-application-specialist",
    title: "Clinical Application Specialist",
    category: "Biomedical & Healthcare Tech",
    avgPackage: "₹7 - ₹15 LPA",
    demandLevel: "Medium",
    difficulty: "Medium",
    recommendedDepts: ["bme", "other"],
    description: "Train radiologists and surgical teams on advanced medical imaging systems (MRI, CT, Ultrasound) and optimize clinical scan protocols.",
    coreSkills: ["MRI & CT Imaging Protocols", "Clinical Radiology Workflow", "Physician Training & Demos", "DICOM & PACS Systems", "Troubleshooting High-Tech Hardware", "Medical Communication"],
    preparationCategories: [
      { name: "Medical Imaging Physics & Protocols", weight: "40%" },
      { name: "DICOM PACS Integration & Software", weight: "25%" },
      { name: "Clinical Demonstration & Training", weight: "25%" },
      { name: "Healthcare Workflow Analysis", weight: "10%" }
    ],
    companiesHiring: ["Siemens Healthineers", "GE Healthcare", "Canon Medical", "Boston Scientific", "Medtronic"]
  },
  {
    id: "embedded-engineer",
    title: "Embedded Systems Engineer",
    category: "Electronics & Embedded",
    avgPackage: "₹8 - ₹19 LPA",
    demandLevel: "Very High",
    difficulty: "Hard",
    recommendedDepts: ["ece", "eee", "cse", "it"],
    description: "Write low-level firmware in Embedded C for ARM microcontrollers, program Real-Time Operating Systems (RTOS), and configure hardware buses.",
    coreSkills: ["Embedded C & C++", "ARM Cortex Architecture", "RTOS (FreeRTOS)", "Communication Buses (I2C, SPI, UART, CAN)", "PCB Debugging & Oscilloscopes", "Device Drivers"],
    preparationCategories: [
      { name: "Embedded C & Memory Management", weight: "35%" },
      { name: "Microcontroller Peripherals & RTOS", weight: "35%" },
      { name: "Communication Protocols & Hardware Debug", weight: "20%" },
      { name: "Hardware Interfacing Interviews", weight: "10%" }
    ],
    companiesHiring: ["Texas Instruments", "Qualcomm", "Bosch India", "Continental", "NXP Semiconductors", "Tata Elxsi"]
  }
];

// Helper to determine if a career selection is cross-disciplinary
export const checkCrossDisciplinary = (deptId, roleId) => {
  const role = careerRoles.find((r) => r.id === roleId);
  if (!role) return { isCross: false, pathwayNotes: "" };
  const isDirectFit = role.recommendedDepts.includes(deptId);
  return {
    isCross: !isDirectFit,
    pathwayNotes: isDirectFit
      ? "Direct Branch Alignment: Core curriculum maps seamlessly into placement interview rounds."
      : "Cross-Disciplinary Pathway: Your technical curriculum includes a transition bridge module to cover prerequisite fundamentals."
  };
};

export const dashboardOverview = {
  stats: {
    interviewsCompleted: { value: 14, change: "+3 this week", trend: "up" },
    communicationScore: { value: "86/100", change: "+4 pts improved", trend: "up" },
    technicalScore: { value: "92/100", change: "Top 8% percentile", trend: "up" },
    tasksCompleted: { value: "28/35", change: "80% milestone", trend: "neutral" },
    weeklyStreak: { value: "5 Days", change: "Personal best record!", trend: "up" }
  },
  weeklyActivity: [
    { day: "Mon", hours: 2.5, questions: 4 },
    { day: "Tue", hours: 3.0, questions: 6 },
    { day: "Wed", hours: 1.5, questions: 2 },
    { day: "Thu", hours: 4.0, questions: 7 },
    { day: "Fri", hours: 3.5, questions: 5 },
    { day: "Sat", hours: 5.0, questions: 9 },
    { day: "Sun", hours: 2.0, questions: 3 }
  ],
  upcomingInterviews: [
    {
      id: "up_1",
      role: "Mock Round 2",
      type: "Technical Assessment",
      interviewer: "AI Senior Staff Coach",
      scheduledDate: "Tomorrow at 4:30 PM",
      duration: "45 mins",
      badge: "Scheduled"
    },
    {
      id: "up_2",
      role: "Behavioral HR Simulation",
      type: "STAR Leadership Principles",
      interviewer: "AI Executive Recruiter",
      scheduledDate: "Friday at 11:00 AM",
      duration: "30 mins",
      badge: "Upcoming"
    }
  ],
  recentFeedback: [
    {
      id: "rf_1",
      title: "Architecture & Core Concepts",
      score: 94,
      category: "Technical Round",
      date: "Yesterday",
      verdict: "Strong Hire",
      highlights: "Clear explanation of architectural trade-offs, modularity, and clean implementation."
    },
    {
      id: "rf_2",
      title: "Behavioral: Conflict in Agile Team Project",
      score: 82,
      category: "HR & Communication",
      date: "3 days ago",
      verdict: "Hire",
      highlights: "Excellent STAR structure. Advised to reduce filler words in opening 30 seconds."
    },
    {
      id: "rf_3",
      title: "Data Structures & Complex Queries",
      score: 89,
      category: "Problem Solving",
      date: "5 days ago",
      verdict: "Strong Hire",
      highlights: "Optimal algorithm formulation provided within 18 minutes."
    }
  ],
  dailyChallenge: {
    title: "Optimize Query Indexing & Cache Invalidation",
    difficulty: "Medium",
    category: "System Design",
    timeEst: "25 mins",
    rewardPoints: "+50 XP"
  }
};

export const questionBankData = [
  {
    id: "q_1",
    category: "Technical (DSA)",
    topic: "Arrays & Two Pointers",
    title: "Trapping Rain Water",
    difficulty: "Hard",
    companies: ["Google", "Amazon", "Microsoft"],
    frequency: "95% in On-Campus Drives",
    summary: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    approach: "Two-pointer approach maintaining left_max and right_max, computing trapped water in O(N) time and O(1) auxiliary space.",
    keyConcepts: ["Two Pointers", "Dynamic Programming", "Monotonic Stack"]
  },
  {
    id: "q_2",
    category: "Technical (DSA)",
    topic: "Binary Trees & BST",
    title: "Lowest Common Ancestor of a Binary Tree",
    difficulty: "Medium",
    companies: ["Amazon", "Meta", "Flipkart"],
    frequency: "90% in On-Campus Drives",
    summary: "Given a binary tree, find the lowest common ancestor (LCA) of two given nodes p and q in the tree.",
    approach: "Recursive post-order traversal: if both left and right subtrees return non-null, the current root is the LCA.",
    keyConcepts: ["DFS Traversal", "Recursion", "Binary Trees"]
  },
  {
    id: "q_3",
    category: "Technical (Core CS)",
    topic: "Operating Systems",
    title: "Explain Deadlock Conditions and Deadlock Prevention",
    difficulty: "Medium",
    companies: ["Cisco", "Qualcomm", "Oracle"],
    frequency: "88% in Core Rounds",
    summary: "Detail the Coffman conditions required for deadlock to occur and describe practical strategies to prevent or avoid deadlocks (Banker's Algorithm).",
    approach: "Mutual exclusion, Hold and Wait, No Preemption, Circular Wait. Break circular wait by ordering resource requests.",
    keyConcepts: ["Coffman Conditions", "Banker's Algorithm", "Semaphores & Mutex"]
  },
  {
    id: "q_4",
    category: "Technical (Core CS)",
    topic: "DBMS & SQL",
    title: "Difference between Clustered and Non-Clustered Indexes with B+ Trees",
    difficulty: "Medium",
    companies: ["Morgan Stanley", "Goldman Sachs", "TCS Digital"],
    frequency: "92% in Technical Rounds",
    summary: "How do database storage engines use B+ Tree indexes? Contrast clustered index row storage vs secondary indexes.",
    approach: "A clustered index physically sorts row data at the leaf nodes (only 1 per table). Non-clustered stores pointers to data rows.",
    keyConcepts: ["B+ Tree Leaves", "Index Scanning", "ACID Properties"]
  },
  {
    id: "q_5",
    category: "Web & Full-Stack",
    topic: "React & Frontend",
    title: "Explain React 18/19 Concurrent Rendering and State Batching",
    difficulty: "Medium",
    companies: ["Razorpay", "Swiggy", "Uber"],
    frequency: "85% in Frontend Drives",
    summary: "What problem does concurrent rendering solve? How does automatic batching differ in promises/timeouts compared to earlier React versions?",
    approach: "Concurrent mode allows React to interrupt, pause, or discard rendering of non-urgent updates via useTransition and useDeferredValue.",
    keyConcepts: ["Fiber Architecture", "Automatic Batching", "Transitions"]
  },
  {
    id: "q_6",
    category: "System Design",
    topic: "High-Level Architecture",
    title: "Design a Scalable URL Shortener (Bitly)",
    difficulty: "Medium",
    companies: ["Amazon", "Flipkart", "Atlassian"],
    frequency: "90% in Product Firms",
    summary: "Design a high-throughput system capable of generating 6-character unique hashes, handling 100M redirects/day with low latency.",
    approach: "Base62 encoding of distributed unique ID (Snowflake), Redis caching layer with LRU eviction, and NoSQL key-value store for O(1) lookups.",
    keyConcepts: ["Base62 Hashing", "Redis Caching", "Read-Heavy Scaling"]
  },
  {
    id: "q_7",
    category: "HR & Behavioral",
    topic: "STAR Leadership",
    title: "Tell me about a time you faced a serious technical bug during a deadline",
    difficulty: "Easy",
    companies: ["Microsoft", "Google", "Infosys", "Wipro"],
    frequency: "98% in HR / Managerial Rounds",
    summary: "Evaluate the candidate's crisis management, systematic root-cause debugging, communication with stakeholders, and post-mortem mindset.",
    approach: "Structure answer with Situation (hackathon or lab submission), Task (broken API), Action (git bisect, team delegation), and Result (delivered on time, 100% test pass).",
    keyConcepts: ["STAR Method", "Composure", "Team Collaboration"]
  },
  {
    id: "q_8",
    category: "HR & Behavioral",
    topic: "Career Motivation",
    title: "Why do you want to join our engineering team over competitors?",
    difficulty: "Easy",
    companies: ["All Tech Companies"],
    frequency: "100% in Final Rounds",
    summary: "Assess candidate research about the company's product stack, tech culture, and genuine career alignment.",
    approach: "Cite specific engineering blogs, open source contributions, or product scale challenges specific to the employer.",
    keyConcepts: ["Company Alignment", "Product Curiosity", "Long-term Goals"]
  }
];

export const skillGapData = {
  targetRole: "Full-Stack Developer (Tier-1 Product)",
  overallMatchScore: 82,
  benchmarks: [
    {
      skill: "Data Structures & Algorithms",
      studentProficiency: 88,
      marketBenchmark: 90,
      gapLevel: "Minor",
      status: "On Track",
      tips: "Practice DP and Graph variations; current array/tree accuracy is solid."
    },
    {
      skill: "System Design (HLD & LLD)",
      studentProficiency: 62,
      marketBenchmark: 80,
      gapLevel: "High Priority",
      status: "Needs Attention",
      tips: "Focus on caching strategies, load balancing, database sharding, and OOP design patterns."
    },
    {
      skill: "Core Technical Frameworks",
      studentProficiency: 92,
      marketBenchmark: 85,
      gapLevel: "None",
      status: "Exceeds",
      tips: "Strong mastery. Ready for lead questions on custom hooks, performance profiling."
    },
    {
      skill: "Backend & Systems Architecture",
      studentProficiency: 85,
      marketBenchmark: 85,
      gapLevel: "Balanced",
      status: "Meets Standard",
      tips: "Implement message queues (Kafka/RabbitMQ) in your flagship project to stand out."
    },
    {
      skill: "Database & Query Optimization",
      studentProficiency: 76,
      marketBenchmark: 85,
      gapLevel: "Moderate",
      status: "In Progress",
      tips: "Revise EXPLAIN ANALYZE, indexing strategies, and database isolation levels."
    },
    {
      skill: "Spoken English & Behavioral STAR",
      studentProficiency: 86,
      marketBenchmark: 80,
      gapLevel: "None",
      status: "Exceeds",
      tips: "Clear tone and vocabulary. Minimize filler words when answering impromptu questions."
    }
  ],
  recommendedActions: [
    {
      id: "act_1",
      title: "Complete 3 System Design Interactive Scenarios",
      priority: "Urgent",
      estTime: "4 Hours",
      actionText: "Add to Roadmap"
    },
    {
      id: "act_2",
      title: "Review B+ Tree Indexing & Transaction Isolation in DBMS Bank",
      priority: "Medium",
      estTime: "2 Hours",
      actionText: "Practice in Bank"
    },
    {
      id: "act_3",
      title: "Record 2 Behavioral Mock Answers for Tough Conflict Questions",
      priority: "Medium",
      estTime: "1 Hour",
      actionText: "Launch AI Coach"
    }
  ]
};

export const learningRoadmapData = [
  {
    week: "Week 1",
    title: "DSA Fundamentals: Two Pointers, Sliders & Hashing",
    estimatedHours: "12 Hours",
    status: "Completed",
    tasks: [
      { id: "w1_t1", text: "Master 2-Pointer Trapping Rain Water & 3Sum", done: true },
      { id: "w1_t2", text: "Sliding Window Maximum & Longest Substring", done: true },
      { id: "w1_t3", text: "Time & Space Complexity analysis test", done: true }
    ]
  },
  {
    week: "Week 2",
    title: "Recursion, Backtracking & Binary Trees",
    estimatedHours: "14 Hours",
    status: "Completed",
    tasks: [
      { id: "w2_t1", text: "Solve Lowest Common Ancestor & Diameter of Tree", done: true },
      { id: "w2_t2", text: "N-Queens & Word Search Backtracking practice", done: true },
      { id: "w2_t3", text: "Binary Search Tree validation & rebalancing", done: true }
    ]
  },
  {
    week: "Week 3",
    title: "Graphs, BFS/DFS & Dynamic Programming Intro",
    estimatedHours: "15 Hours",
    status: "In Progress",
    tasks: [
      { id: "w3_t1", text: "Topological Sort (Kahn's Algorithm) for course scheduling", done: true },
      { id: "w3_t2", text: "Dijkstra's shortest path with Min-Heap", done: false },
      { id: "w3_t3", text: "0/1 Knapsack & Coin Change DP subproblems", done: false }
    ]
  },
  {
    week: "Week 4",
    title: "Low-Level Design (LLD) & OOP Patterns",
    estimatedHours: "10 Hours",
    status: "To Do",
    tasks: [
      { id: "w4_t1", text: "Design Parking Lot System with SOLID principles", done: false },
      { id: "w4_t2", text: "Implement Factory, Singleton & Observer patterns", done: false },
      { id: "w4_t3", text: "Write clean unit tests with mock dependencies", done: false }
    ]
  },
  {
    week: "Week 5",
    title: "High-Level System Design (HLD) & Scaling",
    estimatedHours: "14 Hours",
    status: "To Do",
    tasks: [
      { id: "w5_t1", text: "Design URL Shortener with Redis caching & partitioning", done: false },
      { id: "w5_t2", text: "Compare SQL vs NoSQL trade-offs (CAP Theorem)", done: false },
      { id: "w5_t3", text: "Load balancing algorithms & reverse proxy setup", done: false }
    ]
  },
  {
    week: "Week 6",
    title: "Core CS: OS Concepts & DBMS Deep-Dive",
    estimatedHours: "12 Hours",
    status: "To Do",
    tasks: [
      { id: "w6_t1", text: "Process synchronization, Semaphores & Deadlock avoidance", done: false },
      { id: "w6_t2", text: "Database normalization (1NF to BCNF) & Index tuning", done: false },
      { id: "w6_t3", text: "TCP 3-way handshake & HTTP/HTTPS SSL handshake", done: false }
    ]
  },
  {
    week: "Week 7",
    title: "Behavioral STAR & Spoken Communication Mastery",
    estimatedHours: "8 Hours",
    status: "To Do",
    tasks: [
      { id: "w7_t1", text: "Draft 5 stories matching Amazon Leadership Principles", done: false },
      { id: "w7_t2", text: "Record 10 communication coach drills with speech feedback", done: false },
      { id: "w7_t3", text: "Practice executive introduction in under 90 seconds", done: false }
    ]
  },
  {
    week: "Week 8",
    title: "Mock Interview Marathons & Company Drill Packs",
    estimatedHours: "16 Hours",
    status: "To Do",
    tasks: [
      { id: "w8_t1", text: "Complete 4 timed full-length technical mock interviews", done: false },
      { id: "w8_t2", text: "Solve top 20 Amazon & Google campus past questions", done: false },
      { id: "w8_t3", text: "Resume line-by-line cross examination rehearsal", done: false }
    ]
  }
];

export const weeklyReportData = {
  weekPeriod: "Oct 22 - Oct 29, 2026",
  hoursLogged: 19.5,
  hoursTarget: 20.0,
  mockInterviewsCompleted: 4,
  questionsSolved: 26,
  communicationAccuracy: "88%",
  technicalAccuracy: "91%",
  speedScore: "Optimal (avg 18m / medium problem)",
  coachRemarks: "Outstanding momentum Aarav! Your technical response structure on algorithms is currently in the top tier. Your communication pace was smooth at 134 words per minute with noticeable reduction in hesitation. In the coming week, prioritize our System Design modules to close the remaining gap for Tier-1 product interviews.",
  highlights: [
    { title: "Strongest Skill", desc: "Dynamic Programming & Trees (96% test accuracy)" },
    { title: "Key Improvement", desc: "Speech clarity improved +12% since last week" },
    { title: "Recommended Focus", desc: "System Design: Database Sharding & Caching" }
  ],
  dayBreakdown: [
    { day: "Mon", dsa: 3, systemDesign: 1, softSkills: 1 },
    { day: "Tue", dsa: 4, systemDesign: 2, softSkills: 0 },
    { day: "Wed", dsa: 2, systemDesign: 0, softSkills: 1 },
    { day: "Thu", dsa: 5, systemDesign: 1, softSkills: 2 },
    { day: "Fri", dsa: 4, systemDesign: 1, softSkills: 1 },
    { day: "Sat", dsa: 6, systemDesign: 2, softSkills: 2 },
    { day: "Sun", dsa: 2, systemDesign: 1, softSkills: 1 }
  ]
};

export const communicationCoachPrompts = [
  {
    id: "comm_1",
    title: "Professional Introduction (Tell Me About Yourself)",
    targetDuration: "90 - 120 seconds",
    description: "Provide a structured introduction highlighting your engineering background, core technical focus, standout project impact, and why you are here.",
    keyPoints: ["Academic foundation", "Flagship tech stack", "Real-world project impact", "Career passion"],
    sampleTranscript: "Hello, I am Aarav Sharma, a final-year student at NIT. Over the past three years, I have specialized in building distributed web systems and responsive React applications. Recently, I built an event ticketing service handling 5,000 concurrent requests with Redis and PostgreSQL. I am eager to contribute my problem-solving and software engineering skills to your engineering organization."
  },
  {
    id: "comm_2",
    title: "Explaining a Difficult Technical Trade-Off",
    targetDuration: "60 - 90 seconds",
    description: "Explain an architectural decision where you had to balance latency vs consistency, or development speed vs scalability.",
    keyPoints: ["The context & constraints", "Alternatives considered", "The rationale chosen", "Measurable outcome"],
    sampleTranscript: "In our final year capstone project, we debated whether to use MongoDB or PostgreSQL for user telemetry. While MongoDB allowed faster schema iterations, we required strict transaction ACID guarantees for financial ledger logs. We chose PostgreSQL with JSONB columns for flexible telemetry, preserving integrity while maintaining sub-50ms query speeds."
  },
  {
    id: "comm_3",
    title: "Handling Project Conflict in an Agile Engineering Team",
    targetDuration: "75 - 100 seconds",
    description: "Describe how you addressed a disagreement regarding code review standards or design patterns within your student team.",
    keyPoints: ["Objectivity over ego", "Data-driven benchmarking", "Active listening", "Consensus and project delivery"],
    sampleTranscript: "During our hackathon, my teammate and I disagreed on whether to use GraphQL or REST for mobile clients. Rather than arguing conceptually, we created a quick prototype testing mobile data payloads. The telemetry showed GraphQL reduced payload sizes by 40% on 3G connections. We aligned unanimously and finished in the top 3."
  }
];
