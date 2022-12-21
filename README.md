# Reading List Command Line Application

## Installation
Simply run npm install and then install Command Line Application to begin using this application. 
```
npm install
npm install -g .
```

## Usage

In the project directory, you can run:

### `gbooks query [search...]` || `gbooks q [search...]`
Query a book through Google Books API based the search argument. You can have spaces in the search.
You may add one of the query results to your Reading List.  

Search argument accepts spaces or quotes:
```
gbooks query "the stormlight archive"
gbooks query the stormlight archive
```

### `gbooks list` || `gbooks l`
Displays your Reading List.

### `gbooks -h`
Shows you the available options and commands

## Testing

### `npm test`
Launches the tests