import { hc } from 'hono/client'
import type { ApiRoutes } from '../../server/app'

const client = hc<ApiRoutes>('http://127.0.0.1:3000')

export const api = client.api
