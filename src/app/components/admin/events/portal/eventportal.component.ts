import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-eventportal',
    templateUrl: './eventportal.component.html',
    styleUrls: ['./eventportal.component.scss', '../../../../auth/login/login.component.scss']
})
export class EventPortalComponent implements OnInit, OnDestroy {
    statistics: any;
    eventId: any;
    subscription: Subscription;
    ticketRedemptionForm: any;

    formValueJson: string = '';
    submitting: boolean = false;
    scanSuccess: boolean = false;
    // allowedFormats = [ BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13, BarcodeFormat.CODE_128, BarcodeFormat.DATA_MATRIX /*, ...*/ ];
    public scannerEnabled: boolean = false;

    constructor(
        private actRoute: ActivatedRoute,
        private eventService: EventService,
        private fb: FormBuilder,
        private auth: AuthService
    ) {
        this.subscription = this.actRoute.paramMap.subscribe(pm => {
            if (pm.has('id')) {
                this.eventId = pm.get('id');
                console.log('id changed', this.eventId);
                this.getEventStats();
            }
        });

        this.ticketRedemptionForm = fb.group({
            redemptionCode: [
                null,
                Validators.compose([
                    Validators.required,
                    Validators.pattern('[0-9]{6}'),
                    Validators.minLength(6),
                    Validators.maxLength(6)
                ])
            ]
        });
    }

    ngOnInit() {}
    ngOnDestroy() {
        this.subscription?.unsubscribe();
    }

    get redemptionCode(): AbstractControl | null {
        return this.ticketRedemptionForm.get('redemptionCode');
    }

    getEventStats() {
        this.eventService.getEventPortalStats(this.eventId).subscribe(
            async (resp: any) => {
                console.log('response ', resp);
                this.statistics = resp.data;
            },
            err => {
                console.log('Error ' + err.error.message, err.error.code);
            }
        );
    }

    startScanner() {
        console.log('we have started the scanner');
        this.scannerEnabled = true;
    }

    stopScanner() {
        console.log('we are stopping the scanner');
        this.scannerEnabled = false;
    }

    public scanSuccessHandler(result: any) {
        this.stopScanner();
        console.log('scan result', result);
        this.formValueJson = result;
        this.verifyScanResult(this.formValueJson);
    }

    public scanCompleteHandler(result?: any) {
        this.stopScanner();
        console.log('scan complete', result);
    }

    verifyScanResult(scanResult: string) {
        this.eventService.verifyTicket(scanResult).subscribe(
            async (resp: any) => {
                console.log('verify', resp);
                Swal.fire({ text: resp.message, icon: 'success', timer: 5000 });
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
    }

    redeem() {
        this.submitting = true;
        const session = this.auth.session();
        const data = { redemptionCode: this.redemptionCode?.value, eventId: this.eventId, userId: session.id };

        this.eventService.redeemTicket(data)?.subscribe(
            async (resp: any) => {
                console.log('redemption ', resp);
                Swal.fire({ text: resp.message, icon: 'success', timer: 5000 });
            },
            (err: any) => {
                this.submitting = false;
                Swal.fire({
                    title: `${err.error.status} - ${err.error.code}`,
                    text: `${err.error.message}`
                });
            }
        );
    }
}
