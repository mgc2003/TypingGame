// Villagers. Order matters: each one requires the previous to be befriended.
// Dialogue placeholders: {name} = courier name, {wpm}/{acc} = this villager's goal.

export const NPCS = [
  {
    id: 'mushroom',
    name: 'Mushroom',
    sprite: 'mushroom',
    tx: 12,
    ty: 4,
    voice: 640,
    roundSize: 5,
    goal: { wpm: 20, acc: 85 },
    requires: null,
    lines: {
      locked: ['Oh! H-hi... um, have you talked to the Postmaster yet? They\'re by the post office.'],
      pre: [
        'Oh! H-hello. Are you the new courier?',
        'My letters got all mushy in the rain... um, mushier than usual.',
        'Could you retype them for me? At least {wpm} words a minute and {acc}% right... if that\'s okay.',
      ],
      prompt: 'Retype the Mushroom\'s letters?',
      fail: [
        'That\'s okay! Nobody gets it on the first try. My cousin took three tries to sprout.',
        'Come back whenever you\'re ready. I\'ll be right here. Hiding.',
      ],
      befriend: [
        'You did it! My letters look brand new!',
        'I... I think we\'re friends now. I\'ve never had a friend with ears before.',
        'The Postmaster is waiting for you. Grumpy, but nice inside. Like a walnut.',
      ],
      after: ['Hi again, {name}! Want to practice with my letters some more?'],
      practiced: ['Wow, you\'re getting so fast! I can barely see your paws move.'],
    },
  },
  {
    id: 'postmaster',
    name: 'Postmaster',
    sprite: 'postmaster',
    tx: 7,
    ty: 5,
    voice: 220,
    roundSize: 4,
    goal: { wpm: 30, acc: 90 },
    requires: 'mushroom',
    lines: {
      locked: ['What are you standing around for? The Mushroom\'s letters first. It\'s in the grove, just east of here. Hmph.'],
      pre: [
        'Not bad, courier. The Mushroom hasn\'t stopped smiling.',
        'Now for the real test: my own letters. Official business.',
        '{wpm} words a minute. {acc}% accuracy. Don\'t smudge anything.',
      ],
      prompt: 'Retype the Postmaster\'s letters?',
      fail: ['Hmph. Smudges everywhere. Try again when your paws are steadier.'],
      befriend: [
        '...Well. I\'ll be stamped. That was proper courier work.',
        'I\'ve lifted the log fence on the east road. The ghost by the pond has a stack of letters too.',
        'And {name}... thanks. Don\'t tell anyone I said that.',
      ],
      after: ['Back again? Fine. Sort a few more letters if you want the practice.'],
      practiced: ['Acceptable. More than acceptable, actually. Don\'t let it go to your head.'],
    },
    intro: [
      'Hmph. So YOU\'RE the new courier? {name}, is it?',
      'Last night\'s storm tore through the post office. Every letter in the village got soaked, scrambled and blown about.',
      'Your job is simple. Read each villager\'s ruined letters and type them out fresh. Quickly. Neatly.',
      'Folks here won\'t trust a sloppy courier. Hit their mark for speed and accuracy, and they\'ll warm up to you.',
      'Start with the Mushroom in the grove just east of here. It\'s too shy to come and ask for its own mail.',
      'Walk with the arrow keys or WASD. Talk with Z, E or Enter. Esc opens the menu. Now get moving!',
    ],
  },
  {
    id: 'ghost',
    name: 'Lantern Ghost',
    sprite: 'ghost',
    tx: 24,
    ty: 10,
    voice: 880,
    roundSize: 4,
    goal: { wpm: 40, acc: 93 },
    requires: 'postmaster',
    lines: {
      locked: ['Boo! Oh, you\'re early. The Postmaster wants to see you first!'],
      pre: [
        'Boo! ...Did that work? You didn\'t even flinch!',
        'Anyway! The storm blew my letters into the pond and now they\'re all soggy and spooky.',
        'Retype them for me? {wpm} words a minute, {acc}% right. Fair warning: I LOVE punctuation!',
      ],
      prompt: 'Retype the Lantern Ghost\'s letters?',
      fail: ['Oooh, so close! Punctuation is tricky. Even I trip over semicolons, and I don\'t have feet.'],
      befriend: [
        'Wheee! They\'re perfect! I\'m so happy I could glow brighter... oh wait, I am!',
        'I\'ll ask the frogs to fix the old bridge. The Turtle Sage lives across the river.',
        'The Sage writes long letters. Breathe slowly, {name}!',
      ],
      after: ['Hi hi! Want to type more of my letters? They\'re extra spooky today.'],
      practiced: ['Spooktacular! Flicker says your typing is very bright.'],
    },
  },
  {
    id: 'sage',
    name: 'Turtle Sage',
    sprite: 'sage',
    tx: 35,
    ty: 5,
    voice: 160,
    roundSize: 3,
    goal: { wpm: 50, acc: 95 },
    requires: 'ghost',
    lines: {
      locked: ['Ah... not yet, young one. Your path leads through the others first.'],
      pre: [
        'Ah... the young courier. The wind told me you were coming.',
        'My letters are long, and my old eyes are tired. Type them with care.',
        '{wpm} words a minute, with {acc} parts in a hundred correct. Take your time... but not too much.',
      ],
      prompt: 'Retype the Turtle Sage\'s letters?',
      fail: ['Hmm. Rushing makes ripples, and ripples blur the reflection. Breathe, and try again.'],
      befriend: [
        'Wonderful. Every word is in its place.',
        'You have delivered the last of the lost letters, {name}. The village is whole again.',
      ],
      after: ['Welcome back, {name}. A courier\'s paws stay sharp with practice. Shall we?'],
      practiced: ['Steady and swift. The river would be proud.'],
    },
  },
];

export const npcById = Object.fromEntries(NPCS.map((n) => [n.id, n]));

const DIFFICULTY = {
  gentle: { wpm: 0.7, acc: -5 },
  normal: { wpm: 1, acc: 0 },
  tough: { wpm: 1.25, acc: 2 },
};

export const DIFFICULTY_LABELS = { gentle: 'Gentle', normal: 'Normal', tough: 'Tough' };
export const DIFFICULTY_ORDER = ['gentle', 'normal', 'tough'];

export function goalFor(npc, difficulty = 'normal') {
  const d = DIFFICULTY[difficulty] || DIFFICULTY.normal;
  return {
    wpm: Math.max(5, Math.round(npc.goal.wpm * d.wpm)),
    acc: Math.min(99, Math.max(50, npc.goal.acc + d.acc)),
  };
}

/** Fill {name}/{wpm}/{acc} placeholders. */
export function fmt(text, vars) {
  return text.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}
