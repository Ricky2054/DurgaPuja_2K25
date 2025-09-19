// Unique layout configurations for each pandal
export const pandalLayouts = {
  1: {
    name: "Traditional Square Layout",
    shape: "square",
    orientation: "north-south",
    roadType: "straight",
    parking: {
      general: { x: 100, y: 150, width: 120, height: 100 },
      vip: { x: 380, y: 150, width: 120, height: 100 }
    },
    entryPoints: [
      { x: 300, y: 20, direction: 'down' },
      { x: 20, y: 250, direction: 'right' }
    ],
    exitPoints: [
      { x: 300, y: 480, direction: 'up' },
      { x: 580, y: 250, direction: 'left' }
    ],
    shops: 24,
    hasParking: true
  },
  
  2: {
    name: "Circular Mandala Layout",
    shape: "circle",
    orientation: "radial",
    roadType: "curved",
    parking: {
      general: { x: 80, y: 200, width: 100, height: 80 },
      vip: { x: 420, y: 200, width: 100, height: 80 }
    },
    entryPoints: [
      { x: 300, y: 30, direction: 'down' },
      { x: 30, y: 300, direction: 'right' },
      { x: 300, y: 570, direction: 'up' },
      { x: 570, y: 300, direction: 'left' }
    ],
    exitPoints: [
      { x: 200, y: 100, direction: 'up' },
      { x: 400, y: 100, direction: 'up' },
      { x: 200, y: 500, direction: 'down' },
      { x: 400, y: 500, direction: 'down' }
    ],
    shops: 32,
    hasParking: true
  },
  
  3: {
    name: "Diamond Shaped Layout",
    shape: "diamond",
    orientation: "diagonal",
    roadType: "angled",
    parking: {
      general: { x: 150, y: 180, width: 100, height: 120 },
      vip: { x: 350, y: 180, width: 100, height: 120 }
    },
    entryPoints: [
      { x: 300, y: 40, direction: 'down' },
      { x: 40, y: 300, direction: 'right' }
    ],
    exitPoints: [
      { x: 300, y: 560, direction: 'up' },
      { x: 560, y: 300, direction: 'left' }
    ],
    shops: 20,
    hasParking: true
  },
  
  4: {
    name: "Hexagonal Layout",
    shape: "hexagon",
    orientation: "multi-directional",
    roadType: "spiral",
    parking: {
      general: { x: 120, y: 160, width: 110, height: 90 },
      vip: { x: 370, y: 160, width: 110, height: 90 }
    },
    entryPoints: [
      { x: 300, y: 25, direction: 'down' },
      { x: 25, y: 200, direction: 'right' },
      { x: 25, y: 400, direction: 'right' }
    ],
    exitPoints: [
      { x: 300, y: 575, direction: 'up' },
      { x: 575, y: 200, direction: 'left' },
      { x: 575, y: 400, direction: 'left' }
    ],
    shops: 28,
    hasParking: true
  },
  
  5: {
    name: "L-Shaped Layout",
    shape: "L",
    orientation: "corner",
    roadType: "bent",
    parking: {
      general: { x: 100, y: 200, width: 130, height: 100 }
    },
    entryPoints: [
      { x: 200, y: 30, direction: 'down' },
      { x: 30, y: 400, direction: 'right' }
    ],
    exitPoints: [
      { x: 500, y: 200, direction: 'left' },
      { x: 200, y: 570, direction: 'up' }
    ],
    shops: 18,
    hasParking: true
  },
  
  6: {
    name: "T-Shaped Layout",
    shape: "T",
    orientation: "cross",
    roadType: "intersection",
    parking: {
      general: { x: 80, y: 180, width: 120, height: 80 },
      vip: { x: 400, y: 180, width: 120, height: 80 }
    },
    entryPoints: [
      { x: 300, y: 30, direction: 'down' },
      { x: 150, y: 300, direction: 'right' },
      { x: 450, y: 300, direction: 'left' }
    ],
    exitPoints: [
      { x: 300, y: 570, direction: 'up' },
      { x: 100, y: 300, direction: 'right' },
      { x: 500, y: 300, direction: 'left' }
    ],
    shops: 22,
    hasParking: true
  },
  
  7: {
    name: "U-Shaped Layout",
    shape: "U",
    orientation: "open",
    roadType: "curved",
    parking: {
      general: { x: 200, y: 150, width: 200, height: 80 }
    },
    entryPoints: [
      { x: 300, y: 30, direction: 'down' }
    ],
    exitPoints: [
      { x: 150, y: 570, direction: 'up' },
      { x: 450, y: 570, direction: 'up' }
    ],
    shops: 16,
    hasParking: true
  },
  
  8: {
    name: "Minimalist Layout",
    shape: "rectangle",
    orientation: "simple",
    roadType: "basic",
    parking: null,
    entryPoints: [
      { x: 300, y: 30, direction: 'down' }
    ],
    exitPoints: [
      { x: 300, y: 570, direction: 'up' }
    ],
    shops: 12,
    hasParking: false
  }
};

// Road type configurations
export const roadTypes = {
  straight: {
    name: "Straight Roads",
    style: "linear",
    lanes: 2,
    markings: "dashed"
  },
  curved: {
    name: "Curved Roads", 
    style: "arc",
    lanes: 2,
    markings: "solid"
  },
  angled: {
    name: "Angled Roads",
    style: "diagonal",
    lanes: 2,
    markings: "dotted"
  },
  spiral: {
    name: "Spiral Roads",
    style: "circular",
    lanes: 1,
    markings: "double"
  },
  bent: {
    name: "Bent Roads",
    style: "L-shaped",
    lanes: 2,
    markings: "dashed"
  },
  intersection: {
    name: "Intersection Roads",
    style: "cross",
    lanes: 2,
    markings: "solid"
  },
  basic: {
    name: "Basic Roads",
    style: "simple",
    lanes: 1,
    markings: "none"
  }
};

// Shape drawing functions
export const shapeDrawers = {
  square: (ctx, x, y, width, height) => {
    ctx.fillRect(x, y, width, height);
  },
  
  circle: (ctx, x, y, width, height) => {
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const radius = Math.min(width, height) / 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();
  },
  
  diamond: (ctx, x, y, width, height) => {
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    ctx.beginPath();
    ctx.moveTo(centerX, y);
    ctx.lineTo(x + width, centerY);
    ctx.lineTo(centerX, y + height);
    ctx.lineTo(x, centerY);
    ctx.closePath();
    ctx.fill();
  },
  
  hexagon: (ctx, x, y, width, height) => {
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const radius = Math.min(width, height) / 2;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const px = centerX + radius * Math.cos(angle);
      const py = centerY + radius * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  },
  
  L: (ctx, x, y, width, height) => {
    ctx.fillRect(x, y, width * 0.6, height);
    ctx.fillRect(x, y + height * 0.4, width, height * 0.6);
  },
  
  T: (ctx, x, y, width, height) => {
    ctx.fillRect(x + width * 0.2, y, width * 0.6, height);
    ctx.fillRect(x, y + height * 0.3, width, height * 0.4);
  },
  
  U: (ctx, x, y, width, height) => {
    ctx.fillRect(x, y, width * 0.2, height);
    ctx.fillRect(x + width * 0.8, y, width * 0.2, height);
    ctx.fillRect(x, y + height * 0.7, width, height * 0.3);
  },
  
  rectangle: (ctx, x, y, width, height) => {
    ctx.fillRect(x, y, width, height);
  }
};
