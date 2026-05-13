import { Routes } from '@angular/router'
import { OrdersList } from './orders/orders-list/orders-list'
import { OrderForm } from './orders/order-form/order-form'
import { DashboardMain } from './dashboard/dashboard-main'
import { ProductsList } from './products/products-list/products-list'
import { ProductsForm } from './products/products-form/products-form'
import { CustomersList } from './customers/customers-list/customers-list'
import { CustomersForm } from './customers/customers-form/customers-form'
import { UsersList } from './users/users-list/users-list'
import { UsersForm } from './users/users-form/users-form'
import { Login } from './auth/login/login'
import { AuthGuard } from './auth/core/auth.guard'
import { VatCodeList } from './vatcode/vatcode-list/vatcode-list'
import { VatCodePureList } from './vatcode/vatcode-pur/vatcode-list.component'

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }, // Redirection par défaut
  {
    path: 'login',
    component: Login
  },
  {
    path: 'dashboard',
    component: DashboardMain,
    canActivate: [AuthGuard]
  },
  {
    path: 'orders',
    component: OrdersList,
    canActivate: [AuthGuard]
  },
  {
    path: 'orders/create',
    component: OrderForm,
    canActivate: [AuthGuard]
  },
  {
    path: 'orders/:orderId/edit',
    component: OrderForm,
    canActivate: [AuthGuard]
  },
  {
    path: 'customers',
    component: CustomersList,
    canActivate: [AuthGuard]
  },
  {
    path: 'customers/create',
    component: CustomersForm,
    canActivate: [AuthGuard]
  },
  {
    path: 'customers/:customerId/edit',
    component: CustomersForm,
    canActivate: [AuthGuard]
  },
  {
    path: 'products',
    component: ProductsList,
    canActivate: [AuthGuard]
  },
  {
    path: 'products/create',
    component: ProductsForm,
    canActivate: [AuthGuard]
  },
  {
    path: 'products/:productId/edit',
    component: ProductsForm,
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    component: UsersList,
    canActivate: [AuthGuard]
  },
  {
    path: 'users/create',
    component: UsersForm,
    canActivate: [AuthGuard]
  },
  {
    path: 'users/:userId/edit',
    component: UsersForm,
    canActivate: [AuthGuard]
  },
  {
    path: 'vat',
    component: VatCodeList,
    canActivate: [AuthGuard]
  },
  {
    path: 'vat-pure',
    component: VatCodePureList,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
]
