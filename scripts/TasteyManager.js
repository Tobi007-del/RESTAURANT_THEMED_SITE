import { round, check, formatValue } from "./utility-functions.js"
export { Tastey, weakTastey }
//A Class to handle all major Tastey operations
class TasteyManager {
    constructor() {
        this.tasteyRecord = ((localStorage.tasteyRecord !== undefined) && (localStorage.tasteyRecord !== "undefined")) ? JSON.parse(localStorage.tasteyRecord) : {}
        console.log(this.tasteyRecord)
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

    removeMeal(id) {
    try {
        const index = this.tasteyRecord.tasteyOrders.findIndex(meal => meal.id === id)
        this.tasteyRecord.tasteyOrders[index].orders -= 1
        const currentProductCount = this.tasteyRecord.tasteyOrders[index].orders
        const currentProductCountElement = document.querySelector(`.tastey-meal-order[data-id="${id}"] .cart-number`)
        currentProductCountElement.textContent = currentProductCount
    } catch (error) {
        console.error(`Error occured while removing meal from bag ${error}`)
    }
    }

    addMeal(id,meals,curr) {
    try {
        const meal = meals.find(meal => meal.id === id)
        const { label, category, price, serving, picSrc } = meal
        const index = this.tasteyRecord.tasteyOrders.findIndex(meal => meal.id === id)
        let currentProductCount
        if (index === -1) {
            const meal = {}
            meal.id = Number(id)
            meal.orders = 1
            this.tasteyRecord.tasteyOrders.push(meal)
            currentProductCount = 1
        } else {
            this.tasteyRecord.tasteyOrders[index].orders += 1
            currentProductCount = this.tasteyRecord.tasteyOrders[index].orders
        }
        const currentProductCountElement = document.querySelector(`.tastey-meal-order[data-id="${id}"] .cart-number`)
        const orderReviewSectionContent = document.querySelector(".order-review-section-content")
        const like = this.tasteyRecord.likes.find(meal => meal.id === id)
        if (currentProductCount > 1) { 
            currentProductCountElement.textContent = currentProductCount
        } else {
             orderReviewSectionContent.innerHTML += `
                <div class="tastey-meal-order" data-id="${id}" data-like="${like?.like ?? false}" data-orders="${weakTastey.getOrdersValue(Number(id)) ?? 0}" data-position = "${this.tasteyRecord.tasteyOrders.length ?? 1}">
                    <div class="tastey-meal-order-content">
                    <div class="tastey-order-image-wrapper">
                            <img class="tastey-order-image" src="${picSrc}" alt="Image of ${label}" title="${label}">
                            <span class="tooltip-text like-tooltip">Double tap to like!</span>
                            <span class="tooltip-text unlike-tooltip">Double tap to unlike</span>
                    </div>
                    <div class="tastey-order-info">
                        <div class="tastey-order-text">
                            <div>
                                <button type="button" title="${label}">
                                    <h2>${label}</h2>
                                </button>
                                <p>Category: ${category}</p>
                            </div>
                            <div>
                                <button type="button" title="Remove ${label} from Bag" class="delete-order">
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                                    </span>
                                    <p>REMOVE MEAL</p>
                                </button>
                                <button type="button" title="${(like?.like ?? false) ? `Remove ${label} from Wishlist` : `Add ${label} to Wishlist`}" class="wishlist">
                                    <span>
                                        <svg class="unliked-heart-icon" viewBox="0 -960 960 960"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/></svg>
                                        <svg class="liked-heart-icon" viewBox="0 0 512 512"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>
                                    </span>
                                    <p class="move-to-wishlist">MOVE TO WISHLIST</p>
                                    <p class="remove-from-wishlist">REMOVE FROM WISHLIST</p>
                                </button>
                            </div>
                        </div>
                        <div class="tastey-order-price-wrapper">
                            <span>
                                <span class="cart-toggle">
                                <button type="button" title="Remove 1 ${label[label.length - 1] === 's' ? label.slice(0,label.length - 1) : label}" class="sign minus">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                                    <svg width="12" height="4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="M11.357 3.332A.641.641 0 0 0 12 2.69V.643A.641.641 0 0 0 11.357 0H.643A.641.641 0 0 0 0 .643v2.046c0 .357.287.643.643.643h10.714Z" id="a"/></defs><use fill-rule="nonzero" xlink:href="#a"/></svg>
                                </button>
                                    <p class="cart-number">${currentProductCount}</p>
                                <button type="button" title="Add 1 ${label[label.length - 1] === 's' ? label.slice(0,label.length - 1) : label}" class="sign add">
                                    <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="M12 7.023V4.977a.641.641 0 0 0-.643-.643h-3.69V.643A.641.641 0 0 0 7.022 0H4.977a.641.641 0 0 0-.643.643v3.69H.643A.641.641 0 0 0 0 4.978v2.046c0 .356.287.643.643.643h3.69v3.691c0 .356.288.643.644.643h2.046a.641.641 0 0 0 .643-.643v-3.69h3.691A.641.641 0 0 0 12 7.022Z" id="b"/></defs><use fill-rule="nonzero" xlink:href="#b"/></svg>
                                </button>
                            </span>                   
                                <p class="serving-size" data-serving=${serving ?'"' + serving + '"' : "NG"}>Note: </p>
                            </span>         
                            <span class="order-price" data-discount="${price.discount ?? 0}">
                                <h3 class="meal-price" data-discount="${price.discount ?? 0}">${formatValue(curr,check(price.currentValue,price.discount))}</h3>
                                <h3 class="actual-meal-price">${formatValue(curr,price.currentValue)}</h3>
                            </span>
                        </div>
                    </div>
                    </div>
                </div>
            `   
        }
    } catch (error) {
        console.error(`Error occured while adding meal to bag ${error}`)
    }
    }
    
    getOrdersValue(id) {
        const meal = this.tasteyRecord.tasteyOrders.find(meal => meal.id === id)
        return meal?.orders
    }

    getPositionValue(id) {
        return this.tasteyRecord.tasteyOrders.findIndex(meal => meal.id === id)
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

    getLikeValue(id) {
        const like = this.tasteyRecord.likes.find(meal => meal.id === id) 
        return like?.like
    }

    deleteMeal(id) {
        const mealIndex = this.tasteyRecord.tasteyOrders.findIndex(meal => meal.id === id)
        this.tasteyRecord.tasteyOrders.splice(mealIndex,1)
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
            `,"color: blue; font-weight: bold; font-size: large;")            
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

    getEmpty() {
        return (this.tasteyRecord.tasteyOrders.length == 0)
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
            console.log(localStorage.tasteyRecord)
            console.log("%c Data stored " + res + ", all operations functional", "color: green; font-weight: bold;")
        }).catch(rej => {
            console.error("%cAttempt to store data returned " + rej,"color: red;")
        })
    }
}

export const wrapMethods = {
    get() {
        const result = Reflect.get(...arguments)
        if(typeof result === "function") 
            return new Proxy(result,storingHandler)
        return result
    }
}

const weakTastey = new TasteyManager
const Tastey = new Proxy(weakTastey,wrapMethods)

