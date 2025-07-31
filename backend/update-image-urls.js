import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateImageUrls() {
  try {
    console.log('Starting image URL update...');
    
    // Find all post images with /media/ URLs (to change back to /uploads/)
    const images = await prisma.postImage.findMany({
      where: {
        imageUrl: {
          startsWith: '/media/'
        }
      }
    });
    
    console.log(`Found ${images.length} images to update`);
    
    // Update each image URL
    for (const image of images) {
      const newUrl = image.imageUrl.replace('/media/', '/uploads/');
      
      await prisma.postImage.update({
        where: { id: image.id },
        data: { imageUrl: newUrl }
      });
      
      console.log(`Updated: ${image.imageUrl} -> ${newUrl}`);
    }
    
    console.log('Image URL update completed successfully!');
  } catch (error) {
    console.error('Error updating image URLs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateImageUrls(); 
