import { range } from '../lib/util'
import test from 'ava'

test('should work', (t) => {
  const list = range(1, 3)
  t.deepEqual(list, [1, 2, 3])
})
