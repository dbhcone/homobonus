import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { General, Statistics } from '../api/endpoints';
import { IContactUs } from '../models/contactus.interface';
import { Client } from '../utils/client';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  constructor(private client: Client) {}

  contactUs(contactus: IContactUs) {
    return this.client.POST(`${General.contactus}`, contactus);
  }

  twelveHourTime(time: string) {
    const [h, m] = time.split(':');
    let date = new Date(0, 0, 0, parseInt(h), parseInt(m));
    return moment(date).format('hh:mm a')
  }

  overView() {
    return this.client.GET(`${Statistics.generalOverview}`);
  }
}
