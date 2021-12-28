import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { PaymentService } from 'src/app/services/payment.service';
import { clearCart } from 'src/app/store/actions/cart.actions';
import { AppState } from 'src/app/store/app.state';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
    selector: 'hb-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss', '../../auth/login/login.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
    paymentForm!: FormGroup;

    submitting = false;
    cartStore: Observable<{ items: []; shipping: number; taxRate: number }>;
    userStore: Observable<{
        user: { username: string; email: string; role: string; id: string };
    }>;

    cartSubscription!: Subscription;
    userSubscription!: Subscription;

    useremail!: string;

    constructor(
        private fb: FormBuilder,
        private store: Store<AppState>,
        private eventService: PaymentService,
        private router: Router
    ) {
        this.cartStore = store.select('cart');
        this.userStore = store.select('userObj');

        this.userSubscription = this.userStore.subscribe(cs => {
            this.useremail = cs.user.email;
        });
        this.paymentForm = this.fb.group({
            // paymentType: [null, Validators.required],
            mobileNumber: [
                null,
                Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])
            ],
            email: [this.useremail || null, Validators.compose([Validators.email])]
        });
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
        if (this.cartSubscription) {
            this.cartSubscription.unsubscribe();
        }
    }

    onPaymentTypeChanged(event: MatRadioChange) {
        console.log('radio change', event);
    }

    // public get paymentType(): AbstractControl | null {
    //     return this.paymentForm.get('paymentType');
    // }

    public get mobileNumber(): AbstractControl | null {
        return this.paymentForm.get('mobileNumber');
    }

    public get email(): AbstractControl | null {
        return this.paymentForm.get('email');
    }

    onSubmit() {
        console.log('form being submitted', this.paymentForm.value);
        this.submitting = true;
        this.userSubscription = this.userStore.subscribe(us => {
            const { id, email } = us.user;
            console.log('user', us);
            // return;
            this.cartSubscription = this.cartStore.subscribe(ca => {
                const items = ca.items;
                // start

                this.eventService.makePayment({ id, email }, items).subscribe(
                    async (resp: any) => {
                        console.log('resp', resp);
                        Swal.fire({
                            title: 'Payment Completed',
                            text: resp.message,
                            icon: 'success',
                            timer: 5000
                        }).then((sar: SweetAlertResult) => {
                            // clear cart and return to events page
                            this.store.dispatch(clearCart());
                            this.router.navigate(['/events']);
                        });
                    },
                    (error: any) => {
                        this.submitting = false;
                        Swal.fire({
                            icon: 'error',
                            text: error.error.message
                        });
                    }
                );
                // end
            });
        });
    }
}
