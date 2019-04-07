// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
const quoteDiv = document.getElementById("quote-div")
const quoteList = document.getElementById("quote-list")
const submitButton = document.getElementById("submit-button")




function fetchGet(url, callBack) {
  fetch(url)
  .then(function(response) {
    return response.json();
  })
  .then(callBack)
}

function updateFetch(url, method, quoteValue, authorValue, likeValue){
  fetch(url,  {
      method: method,
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({"quote": quoteValue, "author": authorValue, "likes": likeValue})
    })
   .then(res => res.json())
   .then(data => {
     fetchGet("http://localhost:3000/quotes", generateQuoteList)
   })
}



function generateQuoteList(array) {
  let sortedArray = array.sort((a, b) => (a.author > b.author) ? 1 : -1)
  sortedArray.forEach (function (element) {
    quoteList.innerHTML += `<li id=${element.id} class='quote-card'>
      <blockquote class="blockquote">
        <p id=quote-${element.id} class="mb-0">${element.quote}</p>
        <footer id=author-${element.id} class="blockquote-footer">${element.author}</footer>
        <br>
        <button id=like-add-${element.id} class='btn-success'>Likes:
        <span id=like-count-${element.id}>
        ${element.likes}</span></button>
        <button id=edit-${element.id} class='btn-info'>Edit</button>
        <button id=button-${element.id} class='btn-danger'>Delete</button>
      <form id=edit-quote-form-${element.id}>
        <div class="form-group">
          <label for="new-quote">Updated Quote</label>
          <input type="text" class="form-control" id=updated-quote-${element.id} placeholder="Learn. Love. Code.">
        </div>
        <div class="form-group">
          <label for="Author">Author</label>
          <input type="text" class="form-control" id=updated-author-${element.id} placeholder="Flatiron School">
        </div>
        <button id=submit-button-${element.id} type="submit" class="btn btn-primary">Submit</button>
      </form>
      </blockquote>
    </li>`
       if (document.getElementById(`edit-quote-form-${element.id}`)) {
         document.getElementById(`edit-quote-form-${element.id}`).hidden = true
       }
  })
}


document.addEventListener('DOMContentLoaded', ev => {
  const quoteInput = document.getElementById("new-quote")
  const authorInput = document.getElementById("author")

  fetchGet("http://localhost:3000/quotes",generateQuoteList)

  submitButton.addEventListener('click', ev => {
    ev.preventDefault()
     quoteList.innerHTML = ''
     updateFetch("http://localhost:3000/quotes", "POST",`${quoteInput.value}`, `${authorInput.value}`, "0")
   })

  quoteDiv.addEventListener('click', ev => {
    if(ev.target.className === "btn-danger") {
      quoteId = ev.target.id.slice(7)
        fetch(`http://localhost:3000/quotes/${quoteId}`, {method:"delete"})
        document.getElementById(`${quoteId}`).remove()
    }
    if(ev.target.className === "btn-success"){
      quoteId = parseInt(ev.target.id.slice(9))
    let likeCount = parseInt(document.getElementById("like-count-"+ `${quoteId}`).innerHTML)
    likeCount++
    document.getElementById("like-count-"+ `${quoteId}`).innerHTML = likeCount
          fetch(`http://localhost:3000/quotes/${quoteId}`, {
            method: 'PATCH',
            body:JSON.stringify({"likes":`${likeCount}`}),
            headers:{'Content-Type': 'application/json'}
          })
    }
    if(ev.target.className === "btn-info") {
      quoteId = parseInt(ev.target.id.slice(5))
      let editForm = document.getElementById("edit-quote-form-"+ `${quoteId}`)
      editForm.hidden = false
      let editSubmitButton = document.getElementById("submit-button-" + `${quoteId}`)
      let updatedQuote = document.getElementById("updated-quote-" +`${quoteId}`)
      let updatedAuthor = document.getElementById("updated-author-" +`${quoteId}`)
        editSubmitButton.addEventListener('click', ev => {
          ev.preventDefault()
          document.getElementById(`edit-quote-form-${quoteId}`).hidden = true
          if (updatedQuote.value && updatedAuthor.value){
          fetch(`http://localhost:3000/quotes/${quoteId}`, {
            method: 'PATCH',
            body:JSON.stringify({"quote":`${updatedQuote.value}`, "author": `${updatedAuthor.value}`}),
            headers:{'Content-Type': 'application/json'}
          })
          document.getElementById("quote-"+`${quoteId}`).innerText = updatedQuote.value
          document.getElementById("author-"+`${quoteId}`).innerText = updatedAuthor.value


          }
          else
          {alert("You have to fill out both pieces of information!")}
        })

    }
  })



})
