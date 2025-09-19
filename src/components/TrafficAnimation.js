import React, { useEffect, useRef } from 'react';
import { trafficPatterns } from '../data/pujoData';
import { pandalLayouts, roadTypes, shapeDrawers } from './UniquePandalLayouts';

const TrafficAnimation = ({ pujoId, pujoName }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const carsRef = useRef([]);
  const arrowsRef = useRef([]);
  const spritesRef = useRef({ carImages: {}, roadTiles: {} });
  const thakurImageRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const trafficPattern = trafficPatterns[pujoId];
    
    if (!trafficPattern) return;

    // Set canvas size - larger for better roads
    canvas.width = 600;
    canvas.height = 500;

    // Get unique layout for this pandal
    const layout = pandalLayouts[pujoId] || pandalLayouts[1];
    const roadConfig = roadTypes[layout.roadType] || roadTypes.straight;

    // Load thakur image
    const thakurImage = new Image();
    thakurImage.onload = () => {
      thakurImageRef.current = thakurImage;
    };
    thakurImage.src = '/thakur.png';

    // Load car sprites from the city_cars_2 image
    const loadCarAssets = () => {
      const carImages = {};
      const carNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      let loadedCount = 0;
      
      carNumbers.forEach(num => {
        const img = new Image();
        img.onload = () => {
          carImages[`car${num}`] = img;
          loadedCount++;
          if (loadedCount === carNumbers.length) {
            spritesRef.current.carImages = carImages;
          }
        };
        img.src = `/car${num}.png`;
      });
    };

    // Load road sprite sheet
    const loadRoadAssets = () => {
      const roadSpriteSheet = new Image();
      roadSpriteSheet.onload = () => {
        // Extract road tiles from the sprite sheet
        const tileSize = 32; // Assuming 32x32 tiles
        const roadTiles = {};
        
        // Extract different road types from the sprite sheet
        // Based on the description, we'll extract key road segments
        roadTiles['horizontal'] = extractRoadTile(roadSpriteSheet, 0, 0, tileSize, tileSize);
        roadTiles['vertical'] = extractRoadTile(roadSpriteSheet, 1, 0, tileSize, tileSize);
        roadTiles['corner_bl'] = extractRoadTile(roadSpriteSheet, 2, 0, tileSize, tileSize); // Bottom-left corner
        roadTiles['t_junction_r'] = extractRoadTile(roadSpriteSheet, 3, 0, tileSize, tileSize); // T-junction right
        roadTiles['t_junction_l'] = extractRoadTile(roadSpriteSheet, 4, 0, tileSize, tileSize); // T-junction left
        roadTiles['intersection'] = extractRoadTile(roadSpriteSheet, 5, 0, tileSize, tileSize); // Four-way intersection
        roadTiles['dead_end_t'] = extractRoadTile(roadSpriteSheet, 6, 0, tileSize, tileSize); // Dead end top
        roadTiles['dead_end_b'] = extractRoadTile(roadSpriteSheet, 7, 0, tileSize, tileSize); // Dead end bottom
        roadTiles['wide_horizontal'] = extractRoadTile(roadSpriteSheet, 0, 1, tileSize * 2, tileSize); // Wide road
        
        spritesRef.current.roadTiles = roadTiles;
      };
      roadSpriteSheet.src = '/roads2W.png';
    };

    // Helper function to extract road tile from sprite sheet
    const extractRoadTile = (image, tileX, tileY, width, height) => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, tileX * 32, tileY * 32, width, height, 0, 0, width, height);
      return canvas;
    };


    // Helper function to draw shops around the perimeter
    const drawShops = (ctx, pandalArea, roadWidth, borderWidth) => {
      const shopWidth = 40;
      const shopHeight = 30;
      const shopColors = ['#e74c3c', '#f39c12', '#3498db', '#9b59b6', '#1abc9c'];
      
      // Top shops
      for (let i = 0; i < 8; i++) {
        const x = pandalArea.x + (i * (pandalArea.width / 8));
        const y = pandalArea.y - shopHeight - 10;
        ctx.fillStyle = shopColors[i % shopColors.length];
        ctx.fillRect(x, y, shopWidth, shopHeight);
        
        // Shop roof
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(x - 2, y - 5, shopWidth + 4, 5);
        
        // Shop sign
        ctx.fillStyle = '#fff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Shop', x + shopWidth/2, y + shopHeight/2 + 3);
      }
      
      // Bottom shops
      for (let i = 0; i < 8; i++) {
        const x = pandalArea.x + (i * (pandalArea.width / 8));
        const y = pandalArea.y + pandalArea.height + 10;
        ctx.fillStyle = shopColors[i % shopColors.length];
        ctx.fillRect(x, y, shopWidth, shopHeight);
        
        // Shop roof
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(x - 2, y + shopHeight, shopWidth + 4, 5);
        
        // Shop sign
        ctx.fillStyle = '#fff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Shop', x + shopWidth/2, y + shopHeight/2 + 3);
      }
      
      // Left shops
      for (let i = 0; i < 6; i++) {
        const x = pandalArea.x - shopHeight - 10;
        const y = pandalArea.y + (i * (pandalArea.height / 6));
        ctx.fillStyle = shopColors[i % shopColors.length];
        ctx.fillRect(x, y, shopHeight, shopWidth);
        
        // Shop roof
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(x - 5, y - 2, 5, shopWidth + 4);
        
        // Shop sign
        ctx.fillStyle = '#fff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.save();
        ctx.translate(x + shopHeight/2, y + shopWidth/2);
        ctx.rotate(-Math.PI/2);
        ctx.fillText('Shop', 0, 0);
        ctx.restore();
      }
      
      // Right shops
      for (let i = 0; i < 6; i++) {
        const x = pandalArea.x + pandalArea.width + 10;
        const y = pandalArea.y + (i * (pandalArea.height / 6));
        ctx.fillStyle = shopColors[i % shopColors.length];
        ctx.fillRect(x, y, shopHeight, shopWidth);
        
        // Shop roof
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(x + shopHeight, y - 2, 5, shopWidth + 4);
        
        // Shop sign
        ctx.fillStyle = '#fff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.save();
        ctx.translate(x + shopHeight/2, y + shopWidth/2);
        ctx.rotate(Math.PI/2);
        ctx.fillText('Shop', 0, 0);
        ctx.restore();
      }
    };

    // Helper function to draw entry and exit areas
    const drawEntryExitAreas = (ctx, pandalArea, roadWidth) => {
      // Entry area (top)
      ctx.fillStyle = 'rgba(46, 204, 113, 0.8)';
      ctx.fillRect(pandalArea.x + 50, pandalArea.y - 30, 100, 30);
      ctx.fillStyle = '#2c3e50';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('ENTRY', pandalArea.x + 100, pandalArea.y - 10);
      
      // Exit area (bottom)
      ctx.fillStyle = 'rgba(231, 76, 60, 0.8)';
      ctx.fillRect(pandalArea.x + pandalArea.width - 150, pandalArea.y + pandalArea.height, 100, 30);
      ctx.fillStyle = '#2c3e50';
      ctx.fillText('EXIT', pandalArea.x + pandalArea.width - 100, pandalArea.y + pandalArea.height + 20);
      
      // Side entry (left)
      ctx.fillStyle = 'rgba(52, 152, 219, 0.8)';
      ctx.fillRect(pandalArea.x - 30, pandalArea.y + 50, 30, 80);
      ctx.fillStyle = '#2c3e50';
      ctx.font = 'bold 10px Arial';
      ctx.save();
      ctx.translate(pandalArea.x - 15, pandalArea.y + 90);
      ctx.rotate(-Math.PI/2);
      ctx.fillText('ENTRY', 0, 0);
      ctx.restore();
      
      // Side exit (right)
      ctx.fillStyle = 'rgba(155, 89, 182, 0.8)';
      ctx.fillRect(pandalArea.x + pandalArea.width, pandalArea.y + pandalArea.height - 130, 30, 80);
      ctx.fillStyle = '#2c3e50';
      ctx.save();
      ctx.translate(pandalArea.x + pandalArea.width + 15, pandalArea.y + pandalArea.height - 50);
      ctx.rotate(Math.PI/2);
      ctx.fillText('EXIT', 0, 0);
      ctx.restore();
    };

    // Helper function to draw parking areas
    const drawParkingAreas = (ctx, pandalArea) => {
      // General parking (left side) - positioned to avoid overlap
      const generalParking = {
        x: pandalArea.x + 20,
        y: pandalArea.y + 20,
        width: 100,
        height: 120
      };
      
      ctx.fillStyle = '#27ae60';
      ctx.fillRect(generalParking.x, generalParking.y, generalParking.width, generalParking.height);
      ctx.strokeStyle = '#2ecc71';
      ctx.lineWidth = 2;
      ctx.strokeRect(generalParking.x, generalParking.y, generalParking.width, generalParking.height);
      
      // Parking lines for general
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        const y = generalParking.y + 25 + (i * 25);
        ctx.beginPath();
        ctx.moveTo(generalParking.x + 10, y);
        ctx.lineTo(generalParking.x + generalParking.width - 10, y);
        ctx.stroke();
      }
      
      // VIP parking (right side) - positioned to avoid overlap
      const vipParking = {
        x: pandalArea.x + pandalArea.width - 120,
        y: pandalArea.y + 20,
        width: 100,
        height: 120
      };
      
      ctx.fillStyle = '#f1c40f';
      ctx.fillRect(vipParking.x, vipParking.y, vipParking.width, vipParking.height);
      ctx.strokeStyle = '#e67e22';
      ctx.lineWidth = 2;
      ctx.strokeRect(vipParking.x, vipParking.y, vipParking.width, vipParking.height);
      
      // Parking lines for VIP
      for (let i = 0; i < 3; i++) {
        const y = vipParking.y + 25 + (i * 25);
        ctx.beginPath();
        ctx.moveTo(vipParking.x + 10, y);
        ctx.lineTo(vipParking.x + vipParking.width - 10, y);
        ctx.stroke();
      }
      
      // Parking labels
      ctx.fillStyle = '#2c3e50';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('General', generalParking.x + generalParking.width/2, generalParking.y + 15);
      ctx.fillText('VIP Parking', vipParking.x + vipParking.width/2, vipParking.y + 15);
    };

    // Continuous arrow chain system
    class ArrowChain {
      constructor(path, direction, speed = 0.02) {
        this.path = path; // Array of {x, y} points
        this.direction = direction;
        this.speed = speed;
        this.arrowSpacing = 20; // Distance between arrows - no gaps
        this.arrows = [];
        this.time = 0;
        this.initializeArrows();
      }

      initializeArrows() {
        // Create arrows along the path
        for (let i = 0; i < this.path.length - 1; i++) {
          const start = this.path[i];
          const end = this.path[i + 1];
          const distance = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2);
          const numArrows = Math.floor(distance / this.arrowSpacing);
          
          for (let j = 0; j < numArrows; j++) {
            const progress = j / numArrows;
            this.arrows.push({
              x: start.x + (end.x - start.x) * progress,
              y: start.y + (end.y - start.y) * progress,
              offset: j * 0.2 // Stagger the animation
            });
          }
        }
      }

      update() {
        this.time += this.speed;
      }

      draw(ctx) {
        this.arrows.forEach((arrow, index) => {
          const animatedOffset = (this.time + arrow.offset) % 1;
          const moveDistance = 15;
          
          ctx.save();
          ctx.translate(arrow.x, arrow.y);
          
          // Move arrow along path
          if (index < this.arrows.length - 1) {
            const nextArrow = this.arrows[index + 1];
            const dx = nextArrow.x - arrow.x;
            const dy = nextArrow.y - arrow.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
              ctx.translate(
                (dx / distance) * animatedOffset * moveDistance,
                (dy / distance) * animatedOffset * moveDistance
              );
            }
          }
          
          // Rotate based on direction
          switch (this.direction) {
            case 'down': break;
            case 'up': ctx.rotate(Math.PI); break;
            case 'right': ctx.rotate(Math.PI/2); break;
            case 'left': ctx.rotate(-Math.PI/2); break;
          }
          
          // Draw different arrow styles based on index
          this.drawArrowStyle(ctx, index);
          
          ctx.restore();
        });
      }

      drawArrowStyle(ctx, index) {
        const style = index % 4; // Cycle through 4 different styles
        
        switch (style) {
          case 0:
            // Wide chevron arrow with inner lines (teal)
            ctx.fillStyle = '#4ecdc4';
            ctx.strokeStyle = '#2c3e50';
            ctx.lineWidth = 1;
            
            // Main chevron
            ctx.beginPath();
            ctx.moveTo(0, -8);
            ctx.lineTo(-6, 0);
            ctx.lineTo(0, 8);
            ctx.lineTo(6, 0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            // Inner lines
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(0, -5);
            ctx.lineTo(-3, 0);
            ctx.lineTo(0, 5);
            ctx.lineTo(3, 0);
            ctx.closePath();
            ctx.stroke();
            break;
            
          case 1:
            // Block arrow (navy blue)
            ctx.fillStyle = '#2c3e50';
            ctx.strokeStyle = '#34495e';
            ctx.lineWidth = 1;
            
            // Arrow shaft
            ctx.fillRect(-8, -3, 12, 6);
            // Arrow head
            ctx.beginPath();
            ctx.moveTo(4, -6);
            ctx.lineTo(4, 6);
            ctx.lineTo(8, 0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            break;
            
          case 2:
            // Play button style arrow (teal)
            ctx.fillStyle = '#4ecdc4';
            ctx.strokeStyle = '#2c3e50';
            ctx.lineWidth = 1;
            
            // Small rectangle
            ctx.fillRect(-6, -2, 4, 4);
            // Triangle
            ctx.beginPath();
            ctx.moveTo(-2, -4);
            ctx.lineTo(-2, 4);
            ctx.lineTo(6, 0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            break;
            
          case 3:
            // Double chevron outline (navy blue)
            ctx.strokeStyle = '#2c3e50';
            ctx.lineWidth = 2;
            ctx.fillStyle = 'transparent';
            
            // First chevron
            ctx.beginPath();
            ctx.moveTo(-2, -6);
            ctx.lineTo(-4, -2);
            ctx.lineTo(-2, 2);
            ctx.lineTo(0, -2);
            ctx.lineTo(2, 2);
            ctx.lineTo(4, -2);
            ctx.lineTo(2, -6);
            ctx.closePath();
            ctx.stroke();
            
            // Second chevron
            ctx.beginPath();
            ctx.moveTo(-1, -4);
            ctx.lineTo(-3, -1);
            ctx.lineTo(-1, 1);
            ctx.lineTo(1, -1);
            ctx.lineTo(3, -1);
            ctx.lineTo(1, 1);
            ctx.lineTo(-1, -4);
            ctx.closePath();
            ctx.stroke();
            break;
        }
      }
    }

    // Initialize arrow chains
    const initializeArrows = () => {
      arrowsRef.current = [];
      
      const roadWidth = 80;
      const borderWidth = 20;
      const pandalArea = {
        x: roadWidth + borderWidth,
        y: roadWidth + borderWidth,
        width: canvas.width - 2 * (roadWidth + borderWidth),
        height: canvas.height - 2 * (roadWidth + borderWidth)
      };
      
      // Top entry area arrows (green entry zone)
      arrowsRef.current.push(new ArrowChain([
        { x: pandalArea.x + 80, y: pandalArea.y - 20 },
        { x: pandalArea.x + 80, y: pandalArea.y + 20 }
      ], 'down'));
      
      arrowsRef.current.push(new ArrowChain([
        { x: pandalArea.x + 120, y: pandalArea.y - 20 },
        { x: pandalArea.x + 120, y: pandalArea.y + 20 }
      ], 'down'));
      
      arrowsRef.current.push(new ArrowChain([
        { x: pandalArea.x + 160, y: pandalArea.y - 20 },
        { x: pandalArea.x + 160, y: pandalArea.y + 20 }
      ], 'down'));
      
      // Left entry area arrows (blue entry zone)
      arrowsRef.current.push(new ArrowChain([
        { x: pandalArea.x - 20, y: pandalArea.y + 80 },
        { x: pandalArea.x + 20, y: pandalArea.y + 80 }
      ], 'right'));
      
      arrowsRef.current.push(new ArrowChain([
        { x: pandalArea.x - 20, y: pandalArea.y + 120 },
        { x: pandalArea.x + 20, y: pandalArea.y + 120 }
      ], 'right'));
      
      arrowsRef.current.push(new ArrowChain([
        { x: pandalArea.x - 20, y: pandalArea.y + 160 },
        { x: pandalArea.x + 20, y: pandalArea.y + 160 }
      ], 'right'));
      
      // Bottom exit area arrows (red exit zone)
      arrowsRef.current.push(new ArrowChain([
        { x: pandalArea.x + 320, y: pandalArea.y + pandalArea.height - 20 },
        { x: pandalArea.x + 320, y: pandalArea.y + pandalArea.height + 20 }
      ], 'down'));
      
      arrowsRef.current.push(new ArrowChain([
        { x: pandalArea.x + 360, y: pandalArea.y + pandalArea.height - 20 },
        { x: pandalArea.x + 360, y: pandalArea.y + pandalArea.height + 20 }
      ], 'down'));
      
      arrowsRef.current.push(new ArrowChain([
        { x: pandalArea.x + 400, y: pandalArea.y + pandalArea.height - 20 },
        { x: pandalArea.x + 400, y: pandalArea.y + pandalArea.height + 20 }
      ], 'down'));
      
      // Right exit area arrows (purple exit zone)
      arrowsRef.current.push(new ArrowChain([
        { x: pandalArea.x + pandalArea.width - 20, y: pandalArea.y + 320 },
        { x: pandalArea.x + pandalArea.width + 20, y: pandalArea.y + 320 }
      ], 'right'));
      
      arrowsRef.current.push(new ArrowChain([
        { x: pandalArea.x + pandalArea.width - 20, y: pandalArea.y + 360 },
        { x: pandalArea.x + pandalArea.width + 20, y: pandalArea.y + 360 }
      ], 'right'));
      
      arrowsRef.current.push(new ArrowChain([
        { x: pandalArea.x + pandalArea.width - 20, y: pandalArea.y + 400 },
        { x: pandalArea.x + pandalArea.width + 20, y: pandalArea.y + 400 }
      ], 'right'));
    };

    // Helper function to draw moving arrows
    const drawMovingArrows = (ctx) => {
      arrowsRef.current.forEach(arrowChain => {
        arrowChain.update();
        arrowChain.draw(ctx);
      });
    };

    // Helper function to draw buildings and parks
    const drawBuildingsAndParks = (ctx) => {
      // Draw buildings around the perimeter
      const buildingColors = ['#8e44ad', '#e74c3c', '#f39c12', '#27ae60', '#3498db', '#9b59b6'];
      
      // Top buildings
      for (let i = 0; i < 6; i++) {
        ctx.fillStyle = buildingColors[i % buildingColors.length];
        ctx.fillRect(20 + (i * 100), 10, 80, 20);
        // Building details
        ctx.fillStyle = '#34495e';
        ctx.fillRect(30 + (i * 100), 15, 8, 8);
        ctx.fillRect(50 + (i * 100), 15, 8, 8);
        ctx.fillRect(70 + (i * 100), 15, 8, 8);
      }
      
      // Bottom buildings
      for (let i = 0; i < 6; i++) {
        ctx.fillStyle = buildingColors[(i + 2) % buildingColors.length];
        ctx.fillRect(20 + (i * 100), 470, 80, 20);
        // Building details
        ctx.fillStyle = '#34495e';
        ctx.fillRect(30 + (i * 100), 475, 8, 8);
        ctx.fillRect(50 + (i * 100), 475, 8, 8);
        ctx.fillRect(70 + (i * 100), 475, 8, 8);
      }
      
      // Left buildings
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = buildingColors[(i + 4) % buildingColors.length];
        ctx.fillRect(10, 20 + (i * 100), 20, 80);
        // Building details
        ctx.fillStyle = '#34495e';
        ctx.fillRect(15, 30 + (i * 100), 8, 8);
        ctx.fillRect(15, 50 + (i * 100), 8, 8);
        ctx.fillRect(15, 70 + (i * 100), 8, 8);
      }
      
      // Right buildings
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = buildingColors[(i + 1) % buildingColors.length];
        ctx.fillRect(570, 20 + (i * 100), 20, 80);
        // Building details
        ctx.fillStyle = '#34495e';
        ctx.fillRect(575, 30 + (i * 100), 8, 8);
        ctx.fillRect(575, 50 + (i * 100), 8, 8);
        ctx.fillRect(575, 70 + (i * 100), 8, 8);
      }
      
      // Draw parks with natural shapes
      // Top-left park
      ctx.fillStyle = '#27ae60';
      ctx.beginPath();
      ctx.arc(50, 80, 25, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#2ecc71';
      ctx.beginPath();
      ctx.arc(45, 75, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(55, 85, 6, 0, Math.PI * 2);
      ctx.fill();
      
      // Top-right park
      ctx.fillStyle = '#27ae60';
      ctx.beginPath();
      ctx.arc(550, 80, 25, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#2ecc71';
      ctx.beginPath();
      ctx.arc(545, 75, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(555, 85, 6, 0, Math.PI * 2);
      ctx.fill();
      
      // Bottom-left park
      ctx.fillStyle = '#27ae60';
      ctx.beginPath();
      ctx.arc(50, 420, 25, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#2ecc71';
      ctx.beginPath();
      ctx.arc(45, 415, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(55, 425, 6, 0, Math.PI * 2);
      ctx.fill();
      
      // Bottom-right park
      ctx.fillStyle = '#27ae60';
      ctx.beginPath();
      ctx.arc(550, 420, 25, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#2ecc71';
      ctx.beginPath();
      ctx.arc(545, 415, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(555, 425, 6, 0, Math.PI * 2);
      ctx.fill();
    };

    // Helper function to draw unique roads based on layout
    const drawUniqueRoads = (ctx, roadWidth) => {
      ctx.fillStyle = '#2c3e50';
      
      switch (layout.roadType) {
        case 'straight':
          drawStraightRoads(ctx, roadWidth);
          break;
        case 'curved':
          drawCurvedRoads(ctx, roadWidth);
          break;
        case 'angled':
          drawAngledRoads(ctx, roadWidth);
          break;
        case 'spiral':
          drawSpiralRoads(ctx, roadWidth);
          break;
        case 'bent':
          drawBentRoads(ctx, roadWidth);
          break;
        case 'intersection':
          drawIntersectionRoads(ctx, roadWidth);
          break;
        case 'basic':
          drawBasicRoads(ctx, roadWidth);
          break;
        default:
          drawStraightRoads(ctx, roadWidth);
      }
    };

    const drawStraightRoads = (ctx, roadWidth) => {
      // Traditional straight roads
      ctx.fillRect(0, 0, canvas.width, roadWidth);
      ctx.fillRect(0, canvas.height - roadWidth, canvas.width, roadWidth);
      ctx.fillRect(0, 0, roadWidth, canvas.height);
      ctx.fillRect(canvas.width - roadWidth, 0, roadWidth, canvas.height);
      drawLaneMarkings(ctx, roadWidth, 'dashed');
    };

    const drawCurvedRoads = (ctx, roadWidth) => {
      // Curved roads for circular layouts
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Outer ring road
      ctx.beginPath();
      ctx.arc(centerX, centerY, 200, 0, 2 * Math.PI);
      ctx.lineWidth = roadWidth;
      ctx.stroke();
      
      // Inner ring road
      ctx.beginPath();
      ctx.arc(centerX, centerY, 120, 0, 2 * Math.PI);
      ctx.lineWidth = roadWidth;
      ctx.stroke();
      
      // Connecting roads
      ctx.fillRect(centerX - roadWidth/2, 0, roadWidth, centerY - 120);
      ctx.fillRect(centerX - roadWidth/2, centerY + 120, roadWidth, centerY - 120);
      ctx.fillRect(0, centerY - roadWidth/2, centerX - 120, roadWidth);
      ctx.fillRect(centerX + 120, centerY - roadWidth/2, centerX - 120, roadWidth);
      
      drawLaneMarkings(ctx, roadWidth, 'solid');
    };

    const drawAngledRoads = (ctx, roadWidth) => {
      // Diagonal roads for diamond layout
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Diagonal roads
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(-roadWidth/2, -300, roadWidth, 600);
      ctx.rotate(Math.PI / 2);
      ctx.fillRect(-roadWidth/2, -300, roadWidth, 600);
      ctx.restore();
      
      drawLaneMarkings(ctx, roadWidth, 'dotted');
    };

    const drawSpiralRoads = (ctx, roadWidth) => {
      // Spiral roads for hexagonal layout
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const x = centerX + 150 * Math.cos(angle);
        const y = centerY + 150 * Math.sin(angle);
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.lineWidth = roadWidth;
      ctx.stroke();
      
      drawLaneMarkings(ctx, roadWidth, 'double');
    };

    const drawBentRoads = (ctx, roadWidth) => {
      // L-shaped roads
      ctx.fillRect(0, 0, canvas.width * 0.6, roadWidth);
      ctx.fillRect(0, 0, roadWidth, canvas.height);
      ctx.fillRect(0, canvas.height - roadWidth, canvas.width, roadWidth);
      ctx.fillRect(canvas.width - roadWidth, 0, roadWidth, canvas.height * 0.6);
      
      drawLaneMarkings(ctx, roadWidth, 'dashed');
    };

    const drawIntersectionRoads = (ctx, roadWidth) => {
      // T-shaped intersection roads
      ctx.fillRect(0, 0, canvas.width, roadWidth);
      ctx.fillRect(0, canvas.height - roadWidth, canvas.width, roadWidth);
      ctx.fillRect(canvas.width/2 - roadWidth/2, 0, roadWidth, canvas.height);
      ctx.fillRect(0, canvas.height/2 - roadWidth/2, canvas.width, roadWidth);
      
      drawLaneMarkings(ctx, roadWidth, 'solid');
    };

    const drawBasicRoads = (ctx, roadWidth) => {
      // Simple single road
      ctx.fillRect(0, 0, canvas.width, roadWidth);
      ctx.fillRect(0, canvas.height - roadWidth, canvas.width, roadWidth);
    };

    const drawLaneMarkings = (ctx, roadWidth, type) => {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      
      switch (type) {
        case 'dashed':
          ctx.setLineDash([10, 10]);
          break;
        case 'solid':
          ctx.setLineDash([]);
          break;
        case 'dotted':
          ctx.setLineDash([3, 7]);
          break;
        case 'double':
          ctx.setLineDash([15, 5]);
          break;
        default:
          ctx.setLineDash([]);
      }
      
      // Draw center lines for multi-lane roads
      if (roadConfig.lanes > 1) {
        ctx.beginPath();
        ctx.moveTo(0, roadWidth/2);
        ctx.lineTo(canvas.width, roadWidth/2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - roadWidth/2);
        ctx.lineTo(canvas.width, canvas.height - roadWidth/2);
        ctx.stroke();
      }
      
      ctx.setLineDash([]);
    };

    // Fallback procedural roads
    const drawProceduralRoads = (ctx, roadWidth) => {
      // Base road color
      ctx.fillStyle = '#2c3e50';
      
      // Top horizontal road
      ctx.fillRect(0, 0, canvas.width, roadWidth);
      
      // Bottom horizontal road  
      ctx.fillRect(0, canvas.height - roadWidth, canvas.width, roadWidth);
      
      // Left vertical road
      ctx.fillRect(0, 0, roadWidth, canvas.height);
      
      // Right vertical road
      ctx.fillRect(canvas.width - roadWidth, 0, roadWidth, canvas.height);
      
      // Add road markings
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.setLineDash([15, 10]);
      
      // Center lines for each road
      ctx.beginPath();
      ctx.moveTo(0, roadWidth/2);
      ctx.lineTo(canvas.width, roadWidth/2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - roadWidth/2);
      ctx.lineTo(canvas.width, canvas.height - roadWidth/2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(roadWidth/2, 0);
      ctx.lineTo(roadWidth/2, canvas.height);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(canvas.width - roadWidth/2, 0);
      ctx.lineTo(canvas.width - roadWidth/2, canvas.height);
      ctx.stroke();
      
      ctx.setLineDash([]);
    };

    // Helper function to draw enhanced entry/exit areas
    const drawEnhancedEntryExit = (ctx, pandalArea, roadWidth) => {
      // Entry areas with better visibility
      ctx.fillStyle = '#27ae60';
      ctx.fillRect(pandalArea.x + 50, pandalArea.y - 60, 100, 40);
      ctx.fillStyle = '#2ecc71';
      ctx.fillRect(pandalArea.x + 60, pandalArea.y - 50, 80, 20);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('ENTRY', pandalArea.x + 100, pandalArea.y - 35);
      
      // Left entry
      ctx.fillStyle = '#3498db';
      ctx.fillRect(pandalArea.x - 60, pandalArea.y + 50, 40, 100);
      ctx.fillStyle = '#5dade2';
      ctx.fillRect(pandalArea.x - 50, pandalArea.y + 60, 20, 80);
      ctx.save();
      ctx.translate(pandalArea.x - 40, pandalArea.y + 100);
      ctx.rotate(-Math.PI/2);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('ENTRY', 0, 5);
      ctx.restore();
      
      // Exit areas
      ctx.fillStyle = '#e74c3c';
      ctx.fillRect(pandalArea.x + pandalArea.width - 150, pandalArea.y + pandalArea.height + 20, 100, 40);
      ctx.fillStyle = '#ec7063';
      ctx.fillRect(pandalArea.x + pandalArea.width - 140, pandalArea.y + pandalArea.height + 30, 80, 20);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('EXIT', pandalArea.x + pandalArea.width - 100, pandalArea.y + pandalArea.height + 45);
      
      // Right exit
      ctx.fillStyle = '#9b59b6';
      ctx.fillRect(pandalArea.x + pandalArea.width + 20, pandalArea.y + pandalArea.height - 150, 40, 100);
      ctx.fillStyle = '#bb8fce';
      ctx.fillRect(pandalArea.x + pandalArea.width + 30, pandalArea.y + pandalArea.height - 140, 20, 80);
      ctx.save();
      ctx.translate(pandalArea.x + pandalArea.width + 40, pandalArea.y + pandalArea.height - 100);
      ctx.rotate(Math.PI/2);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('EXIT', 0, 5);
      ctx.restore();
    };

    // Car class for traffic animation
    class Car {
      constructor(x, y, direction, type = 'inflow') {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.type = type;
        this.speed = Math.random() * 1.5 + 0.8;
        this.sprite = this.getRandomSprite();
        this.angle = this.getAngleFromDirection(direction);
        this.originalX = x;
        this.originalY = y;
      }

      getRandomSprite() {
        const carSprites = ['car1', 'car2', 'car3', 'car4', 'car5', 'car6', 'car7', 'car8', 'car9'];
        return carSprites[Math.floor(Math.random() * carSprites.length)];
      }

      getAngleFromDirection(direction) {
        switch (direction) {
          case 'down': return 0; // Cars moving right on top road
          case 'up': return Math.PI; // Cars moving left on bottom road
          case 'left': return -Math.PI / 2; // Cars moving up on right road
          case 'right': return Math.PI / 2; // Cars moving down on left road
          default: return 0;
        }
      }

      update() {
        // Don't move parked cars
        if (this.type === 'parked') {
          return;
        }
        
        const roadWidth = 80;
        
        // Move cars and keep them on roads with two-lane system
        switch (this.direction) {
          case 'down':
            this.x += this.speed; // Move horizontally across the top road
            // Keep car on top road - use different lanes
            if (this.type === 'inflow') {
              this.y = roadWidth/6; // Top lane
            } else {
              this.y = roadWidth/2; // Bottom lane
            }
            // Reset position when car goes off screen
            if (this.x > canvas.width + 50) {
              this.x = -50;
            }
            break;
          case 'up':
            this.x -= this.speed; // Move horizontally across the bottom road
            // Keep car on bottom road - use different lanes
            if (this.type === 'inflow') {
              this.y = canvas.height - roadWidth/2; // Top lane
            } else {
              this.y = canvas.height - roadWidth/6; // Bottom lane
            }
            // Reset position when car goes off screen
            if (this.x < -50) {
              this.x = canvas.width + 50;
            }
            break;
          case 'left':
            this.y -= this.speed; // Move vertically up the right road
            // Keep car on right road - use different lanes
            if (this.type === 'inflow') {
              this.x = canvas.width - roadWidth/2; // Left lane
            } else {
              this.x = canvas.width - roadWidth/6; // Right lane
            }
            // Reset position when car goes off screen
            if (this.y < -50) {
              this.y = canvas.height + 50;
            }
            break;
          case 'right':
            this.y += this.speed; // Move vertically down the left road
            // Keep car on left road - use different lanes
            if (this.type === 'inflow') {
              this.x = roadWidth/6; // Left lane
            } else {
              this.x = roadWidth/2; // Right lane
            }
            // Reset position when car goes off screen
            if (this.y > canvas.height + 50) {
              this.y = -50;
            }
            break;
        }
      }

      draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
            // Draw car asset
            const carImage = spritesRef.current.carImages[this.sprite];
            if (carImage) {
              // Draw the car image with proper sizing
              ctx.drawImage(carImage, -20, -12, 40, 24);
            } else {
              // Fallback: draw colored rectangle
              const colors = {
                'car1': '#f4f4f4', 'car2': '#e8e8e8', 'car3': '#dcdcdc',
                'car4': '#d0d0d0', 'car5': '#c4c4c4', 'car6': '#b8b8b8',
                'car7': '#acacac', 'car8': '#a0a0a0', 'car9': '#949494'
              };
              
              ctx.fillStyle = colors[this.sprite] || '#f4f4f4';
              ctx.fillRect(-20, -12, 40, 24);
              
              // Add car details
              ctx.fillStyle = '#000';
              ctx.fillRect(-16, -8, 32, 6);
              ctx.fillRect(-12, -6, 6, 6);
              ctx.fillRect(6, -6, 6, 6);
            }
        
        ctx.restore();
      }
    }

    // Initialize cars
    const initializeCars = () => {
      carsRef.current = [];
      const roadWidth = 80;
      
      // Top road cars (inflow - moving right across top road)
      for (let i = 0; i < 6; i++) {
        carsRef.current.push(new Car(
          -100 + (i * 100) + Math.random() * 30,
          roadWidth/6, // Top lane
          'down', // Direction name, but actually moves right
          'inflow'
        ));
      }
      
      // Top road cars (outflow - moving left across top road)
      for (let i = 0; i < 4; i++) {
        carsRef.current.push(new Car(
          canvas.width + 100 - (i * 100) + Math.random() * 30,
          roadWidth/2, // Bottom lane
          'down', // Direction name, but actually moves right
          'outflow'
        ));
      }
      
      // Bottom road cars (inflow - moving left across bottom road)
      for (let i = 0; i < 6; i++) {
        carsRef.current.push(new Car(
          canvas.width + 100 - (i * 100) + Math.random() * 30,
          canvas.height - roadWidth/2, // Top lane
          'up', // Direction name, but actually moves left
          'inflow'
        ));
      }
      
      // Bottom road cars (outflow - moving right across bottom road)
      for (let i = 0; i < 4; i++) {
        carsRef.current.push(new Car(
          -100 + (i * 100) + Math.random() * 30,
          canvas.height - roadWidth/6, // Bottom lane
          'up', // Direction name, but actually moves left
          'outflow'
        ));
      }
      
      // Left road cars (inflow - moving down left road)
      for (let i = 0; i < 5; i++) {
        carsRef.current.push(new Car(
          roadWidth/6, // Left lane
          -100 + (i * 100) + Math.random() * 30,
          'right', // Direction name, but actually moves down
          'inflow'
        ));
      }
      
      // Left road cars (outflow - moving up left road)
      for (let i = 0; i < 3; i++) {
        carsRef.current.push(new Car(
          roadWidth/2, // Right lane
          canvas.height + 100 - (i * 100) + Math.random() * 30,
          'right', // Direction name, but actually moves down
          'outflow'
        ));
      }
      
      // Right road cars (inflow - moving up right road)
      for (let i = 0; i < 5; i++) {
        carsRef.current.push(new Car(
          canvas.width - roadWidth/2, // Left lane
          canvas.height + 100 - (i * 100) + Math.random() * 30,
          'left', // Direction name, but actually moves up
          'inflow'
        ));
      }
      
      // Right road cars (outflow - moving down right road)
      for (let i = 0; i < 3; i++) {
        carsRef.current.push(new Car(
          canvas.width - roadWidth/6, // Right lane
          -100 + (i * 100) + Math.random() * 30,
          'left', // Direction name, but actually moves up
          'outflow'
        ));
      }
      
      // Add some cars in parking areas (stationary)
      // General parking cars (left side)
      for (let i = 0; i < 3; i++) {
        carsRef.current.push(new Car(
          140 + (i % 2) * 40,
          160 + Math.floor(i / 2) * 30,
          'down', // stationary in parking
          'parked'
        ));
      }
      
      // VIP parking cars (right side)
      for (let i = 0; i < 3; i++) {
        carsRef.current.push(new Car(
          460 + (i % 2) * 40,
          160 + Math.floor(i / 2) * 30,
          'down', // stationary in parking
          'parked'
        ));
      }
    };

    // Animation loop
    const animate = (time = 0) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw buildings and parks first
      drawBuildingsAndParks(ctx);
      
      // Define layout constants
      const roadWidth = 80;
      const borderWidth = 20;
      const pandalArea = {
        x: roadWidth + borderWidth,
        y: roadWidth + borderWidth,
        width: canvas.width - 2 * (roadWidth + borderWidth),
        height: canvas.height - 2 * (roadWidth + borderWidth)
      };
      
      // Draw outer boundary
      ctx.fillStyle = '#2c3e50';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw unique roads based on layout
      drawUniqueRoads(ctx, roadWidth);
      
      // Draw main pandal area with unique shape
      ctx.fillStyle = '#27ae60';
      const shapeDrawer = shapeDrawers[layout.shape] || shapeDrawers.square;
      shapeDrawer(ctx, pandalArea.x, pandalArea.y, pandalArea.width, pandalArea.height);
      
      // Draw shops around the perimeter
      drawShops(ctx, pandalArea, roadWidth, borderWidth);
      
      // Draw enhanced entry and exit areas
      drawEnhancedEntryExit(ctx, pandalArea, roadWidth);
      
      // Draw parking areas
      drawParkingAreas(ctx, pandalArea);
      
      // Draw thakur image in the center
      if (thakurImageRef.current) {
        const thakurWidth = 160;
        const thakurHeight = 140;
        const thakurX = canvas.width/2 - thakurWidth/2;
        const thakurY = canvas.height/2 - thakurHeight/2;
        
        // Draw background for thakur
        ctx.fillStyle = '#8e44ad';
        ctx.fillRect(thakurX - 20, thakurY - 20, thakurWidth + 40, thakurHeight + 40);
        
        // Draw decorative border
        ctx.strokeStyle = '#f39c12';
        ctx.lineWidth = 4;
        ctx.strokeRect(thakurX - 20, thakurY - 20, thakurWidth + 40, thakurHeight + 40);
        
        // Draw thakur image
        ctx.drawImage(thakurImageRef.current, thakurX, thakurY, thakurWidth, thakurHeight);
      }
      
      // Draw moving arrows
      drawMovingArrows(ctx);
      
      // Update and draw cars
      carsRef.current.forEach(car => {
        car.update();
        car.draw(ctx);
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    loadCarAssets();
    loadRoadAssets();
    initializeCars();
    initializeArrows();
    animate();

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [pujoId]);

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        id="trafficCanvas"
        style={{
          border: '3px solid #34495e',
          borderRadius: '10px',
          background: '#ecf0f1'
        }}
      />
    </div>
  );
};

export default TrafficAnimation;
