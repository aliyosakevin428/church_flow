import FormControl from '@/components/form-control';
import SubmitButton from '@/components/submit-button';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { capitalizeWords, em } from '@/lib/utils';
import { FormPurpose } from '@/types';
import { Article } from '@/types/article';
import { Community } from '@/types/community';
import { User } from '@/types/user';
import { useForm, usePage } from '@inertiajs/react';
import { Copy, Edit, LucideIcon, PlusSquare, X } from 'lucide-react';
import { ComponentProps, FC, PropsWithChildren } from 'react';
import { toast } from 'sonner';

interface ArticleForm {
  _method: string;
  komunitas_id: string;
  title: string;
  content: string;
}

type Props = PropsWithChildren & {
  article?: Article;
  icon?: LucideIcon;
  buttonLabel?: string;
  purpose: FormPurpose;
  variant?: 'default' | 'icon';
  onSuccess?: () => void;
  withChildren?: boolean;
};

const ArticleFormDialog: FC<ComponentProps<typeof Dialog> & Props> = ({
  children,
  article,
  purpose,
  variant = 'default',
  icon: Icon,
  buttonLabel,
  onSuccess,
  open,
  onOpenChange,
  withChildren = true,
}) => {
  const { Komunitas = [] } = usePage<{ Komunitas: Community[]; CreatedBy: User[] }>().props;

  const { data, setData, post, processing, reset, errors } = useForm<ArticleForm & { image?: File | null }>({
    _method: purpose === 'edit' ? 'PUT' : 'POST',
    komunitas_id: article?.komunitas_id?.toString() ?? '',
    title: article?.title ?? '',
    content: article?.content ?? '',
    image: null,
  });

  const handleSubmit = () => {
    const url = purpose === 'create' || purpose === 'duplicate' ? route('article.store') : route('article.update', article?.id);

    post(url, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success(`Article ${purpose === 'create' ? 'created' : 'updated'} successfully`);
        onOpenChange?.(false);
        if (purpose === 'create') reset();
        onSuccess?.();
      },
      onError: (e) => toast.error(em(e)),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {withChildren && (
        <>
          {children ? (
            <DialogTrigger asChild>{children}</DialogTrigger>
          ) : (
            <DialogTrigger asChild>
              <Button variant={variant == 'default' ? 'default' : 'ghost'} size={variant == 'default' ? 'default' : 'icon'}>
                {Icon ? <Icon /> : purpose == 'create' ? <PlusSquare /> : purpose == 'edit' ? <Edit /> : <Copy />}
                {variant == 'default' && buttonLabel}
              </Button>
            </DialogTrigger>
          )}
        </>
      )}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{capitalizeWords(purpose)} Data Article</DialogTitle>
          <DialogDescription>Isi form di bawah untuk {purpose} data artikel.</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <form
            className="space-y-6 py-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <FormControl label="Komunitas" error={errors.komunitas_id}>
              <Select value={data.komunitas_id} onValueChange={(value) => setData('komunitas_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Komunitas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">- Tidak Ada Komunitas -</SelectItem>
                  {Komunitas.map((komunitas) => (
                    <SelectItem key={komunitas.id} value={komunitas.id.toString()}>
                      {komunitas.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>

            <FormControl label="Title" error={errors.title}>
              <Input type="text" placeholder="Enter Title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
            </FormControl>

            <FormControl label="Content" error={errors.content}>
              <Textarea
                placeholder="Enter Content"
                className="min-h-[200px]"
                value={data.content}
                onChange={(e) => setData('content', e.target.value)}
              />
            </FormControl>

            {/* <FormControl label="Gambar Artikel" error={errors.image}>
              <Input type="file" accept="image/*" onChange={(e) => setData('image', e.target.files ? e.target.files[0] : null)} />
              {article?.image_url && !data.image && (
                <p className="mt-1 text-xs text-muted-foreground italic">* Biarkan kosong jika tidak ingin mengubah gambar sampul.</p>
              )}
            </FormControl> */}
          </form>
        </ScrollArea>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'outline'}>
              <X className="mr-2 h-4 w-4" /> Batal
            </Button>
          </DialogClose>
          <SubmitButton onClick={handleSubmit} label={`${capitalizeWords(purpose)} Article`} loading={processing} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleFormDialog;
