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
    resources?: Array<HumanResource>;
    workOrderId: number;
}
export interface WorkOrder {
    id?: number;
    client: string;
    serviceCompany: string;
    pad: string;
    pits: Array<Pit | number>; // Nope
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
    sandOrders?: Array<SandOrder>;
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
    Company?: Company;
    CompanyRepresentative?: CompanyRepresentative;
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
    stagesAmount?: number;
    stages?: Array<SandStage>;
}
export interface SandOrder {
    id?: number;
    sandTypeId: number;
    sandType?: Sand;
    amount: number;
}
export interface TransportProvider {
    id?: number;
    name: string;
    amount: number;
    observations?: string;
    providerNotificationId: number;
    providerNotification?: ProviderNotification;
}
export interface ProviderNotification {
    id?: number;
    sandProviderId: number;
    sandProvider?: SandProvider;
    sandOrderId: number;
    sandOrder?: SandOrder;
    transportProviders?: Array<TransportProvider>;
}