export interface WorkOrder {
    id: number,
    order_number: string
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
    resources: Array<HumanResource>,
}