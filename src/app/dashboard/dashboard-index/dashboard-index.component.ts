import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'hb-dashboard-index',
    templateUrl: './dashboard-index.component.html',
    styleUrls: ['./dashboard-index.component.scss']
})
export class DashboardIndexComponent implements OnInit {
    orders: any[] = [];
    constructor() {}

    ngOnInit(): void {
        this.orders = [
            {
                id: 'e5dcdfsf',
                orderBy: 'Dean Lynch',
                productId: 'cdfsfe5d',
                created: '25.05.2021, 10:00',
                status: 'completed',
                price: 2145.0
            },
            {
                id: 'e5dcdfsf',
                orderBy: 'Lynch Dean',
                productId: 'cdfsfe5d',
                created: '25.05.2021, 10:00',
                status: 'pending',
                price: 2145.0
            },
            {
                id: 'e5dcdfsf',
                orderBy: 'Lynch Dean',
                productId: 'cdfsfe5d',
                created: '25.05.2021, 10:00',
                status: 'rejected',
                price: 2145.0
            },
            {
                id: 'e5dcdfsf',
                orderBy: 'Dean Lynch',
                productId: 'cdfsfe5d',
                created: '25.05.2021, 10:00',
                status: 'initialized',
                price: 2145.0
            },
            {
                id: 'e5dcdfsf',
                orderBy: 'Dean Lynch',
                productId: 'cdfsfe5d',
                created: '25.05.2021, 10:00',
                status: 'completed',
                price: 2145.0
            }
        ];
    }
}
