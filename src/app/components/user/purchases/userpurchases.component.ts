import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { AppState } from 'src/app/store/app.state';

@Component({
  selector: 'app-userpurchases',
  templateUrl: './userpurchases.component.html',
  styleUrls: ['./userpurchases.component.scss']
})
export class UserpurchasesComponent implements OnInit, OnDestroy {
  displayedColumns = [
    'date',
    'tickets',
    'total',
    'edit',
  ];

  userStore: Observable<{
    user: { username: string; email: string; role: string; id: string };
  }>;
  userSubscription!: Subscription;
  
  dataSource: MatTableDataSource<any>;

  constructor(/* private actRoute: ActivatedRoute, */ private userService: UserService, private store: Store<AppState>) { 
    // const userId = this.actRoute.snapshot.params['userId'];
    
    // console.log('user id', userId);
    this.dataSource = new MatTableDataSource();

    this.userStore = store.select("userObj");

    this.userSubscription =  this.userStore.subscribe((us) => {
      this.getUserPurchases(us.user.id);
    });

  }

  getUserPurchases (userId: string) {
    this.userService.getAllPurchases(userId).subscribe((res: any) => {
      console.log(res);

      this.dataSource.data = res.data.purchases;
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
  }

}
