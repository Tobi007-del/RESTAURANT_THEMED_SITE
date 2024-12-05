const Archives = fetch('./JSON/tastey_archives.json')
.then(response => {
    if(!response.ok) throw new Error(`HTTP error!. Status: ${response.status}`)
    return response.json()
})
.catch(error => {
    console.error(`%cIssue parsing archives... ${error}`,"color:red")
    console.warn("Please reload page")
})

export default await Archives