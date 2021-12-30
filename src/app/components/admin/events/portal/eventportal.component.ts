import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
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

    formValueJson: string = '';
    submitting: boolean = false;
    scanSuccess: boolean = false;
    // allowedFormats = [ BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13, BarcodeFormat.CODE_128, BarcodeFormat.DATA_MATRIX /*, ...*/ ];
    public scannerEnabled: boolean = false;

    constructor(private actRoute: ActivatedRoute, private eventService: EventService) {
        this.subscription = this.actRoute.paramMap.subscribe(pm => {
            if (pm.has('id')) {
                this.eventId = pm.get('id');
                console.log('id changed', this.eventId);
                this.getEventStats();
            }
        });
    }

    ngOnInit() {}
    ngOnDestroy() {
        this.subscription?.unsubscribe();
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

    public redeem(hashTicketId: string) {
        alert('You want to redeem');
    }
}
