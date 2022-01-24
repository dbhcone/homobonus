import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
    selector: 'hb-merchant-signup',
    templateUrl: './merchant-signup.component.html',
    styleUrls: ['./merchant-signup.component.scss']
})
export class MerchantSignupComponent implements OnInit {
    submitting = false;
    signupForm: FormGroup;

    constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
        this.signupForm = this.fb.group({
            organisationName: [null, [Validators.required, Validators.minLength(3)]],
            ownerName: [null, [Validators.required, Validators.minLength(5)]],
            address: [null, [Validators.minLength(2)]],
            typeOfOrganisation: [null, [Validators.required]],
            ghPostAddress: [null, [Validators.minLength(8)]],
            mobileNumber: [
                null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(10),
                    Validators.minLength(10),
                    Validators.pattern('[0-9]{10}')
                ])
            ],
            email: [null, Validators.compose([Validators.email, Validators.required])],
            username: [null, [Validators.required, Validators.minLength(8)]],
            password: [null, [Validators.required, Validators.minLength(8)]],
            confirmPassword: [null, [Validators.required, Validators.minLength(8)]],
            agree: [false, [Validators.requiredTrue]]
        });
    }

    ngOnInit(): void {}

    get username() {
        return this.signupForm.get('username');
    }
    get password() {
        return this.signupForm.get('password');
    }

    get confirmPassword() {
        return this.signupForm.get('confirmPassword');
    }

    get email() {
        return this.signupForm.get('email');
    }
    get ownerName() {
        return this.signupForm.get('ownerName');
    }

    get organisationName() {
        return this.signupForm.get('organisationName');
    }

    get address() {
        return this.signupForm.get('address');
    }

    get mobileNumber() {
        return this.signupForm.get('mobileNumber');
    }

    get typeOfOrganisation() {
        return this.signupForm.get('typeOfOrganisation');
    }
    get ghPostAddress() {
        return this.signupForm.get('ghPostAddress');
    }

    get agree() {
        return this.signupForm.get('agree');
    }

    onSubmit() {
        this.submitting = true;
        console.log(this.signupForm.value);

        const merchantData = this.signupForm?.value;
        const { confirmPassword, agree, ...merchant } = merchantData;

        console.log('merchant data', merchantData);

        this.auth.merchantSignup(merchant)?.subscribe(
            async (resp: any) => {
                console.log('merchant signup', resp);
                Swal.fire({ text: resp.message, icon: 'success', timer: 5000 }).then(
                    (result: SweetAlertResult<any>) => {
                        //
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
