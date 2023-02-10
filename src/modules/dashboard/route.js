import AppLayout from '@/layouts/default/AppLayout.vue'

const moduleRoutes = [
    {
        path: '/',
        component: AppLayout,
        children: [
            {
                path: '/',
                name: 'dashboard',
                component: () => import('@/modules/dashboard/Index.vue'),
                meta: {
                    subject: 'users',
                    action: 'read'
                }
            }
        ]
    }
]

export default moduleRoutes
