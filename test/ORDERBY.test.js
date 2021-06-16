import { flattenWhitespace } from './filters/whitespace.js'

// what we're testing
import { TestQuery } from './extend/TestQuery.js'

/**
 * Runs tests for the SELECT SQL.
 */
export async function orderbyTest() {
  ett.output('<h3>ORDERBY.test.js</h3>')

  /**
   * Test a single orderby key:value pair.
   */
  try {
    let basic = await new TestQuery({
      'table': 'some_table',
      'prefix': '',
      'orderBy': {
        'name': 'ASC'
      }
    })

    let expectedBasicSql = "SELECT * FROM some_table ORDER BY name COLLATE NOCASE ASC LIMIT 100"
    ett.isEqual(flattenWhitespace(basic.sql), expectedBasicSql, 'Can construct basic ORDERBY using single key:value pair')
  } catch(e) { ett.fail(e) }

  /**
   * Use multiple key:value pairs.
   */
  try {
    let multi = await new TestQuery({
      'table': 'some_table',
      'prefix': '',
      'orderBy': {
        'name': 'ASC',
        'date': 'DESC'
      }
    })

    let expectedMultiSql = "SELECT * FROM some_table ORDER BY name COLLATE NOCASE ASC, date COLLATE NOCASE DESC LIMIT 100"
    ett.isEqual(flattenWhitespace(multi.sql), expectedMultiSql, 'Can construct multi key:value pair ORDERBY')
  } catch(e) { ett.fail(e) }
}