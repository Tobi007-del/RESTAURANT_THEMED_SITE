import { round, check} from "./utility-functions.js"
export { Tastey, weakTastey }

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

    calculateCheckoutDetails(arr) {
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
            ActualAmount: ${this.actualAmount}\n
            Total Amount: ${this.totalAmount}\n
            Saved: ${this.savedAmount}\n
            Total Discount: ${this.totalDiscountPercentage}%\n
            Total Cost: ${this.totalCost}
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

