import reducer, {
    loginStart,
    loginSuccess,
    loginFailed,
    restoreSession,
    logout,
} from "./sessionSlice";
import { CredentialProperties } from "../../../types/models";

describe("sessionSlice", () => {
    const initialState = {
        isLoggedIn: undefined,
        loading: false,
        error: undefined,
    };

    it("should return the initial state", () => {
        expect(reducer(undefined, { type: undefined })).toEqual(initialState);
    });

    describe("Reducers", () => {
        it("should handle loginStart action", () => {
            const credentials: CredentialProperties = {
                username: "testUser",
                password: "testPass",
            };

            const nextState = reducer(initialState, loginStart(credentials));

            expect(nextState).toEqual({
                isLoggedIn: undefined,
                loading: true,
                error: undefined,
            });
        });

        it("should handle loginSuccess action", () => {
            const nextState = reducer(initialState, loginSuccess());

            expect(nextState).toEqual({
                isLoggedIn: true,
                loading: false,
                error: undefined,
            });
        });

        it("should handle loginFailed action", () => {
            const errorMessage = "Invalid credentials";

            const nextState = reducer(initialState, loginFailed(errorMessage));

            expect(nextState).toEqual({
                isLoggedIn: undefined,
                loading: false,
                error: "Invalid credentials",
            });
        });

        it("should handle restoreSession action", () => {
            const modifiedState = {
                isLoggedIn: true,
                loading: false,
                error: undefined,
            };

            const nextState = reducer(modifiedState, restoreSession());

            expect(nextState).toEqual({
                isLoggedIn: undefined,
                loading: false,
                error: undefined,
            });
        });

        it("should handle logout action", () => {
            const modifiedState = {
                isLoggedIn: true,
                loading: false,
                error: undefined,
            };

            const nextState = reducer(modifiedState, logout());

            expect(nextState).toEqual({
                isLoggedIn: false,
                loading: false,
                error: undefined,
            });
        });
    });

    describe("Actions", () => {
        it("should create loginStart action", () => {
            const credentials: CredentialProperties = {
                username: "testUser",
                password: "testPass",
            };

            const action = loginStart(credentials);

            expect(action).toEqual({
                type: "sessionSlice/loginStart",
                payload: credentials,
            });
        });

        it("should create loginFailed action", () => {
            const errorMessage = "Invalid credentials";

            const action = loginFailed(errorMessage);

            expect(action).toEqual({
                type: "sessionSlice/loginFailed",
                payload: errorMessage,
            });
        });
    });
});
