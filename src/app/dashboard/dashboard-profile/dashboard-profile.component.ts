import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { setUserProfile } from 'src/app/store/actions/user.actions';
import { AppState } from 'src/app/store/app.state';
import { ProfileformComponent } from './profile-form/profileform.component';

@Component({
    selector: 'hb-dashboard-profile',
    templateUrl: './dashboard-profile.component.html',
    styleUrls: ['./dashboard-profile.component.scss']
})
export class DashboardProfileComponent implements OnInit {
    subscription?: Subscription;
    data: any;
    userStore: Observable<{ user: { username: string; email: string; role: string } }>;
    userProfile: Observable<{ accountOwner: any }>;
    constructor(private store: Store<AppState>, private dialog: MatDialog, private userService: UserService) {
        this.userStore = store.select('userObj');
        this.userProfile = this.store.select('userProfile');
    }

    ngOnInit(): void {}

    openProfileDialog() {
        this.getUserDetails();
    }

    getUserDetails() {
        this.userService.getUserDetails().subscribe(
            async (resp: any) => {
                console.log(resp.data);
                this.data = resp.data;
                this.setupDialog();
            },
            (err: any) => {
                console.log('error getting user details', err);
            }
        );
    }

    setupDialog() {
        const dialogRef = this.dialog.open(ProfileformComponent, {
            data: this.data,
            width: '400px'
        });
        this.subscription = dialogRef.afterClosed().subscribe(result => {
            console.log('dialog closed', result);
            // TODO: make a call or update user profile
            // this.store.dispatch(setUserProfile({accountOwner: result}))
        });
    }
}
