document.addEventListener('DOMContentLoaded', () => {
    const products = [
        { id: 1, name: 'Gonjing', price: 1000, img: 'https://via.placeholder.com/300x200.png?text=Nasi+Goreng', rating: '★★★★☆' },
        { id: 2, name: 'Ayam Bekak', price: 30000, img: 'https://via.placeholder.com/300x200.png?text=Sate+Ayam', rating: '★★★★★' },
        { id: 3, name: 'Ikan Bakar', price: 28000, img: 'https://via.placeholder.com/300x200.png?text=Soto+Betawi', rating: '★★★★☆' },
        { id: 4, name: 'Gado-Gado', price: 22000, img: 'https://via.placeholder.com/300x200.png?text=Gado-Gado', rating: '★★★★☆' },
    ];
    let cart = [];

    const productContainer = document.querySelector('.produk-container');
    const mainContainer = document.getElementById('app-container');
    const originalContent = mainContainer.innerHTML;

    const renderProducts = () => {
        productContainer.innerHTML = '';
        products.forEach(p => {
            const card = document.createElement('div');
            card.className = 'produk-card animate-on-scroll';
            card.innerHTML = `
                <img src="${p.img}" alt="${p.name}">
                <div class="produk-info">
                    <h3>${p.name}</h3>
                    <div class="rating">${p.rating}</div>
                    <p class="harga">Rp ${p.price.toLocaleString('id-ID')}</p>
                    <button class="add-to-cart-btn" data-id="${p.id}">+</button>
                </div>`;
            productContainer.appendChild(card);
        });
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.onclick = () => addToCart(parseInt(btn.dataset.id));
        });
    };

    const addToCart = (productId) => {
        const product = products.find(p => p.id === productId);
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCartUI();
        toggleCart(true);
    };

    const updateCartUI = () => {
        const cartItemsEl = document.getElementById('cart-items');
        const cartCountEl = document.getElementById('cart-count');
        const cartTotalEl = document.getElementById('cart-total');
        
        cartItemsEl.innerHTML = cart.length === 0 ? '<p>Keranjang masih kosong.</p>' : '';
        cart.forEach(item => {
            const el = document.createElement('div');
            el.className = 'cart-item';
            el.innerHTML = `<img src="${item.img}" alt="${item.name}"><div class="cart-item-info"><h4>${item.name}</h4><p>Qty: ${item.quantity}</p></div><p>Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</p>`;
            cartItemsEl.appendChild(el);
        });

        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartCountEl.textContent = totalItems;
        cartTotalEl.textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;
    };

    const renderCheckoutPage = () => {
        mainContainer.innerHTML = `
        <div class="page-container checkout-page">
            <h2>Checkout</h2>
            <form id="checkout-form">
                <div class="form-group"><label for="nama">Nama Lengkap</label><input type="text" id="nama" required></div>
                <div class="form-group"><label for="alamat">Alamat Pengiriman</label><input type="text" id="alamat" required></div>
                <button type="submit" class="cta">Lanjut ke Pembayaran</button>
            </form>
        </div>`;
        document.getElementById('checkout-form').addEventListener('submit', (e) => {
            e.preventDefault();
            renderPaymentPage();
        });
    };

    const renderPaymentPage = () => {
        mainContainer.innerHTML = `
        <div class="page-container payment-page">
            <h2>Pilih Pembayaran</h2>
            <div class="payment-option" data-method="qris"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Logo_QRIS.svg/1200px-Logo_QRIS.svg.png" alt="QRIS"><h4>QRIS</h4></div>
            <div class="payment-option" data-method="va"><img src="https://upload.wikimedia.org/wikipedia/id/thumb/5/55/BCA_logo.svg/2560px-BCA_logo.svg.png" alt="BCA"><h4>BCA Virtual Account</h4></div>
        </div>`;
        document.querySelectorAll('.payment-option').forEach(opt => {
            opt.onclick = () => showPaymentDetails(opt.dataset.method);
        });
    };

    const showPaymentDetails = (method) => {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        let detailsHtml = method === 'qris'
            ? `<h3>Scan QRIS untuk Membayar</h3><img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=Total:${total}" alt="QRIS Code">`
            : `<h3>BCA Virtual Account</h3><p>Nomor Virtual Account:</p><h4>8808 1234 5678 9012</h4>`;
        
        mainContainer.innerHTML = `<div class="page-container payment-page payment-details">
            ${detailsHtml}
            <p>Total Pembayaran: <strong>Rp ${total.toLocaleString('id-ID')}</strong></p>
            <button class="cta" id="finish-btn">Selesaikan Pesanan</button>
        </div>`;

        document.getElementById('finish-btn').onclick = () => {
            alert('Terima kasih! Pesanan Anda berhasil dibuat dan akan segera kami proses.');
            cart = [];
            updateCartUI();
            mainContainer.innerHTML = originalContent;
            renderProducts();
            initializeEventListeners();
        };
    };

    const toggleCart = (show) => {
        document.getElementById('cart-sidebar').classList.toggle('active', show);
        document.getElementById('overlay').classList.toggle('active', show);
    };

    function initializeEventListeners() {
        const hamburger = document.querySelector('#hamburger-menu');
        const navbarNav = document.querySelector('.navbar-nav');
        const logo = document.querySelector('.navbar-logo');

        if (hamburger) {
            hamburger.onclick = (e) => {
                navbarNav.classList.toggle('active');
                e.preventDefault();
            };
        }

        logo.onclick = (e) => {
            e.preventDefault();
            mainContainer.innerHTML = originalContent;
            renderProducts();
            initializeEventListeners();
        }

        document.addEventListener('click', function(e) {
            if (hamburger && navbarNav && !hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
                navbarNav.classList.remove('active');
            }
        });

        const scrollElements = document.querySelectorAll(".animate-on-scroll");
        const elementInView = (el) => el.getBoundingClientRect().top <= (window.innerHeight || document.documentElement.clientHeight) / 1.25;
        const handleScrollAnimation = () => scrollElements.forEach(el => {
            if (elementInView(el)) el.classList.add("visible");
        });
        window.addEventListener("scroll", handleScrollAnimation);
    }
    
    document.getElementById('cart-button').onclick = () => toggleCart(true);
    document.getElementById('close-cart-btn').onclick = () => toggleCart(false);
    document.getElementById('overlay').onclick = () => toggleCart(false);
    document.getElementById('checkout-btn').onclick = () => {
        if (cart.length > 0) {
            toggleCart(false);
            renderCheckoutPage();
        } else {
            alert('Keranjang Anda masih kosong.');
        }
    };
    
    renderProducts();
    initializeEventListeners();
});