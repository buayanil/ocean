import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { MetricClient } from "../api/metricClient";
import { MetricProperties } from "../types/metrics";

export const useMetricsQuery = (
  options?: UseQueryOptions<MetricProperties>
) => {
  return useQuery<MetricProperties>(
    ["metrics"],
    async () => {
      const data = await MetricClient.getMetrics();
      return data;
    },
    {
      ...options,
    }
  );
};
