import Query from '../../index.js'
import { _testSend } from '../plugs/_send.js'

/**
 * Extend the Query class as per:
 * https://github.com/somebeaver/sqleary.js#setting-the-endpoint
 * 
 * This will disable SQL execution and instead make it look like every query
 * simply finds nothing in the database.
 */
export class TestQuery extends Query {
  _send(sql) {
    return _testSend(sql)
  }
  calculateTotals(sql) {
    return this
  }
}