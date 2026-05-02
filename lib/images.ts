// Deterministically pick an image based on topicId so each journey gets a consistent image
export function pickForTopic(images: string[], topicId: string): string {
  const hash = topicId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return images[hash % images.length];
}

// Pick randomly (for journey list header — changes on each browse)
export function pickRandom(images: string[]): string {
  return images[Math.floor(Math.random() * images.length)];
}

const UNS = "https://images.unsplash.com";
const Q = "crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200";
const WIKI = "https://upload.wikimedia.org/wikipedia/commons";
const WIKI_T = "https://upload.wikimedia.org/wikipedia/commons/thumb";

export const IMAGES = {
  // Random on every browse
  journeyList: [
    `${UNS}/photo-1448375240586-882707db888b?${Q}`,  // misty forest path
    `${UNS}/photo-1506905925346-21bda4d32df4?${Q}`,  // mountain trail
    `${UNS}/photo-1510797215324-95aa89f43c33?${Q}`,  // stone steps in forest
    `${UNS}/photo-1476514525535-07fb3b4ae5f1?${Q}`,  // winding road through hills
  ],

  // Home listing hero
  home: [
    `${UNS}/photo-1448375240586-882707db888b?${Q}`,  // misty forest path
  ],

  // Ancient books / library
  sutra: [
    `${UNS}/photo-1481627834876-b7833e8f5570?${Q}`,  // ancient books library
  ],

  // Still water, calm, looking inward
  reflection: [
    `${UNS}/photo-1501854140801-50d01698950b?${Q}`,  // still lake at sunrise
    `${UNS}/photo-1518241353330-0f7941c2d9b5?${Q}`,  // foggy morning lake
    `${UNS}/photo-1476514525535-07fb3b4ae5f1?${Q}`,  // winding road through hills
    `${UNS}/photo-1500534314209-a25ddb2bd429?${Q}`,  // quiet path through forest
    `${UNS}/photo-1523712999610-f77fbcfc3843?${Q}`,  // sunlight through forest
    `${UNS}/photo-1444703686981-a3abbc4d4fe3?${Q}`,  // starry night sky
  ],

  // Yoga, meditation, movement
  practice: [
    `${UNS}/photo-1506126613408-eca07ce68773?${Q}`,  // yoga at sunrise
    `${UNS}/photo-1545389336-cf090694435e?${Q}`,     // meditation in nature
    `${UNS}/photo-1499728603263-13726abce5fd?${Q}`,  // person meditating at lake
    `${UNS}/photo-1474418397713-7ede21d49118?${Q}`,  // morning mist forest
    `${UNS}/photo-1593811167562-9cef47bfc4d7?${Q}`,  // morning meditation
  ],

  // Bhagavad Gita — Krishna/Arjuna chariot statue (Unsplash)
  gita: [
    `${UNS}/photo-1616237272803-8258dd2481ce?${Q}`,  // Krishna Arjuna chariot statue
  ],

  // Gurudev Sri Sri Ravi Shankar
  gurudev: [
    `${WIKI_T}/8/8d/Sri_Sri_Ravi_Shankar_-_new.jpg/800px-Sri_Sri_Ravi_Shankar_-_new.jpg`,
  ],

  // Journal — notebook, writing, morning light
  journal: [
    `${UNS}/photo-1531346680769-a1d79b57de5c?${Q}`,  // notebook by window
    `${UNS}/photo-1455390582262-044cdead277a?${Q}`,  // pen writing in journal
    `${UNS}/photo-1506784983877-45594efa4cbe?${Q}`,  // journal morning light
    `${UNS}/photo-1471107340929-a87cd0f5b5f3?${Q}`,  // open journal soft light
  ],

  // Session complete — self-study, achievement, new horizon
  sessionComplete: [
    `${UNS}/photo-1456513080510-7bf3a84b82f8?${Q}`,  // books & study
    `${UNS}/photo-1488190211105-8b0e65b80b4e?${Q}`,  // person reading sunrise
    `${UNS}/photo-1464822759023-fed622ff2c3b?${Q}`,  // sunrise over mountains
    `${UNS}/photo-1542273917363-3b1817f69a2d?${Q}`,  // sunlight through forest
  ],
};
