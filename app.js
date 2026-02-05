// Global State
let selectedProducts = [];
let currentShopData = null;
let currentRouteView = 'map';
let isCheckedIn = false;
let visitStartTime = null;
let currentOrder = {
    items: [],
    subtotal: 0,
    discount: 0,
    gst: 0,
    netValue: 0
};
let isConfirmed = false;
let currentPaymentMode = 'credit';
let allOrders = []; // Will store all created orders
let allReturns = []; // Will store all return records

// Map variables
let map = null;
let routeLayers = {
    1: null,
    2: null,
    3: null,
    4: null
};
let shopMarkers = [];
let currentRoutePanelId = null;

// Product Database
const products = [
    {
        id: 1,
        name: "Coca Cola",
        sku: "BEV-001-500ML",
        variant: "500ml PET Bottle",
        category: "beverage",
        mrp: 40,
        distributorPrice: 35,
        availableStock: 850,
        tax: 12,
        scheme: { type: "10+2", minQty: 10, freeQty: 2 }
    },
    {
        id: 2,
        name: "Lays Classic",
        sku: "SNK-102-50G",
        variant: "50g Pack",
        category: "snacks",
        mrp: 25,
        distributorPrice: 20,
        availableStock: 650,
        tax: 12,
        scheme: { type: "12+3", minQty: 12, freeQty: 3 }
    },
    {
        id: 3,
        name: "Amul Milk",
        sku: "DRY-205-1L",
        variant: "1L Tetra Pack",
        category: "dairy",
        mrp: 60,
        distributorPrice: 52,
        availableStock: 320,
        tax: 5,
        scheme: null
    },
    {
        id: 4,
        name: "Maggi Noodles",
        sku: "PKF-330-70G",
        variant: "70g Pack",
        category: "snacks",
        mrp: 16,
        distributorPrice: 14,
        availableStock: 920,
        tax: 12,
        scheme: { type: "20+5", minQty: 20, freeQty: 5 }
    },
    {
        id: 5,
        name: "Parle-G Biscuits",
        sku: "SNK-205-100G",
        variant: "100g Pack",
        category: "snacks",
        mrp: 12,
        distributorPrice: 10,
        availableStock: 540,
        tax: 12,
        scheme: { type: "15+3", minQty: 15, freeQty: 3 }
    },
    {
        id: 6,
        name: "Thumbs Up",
        sku: "BEV-003-500ML",
        variant: "500ml PET Bottle",
        category: "beverage",
        mrp: 40,
        distributorPrice: 35,
        availableStock: 720,
        tax: 12,
        scheme: { type: "10+2", minQty: 10, freeQty: 2 }
    }
];

// Enhanced Route Data
const enhancedRouteData = {
    1: {
        name: 'Route 1 - North Pune',
        subtitle: 'Kothrud, Karve Nagar, Shivajinagar',
        stats: '18 shops • 25.5 km • 4.5 hrs',
        color: '#FF6B2C',
        status: 'active',
        priority: 'high',
        efficiency: 85,
        revenue: 120000,
        today: true,
        shops: [
            { seq: 1, name: 'SuperMart Express', address: 'Kothrud, Pune', distance: '0.5km', visited: true },
            { seq: 2, name: 'MedPlus Pharmacy', address: 'Karve Nagar, Pune', distance: '1.2km', visited: true },
            { seq: 3, name: 'Fresh Mart', address: 'Shivajinagar, Pune', distance: '2.8km', visited: true },
            { seq: 4, name: 'Daily Needs Store', address: 'FC Road, Pune', distance: '3.5km', visited: false },
            { seq: 5, name: 'Grocery Plus', address: 'JM Road, Pune', distance: '4.2km', visited: false },
            { seq: 6, name: 'More Supermarket', address: 'Deccan, Pune', distance: '5.1km', visited: false }
        ],
        timeline: [
            { time: '9:00 AM', shop: 'SuperMart Express', address: 'Kothrud', status: 'completed' },
            { time: '9:45 AM', shop: 'MedPlus Pharmacy', address: 'Karve Nagar', status: 'completed' },
            { time: '10:30 AM', shop: 'Fresh Mart', address: 'Shivajinagar', status: 'completed' },
            { time: '11:30 AM', shop: 'Daily Needs Store', address: 'FC Road', status: 'pending' },
            { time: '12:30 PM', shop: 'Grocery Plus', address: 'JM Road', status: 'pending' },
            { time: '1:30 PM', shop: 'More Supermarket', address: 'Deccan', status: 'pending' }
        ],
        summary: {
            completed: 3,
            pending: 3,
            distanceCovered: '8.5km',
            timeElapsed: '2.5hrs',
            remainingDistance: '17.0km',
            remainingTime: '2.0hrs'
        }
    },
    2: {
        name: 'Route 2 - East Pune',
        subtitle: 'Viman Nagar, Kharadi, Wagholi',
        stats: '15 shops • 18.2 km • 3.5 hrs',
        color: '#00D4AA',
        status: 'active',
        priority: 'medium',
        efficiency: 78,
        revenue: 95000,
        today: true,
        shops: [
            { seq: 1, name: 'Big Bazaar', address: 'Viman Nagar, Pune', distance: '0.8km', visited: true },
            { seq: 2, name: 'Reliance Fresh', address: 'Kharadi, Pune', distance: '2.1km', visited: true },
            { seq: 3, name: 'Spencer\'s', address: 'Wagholi, Pune', distance: '3.4km', visited: false },
            { seq: 4, name: 'DMart', address: 'Kalyani Nagar, Pune', distance: '4.2km', visited: false },
            { seq: 5, name: 'Star Bazaar', address: 'Koregaon Park, Pune', distance: '5.0km', visited: false }
        ],
        timeline: [
            { time: '10:00 AM', shop: 'Big Bazaar', address: 'Viman Nagar', status: 'completed' },
            { time: '10:50 AM', shop: 'Reliance Fresh', address: 'Kharadi', status: 'completed' },
            { time: '11:45 AM', shop: 'Spencer\'s', address: 'Wagholi', status: 'pending' },
            { time: '12:30 PM', shop: 'DMart', address: 'Kalyani Nagar', status: 'pending' },
            { time: '1:15 PM', shop: 'Star Bazaar', address: 'Koregaon Park', status: 'pending' }
        ],
        summary: {
            completed: 2,
            pending: 3,
            distanceCovered: '2.9km',
            timeElapsed: '1.8hrs',
            remainingDistance: '15.3km',
            remainingTime: '1.7hrs'
        }
    },
    3: {
        name: 'Route 3 - South Pune',
        subtitle: 'Katraj, Kondhwa, Hadapsar',
        stats: '16 shops • 22.8 km • 4 hrs',
        color: '#3B82F6',
        status: 'pending',
        priority: 'low',
        efficiency: 65,
        revenue: 85000,
        today: false,
        shops: [
            { seq: 1, name: 'Wholesale Hub', address: 'Katraj, Pune', distance: '1.5km', visited: false },
            { seq: 2, name: 'Metro Cash & Carry', address: 'Kondhwa, Pune', distance: '3.2km', visited: false },
            { seq: 3, name: 'Reliance Smart', address: 'Hadapsar, Pune', distance: '4.8km', visited: false },
            { seq: 4, name: 'Easy Day', address: 'Sasoon Road, Pune', distance: '5.5km', visited: false }
        ],
        summary: {
            completed: 0,
            pending: 4,
            distanceCovered: '0km',
            timeElapsed: '0hrs',
            remainingDistance: '22.8km',
            remainingTime: '4.0hrs'
        }
    },
    4: {
        name: 'Route 4 - West Pune',
        subtitle: 'Baner, Aundh, Hinjewadi',
        stats: '13 shops • 16.5 km • 3 hrs',
        color: '#FFA502',
        status: 'active',
        priority: 'high',
        efficiency: 92,
        revenue: 145000,
        today: true,
        shops: [
            { seq: 1, name: 'More Supermarket', address: 'Baner, Pune', distance: '0.7km', visited: true },
            { seq: 2, name: 'Nilgiris', address: 'Aundh, Pune', distance: '1.8km', visited: true },
            { seq: 3, name: 'Ratnadeep', address: 'Hinjewadi, Pune', distance: '3.2km', visited: true },
            { seq: 4, name: 'Spencers', address: 'Wakad, Pune', distance: '4.1km', visited: true },
            { seq: 5, name: 'Big Bazaar', address: 'Pimple Saudagar', distance: '5.0km', visited: true }
        ],
        timeline: [
            { time: '8:30 AM', shop: 'More Supermarket', address: 'Baner', status: 'completed' },
            { time: '9:15 AM', shop: 'Nilgiris', address: 'Aundh', status: 'completed' },
            { time: '10:00 AM', shop: 'Ratnadeep', address: 'Hinjewadi', status: 'completed' },
            { time: '10:45 AM', shop: 'Spencers', address: 'Wakad', status: 'completed' },
            { time: '11:30 AM', shop: 'Big Bazaar', address: 'Pimple Saudagar', status: 'completed' }
        ],
        summary: {
            completed: 5,
            pending: 0,
            distanceCovered: '14.8km',
            timeElapsed: '3.0hrs',
            remainingDistance: '1.7km',
            remainingTime: '0.2hrs'
        }
    }
};

// ==================== MAP FUNCTIONS ====================

// Initialize Real Map
function initializeRealMap() {
    if (!document.getElementById('realMap')) return;
    
    if (map) {
        // Map already exists, just update size
        map.invalidateSize();
        return map;
    }
    
    // Center on Pune
    const puneCenter = [18.5204, 73.8567];
    
    // Create map
    map = L.map('realMap').setView(puneCenter, 12);
    
    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);
    
    // Add Pune boundary
    const puneBounds = [
        [18.40, 73.75], // Southwest
        [18.65, 73.95]  // Northeast
    ];
    
    L.rectangle(puneBounds, {
        color: "#ff9933",
        weight: 2,
        fillOpacity: 0.05
    }).addTo(map).bindPopup('<strong>Pune City Area</strong>');
    
    // Add your location marker
    const userIcon = L.divIcon({
        className: 'user-marker',
        html: `<div style="background: #3498db; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 15px rgba(52,152,219,0.7); display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 14px;">👤</span>
              </div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
    
    L.marker([18.5204, 73.8567], { icon: userIcon })
        .addTo(map)
        .bindPopup('<strong>Your Current Location</strong><br>Central Pune')
        .openPopup();
    
    // Draw all routes
    drawRoute1();
    drawRoute2();
    drawRoute3();
    drawRoute4();
    
    // Add shops from all routes
    Object.keys(enhancedRouteData).forEach(routeId => {
        addShopsForRoute(parseInt(routeId));
    });
    
    // Set default toggles
    toggleRoute(1);
    toggleRoute(2);
    toggleRoute(4);
    
    showToast('🗺️ Pune map loaded with 4 delivery routes');
    
    return map;
}

// Draw Route 1 - North Pune (Kothrud area)
function drawRoute1() {
    const route1Coordinates = [
        [18.5079, 73.8079],  // Kothrud
        [18.5085, 73.8100],  // Karve Nagar
        [18.5110, 73.8170],  // Dahanukar Colony
        [18.5120, 73.8190],  // MIT College Area
        [18.5150, 73.8230],  // Vanaz Corner
        [18.5200, 73.8280],  // Paud Road
        [18.5240, 73.8350],  // Shivajinagar
        [18.5270, 73.8400],  // FC Road
        [18.5300, 73.8450]   // JM Road
    ];
    
    routeLayers[1] = L.polyline(route1Coordinates, {
        color: '#FF6B2C',
        weight: 5,
        opacity: 0.8,
        dashArray: '10, 10'
    });
    
    // Add route number marker
    const routeMarker1 = L.marker([18.5150, 73.8200]).addTo(map);
    routeMarker1.bindPopup(`
        <div style="min-width: 200px;">
            <h3 style="margin: 0 0 10px 0; color: #2c3e50;">Route 1 - North Pune</h3>
            <p style="margin: 5px 0;"><strong>Areas:</strong> Kothrud, Karve Nagar, Shivajinagar</p>
            <p style="margin: 5px 0;"><strong>Shops:</strong> 18 shops</p>
            <p style="margin: 5px 0;"><strong>Distance:</strong> 25.5 km</p>
            <p style="margin: 5px 0;"><strong>Duration:</strong> 4.5 hours</p>
            <button onclick="showRouteDetailsOnMap(1)" style="background: #FF6B2C; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-top: 10px;">
                View Details
            </button>
        </div>
    `).openPopup();
}

// Draw Route 2 - East Pune (Viman Nagar area)
function drawRoute2() {
    const route2Coordinates = [
        [18.5670, 73.9150],  // Viman Nagar
        [18.5520, 73.9050],  // Kalyani Nagar
        [18.5400, 73.9200],  // Koregaon Park
        [18.5300, 73.9350],  // Kharadi
        [18.5200, 73.9450],  // Wagholi
        [18.5100, 73.9500]   // Hadapsar
    ];
    
    routeLayers[2] = L.polyline(route2Coordinates, {
        color: '#00D4AA',
        weight: 5,
        opacity: 0.8,
        dashArray: '10, 10'
    });
    
    // Add route number marker
    const routeMarker2 = L.marker([18.5400, 73.9200]).addTo(map);
    routeMarker2.bindPopup(`
        <div style="min-width: 200px;">
            <h3 style="margin: 0 0 10px 0; color: #2c3e50;">Route 2 - East Pune</h3>
            <p style="margin: 5px 0;"><strong>Areas:</strong> Viman Nagar, Kharadi, Wagholi</p>
            <p style="margin: 5px 0;"><strong>Shops:</strong> 15 shops</p>
            <p style="margin: 5px 0;"><strong>Distance:</strong> 18.2 km</p>
            <p style="margin: 5px 0;"><strong>Duration:</strong> 3.5 hours</p>
            <button onclick="showRouteDetailsOnMap(2)" style="background: #00D4AA; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-top: 10px;">
                View Details
            </button>
        </div>
    `);
}

// Draw Route 3 - South Pune (Katraj area)
function drawRoute3() {
    const route3Coordinates = [
        [18.4450, 73.8550],  // Katraj
        [18.4600, 73.8700],  // Kondhwa
        [18.4750, 73.8850],  // Sasoon Road
        [18.4850, 73.9000],  // Hadapsar
        [18.4950, 73.9100]   // Undri
    ];
    
    routeLayers[3] = L.polyline(route3Coordinates, {
        color: '#3B82F6',
        weight: 5,
        opacity: 0.8,
        dashArray: '10, 10'
    });
    
    // Add route number marker
    const routeMarker3 = L.marker([18.4750, 73.8850]).addTo(map);
    routeMarker3.bindPopup(`
        <div style="min-width: 200px;">
            <h3 style="margin: 0 0 10px 0; color: #2c3e50;">Route 3 - South Pune</h3>
            <p style="margin: 5px 0;"><strong>Areas:</strong> Katraj, Kondhwa, Hadapsar</p>
            <p style="margin: 5px 0;"><strong>Shops:</strong> 16 shops</p>
            <p style="margin: 5px 0;"><strong>Distance:</strong> 22.8 km</p>
            <p style="margin: 5px 0;"><strong>Duration:</strong> 4 hours</p>
            <button onclick="showRouteDetailsOnMap(3)" style="background: #3B82F6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-top: 10px;">
                View Details
            </button>
        </div>
    `);
}

// Draw Route 4 - West Pune (Hinjewadi area)
function drawRoute4() {
    const route4Coordinates = [
        [18.5900, 73.7400],  // Hinjewadi Phase 1
        [18.5800, 73.7500],  // Hinjewadi Phase 2
        [18.5700, 73.7600],  // Wakad
        [18.5600, 73.7700],  // Balewadi
        [18.5500, 73.7800],  // Baner
        [18.5400, 73.7900],  // Aundh
        [18.5300, 73.8000]   // Pimple Saudagar
    ];
    
    routeLayers[4] = L.polyline(route4Coordinates, {
        color: '#FFA502',
        weight: 5,
        opacity: 0.8,
        dashArray: '10, 10'
    });
    
    // Add route number marker
    const routeMarker4 = L.marker([18.5700, 73.7600]).addTo(map);
    routeMarker4.bindPopup(`
        <div style="min-width: 200px;">
            <h3 style="margin: 0 0 10px 0; color: #2c3e50;">Route 4 - West Pune</h3>
            <p style="margin: 5px 0;"><strong>Areas:</strong> Baner, Aundh, Hinjewadi</p>
            <p style="margin: 5px 0;"><strong>Shops:</strong> 13 shops</p>
            <p style="margin: 5px 0;"><strong>Distance:</strong> 16.5 km</p>
            <p style="margin: 5px 0;"><strong>Duration:</strong> 3 hours</p>
            <button onclick="showRouteDetailsOnMap(4)" style="background: #FFA502; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-top: 10px;">
                View Details
            </button>
        </div>
    `);
}

// Add shops for a route
function addShopsForRoute(routeId) {
    const route = enhancedRouteData[routeId];
    if (!route) return;
    
    // Generate shop coordinates along the route
    route.shops.forEach((shop, index) => {
        // Create coordinates near route path
        let lat, lng;
        
        switch(routeId) {
            case 1: // North Pune
                lat = 18.5100 + (Math.random() * 0.02);
                lng = 73.8100 + (Math.random() * 0.03);
                break;
            case 2: // East Pune
                lat = 18.5400 + (Math.random() * 0.03);
                lng = 73.9200 + (Math.random() * 0.03);
                break;
            case 3: // South Pune
                lat = 18.4700 + (Math.random() * 0.02);
                lng = 73.8800 + (Math.random() * 0.02);
                break;
            case 4: // West Pune
                lat = 18.5700 + (Math.random() * 0.02);
                lng = 73.7500 + (Math.random() * 0.02);
                break;
            default:
                lat = 18.5204 + (Math.random() * 0.05 - 0.025);
                lng = 73.8567 + (Math.random() * 0.05 - 0.025);
        }
        
        const markerColor = shop.visited ? route.color : '#6c757d';
        const markerIcon = L.divIcon({
            className: 'shop-marker',
            html: `<div style="background: ${markerColor}; width: 15px; height: 15px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
            iconSize: [15, 15],
            iconAnchor: [7.5, 7.5]
        });
        
        const marker = L.marker([lat, lng], { icon: markerIcon });
        
        marker.bindPopup(`
            <div style="min-width: 200px;">
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                    <span style="background: ${route.color}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; margin-right: 8px;">
                        #${shop.seq}
                    </span>
                    <h3 style="margin: 0; color: #2c3e50;">${shop.name}</h3>
                </div>
                <p style="margin: 5px 0;"><strong>Address:</strong> ${shop.address}</p>
                <p style="margin: 5px 0;"><strong>Status:</strong> ${shop.visited ? 'Visited ✅' : 'Pending ⏱️'}</p>
                <p style="margin: 5px 0;"><strong>Distance:</strong> ${shop.distance}</p>
                <p style="margin: 5px 0;"><strong>Route:</strong> ${route.name}</p>
                <button onclick="centerOnShop(${lat}, ${lng})" style="background: ${route.color}; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-top: 8px;">
                    Center on Shop
                </button>
            </div>
        `);
        
        shopMarkers.push({ routeId, marker, shopName: shop.name });
    });
}

// Map Control Functions
function mapZoomIn() {
    if (map) {
        map.zoomIn();
        showToast('🗺️ Map zoomed in');
    }
}

function mapZoomOut() {
    if (map) {
        map.zoomOut();
        showToast('🗺️ Map zoomed out');
    }
}

function resetMapView() {
    if (map) {
        map.setView([18.5204, 73.8567], 12);
        showToast('🗺️ Map view reset to Pune center');
    }
}

function locateUser() {
    if (map) {
        // For demo, use Pune center. In real app, use geolocation API
        map.setView([18.5204, 73.8567], 15);
        showToast('📍 Centered on your location');
    }
}

function toggleRoute(routeId) {
    const checkbox = document.getElementById(`route${routeId}Toggle`);
    if (!map || !routeLayers[routeId]) return;
    
    if (checkbox.checked) {
        // Show route line
        map.addLayer(routeLayers[routeId]);
        
        // Show shop markers for this route
        shopMarkers.forEach(item => {
            if (item.routeId === routeId) {
                map.addLayer(item.marker);
            }
        });
        
        showToast(`Route ${routeId} shown on map`);
    } else {
        // Hide route line
        map.removeLayer(routeLayers[routeId]);
        
        // Hide shop markers for this route
        shopMarkers.forEach(item => {
            if (item.routeId === routeId) {
                map.removeLayer(item.marker);
            }
        });
        
        showToast(`Route ${routeId} hidden from map`);
    }
}

function centerOnShop(lat, lng) {
    if (map) {
        map.setView([lat, lng], 16);
        showToast('📍 Centered on shop location');
    }
}

function showAllRoutes() {
    [1, 2, 3, 4].forEach(routeId => {
        const checkbox = document.getElementById(`route${routeId}Toggle`);
        if (checkbox) {
            checkbox.checked = true;
            toggleRoute(routeId);
        }
    });
    showToast('🗺️ All routes shown');
}

// ==================== NAVIGATION FUNCTIONS ====================

function navigateTo(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    window.scrollTo(0, 0);
    
    // Initialize products when going to create order screen
    if (screenId === 'createOrderScreen') {
        initializeProductList();
        updateOrderSummary();
    }
    
    // Load orders when going to order management screen
    if (screenId === 'orderManagementScreen') {
        loadAllOrders();
    }
    
    // Load revenue data when going to revenue screen
    if (screenId === 'revenueScreen') {
        loadRevenueData();
    }
    
    // Load open orders data when going to open orders screen
    if (screenId === 'openOrdersScreen') {
        loadOpenOrdersData();
    }
    
    // Load enhanced route list when going to route screen
    if (screenId === 'routeScreen') {
        if (currentRouteView === 'list') {
            loadEnhancedRouteList();
        } else if (currentRouteView === 'map') {
            // Initialize map when going to route screen
            setTimeout(() => {
                initializeRealMap();
            }, 100);
        }
    }
    
    // Load returns when going to returns management screen
    if (screenId === 'returnsManagementScreen') {
        loadAllReturns();
    }
}

function setActiveNav(navId) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.getElementById(navId).classList.add('active');
}

// Order Management Navigation
function navigateToOrderManagement() {
    navigateTo('orderManagementScreen');
}

// Returns Management Navigation
function navigateToReturnsManagement() {
    navigateTo('returnsManagementScreen');
}

// ==================== ROUTE MANAGEMENT FUNCTIONS ====================

function switchRouteView(view) {
    currentRouteView = view;
    
    const mapView = document.getElementById('mapView');
    const listView = document.getElementById('listView');
    const mapViewBtn = document.getElementById('mapViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    
    if (mapView) mapView.style.display = view === 'map' ? 'block' : 'none';
    if (listView) listView.style.display = view === 'list' ? 'block' : 'none';
    
    if (mapViewBtn) mapViewBtn.classList.toggle('active', view === 'map');
    if (listViewBtn) listViewBtn.classList.toggle('active', view === 'list');
    
    if (view === 'map') {
        // Initialize map if not already done
        setTimeout(() => {
            if (!map) {
                initializeRealMap();
            } else {
                // Refresh map if already initialized
                map.invalidateSize();
            }
        }, 100);
    } else if (view === 'list') {
        loadEnhancedRouteList();
        closeRoutePanel();
    }
}

function showRouteDetailsOnMap(routeNumber) {
    const route = enhancedRouteData[routeNumber];
    if (!route) return;
    
    currentRoutePanelId = routeNumber;
    
    const panel = document.getElementById('routeDetailsPanel');
    const title = document.getElementById('panelRouteTitle');
    const shops = document.getElementById('panelShops');
    const distance = document.getElementById('panelDistance');
    const time = document.getElementById('panelTime');
    const shopsList = document.getElementById('panelShopsList');
    
    if (panel) {
        panel.classList.add('active');
        if (title) title.textContent = route.name;
        if (shops) shops.textContent = route.shops.length;
        if (distance) distance.textContent = route.stats.split('•')[1].trim();
        if (time) time.textContent = route.stats.split('•')[2].trim();
        
        if (shopsList) {
            shopsList.innerHTML = '';
            route.shops.slice(0, 5).forEach(shop => {
                const shopItem = document.createElement('div');
                shopItem.className = 'shop-item';
                shopItem.innerHTML = `
                    <div class="shop-sequence">#${shop.seq}</div>
                    <div class="shop-details">
                        <div class="shop-name">${shop.name}</div>
                        <div class="shop-address">${shop.address}</div>
                        ${shop.visited ? '<span class="shop-status visited">✓ Visited</span>' : '<span class="shop-status pending">⏱ Pending</span>'}
                    </div>
                `;
                shopsList.appendChild(shopItem);
            });
            
            if (route.shops.length > 5) {
                const moreItem = document.createElement('div');
                moreItem.style.textAlign = 'center';
                moreItem.style.padding = '10px';
                moreItem.style.color = 'var(--primary)';
                moreItem.style.cursor = 'pointer';
                moreItem.textContent = `+ ${route.shops.length - 5} more shops`;
                moreItem.onclick = () => showRouteDetailsModal();
                shopsList.appendChild(moreItem);
            }
        }
    }
    
    // Center map on this route
    if (map) {
        // Find center of route shops
        let totalLat = 0, totalLng = 0;
        shopMarkers.forEach(item => {
            if (item.routeId === routeNumber) {
                const latlng = item.marker.getLatLng();
                totalLat += latlng.lat;
                totalLng += latlng.lng;
            }
        });
        
        const centerLat = totalLat / route.shops.length;
        const centerLng = totalLng / route.shops.length;
        
        map.setView([centerLat || 18.5204, centerLng || 73.8567], 13);
    }
}

function closeRoutePanel() {
    const panel = document.getElementById('routeDetailsPanel');
    if (panel) panel.classList.remove('active');
    currentRoutePanelId = null;
}

// ==================== ORDER MANAGEMENT FUNCTIONS ====================

function loadAllOrders() {
    const noOrdersMessage = document.getElementById('noOrdersMessage');
    
    // Check if we have any orders in localStorage (or use sample data)
    const savedOrders = JSON.parse(localStorage.getItem('fmcg_orders')) || [];
    
    if (savedOrders.length === 0) {
        // Show sample orders for demonstration
        allOrders = getSampleOrders();
        localStorage.setItem('fmcg_orders', JSON.stringify(allOrders));
        if (noOrdersMessage) noOrdersMessage.style.display = 'block';
    } else {
        allOrders = savedOrders;
        if (noOrdersMessage) noOrdersMessage.style.display = 'none';
    }
    
    renderOrderList(allOrders);
}

function getSampleOrders() {
    return [
        {
            id: 'ORD-8821',
            shopName: 'SuperMart Express',
            shopId: 'SHOP-001',
            date: 'Jan 28, 2026',
            deliveryDate: 'Jan 30, 2026',
            status: 'processing',
            paymentMode: 'credit',
            subtotal: 24000,
            discount: 0,
            gst: 2880,
            netValue: 26880,
            items: [
                { name: 'Coca Cola', qty: 50, price: 35, total: 1750 },
                { name: 'Lays Classic', qty: 100, price: 20, total: 2000 },
                { name: 'Amul Milk', qty: 30, price: 52, total: 1560 }
            ],
            notes: 'Priority delivery requested'
        },
        {
            id: 'ORD-8820',
            shopName: 'MedPlus Pharmacy',
            shopId: 'SHOP-002',
            date: 'Jan 27, 2026',
            deliveryDate: 'Jan 29, 2026',
            status: 'delivered',
            paymentMode: 'cash',
            subtotal: 18500,
            discount: 1200,
            gst: 2220,
            netValue: 19520,
            items: [
                { name: 'Parle-G Biscuits', qty: 200, price: 10, total: 2000 },
                { name: 'Maggi Noodles', qty: 150, price: 14, total: 2100 }
            ],
            notes: 'Left with reception'
        },
        {
            id: 'ORD-8822',
            shopName: 'Big Bazaar',
            shopId: 'SHOP-003',
            date: 'Jan 28, 2026',
            deliveryDate: 'Jan 31, 2026',
            status: 'shipped',
            paymentMode: 'credit',
            subtotal: 32150,
            discount: 1500,
            gst: 3858,
            netValue: 34508,
            items: [
                { name: 'Thumbs Up', qty: 80, price: 35, total: 2800 },
                { name: 'Maggi Noodles', qty: 120, price: 14, total: 1680 }
            ],
            notes: 'Delivery to back entrance'
        },
        {
            id: 'ORD-8823',
            shopName: 'MedPlus Pharmacy',
            shopId: 'SHOP-002',
            date: 'Jan 29, 2026',
            deliveryDate: 'Feb 1, 2026',
            status: 'pending',
            paymentMode: 'upi',
            subtotal: 15600,
            discount: 800,
            gst: 1872,
            netValue: 16672,
            items: [
                { name: 'Parle-G Biscuits', qty: 150, price: 10, total: 1500 },
                { name: 'Amul Milk', qty: 25, price: 52, total: 1300 }
            ],
            notes: 'Morning delivery preferred'
        },
        {
            id: 'ORD-8824',
            shopName: 'Fresh Mart',
            shopId: 'SHOP-004',
            date: 'Jan 29, 2026',
            deliveryDate: 'Jan 30, 2026',
            status: 'processing',
            paymentMode: 'credit',
            subtotal: 18450,
            discount: 0,
            gst: 2214,
            netValue: 20664,
            items: [
                { name: 'Coca Cola', qty: 40, price: 35, total: 1400 },
                { name: 'Lays Classic', qty: 75, price: 20, total: 1500 }
            ],
            notes: 'Urgent delivery'
        },
        {
            id: 'ORD-8825',
            shopName: 'SuperMart Express',
            shopId: 'SHOP-001',
            date: 'Jan 30, 2026',
            deliveryDate: 'Feb 2, 2026',
            status: 'pending',
            paymentMode: 'cash',
            subtotal: 21500,
            discount: 1200,
            gst: 2580,
            netValue: 22880,
            items: [
                { name: 'Thumbs Up', qty: 60, price: 35, total: 2100 },
                { name: 'Maggi Noodles', qty: 100, price: 14, total: 1400 }
            ],
            notes: 'Weekend delivery'
        }
    ];
}

function renderOrderList(orders) {
    const orderList = document.getElementById('globalOrderList');
    const noOrdersMessage = document.getElementById('noOrdersMessage');
    
    if (!orderList) return;
    
    if (orders.length === 0) {
        if (noOrdersMessage) {
            noOrdersMessage.style.display = 'block';
            orderList.innerHTML = '';
            orderList.appendChild(noOrdersMessage);
        }
        return;
    }
    
    if (noOrdersMessage) noOrdersMessage.style.display = 'none';
    orderList.innerHTML = '';
    
    orders.forEach(order => {
        const orderItem = createOrderListItem(order);
        orderList.appendChild(orderItem);
    });
}

function createOrderListItem(order) {
    const div = document.createElement('div');
    div.className = 'order-item';
    
    // Status color mapping
    const statusColors = {
        'pending': 'var(--warning)',
        'processing': 'var(--primary)',
        'shipped': 'var(--info)',
        'delivered': 'var(--accent)',
        'cancelled': 'var(--danger)'
    };
    
    const statusLabels = {
        'pending': 'Pending',
        'processing': 'Processing',
        'shipped': 'Shipped',
        'delivered': 'Delivered',
        'cancelled': 'Cancelled'
    };
    
    div.style.borderLeftColor = statusColors[order.status] || statusColors.pending;
    
    // Get first 3 items for display
    const displayItems = order.items.slice(0, 3);
    const hasMoreItems = order.items.length > 3;
    
    div.innerHTML = `
        <div class="order-header">
            <div>
                <div class="order-id">${order.id}</div>
                <div class="order-shop">${order.shopName}</div>
            </div>
            <span class="order-status">${statusLabels[order.status]}</span>
        </div>
        
        <div class="order-items-preview">
            ${displayItems.map(item => `
                <div class="order-item-preview">
                    <span class="item-name">${item.name}</span>
                    <span class="item-qty">${item.qty} × ₹${item.price}</span>
                </div>
            `).join('')}
            
            ${hasMoreItems ? `
                <div class="more-items">
                    +${order.items.length - 3} more items
                </div>
            ` : ''}
        </div>
        
        <div class="order-total">
            <span class="order-total-label">Total:</span>
            <span class="order-total-value">₹${order.netValue.toLocaleString('en-IN')}</span>
        </div>
        
        <div class="order-meta">
            <span>📅 ${order.date}</span>
            <span>🏪 ${order.shopName}</span>
        </div>
        
        <div class="order-actions">
            <button class="order-action-btn view-btn" onclick="viewOrderDetails('${order.id}')">
                👁️ View Details
            </button>
            <button class="order-action-btn edit-btn" onclick="editOrder('${order.id}')">
                ✏️ Edit Order
            </button>
        </div>
    `;
    
    return div;
}

function editOrder(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;
    
    showToast(`✏️ Edit order #${orderId} feature coming soon!`);
    
    // For now, navigate to create order screen
    navigateTo('createOrderScreen');
}

function filterOrders(filterValue) {
    // First, update the active state of filter chips
    document.querySelectorAll('#orderManagementScreen .filter-chip').forEach(chip => {
        chip.classList.remove('active');
    });
    
    // Find and activate the clicked chip
    const chips = document.querySelectorAll('#orderManagementScreen .filter-chip');
    chips.forEach(chip => {
        if (chip.textContent.toLowerCase().includes(filterValue.toLowerCase())) {
            chip.classList.add('active');
        }
    });
    
    let filteredOrders = [];
    
    if (filterValue === 'all') {
        filteredOrders = allOrders;
    } else {
        // Map filter values to status values
        const statusMap = {
            'pending': 'pending',
            'processing': 'processing',
            'shipped': 'shipped',
            'delivered': 'delivered',
            'cancelled': 'cancelled',
            'placed': 'pending' // Assuming 'placed' is same as 'pending'
        };
        
        const status = statusMap[filterValue];
        if (status) {
            filteredOrders = allOrders.filter(order => order.status === status);
        } else {
            filteredOrders = allOrders;
        }
    }
    
    renderOrderList(filteredOrders);
}

function searchOrders() {
    const searchTerm = document.getElementById('orderSearch').value.toLowerCase();
    
    const filteredOrders = allOrders.filter(order => {
        return order.id.toLowerCase().includes(searchTerm) ||
               order.shopName.toLowerCase().includes(searchTerm);
    });
    
    renderOrderList(filteredOrders);
}

function viewOrderDetails(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;
    
    // Update modal content
    const modalOrderId = document.getElementById('modalOrderId');
    const modalShopName = document.getElementById('modalShopName');
    const modalOrderDate = document.getElementById('modalOrderDate');
    const modalDeliveryDate = document.getElementById('modalDeliveryDate');
    const modalOrderStatus = document.getElementById('modalOrderStatus');
    const modalPaymentMode = document.getElementById('modalPaymentMode');
    
    if (modalOrderId) modalOrderId.textContent = order.id;
    if (modalShopName) modalShopName.textContent = order.shopName;
    if (modalOrderDate) modalOrderDate.textContent = order.date;
    if (modalDeliveryDate) modalDeliveryDate.textContent = order.deliveryDate;
    
    const statusLabels = {
        'pending': 'Pending',
        'processing': 'Processing',
        'shipped': 'Shipped',
        'delivered': 'Delivered',
        'cancelled': 'Cancelled'
    };
    
    if (modalOrderStatus) modalOrderStatus.textContent = statusLabels[order.status];
    if (modalPaymentMode) modalPaymentMode.textContent = order.paymentMode.toUpperCase();
    
    // Update order items
    const itemsList = document.getElementById('modalOrderItems');
    if (itemsList) {
        itemsList.innerHTML = '';
        
        order.items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'modal-order-item';
            itemDiv.innerHTML = `
                <div class="modal-order-item-name">${item.name}</div>
                <div class="modal-order-item-details">
                    <span>${item.qty} × ₹${item.price}</span>
                    <span>₹${item.total.toLocaleString('en-IN')}</span>
                </div>
            `;
            itemsList.appendChild(itemDiv);
        });
    }
    
    // Update totals
    const modalSubtotal = document.getElementById('modalSubtotal');
    const modalDiscount = document.getElementById('modalDiscount');
    const modalGST = document.getElementById('modalGST');
    const modalTotal = document.getElementById('modalTotal');
    
    if (modalSubtotal) modalSubtotal.textContent = `₹${order.subtotal.toLocaleString('en-IN')}`;
    if (modalDiscount) modalDiscount.textContent = `-₹${order.discount.toLocaleString('en-IN')}`;
    if (modalGST) modalGST.textContent = `₹${order.gst.toLocaleString('en-IN')}`;
    if (modalTotal) modalTotal.textContent = `₹${order.netValue.toLocaleString('en-IN')}`;
    
    // Update notes
    const modalNotes = document.getElementById('modalNotes');
    if (modalNotes) modalNotes.textContent = order.notes || 'No notes';
    
    // Show modal
    const orderDetailsModal = document.getElementById('orderDetailsModal');
    if (orderDetailsModal) orderDetailsModal.classList.add('active');
}

function updateOrderStatusModal(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;
    
    const updateOrderIdElement = document.getElementById('updateOrderId');
    if (updateOrderIdElement) updateOrderIdElement.textContent = order.id;
    
    const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    const statusLabels = {
        'pending': 'Pending',
        'processing': 'Processing',
        'shipped': 'Shipped',
        'delivered': 'Delivered',
        'cancelled': 'Cancelled'
    };
    
    const optionsList = document.getElementById('statusOptionsList');
    if (optionsList) {
        optionsList.innerHTML = '';
        
        statusOptions.forEach(status => {
            const optionDiv = document.createElement('div');
            optionDiv.className = `status-option ${order.status === status ? 'selected' : ''}`;
            optionDiv.onclick = () => selectStatusOption(status);
            
            optionDiv.innerHTML = `
                <div class="status-indicator" style="background: ${getStatusColor(status)}"></div>
                <span>${statusLabels[status]}</span>
                ${order.status === status ? '<span class="current-status">Current</span>' : ''}
            `;
            
            optionsList.appendChild(optionDiv);
        });
    }
    
    const updateStatusModal = document.getElementById('updateStatusModal');
    if (updateStatusModal) updateStatusModal.classList.add('active');
}

function getStatusColor(status) {
    const colors = {
        'pending': 'var(--warning)',
        'processing': 'var(--primary)',
        'shipped': 'var(--info)',
        'delivered': 'var(--accent)',
        'cancelled': 'var(--danger)'
    };
    return colors[status] || colors.pending;
}

function selectStatusOption(status) {
    // Remove 'selected' class from all options
    document.querySelectorAll('.status-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Find and select the clicked option
    const optionsList = document.getElementById('statusOptionsList');
    if (optionsList) {
        const options = optionsList.querySelectorAll('.status-option');
        options.forEach(option => {
            if (option.querySelector('span').textContent.toLowerCase() === status) {
                option.classList.add('selected');
            }
        });
    }
}

function confirmStatusUpdate() {
    const updateOrderIdElement = document.getElementById('updateOrderId');
    if (!updateOrderIdElement) return;
    
    const orderId = updateOrderIdElement.textContent;
    const selectedOption = document.querySelector('.status-option.selected');
    const notesElement = document.getElementById('statusNotes');
    const notes = notesElement ? notesElement.value : '';
    
    if (!selectedOption) {
        showToast('⚠️ Please select a status');
        return;
    }
    
    const statusText = selectedOption.querySelector('span').textContent.toLowerCase();
    const statusMap = {
        'pending': 'pending',
        'processing': 'processing',
        'shipped': 'shipped',
        'delivered': 'delivered',
        'cancelled': 'cancelled'
    };
    
    const status = statusMap[statusText] || 'pending';
    const orderIndex = allOrders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1) {
        allOrders[orderIndex].status = status;
        if (notes) {
            allOrders[orderIndex].notes = notes;
        }
        
        // Save to localStorage
        localStorage.setItem('fmcg_orders', JSON.stringify(allOrders));
        
        // Refresh the list
        renderOrderList(allOrders);
        
        // Close modal
        closeUpdateStatusModal();
        
        showToast(`✓ Order ${orderId} updated to ${statusText}`);
    }
}

function closeUpdateStatusModal() {
    const updateStatusModal = document.getElementById('updateStatusModal');
    if (updateStatusModal) updateStatusModal.classList.remove('active');
    
    const statusNotes = document.getElementById('statusNotes');
    if (statusNotes) statusNotes.value = '';
}

// ==================== RETURNS MANAGEMENT FUNCTIONS ====================

function loadAllReturns() {
    const noReturnsMessage = document.getElementById('noReturnsMessage');
    
    // Check if we have any returns in localStorage
    const savedReturns = JSON.parse(localStorage.getItem('fmcg_returns')) || [];
    
    if (savedReturns.length === 0) {
        // Show sample returns for demonstration
        allReturns = getSampleReturns();
        localStorage.setItem('fmcg_returns', JSON.stringify(allReturns));
        if (noReturnsMessage) noReturnsMessage.style.display = 'block';
    } else {
        allReturns = savedReturns;
        if (noReturnsMessage) noReturnsMessage.style.display = 'none';
    }
    
    renderReturnsList(allReturns);
}

function getSampleReturns() {
    return [
        {
            id: 'RET-1001',
            orderId: 'ORD-8820',
            shopName: 'MedPlus Pharmacy',
            date: 'Jan 29, 2026',
            reason: 'Damaged Goods',
            status: 'approved',
            items: [
                { name: 'Parle-G Biscuits', qty: 10, reason: 'Damaged packaging', status: 'approved' },
                { name: 'Maggi Noodles', qty: 5, reason: 'Expired stock', status: 'approved' }
            ],
            refundAmount: 2800,
            refundStatus: 'pending',
            notes: 'Items collected from shop on Jan 30'
        },
        {
            id: 'RET-1002',
            orderId: 'ORD-8822',
            shopName: 'Big Bazaar',
            date: 'Jan 28, 2026',
            reason: 'Wrong Quantity Delivered',
            status: 'pending',
            items: [
                { name: 'Thumbs Up', qty: 3, reason: 'Extra quantity', status: 'pending' }
            ],
            refundAmount: 105,
            refundStatus: 'not_initiated',
            notes: 'Need to verify with delivery team'
        },
        {
            id: 'RET-1003',
            orderId: 'ORD-8819',
            shopName: 'Fresh Mart',
            date: 'Jan 27, 2026',
            reason: 'Customer Return',
            status: 'completed',
            items: [
                { name: 'Coca Cola', qty: 8, reason: 'Customer refused', status: 'returned' },
                { name: 'Lays Classic', qty: 4, reason: 'Quality issue', status: 'returned' }
            ],
            refundAmount: 420,
            refundStatus: 'processed',
            notes: 'Refund issued via credit note'
        },
        {
            id: 'RET-1004',
            orderId: 'ORD-8818',
            shopName: 'SuperMart Express',
            date: 'Jan 26, 2026',
            reason: 'Expired Products',
            status: 'rejected',
            items: [
                { name: 'Amul Milk', qty: 2, reason: 'Near expiry', status: 'rejected' }
            ],
            refundAmount: 104,
            refundStatus: 'not_applicable',
            notes: 'Products within acceptable expiry range'
        }
    ];
}

function renderReturnsList(returns) {
    const returnsList = document.getElementById('globalReturnsList');
    const noReturnsMessage = document.getElementById('noReturnsMessage');
    
    if (!returnsList) return;
    
    if (returns.length === 0) {
        if (noReturnsMessage) {
            noReturnsMessage.style.display = 'block';
            returnsList.innerHTML = '';
            returnsList.appendChild(noReturnsMessage);
        }
        return;
    }
    
    if (noReturnsMessage) noReturnsMessage.style.display = 'none';
    returnsList.innerHTML = '';
    
    returns.forEach(returnItem => {
        const returnListItem = createReturnListItem(returnItem);
        returnsList.appendChild(returnListItem);
    });
}

function createReturnListItem(returnItem) {
    const div = document.createElement('div');
    div.className = 'order-item';
    
    // Status color mapping
    const statusColors = {
        'pending': 'var(--warning)',
        'approved': 'var(--info)',
        'completed': 'var(--accent)',
        'rejected': 'var(--danger)'
    };
    
    const statusLabels = {
        'pending': 'Pending',
        'approved': 'Approved',
        'completed': 'Completed',
        'rejected': 'Rejected'
    };
    
    div.style.borderLeftColor = statusColors[returnItem.status] || statusColors.pending;
    
    // Get first 2 items for display
    const displayItems = returnItem.items.slice(0, 2);
    const hasMoreItems = returnItem.items.length > 2;
    
    div.innerHTML = `
        <div class="order-header">
            <div>
                <div class="order-id">${returnItem.id}</div>
                <div class="order-shop">${returnItem.shopName}</div>
            </div>
            <span class="order-status">${statusLabels[returnItem.status]}</span>
        </div>
        
        <div class="order-items-preview">
            ${displayItems.map(item => `
                <div class="order-item-preview">
                    <span class="item-name">${item.name}</span>
                    <span class="item-qty">${item.qty} units</span>
                </div>
            `).join('')}
            
            ${hasMoreItems ? `
                <div class="more-items">
                    +${returnItem.items.length - 2} more items
                </div>
            ` : ''}
        </div>
        
        <div class="order-total">
            <span class="order-total-label">Refund Amount:</span>
            <span class="order-total-value">₹${returnItem.refundAmount.toLocaleString('en-IN')}</span>
        </div>
        
        <div class="order-meta">
            <span>📅 ${returnItem.date}</span>
            <span>📋 ${returnItem.reason}</span>
        </div>
        
        <div class="order-actions">
            <button class="order-action-btn view-btn" onclick="viewReturnDetails('${returnItem.id}')">
                👁️ View Details
            </button>
            <button class="order-action-btn edit-btn" onclick="processReturn('${returnItem.id}')">
                ⚙️ Process
            </button>
        </div>
    `;
    
    return div;
}

function filterReturns(filterValue) {
    // First, update the active state of filter chips
    document.querySelectorAll('#returnsManagementScreen .filter-chip').forEach(chip => {
        chip.classList.remove('active');
    });
    
    // Find and activate the clicked chip
    const chips = document.querySelectorAll('#returnsManagementScreen .filter-chip');
    chips.forEach(chip => {
        if (chip.textContent.toLowerCase().includes(filterValue.toLowerCase())) {
            chip.classList.add('active');
        }
    });
    
    let filteredReturns = [];
    
    if (filterValue === 'all') {
        filteredReturns = allReturns;
    } else {
        filteredReturns = allReturns.filter(returnItem => returnItem.status === filterValue);
    }
    
    renderReturnsList(filteredReturns);
}

function searchReturns() {
    const searchTerm = document.getElementById('returnSearch').value.toLowerCase();
    
    const filteredReturns = allReturns.filter(returnItem => {
        return returnItem.id.toLowerCase().includes(searchTerm) ||
               returnItem.shopName.toLowerCase().includes(searchTerm) ||
               returnItem.orderId.toLowerCase().includes(searchTerm);
    });
    
    renderReturnsList(filteredReturns);
}

function viewReturnDetails(returnId) {
    const returnItem = allReturns.find(r => r.id === returnId);
    if (!returnItem) return;
    
    // Create or get the returns modal
    let returnsModal = document.getElementById('returnsDetailsModal');
    
    // Create modal if it doesn't exist
    if (!returnsModal) {
        returnsModal = document.createElement('div');
        returnsModal.id = 'returnsDetailsModal';
        returnsModal.className = 'modal-overlay';
        returnsModal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <div>
                        <div class="modal-title">Return Details</div>
                        <div class="modal-subtitle" id="modalReturnId">${returnItem.id}</div>
                    </div>
                    <button class="modal-close" onclick="closeReturnsModal()">✕</button>
                </div>
                <div class="modal-body">
                    <div class="order-info-grid">
                        <div class="order-info-item">
                            <span class="order-info-label">Shop</span>
                            <span class="order-info-value" id="modalReturnShopName">${returnItem.shopName}</span>
                        </div>
                        <div class="order-info-item">
                            <span class="order-info-label">Order ID</span>
                            <span class="order-info-value" id="modalReturnOrderId">${returnItem.orderId}</span>
                        </div>
                        <div class="order-info-item">
                            <span class="order-info-label">Return Date</span>
                            <span class="order-info-value" id="modalReturnDate">${returnItem.date}</span>
                        </div>
                        <div class="order-info-item">
                            <span class="order-info-label">Reason</span>
                            <span class="order-info-value" id="modalReturnReason">${returnItem.reason}</span>
                        </div>
                        <div class="order-info-item">
                            <span class="order-info-label">Status</span>
                            <span class="order-info-value" id="modalReturnStatus">${returnItem.status}</span>
                        </div>
                        <div class="order-info-item">
                            <span class="order-info-label">Refund Status</span>
                            <span class="order-info-value" id="modalRefundStatus">${returnItem.refundStatus}</span>
                        </div>
                    </div>
                    
                    <div class="modal-section">
                        <div class="section-title">Return Items</div>
                        <div class="order-items-list" id="modalReturnItems">
                            <!-- Items will be populated here -->
                        </div>
                    </div>
                    
                    <div class="modal-section">
                        <div class="section-title">Refund Summary</div>
                        <div class="order-summary">
                            <div class="summary-row total">
                                <span>Refund Amount</span>
                                <span id="modalRefundAmount">₹${returnItem.refundAmount.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-section">
                        <div class="section-title">Notes</div>
                        <div class="order-notes" id="modalReturnNotes">
                            ${returnItem.notes || 'No notes'}
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="modal-btn secondary" onclick="closeReturnsModal()">
                            Close
                        </button>
                        <button class="modal-btn primary" onclick="processReturn('${returnItem.id}')">
                            ⚙️ Process Return
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(returnsModal);
    }
    
    // Update modal content dynamically
    document.getElementById('modalReturnId').textContent = returnItem.id;
    document.getElementById('modalReturnShopName').textContent = returnItem.shopName;
    document.getElementById('modalReturnOrderId').textContent = returnItem.orderId;
    document.getElementById('modalReturnDate').textContent = returnItem.date;
    document.getElementById('modalReturnReason').textContent = returnItem.reason;
    document.getElementById('modalReturnStatus').textContent = returnItem.status;
    document.getElementById('modalRefundStatus').textContent = returnItem.refundStatus;
    document.getElementById('modalRefundAmount').textContent = `₹${returnItem.refundAmount.toLocaleString('en-IN')}`;
    document.getElementById('modalReturnNotes').textContent = returnItem.notes || 'No notes';
    
    // Update return items
    const itemsList = document.getElementById('modalReturnItems');
    if (itemsList) {
        itemsList.innerHTML = '';
        
        returnItem.items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'modal-order-item';
            itemDiv.innerHTML = `
                <div class="modal-order-item-name">${item.name}</div>
                <div class="modal-order-item-details">
                    <span>${item.qty} units</span>
                    <span>${item.reason}</span>
                    <span class="item-status ${item.status}">${item.status}</span>
                </div>
            `;
            itemsList.appendChild(itemDiv);
        });
    }
    
    // Update process button
    const processBtn = returnsModal.querySelector('.modal-btn.primary');
    if (processBtn) {
        processBtn.onclick = () => processReturn(returnItem.id);
    }
    
    // Show modal
    returnsModal.classList.add('active');
}

function closeReturnsModal() {
    const returnsModal = document.getElementById('returnsDetailsModal');
    if (returnsModal) returnsModal.classList.remove('active');
}

function processReturn(returnId) {
    const returnItem = allReturns.find(r => r.id === returnId);
    if (!returnItem) return;
    
    // Simple processing logic
    if (returnItem.status === 'pending') {
        returnItem.status = 'approved';
        returnItem.refundStatus = 'pending';
        showToast(`✅ Return ${returnId} approved for processing`);
    } else if (returnItem.status === 'approved') {
        returnItem.status = 'completed';
        returnItem.refundStatus = 'processed';
        showToast(`✅ Return ${returnId} marked as completed`);
    } else {
        showToast(`ℹ️ Return ${returnId} is already ${returnItem.status}`);
    }
    
    // Save updated returns
    localStorage.setItem('fmcg_returns', JSON.stringify(allReturns));
    
    // Refresh the list
    renderReturnsList(allReturns);
    
    // Close modal if open
    closeReturnsModal();
}

// ==================== REVENUE & OPEN ORDERS FUNCTIONS ====================

// Navigate to revenue details
function navigateToRevenueDetails() {
    navigateTo('revenueScreen');
}

// Navigate to open orders details
function navigateToOpenOrdersDetails() {
    navigateTo('openOrdersScreen');
}

// Load revenue data
function loadRevenueData() {
    // In a real app, this would fetch data from an API
    // For now, we'll use the sample orders data
    const monthlyOrders = allOrders.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate.getMonth() === 0 && orderDate.getFullYear() === 2026; // January 2026
    });
    
    const totalRevenue = monthlyOrders.reduce((sum, order) => sum + order.netValue, 0);
    
    // Update UI
    updateRevenueMetrics(monthlyOrders, totalRevenue);
    
    // Calculate category breakdown
    const categoryBreakdown = {
        'beverage': 42170,
        'snacks': 30122,
        'dairy': 24098,
        'personal-care': 18073,
        'household': 6026
    };
    
    updateCategoryChart(categoryBreakdown, totalRevenue);
    updateTopShops(monthlyOrders);
}

function updateCategoryChart(categoryBreakdown, totalRevenue) {
    const categoryChart = document.querySelector('.category-chart');
    if (!categoryChart) return;
    
    const categories = [
        { name: '🥤 Beverages', key: 'beverage', color: 'var(--primary)' },
        { name: '🍿 Snacks', key: 'snacks', color: 'var(--accent)' },
        { name: '🥛 Dairy', key: 'dairy', color: 'var(--info)' },
        { name: '🧴 Personal Care', key: 'personal-care', color: 'var(--warning)' },
        { name: '🧹 Household', key: 'household', color: 'var(--danger)' }
    ];
    
    categoryChart.innerHTML = '';
    
    categories.forEach(category => {
        const revenue = categoryBreakdown[category.key] || 0;
        const percentage = totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0;
        
        const chartItem = document.createElement('div');
        chartItem.className = 'chart-item';
        chartItem.innerHTML = `
            <div class="chart-bar" style="width: ${percentage}%; background: ${category.color};"></div>
            <div class="chart-label">
                <span>${category.name}</span>
                <span>₹${Math.round(revenue).toLocaleString('en-IN')} (${percentage.toFixed(1)}%)</span>
            </div>
        `;
        categoryChart.appendChild(chartItem);
    });
}

function updateTopShops(monthlyOrders) {
    const topShopsList = document.querySelector('.top-shops-list');
    if (!topShopsList) return;
    
    // Calculate revenue by shop
    const shopRevenue = {};
    monthlyOrders.forEach(order => {
        if (!shopRevenue[order.shopName]) {
            shopRevenue[order.shopName] = 0;
        }
        shopRevenue[order.shopName] += order.netValue;
    });
    
    // Convert to array and sort
    const topShops = Object.entries(shopRevenue)
        .map(([shopName, revenue]) => ({ shopName, revenue }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);
    
    const totalRevenue = topShops.reduce((sum, shop) => sum + shop.revenue, 0);
    
    topShopsList.innerHTML = '';
    
    topShops.forEach((shop, index) => {
        const percentage = totalRevenue > 0 ? (shop.revenue / totalRevenue) * 100 : 0;
        const shopLocation = getShopLocation(shop.shopName);
        
        const shopItem = document.createElement('div');
        shopItem.className = 'shop-revenue-item';
        shopItem.innerHTML = `
            <div class="shop-rank">${index + 1}</div>
            <div class="shop-info">
                <div class="shop-name">${shop.shopName}</div>
                <div class="shop-location">${shopLocation}</div>
            </div>
            <div class="shop-revenue">
                <div class="revenue-amount">₹${Math.round(shop.revenue).toLocaleString('en-IN')}</div>
                <div class="revenue-percent">${percentage.toFixed(1)}%</div>
            </div>
        `;
        topShopsList.appendChild(shopItem);
    });
}

function getShopLocation(shopName) {
    const shopLocations = {
        'SuperMart Express': 'Koramangala',
        'MedPlus Pharmacy': 'Indiranagar',
        'Big Bazaar': 'Whitefield',
        'Fresh Mart': 'HSR Layout',
        'Wholesale Hub': 'Electronic City'
    };
    return shopLocations[shopName] || 'Unknown';
}

function updateRevenueMetrics(monthlyOrders, totalRevenue) {
    // Update total orders
    const totalOrdersEl = document.querySelector('.metric-card:nth-child(1) .metric-value');
    if (totalOrdersEl) totalOrdersEl.textContent = monthlyOrders.length;
    
    // Update active shops
    const uniqueShops = new Set(monthlyOrders.map(order => order.shopName));
    const activeShopsEl = document.querySelector('.metric-card:nth-child(2) .metric-value');
    if (activeShopsEl) activeShopsEl.textContent = uniqueShops.size;
    
    // Update average order value
    const avgOrderValue = monthlyOrders.length > 0 ? totalRevenue / monthlyOrders.length : 0;
    const avgOrderValueEl = document.querySelector('.metric-card:nth-child(3) .metric-value');
    if (avgOrderValueEl) avgOrderValueEl.textContent = '₹' + Math.round(avgOrderValue).toLocaleString('en-IN');
    
    // Update growth rate (simulated)
    const growthRateEl = document.querySelector('.metric-card:nth-child(4) .metric-value');
    if (growthRateEl) growthRateEl.textContent = '12.5%';
    
    // Update payment methods breakdown
    updatePaymentMethods(monthlyOrders, totalRevenue);
}

function updatePaymentMethods(monthlyOrders, totalRevenue) {
    const paymentMethods = {
        'credit': 0,
        'cash': 0,
        'upi': 0
    };
    
    monthlyOrders.forEach(order => {
        if (paymentMethods[order.paymentMode] !== undefined) {
            paymentMethods[order.paymentMode] += order.netValue;
        }
    });
    
    const paymentMethodsContainer = document.querySelector('.payment-methods');
    if (paymentMethodsContainer) {
        paymentMethodsContainer.innerHTML = '';
        
        Object.entries(paymentMethods).forEach(([method, amount]) => {
            const percentage = totalRevenue > 0 ? (amount / totalRevenue) * 100 : 0;
            const icons = {
                'credit': '💳',
                'cash': '💵',
                'upi': '📱'
            };
            
            const methodDiv = document.createElement('div');
            methodDiv.className = 'payment-method';
            methodDiv.innerHTML = `
                <div class="payment-icon">${icons[method] || '💰'}</div>
                <div class="payment-info">
                    <div class="payment-name">${method.charAt(0).toUpperCase() + method.slice(1)}</div>
                    <div class="payment-stats">₹${Math.round(amount).toLocaleString('en-IN')} (${percentage.toFixed(0)}%)</div>
                </div>
            `;
            paymentMethodsContainer.appendChild(methodDiv);
        });
    }
}

// Load open orders data
function loadOpenOrdersData() {
    // Get open orders (pending and processing)
    const openOrders = allOrders.filter(order => 
        order.status === 'pending' || order.status === 'processing' || order.status === 'shipped'
    );
    
    // Update open orders count
    const ordersSummaryValue = document.querySelector('.orders-summary-value');
    if (ordersSummaryValue) ordersSummaryValue.textContent = openOrders.length;
    
    // Update subtitle
    const subtitle = document.querySelector('#openOrdersScreen .header-subtitle');
    if (subtitle) subtitle.textContent = `${openOrders.length} orders pending & processing`;
    
    // Calculate orders by status
    const ordersByStatus = {
        'processing': openOrders.filter(order => order.status === 'processing').length,
        'pending': openOrders.filter(order => order.status === 'pending').length,
        'shipped': openOrders.filter(order => order.status === 'shipped').length
    };
    
    // Update status chart
    updateStatusChart(ordersByStatus, openOrders.length);
    
    // Update urgent orders
    updateUrgentOrders(openOrders);
    
    // Update recent orders
    updateRecentOrders(openOrders);
    
    // Update order metrics
    updateOrderMetrics(openOrders);
}

function updateStatusChart(ordersByStatus, totalOpenOrders) {
    const statusChart = document.querySelector('.status-chart');
    if (!statusChart) return;
    
    const statusData = [
        { name: 'Processing', count: ordersByStatus.processing, color: 'var(--primary)' },
        { name: 'Pending', count: ordersByStatus.pending, color: 'var(--warning)' },
        { name: 'Shipped', count: ordersByStatus.shipped, color: 'var(--info)' }
    ];
    
    statusChart.innerHTML = '';
    
    statusData.forEach(status => {
        const percentage = totalOpenOrders > 0 ? (status.count / totalOpenOrders) * 100 : 0;
        
        const statusItem = document.createElement('div');
        statusItem.className = 'status-item';
        statusItem.innerHTML = `
            <div class="status-indicator" style="background: ${status.color};"></div>
            <div class="status-info">
                <div class="status-name">${status.name}</div>
                <div class="status-count">${status.count} orders</div>
            </div>
            <div class="status-percent">${percentage.toFixed(0)}%</div>
        `;
        statusChart.appendChild(statusItem);
    });
}

function updateUrgentOrders(openOrders) {
    const urgentOrdersList = document.querySelector('.urgent-orders-list');
    if (!urgentOrdersList) return;
    
    // Find orders due today or tomorrow
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const urgentOrders = openOrders.filter(order => {
        const deliveryDate = new Date(order.deliveryDate);
        return deliveryDate <= tomorrow && (order.status === 'pending' || order.status === 'processing');
    }).slice(0, 3); // Show max 3 urgent orders
    
    urgentOrdersList.innerHTML = '';
    
    if (urgentOrders.length === 0) {
        urgentOrdersList.innerHTML = `
            <div class="no-urgent-orders">
                <span style="font-size: 24px;">🎉</span>
                <div>No urgent orders at the moment</div>
                <div style="font-size: 12px; color: var(--text-secondary);">All orders are on track</div>
            </div>
        `;
        return;
    }
    
    urgentOrders.forEach(order => {
        const deliveryDate = new Date(order.deliveryDate);
        const isToday = deliveryDate.toDateString() === today.toDateString();
        const isTomorrow = deliveryDate.toDateString() === tomorrow.toDateString();
        
        let dueText = '';
        if (isToday) dueText = 'Due: Today, 5:00 PM';
        else if (isTomorrow) dueText = 'Due: Tomorrow, 10:00 AM';
        else dueText = `Due: ${deliveryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
        
        const urgentItem = document.createElement('div');
        urgentItem.className = 'urgent-order-item';
        urgentItem.innerHTML = `
            <div class="urgent-order-id">${order.id}</div>
            <div class="urgent-order-info">
                <div class="urgent-order-shop">${order.shopName}</div>
                <div class="urgent-order-deadline">${dueText}</div>
            </div>
            <div class="urgent-order-status">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</div>
        `;
        urgentOrdersList.appendChild(urgentItem);
    });
}

function updateRecentOrders(openOrders) {
    const recentOrdersList = document.querySelector('.recent-orders-list');
    if (!recentOrdersList) return;
    
    // Sort by date (most recent first)
    const sortedOrders = [...openOrders].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    ).slice(0, 5); // Show max 5 recent orders
    
    recentOrdersList.innerHTML = '';
    
    sortedOrders.forEach(order => {
        const statusColors = {
            'pending': 'var(--warning)',
            'processing': 'var(--primary)',
            'shipped': 'var(--info)'
        };
        
        const recentItem = document.createElement('div');
        recentItem.className = 'recent-order-item';
        recentItem.onclick = () => viewOrderDetails(order.id);
        recentItem.style.cursor = 'pointer';
        recentItem.innerHTML = `
            <div class="recent-order-header">
                <div class="recent-order-id">${order.id}</div>
                <span class="recent-order-status" style="color: ${statusColors[order.status] || 'var(--primary)'}">
                    ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
            </div>
            <div class="recent-order-shop">${order.shopName}</div>
            <div class="recent-order-details">
                <span>📅 ${order.date}</span>
                <span>💰 ₹${order.netValue.toLocaleString('en-IN')}</span>
            </div>
        `;
        recentOrdersList.appendChild(recentItem);
    });
}

function updateOrderMetrics(openOrders) {
    // Calculate total value
    const totalValue = openOrders.reduce((sum, order) => sum + order.netValue, 0);
    const totalValueEl = document.querySelector('.order-metrics-grid .metric-card:nth-child(2) .metric-value');
    if (totalValueEl) totalValueEl.textContent = '₹' + (totalValue / 1000).toFixed(1) + 'L';
    
    // Calculate total items
    const totalItems = openOrders.reduce((sum, order) => 
        sum + order.items.reduce((itemSum, item) => itemSum + item.qty, 0), 0
    );
    const totalItemsEl = document.querySelector('.order-metrics-grid .metric-card:nth-child(3) .metric-value');
    if (totalItemsEl) totalItemsEl.textContent = totalItems.toLocaleString('en-IN');
    
    // Calculate pending delivery (shipped orders)
    const pendingDelivery = openOrders.filter(order => order.status === 'shipped').length;
    const pendingDeliveryEl = document.querySelector('.order-metrics-grid .metric-card:nth-child(4) .metric-value');
    if (pendingDeliveryEl) pendingDeliveryEl.textContent = pendingDelivery;
    
    // Calculate average processing days
    const avgProcessingDays = 2.5; // Simulated value
    const avgProcessingDaysEl = document.querySelector('.order-metrics-grid .metric-card:nth-child(1) .metric-value');
    if (avgProcessingDaysEl) avgProcessingDaysEl.textContent = avgProcessingDays;
}

// ==================== OTHER FUNCTIONS ====================

// Product Selection
function toggleProduct(element, productId) {
    element.classList.toggle('selected');
    
    if (element.classList.contains('selected')) {
        selectedProducts.push(productId);
    } else {
        selectedProducts = selectedProducts.filter(p => p !== productId);
    }
}

// Form Validation
function validateForm() {
    let isValid = true;
    const fields = ['shopName', 'ownerName', 'contactNumber', 'shopType', 'areaName', 'distributorName'];
    
    fields.forEach(field => {
        const input = document.getElementById(field);
        const error = document.getElementById(field + 'Error');
        
        if (!input.value.trim()) {
            input.classList.add('error');
            if (error) error.classList.add('show');
            isValid = false;
        } else {
            input.classList.remove('error');
            if (error) error.classList.remove('show');
        }
    });

    const productsError = document.getElementById('productsError');
    if (selectedProducts.length === 0) {
        if (productsError) productsError.classList.add('show');
        isValid = false;
    } else {
        if (productsError) productsError.classList.remove('show');
    }

    // Validate location
    const locationField = document.getElementById('locationField');
    const locationError = document.getElementById('locationError');
    if (!locationField.value.trim()) {
        locationField.classList.add('error');
        if (locationError) {
            locationError.classList.add('show');
            locationError.textContent = 'Please capture shop location';
        }
        isValid = false;
    } else {
        locationField.classList.remove('error');
        if (locationError) locationError.classList.remove('show');
    }

    return isValid;
}

// Submit Shop Form
function submitShopForm(event) {
    event.preventDefault();
    
    if (!validateForm()) {
        return;
    }

    const shopData = {
        shopName: document.getElementById('shopName').value,
        ownerName: document.getElementById('ownerName').value,
        contactNumber: document.getElementById('contactNumber').value,
        shopType: document.getElementById('shopType').options[document.getElementById('shopType').selectedIndex].text,
        areaName: document.getElementById('areaName').value,
        distributorName: document.getElementById('distributorName').options[document.getElementById('distributorName').selectedIndex].text,
        products: selectedProducts
    };

    currentShopData = shopData;

    const detailShopName = document.getElementById('detailShopName');
    const detailOwnerName = document.getElementById('detailOwnerName');
    const detailShopType = document.getElementById('detailShopType');
    const detailAreaName = document.getElementById('detailAreaName');
    
    if (detailShopName) detailShopName.textContent = shopData.shopName;
    if (detailOwnerName) detailOwnerName.textContent = shopData.ownerName;
    if (detailShopType) detailShopType.textContent = shopData.shopType;
    if (detailAreaName) detailAreaName.textContent = shopData.areaName;

    showToast('✓ Shop created successfully!');

    setTimeout(() => {
        navigateTo('shopDetailsScreen');
        resetForm();
    }, 1000);
}

function resetForm() {
    const shopForm = document.getElementById('shopForm');
    if (shopForm) shopForm.reset();
    
    selectedProducts = [];
    document.querySelectorAll('.product-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelectorAll('.error-message').forEach(error => {
        error.classList.remove('show');
    });

    // Reset location field
    const locationField = document.getElementById('locationField');
    const locationBtn = document.getElementById('locationBtn');
    if (locationField) {
        locationField.value = '';
        locationField.style.color = 'var(--text-secondary)';
        locationField.style.fontFamily = "'Work Sans', sans-serif";
        locationField.style.fontWeight = '600';
    }
    if (locationBtn) {
        locationBtn.textContent = '📍 Location';
        locationBtn.style.background = 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)';
        locationBtn.style.boxShadow = '0 4px 12px rgba(255,107,44,0.3)';
    }
}

// Tab Switching
function switchTab(event, tabName) {
    if (!event || !event.target) return;
    
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    const tabElement = document.getElementById(tabName + 'Tab');
    if (tabElement) tabElement.classList.add('active');
}

// Toast Notification
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Shop Filtering
function filterShops() {
    const searchValue = document.getElementById('shopSearch').value.toLowerCase();
    const shops = document.querySelectorAll('.shop-list-item');
    
    shops.forEach(shop => {
        const text = shop.textContent.toLowerCase();
        shop.style.display = text.includes(searchValue) ? 'block' : 'none';
    });
}

function filterShopsByType(type) {
    // Update active state of filter dropdown (for select element)
    const selectElement = document.getElementById('shopTypeFilter');
    if (selectElement) {
        selectElement.value = type;
    }
    
    // Update active state of filter chips (if any)
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.remove('active');
    });
    
    const shops = document.querySelectorAll('.shop-list-item');
    shops.forEach(shop => {
        if (type === 'all') {
            shop.style.display = 'block';
        } else if (type === 'Recently visited') {
            // Simulate recently visited shops (first 2 shops)
            const index = Array.from(shops).indexOf(shop);
            shop.style.display = index < 2 ? 'block' : 'none';
        } else if (type === 'Recently Created') {
            // Simulate recently created shops (last 2 shops)
            const index = Array.from(shops).indexOf(shop);
            shop.style.display = index >= shops.length - 2 ? 'block' : 'none';
        } else if (shop.dataset.type === type) {
            shop.style.display = 'block';
        } else {
            shop.style.display = 'none';
        }
    });
    
    showToast(`Filtered shops: ${type}`);
}

// View Shop Details
function viewShopDetails(name, owner, type, area) {
    const detailShopName = document.getElementById('detailShopName');
    const detailOwnerName = document.getElementById('detailOwnerName');
    const detailShopType = document.getElementById('detailShopType');
    const detailAreaName = document.getElementById('detailAreaName');
    
    if (detailShopName) detailShopName.textContent = name;
    if (detailOwnerName) detailOwnerName.textContent = owner;
    if (detailShopType) detailShopType.textContent = type;
    if (detailAreaName) detailAreaName.textContent = area;
    
    navigateTo('shopDetailsScreen');
    setActiveNav('navShops');
}

// Enhanced List View Functions
function loadEnhancedRouteList() {
    const container = document.getElementById('routeListEnhanced');
    if (!container) return;
    
    container.innerHTML = '';
    
    Object.keys(enhancedRouteData).forEach(routeId => {
        const route = enhancedRouteData[routeId];
        const routeCard = createEnhancedRouteCard(routeId, route);
        container.appendChild(routeCard);
    });
}

function createEnhancedRouteCard(routeId, route) {
    const card = document.createElement('div');
    card.className = 'route-card-enhanced';
    card.dataset.routeId = routeId;
    card.dataset.status = route.status;
    card.dataset.priority = route.priority;
    card.dataset.today = route.today;
    
    const progressPercentage = (route.summary.completed / (route.summary.completed + route.summary.pending)) * 100;
    
    card.innerHTML = `
        <div class="route-card-header" onclick="toggleEnhancedRouteCard(this)">
            <div class="route-card-info">
                <div class="route-card-title">${route.name}</div>
                <div class="route-card-subtitle">${route.subtitle}</div>
                <div class="route-card-stats">
                    <div class="route-card-stat">
                        <span>🏪</span> ${route.shops.length} shops
                    </div>
                    <div class="route-card-stat">
                        <span>📍</span> ${route.stats.split('•')[1].trim()}
                    </div>
                    <div class="route-card-stat">
                        <span>⏱️</span> ${route.stats.split('•')[2].trim()}
                    </div>
                    <div class="route-card-stat">
                        <span>💰</span> ₹${(route.revenue / 1000).toFixed(1)}K
                    </div>
                </div>
            </div>
            <div class="route-card-actions">
                <button class="route-action-btn" onclick="event.stopPropagation(); startRoute(${routeId})" 
                        title="Start Route">
                    ▶️
                </button>
                <button class="route-action-btn" onclick="event.stopPropagation(); navigateToRoute(${routeId})" 
                        title="Navigate">
                    🧭
                </button>
            </div>
        </div>
        <div class="route-card-body">
            <div class="route-progress-section">
                <div class="route-progress-header">
                    <div class="route-progress-title">Progress</div>
                    <div class="route-progress-value">${Math.round(progressPercentage)}%</div>
                </div>
                <div class="route-progress-bar">
                    <div class="route-progress-fill" style="width: ${progressPercentage}%"></div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--text-secondary);">
                    <span>✅ ${route.summary.completed} completed</span>
                    <span>⏱️ ${route.summary.pending} pending</span>
                </div>
            </div>
            
            <div class="route-summary-cards">
                <div class="route-summary-card">
                    <div class="route-summary-value">${route.summary.distanceCovered}</div>
                    <div class="route-summary-label">Covered</div>
                </div>
                <div class="route-summary-card">
                    <div class="route-summary-value">${route.summary.remainingDistance}</div>
                    <div class="route-summary-label">Remaining</div>
                </div>
                <div class="route-summary-card">
                    <div class="route-summary-value">${route.efficiency}%</div>
                    <div class="route-summary-label">Efficiency</div>
                </div>
            </div>
            
            <div class="route-shops-grid">
                ${route.shops.map(shop => `
                    <div class="route-shop-card" onclick="viewShopOnMap('${shop.name}', '${shop.address}')">
                        <div class="route-shop-header">
                            <div class="shop-sequence-badge">#${shop.seq}</div>
                            <div class="route-shop-name">${shop.name}</div>
                        </div>
                        <div class="route-shop-details">
                            <span>${shop.address}</span>
                            <span class="route-shop-distance">${shop.distance}</span>
                        </div>
                        <div class="route-shop-visit">
                            ${shop.visited ? '✅ Visited' : '⏱️ Pending'}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            ${route.timeline ? `
            <div class="route-timeline">
                <div class="section-title">Today's Timeline</div>
                ${route.timeline.map(item => `
                    <div class="timeline-item">
                        <div class="timeline-time">${item.time}</div>
                        <div class="timeline-content">
                            <div class="timeline-shop">${item.shop}</div>
                            <div class="timeline-address">${item.address}</div>
                            <div class="timeline-status ${item.status}">
                                ${item.status === 'completed' ? '✓ Completed' : '⏱️ Pending'}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button class="modal-btn secondary" onclick="showRouteDetailsModal()" 
                        style="flex: 1; padding: 12px;">
                    📋 View Details
                </button>
                <button class="modal-btn edit" onclick="optimizeRoute(${routeId})" 
                        style="flex: 1; padding: 12px;">
                    ⚡ Optimize
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function toggleEnhancedRouteCard(headerElement) {
    const card = headerElement.closest('.route-card-enhanced');
    card.classList.toggle('route-card-expanded');
    
    const icon = headerElement.querySelector('.route-action-btn:nth-child(1)');
    if (card.classList.contains('route-card-expanded')) {
        icon.innerHTML = '⏸️';
        icon.title = 'Pause Route';
    } else {
        icon.innerHTML = '▶️';
        icon.title = 'Start Route';
    }
}

// Route Filter Functions
function filterRoutes(filterType) {
    if (!event || !event.target) return;
    
    document.querySelectorAll('.route-filter-chip').forEach(chip => {
        chip.classList.remove('active');
    });
    event.target.classList.add('active');
    
    const cards = document.querySelectorAll('.route-card-enhanced');
    
    cards.forEach(card => {
        let show = false;
        
        switch(filterType) {
            case 'all':
                show = true;
                break;
            case 'active':
                show = card.dataset.status === 'active';
                break;
            case 'pending':
                show = card.dataset.status === 'pending';
                break;
            case 'high-priority':
                show = card.dataset.priority === 'high';
                break;
            case 'today':
                show = card.dataset.today === 'true';
                break;
            case 'long':
                const shops = parseInt(card.querySelector('.route-card-stat:nth-child(1)').textContent);
                show = shops > 10;
                break;
        }
        
        card.style.display = show ? 'block' : 'none';
    });
    
    showToast(`Filtered routes: ${filterType}`);
}

// Route Action Functions
function startRoute(routeId) {
    const route = enhancedRouteData[routeId];
    showToast(`🚚 Starting ${route.name}`);
    
    // Update route status
    enhancedRouteData[routeId].status = 'active';
    
    // Refresh the view
    loadEnhancedRouteList();
}

function navigateToRoute(routeId) {
    const route = enhancedRouteData[routeId];
    showToast(`🧭 Opening navigation for ${route.name}`);
    
    // In a real app, this would open Google Maps
    window.open(`https://www.google.com/maps/search/${encodeURIComponent(route.shops[0].address)}`, '_blank');
}

function viewShopOnMap(shopName, address) {
    showToast(`📍 Showing ${shopName} on map`);
    // This would center the map on the shop location
}

function optimizeRoute(routeId) {
    const route = enhancedRouteData[routeId];
    showToast(`⚡ Optimizing ${route.name}...`);
    
    // Simulate optimization
    setTimeout(() => {
        const distanceReduction = Math.round(Math.random() * 15);
        const timeReduction = Math.round(Math.random() * 30);
        
        showToast(`✅ Route optimized! Saved ${distanceReduction}km and ${timeReduction} minutes`);
    }, 1500);
}

function exportRouteData() {
    showToast('📊 Exporting route report...');
    // This would generate and download a PDF/Excel report
}

function showRouteDetailsModal() {
    if (!currentRoutePanelId) return;
    
    const route = enhancedRouteData[currentRoutePanelId];
    const modal = document.getElementById('enhancedRouteModal');
    
    if (modal) {
        // Update modal title and subtitle
        document.getElementById('enhancedRouteTitle').textContent = route.name;
        document.getElementById('enhancedRouteSubtitle').textContent = route.stats;
        document.getElementById('modalShops').textContent = route.shops.length;
        document.getElementById('modalEfficiency').textContent = route.efficiency + '%';
        document.getElementById('modalRevenue').textContent = '₹' + (route.revenue / 1000).toFixed(1) + 'K';
        
        // Create compact shops grid
        const shopsGrid = document.getElementById('modalShopsGrid');
        if (shopsGrid) {
            shopsGrid.innerHTML = '';
            shopsGrid.style.display = 'grid';
            shopsGrid.style.gridTemplateColumns = '1fr';
            shopsGrid.style.gap = '10px';
            shopsGrid.style.maxHeight = '200px';
            shopsGrid.style.overflowY = 'auto';
            shopsGrid.style.padding = '5px';
            
            // Show only visited and next 2 pending shops
            const visitedShops = route.shops.filter(shop => shop.visited).slice(-2);
            const pendingShops = route.shops.filter(shop => !shop.visited).slice(0, 2);
            const displayShops = [...visitedShops, ...pendingShops];
            
            if (displayShops.length === 0) {
                shopsGrid.innerHTML = `
                    <div style="text-align: center; padding: 20px; color: var(--text-secondary); font-size: 13px;">
                        <div>🏁 All shops completed!</div>
                        <div style="font-size: 11px; margin-top: 5px;">Route is finished</div>
                    </div>
                `;
            } else {
                displayShops.forEach(shop => {
                    const shopCard = document.createElement('div');
                    shopCard.className = 'route-shop-card';
                    shopCard.style.cssText = `
                        padding: 12px;
                        margin: 0;
                        background: #f8f9fa;
                        border-left: 4px solid ${shop.visited ? route.color : 'var(--warning)'};
                    `;
                    shopCard.innerHTML = `
                        <div class="route-shop-header" style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                            <div class="shop-sequence-badge" style="
                                background: ${route.color};
                                color: white;
                                width: 24px;
                                height: 24px;
                                border-radius: 50%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 11px;
                                font-weight: 800;
                            ">#${shop.seq}</div>
                            <div class="route-shop-name" style="font-size: 13px; font-weight: 700;">${shop.name}</div>
                        </div>
                        <div class="route-shop-details" style="font-size: 11px; color: var(--text-secondary); margin-bottom: 6px;">
                            <span>${shop.address}</span>
                            <span class="route-shop-distance" style="float: right; color: var(--info);">${shop.distance}</span>
                        </div>
                        <div class="route-shop-visit" style="
                            font-size: 10px;
                            font-weight: 700;
                            color: ${shop.visited ? 'var(--accent)' : 'var(--warning)'};
                            text-align: right;
                        ">
                            ${shop.visited ? '✅ Visited' : '⏱️ Pending'}
                        </div>
                    `;
                    shopsGrid.appendChild(shopCard);
                });
                
                // Add view all button if there are more shops
                if (route.shops.length > 4) {
                    const viewAllBtn = document.createElement('button');
                    viewAllBtn.style.cssText = `
                        width: 100%;
                        background: var(--primary-light);
                        color: var(--primary);
                        border: none;
                        padding: 10px;
                        border-radius: 8px;
                        font-size: 12px;
                        font-weight: 700;
                        cursor: pointer;
                        margin-top: 10px;
                    `;
                    viewAllBtn.textContent = `View all ${route.shops.length} shops →`;
                    viewAllBtn.onclick = () => viewAllShopsInRoute(currentRoutePanelId);
                    shopsGrid.appendChild(viewAllBtn);
                }
            }
        }
        
        // Update progress section
        const optimizationSuggestions = document.getElementById('optimizationSuggestions');
        if (optimizationSuggestions) {
            const progressPercentage = (route.summary.completed / (route.summary.completed + route.summary.pending)) * 100;
            optimizationSuggestions.innerHTML = `
                <div class="modal-section" style="margin-bottom: 15px;">
                    <div class="section-title" style="font-size: 14px; margin-bottom: 8px;">Progress</div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="flex: 1;">
                            <div style="background: #f0f0f0; height: 8px; border-radius: 4px; overflow: hidden;">
                                <div style="width: ${progressPercentage}%; height: 100%; background: ${route.color}; transition: width 1s ease;"></div>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--text-secondary); margin-top: 5px;">
                                <span>✅ ${route.summary.completed} completed</span>
                                <span>⏱️ ${route.summary.pending} pending</span>
                            </div>
                        </div>
                        <div style="font-size: 18px; font-weight: 800; color: var(--primary); min-width: 45px;">
                            ${Math.round(progressPercentage)}%
                        </div>
                    </div>
                </div>
                
                <div class="modal-section" style="margin-bottom: 15px;">
                    <div class="section-title" style="font-size: 14px; margin-bottom: 8px;">Quick Stats</div>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                        <div style="text-align: center; background: #f8f9fa; padding: 12px; border-radius: 8px;">
                            <div style="font-size: 18px; font-weight: 800; color: ${route.color};">${route.shops.length}</div>
                            <div style="font-size: 10px; color: var(--text-secondary);">Shops</div>
                        </div>
                        <div style="text-align: center; background: #f8f9fa; padding: 12px; border-radius: 8px;">
                            <div style="font-size: 18px; font-weight: 800; color: ${route.color};">${route.stats.split('•')[1].trim()}</div>
                            <div style="font-size: 10px; color: var(--text-secondary);">Distance</div>
                        </div>
                        <div style="text-align: center; background: #f8f9fa; padding: 12px; border-radius: 8px;">
                            <div style="font-size: 18px; font-weight: 800; color: ${route.color};">${route.stats.split('•')[2].trim()}</div>
                            <div style="font-size: 10px; color: var(--text-secondary);">Duration</div>
                        </div>
                    </div>
                </div>
                
                <div class="modal-section" style="margin-bottom: 0;">
                    <div class="section-title" style="font-size: 14px; margin-bottom: 8px;">Actions</div>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="navigateToRoute(${currentRoutePanelId})" 
                                style="flex: 1; background: ${route.color}; color: white; border: none; padding: 12px; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.3s ease;">
                            🧭 Navigate
                        </button>
                        <button onclick="optimizeRoute(${currentRoutePanelId})" 
                                style="flex: 1; background: var(--primary-light); color: var(--primary); border: 1px solid var(--primary); padding: 12px; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.3s ease;">
                            ⚡ Optimize
                        </button>
                    </div>
                </div>
            `;
        }
        
        // Show modal
        modal.classList.add('active');
    }
}

function closeEnhancedRouteModal() {
    const modal = document.getElementById('enhancedRouteModal');
    if (modal) modal.classList.remove('active');
}

function toggleRouteCard(card) {
    card.classList.toggle('expanded');
}

// Check-in/Check-out Functionality
function toggleCheckIn() {
    const btn = document.getElementById('checkInBtn');
    const icon = document.getElementById('checkInIcon');
    const text = document.getElementById('checkInText');
    const overlay = document.getElementById('visitOverlay');
    const overlayIcon = document.getElementById('visitIcon');
    const overlayTitle = document.getElementById('visitTitle');
    const overlayMessage = document.getElementById('visitMessage');

    if (!isCheckedIn) {
        // Check In
        isCheckedIn = true;
        visitStartTime = new Date();
        if (btn) btn.classList.add('checked-in');
        if (icon) icon.textContent = '✓';
        if (text) text.textContent = 'Check Out';
        
        if (overlayIcon) overlayIcon.textContent = '✓';
        if (overlayTitle) overlayTitle.textContent = 'Visit Started!';
        if (overlayMessage) overlayMessage.textContent = 'You can now perform shop operations. Don\'t forget to check out when done.';
        if (overlay) overlay.classList.add('active');
        
        showToast('✓ Checked in successfully!');
    } else {
        // Check Out
        const duration = Math.round((new Date() - visitStartTime) / 60000);
        isCheckedIn = false;
        visitStartTime = null;
        if (btn) btn.classList.remove('checked-in');
        if (icon) icon.textContent = '📍';
        if (text) text.textContent = 'Check In';
        
        if (overlayIcon) overlayIcon.textContent = '👋';
        if (overlayTitle) overlayTitle.textContent = 'Visit Completed!';
        if (overlayMessage) overlayMessage.textContent = `Visit duration: ${duration} minutes. Thank you for your visit!`;
        if (overlay) overlay.classList.add('active');
        
        // Increment visit number
        const visitCard = document.querySelector('.analytics-card.visits .analytics-value');
        if (visitCard) {
            const currentVisits = parseInt(visitCard.textContent);
            visitCard.textContent = currentVisits + 1;
        }
        
        showToast('👋 Checked out successfully!');
    }
}

function closeVisitOverlay() {
    const visitOverlay = document.getElementById('visitOverlay');
    if (visitOverlay) visitOverlay.classList.remove('active');
}

function checkBeforeOperation(operation) {
    if (!isCheckedIn) {
        const overlay = document.getElementById('disabledOverlay');
        if (overlay) {
            overlay.classList.add('active');
            setTimeout(() => {
                overlay.classList.remove('active');
            }, 2000);
        }
        return;
    }
    
    if (operation === 'updateStock') {
        showToast('Stock update feature available!');
    }
}

// Shop Details Modal
function showShopDetailsModal() {
    const modalShopName = document.getElementById('modalShopName');
    const modalOwnerName = document.getElementById('modalOwnerName');
    const modalShopType = document.getElementById('modalShopType');
    const modalArea = document.getElementById('modalArea');
    
    const detailShopName = document.getElementById('detailShopName');
    const detailOwnerName = document.getElementById('detailOwnerName');
    const detailShopType = document.getElementById('detailShopType');
    const detailAreaName = document.getElementById('detailAreaName');
    
    if (modalShopName && detailShopName) modalShopName.textContent = detailShopName.textContent;
    if (modalOwnerName && detailOwnerName) modalOwnerName.textContent = detailOwnerName.textContent;
    if (modalShopType && detailShopType) modalShopType.textContent = detailShopType.textContent;
    if (modalArea && detailAreaName) modalArea.textContent = detailAreaName.textContent;
    
    const shopDetailsModal = document.getElementById('shopDetailsModal');
    if (shopDetailsModal) shopDetailsModal.classList.add('active');
}

function closeShopDetailsModal() {
    const shopDetailsModal = document.getElementById('shopDetailsModal');
    if (shopDetailsModal) shopDetailsModal.classList.remove('active');
}

// Order Creation Functions
function initializeProductList() {
    const productsList = document.getElementById('productsList');
    if (!productsList) return;
    
    productsList.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsList.appendChild(productCard);
    });
}

function createProductCard(product) {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.dataset.productId = product.id;
    div.dataset.category = product.category;
    
    const orderItem = currentOrder.items.find(item => item.productId === product.id);
    const quantity = orderItem ? orderItem.quantity : 0;
    
    if (quantity > 0) {
        div.classList.add('selected');
    }
    
    div.innerHTML = `
        <div class="product-header">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-sku">${product.sku} • ${product.variant}</div>
                <span class="product-category-badge ${product.category}">${product.category}</span>
            </div>
        </div>
        
        <div class="product-pricing">
            <div class="price-item">
                <span class="price-label">MRP</span>
                <span class="price-value">₹${product.mrp}</span>
            </div>
            <div class="price-item">
                <span class="price-label">Your Price</span>
                <span class="price-value highlight">₹${product.distributorPrice}</span>
            </div>
            <div class="price-item">
                <span class="price-label">Tax (GST)</span>
                <span class="price-value">${product.tax}%</span>
            </div>
            <div class="price-item">
                <span class="price-label">Available</span>
                <span class="price-value">${product.availableStock}</span>
            </div>
        </div>
        
        <div class="product-stock-info">
            <span class="stock-label-text">Distributor Stock</span>
            <span class="stock-value-text">${product.availableStock} units</span>
        </div>
        
        <div class="quantity-selector">
            <span class="quantity-label">Order Quantity:</span>
            <div class="quantity-controls">
                <button class="quantity-decrease" onclick="updateProductQuantity(${product.id}, -1)">−</button>
                <span class="quantity-value" id="qty-${product.id}">${quantity}</span>
                <button class="quantity-increase" onclick="updateProductQuantity(${product.id}, 1)">+</button>
            </div>
        </div>
        
        ${product.scheme ? `
        <div class="product-scheme-info ${quantity >= product.scheme.minQty ? 'active' : ''}" id="scheme-${product.id}">
            <span class="scheme-text">🎉 Scheme: Buy ${product.scheme.minQty} Get ${product.scheme.freeQty} Free!</span>
        </div>
        ` : ''}
        
        <div class="product-line-total" style="display: ${quantity > 0 ? 'flex' : 'none'};" id="line-total-${product.id}">
            <span class="line-total-label">Line Total</span>
            <span class="line-total-value" id="line-value-${product.id}">₹0</span>
        </div>
    `;
    
    return div;
}

function updateProductQuantity(productId, delta) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    let orderItem = currentOrder.items.find(item => item.productId === productId);
    
    if (!orderItem) {
        if (delta > 0) {
            orderItem = {
                productId: productId,
                product: product,
                quantity: 0,
                freeQty: 0,
                lineTotal: 0
            };
            currentOrder.items.push(orderItem);
        }
    }
    
    if (orderItem) {
        orderItem.quantity = Math.max(0, Math.min(product.availableStock, orderItem.quantity + delta));
        
        // Apply scheme
        if (product.scheme && orderItem.quantity >= product.scheme.minQty) {
            const sets = Math.floor(orderItem.quantity / product.scheme.minQty);
            orderItem.freeQty = sets * product.scheme.freeQty;
        } else {
            orderItem.freeQty = 0;
        }
        
        // Calculate line total
        const subtotal = orderItem.quantity * product.distributorPrice;
        const tax = subtotal * (product.tax / 100);
        orderItem.lineTotal = subtotal + tax;
        
        // Remove item if quantity is 0
        if (orderItem.quantity === 0) {
            currentOrder.items = currentOrder.items.filter(item => item.productId !== productId);
        }
    }
    
    // Update UI
    const qtyElement = document.getElementById(`qty-${productId}`);
    const lineTotal = document.getElementById(`line-total-${productId}`);
    const lineValue = document.getElementById(`line-value-${productId}`);
    const schemeInfo = document.getElementById(`scheme-${productId}`);
    const productCard = document.querySelector(`.product-card[data-product-id="${productId}"]`);
    
    if (qtyElement) {
        qtyElement.textContent = orderItem ? orderItem.quantity : 0;
    }
    
    if (lineTotal) {
        lineTotal.style.display = (orderItem && orderItem.quantity > 0) ? 'flex' : 'none';
    }
    
    if (lineValue && orderItem) {
        lineValue.textContent = '₹' + Math.round(orderItem.lineTotal).toLocaleString('en-IN');
    }
    
    if (schemeInfo && product.scheme) {
        if (orderItem && orderItem.quantity >= product.scheme.minQty) {
            schemeInfo.classList.add('active');
        } else {
            schemeInfo.classList.remove('active');
        }
    }
    
    if (productCard) {
        if (orderItem && orderItem.quantity > 0) {
            productCard.classList.add('selected');
        } else {
            productCard.classList.remove('selected');
        }
    }
    
    updateOrderSummary();
}

function updateOrderSummary() {
    let subtotal = 0;
    let discount = 0;
    let gst = 0;
    
    currentOrder.items.forEach(item => {
        const product = item.product;
        const itemSubtotal = item.quantity * product.distributorPrice;
        subtotal += itemSubtotal;
        
        // Calculate scheme discount (value of free items)
        if (item.freeQty > 0) {
            discount += item.freeQty * product.distributorPrice;
        }
        
        // Calculate GST
        gst += itemSubtotal * (product.tax / 100);
    });
    
    currentOrder.subtotal = subtotal;
    currentOrder.discount = discount;
    currentOrder.gst = gst;
    currentOrder.netValue = subtotal - discount + gst;
    
    // Update floating review card
    const reviewFloat = document.getElementById('reviewOrderFloat');
    const itemsCount = document.getElementById('selectedItemsCount');
    const totalDisplay = document.getElementById('orderTotalDisplay');
    
    if (reviewFloat) {
        if (currentOrder.items.length > 0) {
            reviewFloat.style.display = 'block';
            if (itemsCount) itemsCount.textContent = `${currentOrder.items.length} item${currentOrder.items.length > 1 ? 's' : ''} selected`;
            if (totalDisplay) totalDisplay.textContent = '₹' + Math.round(currentOrder.netValue).toLocaleString('en-IN');
        } else {
            reviewFloat.style.display = 'none';
        }
    }
    
    // Update order summary screen if on that screen
    updateSummaryScreen();
}

function updateSummaryScreen() {
    const subtotalEl = document.getElementById('summarySubtotal');
    const discountEl = document.getElementById('summaryDiscount');
    const gstEl = document.getElementById('summaryGST');
    const netValueEl = document.getElementById('summaryNetValue');
    
    if (subtotalEl) subtotalEl.textContent = '₹' + Math.round(currentOrder.subtotal).toLocaleString('en-IN');
    if (discountEl) discountEl.textContent = '-₹' + Math.round(currentOrder.discount).toLocaleString('en-IN');
    if (gstEl) gstEl.textContent = '₹' + Math.round(currentOrder.gst).toLocaleString('en-IN');
    if (netValueEl) netValueEl.textContent = '₹' + Math.round(currentOrder.netValue).toLocaleString('en-IN');
    
    // Validate order
    validateOrder();
}

function validateOrder() {
    const alertsContainer = document.getElementById('validationAlerts');
    if (!alertsContainer) return;
    
    alertsContainer.innerHTML = '';
    
    let canPlaceOrder = true;
    
    // Check credit limit
    const outstanding = 45200; // From shop data
    const creditLimit = 500000;
    const availableCredit = creditLimit - outstanding;
    
    if (currentOrder.netValue > availableCredit) {
        alertsContainer.innerHTML += `
            <div class="validation-alert error">
                <span>🛑</span>
                <span>Credit limit exceeded! Available credit: ₹${Math.round(availableCredit).toLocaleString('en-IN')}</span>
            </div>
        `;
        canPlaceOrder = false;
    }
    
    // Check minimum order value
    const minOrderValue = 5000;
    if (currentOrder.netValue < minOrderValue) {
        alertsContainer.innerHTML += `
            <div class="validation-alert warning">
                <span>⚠️</span>
                <span>Order value below minimum (₹${minOrderValue.toLocaleString('en-IN')})</span>
            </div>
        `;
    }
    
    // Check outstanding threshold
    const warningThreshold = creditLimit * 0.8;
    if (outstanding > warningThreshold) {
        alertsContainer.innerHTML += `
            <div class="validation-alert info">
                <span>💡</span>
                <span>Outstanding amount is above 80% of credit limit</span>
            </div>
        `;
    }
    
    // Check stock availability
    let stockIssue = false;
    currentOrder.items.forEach(item => {
        if (item.quantity > item.product.availableStock) {
            stockIssue = true;
        }
    });
    
    if (stockIssue) {
        alertsContainer.innerHTML += `
            <div class="validation-alert error">
                <span>🛑</span>
                <span>Some items exceed available stock</span>
            </div>
        `;
        canPlaceOrder = false;
    }
    
    // Update place order button
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    if (placeOrderBtn) {
        if (canPlaceOrder && isConfirmed) {
            placeOrderBtn.disabled = false;
        } else {
            placeOrderBtn.disabled = true;
        }
    }
}

function filterProducts() {
    const searchValue = document.getElementById('productSearchInput').value.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const productName = card.querySelector('.product-name').textContent.toLowerCase();
        const productSku = card.querySelector('.product-sku').textContent.toLowerCase();
        
        if (productName.includes(searchValue) || productSku.includes(searchValue)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function filterByCategory(category) {
    if (!event || !event.target) return;
    
    // Update active chip
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.remove('active');
    });
    event.target.classList.add('active');
    
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function selectPaymentMode(mode) {
    if (!event || !event.target) return;
    
    currentPaymentMode = mode;
    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('selected');
    });
    event.target.classList.add('selected');
}

function toggleConfirmation() {
    isConfirmed = !isConfirmed;
    const checkbox = document.getElementById('confirmCheckbox');
    
    if (checkbox) {
        if (isConfirmed) {
            checkbox.classList.add('checked');
        } else {
            checkbox.classList.remove('checked');
        }
    }
    
    validateOrder();
}

function placeOrder() {
    if (!isConfirmed) {
        showToast('⚠️ Please confirm order details');
        return;
    }
    
    // Generate order number
    const orderNum = 'ORD-' + Math.floor(Math.random() * 9000 + 1000);
    
    // Create order object
    const newOrder = {
        id: orderNum,
        shopName: document.getElementById('detailShopName').textContent,
        shopId: 'SHOP-001', // You can make this dynamic
        date: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        }),
        deliveryDate: document.getElementById('deliveryDate').value,
        status: 'pending',
        paymentMode: currentPaymentMode,
        subtotal: currentOrder.subtotal,
        discount: currentOrder.discount,
        gst: currentOrder.gst,
        netValue: currentOrder.netValue,
        items: currentOrder.items.map(item => ({
            name: item.product.name,
            qty: item.quantity,
            price: item.product.distributorPrice,
            total: item.quantity * item.product.distributorPrice
        })),
        notes: 'Created via mobile app'
    };
    
    // Save to allOrders
    allOrders.unshift(newOrder); // Add to beginning
    localStorage.setItem('fmcg_orders', JSON.stringify(allOrders));
    
    // Show success message
    showToast('✅ Order #' + orderNum + ' placed successfully!');
    
    // Reset order
    currentOrder = {
        items: [],
        subtotal: 0,
        discount: 0,
        gst: 0,
        netValue: 0
    };
    isConfirmed = false;
    
    // Navigate back to shop details - orders tab
    setTimeout(() => {
        navigateTo('shopDetailsScreen');
        // Activate orders tab
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-button')[0].classList.add('active');
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        const ordersTab = document.getElementById('ordersTab');
        if (ordersTab) ordersTab.classList.add('active');
    }, 1500);
}

// Capture Location (geo-tagging)
function captureLocation() {
    const btn = document.getElementById('locationBtn');
    const field = document.getElementById('locationField');
    const error = document.getElementById('locationError');

    if (!btn || !field) return;
    
    btn.textContent = '⏳ Capturing...';
    btn.style.opacity = '0.7';

    // Simulate a short delay like a real GPS capture
    setTimeout(function() {
        field.value = '18.520600, 73.856400';
        field.style.color = 'var(--accent)';
        field.style.fontFamily = "'JetBrains Mono', monospace";
        field.style.fontWeight = '700';
        btn.textContent = '✓ Captured';
        btn.style.background = 'linear-gradient(135deg, var(--accent) 0%, #00B894 100%)';
        btn.style.boxShadow = '0 4px 12px rgba(0,212,170,0.3)';
        btn.style.opacity = '1';
        if (error) error.classList.remove('show');
        field.classList.remove('error');
    }, 800);
}

// ==================== INITIALIZATION ====================

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem('fmcg_orders')) || [];
    if (savedOrders.length === 0) {
        // Load sample orders
        allOrders = getSampleOrders();
        localStorage.setItem('fmcg_orders', JSON.stringify(allOrders));
    } else {
        allOrders = savedOrders;
    }
    
    // Initialize returns from localStorage
    const savedReturns = JSON.parse(localStorage.getItem('fmcg_returns')) || [];
    if (savedReturns.length === 0) {
        allReturns = getSampleReturns();
        localStorage.setItem('fmcg_returns', JSON.stringify(allReturns));
    } else {
        allReturns = savedReturns;
    }
    
    // Update home screen stats
    updateHomeScreenStats();
    
    // Dummy geolocation for order summary
    const geoLocationEl = document.getElementById('geoLocation');
    if (geoLocationEl) {
        geoLocationEl.textContent = '📍 Location: 18.520600, 73.856400';
    }
    
    // Set minimum delivery date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    const deliveryDateInput = document.getElementById('deliveryDate');
    if (deliveryDateInput) {
        deliveryDateInput.min = minDate;
        deliveryDateInput.value = minDate;
    }
    
    // Real-time input validation
    const inputs = document.querySelectorAll('.form-input, .form-select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            const errorElement = document.getElementById(this.id + 'Error');
            if (this.value.trim() === '') {
                this.classList.add('error');
                if (errorElement) errorElement.classList.add('show');
            } else {
                this.classList.remove('error');
                if (errorElement) errorElement.classList.remove('show');
            }
        });

        input.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.classList.remove('error');
                const errorElement = document.getElementById(this.id + 'Error');
                if (errorElement) errorElement.classList.remove('show');
            }
        });
    });

    // Close modals on overlay click
    const shopDetailsModal = document.getElementById('shopDetailsModal');
    if (shopDetailsModal) {
        shopDetailsModal.addEventListener('click', function(e) {
            if (e.target === this) closeShopDetailsModal();
        });
    }

    const visitOverlay = document.getElementById('visitOverlay');
    if (visitOverlay) {
        visitOverlay.addEventListener('click', function(e) {
            if (e.target === this) closeVisitOverlay();
        });
    }

    const disabledOverlay = document.getElementById('disabledOverlay');
    if (disabledOverlay) {
        disabledOverlay.addEventListener('click', function() {
            this.classList.remove('active');
        });
    }

    const routeModal = document.getElementById('routeModal');
    if (routeModal) {
        routeModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }
    
    const enhancedRouteModal = document.getElementById('enhancedRouteModal');
    if (enhancedRouteModal) {
        enhancedRouteModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeEnhancedRouteModal();
            }
        });
    }
    
    const orderDetailsModal = document.getElementById('orderDetailsModal');
    if (orderDetailsModal) {
        orderDetailsModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    }
    
    const updateStatusModal = document.getElementById('updateStatusModal');
    if (updateStatusModal) {
        updateStatusModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeUpdateStatusModal();
            }
        });
    }
    
    // Close returns modal on overlay click
    document.addEventListener('click', function(e) {
        const returnsModal = document.getElementById('returnsDetailsModal');
        if (returnsModal && e.target === returnsModal) {
            closeReturnsModal();
        }
    });

    // Bottom nav hide/show on scroll
    (function() {
        let lastScrollY = window.scrollY;
        const nav = document.querySelector('.bottom-nav');

        window.addEventListener('scroll', function() {
            if (!nav) return;
            
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                nav.classList.add('hidden');
            } else {
                nav.classList.remove('hidden');
            }
            lastScrollY = currentScrollY;
        }, { passive: true });
    })();
    
    // Initialize route map when route screen is active
    if (document.getElementById('routeScreen').classList.contains('active')) {
        setTimeout(() => {
            if (currentRouteView === 'map') {
                initializeRealMap();
            } else {
                loadEnhancedRouteList();
            }
        }, 100);
    }
});

// ==================== MISSING FUNCTIONS ====================

// Close modal function
function closeModal() {
    const modal = document.getElementById('routeModal');
    if (modal) modal.classList.remove('active');
}

// Profile navigation function
function navigateToProfile() {
    showToast('👤 Profile feature coming soon!');
}

// Analytics navigation function
function navigateToAnalytics() {
    navigateTo('analyticsScreen');
    setActiveNav('navProfile'); // Or create a new nav item for analytics
    showToast('📊 Loading analytics dashboard...');
}

// Download revenue report function
function downloadRevenueReport() {
    showToast('📥 Downloading revenue report...');
    // In a real app, this would generate and download a report
    setTimeout(() => {
        showToast('✅ Revenue report downloaded successfully!');
    }, 1500);
}

// Update home screen stats
function updateHomeScreenStats() {
    // Update open orders count
    const openOrders = allOrders.filter(order => 
        order.status === 'pending' || order.status === 'processing' || order.status === 'shipped'
    ).length;
    
    const openOrdersElement = document.querySelector('.dashboard-stats .stat-card:nth-child(3) .stat-value');
    if (openOrdersElement) {
        openOrdersElement.textContent = openOrders;
    }
    
    // Update monthly revenue - HARDCODED TO ₹1.2L
    const monthlyRevenue = 120000; // ₹1.2L
    
    const monthlyRevenueElement = document.querySelector('.dashboard-stats .stat-card:nth-child(2) .stat-value');
    if (monthlyRevenueElement) {
        // Format as "₹1.2L" for values >= 100,000
        monthlyRevenueElement.textContent = '₹' + (monthlyRevenue / 100000).toFixed(1) + 'L';
    }
    
    // Update active shops count
    const activeShopsElement = document.querySelector('.dashboard-stats .stat-card:nth-child(1) .stat-value');
    if (activeShopsElement) {
        activeShopsElement.textContent = '247'; // Hardcoded for now
    }
    
    // Update returns count - count pending returns
    const pendingReturns = allReturns.filter(r => r.status === 'pending').length;
    const returnsElement = document.querySelector('.dashboard-stats .stat-card:nth-child(4) .stat-value');
    if (returnsElement) {
        returnsElement.textContent = pendingReturns;
    }
}

// Download analytics report
function downloadAnalyticsReport() {
    showToast('📊 Downloading analytics report...');
    setTimeout(() => {
        showToast('✅ Analytics report downloaded successfully!');
    }, 1500);
}