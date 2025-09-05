import {
  allMeals,
  currency,
  maxOrders,
  getDOMElements,
  handleCheckout,
  positionMiniCards,
  adjustMiniCards,
} from "./CRUD.js";
import { Tastey } from "./TasteyManager.js";
import {
  tasteyDebouncer,
  check,
  formatValue,
  standardize,
  panning,
  positionGradient,
  syncScrollToTop,
  syncScrollToBottom,
} from "./utils.js";

tasteyMiniBag();

function tasteyMiniBag() {
  const cartContainer = document.querySelector(".cart-container");
  try {
    const miniCart = document.createElement("div");
    miniCart.className += "mini-meal-cart close";
    miniCart.dataset.cart = 0;
    miniCart.innerHTML += `
            <div class="mini-meal-cart-content">
                <div class="mini-cart-top-section">
                    <div class="mini-cart-title-wrapper">
                        <h5 data-cart="0" data-meals="0">Your Bag</h5>
                    </div>
                    <div>
                        <button type="button" title="Close Bag" class="close-cart-button">
                            <svg viewBox="0 0 384 512">
                                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="mini-empty-cart-section">
                    <div class="mini-empty-cart-text">
                        <h6>No <span class="Tastey-text">Tastey</span> orders yet!</h6>
                        <a href="menu.html" title="Continue Shopping" class="mini-continue-shopping-button">Continue Shopping</a>
                    </div>
                </div>
                <div class="mini-cart-section">
                    <div class="mini-cart-order-review-section">
                        <div class="mini-cart-idle-content">Tastey</div>
                    </div>
                    <div class="mini-cart-checkout">
                        <div class="mini-cart-checkout-preview">
                            <span class="mini-cart-total-amount-description">
                                <p>The total amount of</p>
                                <p>(including VAT)</p>
                            </span>
                            <span class="mini-cart-total-amount-values">
                                <span class="mini-cart-TOTAL-COST">${formatValue(currency, Tastey.totalCost)}</span>
                                <span class="mini-cart-actual-price">${formatValue(currency, Tastey.actualAmount) ?? 0}</span>
                            </span>
                        </div>
                        <div class="mini-cart-buttons-wrapper">
                            <button type="button" title="Go to Checkout" class="mini-cart-checkout-button Tastey-blur" data-cart="0">GO TO CHECKOUT</button>
                            <a href="menu.html" title="Open Shopping Bag" class="mini-cart-shopping-bag-button">Open Shopping Bag
                                <span class="mini-cart-icon Cart" data-cart="0">
                                    <svg viewBox="0 -960 960 960">
                                        <path d="M240-80q-33 0-56.5-23.5T160-160v-480q0-33 23.5-56.5T240-720h80q0-66 47-113t113-47q66 0 113 47t47 113h80q33 0 56.5 23.5T800-640v480q0 33-23.5 56.5T720-80H240Zm0-80h480v-480h-80v80q0 17-11.5 28.5T600-520q-17 0-28.5-11.5T560-560v-80H400v80q0 17-11.5 28.5T360-520q-17 0-28.5-11.5T320-560v-80h-80v480Zm160-560h160q0-33-23.5-56.5T480-800q-33 0-56.5 23.5T400-720ZM240-160v-480 480Z"/>
                                    </svg>
                                </span>
                            </a>
                            <a href="menu.html" class="mini-cart-continue-shopping-button" title="Continue Shopping">Continue Shopping 
                                <span class="mini-cart-menu-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" ><path d="M841-518v318q0 33-23.5 56.5T761-120H201q-33 0-56.5-23.5T121-200v-318q-23-21-35.5-54t-.5-72l42-136q8-26 28.5-43t47.5-17h556q27 0 47 16.5t29 43.5l42 136q12 39-.5 71T841-518Zm-272-42q27 0 41-18.5t11-41.5l-22-140h-78v148q0 21 14 36.5t34 15.5Zm-180 0q23 0 37.5-15.5T441-612v-148h-78l-22 140q-4 24 10.5 42t37.5 18Zm-178 0q18 0 31.5-13t16.5-33l22-154h-78l-40 134q-6 20 6.5 43t41.5 23Zm540 0q29 0 42-23t6-43l-42-134h-76l22 154q3 20 16.5 33t31.5 13ZM201-200h560v-282q-5 2-6.5 2H751q-27 0-47.5-9T663-518q-18 18-41 28t-49 10q-27 0-50.5-10T481-518q-17 18-39.5 28T393-480q-29 0-52.5-10T299-518q-21 21-41.5 29.5T211-480h-4.5q-2.5 0-5.5-2v282Zm560 0H201h560Z"/>
                                    </svg>
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>                                
        `;
    cartContainer.append(miniCart);
    const mcOrderReviewSection = document.querySelector(
      ".mini-cart-order-review-section",
    );
    Tastey.tasteyRecord.tasteyOrders?.forEach(({ id, orders }) => {
      const meal = allMeals.find((meal) => meal.id === id);
      const { label, price, serving, picSrc } = meal;
      mcOrderReviewSection.innerHTML += `
            <div class="mini-cart-tastey-meal-order" data-id="${id}" data-like="${Tastey.getLikeValue(id) ?? false}" data-orders="${standardize(orders)}" data-discount="${price.discount ?? 0}">               
                <div class="mini-cart-tastey-order-image-wrapper">
                        <img class="mini-cart-tastey-order-image" src="${picSrc}" loading="lazy" alt="Image of ${label}" title="${label}">
                    </div>
                    <div class="mini-cart-tastey-order-info">
                        <div class="mini-cart-tastey-order-text-wrapper">
                            <div class="mini-cart-tastey-order-text">
                                <h5 data-serving=${serving ? '"' + serving + '"' : "NG"} title="${label}">${label}</h5>
                                <span>
                                <p class="mini-cart-meal-price">${formatValue(currency, check(price.currentValue, price.discount))}</p>
                                <p  class="mini-cart-actual-meal-price">${formatValue(currency, price.currentValue)}</p>
                                </span>
                            </div>
                            <div>
                                <button type="button" title="Remove ${label} from Bag"  class="mini-cart-delete-order">
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                                    </span>
                                </button>
                                <button type="button" title="${(Tastey.getLikeValue(id) ?? false) ? `Remove ${label} from Wishlist` : `Add ${label} to Wishlist`}" class="mini-cart-wishlist-toggler">
                                    <span>
                                        <svg class="unliked-heart-icon" viewBox="0 -960 960 960"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/></svg>
                                        <svg class="liked-heart-icon" viewBox="0 0 512 512"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>
                                    </span>
                                </button>
                            </div>
                        </div>
                        <div class="mini-cart-toggle-wrapper">
                            <span class="mini-cart-toggle">
                                <button type="button" title="Remove 1 ${label[label.length - 1] === "s" ? label.slice(0, label.length - 1) : label}" class="mini-cart-sign mini-cart-minus${orders > 1 ? " hover" : ""}">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                                    <svg width="12" height="4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="M11.357 3.332A.641.641 0 0 0 12 2.69V.643A.641.641 0 0 0 11.357 0H.643A.641.641 0 0 0 0 .643v2.046c0 .357.287.643.643.643h10.714Z" id="a"/></defs><use fill-rule="nonzero" xlink:href="#a"/></svg>
                                </button>
                                    <p class="mini-cart-order-number" contenteditable="plaintext-only">${standardize(orders)}</p>
                                <button type="button" title="Add 1 ${label[label.length - 1] === "s" ? label.slice(0, label.length - 1) : label}" class="mini-cart-sign mini-cart-add hover${orders >= maxOrders ? " disabled" : ""}" tabindex="${orders >= maxOrders ? -1 : 0}">
                                    <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="M12 7.023V4.977a.641.641 0 0 0-.643-.643h-3.69V.643A.641.641 0 0 0 7.022 0H4.977a.641.641 0 0 0-.643.643v3.69H.643A.641.641 0 0 0 0 4.978v2.046c0 .356.287.643.643.643h3.69v3.691c0 .356.288.643.644.643h2.046a.641.641 0 0 0 .643-.643v-3.69h3.691A.641.641 0 0 0 12 7.022Z" id="b"/></defs><use fill-rule="nonzero" xlink:href="#b"/></svg>
                                </button>
                            </span>      
                        </div>
                    </div>
                </div>            
            `;
    });
  } catch (error) {
    console.error("Error occured while restoring Mini Tastey Bag: " + error);
  }
}

//DOM Elements
const navbarCart = document.querySelector(".navbar-cart"),
  cartContainer = document.querySelector(".cart-container"),
  miniMealCart = document.querySelector(".mini-meal-cart"),
  closeCartBtn = document.querySelector(".close-cart-button"),
  mcShoppingBagBtn = document.querySelector(".mini-cart-shopping-bag-button"),
  mcOrderReviewSection = document.querySelector(
    ".mini-cart-order-review-section",
  ),
  mcCheckoutBtn = document.querySelector(".mini-cart-checkout-button");

//DOM Operations
getDOMElements();
window.addEventListener("load", positionMiniCards);

function openMiniCart() {
  positionMiniCards();
  syncScrollToBottom("instant", mcOrderReviewSection);
}

navbarCart.addEventListener("click", () =>
  miniMealCart.classList.toggle("close"),
);
navbarCart.addEventListener("click", openMiniCart);
navbarCart.addEventListener("pointerover", openMiniCart);
navbarCart.addEventListener("focus", openMiniCart);
closeCartBtn.addEventListener("click", () =>
  miniMealCart.classList.add("close"),
);
mcShoppingBagBtn.addEventListener(
  "click",
  () => (sessionStorage.open_cart = true),
);

//handling the panning of the food images
panning(document.querySelectorAll(".mini-cart-tastey-order-image"));

//closing the cart automatically when necessary for a better experience and for privacy reasons
let timeout;
const itv = 45000;
miniMealCart.addEventListener("mouseover", () => {
  if (timeout) clearTimeout(timeout);
});
cartContainer.addEventListener("mouseleave", handleCartView);
document.body.addEventListener("mouseleave", handleCartView);

function handleCartView() {
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(() => {
    if (
      !cartContainer.matches(":hover") &&
      !cartContainer.matches(":focus-within")
    )
      miniMealCart.classList.add("close");
  }, itv);
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden")
    miniMealCart.classList.add("close");
});

const mcResizeDebouncer = new tasteyDebouncer();
let mcScrollTicker = false;
mcOrderReviewSection.addEventListener("scroll", () => {
  if (mcScrollTicker) return;
  requestAnimationFrame(() => {
    adjustMiniCards();
    mcScrollTicker = false;
  });
  mcScrollTicker = true;
});
window.addEventListener(
  "resize",
  mcResizeDebouncer.debounce(positionMiniCards, 200),
);

let mcPointerTicker = false;
miniMealCart.addEventListener("pointermove", (e) => {
  if (mcPointerTicker) return;
  requestAnimationFrame(() => {
    positionGradient(e, miniMealCart);
    mcPointerTicker = false;
  });
  mcPointerTicker = true;
});

mcCheckoutBtn.addEventListener("click", handleCheckout);
