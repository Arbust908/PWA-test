export interface WorkOrder {
    id: number,
    client: string,
    service_co: string,
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
    isFull: boolean,
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