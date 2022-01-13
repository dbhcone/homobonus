export interface AppState {
    readonly cart: { items: []; shipping: number; taxRate: number };
    readonly userObj: { user: { id: string; username: string; email: string; role: string } };
    readonly userProfile: { accountOwner: any; profile?: any };
}
