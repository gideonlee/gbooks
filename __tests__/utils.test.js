import {bookSearch, formatSearchResults} from '../utils'
import {faker} from '@faker-js/faker'
import fetchMock from 'fetch-mock'

// Mock Google Books API Query Results
const numberOfResults = 5
let mockQueryResults = []
let mockResponse = []

// Generates a mocked book search result that returns a title, author, and publisher.
const generateMockQueryResult = () => {
  let numberOfAuthors = faker.datatype.number({max: 3, min: 1})
  let authors = []

  for (let i = 0; i < numberOfAuthors; i++) {
    authors.push(`${faker.name.fullName()}`)
  }
  
  return { 
    volumeInfo: {  
      title: `${faker.random.words()}`,
      authors: authors,
      publisher: `${faker.company.name()}`
    }
  }
}

beforeEach(() => {
  // Generate mocked query results based on desired number of results.
  mockQueryResults = []
  for (let i = 0; i < numberOfResults; i++) {
    mockQueryResults.push(generateMockQueryResult())
  }

  // Generate a mocked response.
  // Mock expected response
  // [
  //  {
  //    name: TITLE by AUTHORS (published by PUBLISHER),
  //    value: TITLE by AUTHORS (published by PUBLISHER),
  //   }, ...
  // ]
  mockResponse = new Array(numberOfResults)
  .fill()
  .map((element, i) =>  {
    let title = mockQueryResults[i].volumeInfo.title
    let authors = mockQueryResults[i].volumeInfo.authors?.join(', ')
    let publisher = mockQueryResults[i].volumeInfo.publisher

    return {
      name: `${title}${authors ? ' by ' + authors : ''}${publisher ? ' (published by ' + publisher + ')' : ''}`,
      value: `${title}${authors ? ' by ' + authors : ''}${publisher ? ' (published by ' + publisher + ')' : ''}`,
    }
  })
})

describe('bookSearch()', () => {  
  beforeEach(() => {
    fetchMock.reset()
  })
  
  test('expect bookSearch to return successfully with formatted query results', async () => {
    const query = ['The', 'Expanse']

    // Mock happy fetch requests that begin with the books API URL
    const bookSearchMock = fetchMock.mock(`begin:https://www.googleapis.com/books/v1/volumes`, () => {
      // Mock Intermediate values from API
      return {status: 200, items: mockQueryResults}
    }, {
      method: 'GET', 
      headers: {'Content-Type': 'application/json'}
    })

    // Expect a successful response 
    bookSearch({query: query}).then(async response => {
      expect(response.success).toEqual(true)
      expect(response.books).toStrictEqual(mockResponse)
    })
  })

  test('expect bookSearch to return an error message if query is missing.', async () => {
    const query = []
    const errorMessage = 'Missing Query.'

    // Mock sad fetch requests that begin with the books API URL
    const bookSearchErrorMock = fetchMock.mock(`begin:https://www.googleapis.com/books/v1/volumes`, () => {
      // Mock Intermediate values from API
      throw {status: 400, message: errorMessage, errors: {message: errorMessage}}
    }, {
      method: 'GET', 
      headers: {'Content-Type': 'application/json'}
    })

    // Expect an error message when query is not provided
    bookSearch({query: query}).then(async response => {
      expect(response.success).toEqual(false)
      expect(response.books).toEqual(null)
      expect(response.message).toEqual(`Error: ${errorMessage}`)
    })
  })

  test('expect bookSearch to return an empty list if no search results are found.', async () => {
    const query = [faker.random.alphaNumeric(10)]

    const bookSearchEmptyListMock = fetchMock.mock(`begin:https://www.googleapis.com/books/v1/volumes`, () => {
      // Mock Intermediate values from API
      return {status: 200, items: []}
    }, {
      method: 'GET', 
      headers: {'Content-Type': 'application/json'}
    })

    bookSearch({query: query}).then(response => {
      expect(response.success).toEqual(true)
      expect(response.books).toEqual([])
    })
  })
})

describe('formatSearchResults()', () => {
  test('should return an array of formatted query results', () => {
    const formattedResults = formatSearchResults(mockQueryResults) 
    expect(formattedResults).toStrictEqual(mockResponse)
  })
})