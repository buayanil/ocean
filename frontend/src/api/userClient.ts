import * as yup from "yup";

import { axiosInstance } from "./client";
import { CredentialProperties } from "../types/models";

export class UserClient {
  /**
   * Login with credentials
   */
  public static login = (credentials: CredentialProperties) =>
    axiosInstance.post<any>("/login", credentials);

  /**
   * Get user data
   */
  public static getUser = () => axiosInstance.get<any>("/user");
}

export class UserValidation {
  public static tokenSchema = yup.object().shape({
    token: yup.string().required(),
  });

  public static userSchema = yup.object().shape({
    id: yup.number().required(),
    username: yup.string().required(),
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    mail: yup.string().required(),
    employeeType: yup.string().required(),
  });

  public static loginSchema = yup.object().shape({
    username: yup.string()
    .required("Username is required")
    .matches(/^[a-z0-9]*$/, "Username must contain small letters or digits."),
    password: yup
      .string()
      .min(4, "Password should be of minimum 4 characters length")
      .required("Password is required"),
  });
}
