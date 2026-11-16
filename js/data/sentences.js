// Original letter lines, one set per villager, ordered by difficulty.
// Each set leans on a different skill: rhythm, capitals & numbers, punctuation, and stamina.
// Only use characters the bitmap font can draw (tests/content.test.js checks this).

export const SENTENCES = {
  // Gentle but literary: full sentences with commas, semicolons and the odd apostrophe.
  mushroom: [
    'I read by candlelight beneath my cap, though the wax drips onto my spores.',
    'Dear Diary: the moss is damp, the moon is thin, and I am quietly content.',
    'Autumn arrived early this year; the beetles call it an omen, but I doubt them.',
    'I have pressed seventeen fallen leaves between the pages of my favorite book.',
    'Please return my borrowed lantern before the frost settles over the hollow.',
    'Some nights I wonder whether the stars are lonely, or merely very far away.',
    'My grandmother kept a journal for ninety-two years; I have kept mine for three.',
    'The old owl lectures on philosophy every Thursday, and I never miss a word.',
    'I\'ve decided to learn Latin, or at least the parts that sound like rain.',
    'Forgive the ink stains; I wrote this letter while the thunder was rolling.',
    'There is a quiet sort of courage in reading alone in the dark, isn\'t there?',
    'Tea, two blankets, and an unread novel: that is my idea of a perfect evening.',
  ],
  // Official correspondence: capitals, numbers, dates, abbreviations and brackets.
  postmaster: [
    'To the Head Office: the storm of October 3rd destroyed 412 stamps and one umbrella.',
    'Per Regulation 7(b), every parcel must be weighed, wrapped, and wax-sealed by dusk.',
    'I have served this village for forty-one years; I expect a pension, not pity.',
    'Kindly inform the Ravens\' Society that their correspondence is overdue. Again.',
    'Enclosed: one ledger, one complaint, and a slightly damp apology from the frogs.',
    'Postage has risen to 9 copper pieces; I did not set the price, so stop glaring.',
    'A courier who smudges the ink smudges the reputation of the entire postal service.',
    'Re: missing letters. Item 1: found. Item 2: soggy. Items 3 through 6: lost.',
    'The archive\'s oldest envelope is dated 1789; nobody has dared to open it since.',
    'I am not sentimental; I simply keep every letter I have ever received, alphabetized.',
  ],
  // Punctuation gauntlet: quotes, parentheses, dashes, colons, times and lists.
  ghost: [
    'Boo! (That\'s Old Spectral for "good evening"; I\'ve been studying dead languages!)',
    'The library is haunted - by me, obviously - but only between midnight and 3:15 a.m.',
    'I once read "Ninety Nights in a Cold Tower" in one sitting; I didn\'t blink once!',
    'Dear Moth: stop circling my lantern; it\'s rude, it\'s dizzying, and Flicker hates it.',
    'Are ghosts allowed library cards? I\'ve asked twice; the librarian fainted both times.',
    'My epitaph reads: "Here lies Wisp, who was curious." I think that\'s rather lovely!',
    'P.S. If you hear whispering in the reading room, it\'s me; I\'m practicing sonnets.',
    'Candles: 14. Books: 237. Friends: 2 (Flicker counts!). Regrets: absolutely none.',
    'Is it "haunting" if you\'re simply too shy to leave? Asking for myself, obviously.',
    'I\'ve hidden a riddle in chapter III of every book on the east shelf; good luck!',
  ],
  // Long, winding thoughts: stamina, rich vocabulary and careful punctuation.
  sage: [
    'In my youth, I believed wisdom was a destination; now I suspect it is merely the habit of walking slowly enough to notice the road.',
    'Every library is a cemetery of voices that refuse to stay quiet. Open any book, and someone long gone will clear their throat and begin.',
    'The candle does not resent the darkness, little one; it simply burns, steadily and without complaint, until the morning makes it unnecessary.',
    'I have written 1,206 letters in my lifetime. Perhaps a third were answered, and every unanswered one taught me something about patience.',
    'Do not mistake haste for diligence: a scholar who races through a manuscript arrives at the final page knowing nothing but its numbers.',
    'Memory is a palimpsest; we scrape away the old words to write new ones, yet the faint ghost of every sentence lingers beneath the ink.',
  ],
};
