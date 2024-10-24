import data from "./fetch.js"
import { Tastey, weakTastey } from "./TasteyManager.js"
import { tasteyThrottler, tasteyDebouncer, check, formatValue, clamp , panning, scrollContentTo, remToPx, pxToRem, rand, syncScrollToTop, syncScrollToBottom , asyncScrollToTop , asyncScrollToBottom, positionGradient, stars } from "./utility-functions.js"
import { autoRemoveScroller, quickScrollShow, removeScrolls, quickScrolls } from "./build-scroller.js"

//Getting necessary data
const meals = data.tasteyMeals,

allMeals = [...meals[0].starters,...meals[1]["main-meals"],...meals[2].drinks,...meals[3].desserts];

// the code below fills up the cart immediately for development purposes
// allMeals.forEach(({ id }) => {
//     Tastey.addMeal(id,allMeals,data.currency)
// })

// the one-liner below clears the cart immediately for development purposes
// localStorage.clear()

const mobileThreshold = remToPx(36)

tasteyMenu(data)
tasteyBag(data)

function tasteyMenu(data){
    const main = document.createElement("main");
    main.classList.add("menu")
    main.innerHTML += 
        `<div class="attention-grabber">
            <p>You really haven't tasted food this goated!</p>
            <span></span>
        </div>
        <div class="attention-grabber-two">
            <span></span>
            <p>Meals that are guaranteed to leave a mark.</p>
        </div>
        <div class="main-menu-title-wrapper">
            <span id="magic">
                <span class="magic-star">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"/></svg>
                </span>
                <span class="magic-star">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"/></svg>
                </span>
                <span class="magic-star">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"/></svg>
                </span>
                <span class="magic-star">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"/></svg>
                </span>
                <span class="magic-star">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"/></svg>
                </span>
                <span class="magic-star">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"/></svg>
                </span>
                <span class="magic-star">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"/></svg>
                </span>
                <span class="magic-star">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"/></svg>
                </span>
                <span class="magic-star">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"/></svg>
                </span>
                <span class="magic-star">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"/></svg>
                </span>
            <h3 class="main-menu-title">Our <span id="tastey">Tastey</span> Menu</h3>
            </span>
        </div>`
    
    const TasteyMeals = data.tasteyMeals
    TasteyMeals.forEach(meal => {
        const product = Object.keys(meal)[0]
        const productName = meal[product][0].category
        const menuSection = document.createElement('div')
        menuSection.className += `${productName}-section menu-sections`
        const menuHeader = document.createElement('div')
        menuHeader.className +=`tastey-menu-title-wrapper ${product}`
        menuHeader.innerHTML += `<h1>${productName.toUpperCase()}</h1>`
        menuSection.append(menuHeader)
        const menuContainer = document.createElement('div')
        menuContainer.className += `tastey-menu tastey-${product}`

        meal[product].forEach(({ id, label, description, price, like, picSrc}) => {
            like = like ?? false 
            menuContainer.innerHTML += `
            <div class="tastey-meal" data-id='${id}' data-like="${weakTastey.getLikeValue(Number(id)) ?? like}" data-discount="${price.discount ?? 0}">
                    <div class="tastey-meal-content">
                        <div class="tastey-meal-image-wrapper">
                            <img class="tastey-meal-image" src="${picSrc}" alt="Image of ${label}" title="${label}">
                            <span class="tooltip-text like-tooltip">Double tap to like!</span>
                            <span class="tooltip-text unlike-tooltip">Double tap to unlike</span>
                            <button type="button" title="Tap to like!" class="heart-icon-wrapper">
                                <svg class="unliked-heart-icon" viewBox="0 -960 960 960"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/></svg>
                                <svg class="liked-heart-icon" viewBox="0 0 512 512"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>
                            </button>
                        </div>
                        <div class="product-content">
                            <div class="food-info">
                                <h2 class="food-name">${label}</h2>
                                <p class="food-description">${description}</p>
                            </div>
                            <div class="price-container">
                                <button type="button" class="add-to-cart-button" title="Add to Shopping Bag" data-id='${id}' data-orders="${weakTastey.getOrdersValue(Number(id)) ?? 0}">Add to Bag</button>
                                <span class="product-price" data-discount="${price.discount ?? 0}">${formatValue(data.currency,check(price.currentValue,price.discount))}</span>
                            </div>
                        </div>
                    </div>
                </div>
                `
        })
        menuSection.append(menuContainer)
        main.append(menuSection)
    })  
    document.body.append(main)
}


 function tasteyBag(data) {
    try {
        const meals = data.tasteyMeals
        const allMeals = [...meals[0].starters,...meals[1]["main-meals"],...meals[2].drinks,...meals[3].desserts]
        Tastey.calculateCheckoutDetails(allMeals)
        const main = document.createElement("main")
        main.classList.add("meal-cart")
        main.dataset.cart = "0"
        main.innerHTML += 
        `
            <div class="cart-title-wrapper">
                <h3>Your Shopping Bag</h3>
            </div>
            <div class="empty-cart-section">
                <div class="empty-cart-text">
                    <h2>No <span>Tastey</span> orders yet!</h2>
                    <p>Click <a type="button" class="continue-shopping-button" href="menu.html" title="Continue Shopping">here</a> to continue shopping</p>
                </div>
            </div>
            <div class="cart-section">
                <div class="checkout-section">
                    <div class="checkout-section-content">
                        <div class="clear-cart-section">
                            <div class="clear-cart-btn-wrapper">
                                <button type="button" title="Empty Bag" class="clear-cart-btn">EMPTY BAG</button>
                            </div>
                        </div>                        
                        <div class="order-summary">
                            <div class="order-preview">
                                <h2>Order Summary</h2>
                                <span>
                                    <p> Orders in total :</p>
                                    <p class="cart-number">${Tastey.ordersInTotal ?? 0}</p>
                                </span>
                                <span>
                                    <p>Tastey meals :</p>
                                    <p class="meals-number">${Tastey.tasteyMeals ?? 0}</p>
                                </span>
                                <span>
                                    <p>Actual Amount :</p>
                                    <p class="actual-price">${formatValue(data.currency, Tastey.actualAmount) ?? 0}</p>
                                </span>
                                <span>
                                    <p>Total Discount :</p>
                                    <p class="total-discount">-${Tastey.totalDiscountPercentage ?? 0} %</p>
                                </span>
                                <span>
                                    <p>Saved :</p>
                                    <p class="saved">${formatValue(data.currency, Tastey.savedAmount) ?? 0}</p>
                                </span>
                            </div>
                            <div class="order-preview">
                                <h2>The total amount of</h2>
                                <span>
                                    <p>Total Amount</p>
                                    <p class="total-price">${formatValue(data.currency, Tastey.totalAmount) ?? 0}</p>
                                </span>
                                <span>
                                    <p>VAT</p>
                                    <p class="VAT">+${Tastey.VAT}</p>
                                </span>
                            </div>
                        </div>
                        <div class="checkout">
                            <div class="checkout-preview">
                                <span class="total-amount-description">
                                    <p>The total amount of</p>
                                    <p>(including VAT)</p>
                                </span>
                                <span class="total-amount-values">
                                    <p class="TOTAL-COST">${formatValue(data.currency, Tastey.totalCost)}</p>
                                </span>
                            </div>
                            <div class="checkout-btn-wrapper">
                                <button type="button" title="Go to Checkout" class="checkout-btn" data-cart="0" tabindex="1">GO TO CHECKOUT</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="order-review-section">
                    <div class="order-review-section-content">
                        <div class="order-number-wrapper">
                            <span class="order-number" data-cart="0" data-meals="">
                        </span>
                        </div>
                    </div>
                </div>
            </div>
        `
    
        document.body.append(main)
        
        const orderReviewSectionContent = document.querySelector(".order-review-section-content")
    
        Tastey.tasteyRecord.tasteyOrders?.forEach(({ id,orders }) => {
            const meal = allMeals.find(meal => meal.id === id)
            const { label, category, price, serving, picSrc } = meal
            orderReviewSectionContent.innerHTML += 
            `
                    <div class="tastey-meal-order" data-id="${id}" id="tastey-meal-order-${id}" data-like="${weakTastey.getLikeValue(Number(id)) ?? false}" data-orders="${weakTastey.getOrdersValue(Number(id)) ?? 0}" data-position = "${(weakTastey.getPositionValue(id)??0) + 1}">
                        <div class="tastey-meal-order-content">
                        <div class="tastey-order-image-wrapper">
                            <img class="tastey-order-image" src="${picSrc}" alt="Image of ${label}" title="${label}">
                            <span class="tooltip-text like-tooltip">Double tap to like!</span>
                            <span class="tooltip-text unlike-tooltip">Double tap to unlike</span>
                        </div>
                        <div class="tastey-order-info">
                            <div class="tastey-order-text">
                                <div>
                                    <button type="button" title="${label}">
                                        <h2>${label}</h2>
                                    </button>
                                    <p>Category: ${category}</p>
                                </div>
                                <div>
                                    <button type="button" title="Remove ${label} from Bag" class="delete-order">
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#5f6368"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                                        </span>
                                        <p>REMOVE MEAL</p>
                                    </button>
                                    <button type="button" title="${(weakTastey.getLikeValue(Number(id)) ?? false) ? `Remove ${label} from Wishlist` : `Add ${label} to Wishlist`}" class="wishlist">
                                        <span>
                                            <svg class="unliked-heart-icon" viewBox="0 -960 960 960"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/></svg>
                                            <svg class="liked-heart-icon" viewBox="0 0 512 512"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>
                                        </span>
                                        <p class="move-to-wishlist">MOVE TO WISHLIST</p>
                                        <p class="remove-from-wishlist">REMOVE FROM WISHLIST</p>
                                    </button>
                                </div>
                            </div>
                            <div class="tastey-order-price-wrapper">
                                <span>
                                    <span class="cart-toggle">
                                    <button type="button" title="Remove 1 ${label[label.length - 1] === 's' ? label.slice(0,label.length - 1) : label}" class="sign minus">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                                        <svg width="12" height="4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="M11.357 3.332A.641.641 0 0 0 12 2.69V.643A.641.641 0 0 0 11.357 0H.643A.641.641 0 0 0 0 .643v2.046c0 .357.287.643.643.643h10.714Z" id="a"/></defs><use fill-rule="nonzero" xlink:href="#a"/></svg>
                                    </button>
                                        <p class="cart-number">${orders}</p>
                                    <button type="button" title="Add 1 ${label[label.length - 1] === 's' ? label.slice(0,label.length - 1) : label}" class="sign add">
                                        <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="M12 7.023V4.977a.641.641 0 0 0-.643-.643h-3.69V.643A.641.641 0 0 0 7.022 0H4.977a.641.641 0 0 0-.643.643v3.69H.643A.641.641 0 0 0 0 4.978v2.046c0 .356.287.643.643.643h3.69v3.691c0 .356.288.643.644.643h2.046a.641.641 0 0 0 .643-.643v-3.69h3.691A.641.641 0 0 0 12 7.022Z" id="b"/></defs><use fill-rule="nonzero" xlink:href="#b"/></svg>
                                    </button>
                                </span>                   
                                    <p class="serving-size" data-serving=${serving ?'"' + serving + '"' : "NG"}>Note: </p>
                                </span>         
                                <span class="order-price" data-discount="${price.discount ?? 0}">
                                    <h3 class="meal-price" data-discount="${price.discount ?? 0}">${formatValue(data.currency,check(price.currentValue,price.discount))}</h3>
                                    <h3 class="actual-meal-price">${formatValue(data.currency,price.currentValue)}</h3>
                                </span>
                            </div>
                        </div>
                        </div>
                    </div>
            `   
        })        
    } catch (error) {
        console.error(`Error occured while restoring Tastey Bag: ${error}`)
    }
}

//DOM Elements
const tastey = document.getElementById("tastey"),
attentionGrabber = document.querySelector(".attention-grabber"),
attentionGrabberTwo = document.querySelector(".attention-grabber-two"),
likeIconWrappers = document.querySelectorAll(".heart-icon-wrapper"),
orderReviewSectionContent = document.querySelector(".order-review-section-content"),
wishlistTogglers = document.getElementsByClassName("wishlist"),
tasteyMeals = document.querySelectorAll(".tastey-meal"),
tasteyMealsImages = document.querySelectorAll(".tastey-meal-image"),
tasteyMealOrders = document.getElementsByClassName("tastey-meal-order"),
tasteyOrderImages = document.getElementsByClassName("tastey-order-image"),
categorySwitcherContainer = document.querySelector("aside.category-switcher-container"),
switchers = document.querySelectorAll(".switcher"),
menuHeaders = document.querySelectorAll(".tastey-menu-title-wrapper h1"),
checkoutSection = document.querySelector(".checkout-section"),
menuToggler = document.querySelector(".menu-toggler"),
continueShoppingBtn = document.querySelector(".continue-shopping-button"),
cartToggler = document.querySelector(".cart-toggler"),
addToCartBtns = document.querySelectorAll(".add-to-cart-button"),
deleteOrderBtns = document.getElementsByClassName("delete-order"),
plusCartBtns = document.getElementsByClassName("add"),
minusCartBtns = document.getElementsByClassName("minus"),
clearCartBtn = document.querySelector(".clear-cart-btn"),
cartNumberElement = document.querySelector(".cart-number"),
mealsNumberElement = document.querySelector(".meals-number"),
actualPriceElement = document.querySelector(".actual-price"),
totalDiscountElement = document.querySelector(".total-discount"),
savedElement = document.querySelector(".saved"),
totalPriceElement = document.querySelector(".total-price"),
TOTALCOSTElement = document.querySelector(".TOTAL-COST")

//DOM operations

function setCheckoutState() {
    cartNumberElement.textContent = Tastey.ordersInTotal
    mealsNumberElement.textContent = Tastey.tasteyMeals
    actualPriceElement.textContent = formatValue(data.currency, Tastey.actualAmount)
    totalDiscountElement.textContent = "-" + Tastey.totalDiscountPercentage + "%"
    savedElement.textContent = formatValue(data.currency, Tastey.savedAmount)
    totalPriceElement.textContent = formatValue(data.currency, Tastey.totalAmount)
    TOTALCOSTElement.textContent = formatValue(data.currency, Tastey.totalCost)
}

function setCartStates() {
    const dataCartStates = document.querySelectorAll("[data-cart]")
    const dataMealsState = document.querySelectorAll("[data-meals]")
    dataCartStates.forEach(dataCartState => {
        dataCartState.dataset.cart = Tastey.ordersInTotal
    })
    dataMealsState.forEach(mealsState => {
        mealsState.dataset.meals = Tastey.tasteyMeals
    })
}
setCartStates()

function setOrderStates(id) {
    const dataOrderStates = document.querySelectorAll("[data-orders]")
    dataOrderStates.forEach(dataOrderState => {
        if(Number(dataOrderState.dataset.id) === id) {
            dataOrderState.dataset.orders = (weakTastey.getOrdersValue(Number(id)) ?? 0)
        }
    }) 
}

function setPositionStates() {
    const dataPositionStates = document.querySelectorAll('[data-position]')
    dataPositionStates.forEach(dataPositionState => {
        dataPositionState.dataset.position = ((weakTastey.getPositionValue(Number(dataPositionState.dataset.id)) ?? 0) + 1)
    })    
}

function setLikeState(id) {
    const dataLikeStates = document.querySelectorAll("[data-like]")
    dataLikeStates.forEach(dataLikeState => {
        if(Number(dataLikeState.dataset.id) === id) {
            dataLikeState.dataset.like = weakTastey.getLikeValue(id) ?? !dataLikeState.dataset.like
        }
    })
}            

function getOrderIndex(id){
    let i;
    const mealOrders = document.querySelectorAll(".tastey-meal-order")
    const childrenArray = Array.from(orderReviewSectionContent.children)
    childrenArray.shift()
    mealOrders?.forEach(order => {
    if (Number(order.dataset.id) === id) 
        i = childrenArray.indexOf(order) ?? 0
    })
    return i;
}

//functions for the Card User Interface that activates on certain conditions
function getCardsQuery() {
    return (document.body.classList.contains("cart") && (document.body.dataset.cart != 0) && (window.innerWidth >= remToPx(55)) && (window.innerHeight >= remToPx(35)) && (CSS && CSS.supports('position', 'sticky')))
}

const liftOffset = () => {return pxToRem(tasteyMealOrders[0].getBoundingClientRect().height) - 6}

function positionCards() {
if (getCardsQuery() && !weakTastey.getEmpty()) {
    const orderNumberWrapper = document.querySelector(".order-number-wrapper")
    const gap = pxToRem((checkoutSection.getBoundingClientRect().height - (tasteyMealOrders[0].getBoundingClientRect().height + orderNumberWrapper.getBoundingClientRect().height + remToPx(0.75))) / tasteyMealOrders.length)
    const bottom = pxToRem(window.innerHeight - (remToPx(9.1 + (tasteyMealOrders.length * gap)) + tasteyMealOrders[0].getBoundingClientRect().height))
    document.querySelector("main.meal-cart").style.setProperty('--bottom', `${bottom}rem`)
    for (let i = 0; i < tasteyMealOrders.length; i++) {
        const top = 9.25 + (i * gap)
        tasteyMealOrders[i].dataset.top = top
        tasteyMealOrders[i].style.setProperty('--sticky-top', `${top}rem`)
        //adding pointer over event listener to all cards
        tasteyMealOrders[i].onpointerover = () => {
            setTimeout(() => {
                if(tasteyMealOrders[i].matches(":hover"))
                    liftCard()
            }, 200)
        }
        function liftCard() {
            const currTop = Math.round(pxToRem(tasteyMealOrders[i].getBoundingClientRect()?.top))
            const prevTop = Math.round(parseFloat(tasteyMealOrders[i].dataset?.top)) 
            const nCurrTop = Math.round(pxToRem(tasteyMealOrders[i].nextElementSibling?.getBoundingClientRect()?.top))
            const nPrevTop = Math.round(parseFloat(tasteyMealOrders[i].nextElementSibling?.dataset?.top))
            if ((currTop == prevTop) && (nCurrTop < (nPrevTop + liftOffset()))) 
                tasteyMealOrders[i].classList.add("lift")
            if ((currTop > prevTop) || (nCurrTop >= (nPrevTop + liftOffset()))) 
                tasteyMealOrders[i].classList.remove("lift")
        }
        tasteyMealOrders[i].onmouseleave = () => tasteyMealOrders[i].classList.remove("lift")
        const header = tasteyMealOrders[i].querySelector(".tastey-order-text div:nth-of-type(1) button")
        header.onclick = () => moveToHeader()
        header.onfocus = () => {
            if (header.matches(':focus-visible')) 
                moveToHeader()
        }
        function moveToHeader() {
            const order = tasteyMealOrders[i]
            let pos = orderReviewSectionContent.getBoundingClientRect().height - (orderReviewSectionContent.getBoundingClientRect().height - (((order.getBoundingClientRect().height - remToPx(gap) + remToPx(1.25)) * (i+1)) + orderNumberWrapper.getBoundingClientRect().height + remToPx(2.5))) - order.getBoundingClientRect().height
            scrollContentTo(pos)
            order.classList.remove("lift")
        }
    }
}
}
positionCards()

function adjustCards() {
    const orderNumberWrapper = document.querySelector(".order-number-wrapper")
    if(getCardsQuery() && !weakTastey.getEmpty()) {
        let hCurrTop = Math.round(pxToRem(orderNumberWrapper.getBoundingClientRect()?.top))
        let hPrevTop = Math.round(5.5) 
        let fCurrTop = Math.round(pxToRem(tasteyMealOrders[0].getBoundingClientRect()?.top))
        let fPrevTop = Math.round(parseFloat(tasteyMealOrders[0].dataset?.top)) 
        if ((hCurrTop == hPrevTop) && (fCurrTop < (fPrevTop + 1.25))) { 
            orderNumberWrapper.style.setProperty('--sticky-scale', `${1 - (allMeals.length/1000)}`)
        } 
        if ((hCurrTop > hPrevTop) || (fCurrTop >= (fPrevTop + 1.25))) {
            orderNumberWrapper.style.setProperty('--sticky-scale', '1')
        }
        for (let i = 0; i < tasteyMealOrders.length; i++) {
            let currTop = Math.round(pxToRem(tasteyMealOrders[i].getBoundingClientRect().top))
            let prevTop = Math.round(parseFloat(tasteyMealOrders[i].dataset.top)) 
            let nCurrTop = Math.round(pxToRem(tasteyMealOrders[i].nextElementSibling?.getBoundingClientRect().top))
            let nPrevTop = Math.round(parseFloat(tasteyMealOrders[i].nextElementSibling?.dataset.top))
            if ((currTop == prevTop) && (nCurrTop < (nPrevTop + liftOffset()))) {
                tasteyMealOrders[i].style.setProperty('--sticky-scale', `${1 - ((allMeals.length * ((tasteyMealOrders.length - (i))/tasteyMealOrders.length))/1000)}`)
            } 
            if ((currTop > prevTop) || (nCurrTop >= (nPrevTop + liftOffset()))) {
                tasteyMealOrders[i].style.setProperty('--sticky-scale', '1')
                tasteyMealOrders[i].classList.remove("lift")
            }   
        }
    }
}

//time stalling values for removing from and emptying bag
let removeStall = 200
let emptyStall = 2000

function removeCard(id) {
    if (getCardsQuery() && !weakTastey.getEmpty()) {
        if(Tastey.tasteyRecord.tasteyOrders.length == 1) {
            removeStall = 2000
            removeAllCards()
            return
        } else {
            removeStall = 100
            let stall = 195
            const element = document.querySelector(`.tastey-meal-order[data-id="${id}"]`)        
            element.animate({transform: `translate(${rand(-20,20)}%, ${pxToRem(window.innerHeight) - (parseFloat(element.dataset?.top))}rem)`},{duration: stall, fill: "forwards"})
        }
    }
}

function removeExtras() {
    const orderNumberWrapper = document.querySelector(".order-number-wrapper")
    orderNumberWrapper.animate({transform: `translate(${rand(-20,20)}%, ${pxToRem(window.innerHeight) - 6}rem)`},{duration: emptyStall})                
    checkoutSection.animate({transform: `translate(${rand(-20,20)}%, ${pxToRem(window.innerHeight) - 6}rem)`},{duration: emptyStall})                
}

function removeAllCards() {
    if (getCardsQuery() && !weakTastey.getEmpty()) {
        syncScrollToBottom("instant")
        const allTasteyMealOrders = document.querySelectorAll(".tastey-meal-order")   
        removeExtras()
        allTasteyMealOrders.forEach((order,i) => {
            const stall = (((allTasteyMealOrders.length - i)/allTasteyMealOrders.length * 200) + 1000)
            order.animate({transform: `translate(${rand(-15,15)}%, ${pxToRem(window.innerHeight) - (parseFloat(order.dataset?.top))}rem)`},{duration: stall, fill: "forwards"})                
        })   
    }
}


function resetBagEventListeners() {
    for(let i = 0; i < tasteyMealOrders.length; i++) {
        wishlistTogglers[i].onclick = () => {
            handleWishlist(Number(tasteyMealOrders[i]?.dataset.id),i)      
        }
        tasteyOrderImages[i].ondblclick = tasteyOrderImages[i].fn = () => {
            handleWishlist(Number(tasteyMealOrders[i]?.dataset.id),i)  
        }
        deleteOrderBtns[i].onclick = () => {
            handleDelete(Number(tasteyMealOrders[i]?.dataset.id),i)
        }
        plusCartBtns[i].onclick = () => {
            handleAddMeal(Number(tasteyMealOrders[i].dataset.id),i)
        }
        plusCartBtns[i].classList.add('hover')
        minusCartBtns[i].onclick = () => {                        
            handleRemoveMeal(Number(tasteyMealOrders[i]?.dataset.id),i)
        }
        setMinusHoverState(i)
    }
}
resetBagEventListeners()

addToCartBtns.forEach(btn => {
    btn.addEventListener('click', e => {
        try {
            handleAddMeal(Number(e.target.dataset.id),getOrderIndex(Number(e.target.dataset.id)))
        } catch (error) {
            alert("Error adding meal to Bag :)")
            console.error(error)
        }            
    })
})

clearCartBtn.addEventListener('click', handleClearCart)

function setMinusHoverState(i) {
    const number = (weakTastey.getOrdersValue(Number(tasteyMealOrders[i]?.dataset.id)) ?? 0)
    minusCartBtns[i]?.classList.toggle('hover',number > 1)
}

//CRUD functions
function updateStates(id) {
    Tastey.calculateCheckoutDetails(allMeals)
    setCartStates()
    setPositionStates()
    setOrderStates(id)
    setCheckoutState()
}

function handleAddMeal(id,i) {
    try {
        Tastey.addMeal(id,allMeals,data.currency)
        updateStates(id)
        setMinusHoverState(i)
        resetBagEventListeners()                    
        controlPanning()
    } catch(err) {
        alert("Error adding a meal to bag :)")
        console.error(err)
    }
}

function handleRemoveMeal(id,i) {
    try {
        const number = (weakTastey.getOrdersValue(Number(tasteyMealOrders[i]?.dataset.id)) ?? 0)
        if(Number(number) > 1) { 
            Tastey.removeMeal(id)
            updateStates(id)
            setMinusHoverState(i)
        } else if(Number(number) == 1) { 
            handleDelete(id,i)
        }
    } catch(err) {
        alert("Error removing a meal from bag :)")
        console.error(err)
    }
}

//a function for deleting orders
function deleteMeal(id,n) {
    tasteyMealOrders[n].remove()
    Tastey.deleteMeal(id)
    updateStates(id)
    resetBagEventListeners()
    positionCards()
    autoRemoveScroller()               
}

//a function to handle deleting orders 
function handleDelete(id,n) {
    try {
        if (getCardsQuery()) {
            let timeout
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                removeCard(id)    
                setTimeout(() => {
                    deleteMeal(id,n)
                }, removeStall)                        
            }, removeStall);
            return
        }
        deleteMeal(id,n)
    } catch(err) {
        alert("Error removing meal from bag :)")
        console.error(err)
    }
}

//a function to clear the tastey bag
function clearCart() {
    const allTasteyMealOrders = document.querySelectorAll(".tastey-meal-order")   
    allTasteyMealOrders.forEach(order => order.remove())
    Tastey.clearCart()
    Tastey.calculateCheckoutDetails(allMeals)
    allMeals.forEach(({ id }) => setOrderStates(id))
    setCheckoutState()
    setCartStates()
    autoRemoveScroller()                
}

//a function to handle clearing the tastey bag
function handleClearCart() {   
    try{
        if (weakTastey.getEmpty()) {
            console.warn("You literally have no items in your Shopping Bag :)")
            alert("Your Shopping Bag is already empty")
            return
        }
        const isCartCleared = confirm(`You are about to remove ${Tastey.ordersInTotal} ${Tastey.ordersInTotal > 1 ? "orders" : "order"} from your Shopping Bag!`)
        if (isCartCleared) {
            if (getCardsQuery()) {
                removeAllCards()
                setTimeout(() => {
                    clearCart()
                }, emptyStall);
                return
            }
            clearCart()
        }        
    } catch(err) {
        alert("Error occured while clearing bag :)")
        console.error(err)
    }
}

//handling the panning of the food images
function controlPanning() {
    panning(document.querySelectorAll(".tastey-meal-image, .tastey-order-image, .mini-cart-tastey-order-image"))
}
controlPanning()

//a function to handle likes
function handleLikes(i) {
    try {
        tasteyMeals[i].dataset.like = tasteyMeals[i].dataset.like === "false" ? "true" : "false"
        likeIconWrappers[i].title = tasteyMeals[i].dataset.like === "false" ? "" : "Tap to like!"
        Tastey.handleLikes(Number(tasteyMeals[i].dataset.id),tasteyMeals[i].dataset.like === "true")
        setLikeState(Number(tasteyMeals[i].dataset.id))
    } catch(err) {
        alert("Error while accessing wishlist :)")
        console.error(err)
    }
}

function handleWishlist(id,i) {
    try {
        const meal = allMeals.find(meal => meal.id === id)
        const { label } = meal
        tasteyMealOrders[i].dataset.like = tasteyMealOrders[i].dataset.like === "false" ? "true" : "false"
        wishlistTogglers[i].title = tasteyMealOrders[i].dataset.like === "false" ? `Add ${label} to Wishlist` : `Remove ${label} from Wishlist`
        Tastey.handleLikes(Number(tasteyMealOrders[i].dataset.id),tasteyMealOrders[i].dataset.like === "true")
        setLikeState(Number(tasteyMealOrders[i].dataset.id))        
    } catch(err) {
        alert("Error while accessing wishlist :)")
        console.error(err)
    }
}

likeIconWrappers.forEach((likeIconWrapper,i) => {
    likeIconWrapper.addEventListener('click', () => {
        handleLikes(i)
    })
})

tasteyMealsImages.forEach((tasteyMealsImage,i) => {
    tasteyMealsImage.addEventListener('dblclick', () => {
        handleLikes(i)
    })
})

function onPageScroll() {
    if (!document.body.classList.contains('cart')) {
        categorySwitcherContainer.classList.remove('show')
        controlActiveSwitcher(window.scrollY, [...menuHeaders])
        toggleMenuHeader()
    } else {
        adjustCards()
    }
}

//window event listeners
window.addEventListener("resize", () => {
    adaptCheckoutContent()
    positionCards()
})
const scrollThrottler = new tasteyThrottler
const scrollDebouncer = new tasteyDebouncer
window.addEventListener("scroll", scrollThrottler.throttle(onPageScroll))   
window.addEventListener("scroll", scrollDebouncer.debounce(adaptCheckoutContent,150))

quickScrollShow.addEventListener('click', ()=>{
    categorySwitcherContainer.classList.toggle('show')
})
removeScrolls.addEventListener('click', ()=>{
    categorySwitcherContainer.classList.remove('show')
})

let tasteyOffSetTop = tastey.getBoundingClientRect().y;

function toggleMenuHeader(bool = null) {
    const menuTitle = document.querySelector('#magic')
    if (bool !== null) {
        menuTitle.classList.toggle('hide', !bool)
        attentionGrabber.classList.toggle('hide',!bool)
        attentionGrabberTwo.classList.toggle('hide',!bool)
        return
    }
    if (tastey.getBoundingClientRect().y < (tasteyOffSetTop - 50)) {
        menuTitle.classList.add('hide')
        attentionGrabber.classList.add('hide')
        attentionGrabberTwo.classList.add('hide')
    } else {
        menuTitle.classList.remove('hide')
        attentionGrabber.classList.remove('hide')
        attentionGrabberTwo.classList.remove('hide')
    }
}

const xThreshold = remToPx(45)
//a function to adapt the checkout content to the current screen size
function adaptCheckoutContent () {
    if (document.body.classList.contains("cart") && window.innerWidth <= xThreshold) {
        checkoutSection.style.setProperty("--nav-width",`${document.querySelector('aside.menu-cart-toggler-container').offsetWidth}px`)
        if (pxToRem(document.documentElement.scrollTop) > 35) 
            checkoutSection.classList.add("compact")
        if (pxToRem(document.documentElement.scrollTop) < 25) 
            checkoutSection.classList.remove("compact")
    }
}

//toggling the cart on and off
menuToggler.addEventListener('click', toggleMenu)

continueShoppingBtn.addEventListener('click', e => {
    e.preventDefault()
    toggleMenu()
})

function toggleMenu() {
    document.body.classList.remove("cart")
    syncScrollToTop("instant")
    controlActiveSwitcher(window.scrollY,[...menuHeaders])
    quickScrolls.classList.remove('show')
    autoRemoveScroller()
    setTimeout(() => {
        tasteyOffSetTop = tastey.getBoundingClientRect().y;
        toggleMenuHeader(true)
    }, 100)
}

function toggleCart() {
    document.body.classList.add("cart")
    syncScrollToTop("instant")
    quickScrolls.classList.remove('show')
    autoRemoveScroller()
    setTimeout(() => {
        positionCards()
    }, 100);
}

if (sessionStorage.open_cart) { 
    toggleCart()
    delete sessionStorage.open_cart
} 

cartToggler.addEventListener('click', toggleCart)
document.querySelector(".navbar-cart").addEventListener('click', toggleCart)

//the options object for the intersection observer api
const options = {
    root: null,
    rootMargin: '0px',
    threshold: (() => {
        let threshold = []
        let step = 5
        for(let i = 1.0; i <= step; i++) {
            let ratio = i/step
            threshold.push(ratio)
        }
        threshold.push(0)
        return threshold;
    })(),
}
//using the intersection observer to turn the lights off/on
const tasteyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            document.body.style.setProperty("--global-light-color", "rgba(255,255,255,0.475)")
            document.body.style.setProperty("--global-light-complement-color", "transparent")
        } else if (!(entry.target.id === "tastey")) {
            document.body.style.setProperty("--global-light-color", "var(--darker-black)")
            document.body.style.setProperty("--global-light-complement-color", "var(--darker-black)")
        }
    })
},options)
menuHeaders.forEach(worthy => {
    tasteyObserver.observe(worthy)
})
tasteyObserver.observe(tastey)

//calling the stars maker function page startup
stars(document.getElementsByClassName("magic-star"))

//positioning gradient where necessary
document.querySelectorAll("main").forEach(main => {
    main.onpointermove = e => {
    if (window.innerWidth > mobileThreshold) {
        if(!document.body.classList.contains("cart")) {
            for(const card of document.getElementsByClassName("tastey-meal")){
                positionGradient(e,card)
            }
        } else {
            if (getCardsQuery()) {
                for(const card of document.querySelectorAll(".checkout-section, .order-number-wrapper")){
                    positionGradient(e,card)
                }
            } else {
                for(const card of document.querySelectorAll(".checkout-section, .order-number-wrapper, .tastey-meal-order")){
                    positionGradient(e,card)
                }
            }
        }
    }
    }
}) 
document.querySelector(".mini-meal-cart").onpointermove = e => {
    positionGradient(e,document.querySelector(".mini-meal-cart"))
}

tastey.addEventListener("click", e => {
    let active = getComputedStyle(tastey).getPropertyValue("--global-light-width") == "140rem" ? true : false
    if(active) {
        document.body.style.setProperty("--global-light-width", "35rem")
        e.target.style.cursor = "zoom-in"
    } else {
        document.body.style.setProperty("--global-light-width", "140rem")
        e.target.style.cursor = "zoom-out"
    }
})

function controlActiveSwitcher(ordinate,arr) {
    let index = -1;
    for (const i in arr) {
        if(Math.floor(ordinate) >= Math.floor(Math.round((menuHeaders[i].getBoundingClientRect().top + window.scrollY) - tasteyOffSetTop) - (window.innerHeight/4))) {
            index ++
        }
    }
    //clamping index incase of any error
    markSwitcher(clamp(0, index, arr.length - 1))
}

switchers.forEach((switcher,i) => {
    switcher.addEventListener('click', () => { 
        let scrollPosition = Math.round((menuHeaders[i].getBoundingClientRect().top + window.scrollY) - tasteyOffSetTop)
        scrollContentTo(scrollPosition)
    })
})

function markSwitcher(id) {
    switchers.forEach(switcher => switcher.classList.remove("active"))
    switchers[id].classList.add("active")
}

autoRemoveScroller()
