import {bookSearch, formatSearchResults, checkReadingList} from '../utils'
import {faker} from '@faker-js/faker'
import fetchMock from 'fetch-mock'

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

// Mock Google Books API Query Results
const numberOfResults = 5
let mockQueryResults = []
let mockResponse = []

beforeEach(() => {
  // Generate query results
  mockQueryResults = []
  for (let i = 0; i < numberOfResults; i++) {
    mockQueryResults.push(generateMockQueryResult())
  }

  // Mock expected response
  // [
  //  {
  //    name: TITLE by AUTHORS (published by PUBLISHER),
  //    short: TITLE
  //    value: TITLE by AUTHORS,
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
      value: `${title}${authors ? ' by ' + authors : ''}`,
      short: `${title}`,
    }
  })
})

describe('bookSearch()', () => {  
  
  const query = ['The', 'Expanse']

  test('expect bookSearch to return formatted query results', async () => {
    // Mock Fetch requests that begin with the books API URL
    const bookSearchMock = fetchMock.mock(`begin:https://www.googleapis.com/books/v1/volumes`, () => {
      // Mock Intermediate values from API
      return {status: 200, items: mockQueryResults}
    }, {
      method: 'GET', 
      headers: {'Content-Type': 'application/json'}
    })
    
    bookSearch({query: query}).then(async response => {
      expect(response.books).toStrictEqual(mockResponse)
    })
  })
})

describe('formatSearchResults()', () => {
  test('should return an array of formatted query results', () => {
    const formattedResults = formatSearchResults(mockQueryResults) 
    expect(formattedResults).toStrictEqual(mockResponse)
  })
})

describe('checkReadingList(): readingList is empty', () => {
  let book = `${faker.random.words()} by ${faker.name.fullName()}`

  test('isInList should return false.', () => {
    const {isInList} = checkReadingList(book, [])
    expect(isInList).toBe(false)
  })
})

describe('checkReadingList(): readingList already has selected book', () => {
  let readingList = []
  let book = ''
  let fakeIndex = parseInt(faker.random.numeric())

  beforeEach(() => {
    // Populate random list of books 
    for(let i = 0; i < faker.random.numeric(2); i++) {
      let title = faker.random.words()
      let author = faker.name.fullName()
      readingList.push(`${title} by ${author}`)
    }

    // Pick a book from that list. 
    book = readingList[fakeIndex]
  })

  test('isInList should return true', () => {
    const {isInList} = checkReadingList(book, readingList)
    expect(isInList).toBe(true)
  })
})