export const PURPOSES = [
  "Hackathon",
  "Seminar",
  "Department Meeting",
  "Workshop",
  "Guest Lecture",
  "Alumni Meet",
  "Sports Practice",
  "Club Event",
  "Placement Drive",
  "Lab Session",
];

export const FACILITIES = [
  {
    id: "av-hall",
    name: "AV Hall",
    category: "Presentation Venue",
    capacity: 220,
    location: "Main Academic Block",
    approvals: ["HOD", "Event Coordinator"],
    eventTypes: ["Hackathon", "Seminar", "Workshop", "Guest Lecture", "Club Event"],
    amenities: ["Projector", "PA System", "AC", "Wi-Fi", "Recording Support"],
    description: "Best for technical events, focused workshops, and medium-sized presentations.",
  },
  {
    id: "seminar-hall-a",
    name: "Seminar Hall A",
    category: "Seminar Venue",
    capacity: 140,
    location: "ECE Block",
    approvals: ["HOD"],
    eventTypes: ["Seminar", "Department Meeting", "Workshop", "Guest Lecture", "Club Event"],
    amenities: ["Projector", "Podium", "AC", "Whiteboard"],
    description: "A flexible academic venue ideal for department events and invited talks.",
  },
  {
    id: "computer-lab-1",
    name: "Computer Lab 1",
    category: "Laboratory",
    capacity: 60,
    location: "IT Block",
    approvals: ["Lab In-Charge", "HOD"],
    eventTypes: ["Hackathon", "Workshop", "Lab Session", "Placement Drive"],
    amenities: ["Desktop Systems", "LAN", "Projector", "UPS Backup"],
    description: "Configured for hands-on sessions, coding contests, and assessments.",
  },
  {
    id: "auditorium",
    name: "Main Auditorium",
    category: "Large Venue",
    capacity: 900,
    location: "Central Campus",
    approvals: ["HOD", "Principal", "Event Coordinator"],
    eventTypes: ["Alumni Meet", "Seminar", "Guest Lecture", "Placement Drive", "Club Event"],
    amenities: ["Stage Lighting", "Sound Console", "Green Room", "LED Display"],
    description: "Designed for flagship college events, high-footfall programs, and ceremonies.",
  },
  {
    id: "conference-room",
    name: "Conference Room",
    category: "Meeting Space",
    capacity: 40,
    location: "Admin Block",
    approvals: [],
    eventTypes: ["Department Meeting", "Placement Drive", "Workshop"],
    amenities: ["Display Screen", "Video Conference", "AC", "Round Table Seating"],
    description: "Fast approval room for short academic reviews, panels, and committee meetings.",
  },
  {
    id: "sports-ground",
    name: "Sports Ground",
    category: "Outdoor Venue",
    capacity: 1200,
    location: "North Grounds",
    approvals: ["Sports Coordinator", "HOD"],
    eventTypes: ["Sports Practice", "Alumni Meet", "Club Event"],
    amenities: ["Floodlights", "PA System", "Open Seating", "Equipment Store"],
    description: "Suitable for sports events, outdoor gatherings, and large student activities.",
  },
];

export const getFacilitiesByPurpose = (purpose) =>
  FACILITIES.filter((facility) => facility.eventTypes.includes(purpose));

export const getFacilityById = (facilityId) =>
  FACILITIES.find((facility) => facility.id === facilityId) ?? null;
