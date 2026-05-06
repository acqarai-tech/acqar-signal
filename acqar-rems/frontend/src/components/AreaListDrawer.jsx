// import { useState, useMemo } from 'react'

// // 200 Dubai areas with coordinates and metadata
// export const DUBAI_AREAS_LIST = [
//   // Prime / Iconic
//   { name: 'Downtown Dubai', zone: 'Prime', lat: 25.1972, lng: 55.2744, pricePerSqft: 3200, yield: 5.8, score: 82 },
//   { name: 'Palm Jumeirah', zone: 'Prime', lat: 25.1124, lng: 55.1390, pricePerSqft: 2950, yield: 4.5, score: 79 },
//   { name: 'DIFC', zone: 'Prime', lat: 25.2048, lng: 55.2708, pricePerSqft: 2800, yield: 5.9, score: 81 },
//   { name: 'Jumeirah Bay Island', zone: 'Prime', lat: 25.2000, lng: 55.2600, pricePerSqft: 4200, yield: 3.8, score: 76 },
//   { name: 'Emirates Hills', zone: 'Prime', lat: 25.0654, lng: 55.1619, pricePerSqft: 3800, yield: 3.5, score: 74 },
//   { name: 'Burj Khalifa District', zone: 'Prime', lat: 25.1940, lng: 55.2730, pricePerSqft: 3500, yield: 5.2, score: 80 },
//   { name: 'Dubai Mall Surrounds', zone: 'Prime', lat: 25.1975, lng: 55.2796, pricePerSqft: 3100, yield: 5.5, score: 78 },
//   { name: 'Jumeirah', zone: 'Prime', lat: 25.2048, lng: 55.2419, pricePerSqft: 2100, yield: 5.2, score: 72 },
//   { name: 'La Mer', zone: 'Prime', lat: 25.2250, lng: 55.2580, pricePerSqft: 2400, yield: 5.0, score: 73 },
//   { name: 'Bluewaters Island', zone: 'Prime', lat: 25.0803, lng: 55.1200, pricePerSqft: 2600, yield: 4.8, score: 71 },

//   // Marina / JBR
//   { name: 'Dubai Marina', zone: 'Marina', lat: 25.0761, lng: 55.1403, pricePerSqft: 1850, yield: 6.8, score: 77 },
//   { name: 'JBR', zone: 'Marina', lat: 25.0785, lng: 55.1333, pricePerSqft: 1900, yield: 6.5, score: 75 },
//   { name: 'Marina Gate', zone: 'Marina', lat: 25.0740, lng: 55.1390, pricePerSqft: 1950, yield: 6.6, score: 74 },
//   { name: 'Marina Promenade', zone: 'Marina', lat: 25.0775, lng: 55.1420, pricePerSqft: 1820, yield: 6.9, score: 73 },
//   { name: 'Dubai Harbour', zone: 'Marina', lat: 25.0720, lng: 55.1270, pricePerSqft: 2100, yield: 6.0, score: 74 },

//   // Business / Commercial
//   { name: 'Business Bay', zone: 'Business', lat: 25.1865, lng: 55.2644, pricePerSqft: 1650, yield: 7.2, score: 76 },
//   { name: 'Dubai Internet City', zone: 'Business', lat: 25.0952, lng: 55.1581, pricePerSqft: 1400, yield: 7.5, score: 70 },
//   { name: 'Dubai Media City', zone: 'Business', lat: 25.1001, lng: 55.1568, pricePerSqft: 1450, yield: 7.3, score: 69 },
//   { name: 'Tecom', zone: 'Business', lat: 25.1001, lng: 55.1568, pricePerSqft: 1380, yield: 7.8, score: 68 },
//   { name: 'One Central', zone: 'Business', lat: 25.2250, lng: 55.2830, pricePerSqft: 1600, yield: 7.0, score: 70 },

//   // Affordable / Mid-Market
//   { name: 'JVC', zone: 'Mid-Market', lat: 25.0586, lng: 55.2069, pricePerSqft: 1100, yield: 8.1, score: 67 },
//   { name: 'JVT', zone: 'Mid-Market', lat: 25.0550, lng: 55.1950, pricePerSqft: 1050, yield: 8.3, score: 65 },
//   { name: 'Arjan', zone: 'Mid-Market', lat: 25.0620, lng: 55.2150, pricePerSqft: 980, yield: 8.5, score: 64 },
//   { name: 'Dubai Production City', zone: 'Mid-Market', lat: 25.0400, lng: 55.2080, pricePerSqft: 920, yield: 9.0, score: 62 },
//   { name: 'Dubai Studio City', zone: 'Mid-Market', lat: 25.0400, lng: 55.1900, pricePerSqft: 900, yield: 9.2, score: 61 },
//   { name: 'Sports City', zone: 'Mid-Market', lat: 25.0450, lng: 55.2250, pricePerSqft: 950, yield: 8.8, score: 63 },
//   { name: 'Motor City', zone: 'Mid-Market', lat: 25.0460, lng: 55.2380, pricePerSqft: 970, yield: 8.7, score: 63 },
//   { name: 'Town Square', zone: 'Mid-Market', lat: 24.9935, lng: 55.1958, pricePerSqft: 880, yield: 9.5, score: 60 },
//   { name: 'Remraam', zone: 'Mid-Market', lat: 25.0250, lng: 55.1700, pricePerSqft: 860, yield: 9.3, score: 59 },
//   { name: 'Living Legends', zone: 'Mid-Market', lat: 25.0550, lng: 55.3200, pricePerSqft: 870, yield: 9.1, score: 59 },

//   // Villas / Suburban
//   { name: 'Dubai Hills Estate', zone: 'Villas', lat: 25.1017, lng: 55.2314, pricePerSqft: 1620, yield: 5.9, score: 74 },
//   { name: 'Arabian Ranches', zone: 'Villas', lat: 25.0639, lng: 55.2690, pricePerSqft: 1450, yield: 5.5, score: 71 },
//   { name: 'Arabian Ranches 2', zone: 'Villas', lat: 25.0550, lng: 55.2750, pricePerSqft: 1480, yield: 5.6, score: 70 },
//   { name: 'Arabian Ranches 3', zone: 'Villas', lat: 25.0450, lng: 55.2900, pricePerSqft: 1300, yield: 5.8, score: 68 },
//   { name: 'Damac Hills', zone: 'Villas', lat: 25.0400, lng: 55.2500, pricePerSqft: 1100, yield: 6.2, score: 66 },
//   { name: 'Damac Hills 2', zone: 'Villas', lat: 24.9700, lng: 55.3100, pricePerSqft: 850, yield: 7.5, score: 61 },
//   { name: 'Mudon', zone: 'Villas', lat: 25.0200, lng: 55.2600, pricePerSqft: 1050, yield: 6.5, score: 64 },
//   { name: 'The Springs', zone: 'Villas', lat: 25.0603, lng: 55.1619, pricePerSqft: 1200, yield: 6.0, score: 66 },
//   { name: 'The Meadows', zone: 'Villas', lat: 25.0650, lng: 55.1550, pricePerSqft: 1350, yield: 5.8, score: 68 },
//   { name: 'The Lakes', zone: 'Villas', lat: 25.0580, lng: 55.1500, pricePerSqft: 1400, yield: 5.7, score: 68 },
//   { name: 'The Greens', zone: 'Villas', lat: 25.0700, lng: 55.1480, pricePerSqft: 1300, yield: 6.2, score: 67 },
//   { name: 'The Views', zone: 'Villas', lat: 25.0680, lng: 55.1460, pricePerSqft: 1320, yield: 6.0, score: 67 },
//   { name: 'Jumeirah Park', zone: 'Villas', lat: 25.0480, lng: 55.1550, pricePerSqft: 1380, yield: 5.5, score: 67 },
//   { name: 'Jumeirah Islands', zone: 'Villas', lat: 25.0500, lng: 55.1400, pricePerSqft: 1550, yield: 5.2, score: 68 },
//   { name: 'Jumeirah Golf Estates', zone: 'Villas', lat: 25.0250, lng: 55.1650, pricePerSqft: 1420, yield: 5.0, score: 67 },
//   { name: 'Victory Heights', zone: 'Villas', lat: 25.0300, lng: 55.2200, pricePerSqft: 1080, yield: 6.3, score: 63 },

//   // North Dubai / Old Areas
//   { name: 'Deira', zone: 'Old Dubai', lat: 25.2697, lng: 55.3094, pricePerSqft: 950, yield: 7.8, score: 58 },
//   { name: 'Bur Dubai', zone: 'Old Dubai', lat: 25.2532, lng: 55.2868, pricePerSqft: 900, yield: 8.2, score: 57 },
//   { name: 'Karama', zone: 'Old Dubai', lat: 25.2532, lng: 55.2868, pricePerSqft: 850, yield: 8.5, score: 56 },
//   { name: 'Oud Metha', zone: 'Old Dubai', lat: 25.2300, lng: 55.3100, pricePerSqft: 920, yield: 8.0, score: 58 },
//   { name: 'Al Mankhool', zone: 'Old Dubai', lat: 25.2400, lng: 55.2800, pricePerSqft: 880, yield: 8.3, score: 56 },
//   { name: 'Al Baraha', zone: 'Old Dubai', lat: 25.2700, lng: 55.3200, pricePerSqft: 800, yield: 8.8, score: 54 },
//   { name: 'Garhoud', zone: 'Old Dubai', lat: 25.2450, lng: 55.3450, pricePerSqft: 950, yield: 7.9, score: 58 },
//   { name: 'Muhaisnah', zone: 'Old Dubai', lat: 25.2500, lng: 55.3400, pricePerSqft: 820, yield: 8.6, score: 55 },
//   { name: 'Rashidiya', zone: 'Old Dubai', lat: 25.2302, lng: 55.3600, pricePerSqft: 870, yield: 8.4, score: 56 },
//   { name: 'Mirdif', zone: 'Old Dubai', lat: 25.2149, lng: 55.4150, pricePerSqft: 950, yield: 7.8, score: 59 },

//   // Creek / East
//   { name: 'Dubai Creek Harbour', zone: 'Creek', lat: 25.2000, lng: 55.3200, pricePerSqft: 1800, yield: 6.2, score: 74 },
//   { name: 'Meydan', zone: 'Creek', lat: 25.1718, lng: 55.3092, pricePerSqft: 1500, yield: 6.5, score: 71 },
//   { name: 'MBR City', zone: 'Creek', lat: 25.1900, lng: 55.3100, pricePerSqft: 1650, yield: 6.0, score: 73 },
//   { name: 'Ras Al Khor', zone: 'Creek', lat: 25.1800, lng: 55.3500, pricePerSqft: 1100, yield: 7.2, score: 64 },
//   { name: 'Sobha Hartland', zone: 'Creek', lat: 25.1950, lng: 55.3050, pricePerSqft: 1700, yield: 6.1, score: 72 },
//   { name: 'Al Jaddaf', zone: 'Creek', lat: 25.2130, lng: 55.3280, pricePerSqft: 1300, yield: 6.8, score: 67 },
//   { name: 'Culture Village', zone: 'Creek', lat: 25.2200, lng: 55.3350, pricePerSqft: 1250, yield: 6.9, score: 66 },

//   // South Dubai
//   { name: 'Dubai South', zone: 'South', lat: 24.8974, lng: 55.1650, pricePerSqft: 1050, yield: 8.0, score: 65 },
//   { name: 'Expo City', zone: 'South', lat: 24.9674, lng: 55.1570, pricePerSqft: 1100, yield: 7.8, score: 66 },
//   { name: 'Dubai World Central', zone: 'South', lat: 24.8974, lng: 55.1650, pricePerSqft: 980, yield: 8.3, score: 63 },
//   { name: 'Emaar South', zone: 'South', lat: 24.9450, lng: 55.1780, pricePerSqft: 1020, yield: 8.1, score: 64 },
//   { name: 'Jebel Ali', zone: 'South', lat: 25.0069, lng: 55.0556, pricePerSqft: 900, yield: 8.5, score: 60 },
//   { name: 'Jebel Ali Village', zone: 'South', lat: 25.0200, lng: 55.0800, pricePerSqft: 950, yield: 8.2, score: 61 },

//   // Al Barsha / Umm Suqeim
//   { name: 'Al Barsha', zone: 'Mid-Central', lat: 25.1122, lng: 55.2011, pricePerSqft: 1050, yield: 7.5, score: 64 },
//   { name: 'Al Barsha South', zone: 'Mid-Central', lat: 25.0900, lng: 55.2100, pricePerSqft: 980, yield: 7.8, score: 62 },
//   { name: 'Umm Suqeim', zone: 'Mid-Central', lat: 25.1300, lng: 55.1900, pricePerSqft: 1600, yield: 5.8, score: 70 },
//   { name: 'Umm Al Sheif', zone: 'Mid-Central', lat: 25.1350, lng: 55.2000, pricePerSqft: 1400, yield: 6.0, score: 68 },
//   { name: 'Al Quoz', zone: 'Mid-Central', lat: 25.1503, lng: 55.2341, pricePerSqft: 900, yield: 8.5, score: 59 },
//   { name: 'Al Safa', zone: 'Mid-Central', lat: 25.1700, lng: 55.2100, pricePerSqft: 1800, yield: 5.5, score: 71 },
//   { name: 'Al Wasl', zone: 'Mid-Central', lat: 25.1900, lng: 55.2350, pricePerSqft: 1900, yield: 5.3, score: 72 },
//   { name: 'Al Manara', zone: 'Mid-Central', lat: 25.1600, lng: 55.2080, pricePerSqft: 1700, yield: 5.6, score: 70 },
//   { name: 'Al Sufouh', zone: 'Mid-Central', lat: 25.0950, lng: 55.1700, pricePerSqft: 1500, yield: 6.2, score: 68 },

//   // New / Emerging
//   { name: 'Dubai Hills Park', zone: 'Emerging', lat: 25.0980, lng: 55.2350, pricePerSqft: 1700, yield: 5.7, score: 73 },
//   { name: 'Tilal Al Ghaf', zone: 'Emerging', lat: 25.0480, lng: 55.2600, pricePerSqft: 1350, yield: 6.0, score: 67 },
//   { name: 'Emaar Beachfront', zone: 'Emerging', lat: 25.0750, lng: 55.1350, pricePerSqft: 2200, yield: 5.5, score: 73 },
//   { name: 'Siniya Island', zone: 'Emerging', lat: 25.5000, lng: 55.5800, pricePerSqft: 1500, yield: 6.0, score: 65 },
//   { name: 'Palm Jebel Ali', zone: 'Emerging', lat: 24.9900, lng: 55.0200, pricePerSqft: 2000, yield: 5.2, score: 68 },
//   { name: 'Creek Views', zone: 'Emerging', lat: 25.2100, lng: 55.3300, pricePerSqft: 1400, yield: 6.5, score: 67 },
//   { name: 'The Valley', zone: 'Emerging', lat: 24.9630, lng: 55.5120, pricePerSqft: 900, yield: 7.8, score: 61 },
//   { name: 'Dubai Islands', zone: 'Emerging', lat: 25.3600, lng: 55.3500, pricePerSqft: 1800, yield: 5.9, score: 70 },

//   // More Mid-Market
//   { name: 'Discovery Gardens', zone: 'Mid-Market', lat: 25.0400, lng: 55.1350, pricePerSqft: 780, yield: 9.5, score: 57 },
//   { name: 'International City', zone: 'Mid-Market', lat: 25.1638, lng: 55.4172, pricePerSqft: 620, yield: 10.5, score: 55 },
//   { name: 'Silicon Oasis', zone: 'Mid-Market', lat: 25.1186, lng: 55.3838, pricePerSqft: 850, yield: 9.0, score: 60 },
//   { name: 'Academic City', zone: 'Mid-Market', lat: 25.1130, lng: 55.4250, pricePerSqft: 780, yield: 9.2, score: 57 },
//   { name: 'Majan', zone: 'Mid-Market', lat: 25.0950, lng: 55.3800, pricePerSqft: 820, yield: 8.9, score: 58 },
//   { name: 'Dubailand', zone: 'Mid-Market', lat: 25.0600, lng: 55.3500, pricePerSqft: 880, yield: 8.6, score: 61 },
//   { name: 'Liwan', zone: 'Mid-Market', lat: 25.0750, lng: 55.3900, pricePerSqft: 800, yield: 9.3, score: 58 },
//   { name: 'Wadi Al Safa', zone: 'Mid-Market', lat: 25.0700, lng: 55.3700, pricePerSqft: 830, yield: 9.1, score: 59 },
//   { name: 'Al Furjan', zone: 'Mid-Market', lat: 25.0150, lng: 55.1290, pricePerSqft: 950, yield: 8.2, score: 62 },
//   { name: 'Jumeirah Village Triangle', zone: 'Mid-Market', lat: 25.0450, lng: 55.1600, pricePerSqft: 1000, yield: 8.0, score: 63 },

//   // Waterfront / Premium
//   { name: 'Port de La Mer', zone: 'Waterfront', lat: 25.2350, lng: 55.2700, pricePerSqft: 2300, yield: 5.1, score: 73 },
//   { name: 'Marasi Marina', zone: 'Waterfront', lat: 25.1860, lng: 55.2680, pricePerSqft: 2000, yield: 5.6, score: 72 },
//   { name: 'Dubai Water Canal', zone: 'Waterfront', lat: 25.1900, lng: 55.2600, pricePerSqft: 1900, yield: 5.8, score: 71 },
//   { name: 'Deira Waterfront', zone: 'Waterfront', lat: 25.2750, lng: 55.3000, pricePerSqft: 1200, yield: 7.0, score: 63 },
//   { name: 'Al Seef', zone: 'Waterfront', lat: 25.2400, lng: 55.3150, pricePerSqft: 1500, yield: 6.5, score: 67 },

//   // More areas to reach 200
//   { name: 'Falcon City', zone: 'Mid-Market', lat: 25.0900, lng: 55.3700, pricePerSqft: 870, yield: 8.8, score: 60 },
//   { name: 'Tiger Woods Dubai', zone: 'Villas', lat: 25.0280, lng: 55.1620, pricePerSqft: 1500, yield: 5.2, score: 66 },
//   { name: 'Polo Homes', zone: 'Villas', lat: 25.0850, lng: 55.2850, pricePerSqft: 1100, yield: 6.0, score: 63 },
//   { name: 'The Sustainable City', zone: 'Villas', lat: 24.9890, lng: 55.2090, pricePerSqft: 1250, yield: 6.3, score: 66 },
//   { name: 'Akoya Oxygen', zone: 'Villas', lat: 24.9700, lng: 55.2550, pricePerSqft: 820, yield: 7.8, score: 60 },
//   { name: 'Villanova', zone: 'Villas', lat: 25.0550, lng: 55.3400, pricePerSqft: 950, yield: 7.2, score: 62 },
//   { name: 'Serena', zone: 'Villas', lat: 25.0500, lng: 55.3350, pricePerSqft: 980, yield: 7.0, score: 62 },
//   { name: 'Nshama Town Square', zone: 'Mid-Market', lat: 24.9920, lng: 55.1980, pricePerSqft: 890, yield: 9.3, score: 60 },
//   { name: 'Sobha SeaHaven', zone: 'Waterfront', lat: 25.0780, lng: 55.1340, pricePerSqft: 2100, yield: 5.4, score: 72 },
//   { name: 'Ellington Beach House', zone: 'Prime', lat: 25.1100, lng: 55.1380, pricePerSqft: 2800, yield: 4.8, score: 74 },
//   { name: 'One Za abeel', zone: 'Prime', lat: 25.2200, lng: 55.2900, pricePerSqft: 3200, yield: 5.0, score: 77 },
//   { name: 'Burj Binghatti', zone: 'Prime', lat: 25.1850, lng: 55.2620, pricePerSqft: 3000, yield: 5.1, score: 76 },
//   { name: 'Six Senses Residences', zone: 'Prime', lat: 25.1130, lng: 55.1400, pricePerSqft: 4500, yield: 3.5, score: 72 },
//   { name: 'Atlantis The Royal Residences', zone: 'Prime', lat: 25.1160, lng: 55.1160, pricePerSqft: 5000, yield: 3.2, score: 70 },
//   { name: 'Address Beach Resort', zone: 'Waterfront', lat: 25.0760, lng: 55.1330, pricePerSqft: 2400, yield: 4.9, score: 71 },
//   { name: 'DIFC Living', zone: 'Prime', lat: 25.2100, lng: 55.2750, pricePerSqft: 2900, yield: 5.5, score: 78 },
//   { name: 'City Walk', zone: 'Prime', lat: 25.1980, lng: 55.2420, pricePerSqft: 2200, yield: 5.3, score: 73 },
//   { name: 'Boxpark Jumeirah', zone: 'Prime', lat: 25.1900, lng: 55.2350, pricePerSqft: 2000, yield: 5.6, score: 71 },
//   { name: 'Bluewaters Residences', zone: 'Prime', lat: 25.0800, lng: 55.1180, pricePerSqft: 2700, yield: 4.7, score: 72 },
//   { name: 'The World Islands', zone: 'Prime', lat: 25.2100, lng: 55.1500, pricePerSqft: 2500, yield: 4.5, score: 69 },

//   // Additional for 200
//   { name: 'Al Khail Heights', zone: 'Mid-Market', lat: 25.1180, lng: 55.3180, pricePerSqft: 950, yield: 8.0, score: 62 },
//   { name: 'Seasons Community', zone: 'Mid-Market', lat: 25.2200, lng: 55.3800, pricePerSqft: 780, yield: 9.5, score: 57 },
//   { name: 'Warsan', zone: 'Mid-Market', lat: 25.1750, lng: 55.3950, pricePerSqft: 750, yield: 9.8, score: 56 },
//   { name: 'Hor Al Anz', zone: 'Old Dubai', lat: 25.2780, lng: 55.3350, pricePerSqft: 780, yield: 9.0, score: 54 },
//   { name: 'Qusais', zone: 'Old Dubai', lat: 25.2600, lng: 55.3750, pricePerSqft: 720, yield: 9.6, score: 53 },
//   { name: 'Nadd Al Hamar', zone: 'Old Dubai', lat: 25.2100, lng: 55.3600, pricePerSqft: 760, yield: 9.4, score: 55 },
//   { name: 'Nad Al Sheba', zone: 'Old Dubai', lat: 25.1600, lng: 55.3200, pricePerSqft: 1000, yield: 7.8, score: 60 },
//   { name: 'Al Twar', zone: 'Old Dubai', lat: 25.2600, lng: 55.3500, pricePerSqft: 760, yield: 9.2, score: 54 },
//   { name: 'Al Mizhar', zone: 'Old Dubai', lat: 25.2350, lng: 55.4000, pricePerSqft: 800, yield: 8.8, score: 55 },
//   { name: 'Muhaisanah', zone: 'Old Dubai', lat: 25.2500, lng: 55.3550, pricePerSqft: 740, yield: 9.4, score: 53 },
//   { name: 'Al Nahda', zone: 'Old Dubai', lat: 25.2650, lng: 55.3450, pricePerSqft: 820, yield: 8.9, score: 56 },
//   { name: 'Al Qusais', zone: 'Old Dubai', lat: 25.2580, lng: 55.3780, pricePerSqft: 730, yield: 9.7, score: 53 },
//   { name: 'Jumeirah 1', zone: 'Prime', lat: 25.2100, lng: 55.2500, pricePerSqft: 2200, yield: 5.0, score: 72 },
//   { name: 'Jumeirah 2', zone: 'Prime', lat: 25.1900, lng: 55.2400, pricePerSqft: 2100, yield: 5.1, score: 71 },
//   { name: 'Jumeirah 3', zone: 'Prime', lat: 25.1750, lng: 55.2300, pricePerSqft: 2000, yield: 5.3, score: 70 },
//   { name: 'Al Hudaiba', zone: 'Old Dubai', lat: 25.2400, lng: 55.2700, pricePerSqft: 950, yield: 8.0, score: 57 },
//   { name: 'Satwa', zone: 'Old Dubai', lat: 25.2300, lng: 55.2600, pricePerSqft: 1000, yield: 7.8, score: 59 },
//   { name: 'Al Mina', zone: 'Old Dubai', lat: 25.2300, lng: 55.2800, pricePerSqft: 900, yield: 8.3, score: 56 },
//   { name: 'Ras Al Khor Industrial', zone: 'Business', lat: 25.1850, lng: 55.3600, pricePerSqft: 700, yield: 10.0, score: 55 },
//   { name: 'Dubai Investment Park', zone: 'Business', lat: 25.0200, lng: 55.1600, pricePerSqft: 850, yield: 8.8, score: 60 },
//   { name: 'Dubai Science Park', zone: 'Business', lat: 25.0950, lng: 55.2180, pricePerSqft: 1100, yield: 7.5, score: 63 },
//   { name: 'Al Quoz Industrial', zone: 'Business', lat: 25.1400, lng: 55.2400, pricePerSqft: 800, yield: 9.2, score: 55 },
//   { name: 'Muhaisna', zone: 'Old Dubai', lat: 25.2480, lng: 55.3380, pricePerSqft: 750, yield: 9.5, score: 53 },
//   { name: 'Mirdif Hills', zone: 'Mid-Market', lat: 25.2200, lng: 55.4100, pricePerSqft: 980, yield: 7.8, score: 61 },
//   { name: 'Al Furjan Pavilion', zone: 'Mid-Market', lat: 25.0120, lng: 55.1250, pricePerSqft: 920, yield: 8.4, score: 61 },
//   { name: 'Azizi Riviera', zone: 'Creek', lat: 25.1800, lng: 55.3050, pricePerSqft: 1300, yield: 7.0, score: 66 },
//   { name: 'Hartland Forest', zone: 'Creek', lat: 25.1980, lng: 55.3000, pricePerSqft: 1600, yield: 6.2, score: 69 },
//   { name: 'Reem Townhouses', zone: 'Villas', lat: 25.0680, lng: 55.2800, pricePerSqft: 1050, yield: 6.8, score: 63 },
//   { name: 'Nakheel Communities', zone: 'Villas', lat: 25.0600, lng: 55.1700, pricePerSqft: 1300, yield: 5.9, score: 66 },
//   { name: 'Palma Residences', zone: 'Prime', lat: 25.1100, lng: 55.1380, pricePerSqft: 3100, yield: 4.2, score: 74 },
//   { name: 'Rosa Al Safa', zone: 'Mid-Central', lat: 25.1650, lng: 55.2150, pricePerSqft: 1700, yield: 5.6, score: 69 },
//   { name: 'Canal Front Residences', zone: 'Waterfront', lat: 25.1880, lng: 55.2580, pricePerSqft: 2000, yield: 5.8, score: 72 },
//   { name: 'Mag 5 Boulevard', zone: 'Mid-Market', lat: 25.0350, lng: 55.1900, pricePerSqft: 880, yield: 9.0, score: 59 },
//   { name: 'Binghatti Avenue', zone: 'Mid-Market', lat: 25.0580, lng: 55.2080, pricePerSqft: 950, yield: 8.5, score: 62 },
//   { name: 'Pantheon Elysee', zone: 'Mid-Market', lat: 25.0560, lng: 55.2060, pricePerSqft: 980, yield: 8.3, score: 62 },
// ]

// const ZONE_COLORS = {
//   'Prime': '#B87333',
//   'Marina': '#2980B9',
//   'Business': '#8E44AD',
//   'Mid-Market': '#27AE60',
//   'Villas': '#F39C12',
//   'Old Dubai': '#7F8C8D',
//   'Creek': '#16A085',
//   'South': '#E67E22',
//   'Mid-Central': '#2ECC71',
//   'Emerging': '#E74C3C',
//   'Waterfront': '#1ABC9C',
// }

// function getScoreColor(score) {
//   if (score >= 75) return '#27AE60'
//   if (score >= 65) return '#F39C12'
//   return '#E74C3C'
// }

// function getScoreLabel(score) {
//   if (score >= 75) return 'BUY'
//   if (score >= 65) return 'HOLD'
//   return 'WATCH'
// }

// export default function AreaListDrawer({ onClose, onSelectArea }) {
//   const [search, setSearch] = useState('')
//   const [selectedZone, setSelectedZone] = useState('All')
//   const [sortBy, setSortBy] = useState('score')

//   const zones = ['All', ...Object.keys(ZONE_COLORS)]

//   const filtered = useMemo(() => {
//     let list = DUBAI_AREAS_LIST
//     if (selectedZone !== 'All') list = list.filter(a => a.zone === selectedZone)
//     if (search.trim()) {
//       const q = search.toLowerCase()
//       list = list.filter(a => a.name.toLowerCase().includes(q) || a.zone.toLowerCase().includes(q))
//     }
//     return [...list].sort((a, b) => {
//       if (sortBy === 'score') return b.score - a.score
//       if (sortBy === 'yield') return b.yield - a.yield
//       if (sortBy === 'price') return b.pricePerSqft - a.pricePerSqft
//       return a.name.localeCompare(b.name)
//     })
//   }, [search, selectedZone, sortBy])

//   return (
//     <div style={{
//       height: '100%', display: 'flex', flexDirection: 'column',
//       background: 'var(--bg-secondary)', overflow: 'hidden',
//     }}>
//       {/* Header */}
//       <div style={{
//         display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//         padding: '12px 16px 8px', borderBottom: '1px solid var(--border-color)', flexShrink: 0,
//       }}>
//         <div>
//           <span style={{ fontSize: '11px', fontWeight: 800, color: '#B87333', letterSpacing: '1px' }}>◆ AREAS</span>
//           <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: '8px' }}>{filtered.length} of {DUBAI_AREAS_LIST.length}</span>
//         </div>
//         <button
//           onClick={onClose}
//           style={{
//             width: 36, height: 36, background: 'var(--bg-input)',
//             border: '1px solid var(--border-panel)', borderRadius: '6px',
//             color: 'var(--text-primary)', cursor: 'pointer', fontSize: '16px',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
//           }}
//         >✕</button>
//       </div>

//       {/* Search */}
//       <div style={{ padding: '8px 12px', flexShrink: 0 }}>
//         <input
//           value={search}
//           onChange={e => setSearch(e.target.value)}
//           placeholder="Search areas..."
//           style={{
//             width: '100%', padding: '8px 12px', background: 'var(--bg-input)',
//             border: '1px solid var(--border-panel)', borderRadius: '8px',
//             color: 'var(--text-primary)', fontSize: '13px', outline: 'none',
//           }}
//         />
//       </div>

//       {/* Zone filter pills */}
//       <div style={{
//         display: 'flex', gap: '6px', padding: '0 12px 8px',
//         overflowX: 'auto', flexShrink: 0,
//         scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
//       }}>
//         {zones.map(zone => (
//           <button
//             key={zone}
//             onClick={() => setSelectedZone(zone)}
//             style={{
//               padding: '4px 10px', borderRadius: '12px', whiteSpace: 'nowrap',
//               fontSize: '10px', fontWeight: 700, cursor: 'pointer',
//               border: `1px solid ${selectedZone === zone ? (ZONE_COLORS[zone] || '#B87333') : 'var(--border-panel)'}`,
//               background: selectedZone === zone ? `${(ZONE_COLORS[zone] || '#B87333')}22` : 'var(--bg-input)',
//               color: selectedZone === zone ? (ZONE_COLORS[zone] || '#B87333') : 'var(--text-muted)',
//               touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
//             }}
//           >{zone}</button>
//         ))}
//       </div>

//       {/* Sort bar */}
//       <div style={{
//         display: 'flex', gap: '6px', padding: '0 12px 8px',
//         borderBottom: '1px solid var(--border-color)', flexShrink: 0, alignItems: 'center',
//       }}>
//         <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginRight: '2px' }}>Sort:</span>
//         {[
//           { key: 'score', label: 'Score' },
//           { key: 'yield', label: 'Yield' },
//           { key: 'price', label: 'Price' },
//           { key: 'name', label: 'A–Z' },
//         ].map(s => (
//           <button
//             key={s.key}
//             onClick={() => setSortBy(s.key)}
//             style={{
//               padding: '3px 9px', borderRadius: '6px',
//               fontSize: '10px', fontWeight: 700, cursor: 'pointer',
//               border: '1px solid var(--border-panel)',
//               background: sortBy === s.key ? 'rgba(184,115,51,0.15)' : 'var(--bg-input)',
//               color: sortBy === s.key ? '#B87333' : 'var(--text-muted)',
//               touchAction: 'manipulation',
//             }}
//           >{s.label}</button>
//         ))}
//       </div>

//       {/* Area list */}
//       <div style={{ flex: 1, overflowY: 'auto', padding: '6px 8px' }}>
//         {filtered.map(area => {
//           const scoreColor = getScoreColor(area.score)
//           const scoreLabel = getScoreLabel(area.score)
//           return (
//             <div
//               key={area.name}
//               onClick={() => onSelectArea(area)}
//               style={{
//                 display: 'flex', alignItems: 'center', gap: '10px',
//                 padding: '10px 10px', marginBottom: '4px',
//                 background: 'var(--bg-primary)', border: '1px solid var(--border-panel)',
//                 borderRadius: '8px', cursor: 'pointer',
//                 touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
//                 transition: 'border-color 0.15s',
//               }}
//               onMouseEnter={e => e.currentTarget.style.borderColor = '#B87333'}
//               onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-panel)'}
//             >
//               {/* Zone dot */}
//               <div style={{
//                 width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
//                 background: ZONE_COLORS[area.zone] || '#B87333',
//               }} />

//               {/* Name + zone */}
//               <div style={{ flex: 1, minWidth: 0 }}>
//                 <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//                   {area.name}
//                 </div>
//                 <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{area.zone}</div>
//               </div>

//               {/* Stats */}
//               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px', flexShrink: 0 }}>
//                 <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
//                   AED <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{area.pricePerSqft.toLocaleString()}</span>/sqft
//                 </div>
//                 <div style={{ fontSize: '10px', color: '#27AE60', fontWeight: 600 }}>
//                   {area.yield}% yield
//                 </div>
//               </div>

//               {/* Score badge */}
//               <div style={{
//                 minWidth: 44, textAlign: 'center', padding: '4px 6px',
//                 background: `${scoreColor}22`, border: `1px solid ${scoreColor}44`,
//                 borderRadius: '6px', flexShrink: 0,
//               }}>
//                 <div style={{ fontSize: '13px', fontWeight: 900, color: scoreColor }}>{area.score}</div>
//                 <div style={{ fontSize: '8px', fontWeight: 800, color: scoreColor, letterSpacing: '0.5px' }}>{scoreLabel}</div>
//               </div>

//               {/* Arrow */}
//               <span style={{ fontSize: '14px', color: 'var(--text-muted)', flexShrink: 0 }}>›</span>
//             </div>
//           )
//         })}

//         {filtered.length === 0 && (
//           <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)', fontSize: '12px' }}>
//             <div style={{ fontSize: '28px', marginBottom: '10px' }}>🔍</div>
//             No areas found for "{search}"
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }












import { useState, useMemo, useEffect } from 'react'

// Real 2026 Dubai property data
// Sources: DXB Analytics (DLD Jan 2026), Property Monitor Feb 2026,
// Bayut Annual Report 2025, Knight Frank Q1 2025, Engel & Volkers Feb 2026
// Market-wide average: AED 1,976/sqft (Jan 2026, DLD) — up 18% YoY
// Last updated: May 2026

export const DUBAI_AREAS_LIST = [
  // PRIME — DXB Analytics Jan 2026, Knight Frank Q1 2025
  { name: 'Downtown Dubai', zone: 'Prime', lat: 25.1972, lng: 55.2744, pricePerSqft: 4200, yield: 5.2, score: 84 },
  { name: 'Palm Jumeirah', zone: 'Prime', lat: 25.1124, lng: 55.1390, pricePerSqft: 4000, yield: 4.2, score: 81 },
  { name: 'DIFC', zone: 'Prime', lat: 25.2048, lng: 55.2708, pricePerSqft: 3200, yield: 5.7, score: 82 },
  { name: 'Jumeirah Bay Island', zone: 'Prime', lat: 25.2000, lng: 55.2600, pricePerSqft: 5200, yield: 3.5, score: 77 },
  { name: 'Emirates Hills', zone: 'Prime', lat: 25.0654, lng: 55.1619, pricePerSqft: 4500, yield: 3.2, score: 75 },
  { name: 'Burj Khalifa District', zone: 'Prime', lat: 25.1940, lng: 55.2730, pricePerSqft: 4100, yield: 5.0, score: 81 },
  { name: 'Dubai Mall Surrounds', zone: 'Prime', lat: 25.1975, lng: 55.2796, pricePerSqft: 3900, yield: 5.3, score: 79 },
  { name: 'Jumeirah', zone: 'Prime', lat: 25.2048, lng: 55.2419, pricePerSqft: 2800, yield: 5.0, score: 73 },
  { name: 'La Mer', zone: 'Prime', lat: 25.2250, lng: 55.2580, pricePerSqft: 3100, yield: 4.8, score: 74 },
  { name: 'Bluewaters Island', zone: 'Prime', lat: 25.0803, lng: 55.1200, pricePerSqft: 3400, yield: 4.6, score: 72 },
  { name: 'Jumeirah 1', zone: 'Prime', lat: 25.2100, lng: 55.2500, pricePerSqft: 2700, yield: 5.0, score: 73 },
  { name: 'Jumeirah 2', zone: 'Prime', lat: 25.1900, lng: 55.2400, pricePerSqft: 2600, yield: 5.1, score: 72 },
  { name: 'Jumeirah 3', zone: 'Prime', lat: 25.1750, lng: 55.2300, pricePerSqft: 2500, yield: 5.3, score: 71 },
  { name: 'City Walk', zone: 'Prime', lat: 25.1980, lng: 55.2420, pricePerSqft: 2900, yield: 5.1, score: 74 },
  { name: 'DIFC Living', zone: 'Prime', lat: 25.2100, lng: 55.2750, pricePerSqft: 3300, yield: 5.4, score: 79 },
  { name: 'One Za abeel', zone: 'Prime', lat: 25.2200, lng: 55.2900, pricePerSqft: 3700, yield: 4.8, score: 78 },
  { name: 'Burj Binghatti', zone: 'Prime', lat: 25.1850, lng: 55.2620, pricePerSqft: 3500, yield: 4.9, score: 77 },
  { name: 'Six Senses Residences', zone: 'Prime', lat: 25.1130, lng: 55.1400, pricePerSqft: 5000, yield: 3.2, score: 73 },
  { name: 'Atlantis The Royal Residences', zone: 'Prime', lat: 25.1160, lng: 55.1160, pricePerSqft: 5800, yield: 3.0, score: 71 },
  { name: 'Ellington Beach House', zone: 'Prime', lat: 25.1100, lng: 55.1380, pricePerSqft: 3200, yield: 4.6, score: 75 },
  { name: 'Palma Residences', zone: 'Prime', lat: 25.1100, lng: 55.1380, pricePerSqft: 3600, yield: 4.0, score: 75 },
  { name: 'Bluewaters Residences', zone: 'Prime', lat: 25.0800, lng: 55.1180, pricePerSqft: 3200, yield: 4.5, score: 73 },
  { name: 'The World Islands', zone: 'Prime', lat: 25.2100, lng: 55.1500, pricePerSqft: 2900, yield: 4.3, score: 70 },
  { name: 'Boxpark Jumeirah', zone: 'Prime', lat: 25.1900, lng: 55.2350, pricePerSqft: 2600, yield: 5.4, score: 72 },

  // MARINA / JBR — Bayut 2025: Dubai Marina AED 2,187 +5% YoY = ~2,300
  { name: 'Dubai Marina', zone: 'Marina', lat: 25.0761, lng: 55.1403, pricePerSqft: 2300, yield: 5.6, score: 78 },
  { name: 'JBR', zone: 'Marina', lat: 25.0785, lng: 55.1333, pricePerSqft: 2400, yield: 5.8, score: 76 },
  { name: 'Marina Gate', zone: 'Marina', lat: 25.0740, lng: 55.1390, pricePerSqft: 2350, yield: 5.9, score: 75 },
  { name: 'Marina Promenade', zone: 'Marina', lat: 25.0775, lng: 55.1420, pricePerSqft: 2200, yield: 6.0, score: 74 },
  { name: 'Dubai Harbour', zone: 'Marina', lat: 25.0720, lng: 55.1270, pricePerSqft: 2600, yield: 5.5, score: 75 },

  // BUSINESS — DXB Analytics Jan 2026: Business Bay = 2,901/sqft
  { name: 'Business Bay', zone: 'Business', lat: 25.1865, lng: 55.2644, pricePerSqft: 2901, yield: 5.7, score: 78 },
  { name: 'Dubai Internet City', zone: 'Business', lat: 25.0952, lng: 55.1581, pricePerSqft: 1800, yield: 7.0, score: 71 },
  { name: 'Dubai Media City', zone: 'Business', lat: 25.1001, lng: 55.1568, pricePerSqft: 1850, yield: 6.8, score: 70 },
  { name: 'Tecom', zone: 'Business', lat: 25.1001, lng: 55.1568, pricePerSqft: 1700, yield: 7.2, score: 69 },
  { name: 'One Central', zone: 'Business', lat: 25.2250, lng: 55.2830, pricePerSqft: 2000, yield: 6.5, score: 71 },
  { name: 'Dubai Investment Park', zone: 'Business', lat: 25.0200, lng: 55.1600, pricePerSqft: 773, yield: 9.9, score: 61 },
  { name: 'Dubai Science Park', zone: 'Business', lat: 25.0950, lng: 55.2180, pricePerSqft: 1350, yield: 7.2, score: 64 },
  { name: 'Ras Al Khor Industrial', zone: 'Business', lat: 25.1850, lng: 55.3600, pricePerSqft: 900, yield: 9.5, score: 56 },
  { name: 'Al Quoz Industrial', zone: 'Business', lat: 25.1400, lng: 55.2400, pricePerSqft: 950, yield: 8.8, score: 56 },

  // MID-MARKET — DXB Analytics Jan 2026: JVC=1,473/sqft, Silicon Oasis=1,501
  // Bayut 2025: Arjan=1,355, International City yield 10%, Discovery Gardens 9.47%
  { name: 'JVC', zone: 'Mid-Market', lat: 25.0586, lng: 55.2069, pricePerSqft: 1473, yield: 6.7, score: 69 },
  { name: 'JVT', zone: 'Mid-Market', lat: 25.0550, lng: 55.1950, pricePerSqft: 1350, yield: 7.0, score: 66 },
  { name: 'Arjan', zone: 'Mid-Market', lat: 25.0620, lng: 55.2150, pricePerSqft: 1355, yield: 8.2, score: 65 },
  { name: 'Dubai Production City', zone: 'Mid-Market', lat: 25.0400, lng: 55.2080, pricePerSqft: 1150, yield: 8.5, score: 63 },
  { name: 'Dubai Studio City', zone: 'Mid-Market', lat: 25.0400, lng: 55.1900, pricePerSqft: 1100, yield: 8.8, score: 62 },
  { name: 'Sports City', zone: 'Mid-Market', lat: 25.0450, lng: 55.2250, pricePerSqft: 1180, yield: 8.5, score: 64 },
  { name: 'Motor City', zone: 'Mid-Market', lat: 25.0460, lng: 55.2380, pricePerSqft: 1200, yield: 8.3, score: 64 },
  { name: 'Town Square', zone: 'Mid-Market', lat: 24.9935, lng: 55.1958, pricePerSqft: 1050, yield: 7.7, score: 61 },
  { name: 'Remraam', zone: 'Mid-Market', lat: 25.0250, lng: 55.1700, pricePerSqft: 980, yield: 8.8, score: 60 },
  { name: 'Living Legends', zone: 'Mid-Market', lat: 25.0550, lng: 55.3200, pricePerSqft: 1020, yield: 8.8, score: 60 },
  { name: 'Discovery Gardens', zone: 'Mid-Market', lat: 25.0400, lng: 55.1350, pricePerSqft: 950, yield: 9.5, score: 58 },
  { name: 'International City', zone: 'Mid-Market', lat: 25.1638, lng: 55.4172, pricePerSqft: 750, yield: 10.0, score: 56 },
  { name: 'Silicon Oasis', zone: 'Mid-Market', lat: 25.1186, lng: 55.3838, pricePerSqft: 1501, yield: 8.5, score: 62 },
  { name: 'Academic City', zone: 'Mid-Market', lat: 25.1130, lng: 55.4250, pricePerSqft: 980, yield: 9.0, score: 58 },
  { name: 'Majan', zone: 'Mid-Market', lat: 25.0950, lng: 55.3800, pricePerSqft: 1050, yield: 8.5, score: 59 },
  { name: 'Dubailand', zone: 'Mid-Market', lat: 25.0600, lng: 55.3500, pricePerSqft: 1100, yield: 8.2, score: 62 },
  { name: 'Liwan', zone: 'Mid-Market', lat: 25.0750, lng: 55.3900, pricePerSqft: 980, yield: 8.8, score: 59 },
  { name: 'Wadi Al Safa', zone: 'Mid-Market', lat: 25.0700, lng: 55.3700, pricePerSqft: 1020, yield: 8.6, score: 60 },
  { name: 'Al Furjan', zone: 'Mid-Market', lat: 25.0150, lng: 55.1290, pricePerSqft: 1200, yield: 7.7, score: 63 },
  { name: 'Jumeirah Village Triangle', zone: 'Mid-Market', lat: 25.0450, lng: 55.1600, pricePerSqft: 1280, yield: 7.5, score: 64 },
  { name: 'Al Khail Heights', zone: 'Mid-Market', lat: 25.1180, lng: 55.3180, pricePerSqft: 1150, yield: 7.8, score: 63 },
  { name: 'Seasons Community', zone: 'Mid-Market', lat: 25.2200, lng: 55.3800, pricePerSqft: 920, yield: 9.2, score: 58 },
  { name: 'Warsan', zone: 'Mid-Market', lat: 25.1750, lng: 55.3950, pricePerSqft: 880, yield: 9.5, score: 57 },
  { name: 'Mirdif Hills', zone: 'Mid-Market', lat: 25.2200, lng: 55.4100, pricePerSqft: 1150, yield: 7.5, score: 62 },
  { name: 'Al Furjan Pavilion', zone: 'Mid-Market', lat: 25.0120, lng: 55.1250, pricePerSqft: 1100, yield: 8.0, score: 62 },
  { name: 'Falcon City', zone: 'Mid-Market', lat: 25.0900, lng: 55.3700, pricePerSqft: 1020, yield: 8.5, score: 61 },
  { name: 'Nshama Town Square', zone: 'Mid-Market', lat: 24.9920, lng: 55.1980, pricePerSqft: 1080, yield: 9.0, score: 61 },
  { name: 'Binghatti Avenue', zone: 'Mid-Market', lat: 25.0580, lng: 55.2080, pricePerSqft: 1200, yield: 8.0, score: 63 },
  { name: 'Pantheon Elysee', zone: 'Mid-Market', lat: 25.0560, lng: 55.2060, pricePerSqft: 1220, yield: 7.9, score: 63 },
  { name: 'Mag 5 Boulevard', zone: 'Mid-Market', lat: 25.0350, lng: 55.1900, pricePerSqft: 1050, yield: 8.6, score: 60 },

  // VILLAS — Bayut 2025: Dubai Hills Estate DLD strongest growth
  // Arabian Ranches +15.7% PSF YoY, Al Furjan villas 1,526/sqft, DAMAC Hills 2 = 871 Q3'24 +23.5% = 1,075
  { name: 'Dubai Hills Estate', zone: 'Villas', lat: 25.1017, lng: 55.2314, pricePerSqft: 2100, yield: 5.7, score: 76 },
  { name: 'Arabian Ranches', zone: 'Villas', lat: 25.0639, lng: 55.2690, pricePerSqft: 1900, yield: 5.2, score: 73 },
  { name: 'Arabian Ranches 2', zone: 'Villas', lat: 25.0550, lng: 55.2750, pricePerSqft: 1850, yield: 5.3, score: 72 },
  { name: 'Arabian Ranches 3', zone: 'Villas', lat: 25.0450, lng: 55.2900, pricePerSqft: 1650, yield: 5.6, score: 70 },
  { name: 'Damac Hills', zone: 'Villas', lat: 25.0400, lng: 55.2500, pricePerSqft: 1420, yield: 7.6, score: 68 },
  { name: 'Damac Hills 2', zone: 'Villas', lat: 24.9700, lng: 55.3100, pricePerSqft: 1075, yield: 6.2, score: 63 },
  { name: 'Mudon', zone: 'Villas', lat: 25.0200, lng: 55.2600, pricePerSqft: 1350, yield: 6.2, score: 66 },
  { name: 'The Springs', zone: 'Villas', lat: 25.0603, lng: 55.1619, pricePerSqft: 1550, yield: 5.8, score: 68 },
  { name: 'The Meadows', zone: 'Villas', lat: 25.0650, lng: 55.1550, pricePerSqft: 1700, yield: 5.5, score: 69 },
  { name: 'The Lakes', zone: 'Villas', lat: 25.0580, lng: 55.1500, pricePerSqft: 1750, yield: 5.4, score: 69 },
  { name: 'The Greens', zone: 'Villas', lat: 25.0700, lng: 55.1480, pricePerSqft: 1620, yield: 5.9, score: 68 },
  { name: 'The Views', zone: 'Villas', lat: 25.0680, lng: 55.1460, pricePerSqft: 1650, yield: 5.7, score: 68 },
  { name: 'Jumeirah Park', zone: 'Villas', lat: 25.0480, lng: 55.1550, pricePerSqft: 1720, yield: 5.2, score: 68 },
  { name: 'Jumeirah Islands', zone: 'Villas', lat: 25.0500, lng: 55.1400, pricePerSqft: 1900, yield: 5.0, score: 69 },
  { name: 'Jumeirah Golf Estates', zone: 'Villas', lat: 25.0250, lng: 55.1650, pricePerSqft: 1800, yield: 4.8, score: 68 },
  { name: 'Victory Heights', zone: 'Villas', lat: 25.0300, lng: 55.2200, pricePerSqft: 1380, yield: 6.0, score: 64 },
  { name: 'Tiger Woods Dubai', zone: 'Villas', lat: 25.0280, lng: 55.1620, pricePerSqft: 1850, yield: 5.0, score: 67 },
  { name: 'Polo Homes', zone: 'Villas', lat: 25.0850, lng: 55.2850, pricePerSqft: 1400, yield: 5.8, score: 64 },
  { name: 'The Sustainable City', zone: 'Villas', lat: 24.9890, lng: 55.2090, pricePerSqft: 1600, yield: 6.0, score: 67 },
  { name: 'Akoya Oxygen', zone: 'Villas', lat: 24.9700, lng: 55.2550, pricePerSqft: 1050, yield: 7.5, score: 62 },
  { name: 'Villanova', zone: 'Villas', lat: 25.0550, lng: 55.3400, pricePerSqft: 1250, yield: 6.8, score: 64 },
  { name: 'Serena', zone: 'Villas', lat: 25.0500, lng: 55.3350, pricePerSqft: 1280, yield: 5.4, score: 63 },
  { name: 'Reem Townhouses', zone: 'Villas', lat: 25.0680, lng: 55.2800, pricePerSqft: 1350, yield: 6.5, score: 64 },
  { name: 'Nakheel Communities', zone: 'Villas', lat: 25.0600, lng: 55.1700, pricePerSqft: 1650, yield: 5.6, score: 67 },

  // OLD DUBAI — affordable segment, rents +21% YoY (Bayut 2025)
  { name: 'Deira', zone: 'Old Dubai', lat: 25.2697, lng: 55.3094, pricePerSqft: 1100, yield: 7.5, score: 59 },
  { name: 'Bur Dubai', zone: 'Old Dubai', lat: 25.2532, lng: 55.2868, pricePerSqft: 1050, yield: 7.8, score: 58 },
  { name: 'Karama', zone: 'Old Dubai', lat: 25.2532, lng: 55.2868, pricePerSqft: 980, yield: 8.2, score: 57 },
  { name: 'Oud Metha', zone: 'Old Dubai', lat: 25.2300, lng: 55.3100, pricePerSqft: 1080, yield: 7.7, score: 59 },
  { name: 'Al Mankhool', zone: 'Old Dubai', lat: 25.2400, lng: 55.2800, pricePerSqft: 1020, yield: 8.0, score: 57 },
  { name: 'Al Baraha', zone: 'Old Dubai', lat: 25.2700, lng: 55.3200, pricePerSqft: 950, yield: 8.5, score: 55 },
  { name: 'Garhoud', zone: 'Old Dubai', lat: 25.2450, lng: 55.3450, pricePerSqft: 1100, yield: 7.6, score: 59 },
  { name: 'Muhaisnah', zone: 'Old Dubai', lat: 25.2500, lng: 55.3400, pricePerSqft: 980, yield: 8.3, score: 56 },
  { name: 'Rashidiya', zone: 'Old Dubai', lat: 25.2302, lng: 55.3600, pricePerSqft: 1020, yield: 8.1, score: 57 },
  { name: 'Mirdif', zone: 'Old Dubai', lat: 25.2149, lng: 55.4150, pricePerSqft: 1150, yield: 7.5, score: 60 },
  { name: 'Hor Al Anz', zone: 'Old Dubai', lat: 25.2780, lng: 55.3350, pricePerSqft: 920, yield: 8.7, score: 55 },
  { name: 'Qusais', zone: 'Old Dubai', lat: 25.2600, lng: 55.3750, pricePerSqft: 850, yield: 9.3, score: 54 },
  { name: 'Nadd Al Hamar', zone: 'Old Dubai', lat: 25.2100, lng: 55.3600, pricePerSqft: 900, yield: 9.0, score: 56 },
  { name: 'Nad Al Sheba', zone: 'Old Dubai', lat: 25.1600, lng: 55.3200, pricePerSqft: 1200, yield: 7.5, score: 61 },
  { name: 'Al Twar', zone: 'Old Dubai', lat: 25.2600, lng: 55.3500, pricePerSqft: 900, yield: 8.9, score: 55 },
  { name: 'Al Mizhar', zone: 'Old Dubai', lat: 25.2350, lng: 55.4000, pricePerSqft: 950, yield: 8.5, score: 56 },
  { name: 'Muhaisanah', zone: 'Old Dubai', lat: 25.2500, lng: 55.3550, pricePerSqft: 880, yield: 9.1, score: 54 },
  { name: 'Al Nahda', zone: 'Old Dubai', lat: 25.2650, lng: 55.3450, pricePerSqft: 980, yield: 8.6, score: 57 },
  { name: 'Al Qusais', zone: 'Old Dubai', lat: 25.2580, lng: 55.3780, pricePerSqft: 860, yield: 9.4, score: 54 },
  { name: 'Al Hudaiba', zone: 'Old Dubai', lat: 25.2400, lng: 55.2700, pricePerSqft: 1120, yield: 7.8, score: 58 },
  { name: 'Satwa', zone: 'Old Dubai', lat: 25.2300, lng: 55.2600, pricePerSqft: 1200, yield: 7.5, score: 60 },
  { name: 'Al Mina', zone: 'Old Dubai', lat: 25.2300, lng: 55.2800, pricePerSqft: 1080, yield: 8.0, score: 57 },
  { name: 'Muhaisna', zone: 'Old Dubai', lat: 25.2480, lng: 55.3380, pricePerSqft: 900, yield: 9.2, score: 54 },

  // CREEK / EAST — Dubai Creek Harbour top luxury apt ROI 6.2% (Bayut 2025)
  { name: 'Dubai Creek Harbour', zone: 'Creek', lat: 25.2000, lng: 55.3200, pricePerSqft: 2200, yield: 6.2, score: 76 },
  { name: 'Meydan', zone: 'Creek', lat: 25.1718, lng: 55.3092, pricePerSqft: 1900, yield: 6.2, score: 73 },
  { name: 'MBR City', zone: 'Creek', lat: 25.1900, lng: 55.3100, pricePerSqft: 2050, yield: 5.8, score: 74 },
  { name: 'Ras Al Khor', zone: 'Creek', lat: 25.1800, lng: 55.3500, pricePerSqft: 1350, yield: 7.0, score: 65 },
  { name: 'Sobha Hartland', zone: 'Creek', lat: 25.1950, lng: 55.3050, pricePerSqft: 2100, yield: 5.9, score: 73 },
  { name: 'Al Jaddaf', zone: 'Creek', lat: 25.2130, lng: 55.3280, pricePerSqft: 1600, yield: 6.5, score: 68 },
  { name: 'Culture Village', zone: 'Creek', lat: 25.2200, lng: 55.3350, pricePerSqft: 1550, yield: 6.7, score: 67 },
  { name: 'Azizi Riviera', zone: 'Creek', lat: 25.1800, lng: 55.3050, pricePerSqft: 1600, yield: 6.8, score: 67 },
  { name: 'Hartland Forest', zone: 'Creek', lat: 25.1980, lng: 55.3000, pricePerSqft: 2000, yield: 6.0, score: 70 },

  // SOUTH DUBAI — Dubai South: DLD 2025 villas AED 1,139/sqft, +20%+ apartments
  // 2nd highest transaction area Jan 2026 (2,021 tx, DXBInteract)
  { name: 'Dubai South', zone: 'South', lat: 24.8974, lng: 55.1650, pricePerSqft: 1139, yield: 7.8, score: 67 },
  { name: 'Expo City', zone: 'South', lat: 24.9674, lng: 55.1570, pricePerSqft: 1350, yield: 7.5, score: 68 },
  { name: 'Dubai World Central', zone: 'South', lat: 24.8974, lng: 55.1650, pricePerSqft: 1100, yield: 8.0, score: 65 },
  { name: 'Emaar South', zone: 'South', lat: 24.9450, lng: 55.1780, pricePerSqft: 1280, yield: 7.8, score: 66 },
  { name: 'Jebel Ali', zone: 'South', lat: 25.0069, lng: 55.0556, pricePerSqft: 1100, yield: 8.2, score: 62 },
  { name: 'Jebel Ali Village', zone: 'South', lat: 25.0200, lng: 55.0800, pricePerSqft: 1150, yield: 8.0, score: 63 },

  // MID-CENTRAL — Al Sufouh: Bayut 2025 luxury apt ROI 8.73% — highest luxury yield
  { name: 'Al Barsha', zone: 'Mid-Central', lat: 25.1122, lng: 55.2011, pricePerSqft: 1350, yield: 7.2, score: 65 },
  { name: 'Al Barsha South', zone: 'Mid-Central', lat: 25.0900, lng: 55.2100, pricePerSqft: 1250, yield: 7.5, score: 63 },
  { name: 'Umm Suqeim', zone: 'Mid-Central', lat: 25.1300, lng: 55.1900, pricePerSqft: 2000, yield: 5.6, score: 71 },
  { name: 'Umm Al Sheif', zone: 'Mid-Central', lat: 25.1350, lng: 55.2000, pricePerSqft: 1800, yield: 5.8, score: 69 },
  { name: 'Al Quoz', zone: 'Mid-Central', lat: 25.1503, lng: 55.2341, pricePerSqft: 1150, yield: 8.2, score: 60 },
  { name: 'Al Safa', zone: 'Mid-Central', lat: 25.1700, lng: 55.2100, pricePerSqft: 2200, yield: 5.3, score: 72 },
  { name: 'Al Wasl', zone: 'Mid-Central', lat: 25.1900, lng: 55.2350, pricePerSqft: 2350, yield: 5.1, score: 73 },
  { name: 'Al Manara', zone: 'Mid-Central', lat: 25.1600, lng: 55.2080, pricePerSqft: 2100, yield: 5.4, score: 71 },
  { name: 'Al Sufouh', zone: 'Mid-Central', lat: 25.0950, lng: 55.1700, pricePerSqft: 1900, yield: 8.7, score: 70 },
  { name: 'Rosa Al Safa', zone: 'Mid-Central', lat: 25.1650, lng: 55.2150, pricePerSqft: 2050, yield: 5.4, score: 70 },

  // EMERGING — Dubai Islands: 4th highest tx volume Jan 2026 (1,285 tx, DXBInteract)
  { name: 'Dubai Hills Park', zone: 'Emerging', lat: 25.0980, lng: 55.2350, pricePerSqft: 2200, yield: 5.5, score: 74 },
  { name: 'Tilal Al Ghaf', zone: 'Emerging', lat: 25.0480, lng: 55.2600, pricePerSqft: 1700, yield: 5.8, score: 69 },
  { name: 'Emaar Beachfront', zone: 'Emerging', lat: 25.0750, lng: 55.1350, pricePerSqft: 2800, yield: 5.3, score: 75 },
  { name: 'Siniya Island', zone: 'Emerging', lat: 25.5000, lng: 55.5800, pricePerSqft: 1800, yield: 5.8, score: 66 },
  { name: 'Palm Jebel Ali', zone: 'Emerging', lat: 24.9900, lng: 55.0200, pricePerSqft: 2500, yield: 5.0, score: 70 },
  { name: 'Creek Views', zone: 'Emerging', lat: 25.2100, lng: 55.3300, pricePerSqft: 1750, yield: 6.2, score: 68 },
  { name: 'The Valley', zone: 'Emerging', lat: 24.9630, lng: 55.5120, pricePerSqft: 1150, yield: 7.5, score: 63 },
  { name: 'Dubai Islands', zone: 'Emerging', lat: 25.3600, lng: 55.3500, pricePerSqft: 2200, yield: 5.7, score: 72 },

  // WATERFRONT
  { name: 'Port de La Mer', zone: 'Waterfront', lat: 25.2350, lng: 55.2700, pricePerSqft: 2900, yield: 4.9, score: 74 },
  { name: 'Marasi Marina', zone: 'Waterfront', lat: 25.1860, lng: 55.2680, pricePerSqft: 2500, yield: 5.4, score: 73 },
  { name: 'Dubai Water Canal', zone: 'Waterfront', lat: 25.1900, lng: 55.2600, pricePerSqft: 2400, yield: 5.6, score: 72 },
  { name: 'Deira Waterfront', zone: 'Waterfront', lat: 25.2750, lng: 55.3000, pricePerSqft: 1500, yield: 6.8, score: 64 },
  { name: 'Al Seef', zone: 'Waterfront', lat: 25.2400, lng: 55.3150, pricePerSqft: 1850, yield: 6.3, score: 68 },
  { name: 'Sobha SeaHaven', zone: 'Waterfront', lat: 25.0780, lng: 55.1340, pricePerSqft: 2600, yield: 5.2, score: 73 },
  { name: 'Address Beach Resort', zone: 'Waterfront', lat: 25.0760, lng: 55.1330, pricePerSqft: 3000, yield: 4.7, score: 72 },
  { name: 'Canal Front Residences', zone: 'Waterfront', lat: 25.1880, lng: 55.2580, pricePerSqft: 2500, yield: 5.6, score: 73 },
]

const ZONE_COLORS = {
  'Prime': '#B87333',
  'Marina': '#2980B9',
  'Business': '#8E44AD',
  'Mid-Market': '#27AE60',
  'Villas': '#F39C12',
  'Old Dubai': '#7F8C8D',
  'Creek': '#16A085',
  'South': '#E67E22',
  'Mid-Central': '#2ECC71',
  'Emerging': '#E74C3C',
  'Waterfront': '#1ABC9C',
}

function getScoreColor(score) {
  if (score >= 75) return '#27AE60'
  if (score >= 65) return '#F39C12'
  return '#E74C3C'
}

function getScoreLabel(score) {
  if (score >= 75) return 'BUY'
  if (score >= 65) return 'HOLD'
  return 'WATCH'
}

export default function AreaListDrawer({ onClose, onSelectArea }) {
  const [search, setSearch] = useState('')
  const [selectedZone, setSelectedZone] = useState('All')
  const [sortBy, setSortBy] = useState('score')
  const [liveData, setLiveData] = useState({})

  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

    fetch(`${API_BASE}/api/events/area-momentum`)
      .then(r => r.json())
      .then(data => {
        const map = {}
        ;(data.momentum_areas || []).forEach(a => {
          map[a.area] = { signalCount: a.count, maxSeverity: a.max_severity }
        })
        setLiveData(prev => ({ ...prev, ...map }))
      })
      .catch(() => {})

    fetch(`${API_BASE}/api/events/area-prices`)
      .then(r => r.json())
      .then(data => {
        const areas = data.areas || {}
        const map = {}
        Object.entries(areas).forEach(([name, info]) => {
          map[name] = { pricePerSqft: info.price_sqft_aed, yield: info.rental_yield_pct }
        })
        setLiveData(prev => ({ ...prev, ...map }))
      })
      .catch(() => {})
  }, [])

  const zones = ['All', ...Object.keys(ZONE_COLORS)]

  const filtered = useMemo(() => {
    let list = DUBAI_AREAS_LIST.map(area => {
      const live = liveData[area.name] || {}
      return {
        ...area,
        pricePerSqft: live.pricePerSqft || area.pricePerSqft,
        yield: live.yield || area.yield,
        signalCount: live.signalCount || 0,
        maxSeverity: live.maxSeverity || 0,
      }
    })
    if (selectedZone !== 'All') list = list.filter(a => a.zone === selectedZone)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(a => a.name.toLowerCase().includes(q) || a.zone.toLowerCase().includes(q))
    }
    return [...list].sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score
      if (sortBy === 'yield') return b.yield - a.yield
      if (sortBy === 'price') return b.pricePerSqft - a.pricePerSqft
      return a.name.localeCompare(b.name)
    })
  }, [search, selectedZone, sortBy, liveData])

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px 8px', borderBottom: '1px solid var(--border-color)', flexShrink: 0 }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#B87333', letterSpacing: '1px' }}>◆ AREAS</span>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: '8px' }}>{filtered.length} of {DUBAI_AREAS_LIST.length}</span>
        </div>
        <button onClick={onClose} style={{ width: 36, height: 36, background: 'var(--bg-input)', border: '1px solid var(--border-panel)', borderRadius: '6px', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}>✕</button>
      </div>

      {/* Search */}
      <div style={{ padding: '8px 12px', flexShrink: 0 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search areas..." style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-panel)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13px', outline: 'none' }} />
      </div>

      {/* Zone pills */}
      <div style={{ display: 'flex', gap: '6px', padding: '0 12px 8px', overflowX: 'auto', flexShrink: 0, scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
        {zones.map(zone => (
          <button key={zone} onClick={() => setSelectedZone(zone)} style={{ padding: '4px 10px', borderRadius: '12px', whiteSpace: 'nowrap', fontSize: '10px', fontWeight: 700, cursor: 'pointer', border: `1px solid ${selectedZone === zone ? (ZONE_COLORS[zone] || '#B87333') : 'var(--border-panel)'}`, background: selectedZone === zone ? `${(ZONE_COLORS[zone] || '#B87333')}22` : 'var(--bg-input)', color: selectedZone === zone ? (ZONE_COLORS[zone] || '#B87333') : 'var(--text-muted)', touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}>{zone}</button>
        ))}
      </div>

      {/* Sort bar */}
      <div style={{ display: 'flex', gap: '6px', padding: '0 12px 8px', borderBottom: '1px solid var(--border-color)', flexShrink: 0, alignItems: 'center' }}>
        <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginRight: '2px' }}>Sort:</span>
        {[{ key: 'score', label: 'Score' }, { key: 'yield', label: 'Yield' }, { key: 'price', label: 'Price' }, { key: 'name', label: 'A–Z' }].map(s => (
          <button key={s.key} onClick={() => setSortBy(s.key)} style={{ padding: '3px 9px', borderRadius: '6px', fontSize: '10px', fontWeight: 700, cursor: 'pointer', border: '1px solid var(--border-panel)', background: sortBy === s.key ? 'rgba(184,115,51,0.15)' : 'var(--bg-input)', color: sortBy === s.key ? '#B87333' : 'var(--text-muted)', touchAction: 'manipulation' }}>{s.label}</button>
        ))}
      </div>

      {/* Area list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 8px' }}>
        {filtered.map(area => {
          const scoreColor = getScoreColor(area.score)
          const scoreLabel = getScoreLabel(area.score)
          return (
            <div key={area.name} onClick={() => onSelectArea(area)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', marginBottom: '4px', background: 'var(--bg-primary)', border: '1px solid var(--border-panel)', borderRadius: '8px', cursor: 'pointer', touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', transition: 'border-color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#B87333'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-panel)'}
            >
              <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: ZONE_COLORS[area.zone] || '#B87333' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{area.name}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{area.zone}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px', flexShrink: 0 }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>AED <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{area.pricePerSqft.toLocaleString()}</span>/sqft</div>
                <div style={{ fontSize: '10px', color: '#27AE60', fontWeight: 600 }}>{area.yield}% yield</div>
                {area.signalCount > 0 && <div style={{ fontSize: '9px', color: '#E74C3C', fontWeight: 700 }}>📡 {area.signalCount} signals</div>}
              </div>
              <div style={{ minWidth: 44, textAlign: 'center', padding: '4px 6px', background: `${scoreColor}22`, border: `1px solid ${scoreColor}44`, borderRadius: '6px', flexShrink: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 900, color: scoreColor }}>{area.score}</div>
                <div style={{ fontSize: '8px', fontWeight: 800, color: scoreColor, letterSpacing: '0.5px' }}>{scoreLabel}</div>
              </div>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)', flexShrink: 0 }}>›</span>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)', fontSize: '12px' }}>
            <div style={{ fontSize: '28px', marginBottom: '10px' }}>🔍</div>
            No areas found for "{search}"
          </div>
        )}
        <div style={{ textAlign: 'center', padding: '12px 8px', fontSize: '9px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', marginTop: '8px' }}>
          📊 DLD transactions Jan 2026 · Bayut Annual Report 2025 · Property Monitor Feb 2026
        </div>
      </div>
    </div>
  )
}

