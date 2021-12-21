import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EventService } from 'src/app/services/event.service';
@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit, OnDestroy {
  events: any[] = [];
  pageEvent?: PageEvent;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  obs!: Observable<any>;
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  pageSize = 10;
  constructor(
    private eventService: EventService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.fetchAllEvents();
  }

  ngOnInit() {
    this.changeDetectorRef.detectChanges();
    this.dataSource.paginator = this.paginator;
    this.obs = this.dataSource.connect();
  }

  fetchAllEvents() {
    this.eventService.getAllEvents().subscribe(async (resp: any) => {
      this.events = resp.data.events;
      this.dataSource.data = this.events;
    });
  }

  displayFlyer(flyer?: any) {
    return `${flyer?.fileBaseUrl}/${flyer?.filename}`;
  }

  viewDetails(id: string) {
    this.router.navigate(['events', id]);
  }

  addToCart(event: any) {
    console.log('adding to add this content to cart', event);
  }

  ngOnDestroy() {
    if (this.dataSource) { 
      this.dataSource.disconnect(); 
    }
  }

  displayPriceRange(pricings: []) {
    if(pricings.length == 0) {
      return 'N/A';
    } else {
      let amounts: number[] =[];
      pricings.map((pr: any) => {
        amounts.push(pr.pricing.amount)
      });
      const min = Math.min(...amounts);
      const max = Math.max(...amounts);
      return min != max ? `GHS ${min} - GHS ${max}` : `GHS ${min}`;
    }
  }
}
