export const searchSuggestions = {
  recent: [
    "sunset photography tips",
    "healthy breakfast recipes",
    "travel vlog bali",
    "dance tutorial hip hop",
    "minimalist room decor",
    "guitar chords for beginners",
    "workout routine home",
  ],
  trending: [
    "#SummerVibes2024",
    "#FoodieLife",
    "#TravelGoals",
    "#WorkoutMotivation",
    "#AestheticVibes",
    "#NaturePhotography",
    "#HealthyLiving",
    "#CreativeProcess",
  ],
  users: [
    {
      id: "user_1",
      name: "Sarah Johnson",
      username: "sarah_creates",
      avatar: "/placeholder.svg?height=40&width=40",
      followers: "125K",
      verified: true,
      bio: "Digital artist & UI designer",
    },
    {
      id: "user_2",
      name: "Mike Chen",
      username: "mike_travels",
      avatar: "/placeholder.svg?height=40&width=40",
      followers: "89K",
      verified: false,
      bio: "Travel photographer & blogger",
    },
    {
      id: "user_3",
      name: "Emma Rodriguez",
      username: "emma_fitness",
      avatar: "/placeholder.svg?height=40&width=40",
      followers: "234K",
      verified: true,
      bio: "Certified fitness trainer",
    },
    {
      id: "user_4",
      name: "Alex Thompson",
      username: "alex_cooks",
      avatar: "/placeholder.svg?height=40&width=40",
      followers: "156K",
      verified: false,
      bio: "Home chef & recipe creator",
    },
  ],
  categories: [
    { name: "Photography", count: "2.3M", icon: "📸" },
    { name: "Food & Cooking", count: "1.8M", icon: "🍳" },
    { name: "Travel", count: "1.5M", icon: "✈️" },
    { name: "Fitness", count: "1.2M", icon: "💪" },
    { name: "Art & Design", count: "980K", icon: "🎨" },
    { name: "Music", count: "756K", icon: "🎵" },
    { name: "Nature", count: "634K", icon: "🌿" },
    { name: "Lifestyle", count: "523K", icon: "✨" },
  ],
};

export const sampleImages = [
  // ─── Original 8 with Unsplash URLs ─────────────────────
  {
    id: "img_1",
    type: "image",
    title: "Minimalist workspace with MacBook and coffee",
    thumbnail:
      "https://images.unsplash.com/photo-c0yy68570Pg?auto=format&fit=crop&w=600&h=400",
    creator: {
      name: "DesignStudio",
      avatar:
        "https://images.unsplash.com/photo-c0yy68570Pg?auto=format&fit=crop&w=32&h=32",
    },
    likes: 89000,
    downloads: 12000,
    category: "Design",
    trending: false,
    dimensions: { width: 600, height: 400 },
  },
  {
    id: "img_2",
    type: "image",
    title: "Abstract geometric pattern in pastel colors",
    thumbnail:
      "https://images.unsplash.com/photo-aOC7TSLb1o8?auto=format&fit=crop&w=400&h=600",
    creator: {
      name: "ArtistCollective",
      avatar:
        "https://images.unsplash.com/photo-aOC7TSLb1o8?auto=format&fit=crop&w=32&h=32",
    },
    likes: 156000,
    downloads: 45000,
    trending: true,
    category: "Art",
    dimensions: { width: 400, height: 600 },
  },
  {
    id: "img_3",
    type: "image",
    title: "Cozy coffee shop interior with warm lighting",
    thumbnail:
      "https://images.unsplash.com/photo-zjxYwd4HOu0?auto=format&fit=crop&w=500&h=500",
    creator: {
      name: "CafeVibes",
      avatar:
        "https://images.unsplash.com/photo-zjxYwd4HOu0?auto=format&fit=crop&w=32&h=32",
    },
    likes: 234000,
    downloads: 18000,
    category: "Lifestyle",
    dimensions: { width: 500, height: 500 },
  },
  {
    id: "img_4",
    type: "image",
    title: "Mountain landscape at golden hour",
    thumbnail:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&h=400",
    creator: {
      name: "NaturePhotographer",
      avatar:
        "https://images.unsplash.com/profile-1630000000000-stuvwx?auto=format&fit=crop&w=32&h=32",
    },
    likes: 445000,
    downloads: 67000,
    trending: true,
    category: "Photography",
    dimensions: { width: 800, height: 400 },
  },
  {
    id: "img_5",
    type: "image",
    title: "Tropical beach with crystal clear water",
    thumbnail:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&h=400",
    creator: {
      name: "TravelPhotographer",
      avatar:
        "https://images.unsplash.com/profile-1640000000000-yzabcd?auto=format&fit=crop&w=32&h=32",
    },
    likes: 678000,
    downloads: 89000,
    category: "Travel",
    dimensions: { width: 600, height: 400 },
  },
  {
    id: "img_6",
    type: "image",
    title: "Modern architecture building facade",
    thumbnail:
      "https://images.unsplash.com/photo-1529429617124-8e8558e23d34?auto=format&fit=crop&w=400&h=700",
    creator: {
      name: "ArchitecturalDigest",
      avatar:
        "https://images.unsplash.com/profile-1590000000000-abcdef?auto=format&fit=crop&w=32&h=32",
    },
    likes: 123000,
    downloads: 15000,
    category: "Architecture",
    dimensions: { width: 400, height: 700 },
  },
  {
    id: "img_7",
    type: "image",
    title: "Fresh ingredients for healthy cooking",
    thumbnail:
      "https://images.unsplash.com/photo-1511688878354-bdfc7d4acbc5?auto=format&fit=crop&w=500&h=500",
    creator: {
      name: "HealthyEats",
      avatar:
        "https://images.unsplash.com/profile-1580000000000-ghijkl?auto=format&fit=crop&w=32&h=32",
    },
    likes: 89000,
    downloads: 23000,
    category: "Food",
    dimensions: { width: 500, height: 500 },
  },
  {
    id: "img_8",
    type: "image",
    title: "Vintage camera collection on wooden table",
    thumbnail:
      "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=700&h=400",
    creator: {
      name: "VintageCollector",
      avatar:
        "https://images.unsplash.com/profile-1600000000000-mnopqr?auto=format&fit=crop&w=32&h=32",
    },
    likes: 67000,
    downloads: 12000,
    category: "Photography",
    dimensions: { width: 700, height: 400 },
  },

  // ─── 20 New Entries ──────────────────────────────────
  {
    id: "img_9",
    type: "image",
    title: "Sunlit forest path",
    thumbnail:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&h=400",
    creator: {
      name: "ForestWalker",
      avatar:
        "https://images.unsplash.com/profile-1501785888041-af3ef285b470?auto=format&fit=crop&w=32&h=32",
    },
    likes: 120000,
    downloads: 21000,
    category: "Nature",
    dimensions: { width: 600, height: 400 },
  },
  {
    id: "img_10",
    type: "image",
    title: "City skyline at night",
    thumbnail:
      "https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&fit=crop&w=800&h=600",
    creator: {
      name: "CityLights",
      avatar:
        "https://images.unsplash.com/profile-1499346030926-9a72daac6c63?auto=format&fit=crop&w=32&h=32",
    },
    likes: 340000,
    downloads: 55000,
    category: "Urban",
    dimensions: { width: 800, height: 600 },
  },
  {
    id: "img_11",
    type: "image",
    title: "Close-up of green leaves with droplets",
    thumbnail:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=600&h=400",
    creator: {
      name: "LeafLover",
      avatar:
        "https://images.unsplash.com/profile-1501004318641-b39e6451bec6?auto=format&fit=crop&w=32&h=32",
    },
    likes: 95000,
    downloads: 18000,
    category: "Nature",
    dimensions: { width: 600, height: 400 },
  },
  {
    id: "img_12",
    type: "image",
    title: "Modern kitchen interior",
    thumbnail:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&h=400",
    creator: {
      name: "HomeDesign",
      avatar:
        "https://images.unsplash.com/profile-1524758631624-e2822e304c36?auto=format&fit=crop&w=32&h=32",
    },
    likes: 210000,
    downloads: 30000,
    category: "Interior",
    dimensions: { width: 600, height: 400 },
  },
  {
    id: "img_13",
    type: "image",
    title: "Snow-covered mountain range",
    thumbnail:
      "https://images.unsplash.com/photo-1517821099600-8c5b0bfa3418?auto=format&fit=crop&w=800&h=500",
    creator: {
      name: "SnowSeeker",
      avatar:
        "https://images.unsplash.com/profile-1517821099600-8c5b0bfa3418?auto=format&fit=crop&w=32&h=32",
    },
    likes: 310000,
    downloads: 45000,
    category: "Travel",
    dimensions: { width: 800, height: 500 },
  },
  {
    id: "img_14",
    type: "image",
    title: "Boats docked at sunrise",
    thumbnail:
      "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=600&h=400",
    creator: {
      name: "DawnCaptures",
      avatar:
        "https://images.unsplash.com/profile-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=32&h=32",
    },
    likes: 89000,
    downloads: 15000,
    category: "Travel",
    dimensions: { width: 600, height: 400 },
  },
  {
    id: "img_15",
    type: "image",
    title: "Minimal marble workspace layout",
    thumbnail:
      "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=600&h=400",
    creator: {
      name: "DeskGoals",
      avatar:
        "https://images.unsplash.com/profile-1517433456452-f9633a875f6f?auto=format&fit=crop&w=32&h=32",
    },
    likes: 76000,
    downloads: 14000,
    category: "Design",
    dimensions: { width: 600, height: 400 },
  },
  {
    id: "img_16",
    type: "image",
    title: "Abstract pastel background swirl",
    thumbnail:
      "https://images.unsplash.com/photo-1490718280357-7b0b8ceb77ef?auto=format&fit=crop&w=600&h=600",
    creator: {
      name: "ArtSwirls",
      avatar:
        "https://images.unsplash.com/profile-1490718280357-7b0b8ceb77ef?auto=format&fit=crop&w=32&h=32",
    },
    likes: 165000,
    downloads: 38000,
    category: "Art",
    dimensions: { width: 600, height: 600 },
  },
  {
    id: "img_17",
    type: "image",
    title: "Urban coffee shop scene",
    thumbnail:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&h=400",
    creator: {
      name: "CafeCity",
      avatar:
        "https://images.unsplash.com/profile-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=32&h=32",
    },
    likes: 130000,
    downloads: 25000,
    category: "Lifestyle",
    dimensions: { width: 600, height: 400 },
  },
  {
    id: "img_18",
    type: "image",
    title: "Desert dunes at sunset",
    thumbnail:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&h=500",
    creator: {
      name: "DesertDreamer",
      avatar:
        "https://images.unsplash.com/profile-1501785888041-af3ef285b470?auto=format&fit=crop&w=32&h=32",
    },
    likes: 220000,
    downloads: 40000,
    category: "Travel",
    dimensions: { width: 800, height: 500 },
  },
  {
    id: "img_19",
    type: "image",
    title: "Clean workspace with plant accents",
    thumbnail:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&h=400",
    creator: {
      name: "PlantDesk",
      avatar:
        "https://images.unsplash.com/profile-1504384308090-c894fdcc538d?auto=format&fit=crop&w=32&h=32",
    },
    likes: 98000,
    downloads: 19000,
    category: "Design",
    dimensions: { width: 600, height: 400 },
  },
  {
    id: "img_20",
    type: "image",
    title: "Rustic kitchen table setting",
    thumbnail:
      "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=600&h=400",
    creator: {
      name: "RusticLiving",
      avatar:
        "https://images.unsplash.com/profile-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=32&h=32",
    },
    likes: 76000,
    downloads: 12000,
    category: "Food",
    dimensions: { width: 600, height: 400 },
  },
  {
    id: "img_21",
    type: "image",
    title: "City street wet after rain",
    thumbnail:
      "https://images.unsplash.com/photo-1501988588354-504e7f10b271?auto=format&fit=crop&w=600&h=400",
    creator: {
      name: "RainyRoads",
      avatar:
        "https://images.unsplash.com/profile-1501988588354-504e7f10b271?auto=format&fit=crop&w=32&h=32",
    },
    likes: 87000,
    downloads: 16000,
    category: "Urban",
    dimensions: { width: 600, height: 400 },
  },
  {
    id: "img_22",
    type: "image",
    title: "Vintage bike leaning on wall",
    thumbnail:
      "https://images.unsplash.com/photo-1490170498451-02c0e9a0a6e2?auto=format&fit=crop&w=600&h=400",
    creator: {
      name: "RetroRide",
      avatar:
        "https://images.unsplash.com/profile-1490170498451-02c0e9a0a6e2?auto=format&fit=crop&w=32&h=32",
    },
    likes: 54000,
    downloads: 11000,
    category: "Lifestyle",
    dimensions: { width: 600, height: 400 },
  },
  {
    id: "img_23",
    type: "image",
    title: "Quiet lakeside cabin",
    thumbnail:
      "https://images.unsplash.com/photo-1507925921958-8a62f3b0d6f4?auto=format&fit=crop&w=800&h=600",
    creator: {
      name: "LakeLife",
      avatar:
        "https://images.unsplash.com/profile-1507925921958-8a62f3b0d6f4?auto=format&fit=crop&w=32&h=32",
    },
    likes: 140000,
    downloads: 27000,
    category: "Travel",
    dimensions: { width: 800, height: 600 },
  },
  {
    id: "img_24",
    type: "image",
    title: "Macro flower bloom detail",
    thumbnail:
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=600&h=600",
    creator: {
      name: "FlowerFanatic",
      avatar:
        "https://images.unsplash.com/profile-1472214103451-9374bd1c798e?auto=format&fit=crop&w=32&h=32",
    },
    likes: 230000,
    downloads: 41000,
    category: "Nature",
    dimensions: { width: 600, height: 600 },
  },
  {
    id: "img_25",
    type: "image",
    title: "Soft pastel abstract gradients",
    thumbnail:
      "https://images.unsplash.com/photo-1498346502901-04d45e5f5c4f?auto=format&fit=crop&w=600&h=600",
    creator: {
      name: "SoftColors",
      avatar:
        "https://images.unsplash.com/profile-1498346502901-04d45e5f5c4f?auto=format&fit=crop&w=32&h=32",
    },
    likes: 125000,
    downloads: 29000,
    category: "Art",
    dimensions: { width: 600, height: 600 },
  },
  {
    id: "img_26",
    type: "image",
    title: "Industrial loft interior lighting",
    thumbnail:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&h=400",
    creator: {
      name: "LoftLiving",
      avatar:
        "https://images.unsplash.com/profile-1505691938895-1758d7feb511?auto=format&fit=crop&w=32&h=32",
    },
    likes: 99000,
    downloads: 21000,
    category: "Interior",
    dimensions: { width: 600, height: 400 },
  },
  {
    id: "img_27",
    type: "image",
    title: "Night stars over desert",
    thumbnail:
      "https://images.unsplash.com/photo-1502136969935-8d4eff2be830?auto=format&fit=crop&w=800&h=500",
    creator: {
      name: "StarGazer",
      avatar:
        "https://images.unsplash.com/profile-1502136969935-8d4eff2be830?auto=format&fit=crop&w=32&h=32",
    },
    likes: 300000,
    downloads: 48000,
    category: "Night",
    dimensions: { width: 800, height: 500 },
  },
  {
    id: "img_28",
    type: "image",
    title: "Rustic bookshelf corner",
    thumbnail:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&h=400",
    creator: {
      name: "BookNook",
      avatar:
        "https://images.unsplash.com/profile-1512820790803-83ca734da794?auto=format&fit=crop&w=32&h=32",
    },
    likes: 71000,
    downloads: 13000,
    category: "Interior",
    dimensions: { width: 600, height: 400 },
  },
];

export const sampleVideos = [
  // ─── Original 8 with Unsplash-based thumbnails ─────────────────────
  {
    id: "vid_1",
    type: "video",
    title: "Amazing sunset timelapse from mountain peak",
    thumbnail:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=300&h=400",
    creator: {
      name: "NatureLover",
      avatar:
        "https://images.unsplash.com/profile-1501785888041-af3ef285b470?auto=format&fit=crop&w=32&h=32",
    },
    views: 1200000,
    likes: 45000,
    duration: "0:45",
    trending: true,
    category: "Nature",
    dimensions: { width: 1280, height: 720 },
  },
  {
    id: "vid_2",
    type: "video",
    title: "Street food tour through Tokyo markets",
    thumbnail:
      "https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&fit=crop&w=500&h=300",
    creator: {
      name: "FoodieAdventures",
      avatar:
        "https://images.unsplash.com/profile-1499346030926-9a72daac6c63?auto=format&fit=crop&w=32&h=32",
    },
    views: 890000,
    likes: 32000,
    duration: "2:15",
    category: "Food",
    dimensions: { width: 500, height: 300 },
  },
  {
    id: "vid_3",
    type: "video",
    title: "Contemporary dance choreography performance",
    thumbnail:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&h=400",
    creator: {
      name: "DanceStudio",
      avatar:
        "https://images.unsplash.com/profile-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=32&h=32",
    },
    views: 567000,
    likes: 28000,
    duration: "1:30",
    category: "Dance",
    dimensions: { width: 400, height: 400 },
  },
  {
    id: "vid_4",
    type: "video",
    title: "Cute golden retriever puppies playing",
    thumbnail:
      "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=300&h=400",
    creator: {
      name: "PetLover",
      avatar:
        "https://images.unsplash.com/profile-1465101162946-4377e57745c3?auto=format&fit=crop&w=32&h=32",
    },
    views: 2100000,
    likes: 89000,
    duration: "1:05",
    trending: true,
    category: "Pets",
    dimensions: { width: 300, height: 400 },
  },
  {
    id: "vid_5",
    type: "video",
    title: "Acoustic guitar tutorial for beginners",
    thumbnail:
      "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=600&h=300",
    creator: {
      name: "MusicTeacher",
      avatar:
        "https://images.unsplash.com/profile-1517433456452-f9633a875f6f?auto=format&fit=crop&w=32&h=32",
    },
    views: 445000,
    likes: 22000,
    duration: "4:45",
    category: "Music",
    dimensions: { width: 600, height: 300 },
  },
  {
    id: "vid_6",
    type: "video",
    title: "Full body workout routine at home",
    thumbnail:
      "https://images.unsplash.com/photo-1529429617124-8e8558e23d34?auto=format&fit=crop&w=400&h=500",
    creator: {
      name: "FitnessGuru",
      avatar:
        "https://images.unsplash.com/profile-1529429617124-8e8558e23d34?auto=format&fit=crop&w=32&h=32",
    },
    views: 678000,
    likes: 34000,
    duration: "2:30",
    category: "Fitness",
    dimensions: { width: 400, height: 500 },
  },
  {
    id: "vid_7",
    type: "video",
    title: "Homemade pasta making from scratch",
    thumbnail:
      "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=400&h=400",
    creator: {
      name: "ChefMaster",
      avatar:
        "https://images.unsplash.com/profile-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=32&h=32",
    },
    views: 123000,
    likes: 8500,
    duration: "5:15",
    category: "Food",
    dimensions: { width: 400, height: 400 },
  },
  {
    id: "vid_8",
    type: "video",
    title: "Bali travel vlog: Hidden waterfalls",
    thumbnail:
      "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=700&h=300",
    creator: {
      name: "TravelBlogger",
      avatar:
        "https://images.unsplash.com/profile-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=32&h=32",
    },
    views: 1500000,
    likes: 67000,
    duration: "8:20",
    trending: true,
    category: "Travel",
    dimensions: { width: 700, height: 300 },
  },

  // ─── 20 New Video Entries ─────────────────────────────────
  {
    id: "vid_9",
    type: "video",
    title: "City timelapse from above",
    thumbnail:
      "https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&fit=crop&w=500&h=300",
    creator: {
      name: "SkylineWatcher",
      avatar:
        "https://images.unsplash.com/profile-1499346030926-9a72daac6c63?auto=format&fit=crop&w=32&h=32",
    },
    views: 980000,
    likes: 42000,
    duration: "0:30",
    trending: false,
    category: "Urban",
    dimensions: { width: 500, height: 300 },
  },
  {
    id: "vid_10",
    type: "video",
    title: "Rain in the forest slow motion",
    thumbnail:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=300&h=400",
    creator: {
      name: "NatureMood",
      avatar:
        "https://images.unsplash.com/profile-1501785888041-af3ef285b470?auto=format&fit=crop&w=32&h=32",
    },
    views: 560000,
    likes: 22000,
    duration: "1:10",
    category: "Nature",
    dimensions: { width: 300, height: 400 },
  },
  {
    id: "vid_11",
    type: "video",
    title: "Chef plating gourmet dish",
    thumbnail:
      "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=500&h=300",
    creator: {
      name: "GourmetChef",
      avatar:
        "https://images.unsplash.com/profile-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=32&h=32",
    },
    views: 720000,
    likes: 33000,
    duration: "2:00",
    category: "Food",
    dimensions: { width: 500, height: 300 },
  },
  {
    id: "vid_12",
    type: "video",
    title: "Modern dance studio lights",
    thumbnail:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&h=400",
    creator: {
      name: "DanceLights",
      avatar:
        "https://images.unsplash.com/profile-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=32&h=32",
    },
    views: 450000,
    likes: 26000,
    duration: "1:20",
    category: "Dance",
    dimensions: { width: 400, height: 400 },
  },
  {
    id: "vid_13",
    type: "video",
    title: "Golden hour ocean waves",
    thumbnail:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&h=300",
    creator: {
      name: "OceanWatcher",
      avatar:
        "https://images.unsplash.com/profile-1507525428034-b723cf961d3e?auto=format&fit=crop&w=32&h=32",
    },
    views: 890000,
    likes: 48000,
    duration: "0:50",
    category: "Nature",
    dimensions: { width: 700, height: 300 },
  },
  {
    id: "vid_14",
    type: "video",
    title: "Street musician playing guitar",
    thumbnail:
      "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=600&h=300",
    creator: {
      name: "UrbanBeats",
      avatar:
        "https://images.unsplash.com/profile-1517433456452-f9633a875f6f?auto=format&fit=crop&w=32&h=32",
    },
    views: 610000,
    likes: 29000,
    duration: "1:45",
    category: "Music",
    dimensions: { width: 600, height: 300 },
  },
  {
    id: "vid_15",
    type: "video",
    title: "Yoga sunrise flow",
    thumbnail:
      "https://images.unsplash.com/photo-1529429617124-8e8558e23d34?auto=format&fit=crop&w=400&h=500",
    creator: {
      name: "YogaDaily",
      avatar:
        "https://images.unsplash.com/profile-1529429617124-8e8558e23d34?auto=format&fit=crop&w=32&h=32",
    },
    views: 490000,
    likes: 27000,
    duration: "3:00",
    category: "Fitness",
    dimensions: { width: 400, height: 500 },
  },
  {
    id: "vid_16",
    type: "video",
    title: "Cooking fresh salad",
    thumbnail:
      "https://images.unsplash.com/photo-1511688878354-bdfc7d4acbc5?auto=format&fit=crop&w=500&h=300",
    creator: {
      name: "HealthKitchen",
      avatar:
        "https://images.unsplash.com/profile-1511688878354-bdfc7d4acbc5?auto=format&fit=crop&w=32&h=32",
    },
    views: 680000,
    likes: 32000,
    duration: "2:30",
    category: "Food",
    dimensions: { width: 500, height: 300 },
  },
  {
    id: "vid_17",
    type: "video",
    title: "Vintage car drive-by",
    thumbnail:
      "https://images.unsplash.com/photo-1490170498451-02c0e9a0a6e2?auto=format&fit=crop&w=600&h=300",
    creator: {
      name: "RetroDrive",
      avatar:
        "https://images.unsplash.com/profile-1490170498451-02c0e9a0a6e2?auto=format&fit=crop&w=32&h=32",
    },
    views: 330000,
    likes: 15000,
    duration: "0:40",
    category: "Travel",
    dimensions: { width: 600, height: 300 },
  },
  {
    id: "vid_18",
    type: "video",
    title: "Cozy fireplace ambiance",
    thumbnail:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=500&h=300",
    creator: {
      name: "CozyVibes",
      avatar:
        "https://images.unsplash.com/profile-1505691938895-1758d7feb511?auto=format&fit=crop&w=32&h=32",
    },
    views: 290000,
    likes: 18000,
    duration: "1:00",
    category: "Lifestyle",
    dimensions: { width: 500, height: 300 },
  },
  {
    id: "vid_19",
    type: "video",
    title: "Staircase architecture close-up",
    thumbnail:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400&h=400",
    creator: {
      name: "ArchFan",
      avatar:
        "https://images.unsplash.com/profile-1524758631624-e2822e304c36?auto=format&fit=crop&w=32&h=32",
    },
    views: 410000,
    likes: 21000,
    duration: "0:55",
    category: "Architecture",
    dimensions: { width: 400, height: 400 },
  },
  {
    id: "vid_20",
    type: "video",
    title: "Bookshelf tour with soft lighting",
    thumbnail:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&h=300",
    creator: {
      name: "BookTour",
      avatar:
        "https://images.unsplash.com/profile-1512820790803-83ca734da794?auto=format&fit=crop&w=32&h=32",
    },
    views: 250000,
    likes: 14000,
    duration: "1:20",
    category: "Lifestyle",
    dimensions: { width: 500, height: 300 },
  },
];
