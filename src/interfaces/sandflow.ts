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

export enum BoxCategory {
    empty = 'Vacio',
    cut = 'Cortada',
    thick = 'Gruesa',
    fine = 'Fina',
    aisle = 'Pasillo',
}
export enum SandStageStatus {
    started = 0,
    in_progress = 1,
    finished = 2,
}
// TODO
export interface StageSheet {
    id?: number;
    companyId: number;
    compnay?: Company;
    pitId: number;
    pit?: Pit;
    warehouseId: number;
    warehouse?: Warehouse;
    stages?: SandStage[];
    operativeCradleId: number;
    backupCradleId: number;
    operativeCradle?: Cradle;
    backupCradle?: Cradle;
}

export interface Pit {
    id?: number;
    name: string;
    workOrderId?: number;
    companyId?: number;
    company?: Company;
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
    pickupId: number; // Esto va como string
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
    client: string; // Id
    serviceCompany: string; // Id
    pad: string;
    pits: Pit[] | number[]; // Nope
    operativeCradle: string; // Id
    backupCradle: string; // Id
    operativeForklift: string; // Id
    backupForklift: string; // Id
    traktors: Traktor[];
    pickups: Pickup[];
    crews?: Crew[];
    crew?: Crew[];
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
    email: string;
    phone: string;
}

export interface SandProvider {
    id?: number;
    name: string;
    address: string;
    legalId: number;
    meshType: any;
    observations?: string;
    companyRepresentativeId: number;
    CompanyRepresentative?: CompanyRepresentative;
    ProviderNotifications?: ProviderNotification[];
    PurhcaseOrders?: PurchaseOrder[];
    SandOrders?: SandOrder[];
}

export interface Driver {
    id?: number;
    name: string;
    phone: string;
    email: string;
    vehicleType: string;
    vehicleId: string;
    transportId: string;
    transportId2?: string;
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
    // description?: string;
    // meshType: string;
    // grainType: string;
    observations?: string;
    sandOrders?: SandOrder[];
    categoryId?: number;
    category?: sandCategory;
}

export interface Cradle {
    id?: number;
    name: string;
    slots: string[]; // json
    observations?: string;
}

export interface Forklift {
    id?: number;
    name: string;
    owned?: boolean;
    ownerName?: string;
    ownerContact?: string;
    observations?: string;
}

export interface Company {
    id?: number;
    name: string;
    legalId: number;
    address: string;
    isOperator: boolean;
    childId?: number;
    observations?: string;
    companyRepresentativeId: number;
    company?: Company;
    companyRepresentative?: CompanyRepresentative;
    sandPlans?: SandPlan[];
    pits?: Pit[];
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
    status: null | 'started' | 'in_progress' | 'finished';
}

export interface SandPlan {
    id?: number;
    pitId: number;
    pit?: Pit;
    companyId: number;
    company?: Company;
    stagesAmount?: number;
    stages?: SandStage[];
}

export interface SandOrder {
    id?: number;
    sandTypeId: number;
    sandType?: Sand;
    amount: number;
    purchaseOrderId: number;
    purchaseOrder?: PurchaseOrder;
    sandProviderId: number;
    sandProvider?: SandProvider;
    boxId?: string;
}

export interface TransportProvider {
    id?: number;
    name: string;
    legalId: number;
    address: string;
    observations?: string;
    companyRepresentativeId: number;
    CompanyRepresentative?: CompanyRepresentative;
    // amount: number; // no va
    providerNotificationId: number; // no se si va aca
    providerNotification?: ProviderNotification; // no se si va aca
    purchaseOrders?: PurchaseOrder[]; // no se si va aca
    drivers?: Driver[];
}

export interface ProviderNotification {
    // ??? Dudas
    id?: number;
    sandProviderId: number;
    sandProvider?: SandProvider;
    sandOrderId: number;
    sandOrder?: SandOrder;
    transportProviderId: number;
    transportProviders?: TransportProvider;
}

export interface PurchaseOrder {
    id?: number;
    transportProviderId: number;
    deliveryTime: any;
    packageObservations: string;
    driverId: number;
    driver?: Driver;
    sandProviderId: number;
    sandProvider?: SandProvider;
    pitId: number;
    pit?: Pit;
    companyId: number;
    company?: Company;
    transportProvider?: TransportProvider;
    sandOrders?: SandOrder[];
    transportOrders?: TransportOrder[];
}
export interface TransportOrder {
    id?: number;
    boxAmount: number;
    licensePlate: string;
    observations: string;
    purchaseOrderId: number;
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
    id?: number;
    warehouseId: number | null;
    warehouse?: Warehouse;
    category: string;
    col: number;
    floor: number;
    row: number;
}

export interface StageSheet {
    id?: number;
    companyId: number;
    company?: Company;
    pitId: number;
    pit?: Pit;
    warehouseId: number;
    warehouse?: Warehouse;
    stages?: SandStage[];
    operativeCradleId: number;
    backupCradleId: number;
    operativeCradle?: Cradle;
    backupCradle?: Cradle;
}
