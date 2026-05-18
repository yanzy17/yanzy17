/* ============================================
   RisetCuan AI - Real AI Tools for Affiliate
   Powered by Pollinations.ai (Free, No API key)
   ============================================ */

// ===== AI ENDPOINT (Free, no API key needed) =====
const AI_ENDPOINT = 'https://text.pollinations.ai/';
const AI_MODEL = 'openai-fast'; // fast & free

/* ===== TAB SWITCHING ===== */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + target).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

/* ===== TOAST ===== */
function toast(msg, isError = false) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.toggle('error', isError);
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2400);
}

/* ===== COPY HELPER ===== */
function copyText(text, btnEl) {
  navigator.clipboard.writeText(text).then(() => {
    if (btnEl) {
      const original = btnEl.innerHTML;
      btnEl.innerHTML = '✓ Tersalin';
      btnEl.classList.add('copied');
      setTimeout(() => {
        btnEl.innerHTML = original;
        btnEl.classList.remove('copied');
      }, 1600);
    }
    toast('📋 Disalin ke clipboard');
  }).catch(() => {
    toast('⚠️ Gagal copy, coba lagi', true);
  });
}

/* ===== UTILS ===== */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function showLoading(targetId, label = 'AI sedang berpikir', sub = 'Tunggu sebentar yaa') {
  document.getElementById(targetId).innerHTML = `
    <div class="loading-card">
      <div class="loading-spinner"></div>
      <div class="loading-text">${label}<span class="loading-dots"><span>.</span><span>.</span><span>.</span></span></div>
      <div class="loading-sub">${sub}</div>
    </div>
  `;
  document.getElementById(targetId).scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showError(targetId, msg) {
  document.getElementById(targetId).innerHTML = `
    <div class="empty">
      <div class="empty-icon">⚠️</div>
      <div class="empty-title">Oops, ada masalah</div>
      <p>${msg}</p>
      <button class="btn btn-ghost btn-sm" style="margin-top:14px;" onclick="location.reload()">🔄 Refresh & Coba Lagi</button>
    </div>
  `;
}

/* ===== AI CALL ===== */
async function askAI(prompt, options = {}) {
  const { temperature = 0.85, system = null } = options;

  // POST request - lebih reliable untuk prompt panjang
  try {
    const body = {
      messages: [],
      model: AI_MODEL,
      temperature: temperature,
      jsonMode: false
    };

    if (system) {
      body.messages.push({ role: 'system', content: system });
    }
    body.messages.push({ role: 'user', content: prompt });

    const response = await fetch(AI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) throw new Error('AI response error: ' + response.status);

    const text = await response.text();
    return text.trim();
  } catch (err) {
    console.error('AI Error:', err);
    // Fallback ke GET endpoint
    try {
      const url = AI_ENDPOINT + encodeURIComponent(prompt) + '?model=' + AI_MODEL;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Fallback failed');
      const text = await response.text();
      return text.trim();
    } catch (err2) {
      throw new Error('Koneksi ke AI gagal. Cek internet kamu yaa.');
    }
  }
}

/* =====================================================
   1) AI RISET PRODUK
   ===================================================== */
function fillRiset(name, price, usp) {
  document.getElementById('risetName').value = name;
  document.getElementById('risetPrice').value = price;
  document.getElementById('risetUSP').value = usp;
}

async function runRiset() {
  const name = document.getElementById('risetName').value.trim();
  const price = document.getElementById('risetPrice').value.trim();
  const usp = document.getElementById('risetUSP').value.trim();

  if (!name) { toast('⚠️ Isi nama produk dulu', true); return; }

  showLoading('risetResult', '🤖 AI lagi analisis produk', 'Riset target market, pain point & strategi promosi...');

  const priceFmt = price ? 'Rp ' + Number(price.replace(/\D/g,'')).toLocaleString('id-ID') : 'tidak disebutkan';

  const prompt = `Kamu adalah konsultan marketing affiliate ahli di Indonesia (TikTok Shop, Shopee). Analisa produk ini secara mendalam:

PRODUK: ${name}
HARGA: ${priceFmt}
USP/KEUNGGULAN: ${usp || 'belum disebutkan'}

Tolong berikan analisa detail dalam bahasa Indonesia santai (gaya anak muda) dengan format BERIKUT (jangan pakai markdown bintang, langsung text aja):

🎯 KENAPA PRODUK INI BISA LAKU
[3-4 alasan kuat kenapa produk ini punya potensi laku, jelaskan dengan logika marketing]

👥 TARGET AUDIENCE IDEAL
[Profil detail: umur, gender, gaya hidup, di mana mereka aktif di socmed]

😩 PAIN POINT YANG DISOLVE
[3-5 masalah yang produk ini jawab. Specific, bukan generic]

🚀 STRATEGI PROMOSI YANG COCOK
[3-4 strategi konten konkret yang bisa langsung dipake, misal: "Konten before-after pakai produk", "Demo singkat di kamera", dll]

🎬 ANGLE KONTEN VIRAL
[2-3 angle creative yang bisa bikin konten lo viral di TikTok/Reels]

⚠️ POTENSI MASALAH & SOLUSI
[1-2 hal yang mungkin jadi tantangan jualan ini, dan cara handle-nya]

Bahasanya: santai, slang anak muda Indonesia, jangan kaku, jangan pakai bullet points dengan dash (-) tapi tulis dengan paragraph atau angka.`;

  try {
    const result = await askAI(prompt, {
      system: 'Kamu adalah pakar marketing affiliate Indonesia yang berpengalaman. Jawab dengan bahasa santai gaya anak muda Indonesia, tanpa formatting markdown bintang, langsung praktis & actionable.'
    });

    document.getElementById('risetResult').innerHTML = `
      <div class="result-h">
        <h3>📊 AI Analysis: ${escapeHtml(name)}</h3>
        <span class="result-count">${priceFmt}</span>
      </div>

      <div class="ai-output">
        <div class="ai-output-h">
          <span style="display:inline-flex; align-items:center; justify-content:center; width:24px; height:24px; background:var(--gradient-primary); border-radius:6px; font-size:.7rem;">🤖</span>
          AI Marketing Consultant Report
        </div>
        <div class="result-text">${escapeHtml(result)}</div>
        <div class="result-actions" style="margin-top:14px;">
          <button class="copy-btn" onclick="copyText(\`${result.replace(/`/g,'\\`').replace(/\$/g,'\\$')}\`, this)">📋 Salin Hasil</button>
          <button class="copy-btn" onclick="runRiset()">🔄 Generate Ulang</button>
        </div>
      </div>

      <div class="tip-box">
        <strong>💡 Next Step:</strong> Sekarang buka tab <strong>🪝 Hook AI</strong> buat bikin hook video, atau tab <strong>📝 Script AI</strong> buat bikin script videonya.
      </div>
    `;
  } catch (err) {
    showError('risetResult', err.message);
  }
}

/* =====================================================
   2) HOOK GENERATOR AI
   ===================================================== */
async function genHook() {
  const product = document.getElementById('hookProduct').value.trim();
  const audience = document.getElementById('hookAudience').value;
  const pain = document.getElementById('hookPain').value.trim();
  const style = document.getElementById('hookStyle').value;

  if (!product) { toast('⚠️ Isi nama produk dulu', true); return; }

  showLoading('hookResult', '🤖 AI lagi nyusun hook viral', 'Bikin 10 hook custom buat produk lo...');

  const prompt = `Bikinkan saya 10 HOOK VIRAL untuk video TikTok/Reels affiliate marketing dalam bahasa Indonesia santai.

PRODUK: ${product}
TARGET AUDIENCE: ${audience}
PAIN POINT: ${pain || 'masalah umum target audience'}
STYLE HOOK: ${style}

Aturan:
1. Hook MAX 12 kata
2. Pakai bahasa santai, slang anak muda Indonesia (gua, lo, banget, sih, dll)
3. Hook harus bikin audience BERHENTI scroll dalam 1 detik
4. Tiap hook harus DIFFERENT angle, jangan repetitif
5. Pakai emoji kalau cocok (jangan terlalu banyak)

Format jawaban (LANGSUNG list, jangan ada intro):
1. [hook]
2. [hook]
3. [hook]
... sampai 10

Tanpa penjelasan tambahan, langsung daftar nomor 1-10 aja.`;

  try {
    const result = await askAI(prompt, { temperature: 0.95 });
    const hooks = parseNumberedList(result);

    if (hooks.length === 0) throw new Error('AI gak bisa parse hasilnya, coba lagi');

    const tags = ['shock', 'curiosity', 'emotion', 'benefit', 'urgency', 'question'];

    document.getElementById('hookResult').innerHTML = `
      <div class="result-h">
        <h3>🪝 ${hooks.length} Hook AI Custom</h3>
        <span class="result-count">For: ${escapeHtml(product)}</span>
      </div>
      ${hooks.map((h, i) => {
        const tag = tags[i % tags.length];
        return `
          <div class="result-item">
            <div class="result-item-h">
              <span class="result-tag tag-${tag}">${tag}</span>
              <span class="result-tag tag-ai">AI</span>
            </div>
            <div class="result-text">${escapeHtml(h)}</div>
            <div class="result-actions">
              <button class="copy-btn" onclick="copyText(\`${h.replace(/`/g,'\\`').replace(/\$/g,'\\$')}\`, this)">📋 Salin Hook</button>
            </div>
          </div>
        `;
      }).join('')}

      <div class="tip-box">
        <strong>💡 Tips:</strong> Pilih 2-3 hook favorit, buat A/B testing dengan upload video sama tapi hook beda. Lo bakal tau mana yg paling viral.
      </div>
    `;
  } catch (err) {
    showError('hookResult', err.message);
  }
}

function parseNumberedList(text) {
  if (!text) return [];
  // Match "1. xxx", "1) xxx", "1: xxx"
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);
  const items = [];
  for (const line of lines) {
    const m = line.match(/^(?:\*\*)?(\d+)[\.\)\:](?:\*\*)?\s*(.+?)(?:\*\*)?$/);
    if (m) {
      let content = m[2].trim();
      // Clean markdown
      content = content.replace(/\*\*/g, '').replace(/^["']|["']$/g, '');
      if (content) items.push(content);
    }
  }
  // Fallback: kalau gak ke-parse, split berdasarkan newline
  if (items.length < 3) {
    return lines.filter(l => l.length > 5 && !l.startsWith('#')).slice(0, 10);
  }
  return items;
}

/* =====================================================
   3) SCRIPT VIDEO AI
   ===================================================== */
async function genScript() {
  const name = document.getElementById('scriptName').value.trim();
  const dur = document.getElementById('scriptDur').value;
  const benefit = document.getElementById('scriptBenefit').value.trim();
  const style = document.getElementById('scriptStyle').value;

  if (!name) { toast('⚠️ Isi nama produk dulu', true); return; }

  showLoading('scriptResult', '🤖 AI lagi nulis script video', `Bikin script ${dur} detik buat lo...`);

  const prompt = `Buatkan SCRIPT VIDEO TIKTOK/REELS affiliate marketing untuk durasi ${dur} DETIK.

PRODUK: ${name}
MANFAAT UTAMA: ${benefit || 'banyak manfaat'}
STYLE: ${style}

Aturan:
1. Bahasa SANTAI, slang Indonesia anak muda
2. Hook di 3 detik pertama HARUS kuat, bikin orang berhenti scroll
3. Setiap line max 2 detik baca
4. Akhiri dengan CTA jelas (klik keranjang kuning, dll)
5. Sertakan instruksi visual/aksi di setiap line (italic)

FORMAT (langsung jawab, tanpa intro):
0-3s | [DIALOG hook] | NOTE: [aksi/visual]
3-7s | [DIALOG] | NOTE: [aksi/visual]
... sampai durasi habis

Pakai pipe "|" sebagai separator. Setiap baris satu segmen waktu. Buat ${dur === '15' ? '5-6' : (dur === '30' ? '7-9' : '10-12')} segmen total.`;

  try {
    const result = await askAI(prompt, { temperature: 0.85 });
    const lines = parseScript(result);

    if (lines.length === 0) throw new Error('AI gak bisa parse hasilnya, coba lagi');

    document.getElementById('scriptResult').innerHTML = `
      <div class="result-h">
        <h3>📝 Script Video AI</h3>
        <span class="result-count">${dur} Detik · ${escapeHtml(name)}</span>
      </div>

      <div class="script-box">
        <div class="script-box-h">
          <strong>🎬 Full Script Video</strong>
          <button class="copy-btn" onclick="copyText(\`${result.replace(/`/g,'\\`').replace(/\$/g,'\\$')}\`, this)">📋 Salin Semua</button>
        </div>
        <div class="script-box-body">
          ${lines.map(l => `
            <div class="script-line">
              <span class="script-time">${escapeHtml(l.time)}</span>
              <div class="script-text">${escapeHtml(l.dialog)}${l.note ? `<em>📹 ${escapeHtml(l.note)}</em>` : ''}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="result-actions">
        <button class="btn btn-ghost btn-sm" onclick="genScript()">🔄 Generate Ulang</button>
      </div>

      <div class="tip-box" style="margin-top:14px;">
        <strong>💡 Pro Tip:</strong> Generate 2-3x dengan style berbeda biar dapet banyak variasi. AI tiap kali kasih hasil baru.
      </div>
    `;
  } catch (err) {
    showError('scriptResult', err.message);
  }
}

function parseScript(text) {
  if (!text) return [];
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);
  const items = [];

  for (const line of lines) {
    // Format: "0-3s | dialog | NOTE: visual"
    const parts = line.split('|').map(p => p.trim());
    if (parts.length >= 2) {
      const timePart = parts[0].replace(/\*\*/g, '');
      // Make sure first part looks like time
      if (/\d+[\-\u2013].*s/i.test(timePart) || /\d+\s*detik/i.test(timePart) || /\d+s/i.test(timePart)) {
        const time = timePart.replace(/^\d+\.\s*/, '');
        let dialog = parts[1].replace(/\*\*/g, '').replace(/^["']|["']$/g, '');
        let note = '';
        if (parts.length >= 3) {
          note = parts.slice(2).join('|').replace(/^NOTE:\s*/i, '').replace(/\*\*/g, '');
        }
        items.push({ time, dialog, note });
      }
    }
  }
  return items;
}

/* =====================================================
   4) CAPTION + HASHTAG AI
   ===================================================== */
async function genCaption() {
  const product = document.getElementById('capProduct').value.trim();
  const platform = document.getElementById('capPlatform').value;
  const mood = document.getElementById('capMood').value;
  const niche = document.getElementById('capNiche').value;

  if (!product) { toast('⚠️ Isi nama produk dulu', true); return; }

  showLoading('captionResult', '🤖 AI lagi nyusun caption + hashtag', 'Cari hashtag trending terbaik buat lo...');

  const prompt = `Buatkan 3 CAPTION ${platform} dan 1 set HASHTAG untuk affiliate marketing.

PRODUK: ${product}
NICHE: ${niche}
PLATFORM: ${platform}
MOOD: ${mood}

Aturan:
1. Bahasa santai, slang Indonesia gen-z & milenial
2. Caption 4-6 baris, pakai emoji secukupnya
3. Setiap caption beda angle
4. Akhiri dengan CTA halus
5. Hashtag: 15-20 hashtag mix dari yg general & niche-specific, semua relevan & trending di Indonesia

FORMAT (LANGSUNG jawab, tanpa intro):

CAPTION 1:
[isi caption]

CAPTION 2:
[isi caption]

CAPTION 3:
[isi caption]

HASHTAG:
#tag1 #tag2 #tag3 ...`;

  try {
    const result = await askAI(prompt, { temperature: 0.9 });
    const parsed = parseCaptionResult(result);

    document.getElementById('captionResult').innerHTML = `
      <div class="result-h">
        <h3>💬 Caption + Hashtag AI</h3>
        <span class="result-count">${platform.toUpperCase()}</span>
      </div>

      ${parsed.captions.map((cap, i) => {
        const fullText = cap + '\n\n' + parsed.hashtags;
        const tagClass = ['emotion','urgency','benefit','soft','trust'][i % 5];
        return `
          <div class="result-item">
            <div class="result-item-h">
              <span class="result-tag tag-${tagClass}">Caption ${i+1}</span>
              <span class="result-tag tag-ai">AI</span>
            </div>
            <div class="result-text">${escapeHtml(cap)}</div>
            <div class="result-actions">
              <button class="copy-btn" onclick="copyText(\`${cap.replace(/`/g,'\\`').replace(/\$/g,'\\$')}\`, this)">📋 Salin Caption</button>
              <button class="copy-btn" onclick="copyText(\`${fullText.replace(/`/g,'\\`').replace(/\$/g,'\\$')}\`, this)">📋 + Hashtag</button>
            </div>
          </div>
        `;
      }).join('')}

      <div class="ai-output">
        <div class="ai-output-h">
          <span>🏷️</span> Hashtag Pack (Trending)
        </div>
        <div style="margin-bottom:10px;">
          ${parsed.hashtags.split(/\s+/).filter(h => h.startsWith('#')).map(h => `<span class="tag-pill">${escapeHtml(h)}</span>`).join('')}
        </div>
        <button class="copy-btn" onclick="copyText('${parsed.hashtags.replace(/'/g, "\\'")}', this)">📋 Salin Semua Hashtag</button>
      </div>
    `;
  } catch (err) {
    showError('captionResult', err.message);
  }
}

function parseCaptionResult(text) {
  // Split berdasarkan CAPTION 1, CAPTION 2, dst, dan HASHTAG
  const captions = [];
  let hashtags = '';

  // Try parse format
  const captionMatches = text.match(/CAPTION\s*\d+\s*:?\s*([\s\S]*?)(?=CAPTION\s*\d+\s*:?|HASHTAG\s*:?|$)/gi);
  if (captionMatches) {
    captionMatches.forEach(m => {
      const content = m.replace(/^CAPTION\s*\d+\s*:?\s*/i, '').trim().replace(/\*\*/g, '');
      if (content) captions.push(content);
    });
  }

  const hashMatch = text.match(/HASHTAG\s*:?\s*([\s\S]*?)$/i);
  if (hashMatch) {
    hashtags = hashMatch[1].trim().replace(/\*\*/g, '');
  }

  // Fallback
  if (captions.length === 0) {
    captions.push(text);
  }
  if (!hashtags) {
    const hashGrab = text.match(/#[\w\d_]+/g);
    if (hashGrab) hashtags = hashGrab.join(' ');
  }

  return { captions: captions.slice(0, 3), hashtags };
}

/* =====================================================
   5) CTA GENERATOR AI
   ===================================================== */
async function genCTA() {
  const product = document.getElementById('ctaProduct').value.trim();
  const type = document.getElementById('ctaType').value;
  const platform = document.getElementById('ctaPlatform').value;

  if (!product) { toast('⚠️ Isi nama produk dulu', true); return; }

  showLoading('ctaResult', '🤖 AI lagi bikin CTA killer', 'Crafting closing yg bikin orang langsung checkout...');

  const prompt = `Buatkan 10 CTA (Call-To-Action) untuk video affiliate marketing yang bikin penonton LANGSUNG checkout.

PRODUK: ${product}
TIPE CTA: ${type}
PLATFORM: ${platform}

Aturan:
1. CTA pendek, max 15 kata
2. Bahasa santai Indonesia gen-z
3. Sebut "${platform}" atau equivalent (keranjang kuning, link bio, dll) di CTA
4. Setiap CTA HARUS beda angle/feel
5. Pakai emoji secukupnya

FORMAT (langsung list, tanpa intro):
1. [cta]
2. [cta]
... sampai 10

Tanpa penjelasan tambahan.`;

  try {
    const result = await askAI(prompt, { temperature: 0.92 });
    const ctas = parseNumberedList(result);

    if (ctas.length === 0) throw new Error('AI gak bisa parse hasilnya, coba lagi');

    const tags = ['hard', 'soft', 'fomo', 'trust', 'curiosity', 'urgency'];

    document.getElementById('ctaResult').innerHTML = `
      <div class="result-h">
        <h3>🔥 ${ctas.length} CTA Killer AI</h3>
        <span class="result-count">${platform}</span>
      </div>
      ${ctas.map((c, i) => {
        const tag = tags[i % tags.length];
        return `
          <div class="result-item">
            <div class="result-item-h">
              <span class="result-tag tag-${tag}">${tag}</span>
              <span class="result-tag tag-ai">AI</span>
            </div>
            <div class="result-text">${escapeHtml(c)}</div>
            <div class="result-actions">
              <button class="copy-btn" onclick="copyText(\`${c.replace(/`/g,'\\`').replace(/\$/g,'\\$')}\`, this)">📋 Salin</button>
            </div>
          </div>
        `;
      }).join('')}
    `;
  } catch (err) {
    showError('ctaResult', err.message);
  }
}

/* =====================================================
   6) IDE KONTEN AI
   ===================================================== */
async function genIde() {
  const product = document.getElementById('ideProduct').value.trim();
  const platform = document.getElementById('idePlatform').value;
  const goal = document.getElementById('ideGoal').value;

  if (!product) { toast('⚠️ Isi produk/niche dulu', true); return; }

  showLoading('ideResult', '🤖 AI brainstorm ide konten', 'Cari ide creative yg blm banyak orang pake...');

  const prompt = `Buatkan 10 IDE KONTEN VIDEO yang VIRAL untuk affiliate marketing di ${platform}.

PRODUK/NICHE: ${product}
GOAL: ${goal}
PLATFORM: ${platform}

Aturan:
1. Setiap ide harus PRACTICAL (bisa langsung di-shoot)
2. Bahasa santai Indonesia
3. Ide HARUS creative & beda dari yg umum
4. Sebutkan format detail: hook, isi konten, & ending
5. Mix antara reaction, tutorial, story, comparison, dll

FORMAT (langsung list dengan judul + deskripsi singkat 2-3 kalimat):
1. [JUDUL IDE]: [deskripsi konten dalam 2-3 kalimat]
2. [JUDUL IDE]: [deskripsi]
... sampai 10

Tanpa intro / outro tambahan.`;

  try {
    const result = await askAI(prompt, { temperature: 0.95 });
    const ideas = parseNumberedList(result);

    if (ideas.length === 0) throw new Error('AI gak bisa parse hasilnya, coba lagi');

    document.getElementById('ideResult').innerHTML = `
      <div class="result-h">
        <h3>💡 ${ideas.length} Ide Konten Viral</h3>
        <span class="result-count">${platform}</span>
      </div>
      ${ideas.map((idea, i) => `
        <div class="result-item">
          <div class="result-item-h">
            <span class="result-tag tag-curiosity">Ide ${i+1}</span>
            <span class="result-tag tag-ai">AI</span>
          </div>
          <div class="result-text">${escapeHtml(idea)}</div>
          <div class="result-actions">
            <button class="copy-btn" onclick="copyText(\`${idea.replace(/`/g,'\\`').replace(/\$/g,'\\$')}\`, this)">📋 Salin</button>
          </div>
        </div>
      `).join('')}

      <div class="tip-box">
        <strong>💡 Tip:</strong> Pilih 1-2 ide favorit, langsung shooting hari ini juga. Action > Perfection!
      </div>
    `;
  } catch (err) {
    showError('ideResult', err.message);
  }
}

/* =====================================================
   7) TRENDING INSIGHT AI
   ===================================================== */
async function genTrending() {
  const niche = document.getElementById('trendNiche').value;

  showLoading('trendingResult', '🤖 AI lagi riset trending terbaru', 'Analisa trend di niche kamu...');

  const prompt = `Berikan TRENDING INSIGHT terbaru untuk niche affiliate marketing di Indonesia.

NICHE: ${niche}

Berikan info dalam bahasa santai Indonesia, dengan format BERIKUT (tanpa markdown bintang):

🔥 PRODUK YG LAGI VIRAL
[3-5 jenis produk yg lagi rame & laku di TikTok Shop / Shopee Indonesia di niche ini, kasih alasan kenapa rame]

📈 TREND KONTEN YG LAGI NAIK
[3-4 jenis konten/format video yg lagi viral di niche ini]

🎵 SOUND/AUDIO YANG TRENDING
[2-3 sound viral yg cocok dipake untuk niche ini]

💡 ANGLE BARU YG BLM BANYAK ORANG PAKE
[2-3 angle creative yg blm jenuh di pasaran]

⚠️ TREND YANG MULAI JENUH (SKIP!)
[2-3 jenis konten yg udah basi & jangan dipake]

🚀 PREDIKSI TREND 30 HARI KE DEPAN
[1-2 prediksi apa yg bakal viral di niche ini berdasarkan pattern]

Jawab dengan bahasa santai gen-z Indonesia, langsung praktis, jangan formal.`;

  try {
    const result = await askAI(prompt, { temperature: 0.85 });

    document.getElementById('trendingResult').innerHTML = `
      <div class="result-h">
        <h3>📊 Trending Insight</h3>
        <span class="result-count">Real-time</span>
      </div>

      <div class="ai-output">
        <div class="ai-output-h">
          <span style="display:inline-flex; align-items:center; justify-content:center; width:24px; height:24px; background:var(--gradient-primary); border-radius:6px; font-size:.7rem;">📊</span>
          AI Trend Analyst Report
        </div>
        <div class="result-text">${escapeHtml(result)}</div>
        <div class="result-actions" style="margin-top:14px;">
          <button class="copy-btn" onclick="copyText(\`${result.replace(/`/g,'\\`').replace(/\$/g,'\\$')}\`, this)">📋 Salin Hasil</button>
          <button class="copy-btn" onclick="genTrending()">🔄 Refresh Insight</button>
        </div>
      </div>
    `;
  } catch (err) {
    showError('trendingResult', err.message);
  }
}

/* =====================================================
   8) AI MENTOR CHAT
   ===================================================== */
const chatHistory = [
  {
    role: 'system',
    content: `Kamu adalah "Sensei Affiliate", mentor AI affiliate marketing Indonesia yang sangat berpengalaman & santai. Kamu jago di TikTok Shop, Shopee Affiliate, Tokopedia.

Aturan jawab:
1. Bahasa santai gaya gen-z Indonesia (gua, lo, banget, sih, dll)
2. Jawaban HARUS practical & actionable
3. Pakai emoji secukupnya (jangan terlalu banyak)
4. Kalau jawab list, pakai format list jelas dengan angka
5. Kasih contoh real kalau perlu
6. Jangan kasih jawaban panjang banget, max 250 kata
7. Akhiri dengan pertanyaan/CTA yg ngajak diskusi lanjut

Kamu fokus banget ke KONTEN YG VIRAL & STRATEGI YG WORK di Indonesia.`
  }
];

function quickAsk(prompt) {
  document.getElementById('chatInput').value = prompt;
  sendChat();
}

function handleChatKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendChat();
  }
}

async function sendChat() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;

  const messagesEl = document.getElementById('chatMessages');
  const sendBtn = document.getElementById('sendChatBtn');

  // Add user message
  const userMsg = document.createElement('div');
  userMsg.className = 'chat-msg user';
  userMsg.textContent = text;
  messagesEl.appendChild(userMsg);

  // Add loading message
  const loadingMsg = document.createElement('div');
  loadingMsg.className = 'chat-msg bot loading';
  loadingMsg.innerHTML = '<span class="loading-dots"><span>•</span><span>•</span><span>•</span></span> Sensei lagi mikir...';
  messagesEl.appendChild(loadingMsg);

  input.value = '';
  sendBtn.disabled = true;
  messagesEl.scrollTop = messagesEl.scrollHeight;

  // Add to history
  chatHistory.push({ role: 'user', content: text });

  try {
    const response = await fetch(AI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: chatHistory,
        model: AI_MODEL,
        temperature: 0.85,
        jsonMode: false
      })
    });

    if (!response.ok) throw new Error('AI error');

    const reply = (await response.text()).trim();
    chatHistory.push({ role: 'assistant', content: reply });

    // Replace loading with reply
    loadingMsg.classList.remove('loading');
    loadingMsg.textContent = reply;

  } catch (err) {
    loadingMsg.classList.remove('loading');
    loadingMsg.textContent = '⚠️ Aduh, gw lagi gak bisa nyambung. Coba kirim ulang yaa.';
  } finally {
    sendBtn.disabled = false;
    messagesEl.scrollTop = messagesEl.scrollHeight;
    input.focus();
  }
}

/* ===== AUTO RESIZE TEXTAREA ===== */
const chatInput = document.getElementById('chatInput');
if (chatInput) {
  chatInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
  });
}

/* ===== INIT ===== */
console.log('🚀 RisetCuan AI loaded · Powered by Pollinations.ai');
