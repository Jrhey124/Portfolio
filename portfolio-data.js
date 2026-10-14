/*
 * Portfolio content: edit this file to update the website.
 * Keep optional values blank or remove them until they are accurate. Sections with
 * no content are hidden automatically. Put images and documents in an `assets/`
 * folder and use paths such as "assets/resume.pdf" or "assets/project-photo.jpg".
 * Project examples use only descriptions supplied so far; add your own role,
 * technologies, contributions, results, and links when you are ready.
 */
window.portfolioData = {
  profile: {
    name: "John Rhey Pena",
    title: "Computer Engineering student",
    focus: "Cybersecurity · Networking",
    headline: "Computer Engineering student focused on cybersecurity and networks.",
    introduction: "I work across programming, embedded systems, networking, and security. I bring four years of C/C++ experience and a growing interest in backend systems and infrastructure.",
    aboutLead: "I’m studying Computer Engineering, with interests in cybersecurity, networking, embedded systems, and automation.",
    aboutBody: "I have four years of C/C++ programming experience and completed a six-month COESS menteeship program. My project interests include backend engineering, system architecture, and access control.",
    email: "mjrpena@tip.edu.ph",
    location: "",
    targetRoles: ["Cybersecurity", "Backend engineering", "Networking", "DevOps & infrastructure"],
    availability: "",
    graduation: "",
    resume: "",
    photo: "https://media.licdn.com/dms/image/v2/D4E03AQGaQ49UHg8VmA/profile-displayphoto-shrink_200_200/B4EZTls3_aG0AY-/0/1739020534728?e=2147483647&v=beta&t=ffc9JG9mvi31hwDABLdYf47Egwx7vscOkPw49JFv0x4",
    photoFallback: "JP",
    contacts: [
      { label: "Email", text: "mjrpena@tip.edu.ph", url: "mailto:mjrpena@tip.edu.ph?subject=Portfolio%20inquiry", icon: "✉" },
      { label: "LinkedIn", text: "john-rhey-pena", url: "https://www.linkedin.com/in/john-rhey-pena-b10832313/", icon: "in" },
      { label: "GitHub", text: "Jrhey124", url: "https://github.com/Jrhey124", icon: "⌘" }
    ]
  },
  skills: [
    { category: "Cybersecurity", icon: "◇", items: ["Penetration testing"] },
    { category: "Networking", icon: "⌁", items: ["Networking"] },
    { category: "Programming", icon: "{ }", items: ["C", "C++", "Python"] },
    { category: "Systems", icon: "⌘", items: ["Embedded systems", "Automation"] }
  ],
  projects: [
    { name: "CookEat", category: "BACKEND · SELF HOSTING", description: "A food-focused project connected to backend development, self-hosting, and server administration.", icon: "assets/icon-server.svg", role: "", contributions: [], stack: [], architecture: "", outcome: "", image: "", repository: "", demo: "" },
    { name: "MDSystem", category: "SYSTEMS · APIS", description: "A system project connected to architecture, databases, APIs, and real-time systems.", icon: "assets/icon-database.svg", role: "", contributions: [], stack: [], architecture: "", outcome: "", image: "", repository: "", demo: "" },
    { name: "LockMate", category: "ACCESS CONTROL", description: "An access-control project connected to backend development, NFC, and payments.", icon: "assets/icon-access.svg", role: "", contributions: [], stack: [], architecture: "", outcome: "", image: "", repository: "", demo: "" }
  ],
  experience: [
    { title: "C/C++ programming experience", organization: "Personal and academic experience", date: "4 years", description: "Four years of experience programming in C and C++.", type: "experience" },
    { title: "Menteeship Program", organization: "COESS", date: "6 months", description: "Participated in a six-month menteeship program of COESS.", type: "experience" }
  ],
  education: [], // Example: { degree, school, location, date, details: [] }
  awards: [
    { title: "First Runner-Up — ICPeP C Programming Competition", organization: "ICPeP", date: "2024", description: "Placed first runner-up in the 2024 C Programming Competition." }
  ],
  certifications: [], // Example: { title, issuer, date, credentialUrl }
  labs: [], // Example: { title, summary, tools: [], url }
  infrastructure: [] // Example: { title, summary, tools: [], url }
};
