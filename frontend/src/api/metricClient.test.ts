import { MetricClient } from "./metricClient";
import { axiosInstance } from "./client";
import { MetricProperties } from "../types/metrics";

jest.mock("./client");

describe("MetricClient", () => {
    const mockAxiosInstance = axiosInstance as jest.Mocked<typeof axiosInstance>;

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should fetch metrics successfully", async () => {
        const mockMetrics: MetricProperties = {
            totalInstances: 50,
            totalUsers: 150,
        };

        mockAxiosInstance.get.mockResolvedValueOnce({ data: mockMetrics });

        const result = await MetricClient.getMetrics();

        expect(mockAxiosInstance.get).toHaveBeenCalledWith("/metrics");
        expect(result).toEqual(mockMetrics);
    });

    it("should propagate errors from the API call", async () => {
        const mockError = new Error("Network error");

        mockAxiosInstance.get.mockRejectedValueOnce(mockError);

        await expect(MetricClient.getMetrics()).rejects.toThrow("Network error");
        expect(mockAxiosInstance.get).toHaveBeenCalledWith("/metrics");
    });
});
