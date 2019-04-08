const apiAdaptor = (() => {
  // constants
  const baseUri = "http://localhost:3000/quotes";
  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json"
  };

  // exported functions
  const getQuotes = () => {
    return _fetchAndParse(baseUri);
  };

  const postQuote = quote => {
    const options = {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify(quote)
    };
    return _fetchAndParse(baseUri, options);
  };

  // private functions
  const _fetchAndParse = (endpoint, options) => {
    return fetch(endpoint, options).then(r => r.json());
  };

  // return the methods you want to give access to
  return {
    getQuotes,
    postQuote
  };
})();
