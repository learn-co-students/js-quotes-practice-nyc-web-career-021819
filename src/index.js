// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading.
let quotes
let editToggle = true


document.addEventListener("DOMContentLoaded",function(){
    const ultag = document.querySelector("#quote-list")
    const formTag = document.querySelector("#new-quote-form")
    fetch("http://localhost:3000/quotes")
    .then(res => res.json())
    .then(function(json){
        quotes = json
        // console.table(json);
        json.forEach(function(quote){
            ultag.innerHTML += `
                <li class='quote-card'>
                <blockquote class="blockquote" data-id="${quote.id}">
                <p class="mb-0">${quote.quote}</p>
                <footer class="blockquote-footer">${quote.author}</footer>
                <br>
                <button class='btn-success'>Likes: <span>0</span></button>
                <button class='btn-danger'>Delete</button>
                <button class='btn-edit'>Edit</button>
                </blockquote>
            </li><br>`
        })
    })

    
        formTag.addEventListener("submit", function(e) {
                e.preventDefault();

                let author = e.target.querySelector("#author").value
                let newQuote = e.target.querySelector("#new-quote").value
                
                fetch("http://localhost:3000/quotes", {
                    method: "POST",
                    headers: {
                    'Content-Type':'application/json',
                    'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        quote: newQuote,
                        author: author
                    })
                })
                //add to front end page
                .then(res=>res.json())
                .then(function(json){
                    // console.log(json)
                    ultag.innerHTML += `
                        <li class='quote-card'>
                        <blockquote class="blockquote" data-id="${json.id}">
                        <p class="mb-0">${json.quote}</p>
                        <footer class="blockquote-footer">${json.author}</footer>
                        <br>
                        <button class='btn-success'>Likes: <span>0</span></button>
                        <button class='btn-danger'>Delete</button>
                        <button class='btn-edit'>Edit</button>
                        </blockquote>
                    </li><br>`
                })
                formTag.reset()
        })// end of submit event 
    
     
    ultag.addEventListener("click",function(e){
        if(e.target.innerText === "Delete"){
            // console.log(e.target.parentNode.parentNode)
            //delete in the database
            let quoteId = parseInt(e.target.parentNode.dataset.id)
            
            fetch(`http://localhost:3000/quotes/${quoteId}`,{
                method: "DELETE",
                headers: {
                    'Content-Type':'application/json',
                    'Accept':'application/json'
                },
                body: JSON.stringify({
                    id:quoteId
                })
            })//end of fetch delete
            // remove on the front end
            e.target.parentNode.parentNode.remove()
        }
    })

    ultag.addEventListener("click", function (e) {
        if (e.target.className === "btn-success"){
            let quoteId = parseInt(e.target.parentNode.dataset.id)
            let spanTag = e.target.querySelector("span")
            let likeCount = parseInt(spanTag.innerText) +1
            // spanTag.innerText = 5

            // update database 
            fetch(`http://localhost:3000/quotes/${quoteId}`,{
                method: "PATCH",
                headers: {
                    'Content-Type':'application/json',
                    'Accept' : 'application/json'
                },
                body:JSON.stringify({
                    likes: likeCount
                })
            })//end of fetch patch
            // update the front page
            spanTag.innerText = likeCount
        }//end of if statement      
    })//end of event listening for likes

    //Add an edit button to each quote - card that will allow the editing of a quote. (Hint: there is no 'correct' way to do this.You can try creating a hidden form that will only show up when hitting the edit button.)

    ultag.addEventListener("click", function (e) {
        if (e.target.className === "btn-edit"){

            let quoteId = parseInt(e.target.parentNode.dataset.id)
            let indexId = quoteId -1
            let authorTag = formTag.querySelector("#author")
            let newQuoteTag = formTag.querySelector("#new-quote")

            // console.log(indexId)
            // console.table(quotes) 
            //getting the values into the input box when hit edit

            authorTag.value = quotes[indexId].author
            newQuoteTag.value = quotes[indexId].quote        

        }
    })

    // Add a sort button on the page that I can toggle on and off that will sort the list of quotes by author name.
    
})//end of dom content loaded