export { tasteyDebouncer, tasteyThrottler, round, check, formatValue, clamp, panning, scrollContentTo, scrollToTop, scrollToBottom, remToPx, pxToRem, rand }

//Some utility functions for general use
const rand = (min,max) => Math.floor(Math.random() * (max - min)) + min;

const remToPx = (value) => {return (parseFloat(getComputedStyle(document.documentElement).fontSize) * value)}

const pxToRem = value => {return (value / parseFloat(getComputedStyle(document.documentElement).fontSize))}

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
    window.scrollTo(0,ordinate)
}

function scrollToTop(behavior = "smooth") {        
    setTimeout(function () {
        window.scrollTo({
            top: 0,
            behavior: behavior
        })
    }, 100);
};

function scrollToBottom(behavior = "smooth") {
    setTimeout(function () {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: behavior
        })
    }, 100);
}

//A function to handle panning of images
function panning(elements) {
    for (const element of elements) {
        element.dataset.xPointerDownAt = "0"
        element.dataset.xPrevPercentage = "0"
        element.dataset.yPointerDownAt = "0"
        element.dataset.yPrevPercentage = "0"
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