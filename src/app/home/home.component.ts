import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'hb-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    particlesOptions = {
        particles: {
            color: {
                value: ['#ccc000', '#ffffff', '#eeefff', '#abcdef']
            },
            size: {
                value: 1
            },
            lineLinked: {
                enable: true,
                color: 'random'
            },
            move: {
                enable: true,
                speed: 1.5
            }
        }
    };
    constructor() {}

    ngOnInit(): void {}
}
