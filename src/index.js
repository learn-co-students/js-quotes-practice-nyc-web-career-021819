

// Allow for JS file to run early in page load but not hold up load
document.addEventListener('DOMContentLoaded', e => {
// track application state
let body = document.querySelector('body')
let quotes = [];
let filteredQuotes = [];
// DOM manipulation variables
let quoteList = document.querySelector('#quote-list')
let newQuoteForm = document.querySelector('#new-quote-form')
let newQuote = document.querySelector('#new-quote')
let author = document.querySelector('#author')
let likeButton;
let deleteButton;
let currentQuote;
let currentQuoteCard;
let editQuoteForm;


// send inital fetch to grab quote data
initialLoad()

// Create filter functionality
filterContainer = document.createElement('div')
body.appendChild(filterContainer)
filterContainer.innerHTML = `
<form id="filter-authors-form">
    <label for="quotes-filter">Filter by Author:</label>
    <input list="quote-authors" id="quotes-filter-selection" name="quotes-filter-selection" type="text" />
    <datalist id="quote-authors"></datalist>
    <button type="submit" id="submit">Filter Authors</button>
</form>`
let authorDataList = document.getElementById('quote-authors')
// <option value="Chocolate">
let authorOption;
editQuoteForm = document.getElementById('edit-quote-form')
// why is below null?
document.querySelector('form#filter-authors-form').addEventListener('submit', onSubmit);
// 
function onSubmit(e) {
e.preventDefault()
filteredAuthor = document.querySelector('#quotes-filter-selection')
console.log(filteredAuthor)
// assign value to filtered quotes
quotes.forEach(quote => {
    if (quote.author === filteredAuthor.value) {
        filteredQuotes.push(quote)
    }
})
console.log(filteredQuotes)
// re-render page with this instead of quotes
quoteList.innerHTML = ''
filteredQuotes.forEach(quote => renderQuote(quote))
}



// Submit event and relevant variables
newQuoteForm.addEventListener('submit', e => {
e.preventDefault()
if (e.target === newQuoteForm) {
    let newQuoteObj = {
        quote: newQuote.value,
        likes: 0,
        author: author.value
    }

// Variable for fetch
let newQuoteConfig = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(newQuoteObj)
}

// Function for posting new quote data
async function postNewQuote() {
    let resp = await fetch('http://localhost:3000/quotes', newQuoteConfig)
    let quoteFromDB = await resp.json()
    quotes.push(quoteFromDB)
    quoteList.innerHTML = ''
    quotes.forEach(quote => renderQuote(quote))
}

postNewQuote()
}


})

// add like and delete click functionality
quoteList.addEventListener('click', e => {
    console.log(e.target)
    console.log('clikced')
if (e.target.dataset.action === "Like") {
    console.log('clikced222')
    let updateQuote = quotes.find(quote => quote.id === parseInt(e.target.dataset.id))
    console.log(updateQuote)
    updateQuote.likes++
    console.log(updateQuote)
    let updateQuoteLikesObj = {
        likes: updateQuote.likes,
    }

// Variable for fetch
let updateQuoteLikesConfig = {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(updateQuoteLikesObj)
}

// Function for posting new quote data
async function updateQuoteLikes() {
    let resp = await fetch(`http://localhost:3000/quotes/${updateQuote.id}`, updateQuoteLikesConfig)
    let updatedQuote = await resp.json()
    quoteList.innerHTML = ''
    quotes.forEach(quote => renderQuote(quote))
}

updateQuoteLikes()
} else if (e.target.dataset.action === "Delete") {
    console.log('clikced333')
    let quoteToDelete = quotes.find(quote => quote.id === parseInt(e.target.dataset.id))
    console.log(quoteToDelete)
    console.log(quoteToDelete)
    let quoteToDeleteLikesObj = {
        likes: quoteToDelete.likes,
    }

// Variable for fetch
let deleteQuoteConfig = {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({id: quoteToDelete.id})
}

// Function for posting new quote data
async function deleteQuote() {
    let resp = await fetch(`http://localhost:3000/quotes/${quoteToDelete.id}`, deleteQuoteConfig)
    let deletedQuote = await resp.json()
    console.log(quotes)
    quotes.splice(quotes.indexOf(quoteToDelete),1)
    console.log(quotes)
    quoteList.innerHTML = ''
    quotes.forEach(quote => renderQuote(quote))
}

deleteQuote()
} else if (e.target.dataset.action === "Edit") {
    editQuoteForm = 
    // render an edit form under the quote card for the current quote
    console.log('in edit')
    console.log(quotes)
    // identify current quote card and append edit form as child
    currentQuote = quotes.find(quote => quote.id === parseInt(e.target.dataset.id))
    currentQuoteCard = e.target.parentElement.parentElement
    console.log(currentQuote)
    editFormContainer = document.createElement('div')
    currentQuoteCard.appendChild(editFormContainer)
    editFormContainer.innerHTML = `
    <form id="edit-quote-form">
      <div class="form-group">
        <label for="edit-quote">Edit Quote</label>
        <input type="text" class="form-control" id="edit-quote" value="${currentQuote.quote}">
      </div>
      <div class="form-group">
        <label for="edit-author">Edit Author</label>
        <input type="text" class="form-control" id="edit-author" value="${currentQuote.author}">
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>`
    editQuoteForm = document.getElementById('edit-quote-form')

    editQuoteForm.addEventListener('submit', e => {
        e.preventDefault()
        // get submitted values
        editedQuote = document.getElementById('edit-quote').value
        editedAuthor = document.getElementById('edit-author').value
        
        // update local app state
        currentQuote.quote = editedQuote
        currentQuote.author = editedAuthor
        
        // update db
        let editedQuoteObj = {
            quote: editedQuote,
            author: editedAuthor
        }
        
        let editedQuoteConfig = {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(editedQuoteObj)
        }
        
        // Function for posting new quote data
        async function updateEditedQuote() {
            let resp = await fetch(`http://localhost:3000/quotes/${currentQuote.id}`, editedQuoteConfig)
            let updatedQuote = await resp.json()
            quoteList.innerHTML = ''
            quotes.forEach(quote => renderQuote(quote))
        }
        
        updateEditedQuote()
        
        // remove edit form/reload page through fetch
        })
}
})














// Functions for dom manipulation
function renderQuote(quote) {
quoteList.innerHTML += `
    <li class='quote-card' data-id=${quote.id}>
    <blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button data-id=${quote.id} data-action ="Like" class='btn-success'>Likes: ${quote.likes}</button>
      <button data-id=${quote.id} data-action ="Delete" class='btn-danger'>Delete</button>
      <button data-id=${quote.id} data-action ="Edit" class='btn-edit'>Edit</button>
    </blockquote>
  </li>`
}








// Functions for fetching data
async function initialLoad() {
    let resp = await fetch('http://localhost:3000/quotes')
    let quotesFromDB = await resp.json()
    quotes = await quotesFromDB
    quotes.forEach(quote => renderQuote(quote))
    quotes.forEach(quote => {
        console.log(quote)
        currentAuthor = quote.author
        authorOption = document.createElement('option')
        authorOption.value = currentAuthor
        authorDataList.appendChild(authorOption)
    })
}



})