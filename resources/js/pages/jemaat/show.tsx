import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Jemaat } from '@/types/jemaat';
import { Edit } from 'lucide-react';
import { FC, useState } from 'react';
import { SharedData } from '@/types';
import { Link, usePage, router} from '@inertiajs/react';
import { backAction } from '@/lib/utils';
import JemaatItemCard from './components/jemaat-item-card';
import JemaatFormSheet from './components/jemaat-form-sheet';

type Props = {
  jemaat: Jemaat;
};

const ShowJemaat: FC<Props> = ({ jemaat }) => {
  // const { permissions } = usePage<SharedData>().props;
  const [openEditSheet, setOpenEditSheet] = useState(false);

  return (
    <AppLayout
      title="Detail Jemaat"
      description="Detail jemaat"
      actions={[
        backAction(),
        {
          title: 'Edit jemaat',
          onClick: () => setOpenEditSheet(true),
          icon: Edit,
        },
      ]}
    >
      <JemaatFormSheet
        open={openEditSheet}
        onOpenChange={setOpenEditSheet}
        purpose="edit"
        jemaat={jemaat}
        onSuccess={() => setOpenEditSheet(false)}
        withChildren={false}
      />
      <JemaatItemCard jemaat={jemaat} />
    </AppLayout>
  );
};

export default ShowJemaat;
