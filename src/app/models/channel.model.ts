import {ChannelProperty} from "./channel-property.model";

export interface Channel {
  [ChannelProperty.id]?: string;
  [ChannelProperty.name]?: string;
}
