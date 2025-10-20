const exiftool = require('exiftool-vendored').exiftool;
const fs = require('fs-extra');
const path = require('path');
const glob = require('fast-glob');

// Configuration
const CONFIG = {
  sourceDir: 'trip-report-raw/raw-img', // Where your hiking photos are
  outputDir: 'trip-report-raw/trip-report-new', // Where organized hikes will go
  imageSubdir: 'img', // Subdirectory name for images in each hike folder
  useReverseGeocode: false, // Set to true if you want to use Nominatim API for location names
  sameDayThresholdHours: 6 // Photos within this many hours are considered same hike
};

/**
 * Get location name from coordinates using Nominatim (OpenStreetMap)
 * Free service, but please be respectful with rate limiting
 */
async function reverseGeocode(lat, lon) {
  if (!CONFIG.useReverseGeocode) return null;
  
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        headers: {
          'User-Agent': '11ty-hiking-organizer/1.0'
        }
      }
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    
    // Build a readable location name
    const parts = [];
    if (data.address) {
      if (data.address.peak || data.address.mountain) {
        parts.push(data.address.peak || data.address.mountain);
      }
      if (data.address.village || data.address.town || data.address.city) {
        parts.push(data.address.village || data.address.town || data.address.city);
      }
      if (data.address.state) {
        parts.push(data.address.state);
      }
    }
    
    return parts.length > 0 ? parts.join(', ') : data.display_name;
  } catch (error) {
    console.warn('Geocoding failed:', error.message);
    return null;
  }
}

/**
 * Extract metadata from a photo
 */
async function extractPhotoMetadata(filePath) {
  try {
    const metadata = await exiftool.read(filePath);
    
    const dateTime = metadata.DateTimeOriginal || metadata.CreateDate || metadata.ModifyDate;
    
    let latitude = null;
    let longitude = null;
    
    if (metadata.GPSLatitude && metadata.GPSLongitude) {
      latitude = metadata.GPSLatitude;
      longitude = metadata.GPSLongitude;
    }
    
    return {
      filePath,
      fileName: path.basename(filePath),
      dateTime: dateTime ? new Date(dateTime.toString()) : null,
      latitude,
      longitude,
      make: metadata.Make,
      model: metadata.Model
    };
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Group photos by hike (same day or within threshold)
 */
function groupPhotosByHike(photos) {
  // Sort by date
  photos.sort((a, b) => a.dateTime - b.dateTime);
  
  const hikes = [];
  let currentHike = null;
  
  for (const photo of photos) {
    if (!photo.dateTime) {
      console.warn(`Skipping ${photo.fileName} - no date information`);
      continue;
    }
    
    if (!currentHike) {
      currentHike = [photo];
      continue;
    }
    
    const lastPhoto = currentHike[currentHike.length - 1];
    const hoursDiff = Math.abs(photo.dateTime - lastPhoto.dateTime) / (1000 * 60 * 60);
    
    if (hoursDiff <= CONFIG.sameDayThresholdHours) {
      currentHike.push(photo);
    } else {
      hikes.push(currentHike);
      currentHike = [photo];
    }
  }
  
  if (currentHike && currentHike.length > 0) {
    hikes.push(currentHike);
  }
  
  return hikes;
}

/**
 * Calculate average GPS coordinates for a hike
 */
function getAverageLocation(photos) {
  const photosWithGPS = photos.filter(p => p.latitude && p.longitude);
  
  if (photosWithGPS.length === 0) return null;
  
  const avgLat = photosWithGPS.reduce((sum, p) => sum + p.latitude, 0) / photosWithGPS.length;
  const avgLon = photosWithGPS.reduce((sum, p) => sum + p.longitude, 0) / photosWithGPS.length;
  
  return { latitude: avgLat, longitude: avgLon };
}

/**
 * Create 11ty markdown file with frontmatter
 */
async function create11tyFile(hikeDir, hikeData) {
  const date = hikeData.date.toISOString().split('T')[0];
  
  // Parse location for town and state
  let town = 'Unknown';
  let state = 'Vermont';
  if (hikeData.locationName) {
    const parts = hikeData.locationName.split(',').map(p => p.trim());
    if (parts.length >= 2) {
      town = parts[0];
      state = parts[1];
    } else if (parts.length === 1) {
      town = parts[0];
    }
  }
  
  // Generate image shortcodes
  const imageShortcodes = hikeData.photos.map(p => {
    const imgPath = `${CONFIG.imageSubdir}/${p.fileName}`;
    return `{% image "${imgPath}", "Hiking photo from ${date}", "Photo from the hike" %}`;
  }).join('\n\n');
  
  const frontmatter = `---
layout: blog.liquid
title: Hike on ${date}
description: Add your hike description here
tags: 
  - post
  - tripreport
date: ${date}
trips:
  dateHiked: ${date}
  peak: 
    - name: Add peak name here
      elevation: 0 feet
  totalTime: 0:00 hours
  distance: 0.0 miles
  temp: 0F° on top
location: 
  town: ${town}
  state: ${state}
---

${imageShortcodes}
`;

  const mdPath = path.join(hikeDir, 'index.md');
  await fs.writeFile(mdPath, frontmatter, 'utf-8');
  console.log(`✓ Created ${mdPath}`);
}

/**
 * Main processing function
 */
async function processHikingPhotos() {
  console.log('🥾 Starting hiking photo organizer...\n');
  
  // Find all photos
  const photoFiles = await glob('**/*.{jpg,jpeg,png,heic,JPG,JPEG,PNG,HEIC}', {
    cwd: CONFIG.sourceDir,
    absolute: true
  });
  
  console.log(`Found ${photoFiles.length} photos in ${CONFIG.sourceDir}\n`);
  
  if (photoFiles.length === 0) {
    console.log('No photos found. Make sure photos are in:', CONFIG.sourceDir);
    return;
  }
  
  // Extract metadata from all photos
  console.log('📸 Reading photo metadata...');
  const photosMetadata = [];
  
  for (const file of photoFiles) {
    const metadata = await extractPhotoMetadata(file);
    if (metadata && metadata.dateTime) {
      photosMetadata.push(metadata);
    }
  }
  
  console.log(`Successfully read ${photosMetadata.length} photos with dates\n`);
  
  // Group into hikes
  const hikes = groupPhotosByHike(photosMetadata);
  console.log(`📁 Identified ${hikes.length} separate hikes\n`);
  
  // Create folders and organize
  await fs.ensureDir(CONFIG.outputDir);
  
  for (let i = 0; i < hikes.length; i++) {
    const hikePhotos = hikes[i];
    const firstPhoto = hikePhotos[0];
    const hikeDate = firstPhoto.dateTime;
    const dateStr = hikeDate.toISOString().split('T')[0];
    
    console.log(`\n📅 Processing hike ${i + 1}/${hikes.length}: ${dateStr} (${hikePhotos.length} photos)`);
    
    // Create hike directory
    const hikeDir = path.join(CONFIG.outputDir, dateStr);
    await fs.ensureDir(hikeDir);
    
    // Create images subdirectory
    const imagesDir = path.join(hikeDir, CONFIG.imageSubdir);
    await fs.ensureDir(imagesDir);
    
    // Copy photos
    for (const photo of hikePhotos) {
      const destPath = path.join(imagesDir, photo.fileName);
      await fs.copy(photo.filePath, destPath);
    }
    console.log(`  ✓ Copied ${hikePhotos.length} photos`);
    
    // Get location info
    const avgLocation = getAverageLocation(hikePhotos);
    let locationName = null;
    
    if (avgLocation && CONFIG.useReverseGeocode) {
      console.log('  🌍 Looking up location...');
      locationName = await reverseGeocode(avgLocation.latitude, avgLocation.longitude);
      // Be nice to Nominatim - rate limit
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Create 11ty file
    await create11tyFile(hikeDir, {
      date: hikeDate,
      photos: hikePhotos,
      coordinates: avgLocation,
      locationName
    });
  }
  
  console.log('\n✨ All done! Your hikes are organized in:', CONFIG.outputDir);
  console.log('\nNext steps:');
  console.log('1. Review the generated markdown files');
  console.log('2. Add descriptions and content to each hike');
  console.log('3. Integrate the hikes folder into your 11ty site');
  
  // Cleanup
  await exiftool.end();
}

// Run the script
processHikingPhotos().catch(error => {
  console.error('Error:', error);
  exiftool.end();
  process.exit(1);
});