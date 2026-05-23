// --- LOGICA REPARATĂ ȘI OPTIMIZATĂ PENTRU COȘ ȘI FAVORITE ---

let cartList = [];
let favoriteList = [];

document.addEventListener("DOMContentLoaded", () => {
    const filterBrand = document.getElementById("filter-brand");
    const filterType = document.getElementById("filter-type");
    const filterGender = document.getElementById("filter-gender");
    const filterModel = document.getElementById("filter-model");
    const filterSize = document.getElementById("filter-size");
    const priceMin = document.getElementById("price-min");
    const priceMax = document.getElementById("price-max");

    const productCards = document.querySelectorAll(".product-card");

    function setupProductActions() {
        productCards.forEach(card => {
            const footer = card.querySelector(".product-footer");
            if (!footer) return;

            let actionsWrapper = footer.querySelector(".product-actions");
            const cartBtn = footer.querySelector(".add-to-cart-btn");
            let favBtn = footer.querySelector(".add-to-favorite-btn");

            if (!actionsWrapper) {
                actionsWrapper = document.createElement("div");
                actionsWrapper.className = "product-actions";
            }

            if (cartBtn) {
                const text = cartBtn.textContent.trim();
                if (text === "Vezi Detalii" || text === "Adaugă în coș") {
                    cartBtn.textContent = "🛒 Cumpără";
                }
                if (!actionsWrapper.contains(cartBtn)) {
                    actionsWrapper.appendChild(cartBtn);
                }
            }

            if (!favBtn) {
                favBtn = document.createElement("button");
                favBtn.className = "add-to-favorite-btn";
                favBtn.type = "button";
                favBtn.title = "Adaugă la favorite";
                favBtn.textContent = "❤️";
                actionsWrapper.insertBefore(favBtn, actionsWrapper.firstChild);
            } else if (!actionsWrapper.contains(favBtn)) {
                actionsWrapper.insertBefore(favBtn, actionsWrapper.firstChild);
            }

            if (!footer.contains(actionsWrapper)) {
                footer.appendChild(actionsWrapper);
            }
        });
    }

    function filterProducts() {
        const brandValue = filterBrand.value.trim();
        const typeValue = filterType.value.trim();
        const genderValue = filterGender.value.trim();
        const modelValue = filterModel.value.trim();
        const sizeValue = filterSize.value.trim();

        const minPriceValue = parseFloat(priceMin.value) || 0;
        const maxPriceValue = parseFloat(priceMax.value) || Infinity;

        productCards.forEach(product => {
            const productBrand = product.getAttribute("data-brand");
            const productType = product.getAttribute("data-type");
            const productGender = product.getAttribute("data-gender");
            const productModel = product.getAttribute("data-model");
            const productPrice = parseFloat(product.getAttribute("data-price")) || 0;
            const productSizes = product.getAttribute("data-sizes") ? product.getAttribute("data-sizes").split(",") : [];

            const matchesBrand = brandValue === "" || productBrand === brandValue;
            const matchesType = typeValue === "" || productType === typeValue;
            const matchesModel = modelValue === "" || productModel === modelValue;
            const matchesGender = genderValue === "" || productGender === genderValue || productGender === "unisex";
            const matchesSize = sizeValue === "" || productSizes.includes(sizeValue);
            const matchesPrice = productPrice >= minPriceValue && productPrice <= maxPriceValue;

            const btnCart = product.querySelector(".add-to-cart-btn");
            const btnFavorite = product.querySelector(".add-to-favorite-btn");

            if (matchesBrand && matchesType && matchesGender && matchesModel && matchesSize && matchesPrice) {
                product.style.display = "flex";
                if (btnCart) btnCart.style.setProperty("display", "block", "important");
                if (btnFavorite) btnFavorite.style.setProperty("display", "inline-block", "important");
            } else {
                product.style.display = "none";
                if (btnCart) btnCart.style.display = "none";
                if (btnFavorite) btnFavorite.style.display = "none";
            }
        });
    }

    filterBrand.addEventListener("change", filterProducts);
    filterType.addEventListener("change", filterProducts);
    filterGender.addEventListener("change", filterProducts);
    filterModel.addEventListener("change", filterProducts);
    filterSize.addEventListener("change", filterProducts);
    priceMin.addEventListener("input", filterProducts);
    priceMax.addEventListener("input", filterProducts);

    setupProductActions();
    filterProducts();
});

// Selectăm butoanele din Header folosind direct clasele lor sau poziția exactă
const headerButtons = document.querySelectorAll(".header-buttons .btn-nav");
const btnCartHeader = headerButtons[0];
const btnFavHeader = headerButtons[1];

// Ne asigurăm că elementele span există pentru contoare
const cartCountEl = btnCartHeader ? btnCartHeader.querySelector("span") : null;
const favCountEl = btnFavHeader ? btnFavHeader.querySelector("span") : null;

// Selectăm elementele modale
const cartModal = document.getElementById("cart-modal");
const favoriteModal = document.getElementById("favorite-modal");

// Funcție curată pentru comutarea vizibilității modalului
function toggleModal(modal) {
    if (!modal) return;
    const esteAfisat = window.getComputedStyle(modal).display === "flex";
    modal.style.display = esteAfisat ? "none" : "flex";
}

// Eveniment de deschidere pentru Coș din Header
if (btnCartHeader) {
    btnCartHeader.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation(); // Oprește propagarea evenimentului în fereastră
        toggleModal(cartModal);
    });
}

// Eveniment de deschidere pentru Favorite din Header
if (btnFavHeader) {
    btnFavHeader.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleModal(favoriteModal);
    });
}

// Închidere modale la click pe butonul "✕"
document.querySelectorAll(".custom-modal .close-modal-btn").forEach(button => {
    button.addEventListener("click", (e) => {
        e.preventDefault();
        const modalDeInchis = e.target.closest(".custom-modal");
        toggleModal(modalDeInchis);
    });
});

// Închidere modal la click pe fundalul exterior semi-transparent
window.addEventListener("click", (e) => {
    if (e.target === cartModal) cartModal.style.display = "none";
    if (e.target === favoriteModal) favoriteModal.style.display = "none";
});

const productsGrid = document.querySelector(".products-grid");

if (productsGrid) {
    productsGrid.addEventListener("click", (e) => {
        // Blocăm instant orice comportament de ancoră implicit (previne saltul sus)
        if (e.target.tagName === "BUTTON" || e.target.closest("button") || e.target.tagName === "A") {
            e.preventDefault();
        }

        const productCard = e.target.closest(".product-card");
        if (!productCard) return;

        const productData = {
            id: productCard.getAttribute("data-model") + "-" + productCard.getAttribute("data-price"),
            title: productCard.querySelector(".product-title").textContent,
            price: parseFloat(productCard.getAttribute("data-price")),
            image: productCard.querySelector(".product-image img").src
        };

        // 1. CLICK: ADĂUGARE ÎN COȘ
        if (e.target.classList.contains("add-to-cart-btn")) {
            const existingCartItem = cartList.find(item => item.id === productData.id);
            if (existingCartItem) {
                existingCartItem.quantity += 1;
            } else {
                cartList.push({ ...productData, quantity: 1 });
            }
            updateCartUI();

            // Deschide automat fereastra modala a coșului când adaugi un produs
            if (cartModal) cartModal.style.display = "flex";

            // Efect vizual pe butonul din card
            const textOriginal = e.target.textContent;
            e.target.textContent = "Adăugat! ✓";
            e.target.style.background = "#10b981";
            setTimeout(() => { 
                e.target.textContent = textOriginal; 
                e.target.style.background = ""; 
            }, 800);
        }

        // 2. CLICK: ADĂUGARE LA FAVORITE
        if (e.target.classList.contains("add-to-favorite-btn")) {
            const existaDeja = favoriteList.some(item => item.id === productData.id);
            if (!existaDeja) {
                favoriteList.push(productData);
                updateFavoritesUI();
            }

            // Deschide automat fereastra modala a favoritelor când adaugi o inimioară
            if (favoriteModal) favoriteModal.style.display = "flex";

            e.target.style.transform = "scale(1.2)";
            setTimeout(() => e.target.style.transform = "scale(1)", 200);
        }
    });
}

function updateCartUI() {
    const totalQuantity = cartList.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountEl) cartCountEl.textContent = totalQuantity;
    const container = document.getElementById("cart-items-container");
    const totalEl = document.getElementById("cart-total-price");

    if (!container) return;
    container.innerHTML = "";

    if (cartList.length === 0) {
        container.innerHTML = '<p class="empty-message">Coșul este gol în acest moment.</p>';
        if (totalEl) totalEl.textContent = "0";
        return;
    }

    let pretTotal = 0;
    cartList.forEach(item => {
        const subtotal = item.price * item.quantity;
        pretTotal += subtotal;
        container.innerHTML += `
            <div class="modal-item">
                <img src="${item.image}" alt="${item.title}">
                <div class="modal-item-info">
                    <h4>${item.title}</h4>
                    <span>${item.price.toLocaleString()} MDL</span>
                    <div class="quantity-controls">
                        <button class="qty-btn minus-btn" data-id="${item.id}">-</button>
                        <span class="cart-item-qty">${item.quantity}</span>
                        <button class="qty-btn plus-btn" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="remove-item-btn" data-id="${item.id}">🗑️</button>
            </div>
        `;
    });

    if (totalEl) totalEl.textContent = pretTotal.toLocaleString();
}

function updateFavoritesUI() {
    if (favCountEl) favCountEl.textContent = favoriteList.length;
    const container = document.getElementById("favorite-items-container");

    if (!container) return;
    container.innerHTML = "";

    if (favoriteList.length === 0) {
        container.innerHTML = '<p class="empty-message">Nu ai adăugat niciun produs la favorite.</p>';
        return;
    }

    favoriteList.forEach((item, index) => {
        container.innerHTML += `
            <div class="modal-item">
                <img src="${item.image}" alt="${item.title}">
                <div class="modal-item-info">
                    <h4>${item.title}</h4>
                    <span>${item.price} MDL</span>
                </div>
                <button class="remove-fav-btn" data-index="${index}">✕</button>
            </div>
        `;
    });
}

// Gestionarea click-urilor pe butoanele de Ștergere din interiorul modalelor
const cartModalEl = document.getElementById("cart-modal");
if (cartModalEl) {
    cartModalEl.addEventListener("click", (e) => {
        const itemId = e.target.getAttribute("data-id");
        if (!itemId) return;

        const itemIndex = cartList.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return;

        if (e.target.classList.contains("remove-item-btn")) {
            cartList.splice(itemIndex, 1);
            updateCartUI();
        }

        if (e.target.classList.contains("plus-btn")) {
            cartList[itemIndex].quantity += 1;
            updateCartUI();
        }

        if (e.target.classList.contains("minus-btn")) {
            if (cartList[itemIndex].quantity > 1) {
                cartList[itemIndex].quantity -= 1;
            } else {
                cartList.splice(itemIndex, 1);
            }
            updateCartUI();
        }
    });
}

const favoriteModalEl = document.getElementById("favorite-modal");
if (favoriteModalEl) {
    favoriteModalEl.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-fav-btn")) {
            const index = parseInt(e.target.getAttribute("data-index"));
            favoriteList.splice(index, 1);
            updateFavoritesUI();
        }
    });
}