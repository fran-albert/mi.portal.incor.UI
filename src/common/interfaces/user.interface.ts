export interface IUser {
  id: number;
  name: string;
  lastname: string;
  birthDate: string;
  dni: string;
  photo: string;
  city: {
    city: string;
  };
  email: string;
  healthInsurance: string;
  phone: string;
  role: Array<{
    role: string;
  }>;
}