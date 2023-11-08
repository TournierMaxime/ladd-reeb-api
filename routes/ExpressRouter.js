import { Router } from 'express'
// BEER
import StockRoute from './express/StockRoute.js'
import MachineRoute from './express/MachineRoute.js'
import OrderRoute from './express/OrderRoute.js'
import ProductRoute from './express/ProductRoute.js'
import OrderProductRoute from './express/OrderProductRoute.js'
// AUTH
import AccessGroupRouter from './express/user/AccessGroupRouter.js'
import AccessGroupRuleRouter from './express/user/AccessGroupRuleRouter.js'
import AccountRouter from './express/user/AccountRouter.js'
import AuthRouter from './express/user/AuthRouter.js'
import MessageRouter from './express/user/MessageRouter.js'
import UserRouter from './express/user/UserRouter.js'
import UserToAccountAccessGroupRouter from './express/user/UserToAccountAccessGroupRouter.js'

const router = Router()

// BEER
router.use('/api/v1/stock', StockRoute)
router.use('/api/v1/machine', MachineRoute)
router.use('/api/v1/order', OrderRoute)
router.use('/api/v1/product', ProductRoute)
router.use('/api/v1/orderProduct', OrderProductRoute)
// AUTH
router.use('/api/v1/access-groups', AccessGroupRouter)
router.use('/api/v1/access-groups', AccessGroupRuleRouter)
router.use('/api/v1/accounts', AccountRouter)
router.use('/api/v1/auth', AuthRouter)
router.use('/api/v1/messages', MessageRouter)
router.use('/api/v1/users', UserRouter)
router.use('/api/v1/user-to-account', UserToAccountAccessGroupRouter)

export default router
