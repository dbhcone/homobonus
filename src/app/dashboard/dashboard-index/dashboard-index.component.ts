import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { setUserProfile } from 'src/app/store/actions/user.actions';
import { AppState } from 'src/app/store/app.state';

@Component({
    selector: 'hb-dashboard-index',
    templateUrl: './dashboard-index.component.html',
    styleUrls: ['./dashboard-index.component.scss']
})
export class DashboardIndexComponent implements OnInit {
    orders: any[] = [];
    userStore: Observable<{
        user?: { username: string; email: string; role: string; id: string };
    }>;
    constructor(private user: UserService, private store: Store<AppState>) {
        this.userStore = this.store.select('userObj');
    }

    ngOnInit(): void {
        this.getUserDetails();
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

    getUserDetails() {
        this.user.getUserDetails().subscribe(
            async (resp: any) => {
                console.log('resp', resp.data);
                this.store.dispatch(setUserProfile({ accountOwner: resp.data.accountOwner }));
            },
            (err: any) => {
                console.log('error', err);
            }
        );
    }
}
