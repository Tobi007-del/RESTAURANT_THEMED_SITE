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

let isIntersecting = true;

const tasteyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        
    })
},options)

const tasteyDebouncer = (mainFunction,delay=10,immediate=false) => {
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
        if(runTimerFlag === null) {
            mainFunction(...args)

            runTimerFlag = setTimeout(() => {
                runTimerFlag = null
            }, delay)
        }
    }
}


if(isIntersecting) {
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
        setTimeout(() => {
            animate(star);
            setInterval(() => {
                animate(star);
            }, 1000);
        }, index++ * (interval / 3))
    
    }
}

document.getElementsByTagName("main")[0].onmousemove = e => {
    for(const card of document.getElementsByClassName("tastey-meal")){
        const rect = card.getBoundingClientRect(),
             x = e.clientX - rect.left,
             y = e.clientY - rect.top;
    
        card.style.setProperty("--mouse-x", `${x}px`); 
        card.style.setProperty("--mouse-y", `${y}px`);
    }
}

window.onmousemove = e => {
    if(e.target.closest('.tastey') !== null) {
        document.body.style.setProperty("--global-light-width", "50rem")
    } else {
        document.body.style.setProperty("--global-light-width", "35rem")
    }
}

window.onmouseout = e => {
    document.body.style.setProperty("--global-light-width", "25rem")
}


const likeIconWrappers = document.querySelectorAll(".heart-icon-wrapper")
const tasteyMeals = document.querySelectorAll(".tastey-meal")
const tasteyMealsImages = document.querySelectorAll(".tastey-meal-image")

const handleLikes = (i) => {
    tasteyMeals[i].classList.toggle('liked',!tasteyMeals[i].classList.contains("liked"))
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




function pager(){
const toTop = document.getElementById("to-top");
const toBottom = document.getElementById("to-bottom");
const removeScrolls = document.getElementById("remove-quick-scrolls");
const quickScrollShow = document.getElementById("quick-scroll-show");
const quickScroll = document.getElementById("quick-scroll-wrapper");
const quickScrolls = document.getElementById("quick-scrolls");

removeScrolls.addEventListener('click', ()=>{
   quickScroll.style.display = "none";
})

toTop.addEventListener('click', ()=>{
   scrollToTop()
})

toBottom.addEventListener('click', ()=>{
   scrollToBottom()
})

quickScrollShow.addEventListener('click', ()=>{
    quickScrolls.classList.toggle('show');
})

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


function pageBottom () {
    const onscroll = () => {
      quickScrolls.classList.remove('show');
      const scrolledTo = window.scrollY + window.innerHeight;
      const threshold = 0;
      const isReachBottom = document.body.scrollHeight - threshold <= scrolledTo;
      const isReachTop = window.scrollY === 0;
      if (isReachBottom || isReachTop){
        quickScroll.style.display = "flex";
      }
      scrollfunction()
    };
      
      window.addEventListener("scroll", onscroll);    
  }
 
pageBottom();
}
pager()