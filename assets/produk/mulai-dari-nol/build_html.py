#!/usr/bin/env python3
"""
Konversi naskah .md di folder ZIP/ menjadi file .html berdesain premium.
- Cover gradient, card, checklist box, badge, callout, tabel, sticky-note (prompt).
- Catatan [VISUAL] ditampilkan di layar (sebagai panduan desain) tapi DISEMBUNYIKAN saat print/PDF.
- Mobile-friendly + siap "Print to PDF".
Output: folder BUILD/ yang mirror struktur ZIP, lalu di-zip.
"""
import os, re, html, shutil, zipfile, pathlib

ROOT = pathlib.Path(__file__).parent
SRC = ROOT / "ZIP"
OUT = ROOT / "BUILD"
ZIP_NAME = "Mulai-Dari-Nol-Starter-Kit.zip"

CSS = r"""
:root{
  --navy:#0E1525; --purple:#6C5CE7; --purple-soft:#efeafe; --mint:#00D1B2;
  --bg:#F5F7FB; --card:#ffffff; --text:#1A1A2E; --muted:#6B7280; --line:#e6e8ef;
  --coral:#FF7A59; --warn:#fff4ed; --warn-line:#ffb38a; --ok:#e9fbf6;
}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{
  margin:0; background:var(--bg); color:var(--text);
  font-family:'Inter','Work Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
  line-height:1.65; font-size:16px;
}
.wrap{max-width:820px; margin:0 auto; padding:28px 22px 80px;}
h1,h2,h3,h4{font-family:'Poppins','Sora',sans-serif; line-height:1.25; font-weight:600;}
/* HERO COVER (first h1) */
.hero{
  background:linear-gradient(135deg,#0E1525 0%,#241b4d 55%,#6C5CE7 100%);
  color:#fff; border-radius:24px; padding:48px 32px; margin:6px 0 30px;
  box-shadow:0 18px 40px rgba(108,92,231,.25); position:relative; overflow:hidden;
}
.hero:before{content:"";position:absolute;right:-60px;top:-60px;width:200px;height:200px;
  background:radial-gradient(circle,rgba(0,209,178,.45),transparent 70%);}
.hero h1{font-size:2.5rem; margin:0 0 10px; letter-spacing:-.5px;}
.hero .sub{font-size:1.1rem; opacity:.95; font-family:'Inter',sans-serif; font-weight:500;}
.hero .pill{display:inline-block; background:rgba(255,255,255,.15); border:1px solid rgba(255,255,255,.3);
  padding:6px 14px; border-radius:999px; font-size:.8rem; margin-bottom:18px; font-family:'Inter',sans-serif;}
/* SECTION h2 */
h2{font-size:1.5rem; margin:42px 0 6px; padding-bottom:8px; position:relative;}
h2:after{content:"";display:block;width:54px;height:4px;border-radius:4px;
  background:linear-gradient(90deg,var(--purple),var(--mint)); margin-top:10px;}
/* CARD (each h3 opens a card) */
.card{background:var(--card); border:1px solid var(--line); border-radius:16px;
  padding:18px 20px; margin:16px 0; box-shadow:0 4px 16px rgba(16,21,37,.05);
  border-left:5px solid var(--purple);}
.card h3{margin:0 0 8px; font-size:1.15rem; color:var(--navy);}
.card h3 .num{display:inline-flex;align-items:center;justify-content:center;
  width:30px;height:30px;border-radius:50%;background:var(--purple-soft);color:var(--purple);
  font-size:.9rem;margin-right:8px;font-weight:700;}
p{margin:8px 0;}
ul,ol{margin:8px 0; padding-left:22px;}
li{margin:5px 0;}
strong{color:var(--navy);}
em{color:var(--muted);}
a{color:var(--purple);}
hr{border:none; border-top:1px dashed var(--line); margin:30px 0;}
/* blockquote -> highlight/callout */
blockquote{margin:14px 0; padding:14px 18px; background:var(--purple-soft);
  border-left:4px solid var(--purple); border-radius:0 12px 12px 0; color:var(--navy); font-weight:500;}
blockquote p{margin:4px 0;}
/* code block -> sticky note (prompt) */
pre{background:#0E1525; color:#e8eaff; border-radius:14px; padding:16px 18px; overflow:auto;
  font-family:'SFMono-Regular',Consolas,Menlo,monospace; font-size:.85rem; line-height:1.5;
  border:1px solid #232a44; position:relative;}
pre:before{content:"PROMPT — tap & copy"; position:absolute; top:8px; right:14px; font-size:.62rem;
  color:#8b93c7; letter-spacing:1px; font-family:'Inter',sans-serif;}
code{background:#eef0f7; padding:2px 6px; border-radius:6px; font-size:.88em;}
pre code{background:none; padding:0;}
/* tables */
table{width:100%; border-collapse:collapse; margin:16px 0; font-size:.92rem;
  background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 4px 14px rgba(16,21,37,.05);}
th{background:var(--navy); color:#fff; text-align:left; padding:11px 12px; font-family:'Poppins',sans-serif; font-size:.85rem;}
td{padding:10px 12px; border-top:1px solid var(--line); vertical-align:top;}
tr:nth-child(even) td{background:#fafbfe;}
/* checklist */
.check{list-style:none; padding-left:0;}
.check li{position:relative; padding:8px 8px 8px 38px; margin:6px 0; background:#fff;
  border:1px solid var(--line); border-radius:10px;}
.check li:before{content:""; position:absolute; left:11px; top:50%; transform:translateY(-50%);
  width:18px;height:18px;border:2px solid var(--mint);border-radius:5px;}
/* designer note (VISUAL) - hidden when printing */
.vnote{background:repeating-linear-gradient(45deg,#fffbe6,#fffbe6 10px,#fff6cf 10px,#fff6cf 20px);
  border:1px dashed #e3c84d; border-radius:12px; padding:12px 16px; margin:14px 0;
  font-size:.85rem; color:#7a6a16;}
.vnote b{color:#5c5210;}
.vtag{display:inline-block;background:#e3c84d;color:#3d3500;font-size:.65rem;font-weight:700;
  padding:2px 8px;border-radius:6px;margin-right:8px;letter-spacing:.5px;}
/* footer */
.foot{margin-top:50px;padding-top:18px;border-top:1px solid var(--line);
  color:var(--muted);font-size:.8rem;text-align:center;}
@media (max-width:520px){
  .hero{padding:34px 22px;} .hero h1{font-size:1.9rem;}
  .wrap{padding:18px 14px 60px;} body{font-size:15px;}
}
@media print{
  body{background:#fff;}
  .vnote,.no-print,.printhint{display:none !important;}
  .hero{box-shadow:none; -webkit-print-color-adjust:exact; print-color-adjust:exact;}
  .card,table,pre{box-shadow:none; break-inside:avoid;}
  h2{break-after:avoid;}
}
.printhint{background:var(--ok);border:1px solid var(--mint);border-radius:10px;
  padding:10px 14px;font-size:.82rem;margin:0 0 18px;color:#06715f;}
@page{margin:14mm;}
"""

HEAD = """<!doctype html><html lang="id"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<title>{title}</title><style>{css}</style></head><body><div class="wrap">
<div class="printhint no-print">Tips: untuk jadikan PDF → menu browser → <b>Print</b> → <b>Save as PDF</b>. Catatan desain kuning otomatis hilang di PDF.</div>
"""
FOOT = '<div class="foot">MULAI DARI NOL — Starter Kit Jualan Produk Digital dari HP</div></div></body></html>'

def inline(t):
    t = html.escape(t)
    t = re.sub(r'`([^`]+)`', r'<code>\1</code>', t)
    t = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', t)
    t = re.sub(r'(?<!\*)\*([^*]+)\*(?!\*)', r'<em>\1</em>', t)
    t = re.sub(r'\[([^\]]+)\]\((https?://[^)]+)\)', r'<a href="\2">\1</a>', t)
    return t

def convert(md, title):
    lines = md.split('\n')
    out = []
    i = 0
    card_open = False
    first_h1_done = False
    def close_card():
        nonlocal card_open
        if card_open:
            out.append('</div>'); card_open = False
    while i < len(lines):
        line = lines[i]
        raw = line.rstrip('\n')
        stripped = raw.strip()

        # code fence
        if stripped.startswith('```'):
            block = []
            i += 1
            while i < len(lines) and not lines[i].strip().startswith('```'):
                block.append(lines[i]); i += 1
            i += 1
            out.append('<pre><code>' + html.escape('\n'.join(block)) + '</code></pre>')
            continue

        # VISUAL note: line containing [VISUAL] (optionally inside backticks)
        if '[VISUAL]' in stripped:
            note = stripped.strip('`').replace('[VISUAL]', '', 1).strip()
            out.append('<div class="vnote"><span class="vtag">VISUAL</span>' + inline(note) + '</div>')
            i += 1; continue

        # hr
        if re.match(r'^---+$', stripped):
            close_card(); out.append('<hr>'); i += 1; continue

        # table
        if stripped.startswith('|') and i+1 < len(lines) and re.match(r'^\|[\s:\-|]+\|$', lines[i+1].strip()):
            header = [c.strip() for c in stripped.strip('|').split('|')]
            i += 2
            rows = []
            while i < len(lines) and lines[i].strip().startswith('|'):
                rows.append([c.strip() for c in lines[i].strip().strip('|').split('|')]); i += 1
            t = '<table><thead><tr>' + ''.join(f'<th>{inline(h)}</th>' for h in header) + '</tr></thead><tbody>'
            for r in rows:
                t += '<tr>' + ''.join(f'<td>{inline(c)}</td>' for c in r) + '</tr>'
            t += '</tbody></table>'
            out.append(t); continue

        # headings
        m = re.match(r'^(#{1,4})\s+(.*)$', stripped)
        if m:
            level = len(m.group(1)); txt = m.group(2)
            if level == 1:
                close_card()
                if not first_h1_done:
                    # hero cover; pull following ### subtitle if present
                    sub = ''
                    if i+1 < len(lines) and lines[i+1].strip().startswith('### '):
                        sub = lines[i+1].strip()[4:]; i += 1
                    out.append(f'<div class="hero"><div class="pill">Starter Kit Pemula</div>'
                               f'<h1>{inline(txt)}</h1>' + (f'<div class="sub">{inline(sub)}</div>' if sub else '') + '</div>')
                    first_h1_done = True
                else:
                    out.append(f'<h2>{inline(txt)}</h2>')
                i += 1; continue
            if level == 2:
                close_card(); out.append(f'<h2>{inline(txt)}</h2>'); i += 1; continue
            # level 3/4 -> open a card
            close_card()
            numm = re.match(r'^(\d+)\.\s+(.*)$', txt)
            if numm:
                head = f'<span class="num">{numm.group(1)}</span>{inline(numm.group(2))}'
            else:
                head = inline(txt)
            out.append(f'<div class="card"><h3>{head}</h3>'); card_open = True
            i += 1; continue

        # blockquote
        if stripped.startswith('>'):
            block = []
            while i < len(lines) and lines[i].strip().startswith('>'):
                block.append(lines[i].strip()[1:].strip()); i += 1
            out.append('<blockquote>' + ''.join(f'<p>{inline(b)}</p>' for b in block if b!='') + '</blockquote>')
            continue

        # checklist (lines starting with ☐)
        if stripped.startswith('☐'):
            items = []
            while i < len(lines) and lines[i].strip().startswith('☐'):
                items.append(lines[i].strip()[1:].strip()); i += 1
            out.append('<ul class="check">' + ''.join(f'<li>{inline(it)}</li>' for it in items) + '</ul>')
            continue

        # unordered list
        if re.match(r'^[-*]\s+', stripped):
            items = []
            while i < len(lines) and re.match(r'^[-*]\s+', lines[i].strip()):
                items.append(re.sub(r'^[-*]\s+','',lines[i].strip())); i += 1
            out.append('<ul>' + ''.join(f'<li>{inline(it)}</li>' for it in items) + '</ul>')
            continue

        # ordered list
        if re.match(r'^\d+\.\s+', stripped):
            items = []
            while i < len(lines) and re.match(r'^\d+\.\s+', lines[i].strip()):
                items.append(re.sub(r'^\d+\.\s+','',lines[i].strip())); i += 1
            out.append('<ol>' + ''.join(f'<li>{inline(it)}</li>' for it in items) + '</ol>')
            continue

        # blank
        if stripped == '':
            i += 1; continue

        # paragraph
        out.append(f'<p>{inline(stripped)}</p>')
        i += 1
    close_card()
    return HEAD.format(title=html.escape(title), css=CSS) + '\n'.join(out) + FOOT

def main():
    if OUT.exists(): shutil.rmtree(OUT)
    OUT.mkdir(parents=True)
    count = 0
    for dirpath, _, files in os.walk(SRC):
        for f in sorted(files):
            if not f.endswith('.md'): continue
            src = pathlib.Path(dirpath) / f
            rel = src.relative_to(SRC)
            title = f[:-3].replace('-', ' ')
            md = src.read_text(encoding='utf-8')
            htmlout = convert(md, title)
            dest = OUT / rel.with_suffix('.html')
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_text(htmlout, encoding='utf-8')
            count += 1
            print("OK:", rel.with_suffix('.html'))
    # zip it
    zip_path = ROOT / ZIP_NAME
    if zip_path.exists(): zip_path.unlink()
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as z:
        for dirpath, _, files in os.walk(OUT):
            for f in files:
                fp = pathlib.Path(dirpath) / f
                arc = pathlib.Path("MULAI DARI NOL - Starter Kit") / fp.relative_to(OUT)
                z.write(fp, arc)
    print(f"\n{count} file HTML dibuat. ZIP: {zip_path.name}")

if __name__ == '__main__':
    main()
