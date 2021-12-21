import { Component, OnInit } from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    Validators,
    AbstractControl,
} from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { EventService } from 'src/app/services/event.service';
import { PaymentService } from 'src/app/services/payment.service';
import { clearCart } from 'src/app/store/actions/cart.actions';
import { AppState } from 'src/app/store/app.state';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
    selector: 'app-processpayment',
    templateUrl: './processpayment.component.html',
    styleUrls: ['./processpayment.component.scss'],
})
export class ProcesspaymentComponent implements OnInit {
    paymentForm!: FormGroup;

    paymentOptions: any;
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
        private eventService: EventService,
        private router: Router,
        private paymentService: PaymentService
    ) {
        this.cartStore = store.select('cart');
        this.userStore = store.select('userObj');

        this.userSubscription = this.userStore.subscribe((cs) => {
            this.useremail = cs.user.email;
        });
        this.paymentForm = this.fb.group({
            paymentType: [null, Validators.required],
            mobileNumber: [null],
            email: [
                this.useremail || null,
                Validators.compose([Validators.email]),
            ],
        });
        this.getAllPaymentOptions();
    }

    getAllPaymentOptions() {
        this.paymentService.listPaymentOptions().subscribe(
            async (resp: any) => {
                console.log('payment options', resp);
                let options: [] = resp.data.result;
                // this.paymentOptions = options.filter(
                //     (option: any) => option.type == 'MOBILE_MONEY'
                // );
                this.paymentOptions = options;
            },
            (err: any) => {
                console.log('error', err);
            }
        );
    }

    longText = `The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog
  from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was
  originally bred for hunting.`;

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

    public get paymentType(): AbstractControl | null {
        return this.paymentForm.get('paymentType');
    }

    public get mobileNumber(): AbstractControl | null {
        return this.paymentForm.get('mobileNumber');
    }

    public get email(): AbstractControl | null {
        return this.paymentForm.get('email');
    }

    onSubmit() {
        console.log('form being submitted', this.paymentForm.value);
        this.submitting = true;
        this.userSubscription = this.userStore.subscribe(async (us) => {
            this.cartSubscription = this.cartStore.subscribe(async (ca) => {
                const items = ca.items;
                const paymentDetails = {
                    provider: this.paymentType?.value,
                    customerMobile: this.mobileNumber?.value,
                };
                this.eventService
                    .makePayment(
                        {
                            id: us.user.id,
                            email: this.email?.value || us.user.email,
                        },
                        items,
                        // paymentDetails
                    )
                    .subscribe(
                        async (resp: any) => {
                            console.log('resp', resp);
                            Swal.fire({
                                title: 'Payment Completed',
                                text: resp.message,
                                icon: 'success',
                                timer: 5000,
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
                                text: error.error.message,
                            });
                        }
                    );
                // end
            });
        });
    }
}
