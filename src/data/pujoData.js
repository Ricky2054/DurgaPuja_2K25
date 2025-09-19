// Durga Puja locations data extracted from the spreadsheet
export const pujoLocations = [
  {
    id: 1,
    name: "RAIL PUKUR SARBOJANIN SRI SRI DURGA PUJA SAMMILANI",
    entryLat: 22.612466,
    entryLng: 88.427648,
    exitLat: 22.612486,
    exitLng: 88.427683,
    parkingLat: null,
    parkingLng: null,
    mainPujoLat: 22.612406,
    mainPujoLng: 88.427556,
    description: "Traditional Durga Puja celebration with cultural programs and community participation.",
    features: ["Cultural Programs", "Community Kitchen", "Traditional Art"]
  },
  {
    id: 2,
    name: "ARJUNPUR AMRA SABAI CLUB",
    entryLat: 22.624677,
    entryLng: 88.424228,
    exitLat: 22.62429,
    exitLng: 88.424409,
    parkingLat: 22.623366,
    parkingLng: 88.4252213,
    mainPujoLat: null,
    mainPujoLng: null,
    description: "Community club organizing Durga Puja with modern amenities and cultural events.",
    features: ["Modern Amenities", "Cultural Events", "Community Hall"]
  },
  {
    id: 3,
    name: "Mastarda Smriti Sangha",
    entryLat: 22.603785,
    entryLng: 88.422467,
    exitLat: 22.603975,
    exitLng: 88.422488,
    parkingLat: 22.604232,
    parkingLng: 88.424114,
    mainPujoLat: null,
    mainPujoLng: null,
    description: "Memorial organization celebrating Durga Puja with traditional values and modern approach.",
    features: ["Memorial Services", "Traditional Values", "Modern Approach"]
  },
  {
    id: 4,
    name: "Aswininagar Bandhumahal Club Durga Puja Committee",
    entryLat: 22.609975,
    entryLng: 88.432802,
    exitLat: 22.610079,
    exitLng: 88.43286,
    parkingLat: null,
    parkingLng: null,
    mainPujoLat: 22.609994,
    mainPujoLng: 88.432857,
    description: "Bandhumahal Club's grand Durga Puja celebration with elaborate decorations.",
    features: ["Elaborate Decorations", "Grand Celebration", "Club Facilities"]
  },
  {
    id: 5,
    name: "DASHADRONE SARBOJANIN SREE SREE DURGA PUJA COMMITTEE",
    entryLat: 22.631489,
    entryLng: 88.446533,
    exitLat: 22.631570,
    exitLng: 88.446592,
    parkingLat: null,
    parkingLng: null,
    mainPujoLat: 22.631551,
    mainPujoLng: 88.446428,
    description: "Community-based Durga Puja committee organizing grand celebrations with traditional rituals.",
    features: ["Traditional Rituals", "Community Based", "Grand Celebrations"]
  },
  {
    id: 6,
    name: "KESTOPUR PRAFULLA KANAN (POSCHIM) ADHIBASHI BRINDA",
    entryLat: 22.607317,
    entryLng: 88.421284,
    exitLat: 22.607317,
    exitLng: 88.421284,
    parkingLat: 22.604232,
    parkingLng: 88.424114,
    mainPujoLat: null,
    mainPujoLng: null,
    description: "Adhibashi Brinda's Durga Puja celebration with cultural heritage focus.",
    features: ["Cultural Heritage", "Adhibashi Traditions", "Community Focus"]
  },
  {
    id: 7,
    name: "NIRVIK SANGHA",
    entryLat: 22.612124,
    entryLng: 88.429208,
    exitLat: 22.612035,
    exitLng: 88.429309,
    parkingLat: null,
    parkingLng: null,
    mainPujoLat: 22.612054,
    mainPujoLng: 88.429304,
    description: "Nirvik Sangha's Durga Puja with focus on social welfare and community development.",
    features: ["Social Welfare", "Community Development", "Cultural Programs"]
  },
  {
    id: 8,
    name: "Prafulla Kannan Balak Brinda (East)",
    entryLat: 22.601487,
    entryLng: 88.424703,
    exitLat: 22.601702,
    exitLng: 88.424549,
    parkingLat: null,
    parkingLng: null,
    mainPujoLat: 22.601621,
    mainPujoLng: 88.424561,
    description: "Children's organization celebrating Durga Puja with educational and cultural activities.",
    features: ["Educational Activities", "Children's Programs", "Cultural Learning"]
  }
];

// Traffic flow patterns for each location (updated for detailed road layout)
export const trafficPatterns = {
  1: {
    // Cars only on roads - top road (y=40), bottom road (y=460), left road (x=40), right road (x=560)
    inflow: [
      { x: 150, y: 40, direction: 'down' },
      { x: 300, y: 40, direction: 'down' },
      { x: 450, y: 40, direction: 'down' },
      { x: 40, y: 150, direction: 'right' },
      { x: 40, y: 300, direction: 'right' },
      { x: 40, y: 450, direction: 'right' }
    ],
    outflow: [
      { x: 200, y: 460, direction: 'up' },
      { x: 400, y: 460, direction: 'up' },
      { x: 560, y: 200, direction: 'left' },
      { x: 560, y: 350, direction: 'left' }
    ],
    parking: {
      general: { x: 120, y: 200, width: 120, height: 150 },
      vip: { x: 360, y: 200, width: 120, height: 150 }
    }
  },
  2: {
    inflow: [
      { x: 120, y: 40, direction: 'down' },
      { x: 250, y: 40, direction: 'down' },
      { x: 380, y: 40, direction: 'down' },
      { x: 40, y: 120, direction: 'right' },
      { x: 40, y: 250, direction: 'right' }
    ],
    outflow: [
      { x: 180, y: 460, direction: 'up' },
      { x: 350, y: 460, direction: 'up' },
      { x: 560, y: 180, direction: 'left' }
    ],
    parking: {
      general: { x: 120, y: 180, width: 120, height: 150 },
      vip: { x: 360, y: 180, width: 120, height: 150 }
    }
  },
  3: {
    inflow: [
      { x: 140, y: 40, direction: 'down' },
      { x: 280, y: 40, direction: 'down' },
      { x: 420, y: 40, direction: 'down' },
      { x: 40, y: 140, direction: 'right' },
      { x: 40, y: 280, direction: 'right' }
    ],
    outflow: [
      { x: 200, y: 460, direction: 'up' },
      { x: 360, y: 460, direction: 'up' },
      { x: 560, y: 200, direction: 'left' }
    ],
    parking: {
      general: { x: 120, y: 200, width: 120, height: 150 },
      vip: { x: 360, y: 200, width: 120, height: 150 }
    }
  },
  4: {
    inflow: [
      { x: 160, y: 40, direction: 'down' },
      { x: 300, y: 40, direction: 'down' },
      { x: 440, y: 40, direction: 'down' },
      { x: 40, y: 160, direction: 'right' },
      { x: 40, y: 300, direction: 'right' }
    ],
    outflow: [
      { x: 220, y: 460, direction: 'up' },
      { x: 380, y: 460, direction: 'up' },
      { x: 560, y: 220, direction: 'left' }
    ],
    parking: {
      general: { x: 120, y: 220, width: 120, height: 150 },
      vip: { x: 360, y: 220, width: 120, height: 150 }
    }
  },
  5: {
    inflow: [
      { x: 180, y: 40, direction: 'down' },
      { x: 320, y: 40, direction: 'down' },
      { x: 460, y: 40, direction: 'down' },
      { x: 40, y: 180, direction: 'right' },
      { x: 40, y: 320, direction: 'right' }
    ],
    outflow: [
      { x: 240, y: 460, direction: 'up' },
      { x: 400, y: 460, direction: 'up' },
      { x: 560, y: 240, direction: 'left' }
    ],
    parking: {
      general: { x: 120, y: 240, width: 120, height: 150 },
      vip: { x: 360, y: 240, width: 120, height: 150 }
    }
  },
  6: {
    inflow: [
      { x: 200, y: 40, direction: 'down' },
      { x: 340, y: 40, direction: 'down' },
      { x: 480, y: 40, direction: 'down' },
      { x: 40, y: 200, direction: 'right' },
      { x: 40, y: 340, direction: 'right' }
    ],
    outflow: [
      { x: 260, y: 460, direction: 'up' },
      { x: 420, y: 460, direction: 'up' },
      { x: 560, y: 260, direction: 'left' }
    ],
    parking: {
      general: { x: 120, y: 260, width: 120, height: 150 },
      vip: { x: 360, y: 260, width: 120, height: 150 }
    }
  },
  7: {
    inflow: [
      { x: 220, y: 40, direction: 'down' },
      { x: 360, y: 40, direction: 'down' },
      { x: 500, y: 40, direction: 'down' },
      { x: 40, y: 220, direction: 'right' },
      { x: 40, y: 360, direction: 'right' }
    ],
    outflow: [
      { x: 280, y: 460, direction: 'up' },
      { x: 440, y: 460, direction: 'up' },
      { x: 560, y: 280, direction: 'left' }
    ],
    parking: {
      general: { x: 120, y: 280, width: 120, height: 150 },
      vip: { x: 360, y: 280, width: 120, height: 150 }
    }
  },
  8: {
    inflow: [
      { x: 240, y: 40, direction: 'down' },
      { x: 380, y: 40, direction: 'down' },
      { x: 520, y: 40, direction: 'down' },
      { x: 40, y: 240, direction: 'right' },
      { x: 40, y: 380, direction: 'right' }
    ],
    outflow: [
      { x: 300, y: 460, direction: 'up' },
      { x: 460, y: 460, direction: 'up' },
      { x: 560, y: 300, direction: 'left' }
    ],
    parking: {
      general: { x: 120, y: 300, width: 120, height: 150 },
      vip: { x: 360, y: 300, width: 120, height: 150 }
    }
  }
};
