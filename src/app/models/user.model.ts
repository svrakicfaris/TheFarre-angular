import {UserProperty} from "./user-property.enum";

export interface User {
  [UserProperty.id]?: string;
  [UserProperty.email]: string;
  [UserProperty.password]: string;
  [UserProperty.firstName]: string;
  [UserProperty.lastName]: string;
  [UserProperty.username]: string;
  [UserProperty.birthday]: Date;
  [UserProperty.city]: string;
  [UserProperty.country]: string;
  [UserProperty.admin]: boolean;
}


