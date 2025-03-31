export { Tastey, mobileThreshold }

import { autoRemoveScroller } from "./build-scroller.js"
import { notificationQuery } from "./service-worker-helper.js"
import { round, check, formatValue, standardize, rand, remToPx, stars } from "./utils.js"
import Toast from "/T007_TOOLS/T007_toast_library/T007_toast.js"

const mobileThreshold = remToPx(36)

//calling the stars maker function page startup
stars(document.querySelectorAll(".magic-star"))
//a basic loading page implementation
window.addEventListener('load', () => {
    document.body.classList.remove("loading")
    setTimeout(autoRemoveScroller)
})

function displayWelcomeNotification() {
    let randomImgSrc
    switch(rand(1,6)) {
        case 2:
            randomImgSrc = "assets/tastey-meal-images/tastey_meal_two.jpg"
            break
        case 3: 
            randomImgSrc = "assets/tastey-meal-images/tastey_meal_three.jpg"
            break
        case 4:
            randomImgSrc = "assets/tastey-meal-images/tastey_meal_four.jpg"
            break
        case 5:
            randomImgSrc = "assets/tastey-meal-images/tastey_meal_five.jpg"
            break
        case 6:
            randomImgSrc = "assets/tastey-meal-images/tastey_meal_six.jpg"
            break
        case 7: 
            randomImgSrc = "assets/tastey-meal-images/tastey_meal_seven.jpg"
            break
        default:
            randomImgSrc = "assets/tastey-meal-images/tastey_meal_one.jpg" 
    }
    // FT for "First Timer" & OT for "Old Taker"
    const welcomeMssg = !sessionStorage.tastey_friendship_log && localStorage.tastey_friendship_log ? "Hello, Old Friend! Welcome back to Tastey" : "Hello, New Friend! Welcome to Tastey",
    title = "Tastey",
    options = {
        body: `${welcomeMssg}. Wanna tease your taste buds? try a Tastey meal now!`,
        image: randomImgSrc,
        tag: "tastey-welcome-notification",
        renotify: true
    }
    Toast({ data: { type: "info", body: "Wanna tease your taste buds? try a Tastey meal now!", tag: "tastey-welcome-notification" } })
    notificationQuery(title, options, "Welcome")
}
if (!sessionStorage.is_this_first_visit_to_Tastey) {
    sessionStorage.is_this_first_visit_to_Tastey = true
    window.addEventListener('load', displayWelcomeNotification)
}
if (!localStorage.tastey_friendship_log) {
    sessionStorage.tastey_friendship_log = "FT"
} 
localStorage.tastey_friendship_log = "OT"

const burger = document.querySelector('.hamburger input')
burger.addEventListener('change', e => {
    if (e.target.checked) window.addEventListener('click', handleClick)
    function handleClick(e) {
        if(e.clientX > (window.innerWidth * .6)) {
            burger.checked = false
            window.removeEventListener('click', handleClick)
        }
    }
})

const nav = document.querySelector(".navigation-section")
nav.classList.add("smooth")
window.addEventListener('resize', () => nav.classList.toggle("smooth", window.innerWidth > mobileThreshold))
document.querySelector('.nav-link:nth-of-type(3)').addEventListener('click', () => {if(sessionStorage.open_cart) delete sessionStorage.open_cart})


//A function to mock queries to the database during development
const mockWait = () => new Promise(resolve => setTimeout(resolve, 500))
//A Class to handle all major Tastey operations
class TasteyManager {
    constructor() {
        this.tasteyRecord = this.#getLocalTasteyRecord()
        this.ordersInTotal = 0
        this.tasteyMeals = 0
        this.actualAmount = 0
        this.totalDiscountPercentage = 0
        this.savedAmount = 0
        this.totalAmount = 0
        this.VAT = 1.99
        this.totalCost = 0 
    }

    #getLocalTasteyRecord() {
        const storedRecord = localStorage.getItem("tasteyRecord")
        return storedRecord ? JSON.parse(storedRecord) : { tasteyOrders: [], likes: [] }
    }

    #setLocalTasteyRecord() {
        localStorage.setItem("tasteyRecord", JSON.stringify(this.tasteyRecord))
    }

    async editMeal(id,n=1) {
    try {
        await mockWait()
        const index = this.tasteyRecord.tasteyOrders.findIndex(meal => Number(meal.id) === Number(id))
        if (index === -1) {
            const meal = {}
            meal.id = Number(id)
            meal.orders = n
            this.tasteyRecord.tasteyOrders.push(meal)
        } else {
            this.tasteyRecord.tasteyOrders[index].orders = n
        }
        this.#setLocalTasteyRecord()
        return true
    } catch (error) {
        console.error(`Error occured while editing a meal in the bag: ${error}`)
        return false
    }
    }

    async addMeal(id,n=1) {
    try {
        await mockWait()
        const index = this.tasteyRecord.tasteyOrders.findIndex(meal => Number(meal.id) === Number(id))
        if (index === -1) {
            const meal = {}
            meal.id = Number(id)
            meal.orders = n
            this.tasteyRecord.tasteyOrders.push(meal)
        } else {
            this.tasteyRecord.tasteyOrders[index].orders += n
        }
        this.#setLocalTasteyRecord()
        return true
    } catch (error) {
        console.error(`Error occured while adding meal to bag: ${error}`)
        return false
    }
    }

    async removeMeal(id,n=1) {
    try {
        await mockWait()
        const index = this.tasteyRecord.tasteyOrders.findIndex(meal => Number(meal.id) === Number(id))
        this.tasteyRecord.tasteyOrders[index].orders -= n
        this.#setLocalTasteyRecord()
        return true
    } catch (error) {
        console.error(`Error occured while removing a meal from bag: ${error}`)
        return false
    }
    }    

    async deleteMeal(id) {
    try {
        await mockWait()
        const mealIndex = this.tasteyRecord.tasteyOrders.findIndex(meal => Number(meal.id) === Number(id))
        this.tasteyRecord.tasteyOrders.splice(mealIndex,1)
        this.#setLocalTasteyRecord()
        return true
    } catch (error) {
        console.error(`Error occured while deleting meal from bag: ${error}`)
        return false
    }
    }

    async handleLikes(id,bool) {
    try {
        await mockWait()
        const likeIndex = this.tasteyRecord.likes.findIndex(meal => Number(meal.id) === Number(id))
        if (likeIndex === -1) {
            const meal = {}
            meal.id = id
            meal.like = bool
            this.tasteyRecord.likes.push(meal)
        } else {
            this.tasteyRecord.likes.splice(likeIndex,1)
        }
        this.#setLocalTasteyRecord()
        return true
    } catch (error) {
        console.error(`Error occured while handling likes: ${error}`)
        return false
    }
    }

    async clearCart() {
    try {
        await mockWait()
        this.tasteyRecord.tasteyOrders = []
        this.ordersInTotal = 0
        this.tasteyMeals = 0
        this.actualAmount = 0
        this.totalDiscountPercentage = 0
        this.savedAmount = 0
        this.totalAmount = 0
        this.VAT = 0
        this.totalCost = 0 
        this.#setLocalTasteyRecord()
        return true          
    } catch (error) {
        console.error(`Error occured while clearing bag: ${error}`)
        return false
    }
    }

    calculateCheckoutDetails(allMeals, curr) {
    try {
        this.tasteyMeals = this.tasteyRecord.tasteyOrders.length
        this.ordersInTotal = this.tasteyRecord.tasteyOrders.reduce((count,meal) => count + meal.orders,0)
        this.actualAmount = 0
        this.totalAmount = 0
        this.tasteyRecord.tasteyOrders.forEach(({ id,orders }) => {
            const meal = allMeals.find(meal => meal.id === id)
            this.actualAmount += (meal.price.currentValue * orders)
            this.totalAmount += (check(meal.price.currentValue,meal.price.discount) * orders)
        })
        this.savedAmount = this.actualAmount - this.totalAmount
        this.totalDiscountPercentage = round(((this.savedAmount / this.actualAmount) * 100) || 0)
        this.totalCost = ((this.VAT / 100) * this.totalAmount) + this.totalAmount
        const orderTitleStyle = "color: lightgrey; font-size: x-large; font-weight: bold;",
        titleStyle = "color: grey; font-size: large; font-weight: bold;",
        valueStyle = "color: lightgrey; font-size: large; font-weight: bold;",
        costStyle = "color: green; font-size: large; font-weight: bold;"
        console.log(`%cOrder Summary\n%cOrders in total: %c${standardize(this.ordersInTotal)}\n%cTastey meals: %c${standardize(this.tasteyMeals)}\n%cActual Amount: %c${formatValue(curr, this.actualAmount)}\n%cTotal Discount: %c-${this.totalDiscountPercentage}%\n%cSaved: %c${formatValue(curr, this.savedAmount)}\n%cTotal Amount: %c${formatValue(curr, this.totalAmount)}\n%cVAT: %c+${this.VAT}%\n%cTotal Cost: %c${formatValue(curr, this.totalCost)}`, orderTitleStyle, titleStyle, valueStyle, titleStyle, valueStyle, titleStyle, valueStyle, titleStyle, valueStyle, titleStyle, valueStyle, titleStyle,valueStyle, titleStyle, valueStyle, valueStyle, costStyle)     
    } catch (error) {
        console.error(`Error calculating checkout details: ${error}`)
    }
    }

    getOrdersValue(id) {
        const meal = this.tasteyRecord.tasteyOrders.find(meal => Number(meal.id) === Number(id))
        const value = Number(meal?.orders ?? 0)
        return value
    }

    getOrdersPosition(id) {
        return (this.tasteyRecord.tasteyOrders.findIndex(meal => Number(meal.id) === Number(id)) ?? 0 + 1)
    }
    
    getLikeValue(id) {
        const like = this.tasteyRecord.likes.find(meal => Number(meal.id) === Number(id)) 
        return like?.like
    } 

    isEmpty() {
        return (this.tasteyRecord.tasteyOrders.length == 0)
    }   
}

const Tastey = new TasteyManager

