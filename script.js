
const products = [
  { id: 1, name: "Auriculares Bluetooth", price: 25 },
  { id: 2, name: "Cafetera", price: 45 },
  { id: 3, name: "Mouse Gamer", price: 30 },
];

const cart = [];
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const cartItems = document.getElementById("cart-items");
const cartButton = document.getElementById("cart-button");
const cartElement = document.getElementById("cart");

function renderProducts() {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";
  products.forEach(product => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <h3>${product.name}</h3>
      <p>$${product.price}</p>
      <button onclick="addToCart(${product.id})">Agregar</button>
    `;
    productList.appendChild(div);
  });
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  cart.push(product);
  updateCart();
}

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;
    const li = document.createElement("li");
    li.textContent = `${item.name} - $${item.price}`;
    cartItems.appendChild(li);
  });
  cartCount.textContent = cart.length;
  cartTotal.textContent = total;
}

function checkout() {
  alert("Gracias por tu compra!");
  cart.length = 0;
  updateCart();
}

cartButton.addEventListener("click", () => {
  cartElement.style.display = cartElement.style.display === "none" ? "block" : "none";
});

renderProducts();
