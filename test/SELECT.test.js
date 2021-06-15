// what we're testing
import Query from '../index.js'
import { _testSend } from './plugs/_send.js'

/**
 * Extend the Query class as per:
 * https://github.com/somebeaver/sqleary.js#setting-the-endpoint
 */
class testQuery extends Query {
  _send(sql) {
    return _testSend(sql)
  }
  calculateTotals(sql) {
    return this
  }
}

/**
 * Runs tests for the SELECT SQL.
 */
export async function selectTest() {
  /**
   * Test 1
   */
  try {
    let testResult1 = await new testQuery({
      'table': 'some_table'
    })

    ett.isEqual('', '', 'SELECT test 1')
  } catch(e) { ett.fail(e) }
}