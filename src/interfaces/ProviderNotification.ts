import Sand from "@/interfaces/SandType";

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
  id?: number;
  sandProvider: string;
  sandOrders: Array<SandOrder>;
  transportProviders: Array<TransportProvider>;
}