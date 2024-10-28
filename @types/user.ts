export interface IUser {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
}

export interface IGoogleProfile {
  id: string;
  given_name: string;
  family_name: string;
  email: string;
}
