export enum Role {
  SuperAdmin = 99,
  Admin = 10,
  Logged = 1,
  Guest = 0,
}
export interface User {
  id: number;
  username: string;
  role: Role;
}
