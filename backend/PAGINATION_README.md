# Pagination Implementation for ShareBear Posts API

## Overview

This document describes the pagination implementation for the ShareBear posts API. The implementation supports both **offset-based** and **cursor-based** pagination for optimal performance and user experience.

## API Endpoints with Pagination

### 1. Get Posts Feed
```
GET /api/posts
```

**Query Parameters:**
- `page` (optional): Page number (default: 1, min: 1)
- `limit` (optional): Number of posts per page (default: 10, min: 1, max: 50)
- `cursor` (optional): Post ID for cursor-based pagination

**Example Requests:**
```bash
# Get first page with default settings
GET /api/posts

# Get second page with 20 posts
GET /api/posts?page=2&limit=20

# Cursor-based pagination
GET /api/posts?cursor=post_id_123&limit=10
```

**Response:**
```json
{
  "posts": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalPosts": 150,
    "totalPages": 15,
    "hasNextPage": true,
    "hasPreviousPage": false,
    "nextCursor": "post_id_123",
    "previousCursor": null
  }
}
```

### 2. Get Posts by Hashtag
```
GET /api/posts/hashtag/{hashtag}
```

**Query Parameters:**
- `page` (optional): Page number (default: 1, min: 1)
- `limit` (optional): Number of posts per page (default: 10, min: 1, max: 50)
- `cursor` (optional): Post ID for cursor-based pagination

**Example Requests:**
```bash
# Get first page of posts with #tech hashtag
GET /api/posts/hashtag/tech?page=1&limit=10

# Cursor-based pagination for hashtag posts
GET /api/posts/hashtag/tech?cursor=post_id_456&limit=15
```

## Pagination Types

### 1. Offset-based Pagination
- Uses `page` and `limit` parameters
- Good for small to medium datasets
- Allows jumping to specific pages
- Shows total count and page numbers

**Use Cases:**
- Traditional pagination with page numbers
- When you need to show "Page X of Y"
- When users need to jump to specific pages

### 2. Cursor-based Pagination
- Uses `cursor` parameter (post ID)
- More efficient for large datasets
- Better performance with real-time data
- No skipping or jumping to specific pages

**Use Cases:**
- Infinite scroll implementations
- Real-time feeds
- Large datasets where performance matters
- When posts can be added/removed frequently

## Implementation Details

### Database Queries
The implementation uses Prisma's `take`, `skip`, and `where` clauses:

```javascript
// Offset-based pagination
const posts = await prisma.post.findMany({
  where: { /* conditions */ },
  orderBy: { createdAt: "desc" },
  take: limit,
  skip: (page - 1) * limit,
  include: { /* relations */ }
});

// Cursor-based pagination
const posts = await prisma.post.findMany({
  where: {
    /* conditions */,
    createdAt: { lt: cursorCreatedAt }
  },
  orderBy: { createdAt: "desc" },
  take: limit,
  include: { /* relations */ }
});
```

### Performance Considerations
1. **Indexes**: Ensure you have indexes on `createdAt` and `userId` columns
2. **Cursor-based is more efficient** for large datasets
3. **Count queries** are separate to avoid performance impact
4. **Limit enforcement** prevents excessive data retrieval

## Frontend Integration

### React Hook Example
```javascript
import { useState, useEffect } from 'react';

function usePostsPagination() {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async (page = 1, limit = 10, cursor = null) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (cursor) {
        params.append('cursor', cursor);
      } else {
        params.append('page', page);
      }
      params.append('limit', limit);

      const response = await fetch(`/api/posts?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      setPosts(data.posts);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (pagination?.nextCursor) {
      fetchPosts(null, pagination.limit, pagination.nextCursor);
    }
  };

  return { posts, pagination, loading, fetchPosts, loadMore };
}
```

### Infinite Scroll Example
```javascript
function PostsFeed() {
  const { posts, pagination, loading, fetchPosts, loadMore } = usePostsPagination();

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pagination]);

  return (
    <div>
      {posts.map(post => <PostCard key={post.id} post={post} />)}
      {loading && <LoadingSpinner />}
    </div>
  );
}
```

## Best Practices

### 1. Choose the Right Pagination Type
- **Use offset-based** when you need page numbers and jumping
- **Use cursor-based** for infinite scroll and real-time feeds

### 2. Set Appropriate Limits
- Default: 10-20 posts per page
- Maximum: 50 posts per page
- Consider mobile performance

### 3. Handle Loading States
- Show loading indicators
- Prevent multiple simultaneous requests
- Handle errors gracefully

### 4. Cache Strategy
- Cache pagination metadata
- Implement proper cache invalidation
- Consider using Redis for caching

### 5. Security
- Validate pagination parameters
- Enforce maximum limits
- Sanitize cursor values

## Error Handling

The API returns appropriate error responses:

```json
{
  "error": "Invalid pagination parameters"
}
```

Common error scenarios:
- Invalid page numbers (negative or zero)
- Invalid limits (exceeds maximum)
- Invalid cursor values
- Database connection issues

## Testing

Test the pagination with various scenarios:

1. **Basic pagination**: `GET /api/posts?page=1&limit=10`
2. **Edge cases**: `GET /api/posts?page=999&limit=1`
3. **Cursor pagination**: `GET /api/posts?cursor=valid_post_id&limit=10`
4. **Invalid parameters**: `GET /api/posts?page=-1&limit=100`
5. **Hashtag pagination**: `GET /api/posts/hashtag/tech?page=1&limit=10`

## Migration Notes

If you're migrating from a non-paginated API:

1. **Frontend**: Update API calls to include pagination parameters
2. **Backend**: Ensure all post retrieval endpoints support pagination
3. **Database**: Add necessary indexes for performance
4. **Testing**: Update tests to include pagination scenarios

## Future Enhancements

Potential improvements:
1. **Time-based cursors**: Use timestamps instead of post IDs
2. **Compound cursors**: Support multiple sorting criteria
3. **Bidirectional cursors**: Support both forward and backward pagination
4. **Streaming**: Real-time updates with WebSockets
5. **Smart caching**: Intelligent cache invalidation strategies 
