import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { WorkOrder } from "@/interfaces/WorkOrder";

export default class WorkOrderAPIService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: "https://sandflow-qa.bitpatagonia.com/api/workOrder",
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

  async getAllWorkOrders() {
    return this.axiosCall<Array<WorkOrder>>({ method: "GET" });
  }

  async getWorkOrder(WorkOrderId: number) {
    return this.axiosCall<WorkOrder>({ method: "GET", url: `/${WorkOrderId}` });
  }

  async createWorkOrder(WorkOrder: WorkOrder) {
    return this.axiosCall<WorkOrder>({ method: "POST", data: WorkOrder });
  }

  async updateWorkOrder(WorkOrder: WorkOrder) {
    return this.axiosCall<WorkOrder>({ method: "PUT", url: `/${WorkOrder.id}`, data: WorkOrder });
  }

  async deleteWorkOrder(WorkOrderId: number) {
    return this.axiosCall<WorkOrder>({ method: "DELETE", url: `/${WorkOrderId}` });
  }
}
export default new WorkOrderService();
