import { Button } from '@/components/ui/button';
import SubmitButton from '@/components/submit-button';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { em } from '@/lib/utils';
import { Community } from '@/types/community';
import { useForm } from '@inertiajs/react';
import { Check, X } from 'lucide-react';
import { FC, PropsWithChildren, useEffect } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren & {
  communityIds: Community['id'][];
  onSuccess?: () => void;
};

const CommunityBulkEditSheet: FC<Props> = ({ children, communityIds, onSuccess }) => {
  const { data, setData, put, processing } = useForm({
    community_ids: communityIds,
  });

  useEffect(() => {
    setData('community_ids', communityIds);
  }, [communityIds, setData]);

  const handleSubmit = () => {
    put(route('community.bulk.update'), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Community updated successfully');
        onSuccess?.();
      },
      onError: (e) => toast.error(em(e)),
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Ubah community</SheetTitle>
          <SheetDescription>Ubah data {data.community_ids.length} community</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SubmitButton icon={Check} onClick={handleSubmit} label={`Simpan community`} loading={processing} disabled={processing} />
          <SheetClose asChild>
            <Button variant={'outline'}>
              <X /> Batalin
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CommunityBulkEditSheet;
