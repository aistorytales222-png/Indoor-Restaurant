const $ = s => document.querySelector(s);
$('#yr').textContent = new Date().getFullYear();

// navbar: transparent on hero, solid after scroll; mobile toggle
addEventListener('scroll', () => $('#nav').classList.toggle('solid', scrollY > 60));
$('#burger').onclick = () => $('#links').classList.toggle('open');
$('#links').onclick = () => $('#links').classList.remove('open');

// scroll reveal
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .12 });
document.querySelectorAll('.sec h2, .lead, figure').forEach(el => {
  el.classList.add('reveal');
  io.observe(el);
});

// MENU: replace the dishes below with the real menu from the owners.
// price: use a number like 350, or leave '' to hide the price.
// desc:  optional, leave '' to hide it.
const menu = {
  'Tharu & Nepali': [
    { name: 'Duck Choila',        price: '', desc: '' },
    { name: 'Ghungi',             price: '', desc: '' },
    { name: 'Mutton Bhutuwa',     price: '', desc: '' },
    { name: 'Indoor Special Aalu', price: '', desc: '' }
  ],
  'Thali & Rice': [
    { name: 'Nepali Khana Set',   price: '', desc: '' },
    { name: 'Dal Bhat',           price: '', desc: '' }
  ],
  'Noodles & Snacks': [
    { name: 'Veg Chow Mein',      price: '', desc: '' }
  ],
  'Drinks': [
    { name: 'Masala Chai',        price: '', desc: '' }
  ]
};

const esc = t => String(t).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
$('#menu-list').innerHTML = Object.entries(menu).map(([cat, items]) =>
  `<div class="menu-cat"><h3>${esc(cat)}</h3>` +
  items.map(d =>
    `<div class="menu-item"><div><h4>${esc(d.name)}</h4>` +
    (d.desc ? `<p>${esc(d.desc)}</p>` : '') + `</div>` +
    (d.price !== '' ? `<span class="price">Rs ${esc(d.price)}</span>` : '') +
    `</div>`).join('') + `</div>`).join('');

// hero: drifting lantern lights
const fl = document.createElement('div');
fl.className = 'fireflies';
fl.setAttribute('aria-hidden', 'true');
for (let i = 0; i < 26; i++) {
  const f = document.createElement('span');
  f.className = 'fly';
  const r = (a, b) => a + Math.random() * (b - a);
  f.style.cssText = `left:${r(3,97)}%;top:${r(8,92)}%;--s:${r(3,7)}px;--d:${r(7,14)}s;--delay:-${r(0,12)}s;--x:${r(-70,70)}px;--y:${r(-90,-20)}px`;
  fl.appendChild(f);
}
$('.hero-bg').after(fl);