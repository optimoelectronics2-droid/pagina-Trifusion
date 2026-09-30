// Genera index.html sin Python (mismo resultado que tools/build.py).
// Uso: node tools/build.js  (desde la carpeta del proyecto)
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const load = (n) => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', n + '.json'), 'utf8'));
const site = load('site'), categories = load('categories'), products = load('products');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Dimensiones conocidas (las lee build.py con Pillow; aquí mapa fijo para no depender de nada)
const SIZES = {
  'assets/img/logo.png': [50, 44],
  'assets/img/hero/hero-1.webp': [1000, 558],
  'assets/img/hero/hero-2.webp': [1000, 558],
  'assets/img/hero/hero-3.webp': [1000, 558],
  'assets/img/map.svg': [600, 380],
  'assets/img/products/curvo.webp': [640, 506],
  'assets/img/products/aoc24.webp': [640, 518],
  'assets/img/products/gaming.webp': [640, 370],
  'assets/img/products/mag.webp': [578, 640],
  'assets/img/products/diseno.webp': [638, 640],
  'assets/img/products/portatil.webp': [640, 418],
  'assets/img/products/pc.webp': [483, 640],
  'assets/img/products/combo.webp': [640, 325],
  'assets/img/products/control.webp': [640, 494],
  'assets/img/products/inalam.webp': [640, 373],
  'assets/img/products/mother.webp': [640, 412],
  'assets/img/products/video.webp': [640, 414],
  'assets/img/products/panel.webp': [638, 531],
  'assets/img/products/camara.webp': [640, 261],
  'assets/img/products/impresora.webp': [840, 630],
  'assets/img/products/ups.webp': [840, 630],
  'assets/img/products/telefonos.webp': [640, 457],
  'assets/img/products/mesa-desk.jpg': [720, 405],
  'assets/img/products/laptop.jpg': [720, 405],
  'assets/img/products/laptops.jpg': [1920, 1156],
  'assets/video/posters/mesa.jpg': [720, 1280],
  'assets/video/posters/destacado.jpg': [720, 1280],
  'assets/video/posters/bocina.jpg': [720, 1280],
  'assets/video/posters/impresora.jpg': [720, 1280],
  'assets/video/posters/telefono.jpg': [720, 1280],
  'assets/video/posters/monitores.jpg': [720, 1280],
};
function img(src, alt, lazy = true, extra = '', blend = false) {
  if (blend) extra += ' class="blend"';
  const [w, h] = SIZES[src] || [800, 600];
  const loading = lazy ? 'loading="lazy" decoding="async"' : 'fetchpriority="high"';
  return `<img src="${src}" alt="${esc(alt)}" width="${w}" height="${h}" ${loading}${extra}>`;
}
const wa = (text = '') => 'https://wa.me/' + site.whatsapp + (text ? '?text=' + encodeURIComponent(text) : '');

const slides = site.hero.slides;
const heroSlides = slides.map((s, i) =>
  '        ' + img(s.image, s.alt, i > 0, ` class="hero-slide${i === 0 ? ' on' : ''}" data-label="${esc(s.label)}"`)).join('\n');
const heroTicks = slides.map((_, i) => `<i${i === 0 ? ' class=on' : ''}></i>`).join('');

const cats = categories.map(c =>
`        <a class="cat frame rv" href="${c.url}"><div class="in">
          <div class="pic plate${c.photo ? ' photo' : ''}">${img(c.image, c.alt)}</div>
          <div class="tx"><b>${esc(c.name)}</b><small>${esc(c.description)}</small><span class="go">${esc(c.go || 'Ver Catálogo')}</span></div>
        </div></a>`).join('\n');

const cards = products.map(p =>
`        <article class="card">
          <div class="plate">${img(p.image, p.name, true, '', !!p.blend)}</div>
          <div class="tx"><div><b>${esc(p.name)}</b><small>${esc(p.category)}</small></div>
            <a href="${wa(site.quoteMessage + p.name)}" aria-label="Consultar ${esc(p.name)} por WhatsApp">Consultar</a></div>
        </article>`).join('\n');

const vids = (site.videos || []).map(v =>
`        <article class="video-card rv" id="${v.id}">
          <div class="vwrap"><video controls preload="metadata" playsinline src="${v.file}" poster="${v.poster || ''}"></video></div>
          <div class="tx"><b>${esc(v.title)}</b><small>${esc(v.desc)}</small>
            <div class="row">
              <a class="btn" href="${v.instagram}">Ver en Instagram</a>
              <a class="btn btn--ghost" href="${wa(site.quoteMessage + v.title)}">Pedir info</a>
            </div></div>
        </article>`).join('\n');

const about = site.about || {};
const aboutPoints = (about.points || []).map(p => `          <li>${esc(p)}</li>`).join('\n');

const r = site.reviews;
const stars = Array.from({length: 5}, (_, i) => {
  const pct = Math.max(0, Math.min(1, r.rating - i)) * 100;
  return `<span class="star" style="--p:${parseFloat(pct.toFixed(2))}%">★</span>`;
}).join('');
const hours = site.hours.map(h => `<tr data-days="${h.days.join(',')}"><td>${esc(h.label)}</td><td>${esc(h.value)}</td></tr>`).join('');

const [lw, lh] = SIZES['assets/img/logo.png'];
const vals = {
  brand: site.brand, wa: wa(),
  headline: site.hero.headline, sub: site.hero.sub || '',
  about_title: about.title || '', about_text: about.text || '', about_points: aboutPoints,
  logo_w: Math.round(lw * 60 / lh), logo_h: 60,
  hero_slides: heroSlides, hero_ticks: heroTicks, hero_first: slides[0].label,
  categories: cats, products: cards, videos: vids,
  ig_handle: site.instagram.handle, ig_url: site.instagram.url,
  rating: r.rating.toFixed(1), review_count: r.count, stars, hours,
  phone_href: site.phone.href, phone_label: site.phone.label,
};
let out = fs.readFileSync(path.join(ROOT, 'src', 'index.template.html'), 'utf8');
for (const [k, v] of Object.entries(vals)) out = out.split('{{' + k + '}}').join(String(v));
if (out.includes('{{')) { console.error('Quedó un marcador sin reemplazar'); process.exit(1); }
fs.writeFileSync(path.join(ROOT, 'index.html'), out);
console.log(`index.html generado (${Math.round(out.length/1024)} KB) · ${categories.length} categorías · ${products.length} productos · ${(site.videos||[]).length} videos`);
