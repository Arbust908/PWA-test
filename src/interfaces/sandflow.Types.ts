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
    time: number;
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
    sandId: number;
    sand?: Sand;
    quantity: number;
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
    sandProvider?: SandProvider;
    transportProvider?: TransportProvider;
    sandOrders?: SandOrder[];
}