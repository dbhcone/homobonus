import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { AppState } from 'src/app/store/app.state';

@Component({
    selector: 'hb-user-top-nav',
    templateUrl: './user-top-nav.component.html',
    styleUrls: ['./user-top-nav.component.scss']
})
export class UserTopNavComponent implements OnInit {
    isLoggedIn: boolean = false;
    userStore: Observable<{
        user: { username: string; email: string; role: string; id: string };
    }>;
    constructor(private router: Router, private auth: AuthService, private store: Store<AppState>) {
        this.isLoggedIn = !auth.isTokeExpired();
        console.log('this.isLoggedIn', this.isLoggedIn);

        this.userStore = this.store.select('userObj');
    }

    ngOnInit(): void {}

    onLogout(): void {
        this.router.navigate(['auth/login']);
    }
}
