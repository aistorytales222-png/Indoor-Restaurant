const $ = s => document.querySelector(s);
$('#yr').textContent = new Date().getFullYear();

// navbar: transparent on hero, solid after scroll
addEventListener('scroll', () => $('#nav').classList.toggle('solid', scrollY > 60));

// scroll reveal
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .12 });
document.querySelectorAll('.sec h2, .lead, figure').forEach(el => {
  el.classList.add('reveal');
  io.observe(el);
});

// MENU: edit dishes here. price = text shown after "Rs" (leave '' to hide). desc is optional.
const menu = [
  { name: 'Non-Veg Specials', items: [
    { name: 'G.O.A.T.E.D Duck Chhoila', price: '600' },
    { name: 'Duck Gravy', price: '600' },
    { name: 'Duck Bhutuwa', price: '600' },
    { name: 'Local Chicken Gravy', price: '600' },
    { name: 'Local Chicken Bhutuwa', price: '600' },
    { name: 'Mutton Gravy', desc: 'Khasi / Boka', price: '600' },
    { name: 'Mutton Bhutuwa', desc: 'Nepali style', price: '600' },
    { name: 'Fish Fried', price: '550' },
    { name: 'Fish Gravy', price: '550' },
    { name: 'Jhinge Machha', desc: 'Prawn, seasonal', price: '650' },
    { name: 'Jhinge-Goyera Mix', desc: 'Seasonal', price: '650' },
    { name: 'Chicken Gravy', price: '400' },
    { name: 'Chicken Fried', price: '400' },
    { name: 'Chicken Chilly', price: '450' },
    { name: 'Chicken Khaja Set', price: '400' },
    { name: 'Ghungi', price: '200' }
  ]},
  { name: 'Vegetarian', items: [
    { name: 'Indoor Special Aalu', price: '200' },
    { name: 'Aalu Sadheko', price: '200' },
    { name: 'Mushroom Chhoila', price: '350' },
    { name: 'Mushroom Pakauda', price: '350' },
    { name: 'Paneer Pakauda', price: '400' },
    { name: 'Paneer Chilly', price: '430' },
    { name: 'Peanuts Sadheko', price: '200' },
    { name: 'Bhatmas Sadheko', price: '200' },
    { name: 'Mix-Wai Wai Sadheko', price: '200' },
    { name: 'Chips Chilly', price: '300' },
    { name: 'Finger Chips', price: '250' },
    { name: 'Veg Khaja Set', price: '260' }
  ]},
  { name: 'Nepali Khana Sets', note: 'Long-grain basmati rice, seasonal greens, potato curry, stone-ground chutney, homemade pickle, fresh salad and lentil soup. Made to order, about 15 to 20 minutes.', items: [
    { name: 'Veg Khana Set', price: '330' },
    { name: 'Chicken Khana Set', price: '480' },
    { name: 'Fish Khana Set', price: '580' },
    { name: 'Duck Khana Set', price: '600' },
    { name: 'Mutton Khana Set', price: '600' },
    { name: 'Local Chicken Khana Set', price: '600' }
  ]},
  { name: 'Mo:mo & Sausage', items: [
    { name: 'Veg Mo:mo Steam', price: '150' },
    { name: 'Veg Mo:mo Fried', price: '200' },
    { name: "Veg C' Mo:mo", price: '250' },
    { name: 'Chicken Mo:mo Steam', price: '200' },
    { name: 'Chicken Mo:mo Fried', price: '250' },
    { name: "Chicken C' Mo:mo", price: '300' },
    { name: 'Chicken Sausage', desc: '2 pieces', price: '160' },
    { name: 'Chicken Sausage', desc: '6 pieces', price: '320' }
  ]},
  { name: 'Fried Rice & Salads', items: [
    { name: 'Veg Fried Rice', price: '230' },
    { name: 'Egg Fried Rice', price: '290' },
    { name: 'Chicken Fried Rice', price: '350' },
    { name: 'Mixed Fried Rice', price: '400' },
    { name: 'Green Salad', price: '300' },
    { name: 'Fruits Salad', price: '450' },
    { name: 'Mixed Salad', price: '500' }
  ]},
  { name: 'Fitness Freak', items: [
    { name: 'Boiled Egg', price: '100' },
    { name: 'Plain Omelette', price: '100' },
    { name: 'Poached Egg', price: '100' },
    { name: 'Masala Omelette', price: '150' },
    { name: 'Chicken Breast', desc: 'Boiled / steam', price: '300' }
  ]},
  { name: 'Breakfast & Tea', items: [
    { name: 'Breakfast Set', desc: 'Toast with butter, jam, choice of eggs, potatoes, banana, tea or coffee', price: '380' },
    { name: 'Black Tea', price: '35' },
    { name: 'Ginger Tea', price: '40' },
    { name: 'Lemon Tea', price: '40' },
    { name: 'Hot Lemon with Honey', price: '60' },
    { name: 'Ginger Lemon with Honey', price: '90' },
    { name: 'Green Tea', price: '50' },
    { name: 'Milk Tea', price: '50' },
    { name: 'Special Masala Tea', price: '80' },
    { name: 'Black Coffee', price: '80' }
  ]},
  { name: 'Soft Drinks', items: [
    { name: 'Mineral Water', price: '30' },
    { name: 'Coke, Fanta, Sprite', price: '100' },
    { name: 'Fresh Lemon Soda', price: '100' },
    { name: 'Masala Sprite', price: '100' },
    { name: 'Plain Lassi', price: '120' },
    { name: 'Fresh Banana Lassi', price: '200' },
    { name: 'Red Bull', desc: 'Yellow', price: '200' },
    { name: 'Red Bull', desc: 'Blue', price: '300' },
    { name: 'Coke, Fanta, Sprite', desc: '1.5 L', price: '350' },
    { name: 'Real Juice', desc: '1 L', price: '380' }
  ]},
  { name: 'Bulk Orders', note: 'Main dishes in large quantities. Prices shown as Quarter · Half · Full.', items: [
    { name: 'Local Duck', desc: 'Chhoila / curry gravy', price: '1,100 · 2,000 · 4,000' },
    { name: 'Local Chicken', price: '1,000 · 1,900 · 3,500' },
    { name: 'Mutton', desc: 'Khasi / Boka, per KG', price: '2,200' },
    { name: 'Local Fish', desc: 'Per KG', price: '2,000' },
    { name: 'Farm-Fresh Chicken BBQ', desc: 'Per KG', price: '1,400' },
    { name: 'Traditional Ghungi', desc: 'Per plate', price: '200' },
    { name: 'Jhinge-Goyera Mix', desc: 'Seasonal, per plate', price: '650' },
    { name: 'Jhinge Machha', desc: 'Prawn, seasonal, per plate', price: '650' }
  ]},
  { name: 'Spirits', note: 'Prices shown as Quarter · Half · Full.', items: [
    { name: '8848 Vodka', price: '850 · 1,700 · 3,400' },
    { name: 'Yeti Vodka', price: '850 · 1,700 · 3,400' },
    { name: 'Khukuri Rum', price: '850 · 1,700 · 3,400' },
    { name: 'Signature', desc: 'Green', price: '1,000 · 1,900 · 3,700' },
    { name: 'Signature', desc: 'Red', price: '1,050 · 2,100 · 4,000' },
    { name: "Gurkha's & Guns", price: '1,050 · 2,000 · 4,000' },
    { name: 'Old Durbar', desc: 'Red', price: '1,050 · 2,100 · 4,000' },
    { name: 'Old Durbar', desc: 'Black', price: '1,300 · 2,600 · 5,000' }
  ]},
  { name: 'Chilled Beers', items: [
    { name: 'Gorkha Strong', price: '530' },
    { name: 'Barah Singhe', desc: 'Pilsner', price: '550' },
    { name: 'Tuborg', price: '620' },
    { name: 'Carlsberg', price: '720' }
  ]}
];

const esc = t => String(t).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const tabs = $('#menu-tabs'), panel = $('#menu-list');
const showMenu = i => {
  [...tabs.children].forEach((b, n) => { b.classList.toggle('on', n === i); b.setAttribute('aria-pressed', n === i); });
  const c = menu[i];
  panel.innerHTML = `<div class="menu-cat"><h3>${esc(c.name)}</h3>` +
    (c.note ? `<p class="menu-note">${esc(c.note)}</p>` : '') +
    `<div class="menu-items">` +
    c.items.map(d =>
      `<div class="menu-item"><div><h4>${esc(d.name)}</h4>` +
      (d.desc ? `<p>${esc(d.desc)}</p>` : '') + `</div>` +
      (d.price ? `<span class="price">Rs ${esc(d.price)}</span>` : '') + `</div>`).join('') +
    `</div></div>`;
};
tabs.innerHTML = menu.map((c, i) => `<button type="button">${esc(c.name)}</button>`).join('');
tabs.onclick = e => { const i = [...tabs.children].indexOf(e.target.closest('button')); if (i > -1) showMenu(i); };
showMenu(0);

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

// hide any photo that is missing, so no broken-image boxes show
const dropBroken = img => {
  const fig = img.closest('figure');
  if (fig) fig.remove();
  const g = $('.gallery');
  if (g && !g.querySelector('figure')) {
    $('#garden').style.display = 'none';
    const link = document.querySelector('#links a[href="#garden"]');
    if (link) link.style.display = 'none';
  }
};
document.querySelectorAll('figure img').forEach(img => {
  if (img.complete && img.naturalWidth === 0) dropBroken(img);
  else img.addEventListener('error', () => dropBroken(img));
});