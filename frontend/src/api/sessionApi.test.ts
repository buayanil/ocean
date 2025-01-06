import { axiosInstance } from './client';
import { SessionApi } from './sessionApi';

jest.mock('./client', () => ({
    axiosInstance: {
        post: jest.fn(),
    },
}));
const mockedAxiosInstance = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe('SessionApi', () => {
    // Test case 1: Successful login
    it('sends a POST request to /auth/signin with credentials and returns tokens', async () => {
        const mockResponse = { data: { accessToken: 'access123', refreshToken: 'refresh123' } };
        mockedAxiosInstance.post.mockResolvedValueOnce(mockResponse);

        const result = await SessionApi.login({ username: 'testuser', password: 'password123' });

        expect(mockedAxiosInstance.post).toHaveBeenCalledWith('/auth/signin', {
            username: 'testuser',
            password: 'password123',
        });
        expect(result).toEqual(mockResponse.data);
    });

    // Test case 2: Failed login (e.g., invalid credentials)
    it('throws an error when login fails', async () => {
        mockedAxiosInstance.post.mockRejectedValueOnce(new Error('Invalid credentials'));

        await expect(
            SessionApi.login({ username: 'wronguser', password: 'wrongpassword' })
        ).rejects.toThrow('Invalid credentials');
    });

    // Test case 3: Successful token refresh
    it('refreshes tokens successfully and validates the response schema', async () => {
        const mockResponse = { data: { accessToken: 'access123', refreshToken: 'refresh123' } };
        mockedAxiosInstance.post.mockResolvedValueOnce(mockResponse);

        const result = await SessionApi.refreshToken({ refreshToken: 'refresh123' });

        expect(mockedAxiosInstance.post).toHaveBeenCalledWith('/auth/refresh-token', {
            refreshToken: 'refresh123',
        });
        expect(result).toEqual(mockResponse.data);
    });
});
