import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventService } from 'src/app/services/event.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'hb-confirmationform',
    templateUrl: './confirmationform.component.html',
    styleUrls: ['./confirmationform.component.scss']
})
export class ConfirmationformComponent implements OnInit {
    submitting = false;
    createConfirmationForm;

    HEADING = 'ADD DETAILS OF A NEW PAYMENT';

    constructor(
        private fb: FormBuilder,
        private eventService: EventService,
        public dialogRef: MatDialogRef<ConfirmationformComponent>,
        @Inject(MAT_DIALOG_DATA) public data?: any
    ) {
        this.createConfirmationForm = fb.group({
            name: [data?.name || null, Validators.compose([Validators.required, Validators.minLength(4)])],
            mobileNumber: [
                data?.mobileNumber || null,
                Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])
            ]
        });
        if (this.data) {
            this.HEADING = 'EDIT DETAILS';
        }
    }

    ngOnInit(): void {}

    public get name(): AbstractControl | null {
        return this.createConfirmationForm.get('name');
    }

    public get mobileNumber(): AbstractControl | null {
        return this.createConfirmationForm.get('mobileNumber');
    }

    onSubmit() {
        const formValue = this.createConfirmationForm.value;
        console.log('We are about submitting the form', formValue);
        this.submitting = true;

        this.eventService.addConfirmation(formValue).subscribe(
            async (resp: any) => {
                Swal.fire({
                    icon: 'success',
                    titleText: resp.message
                }).then(() => {
                    this.closeDialog();
                });
            },
            err => {
                this.submitting = false;
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    titleText: err.error.message
                });
            }
        );
    }

    closeDialog(): void {
        this.dialogRef.close();
    }
}
