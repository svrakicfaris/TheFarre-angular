import {User} from "./user.model";

export interface Message {
  _id: string
  userId: string
  text: string;
  date: string;
  time: string;
  channelId: string;
  user: User;
}
