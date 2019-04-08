// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
window.addEventListener("DOMContentLoaded", e => {
  console.log('DOM Content has loaded')

  const URL = "http://localhost:3000/quotes"
  const quoteUl = document.querySelector('#quote-list')
  const form = document.querySelector('#new-quote-form')

  fetchQuotes(URL, quoteLi)

  //EventListeners
  //new quote form submit EventListener
  form.addEventListener('submit', e => {
    e.preventDefault()
    let quoteText = document.querySelector('#new-quote').value
    let quoteAuthor = document.querySelector('#author').value
    let newQuoteObject = { quote: quoteText, author: quoteAuthor, likes: 0 }
    updateQuote(URL, "POST", newQuoteObject)
    form.reset()
  })

  //like and delete button EventListeners
  quoteUl.addEventListener('click', e => {
    e.preventDefault()
    let quoteId = e.target.dataset.id
    //delete button
    if(e.target.className === "btn-danger"){
      let deleteUrl = `${URL}/${quoteId}`
      updateQuote(deleteUrl, "DELETE")
    }
    //like button
    if(e.target.dataset.action === "like-button"){
      let likeUrl = `${URL}/${quoteId}`
      let likes = document.querySelector(`#like-${quoteId}`).querySelector('span').innerText
      likes++
      let likeObject = {likes: likes}
      updateQuote(likeUrl, "PATCH", likeObject)
    }
    //edit button
    if(e.target.className === "edit-link"){
      let editId = e.target.id
      let editButton = document.querySelector(`#${editId}`)

        if(editButton.innerHTML === "Edit Quote"){

          editButton.innerHTML = "Save"

          let parentQuote = document.querySelector(`#${editId}`).parentElement
          let parentDiv = document.querySelector(`#blockquote-${quoteId}`)
          let author = document.querySelector(`#author-${quoteId}`)
          let quote = document.querySelector(`#quote-${quoteId}`)

          let editForm = document.createElement('form')

          let authorFormInput = document.createElement('input')
          authorFormInput.type = "text"
          authorFormInput.className = "form-control"
          authorFormInput.id = "edit-author"
          authorFormInput.value = author.innerText

          let quoteFormInput = document.createElement('input')
          quoteFormInput.type = "text"
          quoteFormInput.className = "form-control"
          quoteFormInput.id = "edit-quote"
          quoteFormInput.value = quote.innerText

          parentDiv.prepend(editForm)
          editForm.appendChild(quoteFormInput)
          editForm.appendChild(authorFormInput)

        } else {
          editButton.innerHTML = "Edit Quote"
          let saveUrl = `${URL}/${quoteId}`
          let quoteText = document.querySelector('#edit-quote').value
          let quoteAuthor = document.querySelector('#edit-author').value
          let saveObject = {author: quoteAuthor, quote: quoteText}
          updateQuote(saveUrl, "PATCH", saveObject)
        }
    }
  })

  //helper functions
  function fetchQuotes(url, callBack){
    fetch(url)
    .then(res => res.json())
    .then(callBack)
  }

  function updateQuote(url, method, object){
    fetch(url, {
      method: method,
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(object)
    })
    .then(res => res.json())
    .then(data =>{
      fetchQuotes(URL, quoteLi)
    })
  }

  function quoteLi(data){
    quoteUl.innerHTML = ""
    data.forEach(quote => {
      // quoteUl.innerHTML +=
      // `
      // <li class='quote-card'>
      //   <blockquote class="blockquote">
      //     <p class="mb-0">${quote.quote}</p>
      //     <footer class="blockquote-footer">${quote.author}</footer>
      //     <br>
      //     <button class='btn-success', id=like-${quote.id}, dataset-action = "like-button">Likes: <span>${quote.likes}</span></button>
      //     <button class='btn-danger', dataset-id=${quote.id}>Delete</button>
      //   </blockquote>
      // </li>
      // `
      let quoteLi = document.createElement('li')
      quoteLi.className = "quote-card"
      quoteLi.id = `quoteLi-${quote.id}`
      quoteLi.dataset.id = quote.id

      let blockquote = document.createElement('blockquote')
      blockquote.className = "blockquote"
      blockquote.dataset.id = quote.id
      blockquote.id = `blockquote-${quote.id}`

      let quoteP = document.createElement('p')
      quoteP.innerText = quote.quote
      quoteP.className = "mb-0"
      quoteP.id = `quote-${quote.id}`
      quoteP.dataset.id = quote.id

      let quoteAuthor = document.createElement('footer')
      quoteAuthor.className = "blockquote-footer"
      quoteAuthor.id = `author-${quote.id}`
      quoteAuthor.innerText = quote.author

      let edit = document.createElement('a')
      edit.setAttribute('href', "")
      edit.className = "edit-link"
      edit.id = `edit-${quote.id}`
      edit.dataset.id = quote.id
      edit.innerHTML = "Edit Quote"

      let br = document.createElement('br')

      let likeButton = document.createElement('button')
      likeButton.className = "btn-success"
      likeButton.id = `like-${quote.id}`
      likeButton.dataset.action = "like-button"
      likeButton.dataset.id = quote.id
      likeButton.innerText = "Likes: "

      let span = document.createElement('span')
      span.dataset.spanAction = "like-button"
      span.id = `span-${quote.id}`
      span.innerText = quote.likes

      let deleteButton = document.createElement('button')
      deleteButton.className = "btn-danger"
      deleteButton.dataset.id = quote.id
      deleteButton.id = `delete-${quote.id}`
      deleteButton.innerText = "Delete"

      quoteUl.prepend(quoteLi)
      quoteLi.appendChild(blockquote)
      blockquote.appendChild(quoteP)
      blockquote.appendChild(quoteAuthor)
      quoteAuthor.appendChild(br)
      quoteLi.appendChild(edit)
      blockquote.appendChild(likeButton)
      likeButton.appendChild(span)
      blockquote.appendChild(deleteButton)
    })
  }

})
