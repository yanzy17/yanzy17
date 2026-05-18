/* ============================================
   RisetCuan Pro - Tools Riset Affiliate
   ============================================ */

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
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2200);
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
  });
}

/* ===== MODAL ===== */
function openBuyModal() {
  document.getElementById('buyModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeBuyModal(e) {
  if (e && e.target.id !== 'buyModal' && !e.currentTarget.classList.contains('modal-close')) return;
  document.getElementById('buyModal').classList.remove('open');
  document.body.style.overflow = '';
}

/* =====================================================
   1) RISET PRODUK ANALYZER
   ===================================================== */
const RISET_DB = {
  skincare: {
    why: [
      'Skincare adalah industri yang selalu jalan — wanita rela budget bulanan demi kulit',
      'Pain point jelas: jerawat, kusam, beruntusan, makeup susah dibersihin',
      'Hasil before/after sangat visual & gampang di-konten-in',
      'Repeat order tinggi, jadi affiliate-nya cuan terus'
    ],
    audience: 'Wanita 17-35 thn, students, fresh graduate, ibu muda. Mostly aktif di TikTok & Instagram',
    pain: ['Jerawat & bekas jerawat', 'Kulit kusam & gak glowing', 'Beruntusan', 'Makeup susah hilang', 'Pori-pori besar', 'Budget skincare boros'],
    promo: ['Konten before/after wajah', 'Storytelling perjalanan kulit', 'Review jujur review setelah 7 hari', 'Hack pemakaian (tutorial)', 'Compare sama produk mahal'],
    hook: 'Skincare ini bikin gua nyesel kenapa baru tau sekarang...'
  },
  'fashion-wanita': {
    why: [
      'Fashion wanita = repeat customer queens. Beli baju gak pernah cukup',
      'Outfit of the day (OOTD) adalah konten favorit di socmed',
      'Visual appeal tinggi — gampang di-konten-in',
      'Margin gede, komisi affiliate juga lumayan'
    ],
    audience: 'Wanita 17-35 thn, gaya hidup urban, suka update tren, ibu muda yang tetep mau stylish',
    pain: ['Bingung mix & match', 'Bahan gerah / panas', 'Gak fit di body', 'Outfit basi cepet', 'Harga butik mahal'],
    promo: ['OOTD haul', '1 baju 5 outfit (mix match)', 'Bandingin harga butik vs olshop', 'Try-on review', 'Cocok buat acara apa'],
    hook: 'Baju cuma 50rban tapi keliatan kayak yg di butik 500rb!'
  },
  'fashion-pria': {
    why: [
      'Pria gak ribet — nemu yg cocok langsung beli banyak',
      'Konten "outfit pria simple" lagi naik di TikTok',
      'Margin lebih stabil, retur jarang'
    ],
    audience: 'Pria 18-35 thn, mahasiswa, karyawan muda, yg lagi belajar fashion',
    pain: ['Gak tau mix & match', 'Pengen keliatan rapih tapi simple', 'Bahan panas', 'Gak pede sama outfit'],
    promo: ['Outfit anti-norak', 'Bahan apa cocok buat iklim Indo', 'Outfit ke kondangan/kantor/jalan', 'Tutorial mix piece'],
    hook: 'Cowok HARUS punya 5 baju ini biar gak salah outfit lagi'
  },
  'fashion-anak': {
    why: [
      'Mom shopping = repeat order paling tinggi di marketplace',
      'Anak cepet gede, mom rajin beli baju baru',
      'Emak-emak gampang ke-trigger sama harga murah + kualitas',
      'Word of mouth di grup arisan/wa kuat banget'
    ],
    audience: 'Ibu muda 23-40 thn, punya anak balita-SD, aktif di FB/TikTok, sensitif harga',
    pain: ['Baju anak cepet kekecilan', 'Bahan bikin gatel', 'Mahal di mall', 'Pengen anak gaya', 'Susah cari size pas'],
    promo: ['Try on di anak (real)', 'Harga di mall vs di sini', 'Bahan adem buat anak', 'Tahan cuci berapa kali', 'Foto anak pake produknya'],
    hook: 'Ibu-ibu, baju anak segini cuma 30rban... kualitasnya 😱'
  },
  hijab: {
    why: [
      'Pasar muslim Indonesia = pasar terbesar di dunia',
      'Hijab = daily wear, beli berkali-kali, banyak warna',
      'Konten "tutorial hijab" gampang viral',
      'Repeat customer tinggi, brand loyal'
    ],
    audience: 'Muslimah 17-40 thn, pelajar, mahasiswa, ibu, karyawan, banyak di TikTok & IG',
    pain: ['Bahan panas & gerah', 'Susah dibentuk', 'Warna pudar abis dicuci', 'Tipis nerawang', 'Berat di kepala'],
    promo: ['Tutorial style hijab', 'Bahan cooltech (dingin)', 'Try-on multi warna', 'Hijab buat acara apa', 'Hijab anti-sliding'],
    hook: 'Bahan hijab ini DINGIN banget, di luar 35° tetep adem...'
  },
  kuliner: {
    why: [
      'Makanan = comfort spending. Mood jelek? Order',
      'Konten ASMR makan = high engagement',
      'Snack viral cepet trending di TikTok',
      'Impulse buy tinggi'
    ],
    audience: 'Semua umur, terutama 15-30 thn, content lover, gen-z & millennial',
    pain: ['Bosen makanan biasa', 'Lapar tengah malem', 'Pengen snack premium tapi murah', 'Cari oleh-oleh kekinian'],
    promo: ['ASMR review', 'Reaction first bite', 'Bandingin sama brand mahal', 'Story pengalaman makan', 'Rekomen buat moment apa'],
    hook: 'Cobain snack ini malem-malem... awas nagih!'
  },
  'alat-rumah': {
    why: [
      'Pasar emak-emak yg gak kenal jenuh',
      'Tools "yg emak gak tau dia butuh" — viral di TikTok',
      'Konten "alat genius" auto trending',
      'Repeat order tinggi, satu rumah butuh banyak'
    ],
    audience: 'Ibu rumah tangga 25-45 thn, ibu muda, masyarakat suburban, di TikTok & FB',
    pain: ['Kerjaan rumah ribet', 'Boros waktu beresin', 'Dapur berantakan', 'Cuci piring males', 'Lemari gak rapih'],
    promo: ['Demo alat-nya', 'Before-after rapih', 'Hack hidup lebih gampang', '5 alat dapur wajib', 'Tutorial pemakaian'],
    hook: 'Alat ini bikin gua nyesel gak beli dari dulu...'
  },
  elektronik: {
    why: [
      'Tech-savvy generation lapar gadget baru',
      'Unboxing & review konten kuat',
      'Pria mau spend di tech, wanita mau di accessories'
    ],
    audience: 'Pria & wanita 18-35 thn, mahasiswa, fresh grad, tech enthusiast',
    pain: ['Hp lemot', 'Charger lama', 'Earphone mahal di brand besar', 'Gadget gampang rusak'],
    promo: ['Unboxing detail', 'Stress test produk', 'Bandingin sama brand besar', 'Review jujur after 1 minggu'],
    hook: 'Earphone 50rb ini ngalahin yg 2jt... GILA!'
  },
  kesehatan: {
    why: [
      'Setelah pandemi, awareness kesehatan tinggi',
      'Suplemen & vitamin = kebutuhan repeat',
      'Pasar gemuk, dari Gen-Z sampai lansia'
    ],
    audience: 'Dewasa 25-50 thn, parents, pekerja, fitness enthusiast',
    pain: ['Lelah terus', 'Daya tahan tubuh lemah', 'Susah tidur', 'Gampang sakit', 'Berat badan'],
    promo: ['Pengalaman pakai 2 minggu', 'Cara minum yg benar', 'Penjelasan kandungan', 'Cocok buat siapa'],
    hook: 'Lelah terus padahal udah istirahat? Coba ini...'
  },
  bayi: {
    why: [
      'Mom paling rela spend buat anak',
      'Trust factor tinggi — sekali cocok, brand setia',
      'Repeat order paling kenceng (pampers, susu, dll)'
    ],
    audience: 'Mom muda 22-38 thn, baru jadi ibu, suka research detail',
    pain: ['Anak gampang ruam', 'Susah cari produk aman', 'Mahal di apotek', 'Bingung pilih merk'],
    promo: ['Pengalaman pakai di anak', 'Aman atau gak (cek detail)', 'Mom-friendly tutorial', 'Bandingin sama merk mahal'],
    hook: 'Mom, produk ini AMAN buat newborn dan harganya...'
  },
  hobi: {
    why: [
      'Hobi = passion spending. Gak peduli harga klo udah suka',
      'Niche audience tapi loyalty tinggi'
    ],
    audience: 'Tergantung hobi, mostly 15-35 thn, niche-specific',
    pain: ['Susah cari koleksi', 'Mainan kw kualitas jelek', 'Mahal di toko fisik'],
    promo: ['Showcase koleksi', 'Compare original vs kw', 'Tutorial pakai', 'Reaction unboxing'],
    hook: 'Akhirnya nemu produk yg gua cari berbulan-bulan...'
  },
  aksesoris: {
    why: [
      'Impulse buy raja — harga murah, decision cepet',
      'Visual sangat strong di IG & TikTok',
      'Cocok buat add-on order'
    ],
    audience: 'Wanita 16-35 thn, fashion enthusiast',
    pain: ['Aksesoris cepet karat', 'Bosen sama yg itu-itu aja', 'Tampil beda di kondangan'],
    promo: ['Try-on multi style', 'Outfit pairing', 'Compare sama brand mahal'],
    hook: 'Aksesoris 30rb ini keliatan jutaan... fix order!'
  }
};

function runRiset() {
  const name = document.getElementById('risetName').value.trim();
  const cat = document.getElementById('risetCat').value;
  const price = document.getElementById('risetPrice').value.trim();
  const usp = document.getElementById('risetUSP').value.trim();

  if (!name) { toast('⚠️ Isi nama produk dulu'); return; }

  const data = RISET_DB[cat];
  const priceFmt = price ? 'Rp ' + Number(price.replace(/\D/g,'')).toLocaleString('id-ID') : '';

  const html = `
    <div class="result-h">
      <h3>📊 Hasil Riset: ${escapeHtml(name)}</h3>
      <span class="result-count">${priceFmt}</span>
    </div>

    <div class="insight-card">
      <h4>🎯 Kenapa Produk Ini Bisa Laku?</h4>
      <ul>
        ${data.why.map(w => `<li>${w}</li>`).join('')}
      </ul>
    </div>

    <div class="insight-card">
      <h4>👥 Target Audience Ideal</h4>
      <p>${data.audience}</p>
    </div>

    <div class="insight-card">
      <h4>😩 Pain Point yang Disolve</h4>
      <ul>
        ${data.pain.map(p => `<li>${p}</li>`).join('')}
      </ul>
    </div>

    <div class="insight-card">
      <h4>🚀 Strategi Promosi yang Cocok</h4>
      <ul>
        ${data.promo.map(p => `<li>${p}</li>`).join('')}
      </ul>
    </div>

    <div class="insight-card">
      <h4>🪝 Contoh Hook Buat Produk Ini</h4>
      <p style="font-style:italic; font-size:.95rem;">"${data.hook}"</p>
      <button class="copy-btn" style="margin-top:10px;" onclick="copyText('${data.hook.replace(/'/g, "\\'")}', this)">📋 Salin Hook</button>
    </div>

    ${usp ? `
    <div class="insight-card">
      <h4>⭐ USP / Keunggulan: ${escapeHtml(usp)}</h4>
      <p>Manfaatin USP ini di hook & caption — buat audience tau apa yg bikin produk ini SPESIAL dibanding kompetitor.</p>
    </div>` : ''}

    <div class="insight-card" style="background: linear-gradient(135deg, rgba(251,191,36,.1), rgba(245,158,11,.05)); border-color: rgba(251,191,36,.3);">
      <h4>💡 Tips Konten Pertama Kamu</h4>
      <ul>
        <li>Pake 3 detik pertama buat HOOK kuat (lihat tab Hook Generator)</li>
        <li>Tunjukin produk dari sudut aesthetic, jangan asal foto</li>
        <li>Kasih bukti (review, before-after, demo)</li>
        <li>Ending pake CTA jelas + link affiliate (lihat tab CTA)</li>
        <li>Caption: pancing emosi dulu, baru jualan (lihat tab Caption)</li>
      </ul>
    </div>
  `;

  document.getElementById('risetResult').innerHTML = html;
  document.getElementById('risetResult').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* =====================================================
   2) HOOK GENERATOR
   ===================================================== */
const HOOK_TEMPLATES = {
  shock: [
    'Gak nyangka [PRODUK] ini bisa ngubah hidup gua...',
    'Beli [PRODUK] cuma karena iseng, eh ternyata...',
    '[PRODUK] segini murah TAPI hasilnya kayak yg jutaan!',
    'Stop scroll! Ini [PRODUK] yg lagi viral dan WORTH IT',
    'Gua syok pas tau harga [PRODUK] ini...',
    '[PRODUK] yg bikin temen-temen gua semua nanya beli dimana',
    'Awas, jangan kebanyakan beli [PRODUK] ini... NAGIH!'
  ],
  question: [
    'Lagi cari [PRODUK] yg [PAIN]? Coba ini deh...',
    'Pernah ngerasain [PAIN]? Gua punya solusi...',
    'Kamu juga ngalamin [PAIN]? Ini yg gua pake!',
    'Mau tau kenapa banyak orang switch ke [PRODUK] ini?',
    'Tau gak kenapa [PRODUK] ini lagi rame?',
    'Kapan terakhir kalian nemu [PRODUK] sebagus ini?',
    'Yang masih [PAIN], wajib coba [PRODUK] ini sebelum nyesel'
  ],
  curiosity: [
    'Rahasia gua biar [BENEFIT]... padahal cuma pake [PRODUK]',
    'Gua udah test 10 [PRODUK] berbeda, ini pemenang nyata',
    'Yg gak banyak orang tau soal [PRODUK]...',
    'Sebelum kamu beli [PRODUK], wajib nonton ini dulu',
    'Ini alesan kenapa gua gak mau pake [PRODUK] lain lagi',
    'Trick simple pake [PRODUK] yg orang jarang tau...',
    'Kenapa [PRODUK] ini bisa jadi best seller? Ini alesannya...'
  ],
  problem: [
    'Capek [PAIN] terus? Coba [PRODUK] ini, gak nyesel',
    'Yg masih [PAIN], stop! Lo butuh [PRODUK] ini',
    'Udah coba berbagai cara tapi tetep [PAIN]? Ini solusinya',
    '[PAIN] berbulan-bulan, akhirnya nemu [PRODUK] yg work!',
    'Gak usah ribet, [PAIN] kamu bisa kelar pake [PRODUK] ini',
    'Dulu gua [PAIN] juga... sampe nemu [PRODUK] ini'
  ],
  benefit: [
    '[PRODUK] yg bikin [BENEFIT] dalam 7 hari!',
    'Pake [PRODUK] ini bisa [BENEFIT] tanpa ribet',
    '1 [PRODUK], banyak manfaat: [BENEFIT]',
    'Ini [PRODUK] favorit gua karena [BENEFIT]',
    'Cuma butuh 1 produk buat [BENEFIT] - [PRODUK] ini!',
    'Kalo mau [BENEFIT], ini [PRODUK] yg wajib kamu punya'
  ],
  story: [
    'Awalnya gua skeptis sama [PRODUK]... eh tapi...',
    'Cerita gua sebelum dan sesudah pake [PRODUK]...',
    'Ini cerita kenapa gua addicted sama [PRODUK]',
    'Pengalaman 30 hari pake [PRODUK], hasilnya...',
    'Dulu temen gua rekomen [PRODUK] ini, awalnya gua ngeyel...',
    'Gua mau cerita serius soal [PRODUK] yg ngubah keseharian gua'
  ],
  urgency: [
    'BURUAN! [PRODUK] ini lagi promo gila-gilaan',
    'Stok tipis bgt, [PRODUK] viral banget di TikTok',
    'Last chance! Harga [PRODUK] segini cuma sampe besok',
    'Yg belum punya [PRODUK] ini, jangan nyesel kalo abis',
    'Diskon [PRODUK] cuma sampe malam ini! Auto check out',
    'Gw kasih tau cepet, [PRODUK] ini lagi sale 50%!'
  ]
};

function genHook() {
  const product = document.getElementById('hookProduct').value.trim() || 'produk ini';
  const style = document.getElementById('hookStyle').value;
  const pain = document.getElementById('hookPain').value.trim() || 'masalah ini';
  const benefit = pain ? pain.replace(/^susah/i, 'bisa').replace(/^sulit/i,'gampang') : 'hasil maksimal';

  let templates = [];
  if (style === 'all') {
    Object.values(HOOK_TEMPLATES).forEach(arr => templates = templates.concat(arr));
  } else {
    templates = HOOK_TEMPLATES[style] || [];
  }

  // Shuffle & take 12
  templates = shuffleArr(templates).slice(0, 12);

  const styleLabel = {
    shock: 'shock', question: 'question', curiosity: 'curiosity',
    problem: 'emotion', benefit: 'benefit', story: 'curiosity',
    urgency: 'urgency'
  };

  const styleClass = (orig) => {
    for (const [key, arr] of Object.entries(HOOK_TEMPLATES)) {
      if (arr.includes(orig)) return styleLabel[key] || 'curiosity';
    }
    return 'curiosity';
  };

  const html = `
    <div class="result-h">
      <h3>🪝 ${templates.length} Hook Siap Pake</h3>
      <span class="result-count">Klik 📋 buat copy</span>
    </div>
    ${templates.map(t => {
      const filled = t
        .replace(/\[PRODUK\]/g, product)
        .replace(/\[PAIN\]/g, pain)
        .replace(/\[BENEFIT\]/g, benefit);
      const cls = styleClass(t);
      return `
        <div class="result-item">
          <div class="result-item-h">
            <span class="result-tag tag-${cls}">${cls}</span>
          </div>
          <div class="result-text">${escapeHtml(filled)}</div>
          <div class="result-actions">
            <button class="copy-btn" onclick="copyText('${filled.replace(/'/g, "\\'")}', this)">📋 Salin</button>
          </div>
        </div>
      `;
    }).join('')}
  `;
  document.getElementById('hookResult').innerHTML = html;
  document.getElementById('hookResult').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* =====================================================
   3) SCRIPT VIDEO GENERATOR
   ===================================================== */
function genScript() {
  const name = document.getElementById('scriptName').value.trim() || 'produk ini';
  const dur = document.getElementById('scriptDur').value;
  const benefit = document.getElementById('scriptBenefit').value.trim() || 'manfaatnya banyak';
  const style = document.getElementById('scriptStyle').value;

  const scripts = generateScripts(name, dur, benefit, style);

  const html = `
    <div class="result-h">
      <h3>📝 ${scripts.length} Script Versi</h3>
      <span class="result-count">${dur}s</span>
    </div>
    ${scripts.map((s, i) => `
      <div class="script-box">
        <div class="script-box-h">
          <strong>🎬 Script ${i+1}: ${s.title}</strong>
          <button class="copy-btn" onclick="copyText(\`${s.lines.map(l => l.time + ' - ' + l.text).join('\\n').replace(/`/g,'\\`')}\`, this)">📋 Salin Semua</button>
        </div>
        <div class="script-box-body">
          ${s.lines.map(l => `
            <div class="script-line">
              <span class="script-time">${l.time}</span>
              <div class="script-text">${escapeHtml(l.text)}${l.note ? `<br><em>// ${escapeHtml(l.note)}</em>` : ''}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('')}
  `;
  document.getElementById('scriptResult').innerHTML = html;
  document.getElementById('scriptResult').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function generateScripts(name, dur, benefit, style) {
  const scripts = [];

  // Script 1 - Berdasarkan style
  if (style === 'review') {
    if (dur === '15') {
      scripts.push({
        title: 'Review Cepet 15 Detik',
        lines: [
          { time: '0-3s', text: `Gua review jujur ${name}. Worth it gak?`, note: 'Hook + close up produk' },
          { time: '3-8s', text: `Pake 3 hari, dan hasilnya... ${benefit}!`, note: 'Tampilkan demo singkat' },
          { time: '8-12s', text: `Untuk harga segini, no debat ini RECOMMENDED.`, note: 'Pegang produk + senyum' },
          { time: '12-15s', text: `Link di keranjang kuning, buruan stok terbatas!`, note: 'Tunjuk keranjang' }
        ]
      });
    } else if (dur === '30') {
      scripts.push({
        title: 'Review Lengkap 30 Detik',
        lines: [
          { time: '0-3s', text: `Sebelum kamu beli ${name}, nonton dulu review jujur gua...`, note: 'HOOK kuat + face cam' },
          { time: '3-8s', text: `Awalnya gua skeptis, soalnya harganya beda jauh sama brand mahal.`, note: 'Pegang produk' },
          { time: '8-15s', text: `Tapi setelah pake seminggu, ${benefit} - gua kaget!`, note: 'Demo / before after' },
          { time: '15-22s', text: `Yg paling gua suka: kemasannya rapi, bahannya berkualitas, dan yg paling penting... HARGANYA!`, note: 'Showcase detail produk' },
          { time: '22-27s', text: `Kalau lagi cari produk yg work tanpa nguras dompet, ini jawabannya.`, note: 'Smile + thumbs up' },
          { time: '27-30s', text: `Klik keranjang kuning sebelum kehabisan!`, note: 'CTA + tunjuk' }
        ]
      });
    } else {
      scripts.push({
        title: 'Review Detail 60 Detik',
        lines: [
          { time: '0-3s', text: `Stop! Sebelum kamu beli ${name}, kalian wajib nonton ini.`, note: 'HOOK shock + close up' },
          { time: '3-10s', text: `Gua udah test ${name} selama 14 hari, dan jujur, gua kaget banget sama hasilnya.`, note: 'Story tone' },
          { time: '10-20s', text: `Day 1: kondisi awal masih biasa. Day 7: udah mulai berasa ${benefit}.`, note: 'Tampilkan timeline' },
          { time: '20-32s', text: `Day 14: gua langsung order lagi 3 biji buat keluarga, soalnya bener-bener PUAS.`, note: 'Real reaction' },
          { time: '32-45s', text: `Buat kalian yg masih nimbang-nimbang... percaya deh, ini worth banget. Apalagi sekarang lagi diskon!`, note: 'Pegang produk + smile' },
          { time: '45-55s', text: `Kelebihan: ${benefit}, kemasan rapi, harga ramah dompet. Minus? Stok cepet abis.`, note: 'Recap manfaat' },
          { time: '55-60s', text: `Buruan, link langsung ke produknya di keranjang kuning!`, note: 'CTA tegas' }
        ]
      });
    }
  } else if (style === 'problem') {
    scripts.push({
      title: 'Solve Problem Style',
      lines: [
        { time: '0-3s', text: `Capek banget kan kalau ${benefit.startsWith('bisa')?benefit.replace('bisa ','susah '):'masalah ini gak kelar-kelar'}?`, note: 'Hook problem + ekspresi capek' },
        { time: '3-8s', text: `Gua udah coba berbagai cara, mahal-murah, semua gak ngefek.`, note: 'Curhat tone' },
        { time: '8-15s', text: `Sampai akhirnya gua nemu ${name}, dan boom - ${benefit}.`, note: 'Reveal produk + senyum' },
        { time: '15-22s', text: `Caranya gampang banget, tinggal pake aja, hasilnya langsung kerasa.`, note: 'Demo simple' },
        ...(dur !== '15' ? [
          { time: '22-28s', text: `Yg paling gila harganya cuma segitu, gak masuk akal!`, note: 'Reaction' }
        ] : []),
        { time: dur === '15' ? '12-15s' : (dur === '30' ? '28-30s' : '28-50s'), text: `Klik link di keranjang kuning sebelum nyesel!`, note: 'CTA' }
      ]
    });
  } else if (style === 'story') {
    scripts.push({
      title: 'Cerita Pengalaman',
      lines: [
        { time: '0-4s', text: `Cerita gua nemu ${name} di TikTok awalnya skeptis...`, note: 'Hook story' },
        { time: '4-12s', text: `Tapi karena banyak yg rekomen, akhirnya gua coba aja.`, note: 'Story building' },
        { time: '12-20s', text: `Pas dateng, langsung dipake. Dan hasilnya? ${benefit}!`, note: 'Demo / unboxing' },
        ...(dur === '60' ? [
          { time: '20-35s', text: `Sekarang gua udah repeat order ke-3, soalnya emang bagus banget.`, note: 'Build trust' },
          { time: '35-48s', text: `Buat kalian yg masih ragu, gua jamin ini gak akan nyesel.`, note: 'Persuade' }
        ] : []),
        { time: dur === '15' ? '12-15s' : (dur === '30' ? '20-30s' : '48-60s'), text: `Cek aja sendiri, link di keranjang kuning!`, note: 'CTA' }
      ]
    });
  } else if (style === 'comparison') {
    scripts.push({
      title: 'Bandingin Produk',
      lines: [
        { time: '0-3s', text: `${name} vs brand mahal yg sering iklan, mana yg lebih worth?`, note: 'Hook bandingin' },
        { time: '3-10s', text: `Brand mahal = 500rb. ${name} = 50rb-an. 10x lipat lebih murah!`, note: 'Show harga' },
        { time: '10-18s', text: `Tapi pas dipake... hasilnya MIRIP! Gua tes sendiri dan ${benefit}.`, note: 'Demo bandingin' },
        ...(dur !== '15' ? [
          { time: '18-25s', text: `Bedanya? Cuma kemasan & branding. Isinya hampir sama!`, note: 'Reveal' }
        ] : []),
        { time: dur === '15' ? '12-15s' : (dur === '30' ? '25-30s' : '25-55s'), text: `Buat apa beli yg mahal kalau yg murah ngasih hasil sama?`, note: 'Persuade + CTA' }
      ]
    });
  } else if (style === 'haul') {
    scripts.push({
      title: 'Haul / Unboxing',
      lines: [
        { time: '0-3s', text: `Hari ini gua haul ${name} dari TikTok shop!`, note: 'Hook + box di tangan' },
        { time: '3-10s', text: `Packaging rapi banget, dibubble wrap, bahkan dikasih bonus!`, note: 'Unboxing slow' },
        { time: '10-18s', text: `Pas dibuka... wow, kualitasnya jauh dari ekspektasi gua.`, note: 'Reaction asli' },
        ...(dur !== '15' ? [
          { time: '18-25s', text: `Langsung gua coba pake. ${benefit} banget!`, note: 'Demo first try' }
        ] : []),
        { time: dur === '15' ? '12-15s' : (dur === '30' ? '25-30s' : '25-55s'), text: `Worth it banget. Yg mau, link di keranjang kuning!`, note: 'CTA' }
      ]
    });
  } else {
    // tips & trick
    scripts.push({
      title: 'Tips & Trick',
      lines: [
        { time: '0-3s', text: `Trick simple pake ${name} yg orang jarang tau...`, note: 'Hook curiosity' },
        { time: '3-10s', text: `Caranya: dipake step ini, hasilnya langsung beda!`, note: 'Tutorial step 1' },
        { time: '10-18s', text: `Trick keduanya, kombinasiin sama ini biar ${benefit}.`, note: 'Tutorial step 2' },
        ...(dur !== '15' ? [
          { time: '18-25s', text: `Hasilnya? Kalian bisa lihat sendiri di kamera ini.`, note: 'Show result' }
        ] : []),
        { time: dur === '15' ? '12-15s' : (dur === '30' ? '25-30s' : '25-55s'), text: `Mau coba? Link produknya di keranjang kuning!`, note: 'CTA' }
      ]
    });
  }

  // Script versi 2 - Generic alternatif
  scripts.push({
    title: 'Versi Cerita Pendek (Alternatif)',
    lines: [
      { time: '0-3s', text: `POV: kalian baru nemu ${name} dan langsung jatuh cinta`, note: 'POV style hook' },
      { time: '3-10s', text: `Awalnya iseng order, ternyata ${benefit}!`, note: 'Reveal' },
      ...(dur !== '15' ? [
        { time: '10-18s', text: `Gak nyangka harga segini bisa sebagus ini.`, note: 'Reaction' },
        { time: '18-25s', text: `Sekarang udah jadi favorite gua, recommended banget!`, note: 'Endorsement' }
      ] : []),
      { time: dur === '15' ? '10-15s' : (dur === '30' ? '25-30s' : '25-60s'), text: `Cek di keranjang kuning, link langsung jadi!`, note: 'CTA' }
    ]
  });

  return scripts;
}

/* =====================================================
   4) CAPTION GENERATOR
   ===================================================== */
const CAPTION_DB = {
  curhat: [
    'Capek banget [PAIN] yg gak kelar-kelar... ternyata solusinya cuma di [PRODUK] ini 🥲\n\nBuat kalian yg ngalamin hal sama, swipe up cek deh, harga gak bikin kantong jebol.',
    'Gak nyangka [PRODUK] ini ngubah hidup gua banget...\n\nDulu [PAIN], sekarang udah enggak lagi. Worth banget cobain. ✨'
  ],
  excited: [
    '🔥🔥🔥 [PRODUK] terbaru ini WAJIB kalian punya!\n\nKenapa? Karena [BENEFIT] tanpa harus ribet & mahal!\n\nSwipe & langsung add to cart yaa 🛒💸',
    'OMG! Akhirnya gua nemu [PRODUK] yg PERFECT! 😍\n\n✅ [BENEFIT]\n✅ Harga ramah dompet\n✅ Quality kayak yg mahal\n\nFix repeat order!'
  ],
  info: [
    'INFO PENTING tentang [PRODUK]:\n\n📌 Cara pakai: simple banget\n📌 Cocok buat: semua\n📌 Hasil: [BENEFIT]\n📌 Tahan: pemakaian rutin\n\nSave dulu sebelum lupa! 📚',
    'Gua jelasin kenapa [PRODUK] ini bisa work:\n\n1. Bahan/komposisinya berkualitas\n2. Sudah teruji sama banyak user\n3. Hasil [BENEFIT] real\n4. Harga affordable\n\nAda yg mau nanya? Komen ya 💬'
  ],
  rekomen: [
    'REKOMEN [PRODUK] dari gua! 💯\n\nUdah pake berkali-kali, hasil konsisten [BENEFIT].\n\nKalau kalian lagi nyari produk yg work, ini jawabannya. Cek keranjang kuning ⚡',
    'Top 1 favorite gua: [PRODUK] ✨\n\nKenapa? Karena [BENEFIT] dan gak nguras dompet!\n\nKalian wajib coba, gua jamin gak nyesel 🥰'
  ],
  ajakin: [
    'GAES, kalian harus tau ini!\n\n[PRODUK] yg lagi viral di TikTok ini, beneran [BENEFIT]!\n\nGua udah buktiin sendiri, sekarang giliran kalian. Buruan order sebelum stok abis! 🏃‍♀️💨',
    'Yang lagi cari [PRODUK], STOP scrolling!\n\nIni dia yg kalian butuhin. [BENEFIT] cuma pake ini doang.\n\nKlik keranjang kuning yaaa, jangan sampe nyesel 💖'
  ]
};

const HASHTAG_DB = {
  skincare: ['#skincareindonesia', '#skincaremurah', '#glowingskin', '#tipsskincare', '#kulitglowing', '#skincaretiktok', '#viraltiktok', '#beautyhacks', '#skincaregirl', '#skincarejeglongan', '#fyp', '#fypシ'],
  fashion: ['#ootd', '#ootdindo', '#fashiontiktok', '#bajumurah', '#outfitinspo', '#fashionhack', '#outfittiktok', '#mixandmatch', '#fashiongirl', '#fyp', '#fypシ', '#viraltiktok'],
  hijab: ['#hijabers', '#hijabmurah', '#hijabtiktok', '#tutorialhijab', '#hijabstyle', '#muslimah', '#fashionhijab', '#jilbabbergo', '#hijabviral', '#fyp', '#fypシ', '#muslimahindonesia'],
  kuliner: ['#kulinertiktok', '#snackviral', '#makananenak', '#foodietiktok', '#snacknagih', '#kulinerindo', '#asmrfood', '#mukbang', '#snackmurah', '#fyp', '#fypシ', '#viralfood'],
  rumah: ['#alatdapur', '#perlengkapanrumah', '#rumahminimalis', '#tipsrumah', '#dapurminimalis', '#rumahaesthetic', '#hackdapur', '#tipsibu', '#emakemak', '#fyp', '#fypシ', '#viraltiktok'],
  bayi: ['#mombabies', '#perlengkapanbayi', '#momtiktok', '#bayilucu', '#momindo', '#tipsmom', '#mombloggers', '#newbornessentials', '#parentingtiktok', '#fyp', '#fypシ', '#momlife'],
  elektronik: ['#gadgetmurah', '#tiktokshop', '#reviewgadget', '#elektronikmurah', '#unboxing', '#techtiktok', '#gadgetviral', '#earphonemurah', '#fyp', '#fypシ', '#viraltiktok', '#techreview'],
  kesehatan: ['#tipskesehatan', '#suplementiktok', '#vitaminmurah', '#imunitas', '#hidupsehat', '#kesehatanviral', '#vitaminbagus', '#tipssehat', '#fyp', '#fypシ', '#viralhealth']
};

function genCaption() {
  const product = document.getElementById('capProduct').value.trim() || 'produk ini';
  const platform = document.getElementById('capPlatform').value;
  const mood = document.getElementById('capMood').value;
  const niche = document.getElementById('capNiche').value;

  const captions = CAPTION_DB[mood] || CAPTION_DB.rekomen;
  const hashtags = HASHTAG_DB[niche] || HASHTAG_DB.skincare;

  const filledCaptions = captions.map(c =>
    c.replace(/\[PRODUK\]/g, product)
     .replace(/\[PAIN\]/g, 'masalah yg sama')
     .replace(/\[BENEFIT\]/g, 'hasilnya wow')
  );

  // Build hashtag set
  const baseTags = hashtags.slice(0, 8);
  const platformTags = {
    tiktok: ['#tiktokshop', '#fypシ゚viral', '#tiktokshopindonesia'],
    ig: ['#instagramreels', '#reelsinstagram', '#explorepage'],
    shopee: ['#shopeeaffiliate', '#shopeehaul', '#promoshopee'],
    fb: ['#facebookreels', '#fbreels']
  };
  const finalTags = [...baseTags, ...(platformTags[platform] || [])].join(' ');

  const html = `
    <div class="result-h">
      <h3>💬 Caption Siap Pake</h3>
      <span class="result-count">${platform.toUpperCase()}</span>
    </div>
    ${filledCaptions.map((c, i) => {
      const fullCap = c + '\n\n' + finalTags;
      return `
        <div class="result-item">
          <div class="result-item-h">
            <span class="result-tag tag-${mood === 'curhat' ? 'emotion' : (mood === 'excited' ? 'urgency' : (mood === 'info' ? 'benefit' : (mood === 'rekomen' ? 'trust' : 'fomo')))}">${mood}</span>
          </div>
          <div class="result-text">${escapeHtml(fullCap).replace(/\n/g, '<br>')}</div>
          <div class="result-actions">
            <button class="copy-btn" onclick="copyText(\`${fullCap.replace(/`/g,'\\`').replace(/\$/g,'\\$')}\`, this)">📋 Salin Caption + Hashtag</button>
          </div>
        </div>
      `;
    }).join('')}

    <div class="insight-card" style="margin-top:14px;">
      <h4>🏷️ Hashtag Pack ${niche}</h4>
      <p style="word-break:break-word;">${finalTags}</p>
      <button class="copy-btn" style="margin-top:10px;" onclick="copyText('${finalTags.replace(/'/g, "\\'")}', this)">📋 Salin Hashtag</button>
    </div>
  `;
  document.getElementById('captionResult').innerHTML = html;
  document.getElementById('captionResult').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* =====================================================
   5) CTA GENERATOR
   ===================================================== */
const CTA_DB = {
  soft: [
    { text: 'Buat yg mau cobain juga, link nya udah aku taro di keranjang kuning yaa 🧡', tag: 'soft' },
    { text: 'Detailnya bisa kalian cek sendiri di link keranjang kuning ✨', tag: 'soft' },
    { text: 'Yang penasaran, mampir aja ke link nya yaa, gak maksa 💖', tag: 'soft' },
    { text: 'Aku sertain link nya di keranjang, semoga membantu kalian yg butuh 🥰', tag: 'soft' },
    { text: 'Kalau cocok, bisa langsung cek di keranjang kuning yaa friends 🌸', tag: 'soft' }
  ],
  hard: [
    { text: 'KLIK keranjang kuning SEKARANG! Stok terbatas! 🔥', tag: 'hard' },
    { text: 'Gak usah mikir lama, langsung order di link keranjang. Buruan! 💪', tag: 'hard' },
    { text: 'Add to cart NOW. Diskon cuma hari ini doang! ⚡', tag: 'hard' },
    { text: 'STOP scrolling! Klik keranjang kuning & checkout sekarang! 🚨', tag: 'hard' },
    { text: 'Gak ada alesan buat skip. Klik link, masukin keranjang, BAYAR! 💸', tag: 'hard' }
  ],
  fomo: [
    { text: '⏰ Buruan! Stok cuma tinggal 50pcs, kemarin abis 200 unit dalam sehari!', tag: 'fomo' },
    { text: 'Last chance! Diskon 50% cuma sampai jam 12 malam! ⏳', tag: 'fomo' },
    { text: 'Yang udah punya pasti tau worth-nya. Yang belum punya, jangan nyesel! 🏃‍♀️💨', tag: 'fomo' },
    { text: 'PROMO SPESIAL berakhir hari ini! Skip = nyesel besok! ⚠️', tag: 'fomo' },
    { text: 'Tinggal sedikit! Yg telat jangan nangis ke aku ya 🥲', tag: 'fomo' }
  ],
  trust: [
    { text: '✅ Garansi uang kembali kalau gak puas. Aman 100%! Cek link keranjang.', tag: 'trust' },
    { text: '🛡️ Udah dibeli 10rb+ orang, rating 4.9/5. Beneran terbukti!', tag: 'trust' },
    { text: 'BPOM legal ✅ Original 100% ✅ Free retur ✅ - link di keranjang!', tag: 'trust' },
    { text: 'Yang udah beli pada balik lagi. Tandanya? PRODUK INI KEREN. 🌟', tag: 'trust' },
    { text: 'Real review, real result. Klik keranjang kuning buat liat testimoninya! 📸', tag: 'trust' }
  ],
  curious: [
    { text: 'Mau tau kenapa banyak yg repeat order? Cek link keranjang kuning 👀', tag: 'curiosity' },
    { text: 'Penasaran? Klik link nya & buktiin sendiri 🔍', tag: 'curiosity' },
    { text: 'Ada satu rahasia produk ini yg bikin orang nagih... cek di keranjang! 🤫', tag: 'curiosity' },
    { text: 'Klik dulu link nya, baru kalian tau kenapa ini favorit gua 💭', tag: 'curiosity' }
  ]
};

function genCTA() {
  const type = document.getElementById('ctaType').value;
  const platform = document.getElementById('ctaPlatform').value;
  const product = document.getElementById('ctaProduct').value.trim();

  let ctas = [];
  if (type === 'all') {
    Object.values(CTA_DB).forEach(arr => ctas = ctas.concat(arr));
  } else {
    ctas = CTA_DB[type] || [];
  }

  // Adjust CTA buat platform
  const platformLabel = {
    tiktok: 'keranjang kuning',
    shopee: 'keranjang kuning Shopee',
    ig: 'link di bio',
    bio: 'link in bio'
  };
  const replaceWord = platformLabel[platform];

  ctas = shuffleArr(ctas).slice(0, 12).map(c => ({
    ...c,
    text: c.text.replace(/keranjang kuning/g, replaceWord)
  }));

  const html = `
    <div class="result-h">
      <h3>🔥 ${ctas.length} CTA Killer</h3>
      <span class="result-count">${platform.toUpperCase()}</span>
    </div>
    ${ctas.map(c => `
      <div class="result-item">
        <div class="result-item-h">
          <span class="result-tag tag-${c.tag}">${c.tag}</span>
        </div>
        <div class="result-text">${escapeHtml(c.text)}</div>
        <div class="result-actions">
          <button class="copy-btn" onclick="copyText('${c.text.replace(/'/g, "\\'")}', this)">📋 Salin</button>
        </div>
      </div>
    `).join('')}
  `;
  document.getElementById('ctaResult').innerHTML = html;
  document.getElementById('ctaResult').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* =====================================================
   6) AUDIENCE FINDER
   ===================================================== */
const AUDIENCE_DB = {
  skincare: {
    primary: 'Wanita 17-30 thn',
    secondary: 'Mom muda 25-35 thn yg pengen kulit balik glowing',
    interests: ['Skincare review', 'Beauty hacks', 'Makeup tutorial', 'Self-care', 'Glow up'],
    platforms: ['TikTok (utama)', 'Instagram Reels', 'YouTube Shorts'],
    bestTime: 'Jam 19:00 - 23:00 (prime time scroll)',
    contentIdeas: ['Day-by-day journey', 'Before-after split screen', 'Compare brand mahal vs murah', 'Routine GRWM', 'Hack pemakaian'],
    keywords: ['glowing', 'glass skin', 'no filter', 'jerawat hilang', 'pori-pori kecil', 'flawless', 'tanpa makeup'],
    influencerType: 'Beauty enthusiast, beauty blogger, mahasiswa cantik natural'
  },
  'fashion-wanita': {
    primary: 'Wanita 17-30 thn fashion-forward',
    secondary: 'Wanita karir 25-35 yg mau tampil profesional',
    interests: ['OOTD', 'Outfit inspo', 'Mix and match', 'Streetwear', 'Workwear'],
    platforms: ['TikTok', 'Instagram', 'Pinterest'],
    bestTime: 'Jam 18:00 - 22:00, weekend lebih ramai',
    contentIdeas: ['1 baju 5 outfit', 'OOTD ke acara apa', 'Mix piece murah', 'Try on haul', 'Style by occasion'],
    keywords: ['ootd', 'outfit murah', 'aesthetic', 'simple chic', 'effortless', 'kekinian'],
    influencerType: 'Fashion enthusiast, lifestyle blogger, young professional'
  },
  hijab: {
    primary: 'Muslimah 17-35 thn',
    secondary: 'Mom muslimah, mahasiswi, karyawan kantoran muslim',
    interests: ['Tutorial hijab', 'Modest fashion', 'Daily wear muslimah', 'Hijab style'],
    platforms: ['TikTok', 'Instagram', 'YouTube'],
    bestTime: 'Pagi (06-09) saat persiapan kerja, malem (19-22)',
    contentIdeas: ['Tutorial pasmina/segi 4', 'Hijab nyaman buat seharian', 'Try on warna', 'Hijab buat acara', 'Bahan adem buat panas'],
    keywords: ['hijabers', 'hijab cooltech', 'hijab adem', 'tutorial pashmina', 'jilbab nyaman', 'modest'],
    influencerType: 'Hijab influencer, muslimah blogger, ustadzah young'
  },
  'fashion-anak': {
    primary: 'Mom 23-40 thn dengan anak balita-SD',
    secondary: 'Tante muda, nenek muda, gift-giver',
    interests: ['Parenting tips', 'Outfit anak', 'Mom blog', 'Family content'],
    platforms: ['TikTok (#momtiktok)', 'Facebook (group ibu)', 'Instagram'],
    bestTime: 'Jam 09-11 (after antar sekolah) & 20-22 (after anak tidur)',
    contentIdeas: ['Anak modeling baju', 'OOTD anak', 'Bahan adem buat anak', 'Tahan cuci', 'Outfit acara family'],
    keywords: ['baju anak', 'fashion anak', 'OOTD anak', 'anak gaya', 'baju murah anak'],
    influencerType: 'Mom influencer, parenting blogger, mom-of'
  },
  kuliner: {
    primary: 'Gen-Z 15-25 thn',
    secondary: 'Foodies, late-night snack lover, pekerja muda',
    interests: ['Mukbang', 'Food review', 'Snack viral', 'ASMR food'],
    platforms: ['TikTok', 'Instagram Reels'],
    bestTime: 'Malem 21-24:00 (lapar tengah malem)',
    contentIdeas: ['ASMR makan', 'First bite reaction', 'Compare brand', 'Cocok makan kapan', 'Snack journey'],
    keywords: ['snack viral', 'snack nagih', 'mukbang', 'rekomendasi snack', 'nagih banget'],
    influencerType: 'Food blogger, mukbang creator, foodie'
  },
  'alat-rumah': {
    primary: 'Ibu rumah tangga 25-45 thn',
    secondary: 'Anak kost, fresh married couple',
    interests: ['Tips rumah', 'Dapur efisien', 'Hack hidup', 'Organize'],
    platforms: ['TikTok', 'Facebook (lebih efektif buat emak)', 'Instagram'],
    bestTime: 'Jam 09-11 (rest morning) & 15-17 (sore santai)',
    contentIdeas: ['Demo alat-nya', 'Before-after rapih', '5 alat dapur wajib', 'Hack hidup gampang', 'Tutorial pakai'],
    keywords: ['alat dapur', 'rumah aesthetic', 'hack hidup', 'tips ibu rumah tangga'],
    influencerType: 'Mom influencer, home decor blogger, life hacker'
  },
  elektronik: {
    primary: 'Pria 18-30 thn tech-savvy',
    secondary: 'Wanita 17-25 yg butuh gadget',
    interests: ['Tech review', 'Gadget murah', 'Unboxing', 'Tech tips'],
    platforms: ['TikTok', 'YouTube Shorts'],
    bestTime: 'Malem 20-23:00',
    contentIdeas: ['Unboxing detail', 'Stress test', 'Compare brand', 'Tips & tricks', 'Versi murah dari brand mahal'],
    keywords: ['gadget murah', 'tech review', 'unboxing', 'earphone bagus', 'gadget worth it'],
    influencerType: 'Tech YouTuber, gadget reviewer, lifestyle tech'
  },
  kesehatan: {
    primary: 'Dewasa 25-50 thn yg aware kesehatan',
    secondary: 'Mom yg cari vitamin keluarga, fitness enthusiast',
    interests: ['Tips kesehatan', 'Suplemen', 'Workout', 'Healthy living'],
    platforms: ['TikTok', 'Instagram', 'Facebook'],
    bestTime: 'Pagi 06-09 (workout time) & malem 20-22',
    contentIdeas: ['Pengalaman pakai', 'Cara minum bener', 'Manfaat detailed', 'Cocok buat siapa', 'Mythbusting kesehatan'],
    keywords: ['suplemen bagus', 'vitamin', 'imunitas', 'tips sehat'],
    influencerType: 'Health blogger, doctor influencer, fitness creator'
  },
  bayi: {
    primary: 'Mom muda 22-38 thn',
    secondary: 'Tante, kakak yang siap-siap married, gift-giver',
    interests: ['Parenting', 'Newborn care', 'Tips ibu', 'Mom community'],
    platforms: ['Instagram (utama buat mom)', 'TikTok', 'Facebook group'],
    bestTime: 'Pagi 06-08 (anak makan) & malem 20-22 (anak tidur)',
    contentIdeas: ['Aman buat newborn?', 'Compare merk', 'Pengalaman pakai', 'Tips parenting', 'Day in life mom'],
    keywords: ['perlengkapan bayi', 'mom indonesia', 'newborn essentials', 'tips mom'],
    influencerType: 'Mom influencer, parenting blogger, doula muda'
  },
  hobi: {
    primary: 'Hobi-specific community',
    secondary: 'Gift-giver, beginner enthusiast',
    interests: ['Niche hobby', 'Collection', 'Tutorial'],
    platforms: ['TikTok', 'YouTube', 'Reddit Indonesia'],
    bestTime: 'Weekend & malem',
    contentIdeas: ['Showcase koleksi', 'Tutorial', 'Compare original vs kw', 'Reaction unboxing'],
    keywords: ['hobi', 'mainan murah', 'koleksi'],
    influencerType: 'Niche enthusiast, collector, hobbyist'
  }
};

function genAudience() {
  const cat = document.getElementById('audCat').value;
  const data = AUDIENCE_DB[cat];

  if (!data) { toast('⚠️ Data tidak tersedia'); return; }

  const html = `
    <div class="result-h">
      <h3>👥 Profil Audience</h3>
      <span class="result-count">Detail</span>
    </div>

    <div class="insight-card">
      <h4>🎯 Audience Utama</h4>
      <p><strong style="color:var(--primary)">${data.primary}</strong></p>
      <p style="margin-top:6px;">Sekunder: ${data.secondary}</p>
    </div>

    <div class="insight-card">
      <h4>💡 Interests / Minat</h4>
      <ul>
        ${data.interests.map(i => `<li>${i}</li>`).join('')}
      </ul>
    </div>

    <div class="insight-card">
      <h4>📱 Platform Terbaik</h4>
      <ul>
        ${data.platforms.map(p => `<li>${p}</li>`).join('')}
      </ul>
    </div>

    <div class="insight-card">
      <h4>⏰ Jam Posting Optimal</h4>
      <p>${data.bestTime}</p>
    </div>

    <div class="insight-card">
      <h4>🎬 Ide Konten yang Cocok</h4>
      <ul>
        ${data.contentIdeas.map(c => `<li>${c}</li>`).join('')}
      </ul>
    </div>

    <div class="insight-card">
      <h4>🔍 Keyword Trending</h4>
      <p>${data.keywords.map(k => `<span style="display:inline-block;background:rgba(167,139,250,.15);color:var(--primary);padding:3px 10px;border-radius:6px;font-size:.75rem;font-weight:600;margin:3px;">${k}</span>`).join('')}</p>
    </div>

    <div class="insight-card">
      <h4>🌟 Tipe Influencer / Persona Buat Posisikan Diri</h4>
      <p>${data.influencerType}</p>
    </div>
  `;
  document.getElementById('audienceResult').innerHTML = html;
  document.getElementById('audienceResult').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* =====================================================
   7) WINNING PRODUCTS DATABASE
   ===================================================== */
const WINNING_PRODUCTS = [
  {
    rank: 1,
    name: 'BIOAQUA Makeup Remover 1L (Jumbo)',
    cat: 'Skincare',
    sales: '282 unit',
    revenue: '14,8 JT',
    commission: '561 RB',
    tags: ['Viral', 'Hijab Friendly', 'Hot Seller'],
    why: 'Pain point sangat universal (cewe ribet bersihin makeup), value MUCH gede karena 1L (vs kompetitor 100ml), harga affordable, hasil before-after sangat visual untuk konten.',
    angle: 'Demo bersihin makeup, before-after swipe, ASMR pakaian, "1L tahan berapa lama"'
  },
  {
    rank: 2,
    name: 'Hijab Bergo / Cooltech Daily Wear',
    cat: 'Hijab',
    sales: '264 unit',
    revenue: '9,6 JT',
    commission: '1,5 JT',
    tags: ['Repeat Order', 'Daily Wear', 'Komisi Tinggi'],
    why: 'Pasar muslimah Indonesia raksasa, daily essential, repeat-buy, bahan cooltech jawab pain point #1 hijabers (panas).',
    angle: 'Tutorial gaya hijab, "bahan adem di cuaca panas", try-on multi warna, hijab buat acara'
  },
  {
    rank: 3,
    name: 'Baju Anak Perempuan Atasan',
    cat: 'Fashion Anak',
    sales: '120 unit',
    revenue: '7,3 JT',
    commission: '138 RB',
    tags: ['Mom Favorite', 'Repeat'],
    why: 'Mom shopping = repeat customer paling rajin. Anak cepet gede = beli baju baru terus. Harga affordable + anak gaya = checkout.',
    angle: 'Foto anak modeling, "harga di mall vs di sini", bahan cocok cuaca panas, OOTD anak'
  },
  {
    rank: 4,
    name: 'Charger Fast Charging 65W Multi-port',
    cat: 'Elektronik',
    sales: '450+ unit',
    revenue: '12 JT',
    commission: '480 RB',
    tags: ['Trending', 'Universal Need'],
    why: 'Semua orang punya hp. Charging cepet = comfort hidup. Multi-port = praktis. Affordable buat mahasiswa & karyawan.',
    angle: 'Speed test charging, "1 charger buat semua gadget", compare brand mahal'
  },
  {
    rank: 5,
    name: 'Skincare Set Anti-Acne 5in1',
    cat: 'Skincare',
    sales: '189 unit',
    revenue: '11,3 JT',
    commission: '450 RB',
    tags: ['Beauty', 'Bundle Deal'],
    why: 'Jerawat = pain point #1 remaja & dewasa muda. Set 5in1 = perceived value tinggi & convenience.',
    angle: 'Day-by-day journey 30 hari, before-after, GRWM, hack pemakaian'
  },
  {
    rank: 6,
    name: 'Alat Cuci Piring Otomatis Mini',
    cat: 'Alat Rumah',
    sales: '156 unit',
    revenue: '8,2 JT',
    commission: '328 RB',
    tags: ['Mom Hack', 'Viral'],
    why: 'Mom males cuci piring = universal. Solusi praktis + harga terjangkau = checkout impulse.',
    angle: 'Demo cuci piring, "kerjaan rumah kelar 5 menit", reaction emak'
  },
  {
    rank: 7,
    name: 'Snack Korean Style Box',
    cat: 'Kuliner',
    sales: '320 unit',
    revenue: '6,5 JT',
    commission: '195 RB',
    tags: ['Trending', 'Gen-Z'],
    why: 'Korean wave + snack box paket = perfect combo Gen-Z. Konten ASMR + reaction = viral guaranteed.',
    angle: 'ASMR mukbang, first-bite reaction, ranking semua snack'
  },
  {
    rank: 8,
    name: 'Sepatu Sneakers Wanita Korean',
    cat: 'Fashion Wanita',
    sales: '198 unit',
    revenue: '15,8 JT',
    commission: '632 RB',
    tags: ['Hot', 'Hot Komisi'],
    why: 'Sepatu korean lagi viral, daily wear, harga terjangkau dibanding brand. OOTD content gampang.',
    angle: 'OOTD lookbook, sepatu mix outfit, compare brand'
  }
];

function renderWinning() {
  const html = WINNING_PRODUCTS.map(p => `
    <div class="winning-card" onclick="showProductDetail(${p.rank})">
      <div class="winning-rank">🏆 RANK #${p.rank}</div>
      <h4>${p.name}</h4>
      <div class="cat">📂 ${p.cat}</div>
      <div class="winning-stats">
        <div>
          <strong>${p.sales}</strong>
          <small>Sales</small>
        </div>
        <div>
          <strong>${p.revenue}</strong>
          <small>Revenue</small>
        </div>
        <div>
          <strong>${p.commission}</strong>
          <small>Komisi</small>
        </div>
      </div>
      <div class="winning-tags">
        ${p.tags.map(t => `<span>${t}</span>`).join('')}
      </div>
    </div>
  `).join('');
  document.getElementById('winningGrid').innerHTML = html;
}

function showProductDetail(rank) {
  const p = WINNING_PRODUCTS.find(x => x.rank === rank);
  if (!p) return;

  // Inject modal info
  const modalHtml = `
    <div class="modal-overlay open" id="productModal" onclick="if(event.target.id==='productModal')this.remove()">
      <div class="modal">
        <button class="modal-close" onclick="document.getElementById('productModal').remove()">✕</button>
        <div class="modal-body">
          <div class="winning-rank">🏆 RANK #${p.rank}</div>
          <h2>${p.name}</h2>
          <p>📂 ${p.cat}</p>

          <div class="winning-stats" style="margin: 14px 0;">
            <div><strong>${p.sales}</strong><small>Sales</small></div>
            <div><strong>${p.revenue}</strong><small>Revenue</small></div>
            <div><strong>${p.commission}</strong><small>Komisi</small></div>
          </div>

          <div class="insight-card">
            <h4>💡 Kenapa Produk Ini Laku?</h4>
            <p>${p.why}</p>
          </div>

          <div class="insight-card">
            <h4>🎬 Angle Konten yang Recommended</h4>
            <p>${p.angle}</p>
          </div>

          <button class="btn btn-primary btn-block" style="margin-top:14px;" onclick="document.getElementById('productModal').remove()">Tutup</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

/* =====================================================
   UTILS
   ===================================================== */
function shuffleArr(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ===== INIT ===== */
window.addEventListener('DOMContentLoaded', () => {
  renderWinning();
});
