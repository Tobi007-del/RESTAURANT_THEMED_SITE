// TODO: TOAST NOTIFICATIONS AND INDEXED DB

import data from "./fetch-meals.js"
import { Tastey, weakTastey } from "./TasteyManager.js"
import { check, formatValue, standardize, panning, scrollContentTo, remToPx, pxToRem, rand } from "./utility-functions.js"
import { autoRemoveScroller } from "./build-scroller.js"
import { notificationQuery } from "./service-worker-helper.js"

export { meals, allMeals, currency, maxOrders, getDOMElements, getOrderIndex, handleAddMeal, handleClearCart, handleLikes, handleCheckout, getCardsQuery, positionCards, adjustCards, positionMiniCards, adjustMiniCards } 

//Getting necessary data
const meals = data.tasteyMeals,

allMeals = Object.values(meals).flat(),

currency = data.currency, 

maxOrders = data.maxOrders

//queries to handle the present bag
const bagQuery = () => {return (document.body.dataset.bag === "true")}
const miniBagQuery = () => {return (document.body.dataset.miniBag === "true")}

// the code below fills up the cart immediately for development purposes
// allMeals.forEach(({ id }) => Tastey.addMeal(id, 1000))

// allMeals.forEach(({ id }) => Tastey.handleLikes(id, true))

// the one-liner below clears the cart immediately for development purposes
// window.localStorage.clear()

//Calculating checkout details
weakTastey.calculateCheckoutDetails(allMeals, currency)

//DOM Elements
let likeIconWrappers,orderReviewSectionContent,wishlistTogglers,tasteyMeals,tasteyMealsImages,tasteyMealOrders,tasteyOrderImages,deleteOrderBtns,plusCartBtns,minusCartBtns,checkoutSection,cartNumberElement,mealsNumberElement,actualPriceElement,totalDiscountElement,savedElement,totalPriceElement,TOTALCOSTElement,mcOrderReviewSection,mcTasteyMealOrders,mcTasteyOrderImages,mcWishlistTogglers,mcDeleteOrderBtns,mcPlusCartBtns,mcMinusCartBtns,mcActualPriceElement,mcTOTALCOSTElement

//using a function to get only the necessary DOM Elements so as to avoid errors
function getDOMElements() {
    if (bagQuery) {
        likeIconWrappers = document.querySelectorAll(".heart-icon-wrapper"),
        orderReviewSectionContent = document.querySelector(".order-review-section-content"),
        wishlistTogglers = document.getElementsByClassName("wishlist"),
        tasteyMeals = document.querySelectorAll(".tastey-meal"),
        tasteyMealsImages = document.querySelectorAll(".tastey-meal-image"),
        tasteyMealOrders = document.getElementsByClassName("tastey-meal-order"),
        tasteyOrderImages = document.getElementsByClassName("tastey-order-image"),
        deleteOrderBtns = document.getElementsByClassName("delete-order"),
        plusCartBtns = document.getElementsByClassName("add"),
        minusCartBtns = document.getElementsByClassName("minus"),
        checkoutSection = document.querySelector(".checkout-section"),
        cartNumberElement = document.querySelector(".cart-number"),
        mealsNumberElement = document.querySelector(".meals-number"),
        actualPriceElement = document.querySelector(".actual-price"),
        totalDiscountElement = document.querySelector(".total-discount"),
        savedElement = document.querySelector(".saved"),
        totalPriceElement = document.querySelector(".total-price"),
        TOTALCOSTElement = document.querySelector(".TOTAL-COST")
    }
    if (miniBagQuery()) {
        mcOrderReviewSection = document.querySelector(".mini-cart-order-review-section"),
        mcTasteyMealOrders = document.getElementsByClassName("mini-cart-tastey-meal-order"),
        mcTasteyOrderImages= document.getElementsByClassName("mini-cart-tastey-order-image"),
        mcWishlistTogglers = document.getElementsByClassName("mini-cart-wishlist"),
        mcDeleteOrderBtns = document.getElementsByClassName("mini-cart-delete-order"),
        mcPlusCartBtns = document.getElementsByClassName("mini-cart-add"),
        mcMinusCartBtns = document.getElementsByClassName("mini-cart-minus"),
        mcActualPriceElement = document.querySelector(".mini-cart-actual-price"),
        mcTOTALCOSTElement = document.querySelector(".mini-cart-TOTAL-COST")
    }
    setCartStates() 
    resetBagEventListeners()
}

//functions for the Card User Interface that activates on certain conditions
function getCardsQuery() {
    return (document.body.classList.contains("cart") && (document.body.dataset.cart != 0) && (window.innerWidth >= remToPx(55)) && (window.innerHeight >= remToPx(32.55)) && (CSS && CSS.supports('position', 'sticky')))
}

const liftOffset = () => {return pxToRem(tasteyMealOrders[0].getBoundingClientRect().height) - 6}

function positionCards() {
if (getCardsQuery() && !weakTastey.getEmpty()) {
    const orderNumberWrapper = document.querySelector(".order-number-wrapper")
    const gap = pxToRem((checkoutSection?.getBoundingClientRect().height - (tasteyMealOrders[0]?.getBoundingClientRect().height + orderNumberWrapper?.getBoundingClientRect().height + remToPx(0.75))) / tasteyMealOrders.length)
    const bottom = pxToRem(window.innerHeight - (remToPx(9.1 + (tasteyMealOrders.length * gap)) + tasteyMealOrders[0]?.getBoundingClientRect().height))
    document.querySelector("main.meal-cart").style.setProperty('--bottom', `${bottom}rem`)
    for (let i = 0; i < tasteyMealOrders.length; i++) {
        const top = 9.25 + (i * gap)
        tasteyMealOrders[i].dataset.top = top
        tasteyMealOrders[i].style.setProperty('--sticky-top', `${top}rem`)
        //adding pointer over event listener to all cards
        tasteyMealOrders[i].onpointerover = () => {
            setTimeout(() => {
                    if(tasteyMealOrders[i]?.matches(":hover"))
                        liftCard()
            }, 500)
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
        const buttons = tasteyMealOrders[i].querySelectorAll("button")
        tasteyMealOrders[i].onclick = () => {
            if (getCardsQuery())
                if (document.activeElement.tagName.toLowerCase() !== "button") 
                    moveToCard()
        }
        for (const button of buttons) {
            button.onfocus = () => {
                if (getCardsQuery())
                    if (button.matches(':focus-visible')) 
                        moveToCard()
            }
        }
        function moveToCard() {
            let pos = orderReviewSectionContent.getBoundingClientRect().height - (orderReviewSectionContent.getBoundingClientRect().height - (((tasteyMealOrders[i].getBoundingClientRect().height - remToPx(gap) + remToPx(1.25)) * (i+1)) + orderNumberWrapper.getBoundingClientRect().height + remToPx(2.5))) - tasteyMealOrders[i].getBoundingClientRect().height
            scrollContentTo(pos)
            tasteyMealOrders[i].classList.remove("lift")
        }
    }
}
}

function adjustCards() {
    if(getCardsQuery() && !weakTastey.getEmpty()) {
        const orderNumberWrapper = document.querySelector(".order-number-wrapper")
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
            let currTop = Math.round(pxToRem(tasteyMealOrders[i]?.getBoundingClientRect()?.top))
            let prevTop = Math.round(parseFloat(tasteyMealOrders[i]?.dataset?.top)) 
            let nCurrTop = Math.round(pxToRem(tasteyMealOrders[i]?.nextElementSibling?.getBoundingClientRect()?.top))
            let nPrevTop = Math.round(parseFloat(tasteyMealOrders[i]?.nextElementSibling?.dataset?.top))
            if ((currTop == prevTop) && (nCurrTop < (nPrevTop + liftOffset()))) {
                tasteyMealOrders[i].style.setProperty('--sticky-scale', `${1 - ((allMeals.length * ((tasteyMealOrders.length - i)/tasteyMealOrders.length))/950)}`)
            } 
            if ((currTop > prevTop) || (nCurrTop >= (nPrevTop + liftOffset()))) {
                tasteyMealOrders[i].style.setProperty('--sticky-scale', '1')
                tasteyMealOrders[i].classList.remove("lift")
            }   
        }
    }
}

//time stalling values for removing from and emptying the bag
let removeStall = 200
let emptyStall = 2000

function removeCard(id) {
    if (getCardsQuery() && !weakTastey.getEmpty()) {
        if(Tastey.tasteyRecord.tasteyOrders.length == 1) {
            removeStall = 2000
            removeAllCards()
            return
        } else {
            removeStall = 200
            let stall = 195
            const order = document.querySelector(`.tastey-meal-order[data-id="${id}"]`)        
            order?.classList.remove("lift")
            order?.animate({transform: `translate(${rand(-20,20)}%, ${pxToRem(window.innerHeight) - (parseFloat(order.dataset?.top))}rem)`},{duration: stall, fill: "forwards"})
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
        const allTasteyMealOrders = document.querySelectorAll(".tastey-meal-order")   
        removeExtras()
        allTasteyMealOrders.forEach((order,i) => {
            const stall = (((allTasteyMealOrders.length - i)/allTasteyMealOrders.length * 200) + 1000)
            order?.classList.remove("lift")
            order?.animate({transform: `translate(${rand(-15,15)}%, ${pxToRem(window.innerHeight) - (parseFloat(order.dataset?.top))}rem)`},{duration: stall, fill: "forwards"})                
        })   
    }
}

//functions for the Mini Card User Interface that activates on certain conditions
function getMiniCardsQuery() {
    return (CSS && CSS.supports('position', 'sticky'))
}

const offset = () => {
    return pxToRem(mcOrderReviewSection?.getBoundingClientRect().height - mcTasteyMealOrders[0]?.getBoundingClientRect().height) - 4
}

let gap
function positionMiniCards() {
    if (getMiniCardsQuery() && !weakTastey.getEmpty()) {
        gap = offset() / mcTasteyMealOrders.length    
        const bottom = pxToRem(mcOrderReviewSection?.getBoundingClientRect().height) - (((mcTasteyMealOrders.length * gap)) + pxToRem(mcTasteyMealOrders[mcTasteyMealOrders.length-1]?.getBoundingClientRect().height)) 
        mcOrderReviewSection.style.setProperty('--mini-bottom', `${bottom}rem`)
        for (let i = 0; i < mcTasteyMealOrders.length; i++) {
            mcTasteyMealOrders[i].style.setProperty('--mini-sticky-top', `${.25+(i*gap)}rem`)
            const buttons = mcTasteyMealOrders[i].querySelectorAll("button")
            mcTasteyMealOrders[i].onclick = () => {if (document.activeElement.tagName.toLowerCase() !== "button") moveToCard()}
            for (const button of buttons) {
                button.onfocus = () => {
                    if (button.matches(':focus-visible')) 
                        moveToCard()
                }
            }
            function moveToCard() {
                let pos = mcOrderReviewSection.getBoundingClientRect().height - (mcOrderReviewSection.getBoundingClientRect().height - (((mcTasteyMealOrders[mcTasteyMealOrders.length-1].getBoundingClientRect().height - remToPx(gap) + remToPx(.5)) * (i+1)))) - mcTasteyMealOrders[mcTasteyMealOrders.length-1].getBoundingClientRect().height
                scrollContentTo(pos,"smooth",mcOrderReviewSection)
            }
        }
    }
}

function adjustMiniCards() {
    if(getMiniCardsQuery() && !weakTastey.getEmpty()) {
        for (let i = 0; i < mcTasteyMealOrders.length; i++) {
            if (mcTasteyMealOrders[i].getBoundingClientRect().top < (remToPx(1.075 + (gap * i)) + mcTasteyMealOrders[i].getBoundingClientRect().height)) {
                mcTasteyMealOrders[i].style.setProperty('--mini-sticky-scale', `${1 - ((allMeals.length * ((mcTasteyMealOrders.length - i)/mcTasteyMealOrders.length))/950)}`)
            } 
            if (mcTasteyMealOrders[i].getBoundingClientRect().top > (remToPx(1.075 + (gap * i)) + mcTasteyMealOrders[i].getBoundingClientRect().height)) {
                    mcTasteyMealOrders[i].style.setProperty('--mini-sticky-scale', '1')
            }               
        }
    }
}

function removeMiniCard(id) {
    if (getMiniCardsQuery() && !weakTastey.getEmpty()) {
        let stall
        if (weakTastey.tasteyRecord.tasteyOrders.length == 1 && getCardsQuery() && document.body.classList.contains("cart")) {
            removeStall = 2000
            stall = 2000
        } else {
            removeStall = 200
            stall = 195            
        }
        const order = document.querySelector(`.mini-cart-tastey-meal-order[data-id="${id}"]`)        
        order?.animate({transform: `translate(${rand(-10,10)}%, 15rem)`},{duration: stall, fill: "forwards"})
    }
}

function removeAllMiniCards() {
    if (!weakTastey.getEmpty()) {
        const allTasteyMealOrders = document.querySelectorAll(".mini-cart-tastey-meal-order")
        allTasteyMealOrders.forEach((order,i) => {
            const stall = (((allTasteyMealOrders.length - i)/allTasteyMealOrders.length*200) + 1000)
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
            dataCartState.dataset.cart = standardize(weakTastey.ordersInTotal, "use strict")
            return
        }
        dataCartState.dataset.cart = standardize(weakTastey.ordersInTotal)
    })
    dataMealsState.forEach(mealsState => {
        mealsState.dataset.meals = standardize(weakTastey.tasteyMeals)
    })
}

function setOrderStates(id) {
    const dataOrderStates = document.querySelectorAll("[data-orders]")
    dataOrderStates.forEach(dataOrderState => {
        if(Number(dataOrderState.dataset.id) === Number(id)) 
            dataOrderState.dataset.orders = standardize(weakTastey.getOrdersValue(id))
    })
}

function setLikeState(id) {
    const dataLikeStates = document.querySelectorAll("[data-like]")
    dataLikeStates.forEach(dataLikeState => {
        if(Number(dataLikeState.dataset.id) === Number(id)) 
            dataLikeState.dataset.like = weakTastey.getLikeValue(id) ?? !dataLikeState.dataset.like
    })
}        

//functions for specific tastey operations

//a function for adding a meal to the page
function addMeal(id, meals, curr) {
    const meal = meals.find(meal => Number(meal.id) === Number(id))
    const { label, category, price, serving, picSrc } = meal
    const index = weakTastey.tasteyRecord.tasteyOrders.findIndex(meal => Number(meal.id) === Number(id))
    let currentProductCount = weakTastey.tasteyRecord.tasteyOrders[index].orders
    if (bagQuery()) {
        const currentProductCountElement = document.querySelector(`.tastey-meal-order[data-id="${id}"] .cart-number`)
        const orderReviewSectionContent = document.querySelector(".order-review-section-content")
        if (currentProductCount > 1) { 
            currentProductCountElement.textContent = standardize(currentProductCount)
        } else {
            const newProduct = document.createElement('div')
            newProduct.classList.add('tastey-meal-order')
            newProduct.dataset.id = id
            newProduct.dataset.discount = price.discount ?? 0
            newProduct.dataset.like = weakTastey.getLikeValue(id) ?? false
            newProduct.dataset.orders = weakTastey.getOrdersValue(id)
            newProduct.dataset.position = weakTastey.tasteyRecord.tasteyOrders.length ?? 1
            newProduct.innerHTML = 
            `
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
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
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
                                    <p class="cart-number">${currentProductCount}</p>
                                <button type="button" title="Add 1 ${label[label.length - 1] === 's' ? label.slice(0,label.length - 1) : label}" class="sign add">
                                    <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="M12 7.023V4.977a.641.641 0 0 0-.643-.643h-3.69V.643A.641.641 0 0 0 7.022 0H4.977a.641.641 0 0 0-.643.643v3.69H.643A.641.641 0 0 0 0 4.978v2.046c0 .356.287.643.643.643h3.69v3.691c0 .356.288.643.644.643h2.046a.641.641 0 0 0 .643-.643v-3.69h3.691A.641.641 0 0 0 12 7.022Z" id="b"/></defs><use fill-rule="nonzero" xlink:href="#b"/></svg>
                                </button>
                            </span>                   
                                <p class="serving-size" data-serving=${serving ?'"' + serving + '"' : "NG"}>Note: </p>
                            </span>         
                            <span class="order-price" data-discount="${price.discount ?? 0}">
                                <h3 class="meal-price" data-discount="${price.discount ?? 0}">${formatValue(curr,check(price.currentValue,price.discount))}</h3>
                                <h3 class="actual-meal-price">${formatValue(curr,price.currentValue)}</h3>
                            </span>
                        </div>
                    </div>
                    </div>
            `
            orderReviewSectionContent.appendChild(newProduct)
            panning(document.querySelector(`.tastey-meal-order[data-id="${id}"] .tastey-order-image`))
            positionCards()
        }    
    } 
    if (miniBagQuery()) {
        const mcCurrentProductCountElement = document.querySelector(`.mini-cart-tastey-meal-order[data-id="${id}"] .mini-cart-number`)
        const mcOrderReviewSection = document.querySelector(".mini-cart-order-review-section")
        if (currentProductCount > 1) { 
            mcCurrentProductCountElement.textContent = standardize(currentProductCount)
        } else {
            const mcNewProduct = document.createElement('div')
            mcNewProduct.classList.add('mini-cart-tastey-meal-order')
            mcNewProduct.dataset.id = id
            mcNewProduct.dataset.like = weakTastey.getLikeValue(id) ?? false
            mcNewProduct.dataset.orders = weakTastey.getOrdersValue(id)
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
                                                    <p class="mini-cart-meal-price">${formatValue(curr,check(price.currentValue,price.discount))}</p>
                                                    <p  class="mini-cart-actual-meal-price">${formatValue(curr,price.currentValue)}</p>
                                                    </span>
                                                </div>
                                                <div>
                                                    <button type="button" title="Remove ${label} from Bag"  class="mini-cart-delete-order">
                                                        <span>
                                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                                                        </span>
                                                    </button>
                                                    <button type="button" title="${(weakTastey.getLikeValue(id) ?? false) ? `Remove ${label} from Wishlist` : `Add ${label} to Wishlist`}" class="mini-cart-wishlist">
                                                        <span>
                                                            <svg class="unliked-heart-icon" viewBox="0 -960 960 960"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/></svg>
                                                            <svg class="liked-heart-icon" viewBox="0 0 512 512"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="mini-cart-toggle-wrapper">
                                                <span class="mini-cart-toggle">
                                                    <button type="button" title="Remove 1 ${label[label.length - 1] === 's' ? label.slice(0,label.length - 1) : label}" class="mini-cart-sign mini-cart-minus">
                                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                                                        <svg width="12" height="4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="M11.357 3.332A.641.641 0 0 0 12 2.69V.643A.641.641 0 0 0 11.357 0H.643A.641.641 0 0 0 0 .643v2.046c0 .357.287.643.643.643h10.714Z" id="a"/></defs><use fill-rule="nonzero" xlink:href="#a"/></svg>
                                                    </button>
                                                        <p class="mini-cart-number">${weakTastey.getOrdersValue(id)}</p>
                                                    <button type="button" title="Add 1 ${label[label.length - 1] === 's' ? label.slice(0,label.length - 1) : label}" class="mini-cart-sign mini-cart-add">
                                                        <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="M12 7.023V4.977a.641.641 0 0 0-.643-.643h-3.69V.643A.641.641 0 0 0 7.022 0H4.977a.641.641 0 0 0-.643.643v3.69H.643A.641.641 0 0 0 0 4.978v2.046c0 .356.287.643.643.643h3.69v3.691c0 .356.288.643.644.643h2.046a.641.641 0 0 0 .643-.643v-3.69h3.691A.641.641 0 0 0 12 7.022Z" id="b"/></defs><use fill-rule="nonzero" xlink:href="#b"/></svg>
                                                    </button>
                                                </span>      
                                            </div>
                                        </div>
            `        
            mcOrderReviewSection.appendChild(mcNewProduct)    
            panning(document.querySelector(`.mini-cart-tastey-meal-order[data-id="${id}"] .mini-cart-tastey-order-image`))
            positionMiniCards()
        }
    }
}

//a function for removing a meal from the page
function removeMeal(id) {
    const index = weakTastey.tasteyRecord.tasteyOrders.findIndex(meal => Number(meal.id) === Number(id))
    const currentProductCount = weakTastey.tasteyRecord.tasteyOrders[index].orders
    if (bagQuery()) {
        const currentProductCountElement = document.querySelector(`.tastey-meal-order[data-id="${id}"] .cart-number`)
        currentProductCountElement.textContent = standardize(currentProductCount)
    }
    if (miniBagQuery()) {
        const mcCurrentProductCountElement = document.querySelector(`.mini-cart-tastey-meal-order[data-id="${id}"] .mini-cart-number`)
        mcCurrentProductCountElement.textContent = standardize(currentProductCount)
    }
}

//a function for updating the checkout state
function setCheckoutState() {
    // #TASTEY CRUD - R
    if (bagQuery()) {
        cartNumberElement.textContent = standardize(weakTastey.ordersInTotal)
        mealsNumberElement.textContent = standardize(weakTastey.tasteyMeals)
        actualPriceElement.textContent = formatValue(currency, weakTastey.actualAmount)
        totalDiscountElement.textContent = '-' + weakTastey.totalDiscountPercentage + ' %'
        savedElement.textContent = formatValue(currency, weakTastey.savedAmount)
        totalPriceElement.textContent = formatValue(currency, weakTastey.totalAmount)
        TOTALCOSTElement.textContent = formatValue(currency, weakTastey.totalCost)
    } 
    if (miniBagQuery()) {
        mcActualPriceElement.textContent = formatValue(currency, weakTastey.actualAmount)
        mcTOTALCOSTElement.textContent = formatValue(currency, weakTastey.totalCost)        
    }
}

//a function to assign all necessary event listeners
function resetBagEventListeners() {
    if (bagQuery()) {
        for(let i = 0; i < tasteyMealOrders.length; i++) {
            wishlistTogglers[i].onclick = () => handleWishlist(tasteyMealOrders[i]?.dataset.id,i)      
            tasteyOrderImages[i].ondblclick = () => handleWishlist(tasteyMealOrders[i]?.dataset.id,i)  
            deleteOrderBtns[i].onclick = () => handleDelete(tasteyMealOrders[i]?.dataset.id,i)
            plusCartBtns[i].onclick = () => handleAddMeal(tasteyMealOrders[i].dataset.id,i)
            plusCartBtns[i].classList.add('hover')
            minusCartBtns[i].onclick = () => handleRemoveMeal(tasteyMealOrders[i]?.dataset.id,i)
            setButtonState({i:i})
        }
    }
    if (miniBagQuery()) {
        for(let i = 0; i < mcTasteyMealOrders.length; i++) {
            mcWishlistTogglers[i].onclick = () => handleWishlist(mcTasteyMealOrders[i]?.dataset.id,i)      
            mcTasteyOrderImages[i].ondblclick =  () => handleWishlist(mcTasteyMealOrders[i]?.dataset.id,i)  
            mcDeleteOrderBtns[i].onclick = () => handleDelete(mcTasteyMealOrders[i]?.dataset.id,i)
            mcPlusCartBtns[i].onclick = () => handleAddMeal(mcTasteyMealOrders[i].dataset.id,i)
            mcPlusCartBtns[i].classList.add('hover')
            mcMinusCartBtns[i].onclick = () => handleRemoveMeal(mcTasteyMealOrders[i]?.dataset.id,i)
            setButtonState({i:i})
        }        
    }
}

function getOrderIndex(id) {
    let i
    const mealOrders = document.querySelectorAll(".mini-cart-tastey-meal-order") || document.querySelectorAll(".tastey-meal-order")
    const childrenArray = Array.from(document.querySelector('.mini-cart-order-review-section').children) || Array.from(document.querySelector('.order-review-section-content').children)
    childrenArray.shift()
    mealOrders?.forEach(order => {
        if (Number(order.dataset.id) === Number(id)) 
            i = childrenArray.indexOf(order) ?? 0
    })
    return i
}

function getOrderId(i) {
    const mealOrders = document.getElementsByClassName("mini-cart-tastey-meal-order") || document.getElementsByClassName("tastey-meal-order")
    const id = Number(mealOrders[i]?.dataset.id)
    return id
}

//a function to control the minus btn hover state
function setButtonState({i,id}) {
    id = id || getOrderId(i)
    i = i || getOrderIndex(id)
    if (bagQuery()) {
        const number = weakTastey.getOrdersValue(tasteyMealOrders[i]?.dataset.id)
        minusCartBtns[i]?.classList.toggle('hover', number > 1)
        document.querySelector(`.add-to-cart-button[data-id="${id}"]`)?.classList.toggle('disabled', weakTastey.getOrdersValue(id) >= maxOrders)
        plusCartBtns[i]?.classList.toggle('disabled', weakTastey.getOrdersValue(id) >= maxOrders)
        if (plusCartBtns[i]) plusCartBtns[i].tabIndex = weakTastey.getOrdersValue(id) >= maxOrders ? -1 : 0
    }
    if (miniBagQuery()) {
        const number = weakTastey.getOrdersValue(mcTasteyMealOrders[i]?.dataset.id)
        mcMinusCartBtns[i]?.classList.toggle('hover', number > 1)
        mcPlusCartBtns[i]?.classList.toggle('disabled', weakTastey.getOrdersValue(id) >= maxOrders)
        if (mcPlusCartBtns[i]) mcPlusCartBtns[i].tabIndex = weakTastey.getOrdersValue(id) >= maxOrders ? -1 : 0
        document.querySelector(`.footer-add-to-cart-button[data-id="${id}"]`)?.classList.toggle('disabled', weakTastey.getOrdersValue(id) >= maxOrders)
        if (document.querySelector(`.footer-add-to-cart-button[data-id="${id}"]`)) document.querySelector(`.footer-add-to-cart-button[data-id="${id}"]`).tabIndex = weakTastey.getOrdersValue(id) >= maxOrders ? -1 : 0
    }
}

//a function to handle updating general states
function updateStates(id) {
    weakTastey.calculateCheckoutDetails(allMeals, currency)
    setCartStates()
    setOrderStates(id)
    setCheckoutState()
}

//a function to handle the adding of a meal
function handleAddMeal(id,i,n=1) {
    try {
        if (weakTastey.getOrdersValue(id) < maxOrders) {
            // #TASTEY CRUD - CU
            Tastey.addMeal(id,n)
            addMeal(id, allMeals, currency)
            updateStates(id)
            setButtonState({i:i,id:id})
            resetBagEventListeners()                    
        }
    } catch(err) {
        alert("Error adding a meal to bag :)")
        console.error(err)
    }
}

//a function to handle the removing of a meal
function handleRemoveMeal(id,i,n=1) {
    try {
        const number = weakTastey.getOrdersValue(tasteyMealOrders[i]?.dataset.id ?? mcTasteyMealOrders[i]?.dataset.id)
        if(number > 1) { 
            // #TASTEY CRUD - UD
            Tastey.removeMeal(id,n)
            removeMeal(id)
            updateStates(id)
            setButtonState({i:i,id:id})
        } else if(number === 1) { 
            handleDelete(id,i)
        }
    } catch(err) {
        alert("Error removing a meal from bag :)")
        console.error(err)
    }
}

//The delete function is different due to its async nature
let deleteTimeout
function handleDelete(id,i) {
    try {
        if (!getCardsQuery() && document.body.classList.contains("cart")) {
            deleteMeal(id,i)
            return
        }
        if (deleteTimeout) {clearTimeout(deleteTimeout)}
        deleteTimeout = setTimeout(() => {
            if (bagQuery() && getCardsQuery()) 
                removeCard(id)    
            if (miniBagQuery())
                removeMiniCard(id)
            setTimeout(deleteMeal, removeStall, id, i)                  
        }, removeStall);
    } catch(err) {
        alert("Error removing meal from bag :)") 
        console.error(err)
    }
}

//a function for deleting orders
function deleteMeal(id,i) {
    if (bagQuery()) {
        tasteyMealOrders[i]?.remove()
        positionCards()
        setTimeout(autoRemoveScroller,100)
    }
    if (miniBagQuery()) {
        mcTasteyMealOrders[i]?.remove()
        positionMiniCards()
    }
    // #TASTEY CRUD - D
    Tastey.deleteMeal(id)
    updateStates(id)
    setButtonState({i:i,id:id})
    resetBagEventListeners()
}

//The clear cart function is a bit different due to its async nature
function handleClearCart() {   
    try{
        if (weakTastey.getEmpty()) {
            console.warn("You literally have no items in your Shopping Bag :)")
            alert("Your Shopping Bag is already empty")
            return
        }
        const isCartCleared = confirm(`You are about to remove ${standardize(Tastey.ordersInTotal)} ${Tastey.ordersInTotal > 1 ? "orders" : "order"} from your Shopping Bag!`)
        if (isCartCleared) {
            if (!getCardsQuery() && document.body.classList.contains("cart")) {
                clearCart()
                return
            }
            if (bagQuery()) 
                if (getCardsQuery()) 
                    removeAllCards()
            if (miniBagQuery()) 
                if (getMiniCardsQuery())
                    removeAllMiniCards()
            setTimeout(clearCart, emptyStall)
        }        
    } catch(err) {
        alert("Error occured while clearing bag :)")
        console.error(err)
    }
}

//a function to clear the tastey bag
function clearCart() {
    if (bagQuery()) {
        const allTasteyMealOrders = document.querySelectorAll(".tastey-meal-order")   
        allTasteyMealOrders.forEach(order => order.remove())
        setTimeout(autoRemoveScroller, 500)
    }
    if (miniBagQuery()) {
        const mcAllTasteyMealOrders = document.querySelectorAll(".mini-cart-tastey-meal-order")
        mcAllTasteyMealOrders.forEach(order => order.remove())
    }
    // #TASTEY CRUD - D
    Tastey.clearCart()
    weakTastey.calculateCheckoutDetails(allMeals, currency)
    setCheckoutState()
    setCartStates()
    allMeals.forEach(({id}) => setButtonState({id: id}))
    allMeals.forEach(({id}) => setOrderStates(id))
}

//a function to handle likes
function handleLikes(i) {
    try {
        if (bagQuery()) {
            tasteyMeals[i].dataset.like = tasteyMeals[i].dataset.like === "false" ? "true" : "false"
            likeIconWrappers[i].title = tasteyMeals[i].dataset.like === "false" ? "" : "Tap to like!"
            //#CRUD - CU
            Tastey.handleLikes(tasteyMeals[i].dataset.id,tasteyMeals[i].dataset.like === "true")
            setLikeState(tasteyMeals[i].dataset.id)
        }
    } catch(err) {
        alert("Error while accessing wishlist :)")
        console.error(err)
    }
}

//a function to handle likes
function handleWishlist(likeId,i) {
    try {
        const meal = allMeals.find(meal => Number(meal.id) === Number(likeId))
        const { label } = meal
        const like = tasteyMealOrders[i]?.dataset?.like ?? mcTasteyMealOrders[i]?.dataset?.like
        const id = tasteyMealOrders[i]?.dataset?.id ?? mcTasteyMealOrders[i]?.dataset?.id
        if (bagQuery()) {
            tasteyMealOrders[i].dataset.like = like === "false" ? "true" : "false"
            wishlistTogglers[i].title = like === "false" ? `Add ${label} to Wishlist` : `Remove ${label} from Wishlist`
        }
        if (miniBagQuery()) {
            mcTasteyMealOrders[i].dataset.like = like === "false" ? "true" : "false"
            mcWishlistTogglers[i].title = like === "false" ? `Add ${label} to Wishlist` : `Remove ${label} from Wishlist`
        }
        //#CRUD - CU
        Tastey.handleLikes(id,!(like === "true"))
        setLikeState(id)        
    } catch(err) {
        alert("Error while accessing wishlist :)")
        console.error(err)
    }
}

function handleCheckout() {
    const id = weakTastey.tasteyRecord.tasteyOrders[weakTastey.tasteyMeals - 1].id
    const meal = allMeals.find(meal => meal.id === id)
    const { picSrc: lastOrderPicSrc } = meal 
    const title = "Tastey";
    const options = {
        body: `We are sorry :) but checkout is currently unavailable!!! We see you are trying to check out ${standardize(weakTastey.ordersInTotal)} Tastey orders with a total cost of ${formatValue(currency, weakTastey.totalCost)}`,
        image: `${lastOrderPicSrc}`,
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        tag: "tastey-checkout-notification",
        renotify: true
    }
    notificationQuery(title, options, "Check Out")
}

