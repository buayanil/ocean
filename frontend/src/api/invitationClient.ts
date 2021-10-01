import * as yup from "yup";

import { InvitationProperties, UpstreamCreateInvitationProperties } from "../types/invitation";
import { axiosInstance } from "./client";

export class InvitationClient {
  /**
   * Get all invitations for a database
   */
  public static getInvitationsForDatabase = async (databaseId: number): Promise<InvitationProperties[]> => {
    const {data} = await axiosInstance.get<any>(`databases/${databaseId.toString()}/invitations`);
    return data
  }

  /**
   * Creates a invitations for a database
   */
  public static createInvitationForDatabase = async (invitation: UpstreamCreateInvitationProperties) => {
    const {data} = await axiosInstance.post<any>("/invitations", invitation);
    return data
  }

  /**
   * Deletes a invitation by id
   */
  public static deleteInvitationForDatabase = async (id: number) => {
    const { data } = await axiosInstance.delete<any>(`/invitations/${id.toString()}`);
    return data;
  }
}

export class InvitationValidation {
  public static getInvitationsForDatabaseSchema = yup
    .array()
    .required()
    .of(
      yup.object().shape({
        id: yup.number().required(),
        instanceId: yup.number().required(),
        userId: yup.number().required(),
        createdAt: yup
          .date()
          .required()
          .transform(function (_castValue, originalValue) {
            return Number.isNaN(originalValue)
              ? new Date()
              : new Date(originalValue);
          }),
      })
    );

  public static createInvitationForDatabaseSchema = yup.object().shape({
    id: yup.number().required(),
    instanceId: yup.number().required(),
    userId: yup.number().required(),
  });
  
  public static deleteInvitationSchema = yup.object().shape({
    rows: yup.number().required(),
  });
}
