export { tasteyDebouncer, tasteyThrottler, round, check, formatValue}

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
