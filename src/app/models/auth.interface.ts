export interface IAccount {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    otherNames?: string;
    primaryMobileNumber: string;
    otherNumbers?: string[];
    occupation?: string;
    gender: string;
}

export interface ICredentials {
    username: string;
    password: string;
    isAdmin?: boolean;
}

export interface IUser extends ICredentials {
    role: string;
}

export interface IProfile {
    facebookHandle?: string;
    instagramHandle?: string;
    twitterHandle?: string;
}
