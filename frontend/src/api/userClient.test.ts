import { UserClient } from "./userClient";
import { axiosInstance } from "./client";
import { AxiosResponse } from "axios";

jest.mock("./client", () => ({
    axiosInstance: {
        get: jest.fn(),
    },
}));

describe("UserClient", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should fetch user data", async () => {
        const mockUser = { id: 1, username: "testuser", email: "test@example.com" };
        (axiosInstance.get as jest.Mock).mockResolvedValueOnce({ data: mockUser } as AxiosResponse);

        const user = await UserClient.getUser();
        expect(user).toEqual(mockUser);
        expect(axiosInstance.get).toHaveBeenCalledWith("/user");
    });

    it("should fetch a list of users", async () => {
        const mockUsers = [
            { id: 1, username: "user1", email: "user1@example.com" },
            { id: 2, username: "user2", email: "user2@example.com" },
        ];
        (axiosInstance.get as jest.Mock).mockResolvedValueOnce({ data: mockUsers } as AxiosResponse);

        const users = await UserClient.getUsers();
        expect(users).toEqual(mockUsers);
        expect(axiosInstance.get).toHaveBeenCalledWith("/users");
    });

    it("should handle errors when fetching user data", async () => {
        (axiosInstance.get as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

        await expect(UserClient.getUser()).rejects.toThrow("Network Error");
        expect(axiosInstance.get).toHaveBeenCalledWith("/user");
    });
});
