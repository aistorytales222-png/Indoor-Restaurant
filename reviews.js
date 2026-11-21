// Guest reviews: shows all reviews and lets visitors write one (live instantly).
// Only change the two lines marked PASTE below (apiKey and appId from Firebase).
(function () {
  const FIREBASE_CONFIG = {
    apiKey: "AIzaSyAwLD2S3osrR1OWvJgKoJF7PXlM8XXZjxM",
    authDomain: 'indoor-restaurant.firebaseapp.com',
    projectId: 'indoor-restaurant',
    appId: "1:612302827921:web:1a9c39fd1118049514aa30"
  };

  const q = s => document.querySelector(s);
  const list = q('#rv-list'), form = q('#rv-form'), summary = q('#rv-summary');
  if (!list) return;

  const stars = n => '★'.repeat(n) + '☆'.repeat(5 - n);
  const configured = window.firebase && FIREBASE_CONFIG.projectId &&
    FIREBASE_CONFIG.apiKey && !FIREBASE_CONFIG.apiKey.startsWith('PASTE') &&
    FIREBASE_CONFIG.appId && !FIREBASE_CONFIG.appId.startsWith('PASTE');

  if (!configured) {
    list.innerHTML = '<p class="rv-empty">Guest reviews are coming soon. You can read our reviews on Google in the meantime.</p>';
    return;
  }

  firebase.initializeApp(FIREBASE_CONFIG);
  const col = firebase.firestore().collection('reviews');
  form.hidden = false;

  // ---- show reviews
  const draw = docs => {
    const items = docs.map(d => d.data())
      .sort((a, b) => (b.createdAt?.seconds ?? 9e12) - (a.createdAt?.seconds ?? 9e12));
    list.textContent = '';
    if (!items.length) {
      list.innerHTML = '<p class="rv-empty">No reviews yet. Be the first to write one!</p>';
      summary.textContent = 'What our guests say.';
      return;
    }
    const avg = items.reduce((s, r) => s + r.rating, 0) / items.length;
    summary.textContent = `${avg.toFixed(1)} out of 5, from ${items.length} guest review${items.length > 1 ? 's' : ''}.`;
    items.forEach(r => {
      const card = document.createElement('article');
      card.className = 'rv-card';
      const top = document.createElement('div');
      top.className = 'rv-top';
      const st = document.createElement('span');
      st.className = 'rv-stars';
      st.textContent = stars(r.rating);
      st.setAttribute('aria-label', r.rating + ' out of 5 stars');
      const nm = document.createElement('strong');
      nm.textContent = r.name;
      top.append(st, nm);
      const p = document.createElement('p');
      p.textContent = r.comment;
      const dt = document.createElement('small');
      dt.textContent = r.createdAt?.toDate
        ? r.createdAt.toDate().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : '';
      card.append(top, p, dt);
      list.appendChild(card);
    });
  };
  col.orderBy('createdAt', 'desc').limit(50).onSnapshot(s => draw(s.docs),
    () => { list.innerHTML = '<p class="rv-empty">Reviews could not be loaded right now.</p>'; });

  // ---- star picker
  let rating = 0;
  const btns = [...document.querySelectorAll('.rv-pick button')];
  const paint = n => btns.forEach((b, i) => b.classList.toggle('on', i < n));
  btns.forEach((b, i) => {
    b.onclick = () => { rating = i + 1; paint(rating); };
    b.onmouseenter = () => paint(i + 1);
    b.onmouseleave = () => paint(rating);
  });

  // ---- send a new review (shows on the site straight away)
  const msg = q('#rv-msg');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    msg.className = 'rv-msg';
    const name = form.name.value.trim(), comment = form.comment.value.trim();
    if (form.website.value) return; // spam trap
    if (!rating) { msg.textContent = 'Please choose a star rating.'; return; }
    if (!name || comment.length < 5) { msg.textContent = 'Please add your name and a short comment.'; return; }
    try {
      const last = +localStorage.getItem('rvLast') || 0;
      if (Date.now() - last < 300000) { msg.textContent = 'You already sent a review. Please try again in a few minutes.'; return; }
    } catch (_) {}
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true;
    try {
      await col.add({
        name, rating, comment,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      try { localStorage.setItem('rvLast', Date.now()); } catch (_) {}
      form.reset(); rating = 0; paint(0);
      msg.className = 'rv-msg ok';
      msg.textContent = 'Thank you! Your review is now on the website.';
    } catch (err) {
      msg.textContent = 'Sorry, we could not send your review. Please try again.';
    }
    btn.disabled = false;
  });
})();