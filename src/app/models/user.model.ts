import {UserProperty} from "./user-property.enum";

export interface User {
  [UserProperty.id]?: string;
  [UserProperty.email]: string;
  [UserProperty.firstName]: string;
  [UserProperty.lastName]: string;
  [UserProperty.birthday]: Date;
  [UserProperty.city]: string;
  [UserProperty.country]: string;
  [UserProperty.phone]: string;
  [UserProperty.user_id]: string;
  [UserProperty.audio_file]: string;
}


