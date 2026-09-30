#!/usr/bin/env python3
"""Genera index.html a partir de src/index.template.html y los JSON de data/.
Uso:  python3 tools/build.py      (desde la carpeta del proyecto)
Página de presentación Trifusion: sin precios, con videos locales + Instagram."""
import json, html
from pathlib import Path
from urllib.parse import quote
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
load = lambda n: json.loads((ROOT / 'data' / f'{n}.json').read_text(encoding='utf-8'))
site, categories, products = load('site'), load('categories'), load('products')
esc = html.escape

def img(src, alt, lazy=True, extra='', blend=False):
    extra += ' class="blend"' if blend else ''
    w, h = Image.open(ROOT / src).size
    loading = 'loading="lazy" decoding="async"' if lazy else 'fetchpriority="high"'
    return f'<img src="{src}" alt="{esc(alt)}" width="{w}" height="{h}" {loading}{extra}>'

wa = lambda text='': f"https://wa.me/{site['whatsapp']}" + (f'?text={quote(text)}' if text else '')

slides = site['hero']['slides']
hero_slides = '\n'.join(
    '        ' + img(s['image'], s['alt'], lazy=i > 0, extra=f' class="hero-slide{" on" if i == 0 else ""}" data-label="{esc(s["label"])}"')
    for i, s in enumerate(slides))
hero_ticks = ''.join(f'<i{" class=on" if i == 0 else ""}></i>' for i in range(len(slides)))

cats = '\n'.join(f'''        <a class="cat frame rv" href="{c['url']}"><div class="in">
          <div class="pic plate{' photo' if c.get('photo') else ''}">{img(c['image'], c['alt'])}</div>
          <div class="tx"><b>{esc(c['name'])}</b><small>{esc(c['description'])}</small><span class="go">{esc(c.get('go', 'Ver Catálogo'))}</span></div>
        </div></a>''' for c in categories)

cards = '\n'.join(f'''        <article class="card">
          <div class="plate">{img(p['image'], p['name'], blend=p.get('blend', False))}</div>
          <div class="tx"><div><b>{esc(p['name'])}</b><small>{esc(p['category'])}</small></div>
            <a href="{wa(site['quoteMessage'] + p['name'])}" aria-label="Consultar {esc(p['name'])} por WhatsApp">Consultar</a></div>
        </article>''' for p in products)

vids = '\n'.join(f'''        <article class="video-card rv" id="{v['id']}">
          <div class="vwrap"><video controls preload="metadata" playsinline src="{v['file']}" poster="{v.get('poster', '')}"></video></div>
          <div class="tx"><b>{esc(v['title'])}</b><small>{esc(v['desc'])}</small>
            <div class="row">
              <a class="btn" href="{v['instagram']}">Ver en Instagram</a>
              <a class="btn btn--ghost" href="{wa(site['quoteMessage'] + v['title'])}">Pedir info</a>
            </div></div>
        </article>''' for v in site.get('videos', []))

about = site.get('about', {})
about_points = '\n'.join(f'          <li>{esc(p)}</li>' for p in about.get('points', []))

r = site['reviews']
stars = ''.join(f'<span class="star" style="--p:{max(0, min(1, r["rating"] - i)) * 100:g}%">★</span>' for i in range(5))
hours = ''.join(f'<tr data-days="{",".join(map(str, h["days"]))}"><td>{esc(h["label"])}</td><td>{esc(h["value"])}</td></tr>' for h in site['hours'])

lw, lh = Image.open(ROOT / 'assets/img/logo.png').size
vals = {
    'brand': site['brand'], 'wa': wa(),
    'headline': site['hero']['headline'], 'sub': site['hero'].get('sub', ''),
    'about_title': about.get('title', ''), 'about_text': about.get('text', ''),
    'about_points': about_points,
    'logo_w': round(lw * 60 / lh), 'logo_h': 60,
    'hero_slides': hero_slides, 'hero_ticks': hero_ticks, 'hero_first': slides[0]['label'],
    'categories': cats, 'products': cards, 'videos': vids,
    'ig_handle': site['instagram']['handle'], 'ig_url': site['instagram']['url'],
    'rating': f"{r['rating']:.1f}", 'review_count': r['count'], 'stars': stars, 'hours': hours,
    'phone_href': site['phone']['href'], 'phone_label': site['phone']['label'],
}
out = (ROOT / 'src' / 'index.template.html').read_text(encoding='utf-8')
for k, v in vals.items():
    out = out.replace('{{' + k + '}}', str(v))
assert '{{' not in out, 'Quedó un marcador sin reemplazar'
(ROOT / 'index.html').write_text(out, encoding='utf-8')
print(f'index.html generado ({len(out) // 1024} KB) · {len(categories)} categorías · {len(products)} productos · {len(site.get("videos", []))} videos')
