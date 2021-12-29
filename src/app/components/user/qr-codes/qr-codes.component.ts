import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { EventService } from 'src/app/services/event.service';
import { PaymentService } from 'src/app/services/payment.service';
import { AppState } from 'src/app/store/app.state';
import Swal from 'sweetalert2';

@Component({
    selector: 'hb-qr-codes',
    templateUrl: './qr-codes.component.html',
    styleUrls: ['./qr-codes.component.scss', '../../../auth/login/login.component.scss']
})
export class QrCodesComponent implements OnInit, OnDestroy {
    purchaseId: any;
    userStore: Observable<{
        user: { username: string; email: string; role: string; id: string };
    }>;

    queryParamSubscription!: Subscription;
    userSubscription!: Subscription;
    qrcode: any;

    constructor(private route: ActivatedRoute, private purchase: PaymentService, private store: Store<AppState>) {
        this.userStore = store.select('userObj');

        this.queryParamSubscription = this.route.queryParams.subscribe(param => {
            this.purchaseId = param['purchaseId'];
            console.log('purchaseId', this.purchaseId);
            this.getQrCode();
        });
    }

    getQrCode() {
        this.userStore = this.store.select('userObj');
        this.userSubscription = this.userStore.subscribe(us => {
            this.purchase.getPurchase(this.purchaseId, us.user.id).subscribe(
                async (resp: any) => {
                    console.log('resp', resp);
                    this.qrcode = resp.data.qrcode;
                },
                err => {
                    console.log('err', err);
                    Swal.fire({
                        title: `${err.error.status.toUpperCase()}`,
                        text: `${err.error.message}`,
                        icon: 'error'
                    });
                }
            );
        });
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this.userSubscription?.unsubscribe();
        this.queryParamSubscription?.unsubscribe();
    }
}
