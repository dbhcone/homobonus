import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { productsDB } from '../../shared/data/products';

@Component({
    selector: 'hb-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
    isLoaded: boolean = false;
    advanceSearchExpanded: boolean = false;
    products: any[] = [];
    events: any[] = [];

    /**
     * Static event for enactus
     */
    cena_noctis = {
        _id: '69d087e65b567c856',
        title: 'Cena Noctis ',
        date: '2022-01-02',
        time: '16:00 GMT',
        capacity: 500,
        venue: "St. Theresa's Parish Hall - Asawase Kumasi",
        flyer: { filename: 'assets/images/events/cena_noctis.jpg' },
        extraDetails: [{ label: 'Dress Code', value: 'Strictly Official' }],
        description: 'It is going to be an amazing time together',
        rating: 5,
        prices: [50]
    };
    constructor(private eventService: EventService) {}

    ngOnInit(): void {
        // this.fetchAllEvents();

        setTimeout(() => {
            this.products = productsDB.Product;
            this.isLoaded = true;
        }, 3000);
    }

    fetchAllEvents() {
        this.eventService.getAllEvents().subscribe(async (resp: any) => {
            this.events = resp.data.events;
        });
    }

    displayPriceRange(pricings: []) {
        if (pricings.length == 0) {
            return 'N/A';
        } else {
            let amounts: number[] = [];
            pricings.map((pr: any) => {
                amounts.push(pr.pricing.amount);
            });
            const min = Math.min(...amounts);
            const max = Math.max(...amounts);
            return min != max ? `GHS ${min} - GHS ${max}` : `GHS ${min}`;
        }
    }
}
