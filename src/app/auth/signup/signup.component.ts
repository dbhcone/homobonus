import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
    selector: 'hb-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
    submitting = false;
    signupForm: FormGroup;

    constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
        this.signupForm = this.fb.group({
            account: this.fb.group({
                surname: [null, [Validators.required]],
                firstName: [null, [Validators.required]],
                otherNames: [null],
                gender: [null, [Validators.required]],
                primaryMobileNumber: [
                    null,
                    [Validators.required, Validators.maxLength(10), Validators.minLength(10)],
                    Validators.pattern('[0-9]{10}')
                ]
            }),
            user: this.fb.group({
                email: [null, [Validators.email, Validators.required]],
                username: [null, [Validators.required, Validators.minLength(8)]],
                password: [null, [Validators.required, Validators.minLength(8)]],
                confirmPassword: [null, [Validators.required, Validators.minLength(8)]]
            })
        });
    }

    ngOnInit(): void {}

    get username() {
        return this.signupForm.get(['user', 'username']);
    }
    get password() {
        return this.signupForm.get(['user', 'password']);
    }

    get confirmPassword() {
        return this.signupForm.get(['user', 'confirmPassword']);
    }

    get email() {
        return this.signupForm.get(['account', 'email']);
    }
    get surname() {
        return this.signupForm.get(['account', 'surname']);
    }

    get firstName() {
        return this.signupForm.get(['account', 'firstName']);
    }

    get primaryMobileNumber() {
        return this.signupForm.get(['account', 'primaryMobileNumber']);
    }

    get gender() {
        return this.signupForm.get(['account', 'gender']);
    }

    onSubmit() {
        this.submitting = true;
        const userdata = this.signupForm.get('user')?.value;
        const { confirmPassword, ...user } = userdata;
        const account = this.signupForm.get('account')?.value;

        console.log('user and account', userdata, account);

        this.auth.signup(user, account)?.subscribe(
            async (resp: any) => {
                console.log('signup', resp);
                Swal.fire({ text: resp.message, icon: 'success', timer: 5000 }).then(
                    (result: SweetAlertResult<any>) => {
                        //
                        this.router.navigate(['login']);
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
