import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { GeneralService } from '../services/general.service';

@Component({
    selector: 'hb-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
    submitting = false;
    contactUsForm: FormGroup;

    constructor(private fb: FormBuilder, private generalService: GeneralService) {
        this.contactUsForm = fb.group({
            subject: [null, [Validators.required]],
            message: [null, [Validators.required]],
            fullName: [null, [Validators.required]],
            mobileNumber: [
                null,
                Validators.compose([
                    Validators.maxLength(10),
                    Validators.minLength(10),
                    Validators.pattern('[0-9]{10}')
                ])
            ],
            email: [null, Validators.compose([Validators.email])]
        });
    }

    ngOnInit(): void {}

    public get email() {
        return this.contactUsForm.get('email');
    }
    public get mobileNumber() {
        return this.contactUsForm.get('mobileNumber');
    }
    public get fullName() {
        return this.contactUsForm.get('fullName');
    }
    public get message() {
        return this.contactUsForm.get('message');
    }
    public get subject() {
        return this.contactUsForm.get('subject');
    }

    onSubmit() {
        this.submitting = true;
        console.log('You are about to submit the form', this.contactUsForm.value);
        try {
            this.generalService.contactUs(this.contactUsForm.value)?.subscribe(
                async (resp: any) => {
                    console.log('contact us', resp);
                    Swal.fire({ title: 'Enquiry', text: resp.message, icon: 'success', timer: 5000 }).then(
                        async res => {
                            this.contactUsForm.reset();
                            this.submitting = false;
                        }
                    );
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
