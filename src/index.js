// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
const quoteList = document.querySelector('#quote-list')

document.addEventListener('DOMContentLoaded', ev => {
  quoteList.innerHTML += renderSingleQuote()
  // console.log(deleteBtn)
  
  
  quoteList.addEventListener('click', (ev) => {
    const quoteBlock = quoteList.getElementsByTagName('btn-danger')
    console.dir(quoteBlock)
    // const deleteBtn = document.querySelector('.blockquote')
    const quoteId = parseInt(ev.target.dataset.id)
    
    if (ev.target.dataset.id == quoteId) {
      // console.log(ev.target.dataset.id)
      //  let likeNum = parseInt(currentLikeCount.innerText)
      //   likeNum += 1
      //   currentLikeCount.innerText = likeNum //DOM update
      //   fetch(`http://localhost:3000/quotes/${quoteId}`,
      //     {method: "patch",
      //     headers: {"Content-Type": "application/json"},
      //     body: JSON.stringify({
      //       like: likeNum
      //     })
      //   })//end of Fetch
    } else if (ev.target.className == 'btn-danger') {
      console.log('Delete')
    }
  })
})// end of CONTENT LOADED EVENT

const renderSingleQuote = function () {
  fetch('http://localhost:3000/quotes')
    .then(res => res.json())
    .then((quotesArr) => {
     return quotesArr.map(quoteObj => {
        return quoteList.innerHTML += `
          <li class='quote-card'>
            <blockquote class="blockquote">
              <p class="mb-0">${quoteObj.quote}</p>
              <footer class="blockquote-footer">${quoteObj.author}</footer>
              <br>
              <button class='btn-success' data-id="${quoteObj.id}">Likes: <span>0</span></button>
              <button class='btn-danger'>Delete</button>
            </blockquote>
          </li>
                 `
      }).join('')
    })
}
