import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { EventService } from 'src/app/services/event.service';
import { ConfirmationformComponent } from './confirmationform.component';

@Component({
    selector: 'hb-confirmations',
    templateUrl: './confirmations.component.html',
    styleUrls: ['./confirmations.component.scss']
})
export class ConfirmationsComponent implements OnInit, OnDestroy {
    confirmations: any[] = [];

    subscription?: Subscription;

    constructor(private dialog: MatDialog, private eventService: EventService) {}

    ngOnInit(): void {
        this.listAllConfirmations();
    }

    listAllConfirmations() {
        this.subscription = this.eventService.getAllConfirmations()?.subscribe(
            async (resp: any) => {
                this.confirmations = resp.data;
            },
            (err: any) => {
                console.log('error fetching confirmations', err);
            }
        );
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    addNew() {
        const dialogRef = this.dialog.open(ConfirmationformComponent, {
            disableClose: true,

            width: '400px'
        });
        this.subscription = dialogRef.afterClosed().subscribe(result => {
            console.log('dialog closed', result);
            this.listAllConfirmations();
        });
    }
}
