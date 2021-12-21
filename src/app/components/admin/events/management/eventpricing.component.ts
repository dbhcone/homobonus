import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventService } from 'src/app/services/event.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-eventpricing',
  templateUrl: './eventpricing.component.html',
  styleUrls: ['./eventpricing.component.scss'],
})
export class EventpricingComponent implements OnInit {
  submitting = false;
  pricingForm;
  HEADING = 'ADD PRICING DETAIL';
  SAVE = 'SAVE';
  constructor(
    private eventService: EventService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EventpricingComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
    this.pricingForm = fb.group({
      name: [data?.pricing?.name || null, Validators.compose([Validators.required])],
      allowableNumberOfPersons: [
        data?.pricing?.allowableNumberOfPersons || 1,
        Validators.compose([Validators.required, Validators.min(0)]),
      ],
      amount: [
        data?.pricing?.amount || 0,
        Validators.compose([Validators.min(0), Validators.required]),
      ],
    });
    if (this.data._id) {
      this.HEADING = 'EDIT PRICING DETAILS';
      this.SAVE = 'SAVE CHANGES';
    }
  }

  ngOnInit(): void {}

  public get name(): AbstractControl | null {
    return this.pricingForm.get('name');
  }

  public get allowableNumberOfPersons(): AbstractControl | null {
    return this.pricingForm.get('allowableNumberOfPersons');
  }
  public get amount(): AbstractControl | null {
    return this.pricingForm.get('amount');
  }

  onSubmit() {
    let obs;
    this.submitting = true;
    if (this.data._id) {
      console.log('updating ticket');
      obs = this.eventService.updatePricing(
        this.data._id,
        this.pricingForm.value
      );
    } else {
      console.log('new ticket');
      obs = this.eventService.addPricing(
        this.data.eventId,
        this.pricingForm.value
      );
    }

    obs.subscribe(
      async (resp: any) => {
        console.log('Pricing', resp);
        Swal.fire({ text: resp.message, icon: 'success', timer: 5000 });
      },
      (err) => {
        this.submitting = false;
        Swal.fire({
          title: `${err.error.status} - ${err.error.code}`,
          text: `${err.error.message}`,
          icon: 'error',
        });
      }
    );
  }
}
