# Query.js - Dependency free vanilla JavaScript SQL query builder

##### (To see Query.js in action, check out Hydra Media Center)

Build powerful SQL queries with a WordPress inspired query builder class.

## Usage examples:

#### Get all tracks
```javascript
await new Query({
  'table': 'tracks',
  'itemsPerPage': -1
})
```

#### Since pagination is automatically applied, this will get the first page of tracks.
```javascript
await new Query({
  'table': 'tracks'
})
```

#### Get the second page of tracks after loading the first page
```javascript
const tracks = await new Query({
  'table': 'tracks'
})

// this is the optimized way of paging through data, instead of initializing a new Query
// for each page. this will update the tracks Query instance in-place
await tracks.goToPage(2)
```

#### Get tracks from a specific album, sorted by track number
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

#### Get the albums with the ID 4, 5, 6, or 7. 
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

#### Get all tracks within a few certain genres
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

#### Get a single track row with the artist row joined in
```javascript
let trackQueryWithArtist = await new Query({
  'table': 'tracks',
  'columns': {
    'tracks.id': trackId
  },
  'join': {
    'table': 'artists',
    'on': {
      'track_artist_id': 'id'
    }
  }
})
```

### Public Properties

After the Query is initialized, it will have this public properties.

- `queryObj`: The object equivalent of the SQL. If copied out and used to
  create a new Query instance, the instance internals will be exactly the
  same as the original. It is kept up to date when using Query methods. This
  is the object that the codebase refers to when referencing "the queryObj".

- `sql`: SQL generated by the queryObj. It is always in sync with the
  `queryObj` property.

- `page`: The current page; a clone of `queryObj.page`, lifted to the top for
  convenience (to be beside `pages`).

- `pages`: The total number of possible pages for this particular query. It
  is calculated once when the Query is initialized. Since it is a separate
  heavier query, it is not recalculated again unless `calculateTotals()` is
  manually invoked.

- `totalResults`: The total possible number of results for this particular
  query. It is also only calculcated once on initialization. Use
  `calculateTotals()` to manually refresh it.
/