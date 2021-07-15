import apiClient from "@/http-common";

class WorkOrderService {
  getAll(): Promise<any> {
    return apiClient.get("/workOrder");
  }

  get(id: number): Promise<any> {
    return apiClient.get(`/workOrder/${id}`);
  }

  // create(data: any): Promise<any> {
  //   return http.post("/tutorials", data);
  // }

  // update(id: any, data: any): Promise<any> {
  //   return http.put(`/tutorials/${id}`, data);
  // }

  // delete(id: any): Promise<any> {
  //   return http.delete(`/tutorials/${id}`);
  // }

  // deleteAll(): Promise<any> {
  //   return http.delete(`/tutorials`);
  // }

  // findByTitle(title: string): Promise<any> {
  //   return http.get(`/tutorials?title=${title}`);
  // }
}

export default new WorkOrderService();