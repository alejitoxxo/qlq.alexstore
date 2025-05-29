// Datos iniciales
let products = [
  { id: 1, name: "Auriculares Bluetooth", price: 25, description: "", enabled: true },
  { id: 2, name: "Cafetera", price: 45, description: "", enabled: true },
  { id: 3, name: "Mouse Gamer", price: 30, description: "", enabled: true },
  { id: 4, name: "Teclado Mecánico", price: 75, description: "", enabled: true },
  { id: 5, name: "Monitor 24\"", price: 150, description: "", enabled: true },
  { id: 6, name: "Webcam HD", price: 50, description: "", enabled: true }
];

const cart = [];
let nextId = products.length + 1;
let adminAuthenticated = false;

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
  adminProductList: document.getElementById("admin-product-list"),
  closeCart: document.getElementById("close-cart"),
  adminLogin: document.getElementById("admin-login"),
  adminContent: document.getElementById("admin-content"),
  adminPassword: document.getElementById("admin-password"),
  adminLoginBtn: document.getElementById("admin-login-btn"),
  loginMessage: document.getElementById("login-message"),
  adminLogout: document.getElementById("admin-logout"),
  productDescription: document.getElementById("product-description"),
  productEnabled: document.getElementById("product-enabled")
};

// Funciones principales
function renderProducts(filteredProducts = products) {
  elements.productList.innerHTML = "";
  // Filtrar solo productos habilitados
  const availableProducts = filteredProducts.filter(p => p.enabled);
  
  availableProducts.forEach(product => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <h3>${product.name}</h3>
      ${product.description ? `<p>${product.description}</p>` : ''}
      <p>$${product.price}</p>
      <button onclick="addToCart(${product.id})">Agregar</button>
    `;
    elements.productList.appendChild(div);
  });
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (product) {
    cart.push(product);
    updateCart();
  }
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
    filtered = filtered.filter(product => {
      if (max) {
        return product.price >= min && product.price <= max;
      } else {
        return product.price >= min;
      }
    });
  }
  
  renderProducts(filtered);
}

// Funciones de administración
function renderAdminProducts() {
  if (!adminAuthenticated) return;
  
  elements.adminProductList.innerHTML = "";
  products.forEach(product => {
    const div = document.createElement("div");
    div.className = "admin-product";
    div.innerHTML = `
      <div>
        <h3>${product.name}</h3>
        <p>$${product.price} - ${product.enabled ? 'Disponible' : 'Agotado'}</p>
        <p>${product.description || 'Sin descripción'}</p>
      </div>
      <div>
        <label>
          Disponible: 
          <input type="checkbox" class="toggle-enabled" data-id="${product.id}" ${product.enabled ? 'checked' : ''}>
        </label>
        <button class="edit-btn" data-id="${product.id}">Editar</button>
        <button class="delete-btn" data-id="${product.id}">Eliminar</button>
      </div>
    `;
    elements.adminProductList.appendChild(div);
  });

  // Agregar eventos a los nuevos botones
  document.querySelectorAll('.toggle-enabled').forEach(btn => {
    btn.addEventListener('change', function() {
      const id = parseInt(this.dataset.id);
      const product = products.find(p => p.id === id);
      product.enabled = this.checked;
      renderProducts();
    });
  });

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = parseInt(this.dataset.id);
      const product = products.find(p => p.id === id);
      elements.productName.value = product.name;
      elements.productPrice.value = product.price;
      elements.productDescription.value = product.description;
      elements.productEnabled.checked = product.enabled;
      
      // Eliminar el producto para reemplazarlo
      products = products.filter(p => p.id !== id);
      renderAdminProducts();
    });
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = parseInt(this.dataset.id);
      products = products.filter(p => p.id !== id);
      renderAdminProducts();
      renderProducts();
    });
  });
}

function addProduct(e) {
  e.preventDefault();
  const name = elements.productName.value;
  const price = parseFloat(elements.productPrice.value);
  const description = elements.productDescription.value;
  const enabled = elements.productEnabled.checked;
  
  if (name && price) {
    const newProduct = {
      id: nextId++,
      name,
      price,
      description,
      enabled
    };
    products.push(newProduct);
    renderProducts();
    renderAdminProducts();
    elements.productForm.reset();
  }
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
elements.closeCart.addEventListener("click", () => {
  elements.cartElement.style.display = "none";
});
elements.adminLoginBtn.addEventListener("click", () => {
  if (elements.adminPassword.value === "Luismiguel2025") {
    adminAuthenticated = true;
    elements.adminLogin.style.display = "none";
    elements.adminContent.style.display = "block";
    renderAdminProducts();
  } else {
    elements.loginMessage.textContent = "Contraseña incorrecta";
  }
});
elements.adminLogout.addEventListener("click", () => {
  adminAuthenticated = false;
  elements.adminContent.style.display = "none";
  elements.adminLogin.style.display = "block";
  elements.adminPassword.value = "";
  elements.loginMessage.textContent = "";
});

// Inicialización
elements.cartElement.style.display = "none";
elements.adminPanel.style.display = "none";
elements.adminContent.style.display = "none";
renderProducts();