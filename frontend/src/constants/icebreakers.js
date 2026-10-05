export const ICEBREAKERS = [
  "Teach your partner 1 cool slang word or idiom in your native language!",
  "What is the most popular or delicious comfort food in your hometown?",
  "What motivated you to start learning this language?",
  "If you could teleport to any city in the world for dinner tonight, where would you go?",
  "What is one funny or surprising cultural habit from your country that foreigners don't know?",
  "What is the most challenging phrase to pronounce in your language?",
  "Describe your favorite holiday or celebration in your culture.",
  "What kind of music do people in your area listen to right now?",
  "Tell your partner about your favorite movie or series and why you like it.",
  "What does a perfect Sunday look like for you?",
  "Share 3 words that sound very similar in your language but mean completely different things!",
  "If you could have any superpower for 24 hours, what would you choose and what would you do?",
];

export const getRandomIcebreaker = () => {
  const index = Math.floor(Math.random() * ICEBREAKERS.length);
  return ICEBREAKERS[index];
};
