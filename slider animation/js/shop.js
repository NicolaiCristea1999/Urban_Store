document.addEventListener("DOMContentLoaded", () => {
    const filterBrand = document.getElementById("filter-brand");
    const filterType = document.getElementById("filter-type");
    const filterGender = document.getElementById("filter-gender");
    const filterModel = document.getElementById("filter-model");
    const filterSize = document.getElementById("filter-size");
    const priceMin = document.getElementById("price-min");
    const priceMax = document.getElementById("price-max");

 function filterProducts() {
    const brandValue = filterBrand.value.trim();
    const typeValue = filterType.value.trim();
    const genderValue = filterGender.value.trim();
    const modelValue = filterModel.value.trim();
    const sizeValue = filterSize.value.trim();

    const minPriceValue = parseFloat(priceMin.value) || 0;
    const maxPriceValue = parseFloat(priceMax.value) || Infinity;

    const products = document.querySelectorAll(".product-card");

    products.forEach(product => {
        const productBrand = product.getAttribute("data-brand");
        const productType = product.getAttribute("data-type");
        const productGender = product.getAttribute("data-gender");
        const productModel = product.getAttribute("data-model");
        const productPrice = parseFloat(product.getAttribute("data-price")) || 0;
        const productSizes = product.getAttribute("data-sizes") ? product.getAttribute("data-sizes").split(",") : [];

        // Verificările tale corecte de potrivire
        const matchesBrand = brandValue === "" || productBrand === brandValue;
        const matchesType = typeValue === "" || productType === typeValue;
        const matchesModel = modelValue === "" || productModel === modelValue;
        const matchesGender = genderValue === "" || productGender === genderValue || productGender === "unisex";
        const matchesSize = sizeValue === "" || productSizes.includes(sizeValue);
        const matchesPrice = productPrice >= minPriceValue && productPrice <= maxPriceValue;

        const btnCart = product.querySelector(".add-to-cart-btn");
        const btnFavorite = product.querySelector(".add-to-favorite-btn");

        // Dacă produsul corespunde filtrelor
        if (matchesBrand && matchesType && matchesGender && matchesModel && matchesSize && matchesPrice) {
            product.style.display = "flex";

            // SOLUȚIE DIRECTĂ: Forțăm afișarea butoanelor pentru produsele care trec de filtru
            if (btnCart) btnCart.style.setProperty('display', 'block', 'important');
            if (btnFavorite) btnFavorite.style.setProperty('display', 'inline-block', 'important');
            
        } else {
            // Dacă nu corespunde, ascundem produsul și butoanele lui
            product.style.display = "none";
            if (btnCart) btnCart.style.display = "none";
            if (btnFavorite) btnFavorite.style.display = "none";
        }
    });
}

    // Adăugăm ascultătorii de evenimente
    filterBrand.addEventListener("change", filterProducts);
    filterType.addEventListener("change", filterProducts);
    filterGender.addEventListener("change", filterProducts);
    filterModel.addEventListener("change", filterProducts);
    filterSize.addEventListener("change", filterProducts);
    priceMin.addEventListener("input", filterProducts);
    priceMax.addEventListener("input", filterProducts);

    // Executăm o dată la încărcare ca să ascundem butoanele inițial
    filterProducts();
});




// Selectăm tag-urile <span> din interiorul butoanelor tale din header
// Folosim picioarele CSS pentru a ținti primul buton (Coș) și al doilea (Favorite)
const headerButtons = document.querySelectorAll(".header-buttons .btn-nav span");
const cartCountEl = headerButtons[0]; // Primul span este cel de la Coș
const favCountEl = headerButtons[1];  // Al doilea span este cel de la Favorite

// Opțional: Resetăm vizual favoritele la 0 în caz că în HTML era pus "1" ca test
if (favCountEl) favCountEl.textContent = favoriteTotal;

// Selectăm grid-ul de produse
const productsGrid = document.querySelector(".products-grid");

if (productsGrid) {
    productsGrid.addEventListener("click", (e) => {
        
        // 1. Când se dă click pe butonul „Adaugă în coș”
        if (e.target.classList.contains("add-to-cart-btn")) {
            cartTotal++; // Creștem numărul
            if (cartCountEl) cartCountEl.textContent = cartTotal; // Actualizăm în Header
            
            // Efect vizual temporar pe buton ca să știe utilizatorul că a funcționat
            const textOriginal = e.target.textContent;
            e.target.textContent = "Adăugat! ✓";
            e.target.style.background = "#10b981"; // Schimbăm temporar în verde
            
            setTimeout(() => {
                e.target.textContent = textOriginal;
                e.target.style.background = ""; // Revine la culoarea din CSS
            }, 1000);
        }

        // 2. Când se dă click pe butonul de Favorite (Inimioară)
        if (e.target.classList.contains("add-to-favorite-btn")) {
            favoriteTotal++; // Creștem numărul
            if (favCountEl) favCountEl.textContent = favoriteTotal; // Actualizăm în Header
            
            // Efect vizual rapid de zoom pe butonul de favorite din card
            e.target.style.transform = "scale(1.2)";
            setTimeout(() => {
                e.target.style.transform = "scale(1)";
            }, 200);
        }
    });
}