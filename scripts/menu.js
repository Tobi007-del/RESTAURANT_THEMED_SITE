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

const tasteyOffSetTop = document.getElementsByClassName("tastey")[0].getBoundingClientRect().y;

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


const tasteyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        
    })
},options)

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

document.getElementsByTagName("main")[0].onpointermove = e => {
    for(const card of document.getElementsByClassName("tastey-meal")){
        const rect = card.getBoundingClientRect(),
             x = e.clientX - rect.left,
             y = e.clientY - rect.top;
    
        card.style.setProperty("--mouse-x", `${x}px`); 
        card.style.setProperty("--mouse-y", `${y}px`);
    }
}

document.querySelector(".tastey").addEventListener("click", () => {
    let active = getComputedStyle("tastey").getPropertyValue("--global-light-width") == "140rem" ? true : false
    console.log(active)
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

  // Reverse the drawing (when scrolling upwards)
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
      
window.addEventListener("scroll", tasteyThrottler(function(e){
    onscroll()
    controlActiveSwitcher(window.scrollY,menuHeadersPosition)
}))   

let menuHeadersPosition = []
let index;

const controlActiveSwitcher = (ordinate,arr) => {
    index = -1;
    for (const item of arr) {
        if(Math.floor(ordinate) >= Math.floor(item - (window.innerHeight/4))) {
            index ++
        }
    }
    //clamping index incase of any error
    index = Math.min(Math.max(index,0),arr.length - 1)
    markSwitcher(index)
}

window.addEventListener('resize', () => {
    menuHeadersPosition.splice(0,menuHeadersPosition.length)
    menuHeadersPosition.length = 0
    getHeaderPositions(menuHeadersPosition)
})

const scrollContentTo = (ordinate) => {
    window.scrollTo(0,ordinate)
}

const getHeaderPositions = (arr) => {
menuHeaders.forEach(menuHeader => {
    arr.push(Math.round((menuHeader.getBoundingClientRect().top + window.scrollY) - tasteyOffSetTop))
})
}
getHeaderPositions(menuHeadersPosition)

let scrollPosition;
switchers.forEach((switcher,i) => {
    switcher.addEventListener('click', () => {
        scrollPosition = menuHeadersPosition[i]
        scrollContentTo(scrollPosition)
    })
})

const markSwitcher = (id) => {
    switchers.forEach(switcher => switcher.classList.remove("active"))
    switchers[id].classList.add("active")
}
