// Test file to demonstrate pagination usage
// This is for reference only - not meant to be run directly

const BASE_URL = 'http://localhost:3000/api/posts';

// Example API calls with pagination

// 1. Get first page of posts (default: 10 posts)
fetch(`${BASE_URL}?page=1&limit=10`, {
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
})
.then(response => response.json())
.then(data => {
  console.log('Posts:', data.posts);
  console.log('Pagination:', data.pagination);
  // data.pagination will contain:
  // {
  //   page: 1,
  //   limit: 10,
  //   totalPosts: 150,
  //   totalPages: 15,
  //   hasNextPage: true,
  //   hasPreviousPage: false,
  //   nextCursor: "post_id_123",
  //   previousCursor: null
  // }
});

// 2. Get second page of posts
fetch(`${BASE_URL}?page=2&limit=10`, {
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
})
.then(response => response.json())
.then(data => {
  console.log('Page 2 Posts:', data.posts);
  console.log('Pagination:', data.pagination);
});

// 3. Get posts with custom limit (20 posts per page)
fetch(`${BASE_URL}?page=1&limit=20`, {
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
})
.then(response => response.json())
.then(data => {
  console.log('Posts with limit 20:', data.posts);
  console.log('Pagination:', data.pagination);
});

// 4. Cursor-based pagination (more efficient for large datasets)
fetch(`${BASE_URL}?cursor=post_id_123&limit=10`, {
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
})
.then(response => response.json())
.then(data => {
  console.log('Cursor-based posts:', data.posts);
  console.log('Pagination:', data.pagination);
});

// 5. Get posts by hashtag with pagination
fetch(`${BASE_URL}/hashtag/tech?page=1&limit=10`, {
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
})
.then(response => response.json())
.then(data => {
  console.log('Hashtag posts:', data.posts);
  console.log('Hashtag:', data.hashtag);
  console.log('Pagination:', data.pagination);
});

// 6. Frontend example: Load more posts
function loadMorePosts(cursor) {
  const url = cursor 
    ? `${BASE_URL}?cursor=${cursor}&limit=10`
    : `${BASE_URL}?page=1&limit=10`;
    
  fetch(url, {
    headers: {
      'Authorization': 'Bearer YOUR_JWT_TOKEN'
    }
  })
  .then(response => response.json())
  .then(data => {
    // Append new posts to existing list
    appendPostsToUI(data.posts);
    
    // Store cursor for next page
    if (data.pagination.nextCursor) {
      localStorage.setItem('nextCursor', data.pagination.nextCursor);
    }
  });
}

// 7. Frontend example: Infinite scroll
function setupInfiniteScroll() {
  let isLoading = false;
  let nextCursor = null;
  
  window.addEventListener('scroll', () => {
    if (isLoading) return;
    
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      isLoading = true;
      loadMorePosts(nextCursor);
    }
  });
}

console.log('Pagination API Examples:');
console.log('1. GET /api/posts?page=1&limit=10 - Get first page');
console.log('2. GET /api/posts?page=2&limit=10 - Get second page');
console.log('3. GET /api/posts?cursor=post_id&limit=10 - Cursor-based pagination');
console.log('4. GET /api/posts/hashtag/tech?page=1&limit=10 - Hashtag posts with pagination'); 
