// archive data import
import Archives from './fetch-archives.js'
import { panning, remToPx, tasteyThrottler } from './utility-functions.js'

window.addEventListener('load', () => {
    setTimeout(timelineLength)
    setTimeout(archiveUI)
})

const archiveContentWrapper = document.querySelector(".archives-content-wrapper")
Archives.forEach(({ year, imgSrc, event, description }) => {
archiveContentWrapper.innerHTML += 
`
                <div class="archive">
                    <div class="archive-content Tastey-blur-bc">
                        <div class="archive-time-wrapper">
                            <h4>${year}</h4>
                        </div>
                        <div class="archive-img-wrapper">
                            <img src="${imgSrc}" alt="Image of ${event}" title="${event}">
                        </div>
                        <div class="archive-text-wrapper">
                            <h2>${event}</h2>
                            <p>${description}${btnCheck(event)}</p>
                        </div>
                    </div>
                </div>    
`
})
function btnCheck(e) {
    if (e === 'Still Tastey') return `<a href='menu.html' title='Open Menu' class='open-menu-btn'><span>OPEN OUR MENU</span></a>`
    else return ''
}

const archives = document.querySelectorAll(".archive-content")
 
const scrollThrottler = new tasteyThrottler
window.addEventListener('scroll', scrollThrottler.throttle(archiveUI))

function archiveUI() {
    if (window.innerHeight >= (archives[0].offsetHeight * 1.5)) {
        archives.forEach(archive => {
            if ((archive.getBoundingClientRect().top < (window.innerHeight - remToPx(15))) && (archive.getBoundingClientRect().bottom > remToPx(20))) {
                setTimelinePosition(archive.querySelector(".archive-time-wrapper > h4"))
                setTimeout(() => {
                    if ((archive.getBoundingClientRect().top < (window.innerHeight - remToPx(15))) && (archive.getBoundingClientRect().bottom > remToPx(20)))
                        archive.classList.add("visible")
                }, 400)
            } else {
                archive.classList.remove("visible")
            }
        }) 
    } else {
        archives.forEach(archive => {
            if ((archive.getBoundingClientRect().top < (window.innerHeight * .8)) && (archive.getBoundingClientRect().bottom > (remToPx(3) + window.innerHeight * .2))) {
                setTimelinePosition(archive.querySelector(".archive-time-wrapper > h4"))
                setTimeout(() => {
                    if ((archive.getBoundingClientRect().top < (window.innerHeight * .8)) && (archive.getBoundingClientRect().bottom > (remToPx(3) + window.innerHeight * .2)))
                        archive.classList.add("visible")
                }, 400)
            } else {
                archive.classList.remove("visible")
            }
        })         
    }
}

const timeline = document.querySelector(".tastey-timeline")
function setTimelinePosition(header) {
    const headerPosition = header.getBoundingClientRect().top
    const timelineTop = timeline.getBoundingClientRect().top
    const position = headerPosition - timelineTop
    archiveContentWrapper.style.setProperty('--timeline-position', `${position}px`)
}

function timelineLength() {
    const firstArchive = [...document.querySelectorAll(".archive-content")][0]
    const lastArchive = [...document.querySelectorAll(".archive-content")][Archives.length - 1]
    let totalHeight = lastArchive.querySelector(".archive-time-wrapper > h4").getBoundingClientRect().top - firstArchive.querySelector(".archive-time-wrapper > h4").getBoundingClientRect().top
    archiveContentWrapper.style.setProperty('--timeline-length', `${totalHeight}px`)
}

window.addEventListener('resize', () => {
    timelineLength()
    archiveUI()
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
        o = setInterval(firstValueCount,t)
        p = setInterval(secondValueCount,t)
        q = setInterval(thirdValueCount,t)
        r = setInterval(fourthValueCount,t*2)
}

const faqs = document.querySelectorAll(".reviews"),
faqans = document.querySelectorAll(".review-answers"),
info = document.querySelectorAll(".plus"),
hide = document.querySelectorAll(".minus")

faqs.forEach((faq,i) => {
    faq.addEventListener('click',() => {
        faqans.forEach((faqan,n) => {
            if(n === i){
                faqan.classList.toggle('hide')
                const bool = faqan.classList.contains('hide')
                info[n].classList.toggle('hide', !bool)
                info[n].classList.toggle('show', bool)
                hide[n].classList.toggle('hide', bool)
                hide[n].classList.toggle('show', !bool)
                bool ? faqan.querySelector('audio').pause() : faqan.querySelector('audio').play()
                for (const item of faqan.querySelectorAll('button, input')) {
                    item.tabIndex = bool ? '-1' : '0'
                }
            } else {
                faqan.classList.add('hide')
                info[n].classList.remove('hide')
                hide[n].classList.remove('show')
                info[n].classList.add('show')
                hide[n].classList.add('hide')
                faqan.querySelector('audio').pause()
                for (const item of faqan.querySelectorAll('button, input')) {
                    item.tabIndex = '-1'
                }
            }
        })
    })
})

for(const faqan of faqans) {
    for (const item of faqan.querySelectorAll('button, input')) {
        item.tabIndex = faqan.classList.contains('hide') ? '-1' : '0'
    }
}

