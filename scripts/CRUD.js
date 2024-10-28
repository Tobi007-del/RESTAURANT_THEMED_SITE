import data from "./fetch.js"
import { Tastey, weakTastey } from "./TasteyManager.js"
import { check, formatValue, clamp , panning, scrollContentTo, remToPx, pxToRem, rand, syncScrollToBottom } from "./utility-functions.js"
import { autoRemoveScroller } from "./build-scroller.js"

export { data, meals, allMeals, getDOMElements, handleAddMeal, handleClearCart, handleLikes, getCardsQuery, positionCards, adjustCards, positionMiniCards, adjustMiniCards } 

//Getting necessary data
const meals = data.tasteyMeals,

allMeals = [...meals[0].starters,...meals[1]["main-meals"],...meals[2].drinks,...meals[3].desserts]

const bagQuery = () => {
    return (document.body.dataset.bag === "true")
}
const miniBagQuery = () => {
    return (document.body.dataset.miniBag === "true")
}

// the code below fills up the cart immediately for development purposes
// allMeals.forEach(({ id }) => {
//     Tastey.addMeal(id)
// })

// allMeals.forEach(({ id }) => {
//     Tastey.handleLikes(id,true)
// })

// the one-liner below clears the cart immediately for development purposes
// localStorage.clear()

//Calculating checkout details
weakTastey.calculateCheckoutDetails(allMeals)

//DOM Elements
let likeIconWrappers,orderReviewSectionContent,wishlistTogglers,tasteyMeals,tasteyMealsImages,tasteyMealOrders,tasteyOrderImages,addToCartBtns,deleteOrderBtns,plusCartBtns,minusCartBtns,checkoutSection,cartNumberElement,mealsNumberElement,actualPriceElement,totalDiscountElement,savedElement,totalPriceElement,TOTALCOSTElement,mcOrderReviewSection,mcTasteyMealOrders,mcTasteyOrderImages,mcWishlistTogglers,mcDeleteOrderBtns,mcPlusCartBtns,mcMinusCartBtns,mcActualPriceElement,mcTOTALCOSTElement

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
        addToCartBtns = document.querySelectorAll(".add-to-cart-button"),
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
        mcTasteyOrderImages = document.getElementsByClassName("mini-cart-tastey-order-image"),
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
    return (document.body.classList.contains("cart") && (document.body.dataset.cart != 0) && (window.innerWidth >= remToPx(55)) && (window.innerHeight >= remToPx(35)) && (CSS && CSS.supports('position', 'sticky')))
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
        tasteyMealOrders[i].ondblclick = moveToHeader
        header.onclick = moveToHeader
        header.onfocus = () => {
            if (header.matches(':focus-visible')) 
                moveToHeader()
        }
        function moveToHeader() {
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
            order.classList.remove("lift")
            order.animate({transform: `translate(${rand(-20,20)}%, ${pxToRem(window.innerHeight) - (parseFloat(order.dataset?.top))}rem)`},{duration: stall, fill: "forwards"})
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
            order.classList.remove("lift")
            order.animate({transform: `translate(${rand(-15,15)}%, ${pxToRem(window.innerHeight) - (parseFloat(order.dataset?.top))}rem)`},{duration: stall, fill: "forwards"})                
        })   
    }
}

//functions for the Mini Card User Interface that activates on certain conditions
function getMiniCardsQuery() {
    return (CSS && CSS.supports('position', 'sticky'))
}

const offset = 14.5 - 6.5 - 4
let gap
function positionMiniCards() {
    if (getMiniCardsQuery() && !weakTastey.getEmpty()) {
        gap = offset / mcTasteyMealOrders.length    
        const bottom = 14.5 - (((mcTasteyMealOrders.length * gap)) + 6.5) 
        mcOrderReviewSection.style.setProperty('--mini-bottom', `${bottom}rem`)
        for (let i = 0; i < mcTasteyMealOrders.length; i++) {
            mcTasteyMealOrders[i].style.setProperty('--mini-sticky-top', `${.25+(i*gap)}rem`)
        }
    }
}

function adjustMiniCards() {
    if(getMiniCardsQuery() && !weakTastey.getEmpty()) {
        for (let i = 0; i < mcTasteyMealOrders.length; i++) {
            if (i>0) {
                if (mcTasteyMealOrders[i].getBoundingClientRect().top < (remToPx(1.25 + (gap * i)) + mcTasteyMealOrders[i].getBoundingClientRect().height)) {
                    mcTasteyMealOrders[i].style.setProperty('--mini-sticky-scale', `${1 - ((allMeals.length * ((mcTasteyMealOrders.length - i)/mcTasteyMealOrders.length))/950)}`)
                } 
                if (mcTasteyMealOrders[i].getBoundingClientRect().top > (remToPx(1.05 + (gap * i)) + mcTasteyMealOrders[i].getBoundingClientRect().height)) {
                    mcTasteyMealOrders[i].style.setProperty('--mini-sticky-scale', '1')
                }               
            } else {        
                if (mcTasteyMealOrders[i].getBoundingClientRect().top < 114) {
                    mcTasteyMealOrders[i].style.setProperty('--mini-sticky-scale', `${1 - ((allMeals.length * ((mcTasteyMealOrders.length - i)/mcTasteyMealOrders.length))/950)}`)
                } 
                if (mcTasteyMealOrders[i].getBoundingClientRect().top > 115.75) {
                    mcTasteyMealOrders[i].style.setProperty('--mini-sticky-scale', '1')                
                }
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
        order.animate({transform: `translate(${rand(-10,10)}%, 14rem)`},{duration: stall, fill: "forwards"})
    }
}

//functions for general tastey operations
function setCartStates() {
    const dataCartStates = document.querySelectorAll("[data-cart]")
    const dataMealsState = document.querySelectorAll("[data-meals]")
    dataCartStates.forEach(dataCartState => {
        dataCartState.dataset.cart = weakTastey.ordersInTotal
    })
    dataMealsState.forEach(mealsState => {
        mealsState.dataset.meals = weakTastey.tasteyMeals
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

function setLikeState(id) {
    const dataLikeStates = document.querySelectorAll("[data-like]")
    dataLikeStates.forEach(dataLikeState => {
        if(Number(dataLikeState.dataset.id) === id) {
            dataLikeState.dataset.like = weakTastey.getLikeValue(id) ?? !dataLikeState.dataset.like
        }
    })
}        

function setPositionStates() {
    const dataPositionStates = document.querySelectorAll('[data-position]')
    dataPositionStates.forEach(dataPositionState => {
        dataPositionState.dataset.position = ((weakTastey.getPositionValue(Number(dataPositionState.dataset.id)) ?? 0) + 1)
    })    
}    

//functions for specific tastey operations

function addMeal(id,meals,curr) {
    const meal = meals.find(meal => meal.id === id)
    const { label, category, price, serving, picSrc } = meal
    const index = weakTastey.tasteyRecord.tasteyOrders.findIndex(meal => meal.id === id)
    let currentProductCount = weakTastey.tasteyRecord.tasteyOrders[index].orders
    if (bagQuery()) {
        const currentProductCountElement = document.querySelector(`.tastey-meal-order[data-id="${id}"] .cart-number`)
        const orderReviewSectionContent = document.querySelector(".order-review-section-content")
        if (currentProductCount > 1) { 
            currentProductCountElement.textContent = currentProductCount
        } else {
             orderReviewSectionContent.innerHTML += 
            `
                <div class="tastey-meal-order" data-id="${id}" data-like="${weakTastey.getLikeValue(Number(id)) ?? false}" data-orders="${weakTastey.getOrdersValue(Number(id)) ?? 0}" data-position = "${weakTastey.tasteyRecord.tasteyOrders.length ?? 1}">
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
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
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
                </div>
            `
        }    
        panning(document.querySelectorAll(".tastey-order-image"))
        positionCards()
    } 
    if (miniBagQuery()) {
        const mcCurrentProductCountElement = document.querySelector(`.mini-cart-tastey-meal-order[data-id="${id}"] .mini-cart-number`)
        const mcOrderReviewSection = document.querySelector(".mini-cart-order-review-section")
        if (currentProductCount > 1) { 
            mcCurrentProductCountElement.textContent = currentProductCount
        } else {
            mcOrderReviewSection.innerHTML += 
            `
                            <div class="mini-cart-tastey-meal-order" data-id="${id}" id="tastey-meal-order-${id}" data-like="${weakTastey.getLikeValue(Number(id)) ?? false}" data-orders="${weakTastey.getOrdersValue(Number(id)) ?? 0}" data-discount="${price.discount ?? 0}">               
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
                                                    <button type="button" title="${(weakTastey.getLikeValue(Number(id)) ?? false) ? `Remove ${label} from Wishlist` : `Add ${label} to Wishlist`}" class="mini-cart-wishlist">
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
                                                        <p class="mini-cart-number">${weakTastey.getOrdersValue(Number(id)) ?? 0}</p>
                                                    <button type="button" title="Add 1 ${label[label.length - 1] === 's' ? label.slice(0,label.length - 1) : label}" class="mini-cart-sign mini-cart-add">
                                                        <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="M12 7.023V4.977a.641.641 0 0 0-.643-.643h-3.69V.643A.641.641 0 0 0 7.022 0H4.977a.641.641 0 0 0-.643.643v3.69H.643A.641.641 0 0 0 0 4.978v2.046c0 .356.287.643.643.643h3.69v3.691c0 .356.288.643.644.643h2.046a.641.641 0 0 0 .643-.643v-3.69h3.691A.641.641 0 0 0 12 7.022Z" id="b"/></defs><use fill-rule="nonzero" xlink:href="#b"/></svg>
                                                    </button>
                                                </span>      
                                            </div>
                                        </div>
                                    </div>  
            `            
        }
        panning(document.querySelectorAll(".mini-cart-tastey-order-image"))
        positionMiniCards()
    }
}

//a function for removing a meal
function removeMeal(id) {
    const index = weakTastey.tasteyRecord.tasteyOrders.findIndex(meal => meal.id === id)
    const currentProductCount = weakTastey.tasteyRecord.tasteyOrders[index].orders
    if (bagQuery()) {
        const currentProductCountElement = document.querySelector(`.tastey-meal-order[data-id="${id}"] .cart-number`)
        currentProductCountElement.textContent = currentProductCount
    }
    if (miniBagQuery()) {
        const mcCurrentProductCountElement = document.querySelector(`.mini-cart-tastey-meal-order[data-id="${id}"] .mini-cart-number`)
        mcCurrentProductCountElement.textContent = currentProductCount
    }
}

//a function for deleting orders
function deleteMeal(id,n) {
    if (bagQuery()) {
        tasteyMealOrders[n].remove()
        positionCards()
        setTimeout(autoRemoveScroller,100)
    }
    if (miniBagQuery()) {
        mcTasteyMealOrders[n].remove()
        positionMiniCards()
    }
    // #TASTEY CRUD - D
    Tastey.deleteMeal(id)
    updateStates(id)
    resetBagEventListeners()
}

function setCheckoutState() {
    if (bagQuery()) {
        cartNumberElement.textContent = weakTastey.ordersInTotal
        mealsNumberElement.textContent = weakTastey.tasteyMeals
        actualPriceElement.textContent = formatValue(data.currency, weakTastey.actualAmount)
        totalDiscountElement.textContent = "-" + weakTastey.totalDiscountPercentage + "%"
        savedElement.textContent = formatValue(data.currency, weakTastey.savedAmount)
        totalPriceElement.textContent = formatValue(data.currency, weakTastey.totalAmount)
        TOTALCOSTElement.textContent = formatValue(data.currency, weakTastey.totalCost)
    } 
    if (miniBagQuery()) {
        mcActualPriceElement.textContent = formatValue(data.currency, weakTastey.actualAmount)
        mcTOTALCOSTElement.textContent = formatValue(data.currency, weakTastey.totalCost)        
    }
}

function resetBagEventListeners() {
    if (bagQuery()) {
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
    if (miniBagQuery()) {
        for(let i = 0; i < mcTasteyMealOrders.length; i++) {
            mcWishlistTogglers[i].onclick = () => {
                handleWishlist(Number(mcTasteyMealOrders[i]?.dataset.id),i)      
            }
            mcTasteyOrderImages[i].ondblclick = mcTasteyOrderImages[i].fn = () => {
                handleWishlist(Number(mcTasteyMealOrders[i]?.dataset.id),i)  
            }
            mcDeleteOrderBtns[i].onclick = () => {
                handleDelete(Number(mcTasteyMealOrders[i]?.dataset.id),i)
            }
            mcPlusCartBtns[i].onclick = () => {
                handleAddMeal(Number(mcTasteyMealOrders[i].dataset.id),i)
            }
            mcPlusCartBtns[i].classList.add('hover')
            mcMinusCartBtns[i].onclick = () => {                        
                handleRemoveMeal(Number(mcTasteyMealOrders[i]?.dataset.id),i)
            }
            setMinusHoverState(i)
        }        
    }
}

function setMinusHoverState(i) {
    if (bagQuery()) {
        const number = (weakTastey.getOrdersValue(Number(tasteyMealOrders[i]?.dataset.id)) ?? 0)
        minusCartBtns[i]?.classList.toggle('hover',number > 1)
    }
    if (miniBagQuery()) {
        const number = (weakTastey.getOrdersValue(Number(mcTasteyMealOrders[i]?.dataset.id)) ?? 0)
        mcMinusCartBtns[i]?.classList.toggle('hover',number > 1)
    }
}

function updateStates(id) {
    weakTastey.calculateCheckoutDetails(allMeals)
    setCartStates()
    setPositionStates()
    setOrderStates(id)
    setCheckoutState()
}

function handleAddMeal(id,i) {
    try {
        // #TASTEY CRUD - CU
        Tastey.addMeal(id)
        addMeal(id,allMeals,data.currency)
        updateStates(id)
        setMinusHoverState(i)
        resetBagEventListeners()                    
    } catch(err) {
        alert("Error adding a meal to bag :)")
        console.error(err)
    }
}

function handleRemoveMeal(id,i) {
    try {
        const number = (weakTastey.getOrdersValue(Number(tasteyMealOrders[i]?.dataset.id ?? mcTasteyMealOrders[i]?.dataset.id)) ?? 0)
        if(Number(number) > 1) { 
            // #TASTEY CRUD - UD
            Tastey.removeMeal(id)
            removeMeal(id)
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

//The delete function is different due to its async nature
function handleDelete(id,n) {
    try {
        if (!getCardsQuery() && document.body.classList.contains("cart")) {
            deleteMeal(id,n)
            return
        }
        let timeout
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            if (bagQuery() && getCardsQuery()) 
                removeCard(id)    
            if (miniBagQuery())
                removeMiniCard(id)
            setTimeout(() => {
                deleteMeal(id,n)
            }, removeStall)                        
        }, removeStall);
    } catch(err) {
        alert("Error removing meal from bag :)")
        console.error(err)
    }
}

//a function to clear the tastey bag
function clearCart() {
    if (bagQuery()) {
        const allTasteyMealOrders = document.querySelectorAll(".tastey-meal-order")   
        allTasteyMealOrders.forEach(order => order.remove())
        setTimeout(autoRemoveScroller,100)
    }
    if (miniBagQuery()) {
        const mcAllTasteyMealOrders = document.querySelectorAll(".mini-cart-tastey-meal-order")
        mcAllTasteyMealOrders.forEach(order => order.remove())
    }
    // #TASTEY CRUD - D
    Tastey.clearCart()
    weakTastey.calculateCheckoutDetails(allMeals)
    setCheckoutState()
    setCartStates()
    allMeals.forEach(({ id }) => setOrderStates(id))
}

//The clear cart function is a bit different due to its async nature
function handleClearCart() {   
    try{
        if (weakTastey.getEmpty()) {
            console.warn("You literally have no items in your Shopping Bag :)")
            alert("Your Shopping Bag is already empty")
            return
        }
        const isCartCleared = confirm(`You are about to remove ${Tastey.ordersInTotal} ${Tastey.ordersInTotal > 1 ? "orders" : "order"} from your Shopping Bag!`)
        if (isCartCleared) {
            if (bagQuery()) {
                if (getCardsQuery()) {
                    removeAllCards()
                    setTimeout(() => {
                        clearCart()
                    }, emptyStall);
                    return
                }
            }
            clearCart()
        }        
    } catch(err) {
        alert("Error occured while clearing bag :)")
        console.error(err)
    }
}

//a function to handle likes
function handleLikes(i) {
    try {
        if (bagQuery()) {
            tasteyMeals[i].dataset.like = tasteyMeals[i].dataset.like === "false" ? "true" : "false"
            likeIconWrappers[i].title = tasteyMeals[i].dataset.like === "false" ? "" : "Tap to like!"
            //#CRUD - CU
            Tastey.handleLikes(Number(tasteyMeals[i].dataset.id),tasteyMeals[i].dataset.like === "true")
            setLikeState(Number(tasteyMeals[i].dataset.id))
        }
    } catch(err) {
        alert("Error while accessing wishlist :)")
        console.error(err)
    }
}

function handleWishlist(likeId,i) {
    try {
        const meal = allMeals.find(meal => meal.id === likeId)
        const { label } = meal
        const like = tasteyMealOrders[i]?.dataset?.like ?? mcTasteyMealOrders[i]?.dataset?.like
        const id = Number(tasteyMealOrders[i]?.dataset?.id ?? mcTasteyMealOrders[i]?.dataset?.id)
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