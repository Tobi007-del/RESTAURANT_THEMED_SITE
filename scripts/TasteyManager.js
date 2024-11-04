export { Tastey, weakTastey }

import { notificationQuery } from "./service-worker-helper.js"
import { round, check, formatValue, rand} from "./utility-functions.js"

//a loading page implementation
window.addEventListener('load', () => {
    document.body.classList.remove("loading")
})

if (!sessionStorage.is_this_first_visit_to_Tastey) {
    sessionStorage.is_this_first_visit_to_Tastey = true
    window.addEventListener('load', displayWelcomeNotification)
}

function displayWelcomeNotification() {
    let randomImgSrc
    switch(rand(1,6)) {
        case 2:
            randomImgSrc = "../assets/tastey-meal-images/tastey_meal_two.jpg"
            break
        case 3: 
            randomImgSrc = "../assets/tastey-meal-images/tastey_meal_three.jpg"
            break
        case 4:
            randomImgSrc = "../assets/tastey-meal-images/tastey_meal_four.jpg"
            break
        case 5:
            randomImgSrc = "../assets/tastey-meal-images/tastey_meal_five.jpg"
            break
        case 6:
            randomImgSrc = "../assets/tastey-meal-images/tastey_meal_six.jpg"
            break
        case 7: 
            randomImgSrc = "../assets/tastey-meal-images/tastey_meal_seven.jpg"
            break
        default:
            randomImgSrc = "../assets/tastey-meal-images/tastey_meal_one.jpg" 
    }
    // FT for "First Timer" & OT for "Old Taker"
    const welcomeMssg = !sessionStorage.tastey_friendship_log && localStorage.tastey_friendship_log ? "Hello, Old Friend!, Welcome back to Tastey" : "Hello, New Friend!, Welcome to Tastey"
    const title = "Tastey"
    const options = {
        body: `${welcomeMssg}. Wanna tease your taste buds?, try a Tastey meal now!`,
        image: randomImgSrc,
        tag: "tastey-welcome-notification",
        renotify: true
    }
    notificationQuery(title, options)
}

//A Class to handle all major Tastey operations
class TasteyManager {
    constructor() {
        this.tasteyRecord = ((localStorage.tasteyRecord !== undefined) && (localStorage.tasteyRecord !== "undefined")) ? JSON.parse(localStorage.tasteyRecord) : {}
        this.tasteyRecord.tasteyOrders = this.tasteyRecord.tasteyOrders ? this.tasteyRecord.tasteyOrders : []
        this.tasteyRecord.likes = this.tasteyRecord.likes ? this.tasteyRecord.likes : []
        this.ordersInTotal = 0
        this.tasteyMeals = 0
        this.actualAmount = 0
        this.totalDiscountPercentage = 0
        this.savedAmount = 0
        this.totalAmount = 0
        this.VAT = 1.99
        this.totalCost = 0 
    }

    addMeal(id,n = 1) {
    try {
        const index = this.tasteyRecord.tasteyOrders.findIndex(meal => meal.id === id)
        if (index === -1) {
            const meal = {}
            meal.id = Number(id)
            meal.orders = 1
            this.tasteyRecord.tasteyOrders.push(meal)
        } else {
            this.tasteyRecord.tasteyOrders[index].orders += n
        }
    } catch (error) {
        console.error(`Error occured while adding meal to bag ${error}`)
    }
    }

    removeMeal(id,n = 1) {
        try {
            const index = this.tasteyRecord.tasteyOrders.findIndex(meal => meal.id === id)
            this.tasteyRecord.tasteyOrders[index].orders -= n
        } catch (error) {
            console.error(`Error occured while removing meal from bag ${error}`)
        }
    }    

    deleteMeal(id) {
        const mealIndex = this.tasteyRecord.tasteyOrders.findIndex(meal => meal.id === id)
        this.tasteyRecord.tasteyOrders.splice(mealIndex,1)
    }

    handleLikes(id,bool) {
        const likeIndex = this.tasteyRecord.likes.findIndex(meal => meal.id === id)
        if (likeIndex === -1) {
            const meal = {}
            meal.id = id
            meal.like = bool
            this.tasteyRecord.likes.push(meal)
        } else {
            this.tasteyRecord.likes.splice(likeIndex,1)
        }
    }

    calculateCheckoutDetails(arr, curr) {
        try {
            this.tasteyMeals = this.tasteyRecord.tasteyOrders.length
            this.ordersInTotal = this.tasteyRecord.tasteyOrders.reduce((count,meal) => count + meal.orders,0)
            this.actualAmount = 0
            this.totalAmount = 0
            this.tasteyRecord.tasteyOrders.forEach(({ id,orders }) => {
                const meal = arr.find(meal => meal.id === id)
                this.actualAmount += (meal.price.currentValue * orders)
                this.totalAmount += (check(meal.price.currentValue,meal.price.discount) * orders)
            })
            this.savedAmount = this.actualAmount - this.totalAmount
            this.totalDiscountPercentage = round(((this.savedAmount / this.actualAmount) * 100) || 0)
            this.totalCost = ((this.VAT / 100) * this.totalAmount) + this.totalAmount
            console.log(`%c
            Orders in total: ${this.ordersInTotal}\n 
            Tastey meals: ${this.tasteyMeals}\n
            Actual Amount: ${formatValue(curr, this.actualAmount)}\n
            Total Discount: -${weakTastey.totalDiscountPercentage}%\n
            Saved: ${formatValue(curr, this.savedAmount)}\n
            Total Amount: ${formatValue(curr, this.totalAmount)}\n
            VAT: +${this.VAT}\n
            Total Cost: ${formatValue(curr, this.totalCost)}
            `,"color: green; font-weight: bold; font-size: large;")            
        } catch (error) {
            console.error(`Error calculating checkout details: ${error}`)
        }
    }

    clearCart() {
        try {
            this.tasteyRecord.tasteyOrders = [];
            this.ordersInTotal = 0
            this.tasteyMeals = 0
            this.actualAmount = 0
            this.totalDiscountPercentage = 0
            this.savedAmount = 0
            this.totalAmount = 0
            this.VAT = 0
            this.totalCost = 0           
        } catch (error) {
            console.error(`Error clearing cart: ${error}`)
        }
    }

    getOrdersValue(id) {
        const meal = this.tasteyRecord.tasteyOrders.find(meal => meal.id === id)
        return meal?.orders
    }
 
    getEmpty() {
        return (this.tasteyRecord.tasteyOrders.length == 0)
    }

    getPositionValue(id) {
        return this.tasteyRecord.tasteyOrders.findIndex(meal => meal.id === id)
    }
    getLikeValue(id) {
        const like = this.tasteyRecord.likes.find(meal => meal.id === id) 
        return like?.like
    }    
}

function store() {
    localStorage.tasteyRecord = JSON.stringify(weakTastey.tasteyRecord)
}

//using a proxy and the reflect object to make sure store is called after every relevant function in the TasteyManager class is run
const storingHandler = {
    apply() {
        new Promise((res,rej) => {
            res("successfully")
            rej("unsucessful")
            Reflect.apply(...arguments)   
        }).then(res => {
            store()
            console.log("%c Data stored " + res + ", all operations functional", "color: green; font-weight: bold;")
        }).catch(rej => {
            console.error("%cAttempt to store data returned " + rej,"color: red;")
        })
    }
}

const wrapMethods = {
    get() {
        const result = Reflect.get(...arguments)
        if(typeof result === "function") 
            return new Proxy(result,storingHandler)
        return result
    }
}

const weakTastey = new TasteyManager
const Tastey = new Proxy(weakTastey, wrapMethods)

