export { tasteyThrottler, tasteyDebouncer, round, check, formatValue, standardize, clamp, isIterable, panning, scrollContentTo, syncScrollToBottom, syncScrollToTop, remToPx, pxToRem, rand, positionGradient, stars, write, erase }

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
            if (this.timerFlag === null) mainFunction(...args)
            this.timerFlag = setTimeout(() => this.timerFlag = null, this.delay)
        }                    
    }
}

function rand(min,max) {return (Math.floor(Math.random() * (max - min)) + min)}

function remToPx(value) {return (parseFloat(getComputedStyle(document.documentElement).fontSize) * value)}

function pxToRem(value) {return (value / parseFloat(getComputedStyle(document.documentElement).fontSize))}

//function to round data off to a fixed decimal point depending on the number for the discount
function round(d) {
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

//using number format API to format the price values for standardization of currency and to prevent loss
function formatter(curr) {
    return new Intl.NumberFormat('en', {
        style: "currency",
        currency: curr,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}

function formatValue(currency, price) {return formatter(currency).format(price).replace('NGN',"\u20A6")}

function standardize(C, manner = "use ease"){
    //using number format API to format the number values
    const WN = new Intl.NumberFormat('en',{
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })
    const FO = new Intl.NumberFormat('en',{
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
    })
    if (manner === "use ease") {
        return `${WN.format(C)}`
    } else {
        const th = C/1000,
        m = C/1000000,
        b = C/1000000000,
        tr = C/1000000000000
        if(th < 1) 
            return `${WN.format(C)}`;
        else if((th >= 1) && (m < 1)) 
            if((th - Math.floor(th)) !== 0) 
                return `${FO.format(th)}K`
            else 
                return `${WN.format(th)}K`
        else if((m >= 1) && (b < 1)) 
            if((m - Math.floor(m)) !== 0)
                return `${FO.format(m)}M`
            else 
                return `${WN.format(m)}M`
        else if((b >= 1) && (tr < 1)) 
            if((b - Math.floor(b)) !== 0)
                return `${FO.format(b)}B`
            else
                return `${WN.format(b)}B`     
        else if(tr >= 1)
            if((tr - Math.floor(tr)) !== 0)
                return `${FO.format(tr)}T`
            else 
                return `${WN.format(tr)}T`
    }
}

function clamp(min, amount, max) {return Math.min(Math.max(amount, min), max)}

function scrollContentTo(value, behavior="smooth", parent = document.documentElement, orientation = "vertical") {
    switch(orientation) {
        case "horizontal":
            parent.scrollTo({
                left: value,
                behavior: behavior
            })
        break 
        default: 
            parent.scrollTo({
                top: value,
                behavior: behavior
            })
    }
}

function syncScrollToTop(behavior = "smooth", parent = document.documentElement) { 
    parent.scrollTo({
        top: 0,
        behavior: behavior
    })
}

function syncScrollToBottom(behavior = "smooth", parent = document.documentElement) {      
    parent.scrollTo({
        top: parent.scrollHeight,
        behavior: behavior
    })
}

function isIterable(obj) {  
    return obj !== null && obj !== undefined && typeof obj[Symbol.iterator] === 'function';  
}

//A function to handle panning of images
function panning(elements) {
    if (isIterable(elements)) {
        for (const element of elements) {
            pan(element)
        }
    } else {
        pan(elements)
    }
    function pan(element) {
        element.style.cursor = "move"
        element.style.objectFit = "cover"
        element.style.objectPosition = "0% 0%"
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
        star.style.setProperty("--star-left", `${rand(-20,120)}%`)
        star.style.setProperty("--star-top", `${rand(-20,120)}%`)
    
        star.style.animation = "none"
        star.offsetHeight
        star.style.animation = ""
    }

    for(const star of stars) {
        setTimeout(() => {
            animate(star)
            setInterval(() => {
                animate(star)
            }, 1000);
        }, index++ * (interval / 3))
    }
}

function write(text, parent, stall = 100) {
    let n = 0
    write()
    function write() {
        if (n < text.length) {
            parent.textContent += text[n]
            n++
            setTimeout(write, stall)
        }
    }
}

function erase(parent, stall = 100) {
    let n = parent.textContent.length
    cancel()
    function cancel() {
        if (n > 0) {
            parent.textContent = parent.textContent.slice(0,-1)
            n--
            setTimeout(cancel, stall)
        }
    }
}