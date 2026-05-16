// ============================================
// YanzyShop - Marketplace JavaScript
// ============================================

// === DATA PRODUK (biasanya datang dari database/API) ===
const PRODUCTS = [
    { id: 1,  name: "Kaos Polos Cotton Combed", price: 75000,   stock: 20, rating: 4.8, sold: 1200, category: "Fashion",    img: "👕" },
    { id: 2,  name: "Hoodie Oversize Hitam",     price: 195000,  stock: 8,  rating: 4.9, sold: 540,  category: "Fashion",    img: "🧥" },
    { id: 3,  name: "Sepatu Sneakers Putih",     price: 350000,  stock: 15, rating: 4.7, sold: 980,  category: "Fashion",    img: "👟" },
    { id: 4,  name: "Topi Baseball Keren",       price: 89000,   stock: 30, rating: 4.6, sold: 320,  category: "Fashion",    img: "🧢" },

    { id: 5,  name: "Smartphone Android 128GB",  price: 2499000, stock: 5,  rating: 4.9, sold: 2100, category: "Elektronik", img: "📱" },
    { id: 6,  name: "Laptop Tipis Core i5",       price: 7800000, stock: 3,  rating: 4.8, sold: 450,  category: "Elektronik", img: "💻" },
    { id: 7,  name: "Headphone Bluetooth",        price: 299000,  stock: 12, rating: 4.7, sold: 1800, category: "Elektronik", img: "🎧" },
    { id: 8,  name: "Smartwatch Sport",           price: 450000,  stock: 0,  rating: 4.5, sold: 670,  category: "Elektronik", img: "⌚" },
    { id: 9,  name: "Powerbank 20000 mAh",        price: 175000,  stock: 25, rating: 4.6, sold: 3200, category: "Elektronik", img: "🔋" },

    { id: 10, name: "Pizza Pepperoni Large",      price: 89000,   stock: 50, rating: 4.9, sold: 2400, category: "Makanan",    img: "🍕" },
    { id: 11, name: "Burger Daging Premium",      price: 45000,   stock: 40, rating: 4.7, sold: 1900, category: "Makanan",    img: "🍔" },
    { id: 12, name: "Sushi Roll Box",             price: 125000,  stock: 18, rating: 4.8, sold: 880,  category: "Makanan",    img: "🍣" },
    { id: 13, name: "Es Krim Vanilla 1L",         price: 65000,   stock: 35, rating: 4.6, sold: 1100, category: "Makanan",    img: "🍦" },

    { id: 14, name: "Novel Bestseller",           price: 95000,   stock: 22, rating: 4.9, sold: 760,  category: "Buku",       img: "📕" },
    { id: 15, name: "Buku Belajar Coding",        price: 145000,  stock: 14, rating: 4.8, sold: 540,  category: "Buku",       img: "📘" },
    { id: 16, name: "Komik Petualangan",          price: 55000,   stock: 60, rating: 4.7, sold: 2300, category: "Buku",       img: "📚" },

    { id: 17, name: "Bola Sepak Original",        price: 165000,  stock: 10, rating: 4.7, sold: 420,  category: "Olahraga",   img: "⚽" },
    { id: 18, name: "Raket Badminton Pro",        price: 380000,  stock: 7,  rating: 4.8, sold: 280,  category: "Olahraga",   img: "🏸" },
    { id: 19, name: "Matras Yoga Anti Slip",      price: 120000,  stock: 20, rating: 4.6, sold: 950,  category: "Olahraga",   img: "🧘" },
    { id: 20, name: "Dumbbell Set 10kg",          price: 250000,  stock: 6,  rating: 4.7, sold: 380,  category: "Olahraga",   img: "🏋️" },
];

// === STATE (data yang berubah-ubah) ===
let cart = JSON.parse(localStorage.getItem("yanzy_cart") || "[]");
let activeCategory = "all";

// === HELPER: format harga jadi Rp 1.234.567 ===
const formatPrice = (n) => "Rp " + n.toLocaleString("id-ID");

// === HELPER: simpan cart ke HP user ===
function saveCart() {
    localStorage.setItem("yanzy_cart", JSON.stringify(cart));
}

// === RENDER: tampilkan produk ke layar ===
function renderProducts() {
    const grid = document.getElementById("productGrid");
    const empty = document.getElementById("emptyState");
    const search = document.getElementById("searchInput").value.toLowerCase().trim();

    // Filter berdasarkan kategori + pencarian
    const filtered = PRODUCTS.filter(p => {
        const matchCat = activeCategory === "all" || p.category === activeCategory;
        const matchSearch = p.name.toLowerCase().includes(search);
        return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = "";
        empty.classList.remove("hidden");
        return;
    }
    empty.classList.add("hidden");

    grid.innerHTML = filtered.map(p => `
        <div class="product-card">
            <div class="product-image">${p.img}</div>
            <div class="product-info">
                <div class="product-name">${p.name}</div>
                <div class="product-price">${formatPrice(p.price)}</div>
                <div class="product-meta">
                    <span>⭐ ${p.rating}</span>
                    <span>${p.sold} terjual</span>
                </div>
                <button
                    class="add-btn"
                    onclick="addToCart(${p.id})"
                    ${p.stock === 0 ? "disabled" : ""}
                >
                    ${p.stock === 0 ? "Stok Habis" : "+ Keranjang"}
                </button>
            </div>
        </div>
    `).join("");
}

// === KATEGORI: pindah filter ===
document.getElementById("categories").addEventListener("click", (e) => {
    if (!e.target.classList.contains("cat-btn")) return;
    document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
    e.target.classList.add("active");
    activeCategory = e.target.dataset.cat;
    renderProducts();
});

// === TAMBAH ke keranjang ===
function addToCart(id) {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product || product.stock === 0) return;

    const existing = cart.find(item => item.id === id);
    if (existing) {
        if (existing.qty >= product.stock) {
            showToast(`Maaf, stok ${product.name} tinggal ${product.stock}`);
            return;
        }
        existing.qty++;
    } else {
        cart.push({ id, qty: 1 });
    }

    saveCart();
    updateCartUI();
    showToast(`${product.name} masuk keranjang ✅`);
}

// === UBAH jumlah item di keranjang ===
function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    const product = PRODUCTS.find(p => p.id === id);
    item.qty += delta;

    if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== id);
    } else if (item.qty > product.stock) {
        item.qty = product.stock;
        showToast(`Stok maks ${product.stock}`);
    }

    saveCart();
    updateCartUI();
}

// === HAPUS item ===
function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    updateCartUI();
}

// === UPDATE tampilan keranjang ===
function updateCartUI() {
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");

    const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
    cartCount.textContent = totalQty;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Keranjang masih kosong 🛒</p>';
        cartTotal.textContent = formatPrice(0);
        return;
    }

    let total = 0;
    cartItems.innerHTML = cart.map(item => {
        const p = PRODUCTS.find(pr => pr.id === item.id);
        const subtotal = p.price * item.qty;
        total += subtotal;
        return `
            <div class="cart-item">
                <div class="cart-item-img">${p.img}</div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${p.name}</div>
                    <div class="cart-item-price">${formatPrice(subtotal)}</div>
                    <div class="qty-control">
                        <button class="qty-btn" onclick="changeQty(${p.id}, -1)">−</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" onclick="changeQty(${p.id}, 1)">+</button>
                        <button class="qty-btn" onclick="removeFromCart(${p.id})" title="Hapus">🗑️</button>
                    </div>
                </div>
            </div>
        `;
    }).join("");

    cartTotal.textContent = formatPrice(total);
}

// === BUKA / TUTUP keranjang ===
function toggleCart() {
    document.getElementById("cartSidebar").classList.toggle("open");
    document.getElementById("cartOverlay").classList.toggle("open");
}

// === CHECKOUT ===
function checkout() {
    if (cart.length === 0) {
        showToast("Keranjang masih kosong");
        return;
    }
    const total = cart.reduce((sum, i) => {
        const p = PRODUCTS.find(pr => pr.id === i.id);
        return sum + p.price * i.qty;
    }, 0);
    const totalQty = cart.reduce((s, i) => s + i.qty, 0);

    const confirmed = confirm(
        `🧾 Ringkasan Pesanan\n\n` +
        `Total Item: ${totalQty}\n` +
        `Total Bayar: ${formatPrice(total)}\n\n` +
        `Lanjutkan pembayaran?`
    );

    if (confirmed) {
        cart = [];
        saveCart();
        updateCartUI();
        toggleCart();
        showToast("🎉 Terima kasih sudah belanja!");
    }
}

// === TOAST: notifikasi kecil di bawah ===
let toastTimer;
function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2000);
}

// === INISIALISASI saat halaman dibuka ===
renderProducts();
updateCartUI();

console.log("%c🛍️ YanzyShop loaded!", "color: #ee4d2d; font-size: 18px; font-weight: bold;");
