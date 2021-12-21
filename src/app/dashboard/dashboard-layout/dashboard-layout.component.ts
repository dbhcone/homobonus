import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'hb-dashboard-layout',
    templateUrl: './dashboard-layout.component.html',
    styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent implements OnInit {
    isLessThanLargeDevice: boolean = false;

    constructor(private breakpointObserver: BreakpointObserver, private router: Router) {}

    ngOnInit(): void {
        this.breakpointObserver.observe(['(max-width: 1199px)']).subscribe(({ matches }) => {
            this.isLessThanLargeDevice = matches;
        });
    }
    onLogout(): void {
        this.router.navigate(['auth/login']);
    }
}
