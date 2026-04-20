import { Komunitas } from './komunitas';
import { User } from './user';

export type Jemaat = {
  id: number;
  user_id: User['id'];
  user: User;
  komunitas_id: Komunitas['id'];
  komunitas: Komunitas;
  name: string;
  tanggal_lahir: Date | undefined;
  no_hp: string;
  email: string | null;
  created_at: string;
  updated_at: string;
};
