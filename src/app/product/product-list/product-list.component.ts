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
    constructor(private eventService: EventService) {}

    ngOnInit(): void {
        this.fetchAllEvents();

        setTimeout(() => {
            this.products = productsDB.Product;
            this.isLoaded = true;
        }, 8000);
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
