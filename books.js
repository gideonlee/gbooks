#!/usr/bin/env node
import inquirer from 'inquirer'
import conf from 'conf'
import {bookSearch, showHelpCommands} from './utils.js'

const config = new conf()

const args = process.argv
const version = `1.0.0`
const commands = ['query', 'list', 'help']

const books = () => {
  if (args.length === 2) {
    // No command is provided, show the commands. Usage: `books` 
    showHelpCommands()
  } else {
    if (args[2]) {
      // A command has been provided. Usage: `books <command>`
      const command = args[2]

      if (command === `-${commands[2][0]}` || command === `--${commands[2]}` || command === commands[2]) {
        // Help command/option. Usage: `books -h, --help, help`
        showHelpCommands()
      } else if (command === '-V' || command === '--version') {
        // Version option. Usage: `books -V, --version`
        console.log(version)
      } else if (command === commands[1][0] || command === commands[1]) {
        // List command. Usage: `books l, list`
        console.log('Reading List:')
        console.log(config.get('readingList'))
      } else if (command === commands[0][0] || command === commands[0]) {
        // Query command. Usage: `books q, query [search...]`
        if (args.length === 3) {
          // No search argument provided, missing query error. 
          // Usage: `books q, query`
          console.log(`Error: Missing query. Try adding a book title to query (e.g. books query "A BOOK TITLE").`)
        } else {
          // Run bookSearch with the query, which is all of the remaining arguments
          // Usage: `books q, query [search...]`
          const query = args.slice(3, args.length)

          bookSearch({query: query})
          .then((res) => {
            if (res.success) {
              if (res.books.length === 0) {
                // Query returned zero results.
                console.log('No results found.')
              } else {
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
                    const isInList = readingList.includes(answer.book)
        
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
              }
            } else {
              // bookSearch error response.
              console.log(res.message)
            }
          })
        }
      } else {
        // No command found. Attempt to match an existing command.
        const maxLengthDifference = 2
        let potentialMatch = ''
        
        // Simple check for potential matches based on matching first char of command argument 
        // and if the lengths are approximately equivalent (by maxLengthDifference)
        commands.forEach(actualCommand => {
          if (command[0] === actualCommand[0] && Math.abs(command.length - actualCommand.length) <= maxLengthDifference) {
            potentialMatch = actualCommand
          }
        })
        
        // If potential match is found, suggest match.
        if (potentialMatch !== '') {
          console.log(`Error: unknown command '${command}'. Did you mean '${potentialMatch}'?`)
        } else {
          console.log(`Error: unknown command '${command}'. Try using 'help' to get the a list of the commands.`)
        }
      }
    }
  }
} 

books()