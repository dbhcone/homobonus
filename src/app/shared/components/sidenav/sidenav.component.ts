import { Component, OnInit } from '@angular/core';
import { menuList } from '../../data/menus';

@Component({
    selector: 'hb-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
    navList: any[] = [];
    constructor() {}

    ngOnInit(): void {
        this.navList = menuList;
    }
}
