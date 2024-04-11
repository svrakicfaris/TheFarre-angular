import {UserProperty} from "./user-property.enum";
import {UserChannelLastMessageSeen} from "./user_channel_last_message_seen.model";

export interface User {
  [UserProperty.id]?: string;
  [UserProperty._id]?: string;
  [UserProperty.email]: string;
  [UserProperty.password]: string;
  [UserProperty.username]: string;
  [UserProperty.firstName]: string;
  [UserProperty.lastName]: string;
  [UserProperty.gender]: string;
  [UserProperty.imageURL]: string;
  [UserProperty.isAdmin]: Boolean;
  [UserProperty.newsletter]: Boolean;
  [UserProperty.userChannelLastMessageSeen]: UserChannelLastMessageSeen[];
  [UserProperty.completedCourseIds]: string[]; // Array of course IDs
  [UserProperty.completedModuleIds]: string[]; // Array of module IDs
  [UserProperty.completedLectureIds]: string[]; // Array of lecture IDs
}


