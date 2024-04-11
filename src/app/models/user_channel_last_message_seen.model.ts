import {
  UserChannelLastMessageSeenProperty
} from "./user_channel_last_message_seen-property.enum";

export interface UserChannelLastMessageSeen {
  [UserChannelLastMessageSeenProperty._id]?: string;
  [UserChannelLastMessageSeenProperty.channelId]: string;
  [UserChannelLastMessageSeenProperty.userId]: string;
  [UserChannelLastMessageSeenProperty.messageId]: string;
}


