# Query.js

*To see Query.js in action, check out the
[Cardinal apps](https://cardinalapps.xyz).* 

Build powerful SQL queries in vanilla JS with this dependency free WordPress
inspired query builder library.

## Initializing a new Query
All `Query` instances have an asynchronous constructor, and must be `await`'ed.
See the [constructor options](#constructor-options).

```javascript
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

The `queryObj` is inspired by WordPress, but it is certainly not a full
implementation of the `WP_Query` constructor object.

### Constructor Options

- **`table`**: **Required.** The table name, without the prefix.

- **`prefix`**: If the database uses a table name prefix, it can be set here.
  All table names in all parts of the query do not require the prefix if it's
  set here. Defaults to `server_` for [Cardinal](https://cardinalapps.xyz)
  purposes.

- **`itemsPerPage`**: Defaults to 100. Set to -1 for no limit per page, which
  puts all results on page 1.

- **`columns`**: An object of `column: value` pairs that must exactly match the
  database contents. Values can be a string, number, or array. Or, an array
  of such objects. When performing a join, you can set the table name in
  the column name like `artists.id` to handle column name collisions. You
  may provide an "equalityOperator" key on a per-column-object basis so
  that queries of multiple compares can be combined (ie. get all artists
  except *these*).
   
- **`columnCompare`**: Operator used when querying for multiple columns. Either
  `AND` or `OR`. Defaults to `AND`.

- **`equalityOperator`**: Operator used when checking the value of the column.
  Can be `=`, `LIKE`, `IN`, or `NOT IN`. Defaults to `=`. When using `LIKE`,
  you must put `%` signs around your string.

- **`orderBy`**: Optionally order the results. Use an array of single entry
  objects of `column: order` key-value pairs. Orders are `ASC` and `DESC`.
  When omitted, the results are returned in the order that they exist in
  the database. This can also be set to the `rand` for random order.

- **`page`**: Initial page to load. Defaults to page 1. Use `goToPage()` to
  switch pages afterwards.

- **`join`**: An object that performs a table join, or an array of such
  objects. The object(s) support the following keys: 
   - **`table`**: The table name to join. 
   - **`on`**: An object of `PrimaryTableColumn:ForeignTableColumn` keys and
   values that produce the ON statement.
   - **`equalityOperator`**: Equality operator when joining tables. Defaults to `=`
   - **`type`**: Either `LEFT JOIN`, `INNER JOIN`, or `CROSS JOIN`. Defaults to
   `LEFT JOIN`.

- **`mode`**: For [Cardinal](https://cardinalapps.xyz) purposes. Either `http`
  or `ipc`. Defaults to `http`. See [Setting the
  Endpoint](#setting-the-endpoint)`.
  
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