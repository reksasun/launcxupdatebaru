import test from 'node:test'
import assert from 'node:assert/strict'
import express from 'express'
import request from 'supertest'

import { getClientDashboard } from '../src/controller/clientDashboard.controller'
import { prisma } from '../src/core/prisma'

test('getClientDashboard includes totalFee', async () => {
  ;(prisma as any).clientUser = {
    findUnique: async () => ({
      partnerClient: {
        id: 'pc1',
        name: 'Client',
        balance: 0,
        children: [],
      },
    }),
  }

  ;(prisma as any).order = {
    aggregate: async (args: any) => {
      if (args._sum.feeLauncx) return { _sum: { feeLauncx: 123 } }
      if (args._sum.pendingAmount) return { _sum: { pendingAmount: 0 } }
      if (args._sum.settlementAmount) return { _sum: { settlementAmount: 0 } }
      if (args._sum.amount) return { _sum: { amount: 0 } }
      return { _sum: {} }
    },
    findMany: async () => [],
    count: async () => 0,
  }

  const app = express()
  app.get('/client/dashboard', (req: any, res) => {
    req.clientUserId = 'user1'
    return getClientDashboard(req, res)
  })

  const res = await request(app).get('/client/dashboard')
  assert.equal(res.status, 200)
  assert.equal(res.body.totalFee, 123)
})

