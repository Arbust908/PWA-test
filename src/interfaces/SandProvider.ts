export interface companyRepresentative {
  id?: number;
  name: string;
  legalId: number;
  email: string;
  phone: string;
}

export interface SandProvider {
  id?: number;
  name: string;
  legalName: string;
  legalId: number;
  meshType: string;
  grains: string;
  observations: string;
  companyRepresentative?: companyRepresentative;
  companyRepresentativeId: number;
}
export interface Driver {
  id?: number;
  name: string;
  phone: number;
  observations: string;
}
export interface Vehicle {
  id?: number;
  transportId: string;
  driverId: number;
  Driver?: Driver;
}
export interface Sand {
  id?: number;
  type: string;
  description: string;
  meshType: string;
  grainType: string;
  observations: string;
}
export interface Cradle {
  id?: number;
  name: string;
  observations: string;
}
export interface Forklift {
  name: string;
  owned: boolean;
  ownerName: string;
  ownerContact: string;
  observations: string;
}
export interface Company {
  id?: number;
  name: string;
  legalName: string;
  legalId: number;
  isOperator: boolean;
  childId: number;
  observations: string;
  child?: Company;
  companyRepresentative?: companyRepresentative;
}