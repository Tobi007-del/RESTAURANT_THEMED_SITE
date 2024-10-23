export { tasteyThrottler, tasteyDebouncer, round, check, formatValue, clamp, panning, scrollContentTo, asyncScrollToBottom, asyncScrollToTop, syncScrollToBottom, syncScrollToTop, remToPx, pxToRem, rand, positionGradient, stars }

//Some utility functions for general use
class tasteyDebouncer {
    constructor() {
        this.timerFlag = null
        this.callNow = null
        this.later = null
        this.delay = null
    }

    debounce(mainFunction, delay = 100, immediate = false) {
        this.delay = delay
        return (...args) => {
            this.later = () => {
                this.timerFlag = null
                if(!immediate) mainFunction(...args)
            }
            this.callNow = immediate && !this.timerFlag
            clearTimeout(this.timerFlag)
    
            this.timerFlag = setTimeout(this.later, this.delay)
            if(this.callNow) mainFunction(...args)
        }
    }
}

class tasteyThrottler {
    constructor() {
        this.timerFlag = undefined
        this.delay = null
    }

    throttle(mainFunction, delay = 50) {
        this.delay = delay
            
        return (...args) => {
            if (this.timerFlag === null) {
                mainFunction(...args)
            }
            this.timerFlag = setTimeout(() => this.timerFlag = null, this.delay)
        }                    
    }
}

const rand = (min,max) => Math.floor(Math.random() * (max - min)) + min;

const remToPx = (value) => {return (parseFloat(getComputedStyle(document.documentElement).fontSize) * value)}

const pxToRem = value => {return (value / parseFloat(getComputedStyle(document.documentElement).fontSize))}

//function to round data off to a fixed decimal point depending on the number for the discount
const round = (d) => {
    if((d - Math.floor(d)) !== 0){
        return d.toFixed(2)
    } else {
        return d.toFixed()
    }
}
//function to check and apply discount to prices
const check = (price, discount) => {
    if(!discount) {
        return price 
    } else {
        price -= discount/100 * price
        return price
    } 
}

//using number format API to format the price values for standardization of currency and to prevent loss
const formatter = (curr) => {
    return new Intl.NumberFormat('en', {
        style: "currency",
        currency: curr,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}


const formatValue = (currency, price) => {
        return formatter(currency).format(price).replace('NGN',"\u20A6")            
}

const clamp = (min, amount, max) => {
    return Math.min(Math.max(amount, min), max)
}

function scrollContentTo(ordinate) {
    document.documentElement.scrollTo(0,ordinate)
}

function asyncScrollToTop(behavior = "smooth", delay = 0) {        
    setTimeout(function () {
        document.documentElement.scrollTo({
            top: 0,
            behavior: behavior
        })
    }, delay);
};

function asyncScrollToBottom(behavior = "smooth", delay = 0) {
    setTimeout(function () {
        document.documentElement.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: behavior
        })
    }, delay);
}

function syncScrollToTop(behavior = "smooth") { 
    document.documentElement.scrollTo({
        top: 0,
        behavior: behavior
    })
}

function syncScrollToBottom(behavior = "smooth") {      
    document.documentElement.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: behavior
    })
}

//A function to handle panning of images
function panning(elements) {
    for (const element of elements) {
        element.dataset.xPointerDownAt = 0
        element.dataset.xPrevPercentage = 0
        element.dataset.yPointerDownAt = 0
        element.dataset.yPrevPercentage = 0
        element.onpointerenter = e => {
            element.dataset.xPointerDownAt = e.clientX
            element.dataset.yPointerDownAt = e.clientY
        }
        element.onpointerleave = () => {
            element.dataset.xPointerDownAt = 0
            element.dataset.yPointerDownAt = 0
            element.dataset.xPrevPercentage = element.dataset.xPercentage
            element.dataset.yPrevPercentage = element.dataset.yPercentage
        }
        element.onpointermove = e => {
            let xPointerDelta = e.clientX - parseFloat(element.dataset.xPointerDownAt),
            yPointerDelta = e.clientY - parseFloat(element.dataset.yPointerDownAt),
            xMaxDelta = element.offsetWidth,
            yMaxDelta = element.offsetHeight,
            xp = (xPointerDelta / xMaxDelta) * 100,
            yp = (yPointerDelta / yMaxDelta) * 100,
            xNextPercentage = parseFloat(element.dataset.xPrevPercentage) + xp,
            yNextPercentage = parseFloat(element.dataset.yPrevPercentage) + yp
            xNextPercentage = clamp(-50,xNextPercentage,0)
            yNextPercentage = clamp(-50,yNextPercentage,0)
            element.dataset.xPercentage = xNextPercentage
            element.dataset.yPercentage = yNextPercentage
            element.animate({
                objectPosition: `${xNextPercentage * -2}% ${yNextPercentage * -2}%`
            },{duration: 100,fill:"forwards"})
        }
    }
}

function positionGradient(event,card) {
    const rect = card.getBoundingClientRect(),
             x = event.clientX - rect.left, 
             y = event.clientY - rect.top
    card.style.setProperty("--mouse-x", `${x}px`)
    card.style.setProperty("--mouse-y", `${y}px`)
}

function stars(stars) {
    let index = 0, interval = 1000;

    const animate = star => {
        star.style.setProperty("--star-left", `${rand(-20,120)}%`);
        star.style.setProperty("--star-top", `${rand(-20,120)}%`);
    
        star.style.animation = "none";
        star.offsetHeight;
        star.style.animation = "";
    }

    for(const star of stars) {
        setTimeout(() => {
            animate(star);
            setInterval(() => {
                animate(star);
            }, 1000);
        }, index++ * (interval / 3))
    }
}