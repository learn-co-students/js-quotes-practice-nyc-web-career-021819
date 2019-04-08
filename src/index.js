document.addEventListener("DOMContentLoaded", () => {
  // STATE
  let quotes;

  // DOM Nodes
  const quoteList = document.getElementById("quote-list");

  // FETCH
  apiAdaptor.getQuotes().then(quoteData => {
    quotes = quoteData;
    renderQuotes();
  });

  const createQuote = quote => {
    const li = document.createElement("li");
    li.className = "quote-card";
    li.innerHTML = `
      <blockquote class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span>${quote.likes}</span></button>
        <button class='btn-danger'>Delete</button>
      </blockquote>
    `;
    return li;
  };

  const renderQuote = quoteNode => {
    quoteList.appendChild(quoteNode);
  };

  const renderQuotes = () => {
    const quoteNodes = quotes.map(createQuote);
    quoteNodes.forEach(renderQuote);
  };
});
