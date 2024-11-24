//module imports
import { meals, allMeals, currency, maxOrders, getDOMElements, handleAddMeal, handleClearCart, handleLikes, handleCheckout, getCardsQuery, positionCards, adjustCards, getOrderIndex } from "./CRUD.js"
import { weakTastey } from "./TasteyManager.js"
import { tasteyThrottler, tasteyDebouncer, check, formatValue, standardize, clamp, panning, scrollContentTo, remToPx, syncScrollToTop, positionGradient, stars } from "./utility-functions.js"
import { autoRemoveScroller, quickScrollShow, removeScrolls, quickScrolls } from "./build-scroller.js"


const mobileThreshold = remToPx(36), 
    tasteyOffSetTop = remToPx(13.26)

tasteyMenu(meals)
tasteyBag()

function tasteyMenu(meals){ 
    const main = document.querySelector('main.menu')
    Object.entries(meals).forEach(meal => {
        const section = meal[0]
        const sectionName = meal[1][0].category

        const menuSection = document.createElement('div')
        menuSection.className += `${sectionName}-section menu-sections`
        const menuHeader = document.createElement('div')
        menuHeader.className +=`tastey-menu-title-wrapper ${section}`
        menuHeader.innerHTML += `<h1>${sectionName.toUpperCase()}</h1>`
        menuSection.append(menuHeader)
        const menuContainer = document.createElement('div')
        menuContainer.className += `tastey-menu tastey-${section}`

        meal[1].forEach(({ id, label, description, price, like, picSrc}) => {
            like = like ?? false 
            menuContainer.innerHTML += 
            `
            <div class="tastey-meal" data-id='${id}' data-like="${weakTastey.getLikeValue(id) ?? like}" data-discount="${price.discount ?? 0}">
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
                                <button type="button" class="add-to-cart-button" title="Add ${label} to Bag" data-id="${id}" data-orders="${standardize(weakTastey.getOrdersValue(id))}" tabindex="${weakTastey.getOrdersValue(id) >= maxOrders ? -1 : 0}">Add to Bag</button>
                                <span class="product-price" data-discount="${price.discount ?? 0}">${formatValue(currency,check(price.currentValue,price.discount))}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `
        })
        menuSection.append(menuContainer)
        main.append(menuSection)
    })  
}


function tasteyBag() {
    try {
        const main = document.querySelector('main.meal-cart')
        main.classList.add("meal-cart")
        main.dataset.cart = "0"
        main.innerHTML += 
        `
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
                                    <p class="cart-number">${standardize(weakTastey.ordersInTotal ?? 0)}</p>
                                </span>
                                <span>
                                    <p>Tastey meals :</p>
                                    <p class="meals-number">${standardize(weakTastey.tasteyMeals) ?? 0}</p>
                                </span>
                                <span>
                                    <p>Actual Amount :</p>
                                    <p class="actual-price">${formatValue(currency, weakTastey.actualAmount) ?? 0}</p>
                                </span>
                                <span>
                                    <p>Total Discount :</p>
                                    <p class="total-discount">-${weakTastey.totalDiscountPercentage ?? 0} %</p>
                                </span>
                                <span>
                                    <p>Saved :</p>
                                    <p class="saved">${formatValue(currency, weakTastey.savedAmount) ?? 0}</p>
                                </span>
                            </div>
                            <div class="order-preview">
                                <h2>The total amount of</h2>
                                <span>
                                    <p>Total Amount</p>
                                    <p class="total-price">${formatValue(currency, weakTastey.totalAmount) ?? 0}</p>
                                </span>
                                <span>
                                    <p>VAT</p>
                                    <p class="VAT">+${weakTastey.VAT}%</p>
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
                                    <p class="TOTAL-COST">${formatValue(currency, weakTastey.totalCost)}</p>
                                </span>
                            </div>
                            <div class="checkout-btn-wrapper">
                                <button type="button" title="Go to Checkout" class="checkout-btn Tastey-blur" data-cart="0">GO TO CHECKOUT</button>
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

        const orderReviewSectionContent = document.querySelector(".order-review-section-content")
    
        weakTastey.tasteyRecord.tasteyOrders?.forEach(({ id,orders }) => {
            const meal = allMeals.find(meal => meal.id === id)
            const { label, category, price, serving, picSrc } = meal
            orderReviewSectionContent.innerHTML += 
            `
                    <div class="tastey-meal-order" data-id="${id}" data-like="${weakTastey.getLikeValue(id) ?? false}" data-orders="${standardize(weakTastey.getOrdersValue(id))}" data-discount="${price.discount ?? 0}" data-position = "${(weakTastey.getPositionValue(id) ?? 0) + 1}">
                        <div class="tastey-meal-order-content">
                        <div class="tastey-order-image-wrapper">
                            <img class="tastey-order-image" src="${picSrc}" alt="Image of ${label}" title="${label}">
                            <span class="tooltip-text like-tooltip">Double tap to like!</span>
                            <span class="tooltip-text unlike-tooltip">Double tap to unlike</span>
                        </div>
                        <div class="tastey-order-info">
                            <div class="tastey-order-text">
                                <div>
                                    <h2 title="${label}">${label}</h2>
                                    <p>Category: ${category}</p>
                                </div>
                                <div>
                                    <button type="button" title="Remove ${label} from Bag" class="delete-order">
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#5f6368"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                                        </span>
                                        <p>REMOVE MEAL</p>
                                    </button>
                                    <button type="button" title="${(weakTastey.getLikeValue(id) ?? false) ? `Remove ${label} from Wishlist` : `Add ${label} to Wishlist`}" class="wishlist">
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
                                        <p class="cart-number">${standardize(orders)}</p>
                                    <button type="button" title="Add 1 ${label[label.length - 1] === 's' ? label.slice(0,label.length - 1) : label}" class="sign add" tabindex="${weakTastey.getOrdersValue(id) >= maxOrders ? -1 : 0}">
                                        <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="M12 7.023V4.977a.641.641 0 0 0-.643-.643h-3.69V.643A.641.641 0 0 0 7.022 0H4.977a.641.641 0 0 0-.643.643v3.69H.643A.641.641 0 0 0 0 4.978v2.046c0 .356.287.643.643.643h3.69v3.691c0 .356.288.643.644.643h2.046a.641.641 0 0 0 .643-.643v-3.69h3.691A.641.641 0 0 0 12 7.022Z" id="b"/></defs><use fill-rule="nonzero" xlink:href="#b"/></svg>
                                    </button>
                                </span>                   
                                    <p class="serving-size" data-serving=${serving ?'"' + serving + '"' : "NG"}>Note: </p>
                                </span>         
                                <span class="order-price">
                                    <h3 class="meal-price" data-discount="${price.discount ?? 0}">${formatValue(currency,check(price.currentValue,price.discount))}</h3>
                                    <h3 class="actual-meal-price">${formatValue(currency,price.currentValue)}</h3>
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
tasteyMealsImages = document.querySelectorAll(".tastey-meal-image"),
categorySwitcherContainer = document.querySelector("aside.category-switcher-container"),
switchers = document.querySelectorAll(".switcher"),
menuHeaders = document.querySelectorAll(".tastey-menu-title-wrapper h1"),
menuToggler = document.querySelector(".menu-toggler"),
continueShoppingBtn = document.querySelector(".continue-shopping-button"),
mcContinueShoppingBtn = document.querySelector(".mini-continue-shopping-button"),
mcShoppingBtn = document.querySelector(".mini-cart-continue-shopping-button"),
mcShoppingBagBtn = document.querySelector(".mini-cart-shopping-bag-button"),
cartToggler = document.querySelector(".cart-toggler"),
addToCartBtns = document.querySelectorAll(".add-to-cart-button"),
clearCartBtn = document.querySelector(".clear-cart-btn"),
checkoutBtn = document.querySelector(".checkout-btn")


//DOM operations
getDOMElements()
window.addEventListener('load', positionCards)

addToCartBtns.forEach(btn => {
    btn.onclick = e => handleAddMeal(e.target.dataset.id, getOrderIndex(e.target.dataset.id))
})

clearCartBtn.addEventListener('click', handleClearCart)

checkoutBtn.addEventListener('click', handleCheckout)

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

//handling the panning of the food images
panning(document.querySelectorAll(".tastey-meal-image, .tastey-order-image"))

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

function onPageScroll() {
    if (!document.body.classList.contains('cart')) {
        categorySwitcherContainer.classList.remove('show')
        controlActiveSwitcher(window.scrollY, [...menuHeaders])
        toggleMenuHeader()
    } else {
        adjustCards()
    }
}

const scrollThrottler = new tasteyThrottler
const scrollDebouncer = new tasteyDebouncer
//window event listeners
window.addEventListener("resize", positionCards)
window.addEventListener("scroll", scrollThrottler.throttle(onPageScroll,10))   
window.addEventListener("scroll", scrollDebouncer.debounce(onPageScroll,250))

quickScrollShow.addEventListener('click', () => {
    categorySwitcherContainer.classList.toggle('show')
})
removeScrolls.addEventListener('click', () => {
    categorySwitcherContainer.classList.remove('show')
})

continueShoppingBtn.addEventListener('click', e => {
    e.preventDefault()
    toggleMenu()
    document.querySelector(".mini-meal-cart").classList.add('close')
})

mcContinueShoppingBtn.onclick = e => {
    e.preventDefault()
    toggleMenu()
}

mcShoppingBtn.onclick = e => {
    e.preventDefault()
    toggleMenu()
}

mcShoppingBagBtn.onclick = e => {
    e.preventDefault()
    toggleCart()
}

function toggleMenu() {
    if(sessionStorage.open_cart) delete sessionStorage.open_cart
    document.body.classList.remove("cart")
    document.querySelector(".mini-meal-cart").classList.add('close')
    syncScrollToTop("instant")
    controlActiveSwitcher(window.scrollY,[...menuHeaders])
    quickScrolls.classList.remove('show')
    categorySwitcherContainer.classList.remove('show')
    setTimeout(autoRemoveScroller, 200)
    setTimeout(() => {
        toggleMenuHeader(true)
    })
}

function toggleCart() {
    sessionStorage.open_cart = true
    document.body.classList.add("cart")
    document.querySelector(".mini-meal-cart").classList.add('close')
    syncScrollToTop("instant")
    quickScrolls.classList.remove('show')
    categorySwitcherContainer.classList.remove('show')
    setTimeout(autoRemoveScroller, 200)
    setTimeout(positionCards)
}

if (sessionStorage.open_cart) toggleCart()

//toggling between menu and cart
menuToggler.addEventListener('click', toggleMenu)
cartToggler.addEventListener('click', toggleCart)

//using the intersection observer to turn the lights off/on
const tasteyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            document.body.style.setProperty("--global-light-color", "rgba(255,255,255,0.475)")
            document.body.style.setProperty("--global-light-complement-color", "transparent")
        } else if ((tastey.getBoundingClientRect().bottom < 0) && (entry.target.id !== "tastey")) {
            document.body.style.setProperty("--global-light-color", "var(--darker-black)")
            document.body.style.setProperty("--global-light-complement-color", "var(--darker-black)")
        }
    })
},{root:null,rootMargin:`-${remToPx(3.5)}px`,threshold:[0,.5,1]})
menuHeaders.forEach(worthy => {
    tasteyObserver.observe(worthy)
})
tasteyObserver.observe(tastey)

//calling the stars maker function page startup
stars(document.querySelectorAll(".magic-star"))

//positioning gradient where necessary
document.querySelectorAll("main").forEach(main => {
    main.onpointermove = e => {
    if (document.body.classList.contains("cart")) 
        positionGradient(e,document.querySelector("main.meal-cart"))
    if (window.innerWidth > mobileThreshold) {
        if(!document.body.classList.contains("cart")) 
            for(const card of document.getElementsByClassName("tastey-meal")){
                positionGradient(e,card)
            }
        else 
            if (getCardsQuery()) 
                for(const card of document.querySelectorAll(".checkout-section, .order-number-wrapper")){
                    positionGradient(e,card)
                }
            else 
                for(const card of document.querySelectorAll(".checkout-section, .order-number-wrapper, .tastey-meal-order")){
                    positionGradient(e,card)
                }
    }
    }
}) 

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

function controlActiveSwitcher(ordinate, arr) {
    let index = -1;
    for (const i in arr) {
        if(Math.floor(ordinate) >= Math.floor(Math.round((menuHeaders[i].getBoundingClientRect().top + window.scrollY) - tasteyOffSetTop) - (window.innerHeight/4))) 
            index ++
    }
    //clamping index incase of any error
    markSwitcher(clamp(0, index, arr.length - 1))
}

switchers.forEach((switcher, i) => {
    switcher.addEventListener('click', () => { 
        let scrollPosition = Math.round((menuHeaders[i].getBoundingClientRect().top + window.scrollY) - tasteyOffSetTop)
        scrollContentTo(scrollPosition, "instant")
        setTimeout(() => {
            document.body.style.setProperty("--global-light-color", "rgba(255,255,255,0.475)")
            document.body.style.setProperty("--global-light-complement-color", "transparent")
        }, 25)
    })
})

function markSwitcher(id) {
    switchers.forEach(switcher => switcher.classList.remove("active"))
    switchers[id].classList.add("active")
}