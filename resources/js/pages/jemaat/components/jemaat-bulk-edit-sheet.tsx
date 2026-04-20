import { Button } from '@/components/ui/button';
import SubmitButton from '@/components/submit-button';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { em } from '@/lib/utils';
import { Jemaat } from '@/types/jemaat';
import { useForm } from '@inertiajs/react';
import { Check, X } from 'lucide-react';
import { FC, PropsWithChildren, useEffect } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren & {
  jemaatIds: Jemaat['id'][];
  onSuccess?: () => void;
};

const JemaatBulkEditSheet: FC<Props> = ({ children, jemaatIds, onSuccess }) => {
  const { data, setData, put, processing } = useForm({
    jemaat_ids: jemaatIds,
  });

  useEffect(() => {
    setData('jemaat_ids', jemaatIds);
  }, [jemaatIds, setData]);

  const handleSubmit = () => {
    put(route('jemaat.bulk.update'), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Jemaat updated successfully');
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
          <SheetTitle>Ubah jemaat</SheetTitle>
          <SheetDescription>Ubah data {data.jemaat_ids.length} jemaat</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SubmitButton icon={Check} onClick={handleSubmit} label={`Simpan jemaat`} loading={processing} disabled={processing} />
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

export default JemaatBulkEditSheet;
