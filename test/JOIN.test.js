import { flattenWhitespace } from './filters/whitespace.js'

// what we're testing
import { TestQuery } from './extend/TestQuery.js'

/**
 * Runs tests for the JOIN SQL.
 */
export async function joinTest() {
  ett.output('<h3>JOIN.test.js</h3>')

  let singleTable = await new TestQuery({
    'table': 'some_table',
    'prefix': '',
    'join': {
      'table': 'artists',
      'on': {
        'track_artist_id': 'id'
      }
    },
  })

  let singleExpectedSql = "SELECT some_table.id AS _primaryTableRowId, * FROM some_table LEFT JOIN artists ON some_table.track_artist_id = artists.id LIMIT 100"
  ett.isEqual(flattenWhitespace(singleTable.sql), singleExpectedSql, 'Can construct single table join')

  /**
   * Test 1
   */
  try {
    let twoTable = await new TestQuery({
      'table': 'some_table',
      'prefix': '',
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
    })

    let twoTableexpectedSql = "SELECT some_table.id AS _primaryTableRowId, * FROM some_table LEFT JOIN artists ON some_table.track_artist_id = artists.id INNER JOIN albums ON some_table.album_artist_id = albums.id LIMIT 100"
    ett.isEqual(flattenWhitespace(twoTable.sql), twoTableexpectedSql, 'Can construct two table join')
  } catch(e) { ett.fail(e) }
}