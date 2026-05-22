#!/usr/bin/env python3
"""
Build a premium PDF e-book from Markdown source.
Output: assets/ebook/AI-Solopreneur-OS.pdf
"""

import os
import re
from pathlib import Path
import markdown
from weasyprint import HTML, CSS
from weasyprint.text.fonts import FontConfiguration

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "assets" / "ebook" / "ai-solopreneur-os-ebook.md"
OUT = ROOT / "assets" / "ebook" / "AI-Solopreneur-OS.pdf"

# ---------- 1. Read markdown ----------
md_text = SRC.read_text(encoding="utf-8")

# ---------- 2. Convert MD → HTML ----------
html_body = markdown.markdown(
    md_text,
    extensions=["extra", "tables", "fenced_code", "toc", "sane_lists"],
)

# ---------- 3. Inject CSS for premium look ----------
CSS_STYLES = """
@page {
    size: A4;
    margin: 22mm 20mm 22mm 20mm;
    @bottom-center {
        content: counter(page) " / " counter(pages);
        font-family: 'Inter', sans-serif;
        font-size: 9pt;
        color: #71717a;
    }
    @top-right {
        content: "The AI Solopreneur OS";
        font-family: 'Inter', sans-serif;
        font-size: 8pt;
        color: #a1a1aa;
        letter-spacing: 0.04em;
    }
}

@page :first {
    margin: 0;
    @bottom-center { content: ""; }
    @top-right { content: ""; }
}

@page cover {
    margin: 0;
    @bottom-center { content: ""; }
    @top-right { content: ""; }
}

* { box-sizing: border-box; }

body {
    font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 10.5pt;
    line-height: 1.65;
    color: #1f2937;
    -webkit-font-smoothing: antialiased;
}

/* ---- COVER PAGE ---- */
.cover {
    page: cover;
    page-break-after: always;
    height: 297mm;
    width: 210mm;
    background: linear-gradient(135deg, #0a0a0a 0%, #1f1147 50%, #312e81 100%);
    color: white;
    padding: 70mm 25mm 30mm 25mm;
    position: relative;
    overflow: hidden;
}
.cover::before {
    content: "";
    position: absolute;
    top: -100px; right: -100px;
    width: 350px; height: 350px;
    background: radial-gradient(circle, rgba(167,139,250,0.5) 0%, rgba(236,72,153,0.2) 50%, transparent 70%);
    border-radius: 50%;
    filter: blur(40px);
}
.cover::after {
    content: "";
    position: absolute;
    bottom: -120px; left: -100px;
    width: 350px; height: 350px;
    background: radial-gradient(circle, rgba(251,191,36,0.4) 0%, rgba(236,72,153,0.15) 50%, transparent 70%);
    border-radius: 50%;
    filter: blur(40px);
}
.cover-pill {
    display: inline-block;
    padding: 6px 14px;
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 100px;
    font-size: 9pt;
    color: rgba(255,255,255,0.7);
    margin-bottom: 28px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
}
.cover-title {
    font-size: 56pt;
    font-weight: 900;
    line-height: 1;
    letter-spacing: -0.04em;
    margin-bottom: 24px;
    color: white;
    position: relative;
    z-index: 2;
}
.cover-title .tag-thin {
    font-size: 14pt;
    font-weight: 400;
    color: rgba(255,255,255,0.6);
    display: block;
    margin-top: 8px;
    letter-spacing: 0;
}
.cover-sub {
    font-size: 14pt;
    color: rgba(255,255,255,0.85);
    font-weight: 400;
    line-height: 1.4;
    margin-bottom: 60px;
    position: relative;
    z-index: 2;
    max-width: 145mm;
}
.cover-meta {
    position: absolute;
    bottom: 32mm;
    left: 25mm;
    right: 25mm;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    z-index: 2;
}
.cover-meta-left {
    font-size: 9pt;
    color: rgba(255,255,255,0.55);
    line-height: 1.7;
}
.cover-meta-left strong {
    color: white;
    font-weight: 700;
    display: block;
    font-size: 11pt;
    letter-spacing: 0.04em;
}
.cover-author {
    font-size: 11pt;
    color: white;
    font-weight: 600;
    text-align: right;
}
.cover-author span {
    display: block;
    font-size: 8pt;
    color: rgba(255,255,255,0.5);
    font-weight: 400;
    margin-top: 2px;
}

/* ---- BODY HEADINGS ---- */
h1 {
    font-size: 28pt;
    font-weight: 900;
    color: #0a0a0a;
    line-height: 1.1;
    letter-spacing: -0.025em;
    margin: 1.4cm 0 0.4cm 0;
    page-break-before: always;
    padding-bottom: 6mm;
    border-bottom: 2px solid #fbbf24;
}
h1:first-of-type { page-break-before: auto; }

h2 {
    font-size: 18pt;
    font-weight: 800;
    color: #18181b;
    line-height: 1.2;
    letter-spacing: -0.02em;
    margin: 1cm 0 0.3cm 0;
    page-break-after: avoid;
}
h3 {
    font-size: 13pt;
    font-weight: 700;
    color: #27272a;
    margin: 0.7cm 0 0.2cm 0;
    page-break-after: avoid;
}
h4 {
    font-size: 11pt;
    font-weight: 700;
    color: #3f3f46;
    margin: 0.5cm 0 0.1cm 0;
    page-break-after: avoid;
}

/* ---- TEXT ---- */
p {
    margin: 0 0 0.35cm 0;
    text-align: justify;
    hyphens: auto;
    orphans: 3;
    widows: 3;
}
strong { color: #18181b; font-weight: 700; }
em { color: #52525b; }

/* ---- LISTS ---- */
ul, ol {
    margin: 0.3cm 0 0.4cm 0.6cm;
    padding-left: 0.4cm;
}
li {
    margin-bottom: 0.15cm;
    line-height: 1.6;
}
ul li::marker { color: #fbbf24; }

/* ---- LINKS ---- */
a {
    color: #2563eb;
    text-decoration: none;
    word-break: break-word;
}

/* ---- CODE BLOCKS ---- */
pre {
    background: #f4f4f5;
    border: 1px solid #e4e4e7;
    border-radius: 6px;
    padding: 4mm 5mm;
    font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
    font-size: 9pt;
    line-height: 1.5;
    overflow-x: hidden;
    white-space: pre-wrap;
    word-wrap: break-word;
    color: #18181b;
    page-break-inside: avoid;
    margin: 0.3cm 0;
}
code {
    background: #f4f4f5;
    padding: 1px 5px;
    border-radius: 3px;
    font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
    font-size: 9pt;
    color: #c026d3;
}
pre code {
    background: transparent;
    padding: 0;
    color: inherit;
}

/* ---- BLOCKQUOTE ---- */
blockquote {
    border-left: 3px solid #fbbf24;
    background: #fffbeb;
    padding: 4mm 5mm;
    margin: 0.4cm 0;
    color: #52525b;
    font-style: italic;
    border-radius: 0 6px 6px 0;
    page-break-inside: avoid;
}
blockquote p { margin: 0; }

/* ---- TABLES ---- */
table {
    width: 100%;
    border-collapse: collapse;
    margin: 0.4cm 0;
    font-size: 9.5pt;
    page-break-inside: avoid;
}
th {
    background: #18181b;
    color: white;
    text-align: left;
    padding: 3mm 4mm;
    font-weight: 700;
    font-size: 9pt;
    letter-spacing: 0.02em;
}
td {
    padding: 2.5mm 4mm;
    border-bottom: 1px solid #e4e4e7;
    vertical-align: top;
}
tr:nth-child(even) td { background: #fafafa; }

/* ---- HORIZONTAL RULES ---- */
hr {
    border: none;
    border-top: 1px solid #e4e4e7;
    margin: 0.8cm 0;
}

/* ---- TABLE OF CONTENTS (manual styling) ---- */
.toc-block {
    background: #fafafa;
    border: 1px solid #e4e4e7;
    border-radius: 8px;
    padding: 6mm 7mm;
    margin: 0.6cm 0;
    page-break-inside: avoid;
}

/* ---- FIRST PAGE AFTER COVER ---- */
.content { padding-top: 0; }
"""

# ---------- 4. Build cover page HTML ----------
COVER_HTML = """
<div class="cover">
    <span class="cover-pill">Build · Automate · Scale</span>
    <h1 class="cover-title">
        The AI<br>Solopreneur<br>OS
        <span class="tag-thin">v1.0 · 2026 Edition</span>
    </h1>
    <p class="cover-sub">
        Build a faceless 6-figure business alone — before your competitors even wake up.
    </p>
    <div class="cover-meta">
        <div class="cover-meta-left">
            <strong>127 pages</strong>
            5 modules · 3 bonuses<br>
            7 automations · 50 prompts
        </div>
        <div class="cover-author">
            Yanzy
            <span>YanzyStore · @yanzy17</span>
        </div>
    </div>
</div>
"""

# Wrap body content
final_html = f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>The AI Solopreneur OS</title></head>
<body>
{COVER_HTML}
<div class="content">
{html_body}
</div>
</body>
</html>"""

# ---------- 5. Render to PDF ----------
print(f"Rendering PDF...")
print(f"  Source: {SRC}")
print(f"  Output: {OUT}")

font_config = FontConfiguration()
HTML(string=final_html, base_url=str(ROOT)).write_pdf(
    str(OUT),
    stylesheets=[CSS(string=CSS_STYLES, font_config=font_config)],
    font_config=font_config,
)

# Stats
size_kb = OUT.stat().st_size / 1024
print(f"\nDone.")
print(f"  Size: {size_kb:.1f} KB")
print(f"  Path: {OUT.relative_to(ROOT)}")
