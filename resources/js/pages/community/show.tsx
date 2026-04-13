import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Community } from '@/types/community';
import { Edit } from 'lucide-react';
import { FC, useState } from 'react';
import { SharedData } from '@/types';
import { Link, usePage, router} from '@inertiajs/react';
import { backAction } from '@/lib/utils';
import CommunityItemCard from './components/community-item-card';
import CommunityFormSheet from './components/community-form-sheet';

type Props = {
  community: Community;
};

const ShowCommunity: FC<Props> = ({ community }) => {
  // const { permissions } = usePage<SharedData>().props;
  const [openEditSheet, setOpenEditSheet] = useState(false);

  return (
    <AppLayout
      title="Detail Community"
      description="Detail community"
      actions={[
        backAction(),
        {
          title: 'Edit community',
          onClick: () => setOpenEditSheet(true),
          icon: Edit,
        },
      ]}
    >
      <CommunityFormSheet
        open={openEditSheet}
        onOpenChange={setOpenEditSheet}
        purpose="edit"
        community={community}
        onSuccess={() => setOpenEditSheet(false)}
        withChildren={false}
      />
      <CommunityItemCard community={community} />
    </AppLayout>
  );
};

export default ShowCommunity;
