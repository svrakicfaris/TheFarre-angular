import {EmailProperty} from "./email-property.model";

export interface Email {
  [EmailProperty.id]?: string;
  [EmailProperty.subject]?: string;
  [EmailProperty.text]?: string;
  [EmailProperty.scheduleDate]?: string;
  [EmailProperty.scheduleTime]?: string;
}
