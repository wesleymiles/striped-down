const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const axios = require('axios');
const { BskyAgent } = require('@atproto/api');
const { execSync } = require('child_process');

async function getNewArtPosts() {
  try {
    // Get files changed in the last commit
    const changedFiles = execSync('git diff --name-only HEAD HEAD~1')
      .toString()
      .split('\n')
      .filter(file => file.includes('blog/art/') && file.endsWith('.md'))
      .filter(file => file.trim() !== '');
    
    return changedFiles;
  } catch (error) {
    // If no previous commit or no changes, return empty array
    console.log('No previous commit found or no changes detected');
    return [];
  }
}

async function publishToBluesky(post, imagePath) {
  try {
    const agent = new BskyAgent({ service: 'https://bsky.social' });
    
    await agent.login({
      identifier: process.env.BLUESKY_USERNAME,
      password: process.env.BLUESKY_PASSWORD
    });
    
    // Read and upload image
    const imageBuffer = fs.readFileSync(imagePath);
    
    // Determine MIME type from file extension
    const ext = path.extname(imagePath).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp'
    };
    const mimeType = mimeTypes[ext] || 'image/jpeg';
    
    const { data } = await agent.uploadBlob(imageBuffer, {
      encoding: mimeType
    });
    
    // Create post
    const postText = post.socialCaption || `${post.title}\n\nNew artwork posted!`;
    
    await agent.post({
      text: postText,
      embed: {
        $type: 'app.bsky.embed.images',
        images: [{
          alt: post.imageAlt || post.title,
          image: data.blob
        }]
      }
    });
    
    console.log('✓ Posted to Bluesky:', post.title);
    return true;
  } catch (error) {
    console.error('✗ Bluesky error:', error.message);
    if (error.response) {
      console.error('  Response:', error.response.data);
    }
    return false;
  }
}

async function createButtondownDraft(post, imageUrl, filePath) {
  try {
    // Convert newsletter content to HTML
    const contentParagraphs = post.newsletterContent
      .split('\n')
      .filter(p => p.trim())
      .map(p => `<p>${p}</p>`)
      .join('\n');
    
    // Get the post URL - your site uses /blog/art/post-name/ structure
    // Extract directory name from file path (e.g., "blog/art/post-name/index.md" -> "post-name")
    const postDir = path.dirname(filePath);
    const postSlug = path.basename(postDir);
    const postUrl = `${process.env.SITE_URL}/blog/art/${postSlug}/`;
    
    const emailBody = `
      <h2>${post.title}</h2>
      <img src="${imageUrl}" alt="${post.imageAlt || post.title}" style="max-width: 600px; height: auto; display: block; margin: 20px 0;">
      ${contentParagraphs}
      <p style="margin-top: 30px;"><a href="${postUrl}">View on my website →</a></p>
    `;
    
    const response = await axios.post(
      'https://api.buttondown.email/v1/emails',
      {
        subject: `New artwork: ${post.title}`,
        body: emailBody,
        status: 'draft'  // Creates as draft
      },
      {
        headers: {
          'Authorization': `Token ${process.env.BUTTONDOWN_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✓ Created Buttondown draft:', post.title);
    console.log('  Review at: https://buttondown.email/emails');
    return true;
  } catch (error) {
    console.error('✗ Buttondown error:', error.response?.data || error.message);
    return false;
  }
}

async function main() {
  console.log('🎨 Checking for new art posts...\n');
  
  const newFiles = await getNewArtPosts();
  
  if (newFiles.length === 0) {
    console.log('No new art posts found.');
    return;
  }
  
  console.log(`Found ${newFiles.length} new art post(s)\n`);
  
  for (const file of newFiles) {
    console.log(`Processing: ${file}`);
    
    const filePath = path.join(process.cwd(), file);
    const content = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(content);
    
    // Store file path for URL generation
    data.filePath = file;
    
    // Check if post is marked for publishing
    if (!data.blueskyPost && !data.includeInNewsletter) {
      console.log('  Skipped (not marked for publishing)\n');
      continue;
    }
    
    // Construct image path - images are in blog/art/post-name/img/
    const postDir = path.dirname(filePath);
    const imagePath = path.join(postDir, data.image);
    
    // If image path doesn't start with /, it's relative to the post directory
    if (!data.image.startsWith('/') && !data.image.startsWith('http')) {
      // Image is relative to post directory
      const resolvedImagePath = path.join(postDir, data.image);
      if (!fs.existsSync(resolvedImagePath)) {
        console.error(`  ✗ Image not found: ${resolvedImagePath}\n`);
        continue;
      }
      
      // For newsletter, we need the public URL
      const postSlug = path.basename(postDir);
      const imageUrl = `${process.env.SITE_URL}/blog/art/${postSlug}/${data.image}`;
      
      // Post to Bluesky
      if (data.blueskyPost) {
        await publishToBluesky(data, resolvedImagePath);
      }
      
      // Create newsletter draft
      if (data.includeInNewsletter) {
        await createButtondownDraft(data, imageUrl, filePath);
      }
    } else {
      // Absolute path or URL
      if (data.image.startsWith('/')) {
        // Site-relative path
        const imageUrl = `${process.env.SITE_URL}${data.image}`;
        const resolvedImagePath = path.join(process.cwd(), data.image.replace(/^\//, ''));
        
        if (!fs.existsSync(resolvedImagePath)) {
          console.error(`  ✗ Image not found: ${resolvedImagePath}\n`);
          continue;
        }
        
        if (data.blueskyPost) {
          await publishToBluesky(data, resolvedImagePath);
        }
        
        if (data.includeInNewsletter) {
          await createButtondownDraft(data, imageUrl, filePath);
        }
      } else {
        // External URL
        if (data.includeInNewsletter) {
          await createButtondownDraft(data, data.image, filePath);
        }
        console.log('  Note: External URLs cannot be posted to Bluesky\n');
      }
    }
    
    console.log('');
  }
  
  console.log('✅ Publishing complete!');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

