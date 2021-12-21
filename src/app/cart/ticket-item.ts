import { CartItem } from 'ng-shopping-cart';

export class TicketItem extends CartItem {
    public id: string;
    public eventId: string;
    public name: string;
    public ticketName: string;
    public price: number;
    public quantity: number;
    public image: string;
    public ticketImage: string;

    constructor(ticket: any = {}) {
        super();
        this.id = ticket.id;
        this.eventId = ticket.eventId
        this.name = ticket.name;
        this.ticketName = ticket.ticketName;
        this.image = ticket.image;
        this.price = ticket.price;
        this.quantity = ticket.quantity;
        this.ticketImage = ticket.ticketImage;
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getTicketName() {
        return this.ticketName;
    }

    getPrice() {
        return this.price;
    }

    getQuantity(): number {
        return this.quantity;
    }

    setQuantity(quantity: number): void {
        this.quantity = quantity;
    }

    getImage(): string {
        return this.image;
    }

    getTicketImage(): string {
        return this.ticketImage;
    }

}
