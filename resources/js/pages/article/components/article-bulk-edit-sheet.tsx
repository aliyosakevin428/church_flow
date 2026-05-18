import { Button } from '@/components/ui/button';
import SubmitButton from '@/components/submit-button';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { em } from '@/lib/utils';
import { Article } from '@/types/article';
import { useForm } from '@inertiajs/react';
import { Check, X } from 'lucide-react';
import { FC, PropsWithChildren, useEffect } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren & {
  articleIds: Article['id'][];
  onSuccess?: () => void;
};

const ArticleBulkEditSheet: FC<Props> = ({ children, articleIds, onSuccess }) => {
  const { data, setData, put, processing } = useForm({
    article_ids: articleIds,
  });

  useEffect(() => {
    setData('article_ids', articleIds);
  }, [articleIds, setData]);

  const handleSubmit = () => {
    put(route('article.bulk.update'), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Article updated successfully');
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
          <SheetTitle>Ubah article</SheetTitle>
          <SheetDescription>Ubah data {data.article_ids.length} article</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SubmitButton icon={Check} onClick={handleSubmit} label={`Simpan article`} loading={processing} disabled={processing} />
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

export default ArticleBulkEditSheet;
