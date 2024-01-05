export interface IFormData {
  name: string;
  lastname: string;
  phone: string;
  dni: string;
  birthDate: Date | null;
  healthInsurance: string;
  email: string;
  role?: string[];
  idCity: string;
  photo: string;
}
