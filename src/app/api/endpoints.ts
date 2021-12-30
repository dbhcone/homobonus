const Auth = {
    login: '/auth/login',
    signup: '/auth/signup',
    activate: '/auth/activate-account',
    merchantSignup: '/auth/merchantsignup',
    allUsers: '/auth/users'
};

const General = {
    contactus: '/contactus'
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
    getPrice: '/events/pricings'
};

const Confirmations = {
    all: '/confirmations',
    create: '/confirmations'
};

const Purchases = {
    create: '/purchases',
    getOneUserPurchase: '/purchases',
    // user purchase
    userPurchases: '/user/purchases',
    redeemTicket: '/user/ticket/redeem',
    verifyTicket: '/user/ticket/verify'
};

const Payments = {
    listPayments: '/payments/listPaymentOptions'
};

const Statistics = {
    generalOverview: '/admin/stats/generaloverview',
    eventPortal: '/admin/stats/eventportal'
};
export { Auth, General, Events, Statistics, Purchases, Payments, Confirmations };
