const socket = io();

// actualizar lista en tiempo real
socket.on("updateProducts", (products) => {
  const list = document.getElementById("productsList");
  list.innerHTML = "";
  products.forEach((p) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${p.title}</strong> - $${p.price}`;
    list.appendChild(li);
  });
});

// enviar nuevo producto
document.getElementById("productForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const product = Object.fromEntries(formData.entries());
  product.price = Number(product.price);
  product.stock = Number(product.stock);
  socket.emit("newProduct", product);
  e.target.reset();
});

// eliminar producto
document.getElementById("deleteForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const id = e.target.id.value;
  socket.emit("deleteProduct", id);
  e.target.reset();
});