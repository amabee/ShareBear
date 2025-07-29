/**
 * Extract hashtags from text content
 * @param {string} text - The text content to extract hashtags from
 * @returns {string[]} Array of hashtag names without the # symbol
 */
export const extractHashtags = (text) => {
  if (!text || typeof text !== 'string') {
    return [];
  }
  
  // Match hashtags that start with # followed by letters, numbers, and underscores
  // This regex matches #hashtag, #hashtag123, #hashtag_123, etc.
  const hashtagRegex = /#([a-zA-Z0-9_]+)/g;
  const matches = text.match(hashtagRegex);
  
  if (!matches) {
    return [];
  }
  
  // Remove the # symbol and return unique hashtags
  const hashtags = matches.map(match => match.slice(1).toLowerCase());
  return [...new Set(hashtags)]; // Remove duplicates
};

/**
 * Process hashtags for a post - create or update hashtags and link them to the post
 * @param {Object} prisma - Prisma client instance
 * @param {number} postId - The post ID
 * @param {string[]} hashtagNames - Array of hashtag names
 */
export const processHashtags = async (prisma, postId, hashtagNames) => {
  if (!hashtagNames || hashtagNames.length === 0) {
    return;
  }

  for (const hashtagName of hashtagNames) {
    // Skip empty hashtags
    if (!hashtagName || hashtagName.trim() === '') {
      continue;
    }

    try {
      // Use upsert to create hashtag if it doesn't exist, or get existing one
      const hashtag = await prisma.hashtag.upsert({
        where: { name: hashtagName },
        update: {
          usageCount: {
            increment: 1
          }
        },
        create: {
          name: hashtagName,
          usageCount: 1
        }
      });

      // Create the post-hashtag relationship
      await prisma.postHashtag.create({
        data: {
          postId: postId,
          hashtagId: hashtag.id
        }
      });
    } catch (error) {
      // If the relationship already exists, skip it
      if (error.code === 'P2002') {
        // Unique constraint violation - relationship already exists
        continue;
      }
      throw error;
    }
  }
};

/**
 * Remove hashtag relationships for a post
 * @param {Object} prisma - Prisma client instance
 * @param {number} postId - The post ID
 */
export const removePostHashtags = async (prisma, postId) => {
  // Get all hashtag IDs for this post
  const postHashtags = await prisma.postHashtag.findMany({
    where: { postId: postId },
    include: { hashtag: true }
  });

  // Delete all post-hashtag relationships
  await prisma.postHashtag.deleteMany({
    where: { postId: postId }
  });

  // Decrement usage count for hashtags that are no longer used
  for (const postHashtag of postHashtags) {
    await prisma.hashtag.update({
      where: { id: postHashtag.hashtagId },
      data: {
        usageCount: {
          decrement: 1
        }
      }
    });
  }
}; 
