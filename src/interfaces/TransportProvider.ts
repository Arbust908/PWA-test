export interface TransportProvider {
  id: number,
  name: string;
  amount: number;
  observations?: string;
  providerNotificationId: number;
}