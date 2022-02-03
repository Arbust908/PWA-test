/* eslint no-use-before-define: 0 */

export interface Pit {
    id?: number;
    name: string;
    workOrderId?: number;
    companyId?: number;
    company?: Company;
    workOrder?: WorkOrder;
    purchaseOrders?: PurchaseOrder[];
    stageSheets?: StageSheet[];
    sandPlans?: SandPlan[];
    warehouses?: Warehouse[];
    visible?: boolean;
}
export interface Traktor {
    id?: number;
    chassis: string;
    supplier: string;
    description: string;
    workOrderId: number;
    workOrder?: WorkOrder[];
    visible?: boolean;
}
export interface Pickup {
    id?: number;
    pickupId: string;
    description: string;
    workOrderId: number;
    workOrder?: WorkOrder[];
    visible?: boolean;
}
export interface HumanResource {
    id?: number;
    role: string | number;
    name: string | number;
    crewId: number;
    crew?: Crew;
    visible?: boolean;
}
export interface Crew {
    id?: number;
    timeStart: number;
    timeEnd: number;
    title: string;
    workOrderId: number;
    resources?: HumanResource[];
    workOrder?: WorkOrder[];
    visible?: boolean;
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
    visible: boolean;
}

export interface CompanyRepresentative {
    id?: number;
    name: string;
    email: string;
    phone: string;
    sandProviders?: SandProvider[];
    company?: Company[];
    transportProviders?: TransportProvider[];
    visible?: boolean;
}

export interface SandProvider {
    id?: number;
    name: string;
    address: string;
    legalId: number;
    meshType: any;
    observations?: string;
    companyRepresentativeId: number;
    visible: boolean;
    CompanyRepresentative?: CompanyRepresentative;
    ProviderNotifications?: ProviderNotification[];
    PurhcaseOrders?: PurchaseOrder[];
    SandOrders?: SandOrder[];
    Sands?: Sand[];
}

export interface Driver {
    id?: number;
    name: string;
    phone: string;
    email: string;
    vehicleType: string;
    transportId: string;
    transportProviderId?: number;
    observations?: string;
    visible: boolean;
    transportProvider?: TransportProvider;
    vehicles?: Vehicle[];
}

export interface Vehicle {
    id?: number;
    transportId: string;
    driverId: number;
    Driver?: Driver;
    visible?: boolean;
}

export interface Sand {
    id?: number;
    type: string;
    categoryId?: number;
    observations?: string;
    visible: boolean;
    sandOrders?: SandOrder[];
    category?: sandCategory;
}

export interface Cradle {
    id?: number;
    name: string;
    observations?: string;
    slots?: any[];
    visible: boolean;
    stageSheets?: StageSheet[];
    backupStageSheets?: StageSheet[];
}

export interface Forklift {
    id?: number;
    name: string;
    owned?: boolean;
    ownerName?: string;
    ownerContact?: string;
    observations?: string;
    visible: boolean;
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
    visible: boolean;
    company?: Company;
    companyRepresentative?: CompanyRepresentative;
    sandPlans?: SandPlan[];
    pits?: Pit[];
    purchaseOrders?: PurchaseOrder[];
    stageSheets?: StageSheet[];
    warehouses?: Warehouse[];
    child?: Company[];
}

export interface SandStage {
    id?: number;
    stage: number;
    sandId1: number;
    sandA?: Sand;
    sandId2: number;
    sandB?: Sand;
    sandId3: number;
    sandC?: Sand;
    sandId4: number;
    sandD?: Sand;
    quantity1: number;
    quantity2: number;
    quantity3: number;
    quantity4: number;
    action?: 'create' | 'update' | 'delete';
    sandPlanId: number;
    sandPlan?: SandPlan;
    status: null | 0 | 1 | 2;
    visible?: boolean;
}

export interface SandPlan {
    id?: number;
    pitId: number;
    companyId: number;
    stagesAmount?: number;
    visible: boolean;
    pit?: Pit;
    company?: Company;
    stages?: SandStage[];
}

export interface SandOrder {
    id?: number;
    sandTypeId: number;
    amount: number;
    purchaseOrderId: number;
    sandProviderId: number;
    boxId?: string;
    status: number;
    location: string;
    providerNotifications?: ProviderNotification[];
    queueItems?: QueueItem[];
    sandType?: Sand;
    purchaseOrder?: PurchaseOrder;
    sandProvider?: SandProvider;
    visible?: boolean;
}

// "{\"where\":\"warehouse\",\"where_id\":1,\"floor\":1,\"row\":2,\"col\":5}"
// {\"where\":\"cradle\",\"where_id\":4,\"where_slot\":2,\"where_origin\":\"Estación 3\"}"
export interface BoxLocation {
    where?: string;
    where_id?: number;
    floor?: number;
    row?: number;
    col?: number;
    origin?: string;
    origin_id?: number;
    where_origin?: string;
}
export interface SandOrderBox {
    id?: number;
    sandTypeId: number;
    amount: number;
    purchaseOrderId: number;
    sandProviderId: number;
    boxId?: string;
    status: number;
    location: BoxLocation;
    sandType?: Sand;
    floor?: number;
    row?: number;
    column?: number;
    purchaseOrder?: PurchaseOrder;
    sandProvider?: SandProvider;
    visible?: boolean;
}

export interface TransportProvider {
    id?: number;
    name: string;
    legalId: number;
    address: string;
    observations?: string;
    providerNotificationId?: number;
    companyRepresentativeId: number;
    visible: boolean;
    providerNotification?: ProviderNotification;
    purchaseOrders?: PurchaseOrder[];
    CompanyRepresentative?: CompanyRepresentative;
    drivers?: Driver[];
}

export interface ProviderNotification {
    id?: number;
    sandProviderId: number;
    sandOrderId: number;
    transportProviderId: number;
    data: any;
    sandProvider?: SandProvider;
    sandOrder?: SandOrder;
    transportProvider?: TransportProvider;
    visible?: boolean;
}

export interface PurchaseOrder {
    id?: number;
    companyId: number;
    pitId: number;
    sandProviderId: number;
    transportProviderId: number;
    isFullyAllocated: number;
    deliveryTime: Date;
    packageObservations: string;
    company?: Company;
    sandOrders?: SandOrder[];
    transportOrders?: TransportOrder[];
    transportProvider?: TransportProvider;
    sandProvider?: SandProvider;
    pit?: Pit;
    notificationStatus?: number;
    visible?: boolean;
}

export interface TransportOrder {
    id?: number;
    boxAmount: string;
    driverId?: number;
    licensePlate?: string;
    observations: string;
    purchaseOrderId: number;
    purchaseOrder?: PurchaseOrder;
    visible?: boolean;
}

export interface Warehouse {
    id?: number;
    clientCompanyId: number;
    pitId: number;
    layout: any;
    visible: boolean;
    pit?: Pit;
    stageSheets?: StageSheet[];
    clientCompany?: Company;
}

export interface sandCategory {
    id?: number;
    name: string;
    sands?: Sand[];
}

export interface StageSheet {
    id?: number;
    companyId: number;
    pitId: number;
    warehouseId: number;
    operativeCradleId: number;
    backupCradleId: number;
    company?: Company;
    pit?: Pit;
    warehouse?: Warehouse;
    stages?: SandStage[];
    operativeCradle?: Cradle;
    backupCradle?: Cradle;
    visible?: boolean;
}

export interface User {
    id?: number;
    firstName: string;
    midName: string;
    lastName: string;
    email: string;
    password: string;
    roleId: number;
    active: boolean;
    Role?: Role;
    visible?: boolean;
}

export interface Role {
    id?: number;
    name: string;
    permissions: any;
}

export enum Roles {
    SuperAdmin = 99,
    Admin = 10,
    Logged = 1,
    Guest = 0,
}

export enum BoxCategory {
    empty = 'Caja Vacía',
    cradle = 'Cradle',
    aisle = 'Pasillo',
}
export enum SandStageStatus {
    started = 0,
    in_progress = 1,
    finished = 2,
}
// TODO
export interface Box {
    id?: number;
    warehouseId: number | null;
    warehouse?: Warehouse;
    category: string;
    col: number;
    floor: number;
    row: number;
    visible?: boolean;
}
export interface QueueItem {
    id?: number;
    sandOrderId: number;
    sandOrder?: SandOrder;
    pitId: number;
    pit?: Pit;
    origin: string;
    destination: string;
    status: number;
    // 0 - Pendiente
    // 10 - A retirar
    // 20 - En Cola ?
    // 99 - Finalizado
    order: number;
    // 999999 - 900000 aTRansporte
    // 99999 - 90000 Retiro ( cradleAOtro )
    // 9999 - 9000 TRansporte a Otro
    // 999 - 500 Deposito a Cradle
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

/* 
C - T 
D - T

C - D

T - C
T - D /

D - C
*/
