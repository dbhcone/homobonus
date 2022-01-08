import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class UserGuard implements CanActivate {
    constructor(private auth: AuthService, private router: Router) {}
    canActivate() {
        const session = this.auth.session();
        if (!['admin', 'user'].includes(session.role)) {
            this.router.navigate(['/login']);
            return false;
        }
        return true;
    }
}
