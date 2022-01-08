import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

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

    isLoggedIn: boolean = false;
    LABEL = 'Join the people who give nothing but the best to your events';
    constructor(private router: Router, private auth: AuthService) {
        this.isLoggedIn = !auth.isTokeExpired();
        console.log('this.isLoggedIn', this.isLoggedIn);

        if (this.isLoggedIn) {
            this.LABEL = 'Great to have you on board. Choose from our endless stream of events!';
        }
    }

    ngOnInit(): void {}
}
