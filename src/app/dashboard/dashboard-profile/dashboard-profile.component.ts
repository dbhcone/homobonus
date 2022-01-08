import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/store/app.state';

@Component({
    selector: 'hb-dashboard-profile',
    templateUrl: './dashboard-profile.component.html',
    styleUrls: ['./dashboard-profile.component.scss']
})
export class DashboardProfileComponent implements OnInit {
    userStore: Observable<{ user: { username: string; email: string; role: string } }>;
    userProfile: Observable<{ accountOwner: any }>;
    constructor(private store: Store<AppState>) {
        this.userStore = store.select('userObj');
        this.userProfile = this.store.select('userProfile');
    }

    ngOnInit(): void {}
}
