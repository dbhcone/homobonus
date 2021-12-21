const Auth = {
    login: '/auth/login',
    signup: '/auth/signup',
    activate: '/auth/activate-account',
    merchantSignup: '/auth/merchantsignup',
};

const General = {
    contactus: '/contactus',
};

const Events = {
    create: '/events',
    update: '/events',
    getOne: '/events',
    all: '/events',
    deleteOne: '/events',

    // pricings
    pricings: '/events/pricelist',
    addPricing: '/events/pricelist',
    updatePricing: '/events/pricelist',
    getPrice: '/events/pricings',
};

const Purchases = {
    create: '/purchases',

    // user purchase
    userPurchases: '/user/purchases',

    redeemTicket: '/user/ticket/redeem',
};

const Payments = {
    listPayments: '/payments/listPaymentOptions',
};

const Statistics = {
    generalOverview: '/admin/stats/generaloverview',
    eventPortal: '/admin/stats/eventportal',
};
export { Auth, General, Events, Statistics, Purchases, Payments };
