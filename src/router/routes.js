const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'group', component: () => import('pages/Group.vue') },
      {
        path: 'product/category',
        component: () => import('pages/Category.vue')
      },
      { path: 'product/tax', component: () => import('pages/Tax.vue') },
      {
        path: '/provider/paymentcondition',
        component: () => import('pages/PaymentCondition.vue')
      },
      {
        path: '/provider/paymentmethod',
        component: () => import('pages/PaymentMethod.vue')
      },
      {
        path: '/settings/currency',
        component: () => import('pages/Currency.vue')
      },
      {
        path: '/settings/country',
        component: () => import('pages/Country.vue')
      },
      {
        path: '/settings/department',
        component: () => import('pages/Department.vue')
      },
      {
        path: '/settings/address',
        component: () => import('pages/Address.vue')
      },
      {
        path: '/settings/bank',
        component: () => import('pages/Bank.vue')
      },
      {
        path: '/settings/bankaccount',
        component: () => import('pages/BankAccount.vue')
      },
      {
        path: '/settings/customercategory',
        component: () => import('pages/customercategory.vue')
      }
    ],
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '', component: () => import('pages/Auth.vue') }],
    meta: { noAuth: true }
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
