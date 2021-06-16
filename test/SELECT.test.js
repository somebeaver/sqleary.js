import { flattenWhitespace } from './filters/whitespace.js'

// what we're testing
import { TestQuery } from './extend/TestQuery.js'

/**
 * Runs tests for the SELECT SQL.
 */
export async function selectTest() {
  ett.output('<h3>SELECT.test.js</h3>')

  /**
   * Test 1
   */
  try {
    let basic = await new TestQuery({
      'table': 'some_table',
      'prefix': ''
    })
    ett.isEqual(flattenWhitespace(basic.sql), 'SELECT * FROM some_table LIMIT 100', 'Can construct basic SELECT')
  } catch(e) { ett.fail(e) }
}