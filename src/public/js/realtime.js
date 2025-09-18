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
  const form = document.getElementById("productForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const product = {
        title: fd.get("title"),
        description: fd.get("description"),
        code: fd.get("code"),
        price: Number(fd.get("price")),
        stock: Number(fd.get("stock")),
        category: fd.get("category"),
        thumbnails: fd.get("thumbnails") ? fd.get("thumbnails").split(",").map(s => s.trim()) : []
      };
      socket.emit("newProduct", product, (ack) => {
        if (ack && ack.status === "error") alert("Error: " + ack.error);
      });
      form.reset();
    });
  }

  // Eliminar producto
  document.addEventListener("click", (e) => {
    if (e.target && e.target.matches("button.deleteBtn")) {
      const id = e.target.dataset.id;
      if (!id) return;
      socket.emit("deleteProduct", id, (ack) => {
        if (ack && ack.status === "error") alert("Error: " + ack.error);
      });
    }
  });

  // Agregar al carrito desde vistas de listado
  document.addEventListener("submit", async (e) => {
    const form = e.target;
    if (form && form.action && form.action.includes("/api/carts/") && form.method.toLowerCase() === "post") {
      e.preventDefault();
      try {
        const resp = await fetch(form.action, { method: "POST" });
        if (!resp.ok) {
          const body = await resp.json();
          alert("Error: " + (body.error || body.message || JSON.stringify(body)));
        } else {
          alert("Producto agregado al carrito");
        }
      } catch {
        alert("Error de red");
      }
    }
  });
});