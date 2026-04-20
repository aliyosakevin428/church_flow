import FormControl from '@/components/form-control';
import SubmitButton from '@/components/submit-button';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { capitalizeWords, dateDFY, em } from '@/lib/utils';
import { FormPurpose } from '@/types';
import { Community } from '@/types/community';
import { Jemaat } from '@/types/jemaat';
import { useForm, usePage } from '@inertiajs/react';
import { CalendarIcon, Edit, LucideIcon, PlusSquare, X } from 'lucide-react';
import { ComponentProps, FC, PropsWithChildren } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren & {
  jemaat?: Jemaat;
  icon?: LucideIcon;
  buttonLabel?: string;
  purpose: FormPurpose;
  variant?: 'default' | 'icon';
  onSuccess?: () => void;
  withChildren?: boolean;
};

const JemaatFormSheet: FC<ComponentProps<typeof Sheet> & Props> = ({
  children,
  jemaat,
  purpose,
  variant = 'default',
  icon: Icon,
  buttonLabel,
  onSuccess,
  open,
  onOpenChange,
  withChildren = true,
}) => {
  const { communities = [] } = usePage<{ communities: Community[] }>().props;

  const { data, setData, put, post, processing } = useForm({
    komunitas_id: jemaat?.komunitas_id ?? null,
    name: jemaat?.name ?? '',
    tanggal_lahir: jemaat?.tanggal_lahir ? new Date(jemaat.tanggal_lahir) : undefined,
    no_hp: jemaat?.no_hp ?? '',
    email: jemaat?.email ?? '',
  });

  const handleSubmit = () => {
    if (purpose === 'create' || purpose === 'duplicate') {
      post(route('jemaat.store'), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Jemaat created successfully');
          onOpenChange?.(false);
          onSuccess?.();
        },
        onError: (e) => toast.error(em(e)),
      });
    } else {
      put(route('jemaat.update', jemaat?.id), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Jemaat updated successfully');
          onOpenChange?.(false);
          onSuccess?.();
        },
        onError: (e) => toast.error(em(e)),
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {withChildren && (
        <SheetTrigger asChild>
          {children ?? (
            <Button variant={variant === 'default' ? 'default' : 'ghost'}>
              {Icon ? <Icon /> : purpose === 'create' ? <PlusSquare /> : <Edit />}
              {variant === 'default' && buttonLabel}
            </Button>
          )}
        </SheetTrigger>
      )}

      <SheetContent>
        <SheetHeader>
          <SheetTitle>{capitalizeWords(purpose)} data jemaat</SheetTitle>
          <SheetDescription>Form untuk {purpose} data jemaat</SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <form
            className="space-y-4 px-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <FormControl label="Komunitas">
              <Select
                value={data.komunitas_id !== null ? String(data.komunitas_id) : 'null'}
                onValueChange={(value) => setData('komunitas_id', value === 'null' ? null : Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="(Tidak pilih komunitas)" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="null">-- Tanpa Komunitas --</SelectItem>

                  {communities.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>

            <FormControl label="Nama">
              <Input type="text" placeholder="Nama Jemaat" value={data.name} onChange={(e) => setData('name', e.target.value)} />
            </FormControl>

            <FormControl label="Tanggal Lahir">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    {data.tanggal_lahir ? dateDFY(data.tanggal_lahir) : <span>Pilih tanggal</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    captionLayout="dropdown"
                    selected={data.tanggal_lahir}
                    onSelect={(date) => setData('tanggal_lahir', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormControl>

            <FormControl label="No HP">
              <Input type="text" placeholder="08xxxx" value={data.no_hp} onChange={(e) => setData('no_hp', e.target.value)} />
            </FormControl>

            <FormControl label="Email">
              <Input type="email" placeholder="email@gmail.com" value={data.email} onChange={(e) => setData('email', e.target.value || '')} />
            </FormControl>
          </form>
        </ScrollArea>

        <SheetFooter>
          <SubmitButton onClick={handleSubmit} label={`${capitalizeWords(purpose)} jemaat`} loading={processing} />

          <SheetClose asChild>
            <Button variant="outline">
              <X /> Batal
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default JemaatFormSheet;
