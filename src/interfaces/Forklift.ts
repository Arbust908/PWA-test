export interface Forklift {
  id?: number;
  name: string;
  owned: boolean;
  ownerName: string;
  ownerContact: string;
  observations?: string;
}