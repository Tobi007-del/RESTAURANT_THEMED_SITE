// TODO: build a cart class to handle all cart operations

fetch('./tastey_meals.json')
.then(response => {
    if(!response.ok) {
        throw new Error(`HTTP error!. Status: ${response.status}`)
    }
    return response.json()
})
.then(data => {
    tasteyMenu(data)
    return data
})
.then(data => {
    tasteyCart(data)
    return data
})
.then((data) => {
    then(data)
}).catch((error) => {
    console.log(`%cIssue parsing data... ${error}`,"color:red")
    console.warn("Please reload page")
})


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
            <h3 class="main-menu-title">Our <span class="tastey">Tastey</span> Menu</h3>
            </span>
        </div>`
    const currency = data.currency
    //using number format API to format the price values for standardization of currency and to prevent loss
    const formatter = new Intl.NumberFormat('en', {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
    //function to round data off to a fixed decimal point depending on the number for the discount
    function round(d){
        if((d - Math.floor(d)) !== 0){
            return d.toFixed(2)
        } else {
            return d.toFixed()
        }
    }
    //function to check and apply discount to prices
    function check(price, discount) {
        if(!discount) {
            return price 
        } else {
            price -= discount/100 * price
            return price
        } 
    }

    const tasteyMeals = data.tasteyMeals
    tasteyMeals.forEach((meal,n) => {
        const product = Object.keys(meal)[0]
        const productName = product.charAt(0).toUpperCase() + product.slice(1)
        console.log(`%cBuilding ${productName} now...`,"color: green;")
        const menuSection = document.createElement('div')
        menuSection.className += `${productName}-section menu-sections`
        const menuHeader = document.createElement('div')
        menuHeader.className +=`tastey-menu-title-wrapper ${product}`
        menuHeader.innerHTML += `<h1>${productName.replace('-',' ').toUpperCase()}</h1>`
        menuSection.append(menuHeader)
        const menuContainer = document.createElement('div')
        menuContainer.className += `tastey-menu tastey-${product}`

        meal[product].forEach(({ id, label, description, price, like, picSrc}) => {
            menuContainer.innerHTML += 
                `<div class="tastey-meal" data-like="${like ?? false}">
                    <div class="tastey-meal-content">
                        <div class="tastey-meal-image" style="background-image: url('${picSrc}');">
                            <span class="tooltip-text like-tooltip">Double tap to like!</span>
                            <span class="tooltip-text unlike-tooltip">Double tap to unlike</span>
                            <span title="Tap to like!" class="heart-icon-wrapper">
                                <svg class="unliked-heart-icon" viewBox="0 -960 960 960"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/></svg>
                                <svg class="liked-heart-icon" viewBox="0 0 512 512"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>
                            </span>
                        </div>
                        <div class="product-content">
                            <div class="food-info">
                                <h2 class="food-name">${label}</h2>
                                <p class="food-description">${description}</p>
                            </div>
                            <div class="price-container">
                                <button class="add-to-cart-button" title="Add to Shopping Bag" data-id="${id}">Add to Bag</button>
                                <span class="product-price" data-discount="${price.discount ?? 0}">${formatter.format(check(price.currentValue,price.discount)).replace('NGN',"\u20A6")}</span>
                            </div>
                        </div>
                    </div>
                </div>`
        })
        menuSection.append(menuContainer)
        main.append(menuSection)
    })  
    document.body.insertBefore(main,document.getElementById("quick-scroll-wrapper"))
}


function tasteyCart(data) {
    const main = document.createElement("main")
    main.classList.add("menu")

}

function then(data){
//DOM Elements
const likeIconWrappers = document.querySelectorAll(".heart-icon-wrapper")
const tasteyMeals = document.querySelectorAll(".tastey-meal")
const tasteyMealsImages = document.querySelectorAll(".tastey-meal-image")
const toTop = document.getElementById("to-top");
const toBottom = document.getElementById("to-bottom");
const removeScrolls = document.getElementById("remove-quick-scrolls");
const quickScrollShow = document.getElementById("quick-scroll-show");
const quickScroll = document.getElementById("quick-scroll-wrapper");
const quickScrolls = document.getElementById("quick-scrolls");
const categorySwitcherContainer = document.querySelector("aside.category-switcher-container");
const switchers = document.querySelectorAll(".switcher")
const menuHeaders = document.querySelectorAll(".tastey-menu-title-wrapper h1")
const tastey = document.querySelector(".tastey")
const menuToggler = document.querySelector(".menu-toggler")
const cartToggler = document.querySelector(".cart-toggler")


menuToggler.addEventListener('click', () => {
    document.body.classList.remove("cart")
    controlActiveSwitcher(window.scrollY,[...menuHeaders])
    onscroll()
})

cartToggler.addEventListener('click', () => {
    document.body.classList.add("cart")
    onscroll()
})

class ShoppingBag {
    constructor() {
        this.items = []
        this.total = 0
    }

    addMeal(id,meal) {

    }
}








//Some utility functions for general use
const tasteyDebouncer = (mainFunction,delay=150,immediate=false) => {
    let timer;

    return function(...args) {
        let later = function(e) {
            timer = null
            if(!immediate) mainFunction(...args)
        }
        let callNow = immediate && !timer
        clearTimeout(timer)

        timer = setTimeout(later, delay)
        if(callNow) mainFunction(...args)
    }
}

const tasteyThrottler = (mainFunction,delay=10) => {
    let runTimerFlag

    return function(...args) {
        if(runTimerFlag == null) {
            mainFunction(...args)

            runTimerFlag = setTimeout(() => {
                runTimerFlag = null
            }, delay)
        }
    }
}

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
            document.body.style.setProperty("--global-light-width", "35rem")
        } else if (!entry.target.classList.contains("tastey")) {
            document.body.style.setProperty("--global-light-width", "0")
        }
    })
},options)
menuHeaders.forEach(worthy => {
    tasteyObserver.observe(worthy)
})
tasteyObserver.observe(tastey)

let starIntersecting = true;
let starInterval
let starTimeout

function starSetting(starIntersecting) {
    if(starIntersecting) {
        let index = 0, interval = 1000;
    
        const rand = (min,max) =>
            Math.floor(Math.random() * (max - min)) + min;
        
        const animate = star => {
            star.style.setProperty("--star-left", `${rand(-20,120)}%`);
            star.style.setProperty("--star-top", `${rand(-20,120)}%`);
        
            star.style.animation = "none";
            star.offsetHeight;
            star.style.animation = "";
        }
    
        for(const star of document.getElementsByClassName("magic-star")) {
            starTimeout = setTimeout(() => {
                animate(star);
                starInterval = setInterval(() => {
                    animate(star);
                }, 1000);
            }, index++ * (interval / 3))
        
        }
    } else {
        clearTimeout(starTimeout)
        clearInterval(starInterval)
        starTimeout = null
        starInterval = null
    }
}
//calling star setting at page startup
starSetting(starIntersecting)

document.querySelector("main.menu").onpointermove = e => {
    for(const card of document.getElementsByClassName("tastey-meal")){
        const rect = card.getBoundingClientRect(),
             x = e.clientX - rect.left,
             y = e.clientY - rect.top;
    
        card.style.setProperty("--mouse-x", `${x}px`); 
        card.style.setProperty("--mouse-y", `${y}px`);
    }
}

tastey.addEventListener("click", () => {
    let active = getComputedStyle(tastey).getPropertyValue("--global-light-width") == "140rem" ? true : false
    if(active) {
        document.body.style.setProperty("--global-light-width", "35rem")
    } else {
        document.body.style.setProperty("--global-light-width", "140rem")
        clickToggler = 0
    }
})

const handleLikes = (i) => {
    tasteyMeals[i].dataset.like = tasteyMeals[i].dataset.like === "false" ? "true" : "false"
    likeIconWrappers[i].title = tasteyMeals[i].classList.contains("liked") ? "" : "Tap to like!"
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

//Quick scrolls implementation
function scrollToTop() {        
    setTimeout(function () {
        window.scrollTo({
            top: 0,
        })
    }, 100);
};

function scrollToBottom() {
    setTimeout(function () {
        window.scrollTo({
            top: document.body.scrollHeight
        })
    }, 100);
}

removeScrolls.addEventListener('click', ()=>{
    quickScroll.style.display = "none";
    categorySwitcherContainer.classList.remove('show')
 })
 
 toTop.addEventListener('click', ()=>{
    scrollToTop()
 })
 
 toBottom.addEventListener('click', ()=>{
    scrollToBottom()
 })
 
 quickScrollShow.addEventListener('click', ()=>{
     quickScrolls.classList.toggle('show');
     categorySwitcherContainer.classList.toggle('show');
 })

var circle = document.getElementById("circle");
var length = circle.getTotalLength();

// The start position of the drawing
circle.style.strokeDasharray = length;
circle.style.strokeDashoffset = length;


function scrollfunction() {
  let scrollpercent = (document.body.scrollTop + document.documentElement.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight);

  let draw = length * scrollpercent;
  let angle = 180 * scrollpercent;

  quickScrollShow.style.transform = `rotate(${angle}deg)`;
  circle.style.strokeDashoffset = length - draw;
}


const onscroll = () => {
    quickScrolls.classList.remove('show');
    categorySwitcherContainer.classList.remove('show')
    const scrolledTo = window.scrollY + window.innerHeight;
    const threshold = 0;
    const isReachBottom = document.body.scrollHeight - threshold <= scrolledTo;
    const isReachTop = window.scrollY === 0;
    if (isReachBottom || isReachTop){
        quickScroll.style.display = "flex"
    }
    scrollfunction()
};

const tasteyOffSetTop = document.getElementsByClassName("tastey")[0].getBoundingClientRect().y + 213;

window.addEventListener("scroll", tasteyThrottler(function(e){
    onscroll()
    controlActiveSwitcher(window.scrollY, [...menuHeaders])
}))   


const controlActiveSwitcher = (ordinate,arr) => {
    let index = -1;
    for (const i in arr) {
        if(Math.floor(ordinate) >= Math.floor(Math.round((menuHeaders[i].getBoundingClientRect().top + window.scrollY) - tasteyOffSetTop) - (window.innerHeight/4))) {
            index ++
        }
    }
    //clamping index incase of any error
    index = Math.min(Math.max(index,0),arr.length - 1)
    markSwitcher(index)
}

const scrollContentTo = (ordinate) => {
    window.scrollTo(0,ordinate)
}

let scrollPosition;
switchers.forEach((switcher,i) => {
    switcher.addEventListener('click', () => { 
        scrollPosition = Math.round((menuHeaders[i].getBoundingClientRect().top + window.scrollY) - tasteyOffSetTop)
        scrollContentTo(scrollPosition)
    })
})

const markSwitcher = (id) => {
    switchers.forEach(switcher => switcher.classList.remove("active"))
    switchers[id].classList.add("active")
}

}

