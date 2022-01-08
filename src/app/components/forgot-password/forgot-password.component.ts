import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss', '../../auth/login/login.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
    submitting: boolean = false;
    forgotPasswordForm;
    constructor(private fb: FormBuilder) {
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
        // TODO: work on resetting password
    }
}
