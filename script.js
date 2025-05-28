// Datos iniciales
let products = [
  { id: 1, name: "Auriculares Bluetooth", price: 25 },
  { id: 2, name: "Cafetera", price: 45 },
  { id: 3, name: "Mouse Gamer", price: 30 },
  { id: 4, name: "Teclado Mecánico", price: 75 },
  { id: 5, name: "Monitor 24\"", price: 150 },
  { id: 6, name: "Webcam HD", price: 50 }
];

const cart = [];
let nextId = products.length + 1;

// Elementos del DOM
const elements = {
  cartCount: document.getElementById("cart-count"),
  cartTotal: document.getElementById("cart-total"),
  cartItems: document.getElementById("cart-items"),
  cartButton: document.getElementById("cart-button"),
  cartElement: document.getElementById("cart"),
  productList: document.getElementById("product-list"),
  searchInput: document.getElementById("search-input"),
  priceFilter: document.getElementById("price-filter"),
  adminPanel: document.getElementById("admin-panel"),
  adminToggle: document.getElementById("admin-toggle"),
  productForm: document.getElementById("product-form"),
  productName: document.getElementById("product-name"),
  productPrice: document.getElementById("product-price"),
  adminProductList: document.getElementById("admin-product-list")
};

// Funciones principales
function renderProducts(filteredProducts = products) {
  elements.productList.innerHTML = "";
  filteredProducts.forEach(product => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <h3>${product.name}</h3>
      <p>$${product.price}</p>
      <button onclick="addToCart(${product.id})">Agregar</button>
    `;
    elements.productList.appendChild(div);
  });
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  cart.push(product);
  updateCart();
}

function updateCart() {
  elements.cartItems.innerHTML = "";
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} - $${item.price}
      <button onclick="removeFromCart(${index})" class="remove-btn">×</button>
    `;
    elements.cartItems.appendChild(li);
  });
  elements.cartCount.textContent = cart.length;
  elements.cartTotal.textContent = total;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function checkout() {
  alert("Gracias por tu compra!");
  cart.length = 0;
  updateCart();
}

function filterProducts() {
  const searchTerm = elements.searchInput.value.toLowerCase();
  const priceRange = elements.priceFilter.value;
  
  let filtered = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm)
  );
  
  if (priceRange !== "all") {
    const [min, max] = priceRange.split("-").map(Number);
    filtered = filtered.filter(product => 
      product.price >= min && (max ? product.price <= max : true)
    );
  }
  
  renderProducts(filtered);
}

// Funciones de administración
function renderAdminProducts() {
  elements.adminProductList.innerHTML = "";
  products.forEach(product => {
    const div = document.createElement("div");
    div.className = "admin-product";
    div.innerHTML = `
      <span>${product.name} - $${product.price}</span>
      <button onclick="deleteProduct(${product.id})">Eliminar</button>
    `;
    elements.adminProductList.appendChild(div);
  });
}

function addProduct(e) {
  e.preventDefault();
  const name = elements.productName.value;
  const price = parseFloat(elements.productPrice.value);
  
  if (name && price) {
    const newProduct = {
      id: nextId++,
      name,
      price
    };
    products.push(newProduct);
    renderProducts();
    renderAdminProducts();
    elements.productForm.reset();
  }
}

function deleteProduct(id) {
  products = products.filter(product => product.id !== id);
  renderProducts();
  renderAdminProducts();
}

// Event Listeners
elements.cartButton.addEventListener("click", () => {
  elements.cartElement.style.display = 
    elements.cartElement.style.display === "none" ? "block" : "none";
});

elements.adminToggle.addEventListener("click", () => {
  elements.adminPanel.style.display = 
    elements.adminPanel.style.display === "none" ? "block" : "none";
});

elements.searchInput.addEventListener("input", filterProducts);
elements.priceFilter.addEventListener("change", filterProducts);
elements.productForm.addEventListener("submit", addProduct);

// Inicialización
elements.cartElement.style.display = "none";
elements.adminPanel.style.display = "none";
renderProducts();
renderAdminProducts();