export interface IUser {
  id: string | number;
  username: string;
  email: string;
  imageurl: string;
}

export interface IAdmin extends IUser {
  isAdmin: boolean;
}
