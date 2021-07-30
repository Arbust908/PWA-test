export interface PurchaseOrder {
    id: number,
    sandProvider: SandProvider,
    sandOrders: Array<SandOrder>,
    transportProvider: TransportProvider,
}
export interface SandProvider {
    id: number,
    name: string,
    sandOrders: Array<SandOrder>,
}
export interface SandOrder {
    id: number,
    type: string,
    quantity: number,
    boxId: number,
}
export interface TransportProvider {
    id: number,
    name: string,
    transportId: string,
    boxQuantity: number,
    observation: string,
}
