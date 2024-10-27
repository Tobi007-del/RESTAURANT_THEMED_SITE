//The javascript for the home page sliding carousel, a near perfect implementation

const tasteyMealsCarousel = document.querySelector(".tastey-meals-carousel")
const carouselContainer = tasteyMealsCarousel.parentElement
const tasteyMeals = document.querySelectorAll(".tastey-meal")
const togglers = document.querySelectorAll(".toggler")
const fwdArrow = document.querySelector(".fwd-arrow")
const bwdArrow = document.querySelector(".bwd-arrow")

let offsetWidth = tasteyMeals[0].offsetWidth

const interval = 2500,
nClonedSlides = 1,
nSlides = tasteyMeals.length,

currentSlideIndex = () => {
    return Math.round(tasteyMealsCarousel.scrollLeft/offsetWidth - nClonedSlides) 
},

scrollCarouselTo = (index) => {
    tasteyMealsCarousel.scrollTo(offsetWidth * (index + nClonedSlides),0)
},

markToggler = (index) => {
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
tasteyMealsCarousel.addEventListener('scroll', () => {
    // reset
    togglers.forEach(toggler => {
        toggler.classList.remove('active')
        toggler.setAttribute('aria-disabled','false')
    })
    //handle infinite scrolling
    //debouncing to prevent the scroll event from glitching carousel
    if (scrollTimer) clearTimeout(scrollTimer)
    scrollTimer = setTimeout(() => {
        if (tasteyMealsCarousel.scrollLeft < offsetWidth * (nClonedSlides - 1/2)) {
            forward()
        } 
        if (tasteyMealsCarousel.scrollLeft > offsetWidth * ((nSlides - 1 + nClonedSlides) + 1/2)) {
            rewind()
        }
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
    tasteyMealsCarousel.classList.remove('smooth-scroll')
    setTimeout(() => {
        tasteyMealsCarousel.scrollTo(offsetWidth * nClonedSlides,0)
        tasteyMealsCarousel.classList.add('smooth-scroll')
    }, 100)
}

function forward() {
    setTimeout(() => {
        tasteyMealsCarousel.classList.remove('smooth-scroll')
        tasteyMealsCarousel.scrollTo(offsetWidth * (nSlides - 1 + nClonedSlides),0)
        tasteyMealsCarousel.classList.add('smooth-scroll')
    }, 100)
}

//Autoplay 
function next() {
    scrollCarouselTo(currentSlideIndex()+1)
}
function previous () {
    scrollCarouselTo(currentSlideIndex()-1)
}

let itv
function play() {
    //returns if the prefers reduced motion
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    clearInterval(itv)
    tasteyMealsCarousel.setAttribute("aria-live","off")
    itv = setInterval(next, interval);
}
function stop() {
    clearInterval(itv)
    tasteyMealsCarousel.setAttribute("aria-live","polite")
}

let carouselInView = true
const observer = new IntersectionObserver(callback, {threshold:0.99})
observer.observe(carouselContainer)
function callback(entries) {
    entries.forEach((entry) => {
        if(entry.isIntersecting) {
            play()       
            carouselInView = true
        } else {
            stop()
            carouselInView = false
        }
    })
}

carouselContainer.addEventListener("pointerenter", () => {
    stop()
})
carouselContainer.addEventListener("pointerleave", () => {
    play()
})
//for keyboard accessibilty
carouselContainer.addEventListener("focus", () => {
    stop()
}, true)
carouselContainer.addEventListener("blur", () => {
    if(carouselContainer.matches(":hover")) return
    play()
}, true)
//for touch screen devices
tasteyMealsCarousel.addEventListener("touchstart", () => {
    stop()
},{passive:true})
tasteyMealsCarousel.addEventListener("touchcancel", () => {
    play()
},{passive:true})

scrollCarouselTo(0)
markToggler(0)
tasteyMealsCarousel.classList.add('smooth-scroll')

fwdArrow.addEventListener('click', next)

bwdArrow.addEventListener('click', previous)

//adding the arrows functionality to the carousel
const throttleKeyPresses = (mainFunction,delay=100) => {
    let runTimerFlag = null

    return function(...args) {
        if(runTimerFlag === null) {
            mainFunction(...args)
            runTimerFlag = setTimeout(() => {
                runTimerFlag = null
            }, delay)
        }
    }
}

document.addEventListener('keydown', throttleKeyPresses(function(e) {
    if (carouselInView) {
        const tagName = document.activeElement.tagName.toLowerCase()
        if(tagName  === "input") return

        switch(e.key.toLowerCase()) {
            case "arrowright" :
                next()
                break
            case "arrowleft" :
                previous()
                break
        }
    }
}))

const resizeDebouncer = (delay=400,immediate=false) => {
    //for autoplay
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

let resizeTimer 
window.addEventListener('resize', resizeDebouncer)

