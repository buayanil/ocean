import { InvitationProperties, UpstreamCreateInvitationProperties } from "../types/invitation";
import { axiosInstance } from "./client";

export class InvitationClient {
  /**
   * Get all invitations for a database
   */
  public static getInvitationsForDatabase = async (databaseId: number): Promise<InvitationProperties[]> => {
    const {data} = await axiosInstance.get<InvitationProperties[]>(`databases/${databaseId.toString()}/invitations`);
    return data
  }

  /**
   * Creates a invitations for a database
   */
  public static createInvitationForDatabase = async (invitation: UpstreamCreateInvitationProperties): Promise<InvitationProperties> => {
    const { data } = await axiosInstance.post<InvitationProperties>("/invitations", invitation);
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
