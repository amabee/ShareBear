// SAMPLE USAGE OF FOLLOW FUNCTIONALITY
// This demonstrates how the follow system works with proper checks

// Example 1: Follow a user (with automatic check)
// POST /api/follow/123
// Headers: Authorization: Bearer <jwt_token>
// Body: (empty)
// 
// This will automatically check if you're already following user 123
// Response if already following:
// {
//   "error": "You are already following this user"
// }
//
// Response if successful:
// {
//   "message": "Successfully followed user",
//   "follow": {
//     "id": 1,
//     "followerId": 456,
//     "followingId": 123,
//     "status": "accepted",
//     "createdAt": "2024-01-15T10:30:00.000Z",
//     "follower": {
//       "id": 456,
//       "username": "user456",
//       "userInfo": {
//         "firstName": "John",
//         "lastName": "Doe",
//         "displayName": "John Doe",
//         "profilePictureUrl": "https://example.com/avatar.jpg"
//       }
//     },
//     "following": {
//       "id": 123,
//       "username": "user123",
//       "userInfo": {
//         "firstName": "Jane",
//         "lastName": "Smith",
//         "displayName": "Jane Smith",
//         "profilePictureUrl": "https://example.com/avatar2.jpg"
//       }
//     }
//   }
// }

// Example 2: Check if you're following a user (explicit check)
// GET /api/follow/check/123
// Headers: Authorization: Bearer <jwt_token>
//
// Response:
// {
//   "isFollowing": true,
//   "status": "accepted",
//   "followId": 1
// }
//
// Or if not following:
// {
//   "isFollowing": false,
//   "status": null,
//   "followId": null
// }

// Example 3: Unfollow a user
// DELETE /api/follow/123
// Headers: Authorization: Bearer <jwt_token>
//
// Response if not following:
// {
//   "error": "You are not following this user"
// }
//
// Response if successful:
// {
//   "message": "Successfully unfollowed user"
// }

// Example 4: Get follow statistics
// GET /api/follow/stats/123
// Headers: Authorization: Bearer <jwt_token>
//
// Response:
// {
//   "followersCount": 150,
//   "followingCount": 75
// }

// Example 5: Get user's followers
// GET /api/follow/followers/123?page=1&limit=20
// Headers: Authorization: Bearer <jwt_token>
//
// Response:
// {
//   "followers": [
//     {
//       "id": 456,
//       "username": "user456",
//       "userInfo": {
//         "firstName": "John",
//         "lastName": "Doe",
//         "displayName": "John Doe",
//         "profilePictureUrl": "https://example.com/avatar.jpg",
//         "bio": "Software developer"
//       }
//     }
//   ],
//   "pagination": {
//     "page": 1,
//     "limit": 20,
//     "hasMore": true
//   }
// }

// Example 6: Get user's following
// GET /api/follow/following/123?page=1&limit=20
// Headers: Authorization: Bearer <jwt_token>
//
// Response:
// {
//   "following": [
//     {
//       "id": 789,
//       "username": "user789",
//       "userInfo": {
//         "firstName": "Alice",
//         "lastName": "Johnson",
//         "displayName": "Alice Johnson",
//         "profilePictureUrl": "https://example.com/avatar3.jpg",
//         "bio": "Designer"
//       }
//     }
//   ],
//   "pagination": {
//     "page": 1,
//     "limit": 20,
//     "hasMore": false
//   }
// }

// KEY FEATURES OF THIS IMPLEMENTATION:

// 1. AUTOMATIC CHECK: When you try to follow someone, it automatically checks if you're already following them
// 2. PREVENTS DUPLICATES: Uses database unique constraint on (followerId, followingId)
// 3. SELF-FOLLOW PREVENTION: You cannot follow yourself
// 4. USER EXISTENCE CHECK: Verifies the user you're trying to follow exists
// 5. COMPREHENSIVE ERROR HANDLING: Different error codes for different scenarios
// 6. LOGGING: All follow/unfollow actions are logged for audit purposes
// 7. PAGINATION: Followers and following lists support pagination
// 8. VALIDATION: All inputs are validated with proper schemas
// 9. AUTHENTICATION: All routes require JWT authentication

// ERROR CODES:
// - SELF_FOLLOW: Trying to follow yourself
// - USER_NOT_FOUND: User you're trying to follow doesn't exist
// - ALREADY_FOLLOWING: You're already following this user
// - FOLLOW_PENDING: Follow request is pending (for future use)
// - FOLLOW_BLOCKED: Cannot follow this user (for future use)
// - NOT_FOLLOWING: Trying to unfollow someone you're not following 
