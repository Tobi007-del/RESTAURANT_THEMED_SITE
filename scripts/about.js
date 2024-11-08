// archive data import
import Archives from './fetch-archives.js'
import { panning, remToPx, tasteyThrottler } from './utility-functions.js'

window.addEventListener('load', () => {
    setTimeout(timelineLength, 100)
    setTimeout(archiveUI, 100)
})

const archiveContentWrapper = document.querySelector(".archives-content-wrapper")
Archives.forEach(({ year, imgSrc, event, description }) => {
archiveContentWrapper.innerHTML += 
`
                <div class="archive">
                    <div class="archive-content">
                        <div class="archive-time-wrapper">
                            <h4>${year}</h4>
                        </div>
                        <div class="archive-img-wrapper">
                            <img src="${imgSrc}">
                        </div>
                        <div class="archive-text-wrapper">
                            <h2>${event}</h2>
                            <p>${description}</p>
                        </div>
                    </div>
                </div>    
`
})

const archives = document.querySelectorAll(".archive-content")

const scrollThrottler = new tasteyThrottler
window.addEventListener('scroll', scrollThrottler.throttle(archiveUI))

function archiveUI() {
    archives.forEach(archive => {
        if ((archive.getBoundingClientRect().top < (window.innerHeight - remToPx(10))) && (archive.getBoundingClientRect().top > remToPx(1))) {
            setTimelinePosition(archive.querySelector(".archive-time-wrapper h4"))
            archive.classList.add("visible")
        } else {
            archive.classList.remove("visible")
        }
    }) 
}

const timeline = document.querySelector(".tastey-timeline")
function setTimelinePosition(header) {
    const headerPosition = header.getBoundingClientRect().top
    const timelineTop = timeline.getBoundingClientRect().top
    const position = headerPosition - timelineTop
    archiveContentWrapper.style.setProperty('--timeline-position', `${position}px`)
}

function timelineLength() {
    const lastArchive = [...document.querySelectorAll(".archive-content")][Archives.length - 1]
    let totalHeight = archiveContentWrapper.getBoundingClientRect().height
    const lastArchiveHeight = lastArchive.getBoundingClientRect().height
    totalHeight = totalHeight - lastArchiveHeight - remToPx(4.25)
    archiveContentWrapper.style.setProperty('--timeline-length', `${totalHeight}px`)
}

window.addEventListener('resize', () => {
    setTimeout(timelineLength, 10)
    setTimeout(archiveUI, 10)
})

// Panning effect for images

panning(document.querySelectorAll('.archive-img-wrapper img'))

//INITIALIZATION OF VARIABLES
const firstValue = document.getElementById('first-value'),
secondValue = document.getElementById('second-value'),
thirdValue = document.getElementById('third-value'),
fourthValue = document.getElementById('fourth-value'),

n = new Intl.NumberFormat('en-US',{
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
})

let i=0,
j=0,
k=0,
l=0,
o,p,q,r;

const firstValueCount = () => {
    if(i < 75000){
        i += 750;
        firstValue.textContent = n.format(i);
        if (firstValue.textContent === "75,000")
            firstValue.textContent = "75,000 +";
    } else {
        clearInterval(o)
        o = null;
    }
}, secondValueCount = () => {
    if(j < 900000){
        j += 9000;
        secondValue.textContent = n.format(j);
        if (secondValue.textContent === "900,000")
            secondValue.textContent = "900,000 +";
    } else {
        clearInterval(p)
        p = null;
    }
}, thirdValueCount = () => {
    if(k < 99){
        k ++;
        thirdValue.textContent = `${n.format(k)}%`;
    } else {
        clearInterval(q)
        q = null;
    }
}, fourthValueCount = () => {
    if(l < 50){
        l ++;
        fourthValue.textContent = `${n.format(l)}`;
        if (fourthValue.textContent === "50") 
            fourthValue.textContent = "50 +"
    } else {
        clearInterval(r)
        r = null;
    }
}


//CURRENTLY USING INTERSECTION OBSERVER API FOR THE AUTOMATIC COUNTER
let accrediationSectionObserver = new IntersectionObserver((entries,observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.intersectionRatio > 0.2) {
                    firstValue.textContent = "0";
                    secondValue.textContent = "0";
                    thirdValue.textContent = "0";
                    fourthValue.textContent = "0";
                    accreditationCounter()
                observer.unobserve(entry.target)
            }
        } 
})}, {
        root:null,
        rootMargin:"0px",
        threshold: 1
    }
)
accrediationSectionObserver.observe(document.querySelector('#accreditation-section-container'))


//COUNTER FUNCTIONS
const t = 50
function accreditationCounter(){    
        o = setInterval(()=>{
            firstValueCount()
        },t);
        p = setInterval(()=>{
            secondValueCount()
        },t);
        q = setInterval(()=>{
            thirdValueCount()
        },t);
        r = setInterval(()=>{
            fourthValueCount()
        },(t*2));
}

const faqs = document.querySelectorAll(".reviews"),
faqans = document.querySelectorAll(".review-answers"),
info = document.querySelectorAll(".plus"),
hide = document.querySelectorAll(".minus")

faqs.forEach((faq,i) => {
    faq.addEventListener('click',() => {
        faqans.forEach((faqan,n) => {
            if(n === i){
                faqan.classList.toggle('none');
                if(faqan.classList.contains('none')){
                    info[n].classList.remove('none');
                    hide[n].classList.remove('inline');
                    info[n].classList.add('inline');
                    hide[n].classList.add('none');
                } else {
                    info[n].classList.remove('inline');
                    hide[n].classList.remove('none');
                    info[n].classList.add('none');
                    hide[n].classList.add('inline');
                }
            } else {
                faqan.classList.add('none');
                info[n].classList.remove('none');
                hide[n].classList.remove('inline');
                info[n].classList.add('inline');
                hide[n].classList.add('none');
            }
        })
    })
})

