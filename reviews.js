// Guest reviews with Google sign-in: the reviewer's Google name is shown,
// and each Google account can leave one review (it can be edited or deleted by them).
(function () {
  const cfg = window.FIREBASE_CONFIG || {};
  const q = s => document.querySelector(s);
  const list = q('#rv-list'), form = q('#rv-form'), summary = q('#rv-summary');
  if (!list) return;

  const stars = n => '★'.repeat(n) + '☆'.repeat(5 - n);
  const ok = v => v && !String(v).startsWith('PASTE');
  const configured = window.firebase && ok(cfg.apiKey) && cfg.projectId && ok(cfg.appId);

  if (!configured) {
    list.innerHTML = '<p class="rv-empty">Guest reviews are coming soon. You can read our reviews on Google in the meantime.</p>';
    return;
  }

  firebase.initializeApp(cfg);
  const auth = firebase.auth();
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

  // ---- elements
  const authBox = q('#rv-auth'), fields = q('#rv-fields'), msg = q('#rv-msg');
  const sendBtn = q('#rv-send'), delBtn = q('#rv-del');
  let rating = 0, user = null;

  // ---- star picker
  const btns = [...document.querySelectorAll('.rv-pick button')];
  const paint = n => btns.forEach((b, i) => b.classList.toggle('on', i < n));
  btns.forEach((b, i) => {
    b.onclick = () => { rating = i + 1; paint(rating); };
    b.onmouseenter = () => paint(i + 1);
    b.onmouseleave = () => paint(rating);
  });

  // ---- Google sign in / out
  const say = (t, good) => { msg.className = 'rv-msg' + (good ? ' ok' : ''); msg.textContent = t; };
  const signIn = async () => {
    say('');
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      await auth.signInWithPopup(provider);
    } catch (e) {
      if (e.code === 'auth/popup-blocked') return auth.signInWithRedirect(provider);
      if (e.code === 'auth/popup-closed-by-user' || e.code === 'auth/cancelled-popup-request') return;
      say('Sign-in did not work. If you opened this page inside another app, please open it in Chrome or Safari.');
    }
  };

  const showSignedOut = () => {
    authBox.textContent = '';
    const p = document.createElement('p');
    p.className = 'rv-note';
    p.textContent = 'Sign in with your Google account to write a review. Your Google name will be shown, and each account can leave one review.';
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'rv-gbtn';
    b.innerHTML = '<span class="g">G</span> Sign in with Google';
    b.onclick = signIn;
    authBox.append(p, b);
    fields.hidden = true;
  };

  const showSignedIn = async u => {
    authBox.textContent = '';
    const p = document.createElement('p');
    p.className = 'rv-user';
    const strong = document.createElement('strong');
    strong.textContent = u.displayName || 'your Google account';
    const out = document.createElement('button');
    out.type = 'button'; out.className = 'rv-link'; out.textContent = 'Not you? Sign out';
    out.onclick = () => auth.signOut();
    p.append('Writing as ', strong, ' ', out);
    authBox.appendChild(p);
    fields.hidden = false;
    // load this person's existing review, if any
    rating = 0; paint(0); form.comment.value = '';
    sendBtn.textContent = 'Send review'; delBtn.hidden = true;
    try {
      const d = await col.doc(u.uid).get();
      if (d.exists) {
        const r = d.data();
        rating = r.rating; paint(rating); form.comment.value = r.comment;
        sendBtn.textContent = 'Update my review'; delBtn.hidden = false;
      }
    } catch (_) {}
  };

  auth.onAuthStateChanged(u => {
    user = u; say('');
    if (u) showSignedIn(u); else showSignedOut();
  });

  // ---- save the review (one per Google account)
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!user) return;
    const comment = form.comment.value.trim();
    if (!user.displayName) { say('Your Google account has no name. Please add a name to your Google profile first.'); return; }
    if (!rating) { say('Please choose a star rating.'); return; }
    if (comment.length < 5) { say('Please write a short comment.'); return; }
    sendBtn.disabled = true;
    try {
      await col.doc(user.uid).set({
        name: user.displayName, rating, comment,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      sendBtn.textContent = 'Update my review'; delBtn.hidden = false;
      say('Thank you! Your review is on the website.', true);
    } catch (err) {
      say('Sorry, we could not save your review. Please try again.');
    }
    sendBtn.disabled = false;
  });

  delBtn.addEventListener('click', async () => {
    if (!user || !confirm('Delete your review?')) return;
    try {
      await col.doc(user.uid).delete();
      rating = 0; paint(0); form.comment.value = '';
      sendBtn.textContent = 'Send review'; delBtn.hidden = true;
      say('Your review was deleted.', true);
    } catch (err) { say('Could not delete your review. Please try again.'); }
  });
})();