// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

document.addEventListener('DOMContentLoaded', function() {

  makeQuoteList()

  const submitButton = document.querySelector('#new-quote-form')
  submitButton.addEventListener('submit', handleSubmit)

})


// Fetch request of all quotes
function getQuotes() {
  return fetch("http://localhost:3000/quotes")
  .then(response => response.json())
}

// Fetch request to add quote
function addQuote(newQuote, author) {
  return fetch("http://localhost:3000/quotes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "quote": newQuote,
      "likes": 1,
      "author": author
    })
  })
  .then(response => response.json())
}

// Fetch request to change likes
function changeLikes(id, likes) {
  return fetch(`http://localhost:3000/quotes/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      'likes': likes
    })
  })
  .then(response => response.json())
}

// Fetch request to delete quote
function deleteQuote(id) {
  return fetch(`http://localhost:3000/quotes/${id}`, {
    method: "DELETE"
  })
  .then(response => response.json())
}

// Render quotes to page
function makeQuoteList() {
  getQuotes()
  .then(json => {
    const quoteList = document.querySelector('ul')
    json.forEach(quote => {
      listItem = document.createElement('li')
      listItem.setAttribute("class", 'quotepcard')
      listItem.setAttribute("id", quote.id)
      listItem.innerHTML = formatQuoteList(quote)
      quoteList.appendChild(listItem)
      quoteList.addEventListener('click', handleButtons)
    })
  })
}

// Format for each quote
function formatQuoteList(quote) {
  return `
      <blockquote class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success' success_id=${quote.id}>Likes: <span>${quote.likes}</span></button>
        <button class='btn-danger' danger_id=${quote.id}>Delete</button>
      </blockquote>
  `
}

// Handle Likes and Deletions
function handleButtons(e) {
  if (e.target.className === "btn-success") {
    document.querySelectorAll('.btn-success').forEach(button => {
      if (button.getAttribute('success_id') === e.target.attributes.getNamedItem('success_id').value) {
        newLikes = parseInt(button.innerText.slice(-1)) + 1
        button.innerText = button.innerText.slice(0,-1) + newLikes

        let id = e.target.attributes.getNamedItem('success_id').value
        changeLikes(id, newLikes)
      }
    })
  } else if (e.target.className === "btn-danger") {
    // Delete in database
    document.querySelectorAll('.btn-danger').forEach(button => {
      if (button.getAttribute('danger_id') === e.target.attributes.getNamedItem('danger_id').value) {
        deleteQuote(e.target.attributes.getNamedItem('danger_id').value)
        document.getElementById(e.target.attributes.getNamedItem('danger_id').value).hidden = true

      }
    })

    // Delete on page
    // let quote = document.querySelector(`.${e.target.className}`)

  }
}

function handleSubmit(e) {
  // e.preventDefault()

  const input = Array.from(e.target.querySelectorAll('input'))
  const newQuote = input[0].value
  const author = input[1].value

  input[0].value = ''
  input[1].value = ''

  addQuote(newQuote, author)


}
