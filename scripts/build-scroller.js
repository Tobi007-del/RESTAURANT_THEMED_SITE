import { tasteyThrottler } from "./utility-functions.js"
export { autoRemoveScroller, quickScrollShow, quickScrolls, scrollToTop }

(function buildScroller() {
    const scroller = document.createElement('div')
    scroller.id = "quick-scroll-wrapper"
    scroller.innerHTML += 
    `
            <div id = "scroller-circle">
                <svg id="scroll-circle" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                    <path fill="none" stroke-width = "5" id="circle" d ="M2.5 50 a 46,46 0 1,1 95,0 a 46,46 0 1,1 -95,0"/>
                </svg>
            </div>
            <button type="button" title="Open Quick scroller" id = "quick-scroll-show">
                <svg viewBox="0 0 320 512">
                    <path d="M182.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-96 96c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L128 109.3l0 293.5L86.6 361.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l96 96c12.5 12.5 32.8 12.5 45.3 0l96-96c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 402.7l0-293.5 41.4 41.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-96-96z"/>
                </svg>
            </button>
            <div id = "quick-scrolls">
            <button type="button" id = "to-top" title = "scroll to top">
                <svg viewBox="0 0 384 512">
                    <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2 160 448c0 17.7 14.3 32 32 32s32-14.3 32-32l0-306.7L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"/>
                </svg>
            </button>
            <button type="button" id = "remove-quick-scrolls" title = "Remove quick scroller">
                <svg viewBox="0 0 384 512">
                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                </svg>
            </button>
            <button type="button" id = "to-bottom" title = "scroll to bottom">
                <svg viewBox="0 0 384 512">
                    <path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/>
                </svg>
            </button>
        </div>
    `
    document.body.appendChild(scroller)
})()

const toTop = document.getElementById("to-top"),
toBottom = document.getElementById("to-bottom"),
removeScrolls = document.getElementById("remove-quick-scrolls"),
quickScrollShow = document.getElementById("quick-scroll-show"),
quickScroll = document.getElementById("quick-scroll-wrapper"),
quickScrolls = document.getElementById("quick-scrolls")


//Quick scrolls implementation
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
    autoRemoveScroller()
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

function onscroll() {
    quickScrolls.classList.remove('show');
    const scrolledTo = window.scrollY + window.innerHeight;
    const threshold = 0;
    const isReachBottom = document.body.scrollHeight - threshold <= scrolledTo;
    const isReachTop = window.scrollY === 0;
    if (isReachBottom || isReachTop){
        quickScroll.style.display = "flex"
    }
    scrollfunction()
}


window.addEventListener("scroll", tasteyThrottler(() => {
    onscroll()
}))   

//window event listeners
window.addEventListener("resize", () => {
    autoRemoveScroller()
})

//a function to remove the scroller when necessary
function autoRemoveScroller() {
    const difference = document.documentElement.scrollHeight - window.innerHeight
    setTimeout(() => {
        if (Number(difference) == 0) {
            quickScroll.style.display = "none"
        } else {
            quickScroll.style.display = "flex"
        }
    }, 5);
}

