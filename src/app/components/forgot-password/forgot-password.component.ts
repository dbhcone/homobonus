import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss', '../../auth/login/login.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
    submitting: boolean = false;
    forgotPasswordForm;
    constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
        this.forgotPasswordForm = fb.group({
            email: [null, Validators.compose([Validators.email, Validators.required])]
        });
    }

    ngOnInit(): void {}

    get email() {
        return this.forgotPasswordForm.get('email');
    }

    onSubmit() {
        console.log('Submitting form values', this.forgotPasswordForm.value);
        this.submitting = true;

        const data = this.forgotPasswordForm.value;
        this.auth.requestPasswordReset(data)?.subscribe(
            async (resp: any) => {
                console.log('password reset request', resp);
                Swal.fire({ text: resp.message, icon: 'success', timer: 3000 }).then(
                    (result: SweetAlertResult<any>) => {
                        this.router.navigate(['/']);
                    }
                );
            },
            err => {
                this.submitting = false;
                Swal.fire({
                    title: `${err.error.status} - ${err.error.code}`,
                    text: `${err.error.message}`
                });
            }
        );
    }
}
