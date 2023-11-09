import { Router } from 'express'
// Static Resources
import StaticResourcesRoute from './express/StaticResourcesRoute.js'

// BEER
import OrderRoute from './express/OrderRoute.js'
import ProductRoute from './express/ProductRoute.js'
import OrderProductRoute from './express/OrderProductRoute.js'
import TransactionRoute from './express/TransactionRoute.js'
import PaymentMeanRoute from './express/PaymentMeanRoute.js'
import PaymentTypeRoute from './express/PaymentTypeRoute.js'

// AUTH
import AccessGroupRouter from './express/user/AccessGroupRouter.js'
import AccessGroupRuleRouter from './express/user/AccessGroupRuleRouter.js'
import AccountRouter from './express/user/AccountRouter.js'
import AuthRouter from './express/user/AuthRouter.js'
import MessageRouter from './express/user/MessageRouter.js'
import UserRouter from './express/user/UserRouter.js'
import UserToAccountAccessGroupRouter from './express/user/UserToAccountAccessGroupRouter.js'
import WalletRouter from './express/WalletRouter.js'

const router = Router()

// Static Resources
router.use('/api/v1/static-resources', StaticResourcesRoute)

// BEER
router.use('/api/v1/orders', OrderRoute)
router.use('/api/v1/products', ProductRoute)
router.use('/api/v1/order-products', OrderProductRoute)
router.use('/api/v1/transactions', TransactionRoute)
router.use('/api/v1/payment-means', PaymentMeanRoute)
router.use('/api/v1/payment-types', PaymentTypeRoute)
router.use('/api/v1/wallets', WalletRouter)

// AUTH
router.use('/api/v1/access-groups', AccessGroupRouter)
router.use('/api/v1/access-groups', AccessGroupRuleRouter)
router.use('/api/v1/accounts', AccountRouter)
router.use('/api/v1/auth', AuthRouter)
router.use('/api/v1/messages', MessageRouter)
router.use('/api/v1/users', UserRouter)
router.use('/api/v1/user-to-account', UserToAccountAccessGroupRouter)

export default router
