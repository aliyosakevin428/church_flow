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
import { em } from '@/lib/utils';
import { Article } from '@/types/article';
import { Link, useForm } from '@inertiajs/react';
import { ImageIcon, Trash2, X } from 'lucide-react';
import { FC, PropsWithChildren, useState } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren & {
  article: Article;
};

const ArticleUploadMediaDialog: FC<Props> = ({ article, children }) => {
  const [open, setOpen] = useState(false);

  const { data, setData, post, processing, reset } = useForm({
    file: undefined as File | undefined,
    collection_name: 'default',
  });

  const handleUploadMedia = () => {
    if (!data.file) {
      toast.error('Silahkan pilih file terlebih dahulu');
      return;
    }

    post(route('article.upload-media', article.id), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Media uploaded successfully');
        reset('file');
        // setOpen(false); // Opsional: tutup atau biarkan terbuka jika ingin upload banyak
      },
      onError: (e) => toast.error(em(e)),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Media</DialogTitle>
          <DialogDescription>
            Upload media untuk artikel: <span className="font-medium text-foreground">{article.title}</span>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <form
            className="space-y-6 py-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleUploadMedia();
            }}
          >
            <FormControl label="Pilih file">
              <Input type="file" onChange={(e) => setData('file', e.target.files?.[0])} accept="image/*" className="cursor-pointer" />

              {/* Image Preview */}
              {data.file && (
                <div className="relative mt-4 inline-block overflow-hidden rounded-lg border bg-muted">
                  <img src={URL.createObjectURL(data.file)} className="max-h-[200px] w-auto object-contain" alt="Preview" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6"
                    onClick={() => setData('file', undefined)}
                  >
                    <X size={14} />
                  </Button>
                </div>
              )}
            </FormControl>

            <div className="space-y-3">
              <h4 className="text-sm font-medium">Media Terpasang</h4>
              {article.media && article.media.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {article.media.map((media) => (
                    <div className="group relative aspect-square overflow-hidden rounded-md border bg-muted" key={media.id}>
                      <img
                        src={media.preview_url}
                        alt={media.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button type="button" size="icon" variant="destructive" className="h-8 w-8" asChild>
                          <Link href={route('doc.destroy', media.id)} method="delete" preserveScroll onSuccess={() => toast.success('Media deleted')}>
                            <Trash2 size={16} />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-muted-foreground">
                  <ImageIcon className="mb-2 h-8 w-8 opacity-20" />
                  <p className="text-xs italic">Belum ada media</p>
                </div>
              )}
            </div>
          </form>
        </ScrollArea>

        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button variant="outline">Batal</Button>
          </DialogClose>
          <SubmitButton onClick={handleUploadMedia} label="Upload media" loading={processing} disabled={!data.file || processing} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleUploadMediaDialog;
