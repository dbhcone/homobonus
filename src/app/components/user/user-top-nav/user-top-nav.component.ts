import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'hb-user-top-nav',
    templateUrl: './user-top-nav.component.html',
    styleUrls: ['./user-top-nav.component.scss']
})
export class UserTopNavComponent implements OnInit {
    isLoggedIn: boolean = false;
    constructor(private router: Router, private auth: AuthService) {
        this.isLoggedIn = !auth.isTokeExpired();
        console.log('this.isLoggedIn', this.isLoggedIn);
    }

    ngOnInit(): void {}

    onLogout(): void {
        this.router.navigate(['auth/login']);
    }
}
