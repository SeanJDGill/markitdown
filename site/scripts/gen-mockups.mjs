// Generates original, branded UI-mockup SVGs for hero and UX-bite images.
// These are abstract illustrations (device window + flow-appropriate UI blocks
// in brand-accurate colours) — NOT real product screenshots or logos.
import { writeFileSync } from 'node:fs';

const GREY = { lite: '#f2efea', block: '#e4ded6', mid: '#d6cfc4', label: '#c4bcae', line: '#ece8e2' };
const R = (x, y, w, h, r, f, extra = '') =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${f}" ${extra}/>`;
const C = (cx, cy, r, f) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${f}"/>`;

// ---- flow layouts: each returns SVG markup for a content box of (w,h) -------
const P = 34;
const layouts = {
  onboarding: (w, h, a) =>
    R(P, P, 230, 26, 8, a) +
    R(P, P + 44, w - 2 * P - 90, 14, 6, GREY.block) +
    R(P, P + 66, w - 2 * P - 180, 14, 6, GREY.line) +
    R(P, P + 116, w - 2 * P, 56, 12, GREY.lite) + R(P + 16, P + 134, 120, 16, 6, GREY.mid) +
    R(P, P + 188, w - 2 * P, 56, 12, GREY.lite) + R(P + 16, P + 206, 160, 16, 6, GREY.mid) +
    R(P, P + 276, w - 2 * P, 54, 12, a),
  checkout: (w, h, a) =>
    [0, 1, 2].map((i) => R(P, P + i * 60, w - 2 * P - 110, 16, 6, GREY.block) + R(w - P - 92, P + i * 60, 92, 16, 6, GREY.line)).join('') +
    R(P, P + 196, w - 2 * P, 2, 1, GREY.line) +
    R(P, P + 220, 150, 22, 6, GREY.mid) + R(w - P - 130, P + 218, 130, 24, 6, a) +
    R(P, P + 286, w - 2 * P, 54, 12, a),
  form: (w, h, a) =>
    R(P, P, w - 2 * P - 70, 28, 8, GREY.mid) +
    [0, 1, 2].map((i) => R(P, P + 70 + i * 80, 130, 14, 6, GREY.block) + R(P, P + 70 + i * 80 + 22, w - 2 * P, 50, 10, GREY.lite)).join('') +
    R(P, P + 70 + 3 * 80 + 6, 190, 52, 12, a),
  search: (w, h, a) => {
    const cw = (w - 2 * P - 22) / 2;
    let s = R(P, P, w - 2 * P - 104, 52, 12, GREY.lite) + R(w - P - 92, P, 92, 52, 12, a);
    [0, 1].forEach((r) => [0, 1].forEach((c) => {
      const x = P + c * (cw + 22), y = P + 78 + r * 168;
      s += R(x, y, cw, 150, 12, GREY.lite) + R(x, y, cw, 92, 12, GREY.block) +
        R(x + 14, y + 104, cw - 60, 12, 6, GREY.mid) + R(x + 14, y + 124, cw - 110, 10, 5, GREY.line);
    }));
    return s;
  },
  grid: (w, h, a) => {
    let s = R(P, P, 280, 24, 8, GREY.mid);
    const sel = new Set([0, 4, 5, 7]);
    const cw = (w - 2 * P - 2 * 20) / 3;
    [0, 1, 2].forEach((r) => [0, 1, 2].forEach((c) => {
      const i = r * 3 + c, x = P + c * (cw + 20), y = P + 54 + r * (cw * 0.78 + 20);
      s += R(x, y, cw, cw * 0.78, 14, sel.has(i) ? a : GREY.lite) +
        (sel.has(i) ? C(x + cw - 22, y + 22, 9, '#ffffff') : '');
    }));
    return s;
  },
  pricing: (w, h, a) => {
    const cw = (w - 2 * P - 2 * 18) / 3;
    let s = '';
    [0, 1, 2].forEach((c) => {
      const x = P + c * (cw + 18), mid = c === 1;
      s += R(x, P + (mid ? 0 : 18), cw, h - 2 * P - (mid ? 0 : 30), 14, mid ? '#fff' : GREY.lite,
        mid ? `stroke="${a}" stroke-width="3"` : '') +
        R(x + 16, P + (mid ? 24 : 42), cw - 60, 22, 6, mid ? a : GREY.mid) +
        [0, 1, 2].map((k) => R(x + 16, P + (mid ? 70 : 88) + k * 30, cw - 36, 12, 5, GREY.line)).join('') +
        R(x + 16, P + h - 2 * P - (mid ? 70 : 92), cw - 32, 40, 10, mid ? a : GREY.block);
    });
    return s;
  },
  feed: (w, h, a) =>
    C(w / 2, P + 56, 50, a) + R(w / 2 - 40, P + 122, 80, 14, 6, GREY.mid) +
    [0, 1, 2, 3].map((i) => R(P, P + 158 + i * 62, w - 2 * P, 46, 10, GREY.lite) +
      C(P + 28, P + 158 + i * 62 + 23, 12, a) + R(P + 56, P + 158 + i * 62 + 17, w - 2 * P - 90, 12, 6, GREY.block)).join(''),
  nav: (w, h, a) => {
    let s = R(P, P, 168, h - 2 * P, 12, GREY.lite);
    s += [0, 1, 2, 3].map((i) => R(P + 16, P + 22 + i * 42, 130, 14, 6, i === 1 ? a : GREY.mid)).join('');
    s += R(P + 188, P, w - P - (P + 188), 40, 10, GREY.line);
    s += R(P + 188, P + 60, 220, 150, 14, GREY.block) + R(P + 188 + 240, P + 60, w - P - (P + 188 + 240), 150, 14, GREY.lite);
    s += R(P + 188, P + 230, w - P - (P + 188), 90, 12, a + '22' ) + R(P + 188, P + 230, 120, 90, 12, a);
    return s;
  },
  card: (w, h, a) => {
    const cw = w - 2 * P - 60, ch = h - 2 * P - 90, x = (w - cw) / 2;
    return R(x, P, cw, ch, 18, GREY.lite) + R(x, P, cw, ch - 70, 18, GREY.block) +
      R(x + 22, P + ch - 56, cw - 200, 16, 6, GREY.mid) + R(x + 22, P + ch - 32, cw - 280, 12, 5, GREY.line) +
      C(w / 2 - 46, P + ch + 46, 30, GREY.mid) + C(w / 2 + 46, P + ch + 46, 30, a);
  },
  empty: (w, h, a) => {
    const bx = P + 40, by = P + 30, bw = w - 2 * P - 80, bh = h - 2 * P - 120;
    return `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="16" fill="none" stroke="${GREY.mid}" stroke-width="2.5" stroke-dasharray="10 9"/>` +
      C(w / 2, by + bh / 2 - 18, 26, a) +
      R(w / 2 - 12, by + bh / 2 - 21, 24, 6, 3, '#fff') + R(w / 2 - 3, by + bh / 2 - 30, 6, 24, 3, '#fff') +
      R(w / 2 - 120, by + bh / 2 + 26, 240, 12, 6, GREY.block) +
      R(w / 2 - 80, P + h - 2 * P - 30, 160, 46, 10, a);
  },
};

function windowFrame(x, y, w, h, body) {
  const bar = 46;
  return `<g filter="url(#sh)">${R(x, y, w, h, 18, '#ffffff')}</g>` +
    R(x, y, w, bar, 18, '#f0ede8') + R(x, y + bar - 18, w, 18, 0, '#f0ede8') +
    C(x + 26, y + 23, 6, '#ff5f57') + C(x + 46, y + 23, 6, '#febc2e') + C(x + 66, y + 23, 6, '#28c840') +
    R(x + 120, y + 15, w - 150, 16, 8, '#e4ded6') +
    `<g transform="translate(${x},${y + bar})">${body(w, h - bar)}</g>`;
}

const defs = `<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="BG1"/><stop offset="1" stop-color="BG2"/></linearGradient>
  <pattern id="dots" width="34" height="34" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.6" fill="#ffffff" opacity="0.08"/></pattern>
  <filter id="sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="24" stdDeviation="30" flood-color="#000" flood-opacity="0.30"/></filter>
</defs>`;

function lighten(hex, amt = 26) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, (n >> 16) + amt), g = Math.min(255, ((n >> 8) & 255) + amt), b = Math.min(255, (n & 255) + amt);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function hero({ file, name, eyebrow, kind, bg, accent }) {
  const W = 1600, H = 900, wx = 824, wy = 118, ww = 700, wh = 664;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${name} UI mockup">
${defs.replace('BG1', bg).replace('BG2', lighten(bg, 22))}
${R(0, 0, W, H, 0, 'url(#bg)')}${R(0, 0, W, H, 0, 'url(#dots)')}
<text x="90" y="372" font-family="Inter,Arial,sans-serif" font-size="30" font-weight="600" letter-spacing="3" fill="${accent}">${eyebrow}</text>
<text x="86" y="470" font-family="Inter,Arial,sans-serif" font-size="120" font-weight="800" fill="#ffffff">${name}</text>
${R(90, 520, 360, 12, 6, '#ffffff')}${R(90, 548, 250, 12, 6, accent)}
${windowFrame(wx, wy, ww, wh, (w, h) => layouts[kind](w, h, accent))}
</svg>`;
  writeFileSync(file, svg);
}

function bite({ file, name, kind, bg, accent }) {
  const W = 1200, H = 800, ww = 720, wx = (W - ww) / 2, wy = 150, wh = 520;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${name} UI mockup">
${defs.replace('BG1', bg).replace('BG2', lighten(bg, 22))}
${R(0, 0, W, H, 0, 'url(#bg)')}${R(0, 0, W, H, 0, 'url(#dots)')}
<text x="${wx}" y="96" font-family="Inter,Arial,sans-serif" font-size="46" font-weight="800" fill="#ffffff">${name}</text>
${windowFrame(wx, wy, ww, wh, (w, h) => layouts[kind](w, h, accent))}
</svg>`;
  writeFileSync(file, svg);
}

const D = 'public';
const heroes = [
  ['monzo-hero', 'Monzo', 'FINTECH · ONBOARDING', 'onboarding', '#0c1330', '#6c7bff'],
  ['duolingo-hero', 'Duolingo', 'EDTECH · RETENTION', 'feed', '#0e2a12', '#58cc02'],
  ['amazon-hero', 'Amazon', 'E-COMMERCE · CHECKOUT', 'checkout', '#201400', '#ff9900'],
  ['spotify-hero', 'Spotify', 'STREAMING · ONBOARDING', 'grid', '#07210f', '#1db954'],
  ['netflix-hero', 'Netflix', 'STREAMING · SIGN-UP', 'pricing', '#1a0507', '#e50914'],
  ['notion-hero', 'Notion', 'PRODUCTIVITY · EMPTY STATES', 'empty', '#1c1c1c', '#9b9b9b'],
  ['headspace-hero', 'Headspace', 'WELLNESS · RETENTION', 'feed', '#2a1500', '#ff7a00'],
  ['figma-hero', 'Figma', 'DESIGN · NAVIGATION', 'nav', '#240e36', '#a259ff'],
  ['stripe-hero', 'Stripe', 'PAYMENTS · CHECKOUT', 'checkout', '#0f1338', '#635bff'],
  ['govuk-hero', 'GOV.UK', 'PUBLIC SECTOR · FORMS', 'form', '#0b0c0c', '#1d70b8'],
  ['uber-hero', 'Uber', 'MOBILITY · CHECKOUT', 'checkout', '#0a0a0a', '#3b9cff'],
  ['airbnb-hero', 'Airbnb', 'TRAVEL · SEARCH', 'search', '#2e0c16', '#ff385c'],
  ['apple-hero', 'Apple', 'HARDWARE · PRICING', 'pricing', '#18181a', '#8e8e93'],
  ['robinhood-hero', 'Robinhood', 'FINTECH · ONBOARDING', 'onboarding', '#06140a', '#00c805'],
  ['booking-hero', 'Booking', 'TRAVEL · PRICING', 'search', '#001233', '#2f7fe0'],
  ['tinder-hero', 'Tinder', 'SOCIAL · MOBILE', 'card', '#2e0a1a', '#fe3c72'],
];
const bites = [
  ['slack', 'Slack', 'empty', '#1f0c24', '#7c3085'],
  ['stripe', 'Stripe', 'form', '#0f1338', '#635bff'],
  ['airbnb', 'Airbnb', 'search', '#2e0c16', '#ff385c'],
  ['apple', 'Apple', 'pricing', '#18181a', '#8e8e93'],
  ['google', 'Google', 'search', '#07142e', '#4285f4'],
  ['linear', 'Linear', 'nav', '#0f1130', '#6e79e6'],
];
const screens = [
  ['screen-a', 'onboarding', '#15161c', '#6c7bff'],
  ['screen-b', 'checkout', '#161c16', '#4caf50'],
  ['screen-c', 'form', '#1c1616', '#e0795b'],
];

heroes.forEach(([f, name, eyebrow, kind, bg, accent]) => hero({ file: `${D}/heroes/${f}.svg`, name, eyebrow, kind, bg, accent }));
bites.forEach(([f, name, kind, bg, accent]) => bite({ file: `${D}/bites/${f}.svg`, name, kind, bg, accent }));
// in-article screenshots reuse the bite framing (centred window, no big title)
screens.forEach(([f, kind, bg, accent]) => bite({ file: `${D}/placeholders/${f}.svg`, name: '', kind, bg, accent }));

console.log(`Generated ${heroes.length} heroes, ${bites.length} bites, ${screens.length} screens.`);
