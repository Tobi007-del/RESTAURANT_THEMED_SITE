//fetch request for Tastey Meals data
const data = fetch('./JSON/tastey_meals.json')
.then(response => {
    if(!response.ok) throw new Error(`HTTP error!. Status: ${response.status}`)
    return response.json()
})
.catch(error => {
    console.error(`%cIssue parsing data... ${error}`,"color:red")
    console.warn("Please reload page")
})

export default await data