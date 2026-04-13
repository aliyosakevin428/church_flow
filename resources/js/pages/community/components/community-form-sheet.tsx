import FormControl from '@/components/form-control';
import SubmitButton from '@/components/submit-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { capitalizeWords, em } from '@/lib/utils';
import { FormPurpose } from '@/types';
import { Community } from '@/types/community';
import { useForm } from '@inertiajs/react';
import { Copy, Edit, LucideIcon, PlusSquare, X } from 'lucide-react';
import { ComponentProps, FC, PropsWithChildren } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren & {
  community?: Community;
  icon?: LucideIcon;
  buttonLabel?: string;
  purpose: FormPurpose;
  variant?: 'default' | 'icon';
  onSuccess?: () => void;
  withChildren?: boolean;
};

const CommunityFormSheet: FC<ComponentProps<typeof Sheet> & Props> = ({
  children,
  community,
  purpose,
  variant = 'default',
  icon: Icon,
  buttonLabel,
  onSuccess,
  open,
  onOpenChange,
  withChildren = true,
}) => {
  // const { items = [] } = usePage<{ items: Item[] }>().props;

  const { data, setData, put, post, processing } = useForm({
    name: community?.name ?? '',
    description: community?.description ?? '',
  });

  const handleSubmit = () => {
    if (purpose === 'create' || purpose === 'duplicate') {
      post(route('community.store'), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Community created successfully');
          onOpenChange?.(false);
          onSuccess?.();
        },
        onError: (e) => toast.error(em(e)),
      });
    } else {
      put(route('community.update', community?.id), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Community updated successfully');
          onSuccess?.();
        },
        onError: (e) => toast.error(em(e)),
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {withChildren && (
        <>
          {children ? (
            <SheetTrigger asChild>{children}</SheetTrigger>
          ) : (
            <SheetTrigger asChild>
              <Button variant={variant == 'default' ? 'default' : 'ghost'} size={variant == 'default' ? 'default' : 'icon'}>
                {Icon ? <Icon /> : purpose == 'create' ? <PlusSquare /> : purpose == 'edit' ? <Edit /> : <Copy />}
                {variant == 'default' && buttonLabel}
              </Button>
            </SheetTrigger>
          )}
        </>
      )}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{capitalizeWords(purpose)} data community</SheetTitle>
          <SheetDescription>Form untuk {purpose} data community</SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1 overflow-y-auto">
          <form
            className="space-y-6 px-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <FormControl label="Name">
              <Input type="text" placeholder="Enter Name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
            </FormControl>
            <FormControl label="Description">
              <Textarea
                placeholder="Enter Description"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                className="min-h-[100px]"
              />
            </FormControl>
          </form>
        </ScrollArea>
        <SheetFooter>
          <SubmitButton onClick={handleSubmit} label={`${capitalizeWords(purpose)} community`} loading={processing} disabled={processing} />
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

export default CommunityFormSheet;
