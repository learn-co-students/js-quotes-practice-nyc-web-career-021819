// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

//Elements
const quoteContainer = document.querySelector('#quote-list')
const newQuoteForm = document.querySelector('#new-quote-form')

//Render quotes
fetchQuoutes()

//Event Listeners
newQuoteForm.addEventListener('click', addQuote);
quoteContainer.addEventListener('click', deleteQuote);

//Fetch quotes
function fetchQuoutes() {
  fetch('http://localhost:3000/quotes')
  .then((res) => {return res.json()})
  .then((data) => {
    let output = ''
    data.forEach((quote) => {
      output +=
      `
      <li class='quote-card' data-id="${quote.id}">
        <blockquote class="blockquote">
          <p class="mb-${quote.id}">${quote.quote}</p>
          <footer class="blockquote-footer">${quote.author}</footer>
            <form id="edit-quote-form" style="display: none" data-id="${quote.id}">
              <div class="form-group">
                <label for="edit-quote">Edit Quote</label>
                <input type="text" class="form-control" id="edit-quote" placeholder="Quote: ${quote.quote}">
              </div>
              <div class="form-group">
                <label for="Author">${quote.author}</label>
                <input type="text" class="form-control" id="edit-author" placeholder="Author: ${quote.author}">
              </div>
              <button type="submit" class="btn btn-primary">Submit</button>
            </form>
          </div>
          <br>
          <button class='btn-success'>Likes: <span id="quote-likes">${quote.likes}</span></button>
          <button class='btn-danger'>Delete</button>
          <button class='btn-primary'>Edit</button>
        </blockquote>
      </li>

      `
    })
    quoteContainer.innerHTML = output
  })
}

//Add quote
function addQuote(e) {
  if (e.target.className === 'btn btn-primary') {
    e.preventDefault()
    let quote = document.querySelector('#new-quote').value
    let author = document.querySelector('#author').value
    fetch('http://localhost:3000/quotes', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({quote:quote, author:author, likes:0})
    })
    .then((res) => {return res.json()})
    .then((data) => {
      fetchQuoutes()
    })
  }
}

//Delete quote
function deleteQuote(e) {
  if (e.target.className === 'btn-danger') {
    let quoteId = e.target.parentElement.parentElement.dataset.id
    fetch(`http://localhost:3000/quotes/${quoteId}`, {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id: `${quoteId}`})
    })
    .then((res) => {res.json()})
    .then((data) => {
      fetchQuoutes()
    })
  }

//Add like
  if (e.target.className === 'btn-success') {
    let quoteLikes = e.target.querySelector('#quote-likes')
    let addLike = parseInt(quoteLikes.innerText) + 1
    quoteLikes.innerText = addLike
    let quoteId = e.target.parentElement.parentElement.dataset.id
    fetch(`http://localhost:3000/quotes/${quoteId}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({likes:parseInt(quoteLikes.innerText)})
    })
  }

  //Edit button
  if (e.target.className === 'btn-primary') {
    let editForm = e.target.parentElement.querySelector('#edit-quote-form')
    editForm.style.display = "block"
    editForm.addEventListener('submit', editQuote);
  }
}

//Edit function
function editQuote(e) {
  e.preventDefault()
  let quoteId = e.target.dataset.id
  let quote = document.querySelector('#edit-quote').value
  let author = document.querySelector('#edit-author').value
  fetch(`http://localhost:3000/quotes/${quoteId}`, {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({quote:quote, author:author})
  })
  .then((res) => {res.json()})
  .then((data) => {
    fetchQuoutes()
  })
}
