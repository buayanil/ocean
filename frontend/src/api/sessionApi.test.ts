import { describe, it, expect, vi } from "vitest";
import { axiosInstance } from "./client";
import { SessionApi } from "./sessionApi";

// Mock the axiosInstance
vi.mock("./client", () => ({
    axiosInstance: {
        post: vi.fn(),
    },
}));

// Explicitly type the mocked axiosInstance
const mockedAxiosInstance = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe("SessionApi", () => {
    // Test case 1: Successful login
    it("sends a POST request to /auth/signin with credentials and returns tokens", async () => {
        const mockResponse = { data: { accessToken: "access123", refreshToken: "refresh123" } };
        mockedAxiosInstance.post.mockResolvedValueOnce(mockResponse);

        const result = await SessionApi.login({ username: "testuser", password: "password123" });

        expect(mockedAxiosInstance.post).toHaveBeenCalledWith("/auth/signin", {
            username: "testuser",
            password: "password123",
        });
        expect(result).toEqual(mockResponse.data);
    });

    // Test case 2: Failed login (e.g., invalid credentials)
    it("throws an error when login fails", async () => {
        mockedAxiosInstance.post.mockRejectedValueOnce(new Error("Invalid credentials"));

        await expect(
            SessionApi.login({ username: "wronguser", password: "wrongpassword" })
        ).rejects.toThrow("Invalid credentials");
    });

    // Test case 3: Successful token refresh
    it("refreshes tokens successfully and validates the response schema", async () => {
        const mockResponse = { data: { accessToken: "access123", refreshToken: "refresh123" } };
        mockedAxiosInstance.post.mockResolvedValueOnce(mockResponse);

        const result = await SessionApi.refreshToken({ refreshToken: "refresh123" });

        expect(mockedAxiosInstance.post).toHaveBeenCalledWith("/auth/refresh-token", {
            refreshToken: "refresh123",
        });
        expect(result).toEqual(mockResponse.data);
    });

    // Test case 4: Failed token refresh
    it("throws an error when token refresh fails", async () => {
        mockedAxiosInstance.post.mockRejectedValueOnce(new Error("Token refresh failed"));

        await expect(
            SessionApi.refreshToken({ refreshToken: "invalidRefreshToken" })
        ).rejects.toThrow("Token refresh failed");
    });

    // Test case 5: Ensures the new token is used for subsequent requests
    it("uses the refreshed token for subsequent requests", async () => {
        const mockRefreshResponse = { data: { accessToken: "newAccessToken", refreshToken: "newRefreshToken" } };
        mockedAxiosInstance.post.mockResolvedValueOnce(mockRefreshResponse);

        const result = await SessionApi.refreshToken({ refreshToken: "refresh123" });

        // Simulate subsequent request with the new token
        mockedAxiosInstance.post.mockResolvedValueOnce({ data: { success: true } });

        // Assume there's a method to make authenticated requests
        const nextResponse = await axiosInstance.post(
            "/some-protected-endpoint",
            {},
            {
                headers: { Authorization: `Bearer ${result.accessToken}` },
            }
        );

        expect(nextResponse.data).toEqual({ success: true });
        expect(mockedAxiosInstance.post).toHaveBeenCalledWith(
            "/some-protected-endpoint",
            {},
            {
                headers: { Authorization: `Bearer newAccessToken` },
            }
        );
    });

    // Test case 6: Refreshed tokens are new
    it("ensures the refreshed token is new", async () => {
        const oldAccessToken = "oldAccessToken";
        const oldRefreshToken = "oldRefreshToken";

        const mockRefreshResponse = {
            data: { accessToken: "newAccessToken", refreshToken: "newRefreshToken" },
        };
        mockedAxiosInstance.post.mockResolvedValueOnce(mockRefreshResponse);

        const result = await SessionApi.refreshToken({ refreshToken: oldRefreshToken });

        // Ensure the new tokens are different from the old ones
        expect(result.accessToken).not.toBe(oldAccessToken);
        expect(result.refreshToken).not.toBe(oldRefreshToken);

        // Verify the API call
        expect(mockedAxiosInstance.post).toHaveBeenCalledWith("/auth/refresh-token", {
            refreshToken: oldRefreshToken,
        });

        // Ensure the new tokens match the mock response
        expect(result).toEqual(mockRefreshResponse.data);
    });
});
