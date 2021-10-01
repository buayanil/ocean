import { InvitationProperties } from "./invitation";

export interface UserProperties {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  mail: string;
  employeeType: string;
}

export type InvitedUserProperties = Pick<
  UserProperties,
  "username" | "firstName" | "lastName"
> &
  Pick<InvitationProperties, "id" | "createdAt">;

export class User {
  public static getDisplayName = (user: UserProperties): string => {
    const abbreviation = user.firstName[0] || "?";
    return `${abbreviation}. ${user.lastName}`;
  };

  public static getInvitedUsers = (
    users: UserProperties[],
    invitations: InvitationProperties[]
  ): InvitedUserProperties[] => {
    const result: InvitedUserProperties[] = [];
    for (const invitation of invitations) {
      const user = users.find((_) => _.id === invitation.userId);
      if (user) {
        const invitedUser: InvitedUserProperties = {
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          id: invitation.id,
          createdAt: invitation.createdAt,
        };
        result.push(invitedUser)
      }
    }
    return result;
  };
}
