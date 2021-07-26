export interface SandOrder {
  id: string;
  sandType: Sand;
  amount: number;
}

export interface TransportProvider {
  id: string;
  name: string;
  amount: number;
  observation: string;
}

export interface ProviderNotification {
id: number;
sandProvider: string;
sandOrder: SandOrder;
transportProviders: Array<TransportProvider>;
}

export interface Sand {
  id: number;
  type: string;
  description: string;
  meshType: string;
  grainType: string;
  observations: string;
}

export enum Role {
  SuperAdmin = 99,
  Admin = 10,
  Logged = 1,
  Guest = 0,
}
export interface User {
  id: number,
  username: string,
  role: Role
}

export interface WorkOrder {
  id: number,
  client: string,
  serviceCompany: string,
  pad: string,
  pits: Array<Pit>,
  operativeCradle: string,
  backupCradle: string,
  operativeForklift: string,
  backupForklift: string,
  traktors: Array<Traktor>,
  pickups: Array<Pickup>,
  crews: Array<Crew>,
  rigmats: number,
  conex: number,
  generators: number,
  tower: number,
  cabin: number,
  draft: boolean,
}
export interface Pit {
  id: number,
  name: string
}
export interface Traktor {
  id: number,
  chassis: string,
  supplier: string,
  description: string,
}
export interface Pickup {
  id: number,
  pickup_id: number,
  description: string,
}
export interface HumanResource {
  id: number,
  rol: string,
  name: string,
}
export interface Crew {
  id: number,
  time: number,
  title: string,
  resources: Array<HumanResource>,
}