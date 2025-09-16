document.addEventListener("DOMContentLoaded", () => {
  const socket = io();

  // Actualizar lista de productos cuando el servidor emite updateProducts
  socket.on("updateProducts", (products) => {
    const list = document.getElementById("productsList");
    if (!list) return;
    list.innerHTML = "";
    products.forEach((p) => {
      const li = document.createElement("li");
      li.dataset.id = p._id;
      li.innerHTML = `<strong>${p.title}</strong> - $${p.price} 
        <button class="deleteBtn" data-id="${p._id}">Eliminar</button>`;
      list.appendChild(li);
    });
  });

  // Enviar nuevo producto
  const productForm = document.getElementById("productForm");
  if (productForm) {
    productForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(productForm);
      const product = Object.fromEntries(fd.entries());
      // parse numeric fields
      if (product.price) product.price = Number(product.price);
      if (product.stock) product.stock = Number(product.stock);
      socket.emit("newProduct", product);
      productForm.reset();
    });
  }

  // Eliminar producto
  document.addEventListener("click", (e) => {
    if (e.target && e.target.matches("button.deleteBtn")) {
      const id = e.target.dataset.id;
      if (!id) return;
      socket.emit("deleteProduct", id);
    }
  });

  // Agregar al carrito desde vistas de listado
  document.addEventListener("submit", async (e) => {
    const form = e.target;
    if (form && form.action && form.action.includes("/api/carts/") && form.method.toLowerCase() === "post") {
      e.preventDefault();
      try {
        const resp = await fetch(form.action, {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        });
        if (!resp.ok) {
          const err = await resp.json();
          alert("Error al agregar al carrito: " + (err.error || err.message || resp.statusText));
        } else {
          alert("Producto agregado al carrito");
        }
      } catch (err) {
        console.error(err);
        alert("Error de red al agregar al carrito");
      }
    }
  });
});