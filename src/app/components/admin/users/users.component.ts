import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
    orders: any[] = [];
    users: any[] = [];

    subscription?: Subscription;

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.listAllUsers();
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

    listAllUsers() {
        this.subscription = this.authService.getAllUsers()?.subscribe(
            async (resp: any) => {
                this.users = resp.data;
            },
            (err: any) => {
                console.log('error fetching users', err);
            }
        );
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }
}
