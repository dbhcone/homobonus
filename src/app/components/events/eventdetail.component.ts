import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ShoppingCartService } from 'src/app/services/shoppingcart.service';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-eventdetail',
  templateUrl: './eventdetail.component.html',
  styleUrls: ['./eventdetail.component.scss'],
})
export class EventdetailComponent implements OnInit, OnDestroy {
  eventId: any;
  pricings: any;
  event: any;
  otherEvents: any;
  subscription: Subscription;
  constructor(
    private actRoute: ActivatedRoute,
    private eventService: EventService,
    private router: Router,
    private cart: ShoppingCartService
  ) {
    this.subscription = this.actRoute.paramMap.subscribe((pm) => {
      if(pm.has('id')) {
        this.eventId = pm.get('id');
        console.log('id changed', this.eventId);
        this.getEventDetails(this.eventId);
        this.getUpcomingEvents();
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getEventDetails(id: string) {
    this.eventService.getEvent(id).subscribe(async (resp: any) => {
      this.event = resp.data.event;
      this.pricings = resp.data.pricings;
      console.log('pricings', this.pricings)
      console.log('event', this.event);
    });
  }

  getUpcomingEvents () {
    this.eventService.getAllEvents().subscribe(async (resp: any) => {
      let allevents = <[]>resp.data.events;
      console.log('all events', resp.data);
      this.otherEvents = allevents.filter((ev: any) => ev._id !== this.eventId);
      console.log('other events', this.otherEvents)
    }, (err: any) => {
      console.log('error', err);
    })
  }

  ngOnInit(): void {}

  displayFlyer() {
    return this.displayImage(this.event?.flyer);
  }
  
  displayImage(flyer?: any) {
    return `${flyer?.fileBaseUrl}/${flyer?.filename}`;
  }

  viewDetails(id: string) {
    this.router.navigate(['events', id]);
  }

  addToCart(ticketId: string) {
    console.log('we are adding to cart', ticketId);
    this.cart.addToCart(ticketId);
  }

  timestamp (date: string) {
    console.log('date', date);
    console.log('type of ', typeof date);
    // let timestamp = date.getTime();
    // return timestamp;
    const indexOfT = date.indexOf("T");
    let newstrdate = date.substr(0, indexOfT);
    let datesplit = newstrdate.split("-");
    // var newDate = new Date( Number(datesplit[2]), Number(datesplit[1]) - 1, Number(datesplit[0]));
    let newDate = new Date(newstrdate);
    let ts = newDate.getTime();
    return ts;
  }
 
}
