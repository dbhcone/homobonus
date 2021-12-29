import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Events, Purchases, Payments } from '../api/endpoints';
import { Client } from '../utils/client';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    httpOptions = {
        headers: new HttpHeaders({
            'Access-Control-Allow-Origin': '*',
            Authorization: `Bearer ${localStorage.getItem('access-token')}`
        })
    };
    constructor(private client: Client) {}

    listPaymentOptions(data?: any, headers?: any) {
        return this.client.POST(Payments.listPayments, data, headers);
    }
    //#region Purchases
    makePayment(user: any, items: []) {
        return this.client.POST(Purchases.create, { user, items });
    }

    getPurchase(purchaseId: string, userId: string) {
        const fullUri = `${Purchases.getOneUserPurchase}/${purchaseId}/user/${userId}`;
        return this.client.GET(fullUri);
    }
}
