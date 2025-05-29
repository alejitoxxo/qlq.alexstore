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
  adminModal: document.getElementById("admin-modal"),
  adminToggle: document.getElementById("admin-toggle"),
  closeModal: document.querySelector(".close-modal"),
  productForm: document.getElementById("product-form"),
  productName: document.getElementById("product-name"),
  productPrice: document.getElementById("product-price"),
  productImage: document.getElementById("product-image"),
  productStock: document.getElementById("product-stock"),
  adminProductList: document.getElementById("admin-product-list"),
  closeCart: document.getElementById("close-cart"),
  adminLogin: document.getElementById("admin-login"),
  adminContent: document.getElementById("admin-content"),
  adminPassword: document.getElementById("admin-password"),
  adminLoginBtn: document.getElementById("admin-login-btn"),
  loginMessage: document.getElementById("login-message"),
  adminLogout: document.getElementById("admin-logout"),
  productDescription: document.getElementById("product-description"),
  productEnabled: document.getElementById("product-enabled"),
  checkoutBtn: document.getElementById("checkout-btn")
};

// Carrito en localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];
let adminAuthenticated = false;

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
  await loadProducts();
  renderProducts();
  updateCart();
  
  // Event listeners
  elements.cartButton.addEventListener("click", toggleCart);
  elements.adminToggle.addEventListener("click", () => elements.adminModal.style.display = "block");
  elements.closeModal.addEventListener("click", () => elements.adminModal.style.display = "none");
  elements.closeCart.addEventListener("click", () => elements.cartElement.style.display = "none");
  elements.searchInput.addEventListener("input", filterProducts);
  elements.priceFilter.addEventListener("change", filterProducts);
  elements.productForm.addEventListener("submit", addProduct);
  elements.checkoutBtn.addEventListener("click", checkout);
  elements.adminLoginBtn.addEventListener("click", adminLogin);
  elements.adminLogout.addEventListener("click", adminLogout);
  
  // Cerrar modales haciendo clic fuera
  window.addEventListener("click", (e) => {
    if (e.target === elements.adminModal) elements.adminModal.style.display = "none";
    if (e.target === elements.cartElement) elements.cartElement.style.display = "none";
  });
});

// Cargar productos desde API
async function loadProducts() {
  try {
    const response = await fetch('api/productos.php');
    if (!response.ok) throw new Error('Error al cargar productos');
    products = await response.json();
  } catch (error) {
    console.error('Error:', error);
    products = [];
  }
}

// Renderizar productos
function renderProducts(filteredProducts = products) {
  elements.productList.innerHTML = "";
  
  filteredProducts.filter(p => p.enabled).forEach(product => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      ${product.imageUrl ? `<img src="${product.imageUrl}" alt="${product.name}" class="product-image">` : '<div class="image-placeholder"></div>'}
      <h3>${product.name}</h3>
      ${product.description ? `<p>${product.description}</p>` : ''}
      <p>$${product.price}</p>
      <div class="stock-info ${product.stock < 5 ? 'stock-low' : ''} ${product.stock === 0 ? 'stock-out' : ''}">
        ${product.stock > 0 ? `Stock: ${product.stock}` : 'AGOTADO'}
      </div>
      <button onclick="addToCart(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
        ${product.stock === 0 ? 'Agotado' : 'Agregar'}
      </button>
    `;
    elements.productList.appendChild(div);
  });
}

// Funciones de carrito
function addToCart(productId) {
  const product = products.find(p => p.id == productId);
  if (!product || product.stock < 1) return;
  
  // Verificar si ya está en el carrito
  const cartItem = cart.find(item => item.id === productId);
  
  if (cartItem) {
    if (cartItem.quantity < product.stock) {
      cartItem.quantity++;
    } else {
      alert('No hay suficiente stock');
      return;
    }
  } else {
    cart.push({...product, quantity: 1});
  }
  
  updateCart();
  saveCartToLocalStorage();
}

function updateCart() {
  elements.cartItems.innerHTML = "";
  let total = 0;
  
  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} - $${item.price} × ${item.quantity}
      <div>
        <button onclick="changeQuantity(${index}, -1)">−</button>
        <span>${item.quantity}</span>
        <button onclick="changeQuantity(${index}, 1)">+</button>
        <button onclick="removeFromCart(${index})" class="remove-btn">×</button>
      </div>
    `;
    elements.cartItems.appendChild(li);
  });
  
  elements.cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  elements.cartTotal.textContent = total.toFixed(2);
}

function changeQuantity(index, delta) {
  const productId = cart[index].id;
  const product = products.find(p => p.id == productId);
  
  if (delta > 0 && cart[index].quantity >= product.stock) {
    alert('No hay suficiente stock');
    return;
  }
  
  cart[index].quantity += delta;
  
  if (cart[index].quantity < 1) {
    cart.splice(index, 1);
  }
  
  updateCart();
  saveCartToLocalStorage();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
  saveCartToLocalStorage();
}

function saveCartToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Checkout (Integración con MercadoPago)
async function checkout() {
  if (cart.length === 0) {
    alert('El carrito está vacío');
    return;
  }
  
  try {
    const response = await fetch('procesar-pago.php', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ cart })
    });
    
    const data = await response.json();
    
    if (data.init_point) {
      // Redirigir a MercadoPago
      window.location.href = data.init_point;
    } else {
      throw new Error('Error al procesar pago');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al procesar el pago');
  }
}

// Funciones de administración (completamente integradas con backend)
async function renderAdminProducts() {
  if (!adminAuthenticated) return;
  
  await loadProducts();
  elements.adminProductList.innerHTML = "";
  
  products.forEach(product => {
    const div = document.createElement("div");
    div.className = "admin-product";
    div.innerHTML = `
      <div>
        ${product.imageUrl ? `<img src="${product.imageUrl}" alt="${product.name}" class="admin-product-image">` : '<div class="image-placeholder small"></div>'}
        <h3>${product.name}</h3>
        <p>$${product.price} | Stock: ${product.stock}</p>
        <p>${product.enabled ? '🟢 Disponible' : '🔴 Oculto'}</p>
      </div>
      <div>
        <button class="edit-btn" data-id="${product.id}">Editar</button>
        <button class="delete-btn" data-id="${product.id}">Eliminar</button>
      </div>
    `;
    elements.adminProductList.appendChild(div);
  });
  
  // Eventos para botones
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', async function() {
      const id = this.dataset.id;
      const product = products.find(p => p.id == id);
      
      elements.productName.value = product.name;
      elements.productPrice.value = product.price;
      elements.productImage.value = product.imageUrl || "";
      elements.productDescription.value = product.description || "";
      elements.productStock.value = product.stock;
      elements.productEnabled.checked = product.enabled;
      
      // Eliminar para edición
      await deleteProduct(id);
    });
  });
  
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      if (confirm('¿Eliminar este producto permanentemente?')) {
        deleteProduct(this.dataset.id);
      }
    });
  });
}

async function addProduct(e) {
  e.preventDefault();
  
  const newProduct = {
    name: elements.productName.value,
    price: parseFloat(elements.productPrice.value),
    imageUrl: elements.productImage.value,
    description: elements.productDescription.value,
    stock: parseInt(elements.productStock.value),
    enabled: elements.productEnabled.checked
  };
  
  try {
    const response = await fetch('api/productos.php', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(newProduct)
    });
    
    if (response.ok) {
      await renderAdminProducts();
      renderProducts();
      elements.productForm.reset();
    } else {
      throw new Error('Error al agregar producto');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al guardar el producto');
  }
}

async function deleteProduct(id) {
  try {
    const response = await fetch(`api/productos.php?id=${id}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      await renderAdminProducts();
      renderProducts();
    } else {
      throw new Error('Error al eliminar producto');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al eliminar el producto');
  }
}

// Funciones de autenticación
function adminLogin() {
  if (elements.adminPassword.value === "Luismiguel2025") {
    adminAuthenticated = true;
    elements.adminLogin.style.display = "none";
    elements.adminContent.style.display = "block";
    renderAdminProducts();
  } else {
    elements.loginMessage.textContent = "Contraseña incorrecta";
  }
}

function adminLogout() {
  adminAuthenticated = false;
  elements.adminContent.style.display = "none";
  elements.adminLogin.style.display = "block";
  elements.adminPassword.value = "";
  elements.loginMessage.textContent = "";
  elements.adminModal.style.display = "none";
}

// Filtro de productos
function filterProducts() {
  const searchTerm = elements.searchInput.value.toLowerCase();
  const priceRange = elements.priceFilter.value;
  
  let filtered = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) &&
    product.enabled
  );
  
  if (priceRange !== "all") {
    const [min, max] = priceRange.split("-").map(Number);
    filtered = filtered.filter(product => {
      return max ? 
        (product.price >= min && product.price <= max) : 
        (product.price >= min);
    });
  }
  
  renderProducts(filtered);
}

// Auxiliar para mostrar/ocultar carrito
function toggleCart() {
  elements.cartElement.style.display = 
    elements.cartElement.style.display === "block" ? "none" : "block";
}