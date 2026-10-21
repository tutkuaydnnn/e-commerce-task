/* Tuen Creations – shared cart / favorites / profile state (localStorage)
   Follows common e-commerce patterns: icon buttons with count badges,
   hover/click dropdown mini-carts, item lists with remove, totals. */
(function () {
  const FAV = 'tuen-favs';
  const CART = 'tuen-cart';

  const Store = {
    favs() { try { return JSON.parse(localStorage.getItem(FAV) || '[]'); } catch (e) { return []; } },
    cart() { try { return JSON.parse(localStorage.getItem(CART) || '[]'); } catch (e) { return []; } },

    toggleFav(id) {
      const f = this.favs();
      const i = f.indexOf(id);
      if (i > -1) f.splice(i, 1); else f.push(id);
      localStorage.setItem(FAV, JSON.stringify(f));
      return i === -1; // true = now a favorite
    },
    isFav(id) { return this.favs().includes(id); },

    addCart(id, text) {
      const c = this.cart();
      const key = id + '::' + (text || '');
      const hit = c.find(x => x.key === key);
      if (hit) hit.qty += 1; else c.push({ key, id, qty: 1, text: text || '' });
      localStorage.setItem(CART, JSON.stringify(c));
    },
    setQty(key, qty) {
      const c = this.cart().filter(x => x.key !== key);
      if (qty > 0) {
        const src = this.cart();
        const item = src.find(x => x.key === key);
        if (item) c.push({ ...item, qty });
      }
      localStorage.setItem(CART, JSON.stringify(c));
    },
    removeCart(key) {
      localStorage.setItem(CART, JSON.stringify(this.cart().filter(x => x.key !== key)));
    },

    cartTotal(list) {
      return list.reduce((s, x) => {
        const p = allProducts().find(pp => pp.id === x.id);
        return p ? s + p.price * x.qty : s;
      }, 0);
    },
    favCount() { return this.favs().length; },
    cartCount() { return this.cart().reduce((s, x) => s + x.qty, 0); }
  };

  window.Store = Store;

  // ---------- Header icons (profile / favorites / cart) ----------
  function money(n) { return n + ' PLN'; }

  // PRODUCTS is a top-level `const` in products.js (not attached to window)
  function allProducts() {
    try { return PRODUCTS; } catch (e) { return []; }
  }

  function productOf(id) { return allProducts().find(p => p.id === id); }

  function renderCartPanel(panel) {
    const items = Store.cart();
    if (!items.length) {
      panel.innerHTML = '<p class="dd-empty">Your cart is empty.<br>Add something handmade you love! 🧡</p>';
      return;
    }
    const total = Store.cartTotal(items);
    panel.innerHTML =
      items.map(x => {
        const p = productOf(x.id) || { name: x.id, price: 0 };
        return `<div class="dd-item">
          <div>
            <strong>${p.name}</strong>${x.text ? `<br><em class="dd-note">“${x.text}”</em>` : ''}
            <span class="dd-price">${p.price} PLN</span>
          </div>
          <div class="dd-qty">
            <button type="button" data-act="dec" data-key="${x.key}" aria-label="Decrease quantity">−</button>
            <span>${x.qty}</span>
            <button type="button" data-act="inc" data-key="${x.key}" aria-label="Increase quantity">+</button>
            <button type="button" data-act="rm" data-key="${x.key}" aria-label="Remove item">✕</button>
          </div>
        </div>`;
      }).join('') +
      `<div class="dd-total">Subtotal: <strong>${money(total)}</strong></div>
       <a class="btn btn-primary dd-checkout" href="#">Proceed to Checkout</a>`;
  }

  function renderFavPanel(panel) {
    const ids = Store.favs();
    if (!ids.length) {
      panel.innerHTML = '<p class="dd-empty">No favorites yet.<br>Tap the ♥ on any product to save it here.</p>';
      return;
    }
    panel.innerHTML =
      `<p class="dd-title">Saved for later</p>` +
      ids.map(id => {
        const p = productOf(id) || { name: id };
        return `<div class="dd-item">
          <div><a href="detail.html?id=${id}"><strong>${p.name}</strong></a>
          <span class="dd-price">${p.price ? p.price + ' PLN' : ''}</span></div>
          <button type="button" data-act="unfav" data-id="${id}" aria-label="Remove from favorites">♥</button>
        </div>`;
      }).join('');
  }

  function mountHeader() {
    const header = document.querySelector('.header');
    if (!header || header.querySelector('.header-icons')) return;

    // icons live inside the right-side group so they never wrap to the far left
    const anchor = header.querySelector('.header-right') || header;

    const wrap = document.createElement('div');
    wrap.className = 'header-icons';
    wrap.innerHTML = `
      <div class="menu-wrap">
        <button type="button" class="icon-btn" id="fav-icon" aria-label="My favorites"
                aria-haspopup="true" aria-expanded="false">♥ <span class="icon-badge" id="fav-badge"></span></button>
        <div class="dropdown" id="fav-drop" hidden></div>
      </div>
      <div class="menu-wrap">
        <button type="button" class="icon-btn" id="cart-icon" aria-label="Shopping cart"
                aria-haspopup="true" aria-expanded="false">🛒 <span class="icon-badge" id="cart-badge"></span></button>
        <div class="dropdown" id="cart-drop" hidden></div>
      </div>
      <div class="menu-wrap">
        <button type="button" class="icon-btn" id="profile-icon" aria-label="My account"
                aria-haspopup="true" aria-expanded="false">👤</button>
        <div class="dropdown" id="profile-drop" hidden>
          <p class="dd-title"><strong>Hello! 👋</strong><br><span class="dd-note">Sign in to sync your cart &amp; orders</span></p>
          <a class="btn btn-primary dd-btn" href="#">Sign in / Register</a>
          <div class="dd-links">
            <a href="#">My Profile</a>
            <a href="#">My Orders</a>
            <a href="#">My Favorites</a>
            <a href="#">Returns &amp; Help</a>
          </div>
        </div>
      </div>`;
    anchor.appendChild(wrap);
    refreshBadges();

    function closeAll() {
      wrap.querySelectorAll('.dropdown').forEach(d => d.hidden = true);
      wrap.querySelectorAll('.icon-btn[aria-expanded]').forEach(b => b.setAttribute('aria-expanded', 'false'));
    }

    function toggle(iconBtn, panel, fill) {
      iconBtn.addEventListener('click', () => {
        const opening = panel.hidden;
        closeAll();
        if (opening) { fill(panel); panel.hidden = false; iconBtn.setAttribute('aria-expanded', 'true'); }
      });
    }

    toggle(document.getElementById('cart-icon'), document.getElementById('cart-drop'), renderCartPanel);
    toggle(document.getElementById('fav-icon'), document.getElementById('fav-drop'), renderFavPanel);
    toggle(document.getElementById('profile-icon'), document.getElementById('profile-drop'), () => {});

    // Instructor Notes & Taxonomy pill (per-page header markup, if present)
    const pill = document.getElementById('notes-pill');
    if (pill) {
      const notesDrop = document.createElement('div');
      notesDrop.className = 'dropdown';
      notesDrop.id = 'notes-drop';
      notesDrop.hidden = true;
      notesDrop.innerHTML = `
        <p class="dd-title"><strong>Instructor Notes &amp; Taxonomy</strong></p>
        <p class="dd-small">Main object type: <em>Handcrafted Home &amp; Living Product</em> — one unified data model.</p>
        <ul class="dd-tax">
          <li>1. Drinkware &amp; Tableware › Mugs &amp; Cups, Tableware Accents</li>
          <li>2. Candles &amp; Home Fragrance › Jar Candles (volume &amp; burn facets)</li>
          <li>3. Incense &amp; Decor Accents › Sculptural Decor (size facet)</li>
        </ul>
        <p class="dd-small" style="margin-top:8px">Key attributes: name · category · material · price · capacity · personalization</p>`;
      pill.insertAdjacentElement('afterend', notesDrop);
      pill.addEventListener('click', () => {
        const open = notesDrop.hidden;
        closeAll();
        if (open) { notesDrop.hidden = false; pill.setAttribute('aria-expanded', 'true'); }
        else pill.setAttribute('aria-expanded', 'false');
      });
      document.addEventListener('click', e => {
        if (!notesDrop.contains(e.target) && !pill.contains(e.target)) {
          notesDrop.hidden = true;
          pill.setAttribute('aria-expanded', 'false');
        }
      });
    }

    document.addEventListener('click', e => {
      if (!wrap.contains(e.target)) closeAll();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

    // live panel actions (+/−/remove/unfav)
    wrap.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.act === 'inc' || b.dataset.act === 'dec' || b.dataset.act === 'rm') {
        const c = Store.cart();
        const it = c.find(x => x.key === b.dataset.key);
        if (b.dataset.act === 'rm') { Store.removeCart(b.dataset.key); }
        else if (it) {
          Store.setQty(b.dataset.key, it.qty + (b.dataset.act === 'inc' ? 1 : -1));
        }
        refreshBadges(); renderCartPanel(document.getElementById('cart-drop'));
        document.dispatchEvent(new CustomEvent('store:change'));
      }
      if (b.dataset.act === 'unfav') {
        Store.toggleFav(b.dataset.id);
        refreshBadges(); renderFavPanel(document.getElementById('fav-drop'));
        document.dispatchEvent(new CustomEvent('store:change'));
      }
    });
  }

  function refreshBadges() {
    const fb = document.getElementById('fav-badge');
    const cb = document.getElementById('cart-badge');
    if (fb) {
      const n = Store.favCount();
      fb.textContent = n; fb.hidden = n === 0 ? 'hidden' : undefined;
    }
    if (cb) {
      const n = Store.cartCount();
      cb.textContent = n; cb.hidden = n === 0 ? 'hidden' : undefined;
    }
  }

  window.StoreUI = { mountHeader, refreshBadges };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { mountHeader(); refreshBadges(); });
  } else {
    mountHeader(); refreshBadges();
  }
})();
