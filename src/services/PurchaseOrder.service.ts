import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { PurchaseOrder } from "@/interfaces/PurchaseOrder";

export default class PurchaseOrderAPIService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: "https://sandflow-qa.bitpatagonia.com/api/purchaseOrder",
      headers: {
        "Content-Type": "application/json"
      }
    });
  }

  private async axiosCall<T>(config: AxiosRequestConfig) {
    try {
      const { data } = await this.axiosInstance.request<T>(config);
      return [null, data];
    } catch (error) {
      return [error];
    }
  }

  async getAll() {
    return await this.getAllPurchaseOrders();
  }

  async getAllPurchaseOrders() {
    return this.axiosCall<Array<PurchaseOrder>>({ method: "GET" });
  }

  async getPurchaseOrder(purchaseOrderId: number) {
    return this.axiosCall<PurchaseOrder>({ method: "GET", url: `/${purchaseOrderId}` });
  }

  async createPurchaseOrder(purchaseOrder: PurchaseOrder) {
    return this.axiosCall<PurchaseOrder>({ method: "POST", data: purchaseOrder });
  }

  async updatePurchaseOrder(purchaseOrder: PurchaseOrder) {
    return this.axiosCall<PurchaseOrder>({ method: "PUT", url: `/${purchaseOrder.id}`, data: purchaseOrder });
  }

  async deletePurchaseOrder(purchaseOrderId: number) {
    return this.axiosCall<PurchaseOrder>({ method: "DELETE", url: `/${purchaseOrderId}` });
  }
}