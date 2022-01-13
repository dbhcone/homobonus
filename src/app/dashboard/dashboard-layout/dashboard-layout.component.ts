import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TextFormat } from 'src/app/helpers/textformat.helper';
import { AppState } from 'src/app/store/app.state';

@Component({
    selector: 'hb-dashboard-layout',
    templateUrl: './dashboard-layout.component.html',
    styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent implements OnInit {
    isLessThanLargeDevice: boolean = false;
    userProfile: Observable<{
        accountOwner: any;
        profile?: any;
    }>;
    constructor(
        private breakpointObserver: BreakpointObserver,
        private router: Router,
        private store: Store<AppState>
    ) {
        this.userProfile = this.store.select('userProfile');
    }

    ngOnInit(): void {
        this.breakpointObserver.observe(['(max-width: 1199px)']).subscribe(({ matches }) => {
            this.isLessThanLargeDevice = matches;
        });
    }
    onLogout(): void {
        this.router.navigate(['auth/login']);
    }

    displayPhoto(photo: any) {
        return TextFormat.displayFlyer(photo);
    }
}
