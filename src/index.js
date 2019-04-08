// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading.

document.addEventListener("DOMContentLoaded", function(){
    getQuotes()
    likeDelete()
    addQuote()
    soryByAuthor()

})

let allQuotes

function getQuotes() {
    fetch(`http://localhost:3000/quotes`)
    .then(function(response){
        return response.json()
    })
    .then(function(quotes){
        allQuotes = quotes
        renderQuotes(quotes)
    })
}

function renderQuotes(quotes) {
    quoteList = document.querySelector('#quote-list')
    quoteList.innerHTML = ''
    quotes.forEach(function(quote){
        quoteList.appendChild(createQuote(quote))
    })

}

function createQuote(quote) {
    // debugger
    li = document.createElement('li')
    li.className = 'quote-card'
    li.dataset.quote = quote.id
    blockquote = document.createElement('blockquote')
    blockquote.className = 'blockquote'
    blockquote.innerHTML = `
    <p class="${quote.id}">${quote.quote}</p>
    <footer class="blockquote-footer">${quote.author}</footer>
    <br>
    <button class='btn-success'>Likes: <span>${quote.likes}</span></button>
    <button class='btn-danger'>Delete</button>
    <button class='btn-edit'>Edit</button>
    `
    li.appendChild(blockquote)
    return li
}

function likeDelete() {
    quoteList = document.querySelector('#quote-list')
    quoteList.addEventListener('click', function(e){
        if (e.target.className === 'btn-success') {
            quoteId = e.target.parentNode.children[0].className
            likes = e.target.querySelector('span').innerText
            intLikes = parseInt(likes) 
            updateLikes(quoteId, intLikes + 1, e.target)
        } else if (e.target.className ==='btn-danger') {
            quoteId = e.target.parentNode.children[0].className
            deleteQuote(quoteId, e.target)
        } else if (e.target.className === 'btn-edit') {
            // console.log(e.target)
            // debugger
            quoteId = e.target.parentNode.parentNode.dataset.quote
            quote = e.target.parentNode.children[0].innerText
            author = e.target.parentNode.children[1].innerText
            quoteCard = e.target.parentNode.parentNode
            // console.log(quoteId)
            // debugger
            editForm(quoteId, quote, author, quoteCard)
        }
    })
}

function updateLikes(quoteId, likes, button) {
    fetch(`http://localhost:3000/quotes/${quoteId}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: "PATCH",
        body: JSON.stringify({likes: likes})
    })
    .then(function(response){
        response.json()
    })
    .then(function(){
        span = button.querySelector('span')
        span.innerHTML = likes
    })
}

function deleteQuote(quoteId, button) {
    fetch(`http://localhost:3000/quotes/${quoteId}`, {
        method: "DELETE"
    })
    .then(function(response) {
        response.json()
    })
    .then(function() {
        button.parentNode.parentNode.remove()
    })
}

function addQuote() {
    submit = document.getElementsByClassName('btn btn-primary')[0]

    submit.addEventListener('click', function(e) {
        e.preventDefault()
        newQuote = document.querySelector('#new-quote')
        newAuthor = document.querySelector('#author')
        insertQuote(newQuote.value, newAuthor.value)
        // debugger
        newQuote.value = ``
        newAuthor.value = ``
    })
}

function insertQuote(newQuote, newAuthor) {
    fetch(`http://localhost:3000/quotes/`, {
        method: 'POST',
        body: JSON.stringify({quote: newQuote, likes: 0, author: newAuthor}),
        headers:{
          'Content-Type': 'application/json'
        }
      })
      .then(function(response){
        return response.json()
      })
      .then(function(quote){
        allQuotes.push(quote)
        renderQuotes([quote])
      })
}

function editForm(quoteId, quote, author, quoteCard) {
    // debugger
    quoteCard.innerHTML = `
    <form>
        <div class="form-group">
        <label for="edit-quote">Edit Quote</label>
        <input type="text" class="form-control" id="edit-quote">
        </div>
        <div class="form-group">
        <label for="Author">Edit Author</label>
        <input type="text" class="form-control" id="author">
        </div>
        <button type="submit" class="btn btn-secondary">Submit</button>
    </form>
    `
    // debugger
    previousQuote = quoteCard.querySelector('#edit-quote')
    editAuthor = quoteCard.querySelector('#author')
    previousQuote.value = quote
    editAuthor.value = author
    // editQuote(quoteId)
    // debugger
    submit = quoteCard.querySelector('button')
    submit.addEventListener('click', function(e){
        e.preventDefault()
        // debugger
        newQuote = e.target.previousElementSibling.previousElementSibling.lastElementChild.value
        newAuthor = e.target.previousElementSibling.lastElementChild.value
        quoteObj = { quote: newQuote, author: newAuthor}
        editQuote(quoteId, quoteObj, quoteCard)
    })
}

function editQuote(quoteId, quoteObj, quoteCard) {
    fetch(`http://localhost:3000/quotes/${quoteId}`, {
        method: 'PATCH',
        body: JSON.stringify(quoteObj), // data can be `string` or {object}!
        headers:{
          'Content-Type': 'application/json'
        }
      })
      .then(function(response){
          return response.json()
      })
      .then(function(editedQuote){
          renderEditedQuote(editedQuote, quoteCard)
      })
}

function renderEditedQuote(editedQuote, quoteCard) {
    // debugger
    quoteCard.innerHTML = ''
    blockquote = document.createElement('blockquote')
    blockquote.className = 'blockquote'
    blockquote.innerHTML = `
    <p class="${editedQuote.id}">${editedQuote.quote}</p>
    <footer class="blockquote-footer">${editedQuote.author}</footer>
    <br>
    <button class='btn-success'>Likes: <span>${editedQuote.likes}</span></button>
    <button class='btn-danger'>Delete</button>
    <button class='btn-edit'>Edit</button>
    `
    quoteCard.appendChild(blockquote)
}

function soryByAuthor() {
    authorSortButton = document.querySelector('.sort-author')
    authorSortButton.addEventListener('click', function(e){
        
        allQuotes.sort(function(a, b){
            return a.author.localeCompare(b.author)
        })
        renderQuotes(allQuotes)
    })
}