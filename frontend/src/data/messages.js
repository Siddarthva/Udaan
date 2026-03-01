/**
 * Collaboration & Messaging Data
 */

export const DIRECT_MESSAGES = [
  {
    id: "msg_1",
    from: "usr_2", // Vikram (Mentor)
    to: "usr_1",   // Ananya (Innovator)
    content: "Ananya, I've reviewed your latest tech specs for AgriDrone. Let's schedule a call tomorrow at 10 AM.",
    timestamp: "2026-03-01T10:00:00Z",
    status: "read"
  },
  {
    id: "msg_2",
    from: "usr_3", // Sponsor
    to: "usr_1",   // Innovator
    content: "Hi Ananya, our investment committee has moved your project to the Due Diligence stage. Please upload your Q4 audit.",
    timestamp: "2026-03-01T14:30:00Z",
    status: "unread"
  }
];

export const PROJECT_THREADS = [
  {
    projectId: "proj_1",
    threads: [
      { id: "th_1", author: "Rahul Das", content: "Working on the propeller stability issue.", replies: 3 }
    ]
  }
];
