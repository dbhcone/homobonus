import { Component, OnInit } from '@angular/core';
import { productsDB } from 'src/app/shared/data/products';

@Component({
    selector: 'hb-dashboard-saved-item',
    templateUrl: './dashboard-saved-item.component.html',
    styleUrls: ['./dashboard-saved-item.component.scss']
})
export class DashboardSavedItemComponent implements OnInit {
    view = 'list';

    products: {
        id: number;
        created_by: { name: string; avatar: string };
        images: string[];
        name: string;
        price: number;
        rating: number;
        feedback: number;
        category: string;
        tags: string[];
    }[] = [];
    constructor() {}

    ngOnInit(): void {
        this.products = productsDB.Product;
    }
}
