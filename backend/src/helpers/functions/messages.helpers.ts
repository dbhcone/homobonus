import config from 'config';
const callbackurl = <string>config.get('CALLBACK_URL') || '';

const accountCreationMsg = (firstName: string, token: string, pin: string) => {
    // const str = `Welcome ${firstName}. Kindly follow this link ${callbackurl}/auth/activate-account?token=${token} to activate your account.
    // Your PIN is ${pin}`;
    const str = `Welcome ${firstName}. Kindly follow this link ${callbackurl}/auth/activate-account?token=null to activate your account.
    Your PIN is ${pin}`;

    return str;
};

const ticketPurchaseMsg = (firstName: string, ticketId: string) => {
    const str = `Hi ${firstName}. Your purchase was successful. Kindly click this link ${callbackurl}/user/tickets/${ticketId} to see ticket details`;

    return str;
};

const ticketVerificationMsg = (firstName: string, pin: string) => {
    const str = `Hello ${firstName}, your verification code is ${pin}. Kindly mention it to the agent.`;

    return str;
};

export { accountCreationMsg, ticketPurchaseMsg, ticketVerificationMsg };
