#!/usr/bin/env node
import {program} from 'commander'
import inquirer from 'inquirer'
import conf from 'conf'
import {bookSearch, checkReadingList} from './utils.js'

const config = new conf()

program
  .version('1.0.0')
  .name('gbooks')
  .description('Allows you to use the Google Books API to search for books and construct a reading list.')

// Query Command
program
  .command('query [search...]')
  .alias('q')
  .description('Query a book by search argument')
  .action(query => {
    bookSearch({query: query})
    .then((res) => {
      if (res.success) {
        // Prompt user to add book based on query results. Allows for none of these.  
        inquirer.prompt([
          {
            type: 'list',
            name: 'book',
            message: `Add a book to your Reading List:`,
            choices: res.books.concat(['None of these.'])
          }
        ])
        .then(answer => {
          // If book is selected, add book to list if it's not already in the list
          if (answer.book !== 'None of these.') {
            // Get the reading list or create an empty list
            let readingList = config.get('readingList') || []

            // Check if book is already in list 
            const {isInList} = checkReadingList(answer.book, readingList)

            // Add book if it isn't in reading list
            if (!isInList) {
              readingList.push(answer.book)
              config.set('readingList', readingList)
              console.log(`Successfully added ${answer.book}`)
            } else {
              console.log(`${answer.book} is already in your reading list.`)
            }
          }
        })
      } else {
        // bookSearch error response.
        console.log(res.message)
      }
    })
  })

  
// List Command
program
  .command('list') 
  .alias('l')
  .description('Display reading list')
  .action(() => {
    console.log('Reading List:')
    console.log(config.get('readingList'))
  })

program
  .parse(process.argv)