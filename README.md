# 🎭 Durga Puja Tourism Website

A modern, interactive tourism website showcasing Durga Puja pandals in Baguiati with real-time traffic flow animations and parking area visualization.

## ✨ Features

- **Interactive Map**: Explore 8 Durga Puja pandal locations with custom markers
- **Traffic Animation**: Real-time 2D traffic flow simulation using vanilla JavaScript
- **Parking Areas**: Visual segregation of General and VIP parking zones
- **Responsive Design**: Modern UI/UX with beautiful gradients and animations
- **Detailed Information**: Comprehensive details about each pandal including features and descriptions

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Open in Browser**
   Navigate to `http://localhost:3000` to view the application

## 🗺️ Map Features

- **8 Pandal Locations**: All locations extracted from the provided spreadsheet data
- **Custom Markers**: Numbered markers with hover effects
- **Interactive Popups**: Click markers to see pandal information
- **Smooth Navigation**: Seamless routing between map and detail views

## 🚗 Traffic Animation

- **2D Canvas Animation**: Smooth traffic flow using HTML5 Canvas
- **Multiple Vehicle Types**: Pink, blue, and green cars with different styles
- **Realistic Movement**: Cars follow designated inflow and outflow paths
- **Parking Visualization**: Clear segregation of General and VIP parking areas
- **Dynamic Sprites**: Procedurally generated car sprites with different colors and types

## 🎨 Design Features

- **Modern UI**: Beautiful gradient backgrounds and glassmorphism effects
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Hover effects and transitions throughout the interface
- **Color-coded Elements**: Intuitive color scheme for different features

## 📱 Responsive Design

The website is fully responsive and optimized for:
- Desktop computers (1200px+)
- Tablets (768px - 1199px)
- Mobile devices (320px - 767px)

## 🛠️ Technical Stack

- **React 18**: Modern React with hooks and functional components
- **React Router**: Client-side routing for navigation
- **Leaflet**: Interactive map functionality
- **HTML5 Canvas**: 2D traffic animation
- **Vanilla JavaScript**: Custom animation logic
- **CSS3**: Modern styling with gradients and animations

## 📊 Data Structure

The application uses structured data from the provided spreadsheet including:
- Pandal names and descriptions
- GPS coordinates for entry/exit points
- Parking area locations
- Traffic flow patterns
- Feature lists for each pandal

## 🎯 Usage

1. **Explore the Map**: View all 8 pandal locations on the interactive map
2. **Click Markers**: Click on any numbered marker to see pandal details
3. **View Traffic**: Navigate to individual pandal pages to see traffic animations
4. **Understand Flow**: Observe inflow (red arrows) and outflow patterns
5. **Parking Areas**: Identify General (green) and VIP (yellow) parking zones

## 🔧 Customization

You can easily customize:
- **Colors**: Modify the color scheme in `src/App.css`
- **Traffic Patterns**: Update flow patterns in `src/data/pujoData.js`
- **Pandal Data**: Add or modify pandal information in the data file
- **Animation Speed**: Adjust car speeds in `TrafficAnimation.js`

## 📝 License

This project is created for educational and demonstration purposes.

## 🤝 Contributing

Feel free to contribute by:
- Adding more pandal locations
- Improving traffic animation algorithms
- Enhancing the UI/UX design
- Adding new features like real-time data integration

---

**Enjoy exploring the magnificent Durga Puja pandals of Baguiati! 🎉**
