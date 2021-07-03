import * as yup from 'yup';

import { axiosInstance } from "./client";
import { UpstreamDatabaseProperties } from "../types/models";

export const getDatabases = () => axiosInstance.get<any>('/databases')

export const createDatabase = (database: UpstreamDatabaseProperties) => axiosInstance.post('/databases', database)

export const existsDatabse = (database: UpstreamDatabaseProperties) => axiosInstance.post('/databases/_exists_', database)

export const databasesSchema = yup.array().required().of(
    yup.object().shape({
        id: yup.number().required(),
        name: yup.string().required(),
        engine: yup.string().required(),
        createdAt: yup.string().required(),
    })
)
