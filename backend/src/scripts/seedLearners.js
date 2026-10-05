import "../polyfill.js";
import dotenv from "dotenv";
import { connectDB } from "../lib/db.js";
import User from "../models/User.js";
import { upsertStreamUser } from "../lib/stream.js";

dotenv.config();

const SAMPLE_LEARNERS = [
  {
    fullName: "Arjun Varma",
    email: "arjun@verba.app",
    password: "Password123!",
    nativeLanguage: "telugu",
    learningLanguage: "english",
    location: "Hyderabad, India",
    bio: "Tech entrepreneur and cinema lover from Hyderabad. Fluent in Telugu, passionate about conversational English practice!",
    profilePic: "https://api.dicebear.com/9.x/avataaars/svg?seed=Arjun&backgroundColor=b6e3f4",
    isOnboarded: true,
  },
  {
    fullName: "Priya Sharma",
    email: "priya@verba.app",
    password: "Password123!",
    nativeLanguage: "hindi",
    learningLanguage: "english",
    location: "New Delhi, India",
    bio: "Fluent Hindi speaker and literature enthusiast. Looking to practice daily conversational English!",
    profilePic: "https://api.dicebear.com/9.x/lorelei/svg?seed=Priya&backgroundColor=ffd5dc",
    isOnboarded: true,
  },
  {
    fullName: "Sofia Martinez",
    email: "sofia@verba.app",
    password: "Password123!",
    nativeLanguage: "spanish",
    learningLanguage: "english",
    location: "Madrid, Spain",
    bio: "Architecture designer in Madrid. Love discussing art, food, and culture. Let's chat in Spanish and English!",
    profilePic: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sofia&backgroundColor=ffdfbf",
    isOnboarded: true,
  },
  {
    fullName: "Lucas Dubois",
    email: "lucas@verba.app",
    password: "Password123!",
    nativeLanguage: "french",
    learningLanguage: "spanish",
    location: "Paris, France",
    bio: "Pastry chef and musician from Paris. Happy to help you with French pronunciation and slang.",
    profilePic: "https://api.dicebear.com/9.x/adventurer/svg?seed=Lucas&backgroundColor=b6e3f4",
    isOnboarded: true,
  },
  {
    fullName: "Kenji Takahashi",
    email: "kenji@verba.app",
    password: "Password123!",
    nativeLanguage: "japanese",
    learningLanguage: "english",
    location: "Tokyo, Japan",
    bio: "Software developer in Shibuya. Let's talk about technology, anime, cinema, and everyday life!",
    profilePic: "https://api.dicebear.com/9.x/bottts/svg?seed=Kenji&backgroundColor=c0aede",
    isOnboarded: true,
  },
  {
    fullName: "Elena Rossi",
    email: "elena@verba.app",
    password: "Password123!",
    nativeLanguage: "italian",
    learningLanguage: "english",
    location: "Florence, Italy",
    bio: "Art historian and coffee addict. Seeking fluent English practice for upcoming international conferences.",
    profilePic: "https://api.dicebear.com/9.x/lorelei/svg?seed=Elena&backgroundColor=d1d4f9",
    isOnboarded: true,
  },
  {
    fullName: "Hans Becker",
    email: "hans@verba.app",
    password: "Password123!",
    nativeLanguage: "german",
    learningLanguage: "spanish",
    location: "Berlin, Germany",
    bio: "History teacher in Berlin. Enthusiastic about philosophy, travel, and learning conversational Spanish.",
    profilePic: "https://api.dicebear.com/9.x/avataaars/svg?seed=Hans&backgroundColor=b6e3f4",
    isOnboarded: true,
  },
  {
    fullName: "Ji-woo Park",
    email: "jiwoo@verba.app",
    password: "Password123!",
    nativeLanguage: "korean",
    learningLanguage: "english",
    location: "Seoul, South Korea",
    bio: "Digital designer based in Hongdae, Seoul. Looking to make international friends and practice English!",
    profilePic: "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Jiwoo&backgroundColor=ffd5dc",
    isOnboarded: true,
  },
  {
    fullName: "Mateo Silva",
    email: "mateo@verba.app",
    password: "Password123!",
    nativeLanguage: "portuguese",
    learningLanguage: "english",
    location: "São Paulo, Brazil",
    bio: "Photographer from São Paulo. Let's discuss travel, culture, and exchange languages over a video call.",
    profilePic: "https://api.dicebear.com/9.x/notionists/svg?seed=Mateo&backgroundColor=c0aede",
    isOnboarded: true,
  },
];

async function seed() {
  await connectDB();

  console.log("Checking existing users...");
  for (const learner of SAMPLE_LEARNERS) {
    const existing = await User.findOne({ email: learner.email });
    if (!existing) {
      const created = await User.create(learner);
      console.log(`Created learner: ${created.fullName} (${created.email})`);
      try {
        await upsertStreamUser({
          id: created._id.toString(),
          name: created.fullName,
          image: created.profilePic,
        });
      } catch (streamErr) {
        console.log(`Stream sync note: ${streamErr.message}`);
      }
    } else {
      console.log(`User ${learner.email} already exists.`);
    }
  }

  const count = await User.countDocuments();
  console.log(`Total users in database now: ${count}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Error seeding learners:", err);
  process.exit(1);
});
