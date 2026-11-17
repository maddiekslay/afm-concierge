// GiftSpark chatbot — a self-contained widget used on every page
(function () {
  const html = `
    <button id="chat-toggle" aria-label="Open chat">💬</button>
    <div id="chat-box" role="dialog" aria-label="GiftSpark chat">
      <div class="chat-head">
        <div><strong>Sparky 🎁</strong><small>GiftSpark gift assistant</small></div>
        <button id="chat-close" aria-label="Close chat">✕</button>
      </div>
      <div id="chat-msgs"></div>
      <div class="chips" id="chat-chips"></div>
      <form class="chat-input" id="chat-form">
        <input id="chat-in" placeholder="Ask me about gifts..." autocomplete="off" />
        <button type="submit">Send</button>
      </form>
    </div>`;
  document.body.insertAdjacentHTML('beforeend', html);

  const box = document.getElementById('chat-box');
  const msgs = document.getElementById('chat-msgs');
  const input = document.getElementById('chat-in');
  const chips = document.getElementById('chat-chips');
  let greeted = false;

  const ideas = {
    mom: ['a personalized photo book', 'a cozy spa-day kit', 'a monthly flower subscription'],
    dad: ['a smart grilling thermometer', 'a custom engraved watch', 'a golf lesson voucher'],
    partner: ['a surprise date-night box', 'a star map of the night you met', 'a couples cooking class'],
    friend: ['a mini instant camera', 'a funny custom mug', 'concert tickets for their favorite band'],
    coworker: ['a desk succulent', 'a gourmet coffee sampler', 'a nice notebook and pen set'],
    kid: ['a build-your-own robot kit', 'an art supply set', 'a glow-in-the-dark star projector'],
    teen: ['wireless earbuds', 'a LED strip light kit', 'a gift card to their favorite store'],
    tech: ['a smart home speaker', 'a portable charger', 'noise-cancelling headphones'],
    book: ['a Kindle', 'a book subscription box', 'a personalized library stamp'],
    cook: ['an herb garden kit', 'a premium chef knife', 'a spice sampler from around the world'],
    travel: ['a scratch-off world map', 'a packing cube set', 'a smart luggage tracker'],
    fitness: ['a yoga mat and block set', 'a smart water bottle', 'a massage gun'],
    gamer: ['a new controller', 'an RGB mouse pad', 'a gaming gift card'],
  };

  const rules = [
    { k: ['hi', 'hello', 'hey', 'yo'], r: () => "Hi there! 👋 Tell me who you're shopping for (like mom, dad, partner, friend) and what they're into." },
    { k: ['price', 'cost', 'pricing', 'plan', 'subscription', 'premium'], r: () => 'GiftSpark is <b>free</b> to try! <b>Spark+</b> is $4.99/month for unlimited recommendations and reminders, and <b>Business</b> is $29/month for corporate gifting teams.' },
    { k: ['how', 'work'], r: () => 'Easy: 1) Tell us about the person, 2) our AI matches their interests, budget, and the occasion, 3) you get a shortlist of gift ideas with links. Takes under a minute!' },
    { k: ['budget', 'cheap', 'under', '$'], r: () => 'Budget friendly ideas under $25: a custom mug, a desk plant, gourmet snacks, a cute phone stand, or a handwritten letter with a framed photo 💌' },
    { k: ['birthday'], r: () => 'Birthday ideas 🎂: an experience (concert, class), something personalized, or a gift subscription so the fun lasts all year.' },
    { k: ['christmas', 'holiday'], r: () => 'For the holidays 🎄: cozy blankets, personalized ornaments, hot cocoa kits, and gift boxes are always winners.' },
    { k: ['anniversary', 'valentine'], r: () => 'Romantic picks ❤️: a star map of a special night, a weekend getaway, a custom song, or a memory jar with notes.' },
    { k: ['graduat'], r: () => 'Graduation 🎓: a quality backpack or work bag, a personalized pen, a frame for the diploma, or cash in a creative card.' },
    { k: ['last minute', 'last-minute', 'today', 'urgent'], r: () => 'No stress ⏰: e-gift cards, digital subscriptions (music, streaming, classes), or a printable "experience voucher" you can make right now.' },
    { k: ['contact', 'email', 'support', 'help'], r: () => 'You can reach our team at hello@giftspark.example, or just keep chatting with me!' },
    { k: ['quiz'], r: () => 'Try the Gift Quiz on the home page! Answer 3 quick questions and I will reveal a personalized gift match 🎁' },
    { k: ['thank', 'thanks', 'thx'], r: () => 'You are welcome! Happy gifting 🎁✨' },
    { k: ['who are you', 'what are you', 'your name'], r: () => "I'm Sparky, GiftSpark's AI gift assistant. I help you find the perfect present in seconds." },
  ];

  const synonyms = {
    mom: ['mom', 'mother', 'mum'], dad: ['dad', 'father'], partner: ['partner', 'boyfriend', 'girlfriend', 'wife', 'husband', 'spouse'],
    friend: ['friend', 'bestie', 'bff'], coworker: ['coworker', 'boss', 'colleague', 'team'], kid: ['kid', 'child', 'son', 'daughter'],
    teen: ['teen', 'teenager'], tech: ['tech', 'gadget', 'computer'], book: ['book', 'read'], cook: ['cook', 'chef', 'food', 'bake'],
    travel: ['travel', 'trip'], fitness: ['fitness', 'gym', 'workout', 'yoga', 'run'], gamer: ['game', 'gamer', 'gaming'],
  };

  function reply(text) {
    const t = text.toLowerCase();
    const hits = [];
    for (const [key, words] of Object.entries(synonyms)) if (words.some(w => t.includes(w))) hits.push(key);
    if (hits.length) {
      const picks = hits.flatMap(h => ideas[h]).slice(0, 4);
      return `Great choice! Here are some ideas 🎁<br>• ${picks.join('<br>• ')}<br>Want ideas for a specific budget or occasion?`;
    }
    for (const rule of rules) if (rule.k.some(k => t.includes(k))) return rule.r();
    return "Hmm, I'm not sure about that one 🤔. Try telling me <b>who</b> the gift is for (like \"my dad\") or what they love (like \"gaming\" or \"cooking\").";
  }

  function add(text, who) {
    const d = document.createElement('div');
    d.className = 'msg ' + who;
    d.innerHTML = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
  }

  function send(text) {
    if (!text.trim()) return;
    const safe = text.replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
    add(safe, 'user');
    const typing = add('Sparky is typing...', 'bot typing');
    setTimeout(() => { typing.remove(); add(reply(text), 'bot'); }, 700);
  }

  ['Gift for mom', 'Under $25', 'How does it work?', 'Pricing'].forEach(c => {
    const b = document.createElement('button');
    b.textContent = c;
    b.onclick = () => send(c);
    chips.appendChild(b);
  });

  function open() {
    box.classList.add('open');
    if (!greeted) { add("Hi! I'm Sparky 🎁 Who are you shopping for today?", 'bot'); greeted = true; }
    input.focus();
  }
  document.getElementById('chat-toggle').onclick = () => box.classList.contains('open') ? box.classList.remove('open') : open();
  document.getElementById('chat-close').onclick = () => box.classList.remove('open');
  document.getElementById('chat-form').onsubmit = e => { e.preventDefault(); send(input.value); input.value = ''; };
})();
