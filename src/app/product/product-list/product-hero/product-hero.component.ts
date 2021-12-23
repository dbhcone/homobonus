import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'hb-product-hero',
    templateUrl: './product-hero.component.html',
    styleUrls: ['./product-hero.component.scss']
})
export class ProductHeroComponent implements OnInit {
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
