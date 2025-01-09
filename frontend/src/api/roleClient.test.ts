import { RoleClient } from "./roleClient";
import MockAdapter from "axios-mock-adapter";
import { axiosInstance } from "./client";

const mockAxios = new MockAdapter(axiosInstance);

describe("RoleClient Tests", () => {
    afterEach(() => {
        mockAxios.reset();
    });

    it("should fetch roles for a database", async () => {
        const databaseId = 1;
        const mockRoles = [{ id: 1, name: "Admin" }];
        mockAxios.onGet(`databases/${databaseId}/roles`).reply(200, mockRoles);

        const roles = await RoleClient.getRolesForDatabase(databaseId);

        expect(roles).toEqual(mockRoles);
        expect(mockAxios.history.get[0].url).toBe(`databases/${databaseId}/roles`);
    });

    it("should create a role for a database", async () => {
        const newRole = {
            roleName: "Editor", // Updated property name to `roleName`
            permissions: ["read", "write"],
            instanceId: 1
        };
        const createdRole = { id: 2, ...newRole };
        mockAxios.onPost("/roles").reply(201, createdRole);

        const result = await RoleClient.createRoleForDatabase(newRole);

        expect(result).toEqual(createdRole);
        expect(mockAxios.history.post[0].url).toBe("/roles");
        expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(newRole);
    });

    it("should check the availability of a role for a database", async () => {
        const mockRole = {
            roleName: "Viewer",
            permissions: ["read"],
            instanceId: 1
        };
        const mockResponse = { available: true }; // Mocked API response

        // Mock the endpoint
        mockAxios.onPost("/roles/_availability_").reply(200, mockResponse);

        // Call the method
        const response = await RoleClient.availabilityRoleForDatabase(mockRole);

        // Assertions
        expect(response.status).toBe(200); // Axios response status
        expect(response.data).toEqual(mockResponse); // Mocked response data
        expect(mockAxios.history.post[0].url).toBe("/roles/_availability_"); // Endpoint
        expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(mockRole); // Payload
    });

    it("should delete a role by ID and return the response data", async () => {
        const roleId = 3; // ID of the role to delete
        const mockResponse = { success: true }; // Mocked response data

        // Mock the DELETE request
        mockAxios.onDelete(`/roles/${roleId}`).reply(200, mockResponse);

        // Call the method
        const response = await RoleClient.deleteRoleForDatabase(roleId);

        // Assertions
        expect(response).toEqual(mockResponse); // Response data matches the mock
        expect(mockAxios.history.delete[0].url).toBe(`/roles/${roleId}`); // Correct URL is called
    });

    it("should throw an error when the server returns an error", async () => {
        const roleId = 3;

        // Mock the DELETE request to return an error
        mockAxios.onDelete(`/roles/${roleId}`).reply(500);

        // Call the method and expect it to throw
        await expect(RoleClient.deleteRoleForDatabase(roleId)).rejects.toThrow("Request failed with status code 500");
    });
});
