import { Camera, Users, Heart, Star } from "lucide-react";

export const user = {
  id: "angelzm_",
  name: "John Doe",
  username: "angelzm_",
  bio: "✨ Digital creator sharing life's moments • 📸 Photography enthusiast • 🌍 Exploring the world one post at a time • 💭 Spreading positivity through memes and memories",
  avatar: "https://avatarfiles.alphacoders.com/346/thumb-1920-346042.png",
  coverImage:
    "https://images.hdqwalls.com/wallpapers/elizabeth-olsen-as-scarlet-witch-in-wanda-vision-4k-of.jpg",
  location: "San Francisco, CA",
  website: "johndoe.com",
  joinDate: "March 2023",
  followersCount: "12.5K",
  followingCount: "892",
  isVerified: true,
};

export const userStats = [
  { label: "Posts", value: "127", icon: Camera, color: "text-blue-500" },
  { label: "Followers", value: "12.5K", icon: Users, color: "text-green-500" },
  { label: "Following", value: "892", icon: Heart, color: "text-red-500" },
  { label: "Likes", value: "45.2K", icon: Star, color: "text-yellow-500" },
];

export const userPosts = [
  {
    id: "0",
    type: "text",
    content: "Just had the most amazing day at the beach! 🏖️",
    likes: 234,
    comments: 18,
    //backgroundColor: "#FF6B6B",
    backgroundImage:
      "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d",
  },
  {
    id: "1",
    type: "text",
    content: `In a quiet valley where the grass bowed gently to the breeze, there lived a big brown fox named Felix. Unlike most foxes, Felix wasn’t known for stealing chickens or scurrying through forests. He was known for jumping — and not just any kind of jumping. Felix could leap over fences, streams, even carts filled with hay. But what made him truly famous was one legendary leap: the jump over the old, lazy dog named Gus.

Gus had been guarding Farmer Eliot’s backyard for as long as anyone could remember. He didn’t chase, bark, or even care much anymore — most days, he lay in the sun, watching birds pass by. But he did have one rule: “No fox gets past me.”

Felix, young and proud, had heard the stories. “The old hound who once chased three coyotes into the woods,” they said. “The dog whose bark could shake an apple off a tree.” But when Felix first saw Gus, he laughed. “That dog? He’s more nap than nightmare.”

Still, he respected tradition. So one bright morning, Felix approached the yard — not to sneak in, but to challenge the legend. With a running start, he soared clean over Gus, landing with barely a sound.

Gus didn’t even flinch.

The next day, Felix did it again. And again the next. Each time, the same leap. The same silent dog.

Then one morning, as Felix lined up his jump, Gus opened one eye.

“Why do you keep leaping, boy?” he asked, his voice a dry rumble.

Felix paused mid-sprint. “Because I can,” he said, unsure.

“Then leap higher,” Gus muttered, closing his eyes.

From that day on, Felix pushed further. Over the chicken coop. Over the barn roof. Over the river itself.

And far beyond the farm, stories were told — not just of the lazy dog who once ruled the yard, but of the big brown fox who never stopped jumping, and always aimed higher.`,
    likes: 500952,
    comments: 18,
    backgroundColor: "linear-gradient(to right, #ff6b6b, #feca57)",
  },
  {
    id: "2",
    image:
      "https://plus.unsplash.com/premium_photo-1682095649467-808acb4e19cd?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    likes: 500952,
    comments: 32,
    type: "video",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
    likes: 189,
    comments: 12,
    type: "image",
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    likes: 567,
    comments: 45,
    type: "reel",
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9",
    likes: 123,
    comments: 8,
    type: "image",
  },
  {
    id: "6",
    image: "https://images.unsplash.com/photo-1550439062-609e1531270e",
    likes: 789,
    comments: 67,
    type: "video",
  },
  {
    id: "7",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    likes: 200,
    comments: 14,
    type: "image",
  },
  {
    id: "8",
    image: "https://images.unsplash.com/photo-1552058544-f2b08422138a",
    likes: 340,
    comments: 22,
    type: "image",
  },
  {
    id: "9",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
    likes: 410,
    comments: 27,
    type: "reel",
  },
  {
    id: "10",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce",
    likes: 130,
    comments: 10,
    type: "image",
  },
  {
    id: "11",
    image:
      "https://plus.unsplash.com/premium_photo-1682094008797-99c46d6b8728?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    likes: 278,
    comments: 15,
    type: "video",
  },
  {
    id: "12",
    image: "https://images.unsplash.com/photo-1482062364825-616fd23b8fc1",
    likes: 355,
    comments: 25,
    type: "image",
  },
  {
    id: "13",
    image: "https://images.unsplash.com/photo-1605523746900-8aa30db1befd",
    likes: 489,
    comments: 35,
    type: "image",
  },
  {
    id: "14",
    image: "https://images.unsplash.com/photo-1522333007-49d9d3ff4b8f",
    likes: 611,
    comments: 48,
    type: "reel",
  },
  {
    id: "15",
    image:
      "https://plus.unsplash.com/premium_photo-1670282393309-70fd7f8eb1ef?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    likes: 170,
    comments: 11,
    type: "video",
  },
  {
    id: "16",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
    likes: 499,
    comments: 29,
    type: "image",
  },
  {
    id: "17",
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
    likes: 221,
    comments: 17,
    type: "image",
  },
  {
    id: "18",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
    likes: 312,
    comments: 21,
    type: "reel",
  },
  {
    id: "19",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    likes: 265,
    comments: 13,
    type: "image",
  },
  {
    id: "20",
    image: "https://images.unsplash.com/photo-1549924231-f129b911e442",
    likes: 392,
    comments: 28,
    type: "image",
  },
  {
    id: "21",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    likes: 580,
    comments: 37,
    type: "video",
  },
  {
    id: "22",
    image: "https://images.unsplash.com/photo-1744018195752-276f4f77cc7a",
    likes: 134,
    comments: 9,
    type: "image",
  },
  {
    id: "23",
    image: "https://images.unsplash.com/photo-1496307653780-42ee777d4833",
    likes: 287,
    comments: 19,
    type: "reel",
  },
  {
    id: "24",
    image: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d",
    likes: 321,
    comments: 16,
    type: "image",
  },
  {
    id: "25",
    image: "https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b",
    likes: 411,
    comments: 26,
    type: "image",
  },
  {
    id: "26",
    image: "https://images.unsplash.com/photo-1500048993953-d23a436266cf",
    likes: 499,
    comments: 33,
    type: "video",
  },
];

export const mockFollowers = [
  {
    id: 1,
    name: "Alice Johnson",
    username: "alice_j",
    avatar: "/placeholder.svg",
    isFollowing: true,
  },
  {
    id: 2,
    name: "Bob Smith",
    username: "bob_smith",
    avatar: "/placeholder.svg",
    isFollowing: false,
  },
  {
    id: 3,
    name: "Carol Davis",
    username: "carol_d",
    avatar: "/placeholder.svg",
    isFollowing: true,
  },
  // Add more mock data as needed
];

export const mockFollowing = [
  {
    id: 1,
    name: "David Wilson",
    username: "david_w",
    avatar: "/placeholder.svg",
    isFollowing: true,
  },
  {
    id: 2,
    name: "Emma Brown",
    username: "emma_b",
    avatar: "/placeholder.svg",
    isFollowing: true,
  },
  {
    id: 3,
    name: "Frank Miller",
    username: "frank_m",
    avatar: "/placeholder.svg",
    isFollowing: true,
  },
  // Add more mock data as needed
];
