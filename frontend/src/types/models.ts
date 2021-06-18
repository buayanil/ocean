export interface DatabaseProperties {
    id: number,
    name: string;
    engine: string;
    created: string;
}

export interface CrendentialProperties {
    username: string;
    password: string;
}

export interface UserProperties {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    mail: string;
    employeeType: string;
}
