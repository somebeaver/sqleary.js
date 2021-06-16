/**
 * Replaces all tabs and newlines with a normal amount of spaces.
 * 
 * Example:
 * 
 * ```sql
 * SELECT *
 *  FROM table
 * ```
 * 
 * Will become:
 * 
 * ```sql
 * SELECT * FROM table
 * ```
 */
export function flattenWhitespace(sql) {
  sql = sql.replace('\n', ' ')
  sql = sql.replace('\t', ' ')
  sql = sql.replace(/\s+/g,' ').trim()

  return sql
}