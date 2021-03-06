import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { menuList as staticMenuList } from '../../data/menus';

@Component({
    selector: 'hb-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    @Input()
    topFixed: boolean = false;
    @Output() toggleSidenav = new EventEmitter();
    isScrolled: boolean = false;
    menuList: any[] = [];
    isLessThanLargeDevice!: boolean;
    constructor(private breakpointObserver: BreakpointObserver) {}

    ngOnInit(): void {
        this.menuList = staticMenuList;
        this.breakpointObserver.observe(['(max-width: 1199px)']).subscribe(({ matches }) => {
            this.isLessThanLargeDevice = matches;
        });
    }

    @HostListener('window:scroll', ['$event'])
    checkScroll() {
        this.isScrolled = window.pageYOffset > 15;
    }
}
