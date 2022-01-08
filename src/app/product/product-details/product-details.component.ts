import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TextFormat } from 'src/app/helpers/textformat.helper';
import { EventService } from 'src/app/services/event.service';

@Component({
    selector: 'hb-product-details',
    templateUrl: './product-details.component.html',
    styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
    eventId: any;
    eventDetails: any;
    constructor(private route: ActivatedRoute, private eventService: EventService) {
        this.eventId = this.route.snapshot.url[0].path;
        this.getEventDetails();
    }

    ngOnInit(): void {}

    getEventDetails() {
        this.eventService.getEvent(this.eventId).subscribe(
            async (resp: any) => {
                this.eventDetails = resp.data;
                console.log('event details', this.eventDetails);
            },
            (err: any) => {
                console.log('Error getting event details', err);
            }
        );
    }

    displayFlyer(flyer: any) {
        return TextFormat.displayFlyer(flyer);
    }

    displayPriceRange(pricings: any) {
        return TextFormat.displayPriceRange(pricings);
    }
}
