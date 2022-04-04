import { axiosInstance } from "./client";
import { MetricProperties } from "../types/metrics";

export class MetricClient {
  /**
   * Get metrics
   */
  public static getMetrics = async (): Promise<MetricProperties> => {
    const { data } = await axiosInstance.get<MetricProperties>("/metrics");
    return data;
  };
}
