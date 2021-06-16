import { selectTest } from './SELECT.test.js'
import { joinTest } from './JOIN.test.js'
import { whereTest } from './WHERE.test.js'
import { orderbyTest } from './ORDERBY.test.js'
import { offsetTest } from './OFFSET.test.js'
import { limitTest } from './LIMIT.test.js'

async function runner() {
  await selectTest()
  await joinTest()
  await whereTest()
  await orderbyTest()
  await offsetTest()
  await limitTest()
}

runner()