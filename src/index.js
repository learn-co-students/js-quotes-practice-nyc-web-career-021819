// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

document.addEventListener("DOMContentLoaded", function() {

const URL = "http://localhost:3000/quotes"
const listOfQuotes = document.querySelector("#quote-list") // the ul on the page, where the quotes belong
const newQuoteForm = document.querySelector("#new-quote-form") //the submit form
let quotes = []

//Populate page with quotes with a GET request
  fetch(URL)
    .then(function(response) {
      return response.json()
    })//end of first then.
    .then(function(json) {
      quotes = json
      listOfQuotes.innerHTML = ""
      renderAllQuotes()
    })//end of second .then


function renderOneQuote(quote) {
  listOfQuotes.innerHTML += `
    <li data-id='${quote.id}' class='quote-card'>
      <blockquote class="blockquote">
        <p data-id='quote-${quote.id}' class="mb-0">${quote.quote}</p>
          <footer data-id=author-'${quote.id}' class="blockquote-footer">${quote.author}</footer>
            <br>
            <button data-id='${quote.id}' data-action='like' class='btn-success'>Likes: <span>${quote.likes}</span></button>
            <button data-id='${quote.id}' data-action='delete' class='btn-danger'>Delete</button>
      </blockquote>
    </li>
  `
}

    function renderAllQuotes() {
      listOfQuotes.innerHTML = ""
      return quotes.forEach(function(quote) {
        renderOneQuote(quote)
      })//end of forEach
    }//end of displayQuotes

    //Submitting the form creates a new quote and adds it to the list of quotes without having to refresh the page
    newQuoteForm.addEventListener("submit", function(e) {
      e.preventDefault() //stops the form from refreshing the page
      const quoteValue = document.querySelector("#new-quote").value  //gets value in the quote input field
      const authorValue = document.querySelector("#author").value  //gets value for the author input field
      fetch(URL, {
        method: "POST",
        headers: {
                  'Content-Type': 'application/json'
                },
        body: JSON.stringify({quote: quoteValue, author: authorValue, likes: 0})
      })//end of fetch
      .then(function(response) {
        return response.json()
      })//end of first then.
      .then(function(json) {
        quotes.push(json) // pushes the added quote into the global quote array
        renderOneQuote(json)
      })//end of 2nd .then
    })//end of newQuoteForm.addEventListener

  //clicking the delete button should delete the respective quote from the database and remove it from the page without having to refresh.
  listOfQuotes.addEventListener("click", function(e) {
    if (e.target.dataset.action === "delete") {
      const deleteID = e.target.dataset.id
      deleteTheQuote(deleteID)
    } else if (e.target.dataset.action === "like") {
      const likeID = e.target.dataset.id
      likeTheQuote(likeID)
    }//end of if
  })//ends listOfQuotes.addEventListener

  function deleteTheQuote(id) {
      fetch(`${URL}/${id}`, {
        method: "DELETE",
      })//end of fetch
      .then(function(response) {
        return response.json()
      })//end of first then.
      .then(function(json) {
        const deletedQuote = document.querySelector(`li[data-id="${id}"]`) //grabs the quote from the LIST based on the data id
        listOfQuotes.removeChild(deletedQuote) //removes the quote from the list
      })//end of 2nd .then
  }//end of deleteTheQuote

  function likeTheQuote(id) {
    const selectedQuote = quotes.find(function(quote) { //looks through all the quotes
      return quote.id === parseInt(id)                  // to find one that matches the passed in ID
    })
      selectedQuote.likes++
    fetch(`${URL}/${id}`, {
      method: "PATCH",
      headers: {
                'Content-Type': 'application/json'
              },
      body: JSON.stringify({likes: selectedQuote.likes})
    })//end of fetch
    //optimistic rendering
    renderAllQuotes()

    // .then(function(response) {
    //   return response.json()
    // })//end of first then.
    // .then(function(json) {
    //   renderAllQuotes()
    // })//end of 2nd .then
  }// end of likeTheQuote



}) // end of the DOMContentLoaded
