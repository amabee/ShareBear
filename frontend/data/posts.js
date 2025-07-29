const apiUrl =
  "https://api.unsplash.com/photos/random?client_id=TmGmMJBE1vccCIlhA9tAap1BxLfSM6qHOSuNeIy2eXw";
var imageUrl;
fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    imageUrl = data.urls.regular;
  })
  .catch((error) => console.error("Error fetching image:", error));

export const mockPosts = [
  {
    id: "1",
    user: {
      username: "sarah_chen",
      displayName: "Sarah Chen",
      avatar: "https://avatar.iran.liara.run/public",
      verified: false,
    },
    content:
      "Just discovered this hidden gem in the city! 🌟 The vibes are absolutely perfect for a chill afternoon ☕",
    images: [
      "https://images.unsplash.com/photo-1751315574555-9d982ea9ea63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg0NDJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NTI1NjMwNjl8&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1750268746263-52cdef61e177?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=M3w3Nzg0NDJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NTI1NjMyMDB8\u0026ixlib=rb-4.1.0\u0026q=80\u0026w=1080",
    ],
    timestamp: "2 hours ago",
    likes: 1234,
    comments: 89,
    shares: 23,
    liked: false,
    location: "Downtown Coffee Co.",
    hashtags: ["#coffee", "#vibes", "#citylife", "#hidden gems"],
  },
  {
    id: "2",
    user: {
      username: "meme_central",
      displayName: "Meme Central",
      avatar: "https://avatar.iran.liara.run/public",
      verified: true,
    },
    content:
      "When you finally understand that one meme everyone's been laughing at 😂😂😂",
    images: [
      "https://images.unsplash.com/photo-1751013781844-fa6a78089e49?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=M3w3Nzg0NDJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NTI1NjMyNjV8\u0026ixlib=rb-4.1.0\u0026q=80\u0026w=1080",
    ],
    timestamp: "4 hours ago",
    likes: 5678,
    comments: 234,
    shares: 89,
    liked: true,
    hashtags: ["#memes", "#relatable", "#mood", "#finally"],
  },
];
