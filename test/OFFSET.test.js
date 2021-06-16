import { flattenWhitespace } from './filters/whitespace.js'

// what we're testing
import { TestQuery } from './extend/TestQuery.js'

/**
 * Runs tests for the OFFSET SQL.
 */
export async function offsetTest() {
  ett.output('<h3>OFFSET.test.js</h3>')

  /**
   * Get page 1.
   */
  try {
    let basic = await new TestQuery({
      'table': 'some_table',
      'prefix': '',
    })

    let expectedBasicSql = "SELECT * FROM some_table LIMIT 100"
    ett.isEqual(flattenWhitespace(basic.sql), expectedBasicSql, 'Automaticlly omit OFFSET when on page 1')
  } catch(e) { ett.fail(e) }

  /**
   * Get any page other than 1.
   */
  try {
    let notPage1 = await new TestQuery({
      'table': 'some_table',
      'prefix': '',
      'page': 7
    })

    let expectedNotPage1Sql = "SELECT * FROM some_table LIMIT 100 OFFSET 600"
    ett.isEqual(flattenWhitespace(notPage1.sql), expectedNotPage1Sql, 'Automatically adds correct OFFSET on > page 1')
  } catch(e) { ett.fail(e) }

  /**
   * Combine not page 1 and a different amount of items per page.
   */
  try {
    let mixed = await new TestQuery({
      'table': 'some_table',
      'prefix': '',
      'page': 7,
      'itemsPerPage': 3
    })
    
    let expectedMixedSql = "SELECT * FROM some_table LIMIT 3 OFFSET 18"
    ett.isEqual(flattenWhitespace(mixed.sql), expectedMixedSql, 'Can combine custom `itemsPerPage` and `page` options')
  } catch(e) { ett.fail(e) }
}