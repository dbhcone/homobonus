import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { formatDate } from '@angular/common';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { setUserProfile } from 'src/app/store/actions/user.actions';

@Component({
    selector: 'app-profileform',
    templateUrl: './profileform.component.html',
    styleUrls: ['./profileform.component.scss']
})
export class ProfileformComponent implements OnInit {
    submitting = false;
    createProfileForm;
    photoFile: File | undefined;
    photoSrc: string | undefined;
    userInfo: any;
    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        public dialogRef: MatDialogRef<ProfileformComponent>,
        @Inject(LOCALE_ID) private locale: string,
        private store: Store<AppState>,
        @Inject(MAT_DIALOG_DATA) public data?: any
    ) {
        this.createProfileForm = this.fb.group({
            surname: [data?.accountOwner?.surname || null, [Validators.required]],
            firstName: [data?.accountOwner?.firstName || null, [Validators.required]],
            otherNames: [data?.accountOwner?.otherNames || null],
            gender: [data?.accountOwner?.gender || null, [Validators.required]],
            primaryMobileNumber: [
                data?.accountOwner?.primaryMobileNumber || null,
                [Validators.required, Validators.maxLength(10), Validators.minLength(10)]
            ],
            occupation: [data?.accountOwner?.occupation || null, [Validators.minLength(5)]],
            dateOfBirth: [data?.accountOwner?.dateOfBirth ? this.standardDate(data?.accountOwner?.dateOfBirth) : null],
            company: [data?.accountOwner?.company || null],
            photo: [null]
        });
    }

    standardDate(rawDate: any) {
        return formatDate(rawDate, 'yyyy-MM-dd', this.locale);
    }

    ngOnInit(): void {}

    public get firstName(): AbstractControl | null {
        return this.createProfileForm.get('firstName');
    }

    public get otherNames(): AbstractControl | null {
        return this.createProfileForm.get('otherNames');
    }

    public get gender(): AbstractControl | null {
        return this.createProfileForm.get('gender');
    }

    public get occupation(): AbstractControl | null {
        return this.createProfileForm.get('occupation');
    }

    public get dateOfBirth(): AbstractControl | null {
        return this.createProfileForm.get('dateOfBirth');
    }

    public get company(): AbstractControl | null {
        return this.createProfileForm.get('company');
    }

    public get primaryMobileNumber(): AbstractControl | null {
        return this.createProfileForm.get('primaryMobileNumber');
    }

    public get surname(): AbstractControl | null {
        return this.createProfileForm.get('surname');
    }

    public get photo(): AbstractControl | null {
        return this.createProfileForm.get('photo');
    }

    onSubmit() {
        const formData = new FormData();
        const formValue = this.createProfileForm.value;
        console.log('We are about submitting the form', formValue);
        this.submitting = true;
        for (const key in formValue) {
            if (Object.prototype.hasOwnProperty.call(formValue, key)) {
                let element = formValue[key];
                formData.append(key, element);
            }
        }
        this.userService.updateUserProfile(this.data?._id, formData).subscribe(
            async (resp: any) => {
                this.userInfo = resp.data;
                const { accountOwner, profilePhoto } = this.userInfo;
                console.log('user infor', this.userInfo);
                this.store.dispatch(
                    setUserProfile({
                        accountOwner: {
                            ...accountOwner,
                            profile: { filename: profilePhoto.filename, fileBaseUrl: profilePhoto.fileBaseUrl }
                        }
                    })
                );
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

    onFileSelected(event: any) {
        this.photoFile = <File>event.target.files[0];
        this.previewImage();
        this.createProfileForm.patchValue({
            photo: this.photoFile
        });
        this.createProfileForm.get('photo')?.updateValueAndValidity();
    }

    private previewImage() {
        const reader = new FileReader();
        if (this.photoFile) {
            reader.readAsDataURL(this.photoFile);
            reader.onload = () => {
                this.photoSrc = reader.result as string;
            };
        }
    }

    closeDialog(): void {
        this.dialogRef.close();
    }
}
