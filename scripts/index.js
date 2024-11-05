import { scrollContentTo, tasteyThrottler } from "./utility-functions.js"


window.addEventListener("load", function() { 
    setTimeout(carousel)
})

function carousel() {
//The vanilla javascript for the home page sliding carousel, a near perfect implementation
const tasteyMealsCarousel = document.querySelector(".tastey-meals-carousel"),
carouselContainer = tasteyMealsCarousel.parentElement,
tasteyMeals = document.querySelectorAll(".tastey-meal"),
togglers = document.querySelectorAll(".toggler"),
fwdArrow = document.querySelector(".fwd-arrow"),
bwdArrow = document.querySelector(".bwd-arrow")

let offsetWidth = tasteyMeals[0].offsetWidth || window.innerWidth

const interval = 2500,
nClonedSlides = 1,
nSlides = tasteyMeals.length,

currentSlideIndex = () => {
    return Math.round(tasteyMealsCarousel.scrollLeft/offsetWidth - nClonedSlides) 
},

scrollCarouselTo = index => {
    scrollContentTo(offsetWidth * (index + nClonedSlides), "smooth", tasteyMealsCarousel, "horizontal")
},

markToggler = index => {
    togglers[index].classList.add('active')
    togglers[index].setAttribute('aria-disabled', 'true')
},

updateToggler = () => {
    const c = currentSlideIndex()
    if (c < 0 || c >= nSlides) return
    markToggler(c)
}

for(let i = 0; i < nSlides; i++) {
    togglers[i].addEventListener('click', () => scrollCarouselTo(i))
}

let scrollTimer
tasteyMealsCarousel.addEventListener('scroll', e => {
    // reset togglers
    togglers.forEach(toggler => {
        toggler.classList.remove('active')
        toggler.setAttribute('aria-disabled','false')
    })
    //handle infinite scrolling
    //debouncing to prevent the scroll event from glitching carousel
    if (scrollTimer) clearTimeout(scrollTimer)
    scrollTimer = setTimeout(() => {
        if (e.target.scrollLeft < offsetWidth * (nClonedSlides - 1/2)) 
            forward()
        if (e.target.scrollLeft > offsetWidth * ((nSlides - 1 + nClonedSlides) + 1/2)) 
            rewind()
    }, 100)
    //update the toggler
    updateToggler()
})

//Infinite scrolling
const firstSlideClone = tasteyMeals[0].cloneNode(true)
firstSlideClone.setAttribute('aria-hidden','true')
tasteyMealsCarousel.append(firstSlideClone)

const lastSlideClone = tasteyMeals[nSlides - 1].cloneNode(true)
lastSlideClone.setAttribute('aria-hidden', 'true')
tasteyMealsCarousel.prepend(lastSlideClone)


function rewind() {
    setTimeout(() => {
        scrollContentTo((offsetWidth * nClonedSlides), "instant", tasteyMealsCarousel, "horizontal")
    }, 100)
}

function forward() {
    setTimeout(() => {
        scrollContentTo(offsetWidth * (nSlides - 1 + nClonedSlides), "instant", tasteyMealsCarousel, "horizontal")
    }, 100)
}

//Autoplay 
function next() {
    scrollCarouselTo(currentSlideIndex() + 1)
}
function previous () {
    scrollCarouselTo(currentSlideIndex() - 1)
}

let itv
function play() {
    //returns if the prefers reduced motion
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) 
        return
    clearInterval(itv)
    tasteyMealsCarousel.setAttribute("aria-live","off")
    itv = setInterval(next, interval)
}
function stop() {
    clearInterval(itv)
    tasteyMealsCarousel.setAttribute("aria-live","polite")
}

let carouselInView = true
const observer = new IntersectionObserver(entries => {
    entries.forEach((entry) => {
        if(entry.isIntersecting) {
            play()       
            carouselInView = true
        } else {
            stop()
            carouselInView = false
        }
    })
}, {threshold:[0,.2,.4,.6,.8,1]})
observer.observe(carouselContainer)

//for mouse support
carouselContainer.addEventListener("mouseenter", stop)
carouselContainer.addEventListener("mouseleave", play)
//for keyboard accessibilty
carouselContainer.addEventListener("focus", stop, true)
carouselContainer.addEventListener("blur", () => {
    if(carouselContainer.matches(":hover")) return
    play()
}, true)
//for extra touchscreen support
carouselContainer.addEventListener("touchstart", stop, true)
carouselContainer.addEventListener("touchend", play, true)

scrollCarouselTo(0)
markToggler(0)     
if (carouselInView)
    setTimeout(play, 1000)

fwdArrow.addEventListener('click', next)

bwdArrow.addEventListener('click', previous)

//adding the arrows functionality to the carousel
const keyThrottler = new tasteyThrottler
let keyTimer
document.addEventListener('keydown', keyThrottler.throttle(function(e) {
    if (carouselInView) {
        const tagName = document.activeElement.tagName.toLowerCase()
        if (tagName  === "input") return
        if (keyTimer) clearTimeout(keyTimer)
            stop()
        keyTimer = setTimeout(play, 2000)
        switch(e.key.toLowerCase()) {
            case "arrowright" :
                next()
                break
            case "arrowleft" :
                previous()
                break
        }
    }
}), 100)

const resizeDebouncer = (delay=400, immediate=false) => {
    //for autoplay/pause
    offsetWidth = tasteyMeals[0].offsetWidth

    let resizeTimer

    let later = function(e) {
        resizeTimer = null
        if(!immediate) play()
    }

    let callNow = immediate && !resizeTimer
    clearTimeout(resizeTimer)
    stop()

    resizeTimer = setTimeout(later, delay)
    if(callNow) play()
}

window.addEventListener('resize', resizeDebouncer)
}