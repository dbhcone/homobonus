import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { EventService } from 'src/app/services/event.service';
import Swal from 'sweetalert2';
import { EventpricingComponent } from './eventpricing.component';

@Component({
  selector: 'app-eventmanagement',
  templateUrl: './eventmanagement.component.html',
  styleUrls: ['./eventmanagement.component.scss'],
})
export class EventmanagementComponent implements OnInit {
  displayedColumns = [
    // 'thumbnail',
    'name',
    'quantity',
    'amount',
    'edit',
    'delete',
  ];
  dataSource: MatTableDataSource<any>;
  subscription?: Subscription;

  eventDetailsForm!: FormGroup;
  eventDetail: any;
  eventId: any;
  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private actRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {
    const id = this.actRoute.snapshot.params['id'];
    this.eventId = id;
    console.log('id', id);

    this.getEventDetails(id);
    this.dataSource = new MatTableDataSource();
    this.getPricings(id);
  }

  generateForm(event?: any) {
    this.eventDetailsForm = this.fb.group({
      title: [
        event?.title || null,
        Validators.compose([Validators.required, Validators.minLength(5)]),
      ],
      date: [event?.date || null, Validators.required],
      time: [event?.time || null, Validators.required],
      capacity: [event?.capacity || null],
      venue: [event?.venue || null, Validators.required],
      description: [
        event?.description || null,
        Validators.compose([Validators.required, Validators.minLength(10)]),
      ],
    });
  }

  getEventDetails(id: string) {
    this.eventService.getEvent(id).subscribe(
      async (resp: any) => {
        this.eventDetail = resp.data;
        console.log('event detail', this.eventDetail);
        // now pass form
        this.generateForm(this.eventDetail?.event);
      },
      (err: any) => {
        console.log('error', err);
      }
    );
  }

  ngOnInit(): void {}

  triggerDeletePrice(id: string) {
    Swal.fire('You want to delete pricing with id of ' + id);
  }

  openPricingForm(data?: any): void {
    console.log('data', data);
    const dialogRef = this.dialog.open(EventpricingComponent, {
      disableClose: true,
      data: data || { eventId: this.eventId },
      width: '400px',
    });
    this.subscription = dialogRef.afterClosed().subscribe((result) => {
      console.log('dialog closed', result);
      this.getPricings(this.eventId);
    });
  }

  getPricings(id: string) {
    console.log('We are fetching pricings');
    this.eventService.getEventPricings(id).subscribe(
      async (res: any) => {
        this.dataSource.data = res.data;
        console.log('pricings fetched', res.data);
      },
      (err: any) => {
        console.log(err.error.message);
      }
    );
  }

  public get title(): AbstractControl | null {
    return this.eventDetailsForm.get('title');
  }

  public get date(): AbstractControl | null {
    return this.eventDetailsForm.get('date');
  }

  public get time(): AbstractControl | null {
    return this.eventDetailsForm.get('time');
  }

  public get capacity(): AbstractControl | null {
    return this.eventDetailsForm.get('capacity');
  }

  public get venue(): AbstractControl | null {
    return this.eventDetailsForm.get('venue');
  }

  public get description(): AbstractControl | null {
    return this.eventDetailsForm.get('description');
  }

  saveEventChanges() {
    const id = this.eventDetail.event._id;
    const event = this.eventDetailsForm.value;
    this.eventService.updateEvent(id, event).subscribe(
      async (resp: any) => {
        Swal.fire({
          timer: 3000,
          text: resp.message,
        });
      },
      (err: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          titleText: err.error.message,
        });
      }
    );
  }

  displayThumbnail(photourl: string) {
    // TODO: return full path
    return '';
  }
}
