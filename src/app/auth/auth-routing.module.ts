import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivateaccountComponent } from '../components/activateaccount/activateaccount.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'signup',
        component: SignupComponent
    },
    {
        path: 'activate-account',
        component: ActivateaccountComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule {}
