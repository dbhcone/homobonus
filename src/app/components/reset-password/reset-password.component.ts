import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss', '../../auth/login/login.component.scss']
})
export class ResetPasswordComponent implements OnInit {
    /**
     * https://www.elite-corner.com/2018/09/match-password-validation-in-angular-reactive-forms.html
     */

    submitting: boolean = false;
    token: any;
    resetPasswordForm;
    constructor(
        private fb: FormBuilder,
        private auth: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        route.queryParams.subscribe(param => {
            this.token = param['token'];
            console.log('token', this.token);
        });
        this.resetPasswordForm = fb.group({
            newPassword: [null, Validators.compose([Validators.minLength(8), Validators.required])],
            confirmPassword: [null, Validators.compose([Validators.required])],
            pin: [null, Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(6)])]
        });
    }

    ngOnInit(): void {}

    public get newPassword(): AbstractControl | null {
        return this.resetPasswordForm.get('newPassword');
    }

    public get confirmPassword(): AbstractControl | null {
        return this.resetPasswordForm.get('confirmPassword');
    }

    public get pin(): AbstractControl | null {
        return this.resetPasswordForm.get('pin');
    }

    onSubmit() {
        console.log('You are submitting the form ', this.resetPasswordForm.value);
        this.submitting = true;

        const data = { ...this.resetPasswordForm.value, token: this.token };
        try {
            this.auth?.resetPassword(data)?.subscribe(
                async (resp: any) => {
                    console.log('reset', resp);
                    Swal.fire({ text: resp.message, icon: 'success', timer: 5000 }).then(async res => {
                        this.router.navigate(['/']);
                    });
                },
                err => {
                    this.submitting = false;
                    Swal.fire({
                        title: `${err.error.status.toUpperCase()}`,
                        text: `${err.error.message}`,
                        icon: 'error'
                    });
                }
            );
        } catch (error: any) {
            console.log('error', error);
            Swal.fire({ title: 'Error', text: error.message });
        }
    }
}
