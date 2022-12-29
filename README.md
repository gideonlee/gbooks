# Reading List Command Line Application
This application will allow you to search for books with the Google Books API and add them to a reading list. 

## Installation
Simply run npm install first and then install the Command Line Application to begin using gbooks. 
```
npm install
npm install -g .
```

## Usage

In the project directory, you can run:

### `gbooks query [search...]` || `gbooks q [search...]`
Query a book through Google Books API based the search argument. You can have spaces in the search. 

Search argument accepts spaces or quotes:
```
gbooks query "the stormlight archive"
gbooks query the stormlight archive
```

Alias/shortcut version:
```
gbooks q "the expanse"
```

If successfully queried, you will receive a list of five books with the title, author, and publisher based on your search results. You may choose to add one of these books to your reading list using the arrow keys and selecting with the enter key. You will also be given the option to choose none of these. 

Example:
```
// Your query search
gbooks query "the expanse"

// Use the arrow keys and select a book with enter
[?] Add a book to your Reading List: (Use arrow keys)
 >  The Expanse by James S.A. Corey (published by Boom! Studios)
    Persepolis Rising By James S. A. Corey (published by Orbit)
    Tiamat's Wrath by James S. A. Corey (published by Orbit)
    Leviathan Wakes by James S. A. Corey (published by Orbit)
    Caliban's Wary by James  S. A. Corey (published by Orbit)
    None of These.
```

If you successfully added a book to your reading list, you will a success message.
```
// Your query search
gbooks query "the expanse"

[?] Add a book to your Reading List: The Expanse by James S. A. Corey (published by Boom! Studios)
Successfully added The Expanse by James S. A. Corey (published by Boom! Studios)
```

If you try to add a book that is already in your reading list, you will receive a message indicating that it is already in your list and the duplicate book is not added.
```
// Your query search
gbooks query "the expanse"

[?] Add a book to your Reading List: The Expanse by James S. A. Corey (published by Boom! Studios)
The Expanse by James S. A. Corey (published by Boom! Studios) is already in your reading list.
```


### `gbooks list` || `gbooks l`
Displays your Reading List. If you haven't added a book, the reading list will be empty. 
```
gbooks list
```

Alias/shorthcut version: 
```
gbooks l
```

Example:
```
// Show your reading list
gbooks list

// Output
Reading List:
[
  // your books here,
  //  ...
]
```

### `gbooks -h` || `gbooks help`
Shows you the available options and commands using either the options flag or the command.

## Testing

### `npm test`
Launches the tests.
