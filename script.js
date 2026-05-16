// ============================================
// YanzyStore - Premium Digital Service
// ============================================

// === KONFIGURASI TOKO ===
const STORE = {
    waNumber: "6281930563872",          // No WA admin YanzyStore
    storeName: "YanzyStore",
    adminFee: 1000,                      // Biaya admin per transaksi
};

// === DATA PRODUK PREMIUM DIGITAL ===
// Setiap produk punya beberapa "plan" (durasi/jenis akun)
const PRODUCTS = [
    {
        id: 1,
        name: "CapCut Pro",
        category: "Editing",
        icon: "🎬",
        gradient: "linear-gradient(135deg, #000000, #1f1f1f)",
        desc: "Editing video tanpa watermark, semua filter & efek premium unlocked",
        rating: 4.9,
        sold: 3240,
        badge: "TERLARIS",
        plans: [
            { id: "1m",  name: "1 Bulan",  desc: "Akun pribadi", price: 12000,  oldPrice: 25000 },
            { id: "3m",  name: "3 Bulan",  desc: "Akun pribadi", price: 30000,  oldPrice: 60000 },
            { id: "1y",  name: "1 Tahun",  desc: "Akun pribadi", price: 99000,  oldPrice: 199000 },
        ],
    },
    {
        id: 2,
        name: "Canva Pro",
        category: "Editing",
        icon: "🎨",
        gradient: "linear-gradient(135deg, #00c4cc, #7d2ae8)",
        desc: "Akses 100+ juta template, premium element & background remover",
        rating: 4.9,
        sold: 5100,
        badge: "HOT",
        plans: [
            { id: "1m", name: "1 Bulan",  desc: "Member team", price: 8000,   oldPrice: 50000 },
            { id: "1y", name: "1 Tahun",  desc: "Member team", price: 35000,  oldPrice: 599000 },
            { id: "lt", name: "Selamanya",desc: "Lifetime",    price: 99000,  oldPrice: 1500000 },
        ],
    },
    {
        id: 3,
        name: "Netflix Premium",
        category: "Streaming",
        icon: "🎞️",
        gradient: "linear-gradient(135deg, #e50914, #b00710)",
        desc: "4K Ultra HD, 4 device sekaligus, semua film & series unlocked",
        rating: 4.8,
        sold: 8920,
        plans: [
            { id: "1m", name: "1 Bulan",  desc: "Sharing 1 user", price: 25000, oldPrice: 186000 },
            { id: "2m", name: "2 Bulan",  desc: "Sharing 1 user", price: 45000, oldPrice: 372000 },
            { id: "1m-private", name: "1 Bulan Private", desc: "Akun sendiri", price: 99000, oldPrice: 186000 },
        ],
    },
    {
        id: 4,
        name: "Spotify Premium",
        category: "Musik",
        icon: "🎵",
        gradient: "linear-gradient(135deg, #1db954, #169c46)",
        desc: "Tanpa iklan, download lagu offline, kualitas HD",
        rating: 4.9,
        sold: 6700,
        plans: [
            { id: "1m", name: "1 Bulan",  desc: "Akun pribadi", price: 15000,  oldPrice: 54990 },
            { id: "3m", name: "3 Bulan",  desc: "Akun pribadi", price: 39000,  oldPrice: 164970 },
            { id: "1y", name: "1 Tahun",  desc: "Akun pribadi", price: 99000,  oldPrice: 659880 },
        ],
    },
    {
        id: 5,
        name: "YouTube Premium",
        category: "Streaming",
        icon: "▶️",
        gradient: "linear-gradient(135deg, #ff0000, #cc0000)",
        desc: "No iklan, download video & lagu, YouTube Music included",
        rating: 4.8,
        sold: 4520,
        plans: [
            { id: "1m", name: "1 Bulan",  desc: "Family member", price: 12000,  oldPrice: 79000 },
            { id: "3m", name: "3 Bulan",  desc: "Family member", price: 30000,  oldPrice: 237000 },
            { id: "1y", name: "1 Tahun",  desc: "Family member", price: 99000,  oldPrice: 948000 },
        ],
    },
    {
        id: 6,
        name: "ChatGPT Plus",
        category: "AI",
        icon: "🤖",
        gradient: "linear-gradient(135deg, #10a37f, #0d8164)",
        desc: "GPT-4, prioritas akses, generate gambar DALL-E unlimited",
        rating: 4.9,
        sold: 2100,
        badge: "BARU",
        plans: [
            { id: "1m", name: "1 Bulan",  desc: "Sharing access", price: 79000,  oldPrice: 320000 },
            { id: "1m-private", name: "1 Bulan Private", desc: "Akun sendiri", price: 249000, oldPrice: 320000 },
        ],
    },
    {
        id: 7,
        name: "Disney+ Hotstar",
        category: "Streaming",
        icon: "🏰",
        gradient: "linear-gradient(135deg, #1f80e0, #0e3a6b)",
        desc: "Marvel, Star Wars, Pixar, sport & local content premium",
        rating: 4.7,
        sold: 3890,
        plans: [
            { id: "1m", name: "1 Bulan",  desc: "Sharing 1 user", price: 18000,  oldPrice: 39000 },
            { id: "3m", name: "3 Bulan",  desc: "Sharing 1 user", price: 45000,  oldPrice: 117000 },
            { id: "1y", name: "1 Tahun",  desc: "Sharing 1 user", price: 129000, oldPrice: 199000 },
        ],
    },
    {
        id: 8,
        name: "Viu Premium",
        category: "Streaming",
        icon: "🎭",
        gradient: "linear-gradient(135deg, #ffcc00, #ff9800)",
        desc: "Drama Korea, China, Thailand tanpa iklan + download offline",
        rating: 4.6,
        sold: 1890,
        plans: [
            { id: "1m", name: "1 Bulan",  desc: "Akun pribadi", price: 13000,  oldPrice: 30000 },
            { id: "1y", name: "1 Tahun",  desc: "Akun pribadi", price: 99000,  oldPrice: 360000 },
        ],
    },
    {
        id: 9,
        name: "WeTV VIP",
        category: "Streaming",
        icon: "📽️",
        gradient: "linear-gradient(135deg, #ff5500, #d63d1f)",
        desc: "Drama China premium, sub Indo, tanpa iklan",
        rating: 4.5,
        sold: 1240,
        plans: [
            { id: "1m", name: "1 Bulan",  desc: "Akun pribadi", price: 12000,  oldPrice: 30000 },
            { id: "1y", name: "1 Tahun",  desc: "Akun pribadi", price: 95000,  oldPrice: 360000 },
        ],
    },
    {
        id: 10,
        name: "Vidio Platinum",
        category: "Streaming",
        icon: "📺",
        gradient: "linear-gradient(135deg, #00aaff, #0066cc)",
        desc: "Liga Inggris, BWF, MotoGP, drama Korea, & film box office",
        rating: 4.7,
        sold: 2650,
        plans: [
            { id: "1m", name: "1 Bulan",  desc: "Akun pribadi", price: 22000,  oldPrice: 50000 },
            { id: "3m", name: "3 Bulan",  desc: "Akun pribadi", price: 60000,  oldPrice: 150000 },
            { id: "1y", name: "1 Tahun",  desc: "Akun pribadi", price: 199000, oldPrice: 499000 },
        ],
    },
    {
        id: 11,
        name: "Adobe Creative Cloud",
        category: "Editing",
        icon: "🅰️",
        gradient: "linear-gradient(135deg, #fa0f00, #b00b00)",
        desc: "Photoshop, Illustrator, Premiere Pro, semua app Adobe lengkap",
        rating: 4.8,
        sold: 1450,
        plans: [
            { id: "1m", name: "1 Bulan",  desc: "Sharing access", price: 49000,  oldPrice: 875000 },
            { id: "1y", name: "1 Tahun",  desc: "Sharing access", price: 449000, oldPrice: 10500000 },
        ],
    },
    {
        id: 12,
        name: "Microsoft 365",
        category: "Produktivitas",
        icon: "📊",
        gradient: "linear-gradient(135deg, #0078d4, #005a9e)",
        desc: "Word, Excel, PowerPoint, OneDrive 1TB, akses 5 device",
        rating: 4.7,
        sold: 980,
        plans: [
            { id: "1y", name: "1 Tahun",   desc: "Akun pribadi", price: 89000,  oldPrice: 999000 },
            { id: "lt", name: "Selamanya", desc: "Lifetime",     price: 199000, oldPrice: 5000000 },
        ],
    },
    {
        id: 13,
        name: "Zoom Pro",
        category: "Produktivitas",
        icon: "📹",
        gradient: "linear-gradient(135deg, #2d8cff, #1a6fd9)",
        desc: "Meeting unlimited durasi, 100 peserta, cloud recording",
        rating: 4.6,
        sold: 720,
        plans: [
            { id: "1m", name: "1 Bulan",  desc: "Akun pribadi", price: 25000,  oldPrice: 230000 },
            { id: "1y", name: "1 Tahun",  desc: "Akun pribadi", price: 199000, oldPrice: 2300000 },
        ],
    },
    {
        id: 14,
        name: "Notion Plus",
        category: "Produktivitas",
        icon: "📝",
        gradient: "linear-gradient(135deg, #000000, #404040)",
        desc: "Workspace unlimited, file upload tanpa batas, AI assistant",
        rating: 4.8,
        sold: 540,
        plans: [
            { id: "1y", name: "1 Tahun",   desc: "Akun pribadi", price: 79000,  oldPrice: 1200000 },
            { id: "lt", name: "Selamanya", desc: "Lifetime",     price: 149000, oldPrice: 5000000 },
        ],
    },
    {
        id: 15,
        name: "Picsart Gold",
        category: "Editing",
        icon: "✨",
        gradient: "linear-gradient(135deg, #c209c1, #8704ce)",
        desc: "Editing foto AI, remove background, magic effects unlimited",
        rating: 4.5,
        sold: 1320,
        plans: [
            { id: "1m", name: "1 Bulan",  desc: "Akun pribadi", price: 9000,   oldPrice: 79000 },
            { id: "1y", name: "1 Tahun",  desc: "Akun pribadi", price: 79000,  oldPrice: 599000 },
        ],
    },
    {
        id: 16,
        name: "Apple Music",
        category: "Musik",
        icon: "🎶",
        gradient: "linear-gradient(135deg, #fa233b, #fb5c74)",
        desc: "100 juta lagu tanpa iklan, kualitas lossless, Spatial Audio",
        rating: 4.7,
        sold: 1890,
        plans: [
            { id: "1m", name: "1 Bulan",  desc: "Family member", price: 13000,  oldPrice: 69000 },
            { id: "1y", name: "1 Tahun",  desc: "Family member", price: 99000,  oldPrice: 828000 },
        ],
    },
    {
        id: 17,
        name: "Midjourney",
        category: "AI",
        icon: "🎭",
        gradient: "linear-gradient(135deg, #1a1a2e, #16213e)",
        desc: "Generate gambar AI ultra realistis, kualitas dewa",
        rating: 4.9,
        sold: 460,
        badge: "PRO",
        plans: [
            { id: "1m", name: "1 Bulan",   desc: "Sharing access", price: 79000,  oldPrice: 320000 },
            { id: "1m-private", name: "1 Bulan Private", desc: "Akun sendiri", price: 249000, oldPrice: 320000 },
        ],
    },
    {
        id: 18,
        name: "Telegram Premium",
        category: "Produktivitas",
        icon: "✈️",
        gradient: "linear-gradient(135deg, #0088cc, #006699)",
        desc: "Upload file 4GB, animated emoji premium, no iklan",
        rating: 4.6,
        sold: 670,
        plans: [
            { id: "3m", name: "3 Bulan",   desc: "Akun pribadi", price: 65000,  oldPrice: 165000 },
            { id: "6m", name: "6 Bulan",   desc: "Akun pribadi", price: 110000, oldPrice: 330000 },
            { id: "1y", name: "1 Tahun",   desc: "Akun pribadi", price: 195000, oldPrice: 660000 },
        ],
    },
];

// === DAFTAR METODE PEMBAYARAN ===
const PAYMENT_METHODS = [
    { id: "qris",       name: "QRIS",       icon: "📱" },
    { id: "dana",       name: "DANA",       icon: "💙" },
    { id: "ovo",        name: "OVO",        icon: "💜" },
    { id: "gopay",      name: "GoPay",      icon: "💚" },
    { id: "shopeepay",  name: "ShopeePay",  icon: "🧡" },
    { id: "bca",        name: "BCA",        icon: "🏦" },
    { id: "bni",        name: "BNI",        icon: "🏛️" },
    { id: "bri",        name: "BRI",        icon: "🏢" },
    { id: "mandiri",    name: "Mandiri",    icon: "🏧" },
];

// === STATE ===
let cart = JSON.parse(localStorage.getItem("yanzy_store_cart") || "[]");
let activeCategory = "all";
let selectedPlan = null;       // saat di modal detail produk
let currentProduct = null;
let selectedPayment = "qris";  // default

// === HELPER ===
const formatPrice = (n) => "Rp " + n.toLocaleString("id-ID");
const saveCart = () => localStorage.setItem("yanzy_store_cart", JSON.stringify(cart));

// =================================================
// RENDER PRODUK
// =================================================
function renderProducts() {
    const grid = document.getElementById("productGrid");
    const empty = document.getElementById("emptyState");
    const count = document.getElementById("productCount");
    const search = document.getElementById("searchInput").value.toLowerCase().trim();

    const filtered = PRODUCTS.filter(p => {
        const matchCat = activeCategory === "all" || p.category === activeCategory;
        const matchSearch = p.name.toLowerCase().includes(search) ||
                            p.desc.toLowerCase().includes(search);
        return matchCat && matchSearch;
    });

    count.textContent = `${filtered.length} produk`;

    if (filtered.length === 0) {
        grid.innerHTML = "";
        empty.classList.remove("hidden");
        return;
    }
    empty.classList.add("hidden");

    grid.innerHTML = filtered.map(p => {
        const minPrice = Math.min(...p.plans.map(pl => pl.price));
        return `
            <div class="product-card" onclick="openProductDetail(${p.id})">
                <div class="product-image" style="background:${p.gradient}">
                    ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}
                    ${p.icon}
                </div>
                <div class="product-info">
                    <div class="product-name">${p.name}</div>
                    <div class="product-desc">${p.desc}</div>
                    <div class="product-price-row">
                        <span class="product-price-from">mulai</span>
                        <span class="product-price">${formatPrice(minPrice)}</span>
                    </div>
                    <div class="product-meta">
                        <span class="product-rating">⭐ ${p.rating}</span>
                        <span>•</span>
                        <span>${p.sold.toLocaleString("id-ID")} terjual</span>
                    </div>
                </div>
            </div>
        `;
    }).join("");
}

// =================================================
// FILTER KATEGORI
// =================================================
document.getElementById("categories").addEventListener("click", (e) => {
    if (!e.target.classList.contains("cat-btn")) return;
    document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
    e.target.classList.add("active");
    activeCategory = e.target.dataset.cat;
    renderProducts();
});

// =================================================
// MODAL DETAIL PRODUK
// =================================================
function openProductDetail(id) {
    currentProduct = PRODUCTS.find(p => p.id === id);
    if (!currentProduct) return;

    selectedPlan = currentProduct.plans[0]; // default plan pertama

    const body = document.getElementById("modalBody");
    body.innerHTML = `
        <div class="modal-product-img" style="background:${currentProduct.gradient}">
            ${currentProduct.icon}
        </div>
        <h2 class="modal-product-name">${currentProduct.name}</h2>
        <div class="modal-product-meta">
            <span>⭐ ${currentProduct.rating}</span>
            <span>•</span>
            <span>${currentProduct.sold.toLocaleString("id-ID")} terjual</span>
            <span>•</span>
            <span>${currentProduct.category}</span>
        </div>
        <p class="modal-product-desc">${currentProduct.desc}</p>

        <div class="plan-label">Pilih Paket:</div>
        <div class="plan-list" id="planList">
            ${currentProduct.plans.map((plan, i) => `
                <div class="plan-option ${i === 0 ? 'selected' : ''}" data-plan-id="${plan.id}">
                    <div class="plan-info">
                        <strong>${plan.name}</strong>
                        <small>${plan.desc}</small>
                    </div>
                    <div>
                        ${plan.oldPrice ? `<span class="plan-price-old">${formatPrice(plan.oldPrice)}</span>` : ""}
                        <span class="plan-price">${formatPrice(plan.price)}</span>
                    </div>
                </div>
            `).join("")}
        </div>

        <button class="primary-btn" onclick="addToCart()">
            Masukkan Keranjang
        </button>
    `;

    // Event listener untuk plan options
    document.getElementById("planList").addEventListener("click", (e) => {
        const opt = e.target.closest(".plan-option");
        if (!opt) return;
        document.querySelectorAll("#planList .plan-option").forEach(o => o.classList.remove("selected"));
        opt.classList.add("selected");
        selectedPlan = currentProduct.plans.find(p => p.id === opt.dataset.planId);
    });

    document.getElementById("productModal").classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeProductModal(e) {
    if (e && e.target.id !== "productModal") return;
    document.getElementById("productModal").classList.remove("open");
    document.body.style.overflow = "";
}

// =================================================
// KERANJANG
// =================================================
function addToCart() {
    if (!currentProduct || !selectedPlan) return;

    const cartItemId = `${currentProduct.id}-${selectedPlan.id}`;
    const existing = cart.find(i => i.cartItemId === cartItemId);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({
            cartItemId,
            productId: currentProduct.id,
            planId: selectedPlan.id,
            qty: 1,
        });
    }

    saveCart();
    updateCartUI();
    closeProductModal();
    showToast(`✅ ${currentProduct.name} (${selectedPlan.name}) masuk keranjang`);
}

function changeQty(cartItemId, delta) {
    const item = cart.find(i => i.cartItemId === cartItemId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(i => i.cartItemId !== cartItemId);
    }
    saveCart();
    updateCartUI();
}

function removeFromCart(cartItemId) {
    cart = cart.filter(i => i.cartItemId !== cartItemId);
    saveCart();
    updateCartUI();
}

function updateCartUI() {
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");
    const cartFooter = document.getElementById("cartFooter");

    const totalQty = cart.reduce((s, i) => s + i.qty, 0);
    cartCount.textContent = totalQty;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <p>Keranjang masih kosong</p>
                <small>Pilih produk premium dulu yuk!</small>
            </div>
        `;
        cartTotal.textContent = formatPrice(0);
        cartFooter.style.display = "none";
        return;
    }

    cartFooter.style.display = "block";
    let total = 0;

    cartItems.innerHTML = cart.map(item => {
        const product = PRODUCTS.find(p => p.id === item.productId);
        const plan = product.plans.find(p => p.id === item.planId);
        const subtotal = plan.price * item.qty;
        total += subtotal;
        return `
            <div class="cart-item">
                <div class="cart-item-img" style="background:${product.gradient}">${product.icon}</div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${product.name}</div>
                    <div class="cart-item-plan">${plan.name} • ${plan.desc}</div>
                    <div class="cart-item-bottom">
                        <span class="cart-item-price">${formatPrice(subtotal)}</span>
                        <div class="qty-control">
                            <button class="qty-btn" onclick="changeQty('${item.cartItemId}', -1)">−</button>
                            <span>${item.qty}</span>
                            <button class="qty-btn" onclick="changeQty('${item.cartItemId}', 1)">+</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join("");

    cartTotal.textContent = formatPrice(total);
}

function toggleCart() {
    document.getElementById("cartSidebar").classList.toggle("open");
    document.getElementById("cartOverlay").classList.toggle("open");
    document.body.style.overflow = document.getElementById("cartSidebar").classList.contains("open") ? "hidden" : "";
}

// =================================================
// CHECKOUT
// =================================================
function openCheckout() {
    if (cart.length === 0) {
        showToast("Keranjang masih kosong");
        return;
    }
    toggleCart();
    renderPaymentMethods();
    updateOrderSummary();
    document.getElementById("checkoutModal").classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeCheckout(e) {
    if (e && e.target.id !== "checkoutModal") return;
    document.getElementById("checkoutModal").classList.remove("open");
    document.body.style.overflow = "";
}

function renderPaymentMethods() {
    const container = document.getElementById("paymentMethods");
    container.innerHTML = PAYMENT_METHODS.map(pm => `
        <button
            class="payment-option ${pm.id === selectedPayment ? 'selected' : ''}"
            onclick="selectPayment('${pm.id}')"
        >
            <div class="payment-icon">${pm.icon}</div>
            <div class="payment-name">${pm.name}</div>
        </button>
    `).join("");
}

function selectPayment(id) {
    selectedPayment = id;
    renderPaymentMethods();
}

function updateOrderSummary() {
    const subtotal = cart.reduce((sum, item) => {
        const product = PRODUCTS.find(p => p.id === item.productId);
        const plan = product.plans.find(p => p.id === item.planId);
        return sum + plan.price * item.qty;
    }, 0);
    const total = subtotal + STORE.adminFee;

    document.getElementById("sumSubtotal").textContent = formatPrice(subtotal);
    document.getElementById("sumFee").textContent = formatPrice(STORE.adminFee);
    document.getElementById("sumTotal").textContent = formatPrice(total);
}

// =================================================
// PROSES ORDER → KE WHATSAPP
// =================================================
function processOrder() {
    const name = document.getElementById("custName").value.trim();
    const wa = document.getElementById("custWa").value.trim();
    const email = document.getElementById("custEmail").value.trim();

    if (!name) return showToast("Nama wajib diisi");
    if (!wa)   return showToast("No. WhatsApp wajib diisi");
    if (!email) return showToast("Email wajib diisi");

    const subtotal = cart.reduce((s, i) => {
        const product = PRODUCTS.find(p => p.id === i.productId);
        const plan = product.plans.find(p => p.id === i.planId);
        return s + plan.price * i.qty;
    }, 0);
    const total = subtotal + STORE.adminFee;
    const payment = PAYMENT_METHODS.find(p => p.id === selectedPayment);
    const orderId = "YS" + Date.now().toString().slice(-8);

    // Susun list produk
    const itemList = cart.map((item, idx) => {
        const product = PRODUCTS.find(p => p.id === item.productId);
        const plan = product.plans.find(p => p.id === item.planId);
        return `${idx + 1}. ${product.name} - ${plan.name}\n   Qty: ${item.qty} x ${formatPrice(plan.price)} = ${formatPrice(plan.price * item.qty)}`;
    }).join("\n\n");

    // Format pesan WhatsApp
    const msg =
`*PESANAN BARU - ${STORE.storeName}*

*Order ID:* ${orderId}
━━━━━━━━━━━━━━━━

*Data Pemesan:*
Nama: ${name}
WA: ${wa}
Email: ${email}

━━━━━━━━━━━━━━━━
*Detail Pesanan:*

${itemList}

━━━━━━━━━━━━━━━━
*Ringkasan Pembayaran:*
Subtotal: ${formatPrice(subtotal)}
Biaya Admin: ${formatPrice(STORE.adminFee)}
*TOTAL: ${formatPrice(total)}*

*Metode Bayar:* ${payment.icon} ${payment.name}

━━━━━━━━━━━━━━━━
Halo admin, mohon konfirmasi pesanan & kirim instruksi pembayaran. Terima kasih!`;

    const waUrl = `https://wa.me/${STORE.waNumber}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");

    showToast("🎉 Pesanan dikirim ke admin!");

    // Reset cart setelah 2 detik
    setTimeout(() => {
        cart = [];
        saveCart();
        updateCartUI();
        closeCheckout();
        document.getElementById("custName").value = "";
        document.getElementById("custWa").value = "";
        document.getElementById("custEmail").value = "";
    }, 2000);
}

// =================================================
// TOAST
// =================================================
let toastTimer;
function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
}

// =================================================
// INIT
// =================================================
renderProducts();
updateCartUI();

// ESC untuk tutup modal
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeProductModal();
        closeCheckout();
        if (document.getElementById("cartSidebar").classList.contains("open")) toggleCart();
    }
});

console.log("%c⚡ YanzyStore Premium loaded", "color:#6366f1;font-size:16px;font-weight:bold;");
