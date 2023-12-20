export interface IUser {
  id: number;
  name: string;
  lastname: string;
  dni: string;
  photo: string;
  city: {
    city: string;
  };
  email: string;
  phone: string;
}
