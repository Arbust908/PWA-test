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

export interface Pit {
    id?: number;
    name: string;
    workOrderId?: number;
}
export interface Traktor {
    id?: number;
    chassis: string;
    supplier: string;
    description: string;
    workOrderId: number;
}
export interface Pickup {
    id?: number;
    pickupId: number;
    description: string;
    workOrderId: number;
}
export interface HumanResource {
    id?: number;
    role: string;
    name: string;
    crewId: number;
}
export interface Crew {
    id?: number;
    timeStart: number;
    timeEnd: number;
    title: string;
    resources?: HumanResource[];
    workOrderId: number;
}

export interface WorkOrder {
    id?: number;
    client: string;
    serviceCompany: string;
    pad: string;
    pits: Pit[] | number[]; // Nope
    operativeCradle: string;
    backupCradle: string;
    operativeForklift: string;
    backupForklift: string;
    traktors: Traktor[];
    pickups: Pickup[];
    crews: Crew[];
    rigmats: number;
    conex: number;
    generators: number;
    tower: number;
    cabin: number;
    draft?: boolean;
}

export interface CompanyRepresentative {
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
    observations?: string;
    companyRepresentativeId: number;
    CompanyRepresentative?: CompanyRepresentative;
}

export interface Driver {
    id?: number;
    name: string;
    phone: string;
    observations?: string;
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
    observations?: string;
    sandOrders?: SandOrder[];
    categoryId?: number;
    category?: sandCategory;
}

export interface Cradle {
    id?: number;
    name: string;
    observations?: string;
}

export interface Forklift {
    id?: number;
    name: string;
    owned: boolean;
    ownerName: string;
    ownerContact: string;
    observations?: string;
}

export interface Company {
    id?: number;
    name: string;
    legalName: string;
    legalId: number;
    isOperator: boolean;
    childId: number;
    observations?: string;
    companyRepresentativeId: number;
    company?: Company;
    companyRepresentative?: CompanyRepresentative;
    sandPlans?: SandPlan[];
}

export interface SandStage {
    id?: number;
    stage: number;
    sandId1: number;
    sandA?: Sand;
    quantity1: number;
    sandId2: number;
    sandB?: Sand;
    quantity2: number;
    sandId3: number;
    sandC?: Sand;
    quantity3: number;
    action?: 'create' | 'update' | 'delete';
    sandPlanId: number;
    sandPlan?: SandPlan;
}

export interface SandPlan {
    id?: number;
    pitId: number;
    pit?: Pit;
    companyId: number;
    company?: Company;
    stagesAmount?: number;
    stages?: SandStage[];
    status: null | 'started' | 'in_progress' | 'finished';
}

export interface SandOrder {
    id?: number;
    sandTypeId: number;
    sandType?: Sand;
    amount: number;
    purchaseOrders?: PurchaseOrder[];
}

export interface TransportProvider {
    id?: number;
    name: string;
    amount: number;
    observations?: string;
    providerNotificationId: number;
    providerNotification?: ProviderNotification;
    purchaseOrders?: PurchaseOrder[];
}

export interface ProviderNotification {
    id?: number;
    sandProviderId: number;
    sandProvider?: SandProvider;
    sandOrderId: number;
    sandOrder?: SandOrder;
    transportProviders?: TransportProvider[];
}

export interface PurchaseOrder {
    id?: number;
    sandOrderId: number;
    transportProviderId: number;
    sandProviderId: number;
    sandProvider?: SandProvider;
    transportProvider?: TransportProvider;
    sandOrders?: SandOrder[];
}

export interface Warehouse {
    id?: number;
    clientCompanyId: number;
    clientCompany?: Company;
    pitId: number;
    pit?: Pit;
    layout: any;
}

export interface sandCategory {
    id?: number;
    name: string;
    sands?: Sand[];
}
export interface Box {
  category: string;
  col: number;
  floor: number;
  row: number;
}

export enum BoxCategory {
  empty = 'Vacio',
  cut = 'Caja cortada',
  thick = 'Arena gruesa',
  fine = 'Arena fina',
  aisle = 'Pasillo',
}

export enum SandStageStatus {
  started = 0,
  in_progress = 1,
  finished = 2,
}
