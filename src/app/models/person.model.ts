import {PersonProperty} from "./person-property.enum";

export interface Person {
  [PersonProperty.id]?: string;
  [PersonProperty.email]: string;
  [PersonProperty.firstName]: string;
  [PersonProperty.lastName]: string;
  [PersonProperty.birthday]: Date;
  [PersonProperty.city]: string;
  [PersonProperty.country]: string;
  [PersonProperty.phone]: string;
  [PersonProperty.user_id]: string;
  [PersonProperty.audio_file]: string;
}


