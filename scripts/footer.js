import { allMeals, currency, maxOrders, handleAddMeal, getDOMElements } from "./CRUD.js"
import { Tastey } from "./TasteyManager.js"
import { tasteyThrottler, check, formatValue, standardize, panning, scrollContentTo, remToPx, tasteyDebouncer } from "./utils.js"

tasteyFooterMenu()

function tasteyFooterMenu() {
    const offersContainer = document.createElement('div')
    offersContainer.className = "offers-container"
    offersContainer.innerHTML = 
    `
        <button type="button" title=" " class="footer-arrow-container offer-previous-arrow disabled">
            <svg class="left-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
        </button>
        <button type="button" title="Scroll Right" class="footer-arrow-container offer-next-arrow">
            <svg class="right-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"/></svg>
        </button>
    `
    const menuContainer = document.createElement("div")
    menuContainer.className = "offers-imgs-wrapper"
    allMeals.forEach(({ id, label, price, picSrc }) => {
        if (price.discount !== null) {
            const orders = Tastey.getOrdersValue(id)
            menuContainer.innerHTML += 
            `
                <div class="footer-tastey-meal" data-id="${id}">
                    <a href="menu.html" title="Open Menu" data-discount="${price.discount ?? 0}">
                        <img src="${picSrc}" loading="lazy" alt="Image of ${label}" title="${label}" class="offer-image">
                    </a>
                    <p>${formatValue(currency,check(price.currentValue,price.discount))}</p>
                    <button type="button" title="Add ${label} to Bag" class="footer-add-to-cart-button ${orders >= maxOrders ? "disabled" : ""}" data-id="${id}" data-orders="${standardize(orders)}" tabindex="${orders >= maxOrders ? -1 : 0}">Add to Bag</button>
                </div>
            `
        }
    })
    offersContainer.appendChild(menuContainer)
    document.querySelector(".footer-special-section > a").insertAdjacentElement('afterend', offersContainer)
}

//DOM operations
getDOMElements()

const footerAddToCartBtns = document.querySelectorAll(".footer-add-to-cart-button"), 
footerSpecialSection = document.querySelector(".footer-special-section"),
offersImgsWrapper = document.querySelector(".offers-imgs-wrapper"), 
offerPrevArrow = document.querySelector(".offer-previous-arrow"),
offerNextArrow = document.querySelector(".offer-next-arrow")

panning(document.querySelectorAll('.offer-image'))

document.querySelector(".view-bag").addEventListener("click", () => sessionStorage.open_cart = true)

footerAddToCartBtns.forEach(btn => btn.onclick = e => handleAddMeal(e.target.dataset.id))

let footerItv, footerInView = false, footerInterval = 2000
const offerGap = remToPx(.6)

offerPrevArrow.addEventListener('click', previousOffer)
offerNextArrow.addEventListener('click', nextOffer)

const offersScrollDebouncer = new tasteyDebouncer
offersImgsWrapper.addEventListener('scroll', offersScrollDebouncer.debounce(arrowSetting))

function arrowSetting() {
    offerPrevArrow.classList.toggle('disabled', (offersImgsWrapper.scrollLeft === 0))
    offerPrevArrow.title = (offersImgsWrapper.scrollLeft === 0) ? " " : "Scroll Left"
    offerNextArrow.classList.toggle('disabled', (offersImgsWrapper.scrollLeft > (offersImgsWrapper.scrollWidth - offersImgsWrapper.parentElement.getBoundingClientRect().width - offerGap)))
    offerNextArrow.title = (offersImgsWrapper.scrollLeft > (offersImgsWrapper.scrollWidth - offersImgsWrapper.parentElement.getBoundingClientRect().width - offerGap)) ? " " : "Scroll Right"
}

const footerObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            playOffers()       
            footerInView = true
        } else {
            stopOffers()
            footerInView = false
        } 
    })
}, {threshold:[0,.2,.4,.6,.8,1]})
footerObserver.observe(footerSpecialSection)

function playOffers() {
    //returns if the prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
        return
    clearInterval(footerItv)
    footerItv = setInterval(() => {
        nextOffer() 
        const value = 0
        if ((offersImgsWrapper.scrollLeft + offersImgsWrapper.parentElement.getBoundingClientRect().width) > (offersImgsWrapper.scrollWidth - (document.querySelectorAll(".footer-tastey-meal")[0].getBoundingClientRect().width))) scrollContentTo(value, "instant", offersImgsWrapper, "horizontal")
    }, footerInterval)
}

function stopOffers() {
    clearInterval(footerItv)
}

function nextOffer() {
    const value = document.querySelectorAll(".footer-tastey-meal")[0].getBoundingClientRect().width + offerGap + offersImgsWrapper.scrollLeft
    scrollContentTo(value, "smooth", offersImgsWrapper, "horizontal")
}

function previousOffer() {
    const value = offersImgsWrapper.scrollLeft - document.querySelectorAll(".footer-tastey-meal")[0].getBoundingClientRect().width - offerGap 
    scrollContentTo(value, "smooth", offersImgsWrapper, "horizontal")
}

//for both mouse and touch screen support
offersImgsWrapper.parentElement.addEventListener("mouseenter", stopOffers)
offersImgsWrapper.parentElement.addEventListener("mouseleave", playOffers)
offersImgsWrapper.addEventListener("focus", stopOffers, true)
offersImgsWrapper.addEventListener("blur", () => {
    if (footerSpecialSection.matches(":hover")) return
    playOffers()
}, true)
let touchTimer;
//for extra touchscreen support
offersImgsWrapper.parentElement.addEventListener("touchstart", () => {
    stopOffers()
    if (touchTimer) clearTimeout(touchTimer)
}, {useCapture: true, passive: true})
offersImgsWrapper.parentElement.addEventListener("touchend", () => {
    touchTimer = setTimeout(() => {
        if (offersImgsWrapper.matches(':hover')) return
        playOffers()
    }, 2000)
}, {useCapture: true, passive: true})

//adding the arrows functionality to the carousel
const keyThrottler = new tasteyThrottler
let footerKeyTimer
document.addEventListener('keydown', keyThrottler.throttle(function(e) {
    if (footerInView) {
        const tagName = document.activeElement.tagName.toLowerCase()
        if(tagName  === "input") return
        if (footerKeyTimer) clearTimeout(footerKeyTimer)
        stopOffers()
        footerKeyTimer = setTimeout(playOffers, 2000)
        switch(e.key.toLowerCase()) {
            case "arrowright" :
                nextOffer()
                break
            case "arrowleft" :
                previousOffer()
                break
        }
    }
}), 100)