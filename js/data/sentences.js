// Original letter lines, one set per villager, roughly ordered by difficulty.
// Only use characters the bitmap font can draw (tests/content.test.js checks this).

export const SENTENCES = {
  // Short and gentle: mostly lowercase, light punctuation.
  mushroom: [
    'I hope it rains soft rain today.',
    'The moss here is very warm.',
    'Please do not step on my cousins.',
    'I am small but I am brave.',
    'Dear sun, you are too bright.',
    'The night smells like wet leaves.',
    'I wrote this letter under my cap.',
    'Some days I hide all day long.',
    'Thank you for the kind snail.',
    'My spots are not polka dots.',
    'I like quiet songs and slow walks.',
    'Will you write back to me soon?',
  ],
  // Medium length, capitals and commas: official business.
  postmaster: [
    'Dear Head Office, the storm ate half of my stamps.',
    'Every letter must be sorted by noon, no exceptions.',
    'I have been a mailbox for forty years and I am tired.',
    'Please send more twine, the old twine has gone soggy.',
    'To whom it may concern: stop putting snails in me.',
    'The flag on my side is up, which means I am busy.',
    'A good courier is quick, careful, and never late.',
    'Rain is not an excuse, but it is a very good reason.',
    'Mind the ink, it smudges when you rush the ending.',
    'I am not grumpy, I am simply full of important mail.',
  ],
  // Punctuation-heavy and excitable.
  ghost: [
    'Boo! Did I scare you? No? Oh well, I tried my best!',
    'The pond glows at night; the frogs say it\'s my fault.',
    'Dear Moth, please stop visiting me at 3:00 a.m. Thanks!',
    'I\'m not see-through, I\'m "lightly translucent." Big difference.',
    'Things I love: candles, candy (the sour kind), and you!',
    'Is it rude to float? I can\'t help it; my feet are gone.',
    'P.S. My lantern\'s name is Flicker, and she says hello.',
    'Who\'s there? It\'s me! (Sorry, I always do that joke.)',
    'If you see a light in the woods, wave; it\'s probably me!',
    'Ha! Ha! Ha! Sorry, I was laughing at a cloud again.',
  ],
  // Long, thoughtful sentences.
  sage: [
    'Patience is not waiting quietly; it is keeping your hands steady while the world rushes past you like a river.',
    'When I was young, I raced the hares across the valley. I lost every race, but I saw every flower on the way.',
    'A letter carries more than words, little one. It carries the hope of someone who wanted you to read it.',
    'Speed comes to those who stop chasing it. Type each letter as if it matters, and soon they will all arrive on time.',
    'The storm took our letters, but it could not take our stories. Those we keep in our shells, safe and warm.',
    'Mistakes are only footprints. Look back at them kindly, then keep walking toward the light at the end of the road.',
  ],
};
