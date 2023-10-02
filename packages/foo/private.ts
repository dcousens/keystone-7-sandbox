import { stringify } from '@keystone-7/stringify'
import ms from 'ms'

export function aPrivateFoo () {
  return stringify('foo') + ms('1 hour')
}
