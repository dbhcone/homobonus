import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
@Component({
    selector: 'app-activateaccount',
    templateUrl: './activateaccount.component.html',
    styleUrls: ['./activateaccount.component.scss', '../../auth/login/login.component.scss']
})
export class ActivateaccountComponent implements OnInit {
    activateAccountForm;
    submitting = false;
    token: any;
    constructor(
        private fb: FormBuilder,
        private auth: AuthService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.activateAccountForm = fb.group({
            mobileNumber: [
                null,
                Validators.compose([
                    Validators.required,
                    Validators.minLength(10),
                    Validators.maxLength(10),
                    Validators.pattern('[0-9]{10}')
                ])
            ],
            pin: [
                null,
                Validators.compose([
                    Validators.required,
                    Validators.pattern('[0-9]{6}'),
                    Validators.minLength(6),
                    Validators.maxLength(6)
                ])
            ]
        });
        route.queryParams.subscribe(param => {
            this.token = param['token'];
            console.log('token', this.token);
            console.log('param', param);
        });
    }

    ngOnInit(): void {}

    get pin(): AbstractControl | null {
        return this.activateAccountForm.get('pin');
    }
    get mobileNumber(): AbstractControl | null {
        return this.activateAccountForm.get('mobileNumber');
    }

    onSubmit() {
        this.submitting = true;
        const data = { pin: this.pin?.value, mobileNumber: this.mobileNumber?.value };
        this.auth.activateAccount(data, this.token)?.subscribe(
            async (resp: any) => {
                console.log('activation', resp);
                Swal.fire({ text: resp.message, icon: 'success', timer: 5000 }).then(res => {
                    this.router.navigate(['auth', 'login']);
                });
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
