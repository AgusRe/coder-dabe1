document.addEventListener("DOMContentLoaded", () => {
  const meta = document.getElementById("cart-meta");
  if (!meta) return;
  const cartId = meta.dataset.cartId;
  if (!cartId) return;

  // delegación de eventos
  document.addEventListener("click", async (e) => {
    const incBtn = e.target.closest(".btn-increment");
    const decBtn = e.target.closest(".btn-decrement");
    const removeBtn = e.target.closest(".btn-remove");

    // Incrementar o decrementar
    if (incBtn || decBtn) {
      e.preventDefault();
      const isInc = !!incBtn;
      const btn = incBtn || decBtn;
      const pid = btn.dataset.pid;
      const qtySpan = document.getElementById(`qty-${pid}`);
      let currentQty = parseInt(qtySpan?.textContent || "0", 10);
      if (isNaN(currentQty)) currentQty = 0;

      const newQty = isInc ? currentQty + 1 : currentQty - 1;

      try {
        const resp = await fetch(`/api/carts/${cartId}/products/${pid}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: newQty })
        });

        if (!resp.ok) {
          const err = await resp.json().catch(() => ({}));
          alert("Error: " + (err.error || err.message || resp.statusText));
          return;
        }

        const body = await resp.json();
        const updatedCart = body.cart;
        const prod = updatedCart.products.find(p => p.product._id === pid);

        if (prod) {
          qtySpan.textContent = prod.quantity;
        } else {
          // Producto eliminado, sacar card
          const card = qtySpan.closest(".col-md-6");
          if (card) card.remove();
        }

        updateTotal(updatedCart);
      } catch (err) {
        console.error("Error updating cart:", err);
        alert("Error al actualizar carrito");
      }
    }

    // Eliminar producto completamente
    if (removeBtn) {
        e.preventDefault();
        const result = await showConfirm("¿Seguro que deseas eliminar este producto del carrito?");
        if (!result.isConfirmed) return;

        try {
            const resp = await fetch(`/api/carts/${cartId}/products/${pid}`, {
            method: "DELETE"
            });

            if (!resp.ok) {
            const err = await resp.json().catch(() => ({}));
            showToast(err.error || "Error al eliminar producto", "error");
            return;
            }

            const body = await resp.json();
            const updatedCart = body.cart;

            const card = removeBtn.closest(".col-md-6");
            if (card) card.remove();

            updateTotal(updatedCart);
            showToast("Producto eliminado");
        } catch (err) {
            console.error("Error removing product:", err);
            showToast("Error al eliminar producto", "error");
        }
    }
  });

  function updateTotal(cart) {
    const totalEl = document.getElementById("cart-total");
    if (totalEl) {
      const total = cart.products.reduce((s, it) => s + ((it.product?.price || 0) * it.quantity), 0);
      totalEl.textContent = "$" + total;
    }
  }
});