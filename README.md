# sqleary.js

*To see sqleary.js in action, check out the
[Cardinal apps](https://cardinalapps.xyz).*

Build powerful SQL queries in vanilla JS with this dependency free WordPress
inspired query builder library.

## API Reference

A reference of all public sqleary.js methods is available in
**[DOCS.md](DOCS.md)**.

## Initializing a new Query
All `Query` instances have an asynchronous constructor, and must be `await`'ed.
See the [docs](DOCS.md) for all possible constructor options.

```javascript
import Query from 'sqleary.js'

async function getRows() {
  return await new Query({
    'table': 'tracks'
  })
}
```

## The queryObj

The `queryObj` is the object of parameters that is supplied to the constructor.
After initialization, the `queryObj` is saved internally, and as the `Query`
instance is used, the `queryObj` is kept up to date with the changes.

## Properties

After the Query is initialized, it will have these public properties.

- **`queryObj`**: The object equivalent of the SQL. If copied out and used to
  create a new `Query` instance, the instance internals will be exactly the
  same as the original. It is kept up to date when using `Query` methods.

- **`sql`**: SQL generated by the queryObj. It is always in sync with the
  `queryObj` property.

- **`page`**: The current page; a clone of `queryObj.page`, lifted to the top for
  convenience (to be beside `pages`).

- **`pages`**: The total number of possible pages for this particular query. It
  is calculated once when a `Query` is initialized. Since it is a separate
  heavier query, it is not recalculated again unless `calculateTotals()` is
  manually invoked.

- **`totalResults`**: The total possible number of results for this particular
  query. It is also only calculcated once on initialization. Use
  `calculateTotals()` to manually refresh it.

## Examples:

#### Get all rows from a table
```javascript
await new Query({
  'table': 'tracks',
  'itemsPerPage': -1
})
```

#### Get the first page of rows from a table
```javascript
// pagination is handled automatically
await new Query({
  'table': 'tracks'
})
```

#### Paging through data
```javascript
// automatically gets page 1 when no page is set
const tracks = await new Query({
  'table': 'tracks'
})

// instead of initializing a new Query for page 2, using goToPage will 
// update the tracks Query instance in-place
await tracks.goToPage(2)
```

#### Filter by column(s) and order the results
```javascript
await new Query({
  'table': 'tracks',
  'columns': {
    'album_title': 'Lateralus',
    'artist_name': 'Tool'
  },
  'orderBy': {
    'track_num': 'ASC'
  }
})
```

#### Get the rows with id 4, 5, 6, or 7.
```javascript
// when using an array of values for a column, you must also include
// the "equalityOperator" key.
await new Query({
  'table': 'albums',
  'columns': {
    'id': [4,5,6,7]
  },
  'equalityOperator': 'IN'
})
```

#### Partial string matching in column(s)
```javascript
// the equalityOperator can also be set on a per-column-object basis.
// note that this method will prevent you from having a database column
// named exactly "equalityOperator".
await new Query({
  'table': 'tracks',
  'itemsPerPage': -1,
  'columns': [
    {
      'genre_names': '%"Progressive Metal"%',
      'equalityOperator': 'LIKE'
    },
    {
      'genre_names': '%"Heavy Metal"%',
      'equalityOperator': 'NOT LIKE'
    },
    {
      'genre_names': '%"Metal"%',
      'equalityOperator': 'LIKE'
    },
  ],
  'columnCompare': 'AND',
})
```

#### Perform complex JOIN's
```javascript
let trackQueryWithArtist = await new Query({
  'table': 'tracks',
  'join': [
    {
      'table': 'artists',
      'on': {
        'track_artist_id': 'id'
      }
    },
    {
      'table': 'albums',
      'type': 'INNER JOIN',
      'on': {
        'album_artist_id': 'id'
      }
    }
  ],
  'columns': {
    'tracks.id': trackId
  }
})
```

## Setting the Endpoint

Query.js is designed for use in the [Cardinal apps](https://cardinalapps.xyz).
When used outside of a Cardinal app, you should extend the `Query` class and
override the internal `_send()` method.

```javascript
class MyQuery extends Query {
  _send(sql) {
    // sql is ready for execution
  }
}
```

Your implementation should send the SQL to a destination for execution. All
queries should be executed with the SQL driver's `all` (or equilivent) function.
Empty results should net an empty array.

## Testing

Testing is done using
[es6-test-tools](https://github.com/somebeaver/es6-test-tools). To start an
Express server that delivers the test suite to any browser, run:

```
$ npm run ett-server
```

Then visit `localhost:3000` to run the suite.

## License

Licensed under the Mozilla Public License 2.0.