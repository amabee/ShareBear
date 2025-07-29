# Post Image Migration Summary

## Overview
This document summarizes the changes made to migrate from the old `contentUrl` field in the `Post` table to the new `PostImage` table structure that supports multiple images per post.

## Database Changes

### Schema Changes
- **Removed**: `contentUrl` field from the `Post` table
- **Added**: New `PostImage` table with the following structure:
  - `id` (Primary Key)
  - `postId` (Foreign Key to Post)
  - `imageUrl` (VARCHAR(500))
  - `altText` (VARCHAR(200), nullable)
  - `displayOrder` (INT, default 0)
  - `width` (INT, nullable)
  - `height` (INT, nullable)
  - `fileSize` (INT, nullable)
  - `createdAt` (DATETIME)

### Migration
- Migration file: `20250729060006_added_table_for_images_posts/migration.sql`
- Drops the `contentUrl` column from the `post` table
- Creates the new `PostImage` table with proper indexes and foreign key constraints

## Backend Code Changes

### 1. Services (`src/services/posts.service.js`)
- **createPost**: Updated to handle multiple image uploads and store them in the `PostImage` table
- **updatePost**: Updated to handle image updates (delete existing images and create new ones)
- Removed import of `createPostRepo` from repository (no longer needed)

### 2. Repository (`src/repositories/posts.repository.js`)
- **getPosts**: Added `images` relation to include image data in post queries
- **getPost**: Added `images` relation to include image data in single post queries
- **getPostsByHashtag**: Added `images` relation to include image data in hashtag queries
- Removed the old `createPost` function (now handled directly in service)

### 3. Controller (`src/controllers/posts.controller.js`)
- **createPost**: Updated to handle multiple file uploads and process image metadata
- **updatePost**: Updated to handle image updates when files are provided
- Enhanced file processing to extract metadata (width, height, fileSize, altText)

### 4. Schema (`src/schema/postSchema.js`)
- Replaced all `contentUrl` references with `images` array structure
- Updated all response schemas to include the new image structure
- Added proper validation for image objects with all required fields

## Key Features

### Multiple Image Support
- Posts can now have multiple images
- Images are ordered by `displayOrder` field
- Each image can have metadata (width, height, fileSize, altText)

### Backward Compatibility
- All existing API endpoints remain the same
- Response structure includes images array instead of single contentUrl
- Frontend can easily adapt to the new structure

### Enhanced Metadata
- Image dimensions (width, height)
- File size information
- Alt text for accessibility
- Display order for proper image sequencing

## API Response Structure

### Before (Old Structure)
```json
{
  "post": {
    "id": 1,
    "contentUrl": "https://example.com/image.jpg",
    "caption": "Post caption",
    // ... other fields
  }
}
```

### After (New Structure)
```json
{
  "post": {
    "id": 1,
    "images": [
      {
        "id": 1,
        "imageUrl": "https://example.com/image1.jpg",
        "altText": "Image description",
        "displayOrder": 0,
        "width": 1920,
        "height": 1080,
        "fileSize": 1024000,
        "createdAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "caption": "Post caption",
    // ... other fields
  }
}
```

## Testing

### Test Script
Created `test-post-images.js` to verify the new structure works correctly:
- Creates posts with multiple images
- Fetches posts with image data
- Updates post images
- Cleans up test data

### Running Tests
```bash
cd backend
node test-post-images.js
```

## Frontend Considerations

### Required Changes
1. Update post creation forms to handle multiple image uploads
2. Modify post display components to render multiple images
3. Update image galleries to use the new array structure
4. Handle image ordering based on `displayOrder`

### Migration Strategy
1. Frontend should check for both `contentUrl` (old) and `images` (new) in responses
2. Gradually migrate UI components to use the new structure
3. Update image upload components to support multiple files

## Benefits

1. **Scalability**: Support for multiple images per post
2. **Performance**: Better indexing and query optimization
3. **Flexibility**: Rich metadata for each image
4. **Accessibility**: Alt text support for images
5. **Future-proof**: Easy to extend with additional image properties

## Next Steps

1. Run the database migration
2. Test the backend changes with the provided test script
3. Update frontend components to use the new image structure
4. Remove any remaining references to `contentUrl` in frontend code
5. Update documentation and API specifications 
