import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
@Component({
    selector: 'hb-doc-layout',
    templateUrl: './doc-layout.component.html',
    styleUrls: ['./doc-layout.component.scss']
})
export class DocLayoutComponent implements OnInit {
    @ViewChild('sidenav')
    sidenav!: { toggle: () => void; opened: boolean };
    isSidenavExpand = true;
    isLessThanLargeDevice = true;

    constructor(private breakpointObserver: BreakpointObserver) {
        this.breakpointObserver.observe(['(max-width: 1199px)']).subscribe(({ matches }) => {
            this.isLessThanLargeDevice = matches;
            if (matches) {
                this.isSidenavExpand = false;
            } else {
                this.isSidenavExpand = true;
            }
        });
    }

    ngOnInit(): void {}

    toggleSidenav(): void {
        this.sidenav.toggle();
        this.isSidenavExpand = this.sidenav.opened;
    }
}
