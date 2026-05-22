---
inclusion: always
---

# Brand & Language Policy

This repository hosts **two distinct brands**. Before creating ANY new asset (e-book, landing page, sales copy, email sequence, social post, lead magnet, video script, prompt, etc.) you **MUST ask** the user which brand the asset is for.

---

## Required Question (ASK FIRST, ALWAYS)

> **"Untuk brand global (esenefwork17) atau lokal (YanzyStore)?"**

Do not infer. Do not assume based on context. Always ask explicitly — the user has 2 separate brands and will tell you which one.

---

## Brand 1 — esenefwork17 (GLOBAL)

| Attribute | Value |
|---|---|
| **Market** | International (US, UK, EU, English-speaking world) |
| **Sales platform** | Gumroad, Lemon Squeezy, international Stripe |
| **Currency** | USD ($) |
| **Language** | **English (English-native copywriting)** — no AI-translated feel, no Indonesian phrasing |
| **Tone** | Sharp, direct, no fluff |
| **Audience** | Solopreneurs, freelancers, indie hackers, creators worldwide |
| **Existing assets** | `ai-solopreneur-os.html`, `assets/ebook/AI-Solopreneur-OS.pdf`, `assets/marketing/email-launch-sequence.md`, `assets/marketing/twitter-launch-threads.md`, `assets/marketing/traffic-distribution-playbook.md`, `assets/notion/ai-solopreneur-command-center.md` |

---

## Brand 2 — YanzyStore (LOCAL)

| Attribute | Value |
|---|---|
| **Market** | Indonesia |
| **Sales platform** | WhatsApp, local payment gateways (DANA, OVO, GoPay, BCA Virtual Account) |
| **Currency** | Rupiah (Rp) |
| **Language** | **Bahasa Indonesia** — casual conversational tone, mix of formal + informal |
| **Tone** | Friendly, hype, emoji-friendly, "kamu" not "Anda" |
| **Audience** | Pengguna lokal Indonesia yang cari produk premium murah (CapCut Pro, Netflix, Canva Pro, ChatGPT Plus, dll) |
| **Existing assets** | `index.html`, `affiliate-hub.html`, `ai-tools.html`, `riset-tools.html`, `shopee-affiliate-tools.html`, `profile.html`, `ebook-hook-threads.html` |

---

## Strict Rules

1. **No cross-brand contamination.**
   - esenefwork17 assets must NOT link to YanzyStore product pages.
   - YanzyStore assets must NOT link to esenefwork17 Gumroad pages.
   - Each brand is a separate funnel, separate audience, separate currency.

2. **Match language to brand, always.**
   - esenefwork17 → 100% English copy. No Indonesian words in body copy.
   - YanzyStore → 100% Bahasa Indonesia copy. No English marketing fluff (except product names like "Premium", "Pro").

3. **Match pricing to brand currency.**
   - esenefwork17 → USD ($), e.g. $47, $97
   - YanzyStore → Rupiah (Rp), e.g. Rp 25.000, Rp 99.000

4. **Chat narration stays in Bahasa Indonesia.**
   Regardless of which brand we're working on, explanations to the user in chat are always in Bahasa Indonesia. Only the **deliverable** (HTML, MD, PDF, copy) follows the brand's language.

5. **Repo URLs are factual, never rebrand them.**
   The GitHub repo is literally named `yanzy17/yanzy17`. URLs like `github.com/yanzy17/...` and `yanzy17.github.io/...` MUST remain unchanged regardless of which brand the asset is for.

---

## Quick Decision Matrix

| User says | Brand to use | Language | Currency |
|---|---|---|---|
| "buat e-book global" | esenefwork17 | English | USD |
| "buat e-book lokal" | YanzyStore | Bahasa Indonesia | Rupiah |
| "buat landing page Gumroad" | esenefwork17 | English | USD |
| "buat halaman jualan WA" | YanzyStore | Bahasa Indonesia | Rupiah |
| "buat email launch" | **ASK FIRST** | depends | depends |
| "tambah produk baru" | **ASK FIRST** | depends | depends |

If the user gives any ambiguous instruction, the default behaviour is: **ask, do not assume.**

---

## Examples of Correct Behaviour

### Correct
> User: "buatkan e-book tentang affiliate marketing"
> Me: "Sebelum mulai — ini untuk brand **esenefwork17** (English, Gumroad, USD) atau **YanzyStore** (Bahasa Indonesia, lokal, Rupiah)?"

### Incorrect
> User: "buatkan e-book tentang affiliate marketing"
> Me: *langsung mulai nulis dalam English (atau Bahasa Indonesia) tanpa konfirmasi*

---

*Last updated: 2026-05-22. This policy was added after the user clarified they manage 2 distinct brands and wanted me to always confirm scope first.*
