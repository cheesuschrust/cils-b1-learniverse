
import { ContentType } from './contentType';

export interface TrainingExample {
  id: string;
  contentType: ContentType;
  text: string;
  metadata: any;
}
