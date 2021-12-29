import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  /**
   * https://www.elite-corner.com/2018/09/match-password-validation-in-angular-reactive-forms.html
   */

  submitting: boolean = false;
  resetPasswordForm;
  constructor(private fb: FormBuilder) {
    this.resetPasswordForm = fb.group({
      newPassword: [
        null,
        Validators.compose([Validators.minLength(8), Validators.required]),
      ],
      confirmPassword: [null, Validators.compose([Validators.required])],
    });
  }

  ngOnInit(): void {}

  public get newPassword(): AbstractControl | null {
    return this.resetPasswordForm.get('newPassword');
  }

  public get confirmPassword(): AbstractControl | null {
    return this.resetPasswordForm.get('confirmPassword');
  }

  onSubmit () {
    console.log('You are submitting the form ', this.resetPasswordForm.value);
    this.submitting = true;
  }
}
