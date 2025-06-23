import data from "./fetch-meals.js"
import { Tastey } from "./TasteyManager.js"
import Toast from "/T007_TOOLS/T007_toast_library/T007_toast.js"
import { Confirm } from "/T007_TOOLS/T007_dialog_library/T007_dialog.js"
import { check, formatValue, formatLabel, standardize, panning, scrollContentTo, remToPx, pxToRem, rand, clamp, handleContentEditableEnterKeyPress } from "./utils.js"
import { autoRemoveScroller } from "./build-scroller.js"
import { notificationQuery } from "./service-worker-helper.js"

export { meals, allMeals, currency, maxOrders, getDOMElements, getOrderId, getMealsIndex, getOrderIndex, handleAddMeal, handleClearCart, handleLikes, handleCheckout, getCardsQuery, positionCards, adjustCards, positionMiniCards, adjustMiniCards } 

//Getting necessary data
const meals = data.tasteyMeals,
allMeals = Object.values(meals).flat(),
currency = data.currency, 
maxOrders = data.maxOrders,
//queries to handle the present bag
mealsQuery = document.body.dataset.meals === "true",
bagQuery = document.body.dataset.bag === "true",
miniBagQuery = document.body.dataset.miniBag === "true"
// the code below fills up the cart immediately for development purposes
// for (const { id } of allMeals) {
//     await Tastey.addMeal(id, 10)
// }

// for (const { id } of allMeals) {
//     await Tastey.handleLikes(id, true)
// }

// the one-liner below clears the cart immediately for development purposes
// window.localStorage.clear()

//Calculating checkout details
Tastey.calculateCheckoutDetails(allMeals, currency)

//DOM Elements
let heartIconWrappers,orderReviewSectionContent,wishlistTogglers,tasteyMeals,tasteyMealOrders,mealCart, orderNumberWrapper,tasteyOrderImages,deleteOrderBtns,cartOrderNumbers,plusCartBtns,minusCartBtns,checkoutSection,cartNumberElement,mealsNumberElement,actualPriceElement,totalDiscountElement,savedElement,totalPriceElement,TOTALCOSTElement,miniMealCart,mcOrderReviewSection,mcTasteyMealOrders,mcTasteyOrderImages,mcWishlistTogglers,mcDeleteOrderBtns,mcCartOrderNumbers,mcPlusCartBtns,mcMinusCartBtns,mcActualPriceElement,mcTOTALCOSTElement

//using a function to get only the necessary DOM Elements so as to avoid errors
function getDOMElements() {
    if (mealsQuery) {
        heartIconWrappers = document.getElementsByClassName("heart-icon-wrapper"),
        tasteyMeals = document.getElementsByClassName("tastey-meal")
    }
    if (bagQuery) {
        tasteyMealOrders = document.getElementsByClassName("tastey-meal-order"),
        tasteyOrderImages = document.getElementsByClassName("tastey-order-image"),
        wishlistTogglers = document.getElementsByClassName("wishlist-toggler"),
        deleteOrderBtns = document.getElementsByClassName("delete-order"),
        cartOrderNumbers = document.getElementsByClassName("cart-order-number"),
        plusCartBtns = document.getElementsByClassName("add"),
        minusCartBtns = document.getElementsByClassName("minus"),
        mealCart = document.querySelector("main.meal-cart"),
        checkoutSection = document.querySelector(".checkout-section"),
        orderNumberWrapper = document.querySelector(".order-number-wrapper"),
        orderReviewSectionContent = document.querySelector(".order-review-section-content")
        cartNumberElement = document.querySelector(".cart-number"),
        mealsNumberElement = document.querySelector(".meals-number"),
        actualPriceElement = document.querySelector(".actual-price"),
        totalDiscountElement = document.querySelector(".total-discount"),
        savedElement = document.querySelector(".saved"),
        totalPriceElement = document.querySelector(".total-price"),
        TOTALCOSTElement = document.querySelector(".TOTAL-COST")
    }
    if (miniBagQuery) {
        miniMealCart = document.querySelector(".mini-meal-cart"),
        mcOrderReviewSection = document.querySelector(".mini-cart-order-review-section"),
        mcTasteyMealOrders = document.getElementsByClassName("mini-cart-tastey-meal-order"),
        mcTasteyOrderImages= document.getElementsByClassName("mini-cart-tastey-order-image"),
        mcWishlistTogglers = document.getElementsByClassName("mini-cart-wishlist-toggler"),
        mcDeleteOrderBtns = document.getElementsByClassName("mini-cart-delete-order"),
        mcCartOrderNumbers = document.getElementsByClassName("mini-cart-order-number"),
        mcPlusCartBtns = document.getElementsByClassName("mini-cart-add"),
        mcMinusCartBtns = document.getElementsByClassName("mini-cart-minus"),
        mcActualPriceElement = document.querySelector(".mini-cart-actual-price"),
        mcTOTALCOSTElement = document.querySelector(".mini-cart-TOTAL-COST")
    }
    setCartStates() 
    resetBagEventListeners()
}

//functions for the Card User Interface that activates on certain conditions
//time stalling values for removing from and emptying the bag
let removeStall = 200,
emptyStall = 2000

function handleCardPointerStart(e, currentCard) {
    if (e.touches?.length > 1) return
    e.stopImmediatePropagation()
    currentCard.dataset.pointerStartX = e.clientX ?? e.targetTouches[0]?.clientX
    currentCard.dataset.pointerStartY = e.clientY ?? e.targetTouches[0]?.clientY
    currentCard.dataset.pointerTicker = false
    currentCard.addEventListener('touchmove', currentCard.cpi = e => handleCardPointerInit(e, currentCard), {passive: true, once: true})
}

function handleCardPointerInit(e, currentCard) {
    e.stopImmediatePropagation()
    let x = e.clientX ?? e.targetTouches[0]?.clientX,
    y = e.clientY ?? e.targetTouches[0]?.clientY,
    deltaX = Math.abs(x - parseFloat(currentCard.dataset.pointerStartX)),
    deltaY = Math.abs(y - parseFloat(currentCard.dataset.pointerStartY))
    if (deltaY > deltaX * 2) return
    currentCard.addEventListener('touchmove', currentCard.cpm = e => handleCardPointerMove(e, currentCard), {passive: false})
}

function handleCardPointerMove(e, currentCard) {
    e.preventDefault()
    e.stopImmediatePropagation()
    let x = e.clientX ?? e.targetTouches[0]?.clientX,
    deltaX = x - parseFloat(currentCard.dataset.pointerStartX)
    currentCard.dataset.pointerDeltaX = deltaX
    if (JSON.parse(currentCard.dataset.pointerTicker)) return
    currentCard.cpRAF = requestAnimationFrame(() => {
        currentCard.style.setProperty("transition", "none")
        currentCard.style.setProperty("transform", `translateX(${deltaX}px)`)
        currentCard.style.setProperty("opacity", clamp(0, 1 - (Math.abs(deltaX) / currentCard.offsetWidth), 1))
        currentCard.dataset.pointerTicker = false
    })
    currentCard.dataset.pointerTicker = true
}    

function handleCardPointerEnd(currentCard) {
    cancelAnimationFrame(currentCard.cpRAF)
    if (Math.abs(parseFloat(currentCard.dataset.pointerDeltaX)) > (currentCard.offsetWidth*0.4)) {
        const dir = parseFloat(currentCard.dataset.pointerDeltaX) > 0 ? "right" : "left"
        handleDeleteMeal(currentCard.dataset.id, dir)
        return
    } 
    currentCard.dataset.pointerTicker = false
    currentCard.removeEventListener('touchmove', currentCard.cpi, {passive: true, once: true})
    currentCard.removeEventListener('touchmove', currentCard.cpm, {passive: false})
    currentCard.style.removeProperty("transition")
    currentCard.style.removeProperty("transform")
    currentCard.style.removeProperty("opacity")
}  

function getCardsQuery() {
    return (document.body.classList.contains("cart") && (document.body.dataset.cart != 0) && (window.innerWidth >= remToPx(55)) && (window.innerHeight >= remToPx(32.55)) && (CSS && CSS.supports('position', 'sticky')))
}

const liftOffset = () => pxToRem(tasteyMealOrders[0].getBoundingClientRect().height) - 6

function isCardStacked(i) {
    const currTop = Math.round(pxToRem(tasteyMealOrders[i].getBoundingClientRect()?.top))
    const prevTop = Math.round(parseFloat(tasteyMealOrders[i].dataset?.top)) 
    const nCurrTop = Math.round(pxToRem(tasteyMealOrders[i].nextElementSibling?.getBoundingClientRect()?.top))
    const nPrevTop = Math.round(parseFloat(tasteyMealOrders[i].nextElementSibling?.dataset?.top))
    if ((currTop > prevTop) || (nCurrTop >= (nPrevTop + liftOffset()))) 
        return false
    else return true
}

function positionCards() {
if (getCardsQuery() && !Tastey.isEmpty()) {
    const orsrect = orderReviewSectionContent.getBoundingClientRect(),
    rect = tasteyMealOrders[0]?.getBoundingClientRect(),
    gap = pxToRem((checkoutSection?.getBoundingClientRect().height - (rect.height + orderNumberWrapper?.getBoundingClientRect().height + remToPx(0.75))) / tasteyMealOrders.length)
    const bottom = pxToRem(window.innerHeight - (remToPx(9.1 + (tasteyMealOrders.length * gap)) + rect.height))
    mealCart.style.setProperty('--bottom', `${bottom}rem`)
    for (let i = 0; i < tasteyMealOrders.length; i++) {
        const top = 9.25 + (i * gap)
        tasteyMealOrders[i].dataset.top = top
        tasteyMealOrders[i].style.setProperty('--sticky-top', `${top}rem`)
        tasteyMealOrders[i].onpointerover = () => {
            setTimeout(() => {
                if(tasteyMealOrders[i]?.matches(":hover")) 
                    liftCard()
            }, 500)
        }
        tasteyMealOrders[i].onmouseleave = () => tasteyMealOrders[i].classList.remove("lift")
        tasteyMealOrders[i].onclick = () => {
            if (getCardsQuery())
                if (document.activeElement.tagName.toLowerCase() !== "button") 
                    moveToCard()
        }
        for (const button of tasteyMealOrders[i].querySelectorAll("button")) {
            button.onfocus = () => {
                if (getCardsQuery())
                    if (button.matches(':focus-visible')) 
                        moveToCard()
            }
        }
        tasteyMealOrders[i].removeEventListener("touchstart", tasteyMealOrders[i].cps)
        tasteyMealOrders[i].removeEventListener("touchend", tasteyMealOrders[i].cpe)
        tasteyMealOrders[i].addEventListener("touchstart", tasteyMealOrders[i].cps = e => {
            // if (isCardStacked(i)) return
            handleCardPointerStart(e, tasteyMealOrders[i])
        }, {passive: false})
        tasteyMealOrders[i].addEventListener("touchend", tasteyMealOrders[i].cpe = e => handleCardPointerEnd(tasteyMealOrders[i]))
        function liftCard() {
            tasteyMealOrders[i].classList.toggle("lift", isCardStacked(i))
        }
        function moveToCard() {
            let pos = orsrect.height - (orsrect.height - (((rect.height - remToPx(gap) + remToPx(1.25)) * (i+1)) + orderNumberWrapper.getBoundingClientRect().height + remToPx(2.5))) - rect.height
            scrollContentTo(pos)
            tasteyMealOrders[i].classList.remove("lift")
        }        
    }
}
}

function adjustCards() {
    if(getCardsQuery() && !Tastey.isEmpty()) {
        let hCurrTop = Math.round(pxToRem(orderNumberWrapper.getBoundingClientRect()?.top))
        let hPrevTop = Math.round(5.5) 
        let fCurrTop = Math.round(pxToRem(tasteyMealOrders[0]?.getBoundingClientRect()?.top))
        let fPrevTop = Math.round(parseFloat(tasteyMealOrders[0]?.dataset?.top)) 
        if ((hCurrTop == hPrevTop) && (fCurrTop < (fPrevTop + 1.25))) { 
            orderNumberWrapper.style.setProperty('--sticky-scale', `${1 - (allMeals.length/950)}`)
        } 
        if ((hCurrTop > hPrevTop) || (fCurrTop >= (fPrevTop + 1.25))) {
            orderNumberWrapper.style.setProperty('--sticky-scale', '1')
        }
        for (let i = 0; i < tasteyMealOrders.length; i++) {
            if (isCardStacked(i)) {
                tasteyMealOrders[i].style.setProperty('--sticky-scale', `${1 - ((allMeals.length * ((tasteyMealOrders.length - i)/tasteyMealOrders.length))/950)}`)
            } else {
                tasteyMealOrders[i].style.setProperty('--sticky-scale', '1')
                tasteyMealOrders[i].classList.remove("lift")
            }   
        }
    }
}

function removeCard(id, dir = "auto") {
    if (getCardsQuery()) {
        if(Tastey.ordersInTotal === 0) {
            removeStall = emptyStall
            removeAllCards()
            return
        } else {
            removeStall = 200
            const order = document.querySelector(`.tastey-meal-order[data-id="${id}"]`)        
            order?.classList.remove("lift")
            order?.animate({transform: `translate(${dir === "auto" ? rand(-20,20) : dir === "right" ? 100 : -100}%, ${pxToRem(window.innerHeight) - (parseFloat(order.dataset?.top))}rem)`},{duration: removeStall, fill: "forwards"})
        }
    }
}

function removeExtras() {
    orderNumberWrapper.animate({transform: `translate(${rand(-20,20)}%, ${pxToRem(window.innerHeight) - 6}rem)`},{duration: emptyStall})                
    checkoutSection.animate({transform: `translate(${rand(-20,20)}%, ${pxToRem(window.innerHeight) - 6}rem)`},{duration: emptyStall})                
}

function removeAllCards() {
    if (getCardsQuery()) {
        const allTasteyMealOrders = Array.from(tasteyMealOrders)  
        removeExtras()
        allTasteyMealOrders.forEach((order,i) => {
            const stall = (((allTasteyMealOrders.length - i)/allTasteyMealOrders.length * 200) + (emptyStall - 1000))
            order?.classList.remove("lift")
            order?.animate({transform: `translate(${rand(-15,15)}%, ${pxToRem(window.innerHeight) - (parseFloat(order.dataset?.top))}rem)`},{duration: stall, fill: "forwards"})                
        })   
    }
}

//functions for the Mini Card User Interface that activates on certain conditions
let gap
function getMiniCardsQuery() {
    return (CSS && CSS.supports('position', 'sticky'))
}

const offset = () => pxToRem(mcOrderReviewSection?.getBoundingClientRect().height - mcTasteyMealOrders[0]?.getBoundingClientRect().height) - 4

function isMCardStacked(i) {
    const rect = mcTasteyMealOrders[i].getBoundingClientRect()
    if (rect.top > (remToPx(0.775 + (gap * i)) + rect.height))
        return false
    else return true
}

function positionMiniCards() {
    if (getMiniCardsQuery() && !Tastey.isEmpty()) {
        gap = offset() / mcTasteyMealOrders.length   
        const orsrect = mcOrderReviewSection.getBoundingClientRect(),
        rect = mcTasteyMealOrders[mcTasteyMealOrders.length-1].getBoundingClientRect(),
        bottom = pxToRem(orsrect.height) - (((mcTasteyMealOrders.length * gap)) + pxToRem(rect.height)) 
        mcOrderReviewSection.style.setProperty('--mini-bottom', `${bottom}rem`)
        for (let i = 0; i < mcTasteyMealOrders.length; i++) {
            mcTasteyMealOrders[i].style.setProperty('--mini-sticky-top', `${0.25+(i*gap)}rem`)
            mcTasteyMealOrders[i].onclick = () => {if (document.activeElement.tagName.toLowerCase() !== "button") moveToCard()}
            for (const button of mcTasteyMealOrders[i].querySelectorAll("button")) {
                button.onfocus = () => {
                    if (button.matches(':focus-visible')) 
                        moveToCard()
                }
            }
            mcTasteyMealOrders[i].removeEventListener("touchstart", mcTasteyMealOrders[i].cps)
            mcTasteyMealOrders[i].removeEventListener("touchend", mcTasteyMealOrders[i].cpe)
            mcTasteyMealOrders[i].addEventListener("touchstart", mcTasteyMealOrders[i].cps = e => {
                // if (isCardStacked()) return
                handleCardPointerStart(e, mcTasteyMealOrders[i])
            }, {passive: false})
            mcTasteyMealOrders[i].addEventListener("touchend", mcTasteyMealOrders[i].cpe = () => handleCardPointerEnd(mcTasteyMealOrders[i]))
            function moveToCard() {
                let pos = orsrect.height - (orsrect.height - (((rect.height - remToPx(gap) + remToPx(.5)) * (i+1)))) - rect.height
                scrollContentTo(pos,"smooth",mcOrderReviewSection)
            }
        }
    }
}

function adjustMiniCards() {
    if(getMiniCardsQuery() && !Tastey.isEmpty()) {
        for (let i = 0; i < mcTasteyMealOrders.length; i++) {
            if (isMCardStacked(i)) {
                mcTasteyMealOrders[i].style.setProperty('--mini-sticky-scale', `${1 - ((allMeals.length * ((mcTasteyMealOrders.length - i)/mcTasteyMealOrders.length))/950)}`)
            } else {
                mcTasteyMealOrders[i].style.setProperty('--mini-sticky-scale', '1')
            }               
        }
    }
}

function removeMiniCard(id, dir = "auto") {
    if (getMiniCardsQuery()) {
        if (Tastey.ordersInTotal === 0 && getCardsQuery() && document.body.classList.contains("cart")) removeStall = emptyStall
        else removeStall = 200     
        const order = document.querySelector(`.mini-cart-tastey-meal-order[data-id="${id}"]`)        
        if (dir === "auto") 
            order?.animate({transform: `translate(${rand(-10,10)}%, 15rem)`},{duration: removeStall, fill: "forwards"})
        else 
            order?.animate({transform: `translate(${dir === "right" ? 100 : -100}%, ${rand(10, 40)}%)`},{duration: removeStall, fill: "forwards"})
    }
}

function removeAllMiniCards() {
    if (getMiniCardsQuery()) {
        const allTasteyMealOrders = Array.from(mcTasteyMealOrders)
        allTasteyMealOrders.forEach((order,i) => {
            const stall = (((allTasteyMealOrders.length - i)/allTasteyMealOrders.length*200) + (emptyStall - 1000))
            order?.animate({transform: `translate(${rand(-15,15)}%, 15rem)`},{duration: stall, fill: "forwards"})
        })
    }
}

//functions for general tastey operations
function setCartStates() {
    const dataCartStates = document.querySelectorAll("[data-cart]")
    const dataMealsState = document.querySelectorAll("[data-meals]")
    dataCartStates.forEach(dataCartState => {
        if (dataCartState.classList.contains("navbar-cart")) {
            dataCartState.dataset.cart = standardize(Tastey.ordersInTotal, "use strict")
            return
        }
        dataCartState.dataset.cart = standardize(Tastey.ordersInTotal)
    })
    dataMealsState.forEach(mealsState => {
        mealsState.dataset.meals = standardize(Tastey.tasteyMeals)
    })
}

function setOrderStates(id) {
    const dataOrderStates = document.querySelectorAll("[data-orders]")
    dataOrderStates.forEach(dataOrderState => {
        if(Number(dataOrderState.dataset.id) === Number(id)) dataOrderState.dataset.orders = standardize(Tastey.getOrdersValue(id))
    })
}

function setLikeState(id) {
    const dataLikeStates = document.querySelectorAll("[data-like]")
    dataLikeStates.forEach(dataLikeState => {
        if(Number(dataLikeState.dataset.id) === Number(id)) 
            dataLikeState.dataset.like = Tastey.getLikeValue(id) ?? !dataLikeState.dataset.like
    })
}        

//functions for specific tastey operations

//a function to activate the loader on the page
function toggleLoader(id, bool) {
    if (mealsQuery) {
        document.querySelector(`.tastey-meal[data-id="${id}"]`)?.classList.toggle("loading", bool)
    }
    if (bagQuery) {
        document.querySelector(`.tastey-meal-order[data-id="${id}"]`)?.classList.toggle("loading", bool)
    }
    if (miniBagQuery) {
        document.querySelector(`.mini-cart-tastey-meal-order[data-id="${id}"]`)?.classList.toggle("loading", bool)
    }
    document.querySelector(`.footer-tastey-meal[data-id="${id}"]`)?.classList.toggle("loading", bool)
}

function toggleDelLoader(id, bool) {
    if (mealsQuery) {
        document.querySelector(`.tastey-meal[data-id="${id}"]`)?.classList.toggle("del-loading", bool)
    }
    if (bagQuery) {
        document.querySelector(`.tastey-meal-order[data-id="${id}"]`)?.classList.toggle("del-loading", bool)
    }
    if (miniBagQuery) {
        document.querySelector(`.mini-cart-tastey-meal-order[data-id="${id}"]`)?.classList.toggle("del-loading", bool)
    }
}

function toggleLikeLoader(id, bool) {
    if (mealsQuery) {
        document.querySelector(`.tastey-meal[data-id="${id}"]`)?.classList.toggle("like-loading", bool)
    }
    if (bagQuery) {
        document.querySelector(`.tastey-meal-order[data-id="${id}"]`)?.classList.toggle("like-loading", bool)
    }
    if (miniBagQuery) {
        document.querySelector(`.mini-cart-tastey-meal-order[data-id="${id}"]`)?.classList.toggle("like-loading", bool)
    }
}

function toggleClearLoader(bool) {
    document.body.classList.toggle("clear-loading", bool)
}

//a function for editing a meal on the page
function editMeal(id) {
    let orders = Tastey.getOrdersValue(id)
    if (bagQuery) document.querySelector(`.tastey-meal-order[data-id="${id}"] .cart-order-number`).textContent = orders
    if (miniBagQuery) document.querySelector(`.mini-cart-tastey-meal-order[data-id="${id}"] .mini-cart-order-number`).textContent = orders
}

//a function for adding a meal to the page
function addMeal(id, meal) {
    const { label, category, price, serving, picSrc } = meal,
    orders = Tastey.getOrdersValue(id),
    like = Tastey.getLikeValue(id) ?? false
    if (bagQuery) {
        if (orders > 1) { 
            document.querySelector(`.tastey-meal-order[data-id="${id}"] .cart-order-number`).textContent = standardize(orders)
        } else {
            const newProduct = document.createElement('div')
            newProduct.classList.add('tastey-meal-order')
            newProduct.dataset.id = id
            newProduct.dataset.discount = price.discount ?? 0
            newProduct.dataset.like = like
            newProduct.dataset.orders = orders
            newProduct.innerHTML = 
            `
                <div class="tastey-meal-order-content">
                <div class="tastey-order-image-wrapper">
                        <img class="tastey-order-image" src="${picSrc}" alt="Image of ${label}" title="${label}">
                        <span class="tooltip-text like-tooltip">Double tap to like!</span>
                        <span class="tooltip-text unlike-tooltip">Double tap to unlike</span>
                </div>
                <div class="tastey-order-info">
                    <div class="tastey-order-text-wrapper">
                        <div class="tastey-order-text">
                            <h2 title="${label}">${label}</h2>
                            <p>Category: ${category}</p>
                        </div>
                        <div>
                            <button type="button" title="Remove ${label} from Bag" class="delete-order">
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                                </span>
                                <p>REMOVE MEAL</p>
                            </button>
                            <button type="button" title="${(Tastey.getLikeValue(id) ?? false) ? `Remove ${label} from Wishlist` : `Add ${label} to Wishlist`}" class="wishlist-toggler">
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
                            <button type="button" title="Remove 1 ${label[label.length - 1] === 's' ? label.slice(0,label.length - 1) : label}" class="sign minus${orders > 1 ? " hover" : ""}"">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                                <svg width="12" height="4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="M11.357 3.332A.641.641 0 0 0 12 2.69V.643A.641.641 0 0 0 11.357 0H.643A.641.641 0 0 0 0 .643v2.046c0 .357.287.643.643.643h10.714Z" id="a"/></defs><use fill-rule="nonzero" xlink:href="#a"/></svg>
                            </button>
                                <p class="cart-order-number" contenteditable="true">${orders}</p>
                            <button type="button" title="Add 1 ${label[label.length - 1] === 's' ? label.slice(0,label.length - 1) : label}" class="sign add hover${orders >= maxOrders ? " disabled" : ""}">
                                <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="M12 7.023V4.977a.641.641 0 0 0-.643-.643h-3.69V.643A.641.641 0 0 0 7.022 0H4.977a.641.641 0 0 0-.643.643v3.69H.643A.641.641 0 0 0 0 4.978v2.046c0 .356.287.643.643.643h3.69v3.691c0 .356.288.643.644.643h2.046a.641.641 0 0 0 .643-.643v-3.69h3.691A.641.641 0 0 0 12 7.022Z" id="b"/></defs><use fill-rule="nonzero" xlink:href="#b"/></svg>
                            </button>
                        </span>                   
                            <p class="serving-size" data-serving=${serving ?'"' + serving + '"' : "NG"}>Note: </p>
                        </span>         
                        <span class="order-price" data-discount="${price.discount ?? 0}">
                            <h3 class="meal-price" data-discount="${price.discount ?? 0}">${formatValue(currency, check(price.currentValue,price.discount))}</h3>
                            <h3 class="actual-meal-price">${formatValue(currency, price.currentValue)}</h3>
                        </span>
                    </div>
                </div>
                </div>
            `
            orderReviewSectionContent.appendChild(newProduct)
            panning(newProduct.querySelector(".tastey-order-image"))
            positionCards()                  
        }    
    } 
    if (miniBagQuery) {
        if (orders > 1) { 
            document.querySelector(`.mini-cart-tastey-meal-order[data-id="${id}"] .mini-cart-order-number`).textContent = standardize(orders)
        } else {
            const mcNewProduct = document.createElement('div')
            mcNewProduct.classList.add('mini-cart-tastey-meal-order')
            mcNewProduct.dataset.id = id
            mcNewProduct.dataset.like = like
            mcNewProduct.dataset.orders = orders
            mcNewProduct.dataset.discount = price.discount ?? 0
            mcNewProduct.innerHTML = 
            `   
                <div class="mini-cart-tastey-order-image-wrapper">
                        <img class="mini-cart-tastey-order-image" src="${picSrc}" alt="Image of ${label}" title="${label}">
                    </div>
                    <div class="mini-cart-tastey-order-info">
                        <div class="mini-cart-tastey-order-text-wrapper">
                            <div class="mini-cart-tastey-order-text">
                                <h5 data-serving=${serving ?'"' + serving + '"' : "NG"} title="${label}">${label}</h5>
                                <span>
                                <p class="mini-cart-meal-price">${formatValue(currency,check(price.currentValue,price.discount))}</p>
                                <p  class="mini-cart-actual-meal-price">${formatValue(currency,price.currentValue)}</p>
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
                                <button type="button" title="Remove 1 ${label[label.length - 1] === 's' ? label.slice(0,label.length - 1) : label}" class="mini-cart-sign mini-cart-minus${orders > 1 ? " hover" : ""}">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                                    <svg width="12" height="4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="M11.357 3.332A.641.641 0 0 0 12 2.69V.643A.641.641 0 0 0 11.357 0H.643A.641.641 0 0 0 0 .643v2.046c0 .357.287.643.643.643h10.714Z" id="a"/></defs><use fill-rule="nonzero" xlink:href="#a"/></svg>
                                </button>
                                    <p class="mini-cart-order-number" contenteditable="true">${orders}</p>
                                <button type="button" title="Add 1 ${label[label.length - 1] === 's' ? label.slice(0,label.length - 1) : label}" class="mini-cart-sign mini-cart-add hover${orders >= maxOrders ? " disabled" : ""}">
                                    <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="M12 7.023V4.977a.641.641 0 0 0-.643-.643h-3.69V.643A.641.641 0 0 0 7.022 0H4.977a.641.641 0 0 0-.643.643v3.69H.643A.641.641 0 0 0 0 4.978v2.046c0 .356.287.643.643.643h3.69v3.691c0 .356.288.643.644.643h2.046a.641.641 0 0 0 .643-.643v-3.69h3.691A.641.641 0 0 0 12 7.022Z" id="b"/></defs><use fill-rule="nonzero" xlink:href="#b"/></svg>
                                </button>
                            </span>      
                        </div>
                    </div>
            `        
            mcOrderReviewSection.appendChild(mcNewProduct)    
            panning(mcNewProduct.querySelector(".mini-cart-tastey-order-image"))
            positionMiniCards()
        }
    }
    if (orders <= 1) resetBagEventListeners()                    
}

//a function for removing a meal from the page
function removeMeal(id) {
    const orders = Tastey.getOrdersValue(id)
    if (bagQuery) {
        const ordersElement = document.querySelector(`.tastey-meal-order[data-id="${id}"] .cart-order-number`)
        ordersElement.textContent = standardize(orders)
    }
    if (miniBagQuery) {
        const mcCurrentProductCountElement = document.querySelector(`.mini-cart-tastey-meal-order[data-id="${id}"] .mini-cart-order-number`)
        mcCurrentProductCountElement.textContent = standardize(orders)
    }
}

//a function for deleting a meal from the page
function deleteMeal(id) {
    if (bagQuery) {
        document.querySelector(`.tastey-meal-order[data-id="${id}"]`)?.remove()
        positionCards()
        setTimeout(autoRemoveScroller,100)
    }
    if (miniBagQuery) {
        document.querySelector(`.mini-cart-tastey-meal-order[data-id="${id}"]`)?.remove()
        positionMiniCards()
    }
    resetBagEventListeners()
}

//a function to clear the cart from the page 
function clearCart() {
    if (bagQuery) {   
        Array.from(tasteyMealOrders).forEach(order => order.remove())
        setTimeout(autoRemoveScroller, 500)
    }
    if (miniBagQuery) {
        Array.from(mcTasteyMealOrders).forEach(order => order.remove())
    }
}

//a function for updating the checkout state
function setCheckoutState() {
    // #TASTEY CRUD - R
    if (bagQuery) {
        cartNumberElement.textContent = standardize(Tastey.ordersInTotal)
        mealsNumberElement.textContent = standardize(Tastey.tasteyMeals)
        actualPriceElement.textContent = formatValue(currency, Tastey.actualAmount)
        totalDiscountElement.textContent = '-' + Tastey.totalDiscountPercentage + ' %'
        savedElement.textContent = formatValue(currency, Tastey.savedAmount)
        totalPriceElement.textContent = formatValue(currency, Tastey.totalAmount)
        TOTALCOSTElement.textContent = formatValue(currency, Tastey.totalCost)
    } 
    if (miniBagQuery) {
        mcActualPriceElement.textContent = formatValue(currency, Tastey.actualAmount)
        mcTOTALCOSTElement.textContent = formatValue(currency, Tastey.totalCost)        
    }
}

//a function to assign all necessary event listeners
function resetBagEventListeners() {
    if (bagQuery) {
        mealCart.style.setProperty("--card-total", Tastey.ordersInTotal)
        for(let i = 0; i < tasteyMealOrders.length; i++) {
            tasteyMealOrders[i].style.setProperty("--card-position", Tastey.getOrdersPosition(tasteyMealOrders[i].dataset.id))
            wishlistTogglers[i].onclick = () => handleLikes(tasteyMealOrders[i]?.dataset.id)      
            tasteyOrderImages[i].ondblclick = () => handleLikes(tasteyMealOrders[i]?.dataset.id)  
            deleteOrderBtns[i].onclick = () => handleDeleteMeal(tasteyMealOrders[i]?.dataset.id)
            cartOrderNumbers[i].onkeydown = (e) => handleContentEditableEnterKeyPress(e)
            cartOrderNumbers[i].onblur = (e) => handleEditMealOrders(tasteyMealOrders[i].dataset.id,e)
            plusCartBtns[i].onclick = () => handleAddMeal(tasteyMealOrders[i]?.dataset.id)
            minusCartBtns[i].onclick = () => handleRemoveMeal(tasteyMealOrders[i]?.dataset.id)
        }
    }
    if (miniBagQuery) {
        miniMealCart.style.setProperty("--mini-card-total", Tastey.ordersInTotal)
        for(let i = 0; i < mcTasteyMealOrders.length; i++) {
            mcTasteyMealOrders[i].style.setProperty("--mini-card-position", Tastey.getOrdersPosition(mcTasteyMealOrders[i].dataset.id))
            mcWishlistTogglers[i].onclick = () => handleLikes(mcTasteyMealOrders[i]?.dataset.id)      
            mcTasteyOrderImages[i].ondblclick =  () => handleLikes(mcTasteyMealOrders[i]?.dataset.id)  
            mcDeleteOrderBtns[i].onclick = () => handleDeleteMeal(mcTasteyMealOrders[i]?.dataset.id)
            mcCartOrderNumbers[i].onkeydown = (e) => handleContentEditableEnterKeyPress(e)
            mcCartOrderNumbers[i].onblur = (e) => handleEditMealOrders(mcTasteyMealOrders[i]?.dataset.id,e)
            mcPlusCartBtns[i].onclick = () => handleAddMeal(mcTasteyMealOrders[i]?.dataset.id)
            mcMinusCartBtns[i].onclick = () => handleRemoveMeal(mcTasteyMealOrders[i]?.dataset.id)
        }        
    }
}

function getMealsIndex(id) {
    return Array.from(tasteyMeals).findIndex(meal => Number(meal.dataset.id) === Number(id))
}

function getOrderIndex(id) {
    return Array.from(mcTasteyMealOrders || tasteyMealOrders).findIndex(order => Number(order.dataset.id) === Number(id))
}

function getOrderId(i) {
    const mealOrders = mcTasteyMealOrders || tasteyMealOrders
    return Number(mealOrders[i]?.dataset.id)
}

//a function to control the minus btn hover state
function setButtonState(id) {
    const orders = Tastey.getOrdersValue(id),
    addToCartBtn = document.querySelector(`.add-to-cart-button[data-id="${id}"]`),
    tasteyMealOrder = document.querySelector(`.tastey-meal-order[data-id="${id}"]`),
    mcTasteyMealOrder = document.querySelector(`.mini-cart-tastey-meal-order[data-id="${id}"]`),
    footerAddToCartBtn = document.querySelector(`.footer-add-to-cart-button[data-id="${id}"]`)
    if (mealsQuery) {
        addToCartBtn.classList.toggle('disabled', orders >= maxOrders)
        addToCartBtn.tabIndex = orders >= maxOrders ? -1 : 0
    }
    if (bagQuery && tasteyMealOrder) {
        const plusCartBtn =  tasteyMealOrder.querySelector(".add"),
        minusCartBtn = tasteyMealOrder.querySelector(".minus")
        plusCartBtn.classList.toggle('disabled', orders >= maxOrders)
        plusCartBtn.tabIndex = orders >= maxOrders ? -1 : 0
        minusCartBtn.classList.toggle('hover', orders > 1)
    }
    if (miniBagQuery && mcTasteyMealOrder) {
        const plusCartBtn =  mcTasteyMealOrder.querySelector(".mini-cart-add"),
        minusCartBtn = mcTasteyMealOrder.querySelector(".mini-cart-minus")
        plusCartBtn.classList.toggle('disabled', orders >= maxOrders)
        plusCartBtn.tabIndex = orders >= maxOrders ? -1 : 0
        minusCartBtn.classList.toggle('hover', orders > 1)
    }
    if (footerAddToCartBtn) {
        footerAddToCartBtn.classList.toggle('disabled', orders >= maxOrders)
        footerAddToCartBtn.tabIndex = orders >= maxOrders ? -1 : 0
    }
}

//a function to handle updating general states
function updateStates(id) {
    setCartStates()
    setOrderStates(id)
    setCheckoutState()
}

//a function to handle the editing of meals
async function handleEditMealOrders(id,{currentTarget: el}) {
  try {
      const meal = allMeals.find(meal => Number(meal.id) === Number(id))
      if (!meal) return
      const { label, picSrc } = meal
      const c = el.textContent
      const n = parseInt(c)
      if (Tastey.getOrdersValue(id) === n) return
      if (isNaN(n)) {
          editMeal(id)
          Toast.warn(`You cannot update ${label} to "${c}"`, { image: picSrc, tag: `${id}${c}NEdi` })
          return
      }
      if (n <= 0) {
          handleDeleteMeal(id)
          return
      }
      if (n > maxOrders) {
          editMeal(id)
          Toast.warn(`You cannot have more than ${maxOrders} ${label} in bag`, { image: picSrc, tag: `${id}MEdi` })
          return
      }
      toggleLoader(id, true)
      // #TASTEY CRUD - CU
      if (await Tastey.editMeal(id,n)) {
          Tastey.calculateCheckoutDetails(allMeals, currency)
          editMeal(id)
          updateStates(id)
          setButtonState(id)
          Toast.success(`You updated ${label} to ${n} in bag`, { image: picSrc, tag: `${id}SEdi` })
      } else {
          Toast.error(`Could not update ${label} to ${n} in bag`, { image: picSrc, tag: `${id}EEdi` })                
      }
      toggleLoader(id, false)
  } catch(err) {
      console.error(err)
  }
}

//a function to handle the adding of a meal
async function handleAddMeal(id,n=1) {
  try {
      const meal = allMeals.find(meal => Number(meal.id) === Number(id))
      if (!meal) return
      const { label, picSrc } = meal
      if (Tastey.getOrdersValue(id) >= maxOrders) {
          Toast.warn(`You cannot add more than ${maxOrders} ${formatLabel(label, n)} to bag`, { image: picSrc, tag: `${id}MAdd` })
          return
      }
      toggleLoader(id, true)
      // #TASTEY CRUD - CU
      if (await Tastey.addMeal(id,n)) {
          Tastey.calculateCheckoutDetails(allMeals, currency)
          addMeal(id,meal)
          updateStates(id)
          setButtonState(id)
          Toast.success(`You added ${n} ${formatLabel(label, n)} to bag`, { image: picSrc, tag: `${id}SAdd` })
      } else {
          Toast.error(`Could not add ${n} ${formatLabel(label, n)} to bag`, { image: picSrc, tag: `${id}EAdd` })
      }
      toggleLoader(id, false)
  } catch(err) {
      console.error(err)
  }
}

//a function to handle the removing of a meal
async function handleRemoveMeal(id,n=1) {
  try {
      const meal = allMeals.find(meal => Number(meal.id) === Number(id))        
      if (!meal) return
      const { label, picSrc } = meal
      const orders = Tastey.getOrdersValue(id)
      if(orders === 1) { 
          handleDeleteMeal(id)
          return
      }
      toggleLoader(id, true)
      // #TASTEY CRUD - UD
      if (await Tastey.removeMeal(id,n)) {
          Tastey.calculateCheckoutDetails(allMeals, currency)
          removeMeal(id)
          updateStates(id)
          setButtonState(id)
          Toast.success(`You removed ${n} ${formatLabel(label, n)} from bag`, { image: picSrc, tag: `${id}SRem` })                
      } else {
          Toast.error(`Could not remove ${n} ${formatLabel(label, n)} from bag`, { image: picSrc, tag: `${id}ERem` })
      }
      toggleLoader(id, false)
  } catch(err) {
      console.error(err)
  }
}

//a function for deleting orders
async function handleDeleteMeal(id, dir = "auto") {
  try {
      const meal = allMeals.find(meal => Number(meal.id) === Number(id))
      if (!meal) return
      const { label, picSrc } = meal        
      toggleDelLoader(id, true)
      // #TASTEY CRUD - D
      if (await Tastey.deleteMeal(id)) {
          Tastey.calculateCheckoutDetails(allMeals, currency)
          if (!getCardsQuery() && document.body.classList.contains("cart")) {
              deleteMeal(id)
          } else {
              if (bagQuery) 
                  removeCard(id, dir)    
              if (miniBagQuery)
                  removeMiniCard(id, dir)         
              await new Promise(resolve => setTimeout(() => {
                  deleteMeal(id)
                  resolve()
              }, removeStall))
          } 
          updateStates(id)
          setButtonState(id)
          Toast.success(`You removed ${label} from bag`, { image: picSrc, tag: `${id}SDel` })
      } else {
          Toast.error(`Could not remove ${label} from bag`, { image: picSrc, tag: `${id}EDel` })
      }
      toggleDelLoader(id, false)
  } catch(err) {
      console.error(err)
  }
}

//The clear cart function is a bit different due to its async nature
async function handleClearCart() {   
  try{
      if (Tastey.isEmpty()) {
          Toast.warn("Your Shopping Bag is already empty", { tag: 'EBag' })
          return
      }
      const shouldCartClear = await Confirm(`You are about to remove ${standardize(Tastey.ordersInTotal)} ${formatLabel("orders", Tastey.ordersInTotal)} from your Shopping Bag`)
      if (shouldCartClear) {
          toggleClearLoader(true)
          // #TASTEY CRUD - D
          if (await Tastey.clearCart()) {
              if (!getCardsQuery() && document.body.classList.contains("cart")) {
                  clearCart()
              } else {
                  if (bagQuery) 
                      removeAllCards()
                  if (miniBagQuery)
                      removeAllMiniCards()
                  await new Promise(resolve => setTimeout(() => {
                      clearCart()
                      resolve()
                  }, emptyStall))
              }
              Tastey.calculateCheckoutDetails(allMeals, currency)
              setCheckoutState()
              setCartStates()
              allMeals.forEach(({id}) => setButtonState(id))
              allMeals.forEach(({id}) => setOrderStates(id))
              Toast.success(`You Shopping bag has been emptied`, { tag: 'SCba' })                
          } else {
              Toast.error(`Could not empty Shopping bag`, { tag: 'ECba' })
          }
          toggleClearLoader(false)
      }        
  } catch(err) {
      console.error(err)
  }
}

//a function to handle likes
async function handleLikes(id) {
  try {
      const meal = allMeals.find(meal => Number(meal.id) === Number(id))
      if (!meal) return
      const { label, picSrc } = meal
      const tasteyMeal = document.querySelector(`.tastey-meal[data-id="${id}"]`),
      tasteyMealOrder = document.querySelector(`.tastey-meal-order[data-id="${id}"]`),
      mcTasteyMealOrder = document.querySelector(`.mini-cart-tastey-meal-order[data-id="${id}"]`)
      const like = mealsQuery ? !JSON.parse(tasteyMeal.dataset.like) : !JSON.parse(tasteyMealOrder?.dataset.like ?? mcTasteyMealOrder?.dataset.like)
      toggleLikeLoader(id, true)
      //#CRUD - CU
      if (await Tastey.handleLikes(id, like)) {            
          if (mealsQuery) {
              tasteyMeal.dataset.like = like
              tasteyMeal.querySelector(".heart-icon-wrapper").title = like ? "Tap to unlike" : "Tap to like!"
          }
          if (bagQuery && tasteyMealOrder) {
              tasteyMealOrder.dataset.like = like
              tasteyMealOrder.querySelector(".wishlist-toggler").title = like ? `Remove ${label} from Wishlist` : `Add ${label} to Wishlist`
          }
          if (miniBagQuery && mcTasteyMealOrder) {
              mcTasteyMealOrder.dataset.like = like
              mcTasteyMealOrder.querySelector(".mini-cart-wishlist-toggler").title = like ? `Remove ${label} from Wishlist` : `Add ${label} to Wishlist`
          }  
          Toast.success(like ? `You added ${label} to Wishlist` : `You removed ${label} from Wishlist`, { image: picSrc, tag: `${id}SLik` })
      } else {
          Toast.error(like ? `Could not add ${label} to Wishlist` : `Could not remove ${label} from Wishlist`, { image: picSrc, tag: `${id}ELik` })
      }
      toggleLikeLoader(id, false)
  } catch(err) {
      console.error(err)
  }
}

function handleCheckout() {
  const id = Tastey.tasteyRecord.tasteyOrders[Tastey.tasteyMeals - 1].id
  const meal = allMeals.find(meal => meal.id === id)
  const { picSrc: lastOrderPicSrc } = meal 
  const title = "Tastey",
  options = {
      body: `We are sorry :) but checkout is currently unavailable! We see you are trying to check out ${standardize(Tastey.ordersInTotal)} Tastey orders with a total cost of ${formatValue(currency, Tastey.totalCost)}`,
      image: `${lastOrderPicSrc}`,
      vibrate: [200, 100, 200, 100, 200, 100, 200],
      tag: "tastey-checkout-notification",
      renotify: true
  }
  Toast.warn("Checkout is currently unavailable!", { tag: 'UChe' })
  notificationQuery(title, options, "Check Out")
}
