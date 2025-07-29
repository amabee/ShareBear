import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testPostImages() {
  try {
    console.log('Testing PostImage table structure...');

    // Test 1: Create a post with images
    console.log('\n1. Creating a post with images...');
    const post = await prisma.post.create({
      data: {
        userId: 1, // Assuming user with ID 1 exists
        contentType: 'IMAGE',
        caption: 'Test post with multiple images',
        location: 'Test Location',
        privacyLevel: 'PUBLIC',
        allowsComments: true,
        allowsShares: true,
        images: {
          create: [
            {
              imageUrl: 'https://example.com/image1.jpg',
              altText: 'First test image',
              displayOrder: 0,
              width: 1920,
              height: 1080,
              fileSize: 1024000,
            },
            {
              imageUrl: 'https://example.com/image2.jpg',
              altText: 'Second test image',
              displayOrder: 1,
              width: 1280,
              height: 720,
              fileSize: 512000,
            },
          ],
        },
      },
      include: {
        images: {
          orderBy: {
            displayOrder: 'asc',
          },
        },
      },
    });

    console.log('Post created successfully:', {
      id: post.id,
      caption: post.caption,
      imageCount: post.images.length,
      images: post.images.map(img => ({
        id: img.id,
        imageUrl: img.imageUrl,
        displayOrder: img.displayOrder,
      })),
    });

    // Test 2: Fetch posts with images
    console.log('\n2. Fetching posts with images...');
    const posts = await prisma.post.findMany({
      where: {
        id: post.id,
      },
      include: {
        images: {
          orderBy: {
            displayOrder: 'asc',
          },
        },
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    console.log('Posts fetched successfully:', posts.length);
    posts.forEach(p => {
      console.log(`Post ${p.id}: ${p.images.length} images`);
    });

    // Test 3: Update post images
    console.log('\n3. Updating post images...');
    const updatedPost = await prisma.post.update({
      where: {
        id: post.id,
      },
      data: {
        images: {
          deleteMany: {},
          create: [
            {
              imageUrl: 'https://example.com/updated-image1.jpg',
              altText: 'Updated first image',
              displayOrder: 0,
              width: 1920,
              height: 1080,
              fileSize: 1024000,
            },
          ],
        },
      },
      include: {
        images: {
          orderBy: {
            displayOrder: 'asc',
          },
        },
      },
    });

    console.log('Post updated successfully:', {
      id: updatedPost.id,
      imageCount: updatedPost.images.length,
      images: updatedPost.images.map(img => ({
        id: img.id,
        imageUrl: img.imageUrl,
        displayOrder: img.displayOrder,
      })),
    });

    // Test 4: Delete the test post (cleanup)
    console.log('\n4. Cleaning up test data...');
    await prisma.post.delete({
      where: {
        id: post.id,
      },
    });

    console.log('Test post deleted successfully');

    console.log('\n✅ All tests passed! PostImage table structure is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testPostImages(); 
