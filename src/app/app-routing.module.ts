import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminNavigationComponent } from './components/admin/admin-navigation.component';
import { ClientsComponent } from './components/admin/clients/clients.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { EventsComponent } from './components/admin/events/events.component';
import { EventmanagementComponent } from './components/admin/events/management/eventmanagement.component';
import { EventPortalComponent } from './components/admin/events/portal/eventportal.component';
import { SettingsComponent } from './components/admin/settings/settings.component';
import { UsersComponent } from './components/admin/users/users.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';
import { BaseLayoutComponent } from './shared/components/layouts/base-layout/base-layout.component';

const baseLayoutRouting: Routes = [
    {
        path: 'events',
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule)
    },
    {
        path: 'about',
        loadChildren: () => import('./about/about.module').then(m => m.AboutModule)
    },
    {
        path: 'contact',
        loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule)
    },
    {
        path: '',
        pathMatch: 'full',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
    }
];

const routes: Routes = [
    {
        path: 'checkout',
        component: CheckoutComponent,
        pathMatch: 'full'
    },
    {
        path: 'admin',
        component: AdminNavigationComponent,
        // canActivate: [AuthGuard, AdminGuard],

        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'events', component: EventsComponent, pathMatch: 'full' },
            { path: 'eventmanagement/:id', component: EventmanagementComponent },
            { path: 'events/portal/:id', component: EventPortalComponent },
            { path: 'settings', component: SettingsComponent },
            { path: 'users', component: UsersComponent },
            { path: 'clients', component: ClientsComponent },
            { path: 'forgot-password', component: ForgotPasswordComponent },
            { path: 'reset-password', component: ResetPasswordComponent }
        ]
    },
    {
        path: '',
        component: BaseLayoutComponent,
        children: baseLayoutRouting
    },
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
    },
    {
        path: 'doc',
        loadChildren: () => import('./doc/doc.module').then(m => m.DocModule)
    },
    {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            scrollPositionRestoration: 'enabled'
        })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
