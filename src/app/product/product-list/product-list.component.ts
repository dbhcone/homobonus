import { Component, OnDestroy, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { productsDB } from '../../shared/data/products';
import * as moment from 'moment';
import { Router } from '@angular/router';
@Component({
    selector: 'hb-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {
    isLoaded: boolean = false;
    advanceSearchExpanded: boolean = false;
    products: any[] = [];
    events: any[] = [];
    countDown: string = '';
    timer: any;

    /**
     * Static event for enactus
     */
    cena_noctis = {
        _id: '69d087e65b567c856',
        title: 'Cena Noctis ',
        date: '2022-01-02 0:00:0',
        time: '16:00 GMT',
        capacity: 500,
        venue: "St. Theresa's Parish Hall - Asawase Kumasi",
        flyer: { filename: 'assets/images/events/cena_noctis.jpg' },
        extraDetails: [{ label: 'Dress Code', value: 'Strictly Official' }],
        description: 'It is going to be an amazing time together',
        rating: 5,
        prices: [50]
    };
    constructor(private eventService: EventService, private router: Router) {}

    ngOnInit(): void {
        // this.fetchAllEvents();
        // this.displayCountDown();

        setTimeout(() => {
            this.products = productsDB.Product;
            this.isLoaded = true;
        }, 3000);
    }

    ngOnDestroy(): void {
        clearInterval(this.timer);
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

    buyNow() {
        this.router.navigate(['checkout']);
    }

    displayCountDown() {
        let eventTime = moment('2022-01-02 16:00:00').seconds(); //1641139200; //1366549200; // Timestamp - Sun, 21 Apr 2013 13:00:00 GMT
        let currentTime = new Date().getTime() / 1000; // 1366547400; // Timestamp - Sun, 21 Apr 2013 12:30:00 GMT
        // console.log('event time kum current', eventTime + '  ' + currentTime);

        // let day1 = moment('1995-12-25');
        // let day2 = moment('1995-12-27');
        // console.log('day 1 kum day 2', day1 + '  ' + day2);
        let diffTime = eventTime - currentTime;
        let duration: any = moment.duration(diffTime * 1000, 'milliseconds');
        let interval = 1000;

        this.timer = setInterval(() => {
            duration = moment.duration(duration - interval, 'milliseconds');
            this.countDown =
                duration.days() + 'd ' + duration.hours() + 'h ' + duration.minutes() + 'm ' + duration.seconds() + 's';
        }, interval);
    }
}
