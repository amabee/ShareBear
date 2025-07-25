export const messages = [
  {
    id: 1,
    text: "Hey! How are you doing?",
    timestamp: "10:30 AM",
    isSent: false,
  },
  {
    id: 2,
    text: "I'm doing great! Thanks for asking. How about you?",
    timestamp: "10:32 AM",
    isSent: true,
    isRead: true,
  },
  {
    id: 3,
    text: "Pretty good! Just working on some new projects. Want to grab coffee later?",
    timestamp: "10:35 AM",
    isSent: false,
  },
  {
    id: 4,
    text: "That sounds perfect! What time works for you?",
    timestamp: "10:36 AM",
    isSent: true,
    isRead: true,
  },
  {
    id: 5,
    text: "How about 3 PM at the usual place?",
    timestamp: "10:38 AM",
    isSent: false,
  },
  {
    id: 6,
    text: "Perfect! See you there 😊",
    timestamp: "10:39 AM",
    isSent: true,
    isRead: false,
  },
];

export const contacts = [
  {
    id: 1,
    name: "Alice Johnson",
    avatar: "/placeholder.svg?height=40&width=40&text=AJ",
    lastMessage: "Hey! How are you doing?",
    timestamp: "2m",
    unreadCount: 2,
    status: "online",
  },
  {
    id: 2,
    name: "Bob Smith",
    avatar: "/placeholder.svg?height=40&width=40&text=BS",
    lastMessage: "Thanks for the help yesterday!",
    timestamp: "1h",
    status: "away",
  },
  {
    id: 3,
    name: "Carol Davis",
    avatar: "/placeholder.svg?height=40&width=40&text=CD",
    lastMessage: "See you at the meeting tomorrow",
    timestamp: "3h",
    unreadCount: 1,
    status: "online",
  },
  {
    id: 4,
    name: "David Wilson",
    avatar: "/placeholder.svg?height=40&width=40&text=DW",
    lastMessage: "Perfect! Let's do it.",
    timestamp: "1d",
    status: "offline",
  },
  {
    id: 5,
    name: "Emma Brown",
    avatar: "/placeholder.svg?height=40&width=40&text=EB",
    lastMessage: "Can you send me the files?",
    timestamp: "2d",
    unreadCount: 5,
    status: "online",
  },
];

export const conversations = [
  {
    id: "alice-johnson",
    name: "Alice Johnson",
    avatar: "A",
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
    lastMessage:
      "Hey! How's the project going?, Hey! How's the project going?,",
    timestamp: "2:30 PM",
    unread: 2,
    isOnline: true,
    isTyping: false,
  },
  {
    id: "bob-smith",
    name: "Bob Smith",
    avatar: "B",
    color: "bg-gradient-to-br from-green-500 to-green-600",
    lastMessage: "Just finished the authentication system 🚀",
    timestamp: "1:45 PM",
    unread: 0,
    isOnline: true,
    isTyping: true,
  },
  {
    id: "carol-davis",
    name: "Carol Davis",
    avatar: "C",
    color: "bg-gradient-to-br from-purple-500 to-purple-600",
    lastMessage: "I'll review the PR later today",
    timestamp: "Yesterday",
    unread: 0,
    isOnline: false,
    isTyping: false,
  },
  {
    id: "david-wilson",
    name: "David Wilson",
    avatar: "D",
    color: "bg-gradient-to-br from-orange-500 to-orange-600",
    lastMessage: "Here's the latest mockup",
    timestamp: "Yesterday",
    unread: 1,
    isOnline: true,
    isTyping: false,
  },
  {
    id: "emma-thomas",
    name: "Emma Thomas",
    avatar: "E",
    color: "bg-gradient-to-br from-pink-500 to-pink-600",
    lastMessage:
      "Can we schedule a meeting tomorrow? I have some ideas I'd like to run by you about the onboarding process and the new dashboard components.",
    timestamp: "12:15 PM",
    unread: 3,
    isOnline: false,
    isTyping: false,
  },
  {
    id: "frank-harris",
    name: "Frank Harris",
    avatar: "F",
    color: "bg-gradient-to-br from-red-500 to-red-600",
    lastMessage:
      "Sorry I missed the stand-up. Here's a quick summary of my updates: finished task A, started task B, blocked on task C because of the API rate limit.",
    timestamp: "Today",
    unread: 0,
    isOnline: true,
    isTyping: false,
  },
  {
    id: "grace-lee",
    name: "Grace Lee",
    avatar: "G",
    color: "bg-gradient-to-br from-teal-500 to-teal-600",
    lastMessage: "Let's do lunch tomorrow 🍽️",
    timestamp: "9:20 AM",
    unread: 1,
    isOnline: true,
    isTyping: true,
  },
  {
    id: "henry-cooper",
    name: "Henry Cooper",
    avatar: "H",
    color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
    lastMessage:
      "The build is failing because of a missing dependency. Can someone check the package-lock?",
    timestamp: "Friday",
    unread: 0,
    isOnline: false,
    isTyping: false,
  },
  {
    id: "isabella-martin",
    name: "Isabella Martin",
    avatar: "I",
    color: "bg-gradient-to-br from-yellow-500 to-yellow-600",
    lastMessage:
      "Just wanted to say how much I appreciate all the work you've been doing lately. The latest updates to the app are so smooth and intuitive—awesome job 👏👏👏",
    timestamp: "Wednesday",
    unread: 4,
    isOnline: true,
    isTyping: false,
  },
  {
    id: "jackson-white",
    name: "Jackson White",
    avatar: "J",
    color: "bg-gradient-to-br from-gray-500 to-gray-600",
    lastMessage:
      "Yeah, that sounds good. I'm thinking we can go over the project scope, milestones, and deliverables during the sync-up. After that, we can define sprint goals more clearly.",
    timestamp: "Monday",
    unread: 0,
    isOnline: false,
    isTyping: false,
  },
  {
    id: "karen-moore",
    name: "Karen Moore",
    avatar: "K",
    color: "bg-gradient-to-br from-lime-500 to-lime-600",
    lastMessage: "Need anything from the design team?",
    timestamp: "10:55 AM",
    unread: 2,
    isOnline: true,
    isTyping: false,
  },
  {
    id: "liam-turner",
    name: "Liam Turner",
    avatar: "L",
    color: "bg-gradient-to-br from-cyan-500 to-cyan-600",
    lastMessage:
      "Hey, here's the doc you asked for. Let me know if anything's missing or unclear. I added notes for each section and linked related tickets in Jira.",
    timestamp: "Last week",
    unread: 0,
    isOnline: false,
    isTyping: false,
  },
  {
    id: "nina-brooks",
    name: "Nina Brooks",
    avatar: "N",
    color: "bg-gradient-to-br from-rose-500 to-rose-600",
    lastMessage:
      "That error seems related to the version mismatch. Try downgrading to v16.8.0 and see if that resolves it. If not, I can jump on a quick call to debug together.",
    timestamp: "Just now",
    unread: 5,
    isOnline: true,
    isTyping: false,
  },
  {
    id: "oliver-hall",
    name: "Oliver Hall",
    avatar: "O",
    color: "bg-gradient-to-br from-sky-500 to-sky-600",
    lastMessage:
      "👋 Just a reminder about the security audit coming up this week. Make sure all your services are up to date and you’ve cleared any pending PRs. We’ll do a walkthrough on Wednesday.",
    timestamp: "Today",
    unread: 0,
    isOnline: false,
    isTyping: false,
  },
];

export const conversationData = {
  "alice-johnson": {
    name: "Alice Johnson",
    type: "dm",
    description: "Chat with Alice Johnson",
  },
  "bob-smith": {
    name: "Bob Smith",
    type: "dm",
    description: "Chat with Bob Smith",
  },
  "carol-davis": {
    name: "Carol Davis",
    type: "dm",
    description: "Chat with Carol Davis",
  },
  "david-wilson": {
    name: "David Wilson",
    type: "dm",
    description: "Chat with David Wilson",
  },
  "emma-thomas": {
    name: "Emma Thomas",
    type: "dm",
    description: "Chat with Emma Thomas",
  },
  "frank-harris": {
    name: "Frank Harris",
    type: "dm",
    description: "Chat with Frank Harris",
  },
  "grace-lee": {
    name: "Grace Lee",
    type: "dm",
    description: "Chat with Grace Lee",
  },
  "henry-cooper": {
    name: "Henry Cooper",
    type: "dm",
    description: "Chat with Henry Cooper",
  },
  "isabella-martin": {
    name: "Isabella Martin",
    type: "dm",
    description: "Chat with Isabella Martin",
  },
  "jackson-white": {
    name: "Jackson White",
    type: "dm",
    description: "Chat with Jackson White",
  },
  "karen-moore": {
    name: "Karen Moore",
    type: "dm",
    description: "Chat with Karen Moore",
  },
  "liam-turner": {
    name: "Liam Turner",
    type: "dm",
    description: "Chat with Liam Turner",
  },
  "nina-brooks": {
    name: "Nina Brooks",
    type: "dm",
    description: "Chat with Nina Brooks",
  },
  "oliver-hall": {
    name: "Oliver Hall",
    type: "dm",
    description: "Chat with Oliver Hall",
  },
};
