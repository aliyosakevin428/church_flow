import { Media } from '.';
import { Community } from './community';
import { User } from './user';

export type Article = {
  id: number;
  title: string;
  slug: string;
  content: string;
  komunitas_id: number;
  created_by: number;
  komunitas?: Community;
  user?: User;
  media: Media[];
  image_url: string;
  created_at: string;
  updated_at: string;
};
