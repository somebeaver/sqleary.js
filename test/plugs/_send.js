/**
 * This gets plugged into Query as per:
 * https://github.com/somebeaver/sqleary.js#setting-the-endpoint
 * 
 * Test Queries do not attempt to execute SQL. The results array will always be empty.
 */
export function _testSend(sql) {
  return []
}