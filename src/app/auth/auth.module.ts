import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { SharedModule } from '../shared/shared.module';
import { ActivateaccountComponent } from '../components/activateaccount/activateaccount.component';
import { MerchantSignupComponent } from './merchant-signup/merchant-signup.component';

@NgModule({
    declarations: [LoginComponent, SignupComponent, ActivateaccountComponent, MerchantSignupComponent],
    imports: [CommonModule, AuthRoutingModule, SharedModule]
})
export class AuthModule {}
