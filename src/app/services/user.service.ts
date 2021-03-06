import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchases, User } from '../api/endpoints';
import { Client } from '../utils/client';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    httpOptions = {
        headers: new HttpHeaders({
            'Access-Control-Allow-Origin': '*',
            Authorization: `Bearer ${localStorage.getItem('access-token')}`
        })
    };
    constructor(private client: Client) {}

    getAllPurchases(userId: string) {
        return this.client.GET(`${Purchases.userPurchases}/${userId}`);
    }

    getUserDetails() {
        return this.client.GET(User.getDetails);
    }

    updateUserProfile(id: string, data: FormData) {
        const headers = { Authorization: `Bearer ${localStorage.getItem('access-token')}` };
        return this.client.PATCH(User.updateProfile, id, data, headers);
    }
}
