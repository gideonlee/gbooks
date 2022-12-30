import 'isomorphic-fetch'

// Book search function takes in a query argument and returns a list of books on a successful request. maxResults default = 5. 
const bookSearch = ({query, maxResults = 5}) => {
  let search = query.join(' ')
  const url = `https://www.googleapis.com/books/v1/volumes?q=${search}&maxResults=${maxResults}&fields=items(volumeInfo/title,volumeInfo/authors,volumeInfo/publisher)`

  return fetch(url, {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
  })
  .then(async response => {
    const data = await response.json()  
    if (response.status === 200) {
      // Return formatted queried book result
      return {success: true, books: formatSearchResults(data.items)}
    } else {
      // Bad request
      return {
        success: false, 
        books: null, 
        message: `Error: ${data?.error?.message ? data?.error?.message : 'Invalid request.'}`
      }
    }
  })
  .catch((err) => {
    return {success: false, books: null, message: `Error: ${err.message}`}
  })
}

// Formats the queried results
// e.g. "TITLE by AUTHORS (published by PUBLISHER)"
const formatSearchResults = (bookList) => {
  let formattedBookList = []

  if (bookList) {
    bookList.forEach((book) => {
      // Comma separate multiple authors
      let authors = book?.volumeInfo?.authors?.join(', ')
      let publisher = book?.volumeInfo?.publisher
      // Inquirer choices prompt {name, value}
      let choice = {
        name: `${book?.volumeInfo?.title}${authors ? ' by ' + authors : ''}${publisher ? ' (published by ' + publisher + ')' : ''}`,
        value: `${book?.volumeInfo?.title}${authors ? ' by ' + authors : ''}${publisher ? ' (published by ' + publisher + ')' : ''}`,
      }
      formattedBookList.push(choice)
    })
  }

  return formattedBookList
}

// Shows help menu
const showHelpCommands = () => {
  console.log(`Usage: books [options] [command] \n`)
  console.log(`Allows you to use the Google Books API to search for books and construct a reading list.\n`)
  console.log(`Options:`)
  console.log(` -V, --version \t\t output the version number`)
  console.log(` -h, --help \t\t display help for command\n`)
  console.log(`Commands:`)
  console.log(` query|q [search...] \t query a book for search argument`)
  console.log(` list|l \t\t display reading list`)
  console.log(` help [command] \t display help for command`)
}

export {bookSearch, formatSearchResults, showHelpCommands}