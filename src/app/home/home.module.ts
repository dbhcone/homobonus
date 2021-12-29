import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { HomeProductsComponent } from './home-products/home-products.component';
import { NgParticlesModule } from 'ng-particles';
import { CheckoutComponent } from '../components/checkout/checkout.component';
import { DashboardComponent } from '../components/admin/dashboard/dashboard.component';
import { UsersComponent } from '../components/admin/users/users.component';
import { EventsComponent } from '../components/admin/events/events.component';
import { ClientsComponent } from '../components/admin/clients/clients.component';
import { EventPortalComponent } from '../components/admin/events/portal/eventportal.component';
import { EventpricingComponent } from '../components/admin/events/management/eventpricing.component';
import { EventmanagementComponent } from '../components/admin/events/management/eventmanagement.component';
import { EventformComponent } from '../components/admin/events/eventformcomponent';
import { AdminNavigationComponent } from '../components/admin/admin-navigation.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { QRCodeModule } from 'angular2-qrcode';
import { ResetPasswordComponent } from '../components/reset-password/reset-password.component';
import { ForgotPasswordComponent } from '../components/forgot-password/forgot-password.component';
import { QrCodesComponent } from '../components/user/qr-codes/qr-codes.component';

@NgModule({
    declarations: [
        HomeComponent,
        HomeProductsComponent,
        CheckoutComponent,
        DashboardComponent,
        UsersComponent,
        EventsComponent,
        ClientsComponent,
        EventPortalComponent,
        EventpricingComponent,
        EventmanagementComponent,
        EventformComponent,
        AdminNavigationComponent,
        ResetPasswordComponent,
        ForgotPasswordComponent,
        QrCodesComponent
    ],
    imports: [CommonModule, HomeRoutingModule, SharedModule, NgParticlesModule, ZXingScannerModule, QRCodeModule]
})
export class HomeModule {}
