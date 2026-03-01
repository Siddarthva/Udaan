/**
 * Global Projects Repository
 * Stages: Idea, Prototype, MVP, Pilot, Scaling, Commercialization
 */

export const GLOBAL_PROJECTS = [
  {
    id: "proj_1",
    name: "AgriDrone AI",
    domain: "AgriTech",
    stage: "Pilot",
    progress: 78,
    founder: "Ananya Sharma",
    location: "Pune, India",
    fundingSought: "₹25 L",
    traction: "350 Farms Onboarded",
    innovationScore: 92,
    risk: "Low",
    impact: "Social & Environmental",
    description: "Autonomous drone network for precision pesticide delivery and soil analysis.",
    milestones: [
      { title: "HW v2.0 Assembly", status: "Completed", date: "2026-01-10" },
      { title: "SLA Draft with State Gov", status: "In Progress", date: "2026-03-20" },
      { title: "Q3 Field Trials", status: "Upcoming", date: "2026-06-15" }
    ],
    team: [
      { name: "Ananya Sharma", role: "CEO", img: "https://i.pravatar.cc/150?u=ananya" },
      { name: "Rahul Das", role: "CTO", img: "https://i.pravatar.cc/150?u=rahul" }
    ]
  },
  {
    id: "proj_2",
    name: "MedAssist AI",
    domain: "HealthTech",
    stage: "MVP",
    progress: 62,
    founder: "Dr. Vikram Seth",
    location: "Bangalore, India",
    fundingSought: "₹50 L",
    traction: "2 Clinic Partners",
    innovationScore: 88,
    risk: "Medium",
    impact: "Health & Wellbeing",
    description: "AI-driven diagnostic layer for rural clinics without permanent doctors.",
    milestones: [
      { title: "Core ML Training", status: "Completed", date: "2026-02-01" },
      { title: "Beta Prototype", status: "Delayed", date: "2026-02-15" },
      { title: "Regulatory Approval", status: "Upcoming", date: "2026-05-10" }
    ],
    team: [
      { name: "Vikram Seth", role: "Founder", img: "https://i.pravatar.cc/150?u=vikram" }
    ]
  },
  {
    id: "proj_3",
    name: "Eco-Grow Systems",
    domain: "Sustainability",
    stage: "Scaling",
    progress: 94,
    founder: "Sarah Khan",
    location: "Hyderabad, India",
    fundingSought: "₹1.2 Cr",
    traction: "8 Corporate Clients",
    innovationScore: 76,
    risk: "Low",
    impact: "Environment",
    description: "Circular hydroponic systems for corporate campuses.",
    milestones: [
      { title: "Client Expansion", status: "In Progress", date: "2026-04-01" }
    ],
    team: [
      { name: "Sarah Khan", role: "CEO", img: "https://i.pravatar.cc/150?u=sarah" }
    ]
  },
  {
    id: "proj_4",
    name: "FinGuard AI",
    domain: "FinTech",
    stage: "Scaling",
    progress: 85,
    founder: "Zaid Ali",
    location: "Mumbai, India",
    fundingSought: "₹3 Cr",
    traction: "1.2k Active Users",
    innovationScore: 94,
    risk: "High",
    impact: "Financial Inclusion",
    description: "Micro-insurance engine for gig workers.",
    milestones: [
      { title: "Round A Closing", status: "In Progress", date: "2026-03-30" }
    ],
    team: [
      { name: "Zaid Ali", role: "CEO", img: "https://i.pravatar.cc/150?u=zaid" }
    ]
  }
];

export const PROJECT_STAGES = ["Idea", "Prototype", "MVP", "Pilot", "Scaling", "Commercialization"];
