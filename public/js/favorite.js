// Client-side Favorite toggle handler
document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".btn-favorite");
    if (!btn) return;

    e.preventDefault();
    e.stopPropagation();

    const listingId = btn.getAttribute("data-listing-id");
    if (!listingId) return;

    // Pulse animation
    btn.classList.add("animating");
    setTimeout(() => btn.classList.remove("animating"), 400);

    try {
      const response = await fetch(`/listings/${listingId}/favorite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      if (response.status === 401) {
        const data = await response.json();
        window.location.href = data.redirectUrl || "/login";
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to toggle favorite");
      }

      const data = await response.json();
      if (data.success) {
        // Update all buttons for this listing (in case multiple exist on page)
        const allBtns = document.querySelectorAll(`.btn-favorite[data-listing-id="${listingId}"]`);
        allBtns.forEach((b) => {
          const icon = b.querySelector("i");
          if (icon) {
            if (data.isFavorite) {
              icon.className = "fa-solid fa-heart text-danger";
              b.setAttribute("title", "Remove from favorites");
            } else {
              icon.className = "fa-regular fa-heart";
              b.setAttribute("title", "Add to favorites");
            }
          }
        });

        // Update Navbar count badge
        const badge = document.getElementById("nav-fav-badge");
        if (badge) {
          if (data.count > 0) {
            badge.textContent = data.count;
            badge.classList.remove("d-none");
          } else {
            badge.textContent = "0";
            badge.classList.add("d-none");
          }
        }

        // Smooth removal if on favorites view
        if (!data.isFavorite) {
          const favItem = document.getElementById(`fav-item-${listingId}`);
          if (favItem) {
            favItem.style.transition = "all 0.3s ease";
            favItem.style.transform = "scale(0.85)";
            favItem.style.opacity = "0";
            setTimeout(() => {
              favItem.remove();
              const remaining = document.querySelectorAll(".listing-col-item");
              if (remaining.length === 0) {
                const container = document.getElementById("favorites-container");
                const emptyState = document.getElementById("empty-favorites");
                if (container) container.classList.add("d-none");
                if (emptyState) emptyState.classList.remove("d-none");
              }
            }, 300);
          }
        }
      }
    } catch (err) {
      console.error("Favorite toggle error:", err);
    }
  });
});
