export interface WorkOrder {
  id: number;
  client: string;
  serviceCompany: string;
  pad: string;
  pits: Array<Pit>;
  operativeCradle: string;
  backupCradle: string;
  operativeForklift: string;
  backupForklift: string;
  traktors: Array<Traktor>;
  pickups: Array<Pickup>;
  crews: Array<Crew>;
  rigmats: number;
  conex: number;
  generators: number;
  tower: number;
  cabin: number;
  draft: boolean;
}
export interface Pit {
  id: number;
  name: string;
}
export interface Traktor {
  id: number;
  chassis: string;
  supplier: string;
  description: string;
}
export interface Pickup {
  id: number;
  pickup_id: number;
  description: string;
}
export interface HumanResource {
  id: number;
  rol: string;
  name: string;
}
export interface Crew {
  id: number;
  timeStart: number;
  timeEnd: number;
  title: string;
  resources: Array<HumanResource>;
}
