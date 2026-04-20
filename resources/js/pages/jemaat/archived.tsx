import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { backAction, em } from '@/lib/utils';
import { Jemaat } from '@/types/jemaat';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Trash2, Undo2 } from 'lucide-react';
import { FC, useState } from 'react';
import { toast } from 'sonner';

type Props = {
  jemaats: Jemaat[];
};

const ArchivedJemaatList: FC<Props> = ({ jemaats }) => {
  const [ids, setIds] = useState<number[]>([]);
  const [cari, setCari] = useState('');

  const handleRestore = (id: Jemaat['id']) => {
    router.put(
      route('jemaat.restore', id),
      {},
      {
        preserveScroll: true,
        onSuccess: () => toast.success('Data berhasil di restore!'),
        onError: (e) => toast.error(em(e)),
      },
    );
  };

  const handleForceDelete = (id: Jemaat['id']) => {
    router.delete(route('jemaat.force-delete', id), {
      preserveScroll: true,
      onSuccess: () => toast.success('Data berhasil di hapus permanen!'),
      onError: (e) => toast.error(em(e)),
    });
  };

  return (
    <AppLayout
      title="Jemaats"
      description="Manage your jemaats"
      actions={[backAction()]}
    >
      <div className="flex gap-2">
        <Input placeholder="Search jemaats..." value={cari} onChange={(e) => setCari(e.target.value)} />
        {ids.length > 0 && (
          <>
            <Button variant={'ghost'} disabled>
              {ids.length} item selected
            </Button>
          </>
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button variant={'ghost'} size={'icon'} asChild>
                <Label>
                  <Checkbox
                    checked={ids.length === jemaats.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setIds(jemaats.map((jemaat) => jemaat.id));
                      } else {
                        setIds([]);
                      }
                    }}
                  />
                </Label>
              </Button>
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jemaats
            .filter((jemaat) => JSON.stringify(jemaat).toLowerCase().includes(cari.toLowerCase()))
            .map((jemaat) => (
              <TableRow key={jemaat.id}>
                <TableCell>
                  <Button variant={'ghost'} size={'icon'} asChild>
                    <Label>
                      <Checkbox
                        checked={ids.includes(jemaat.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setIds([...ids, jemaat.id]);
                          } else {
                            setIds(ids.filter((id) => id !== jemaat.id));
                          }
                        }}
                      />
                    </Label>
                  </Button>
                </TableCell>
                <TableCell>{jemaat.name}</TableCell>
                <TableCell>
                  <Button variant={'ghost'} size={'icon'} onClick={() => handleRestore(jemaat.id)}>
                    <Undo2 />
                  </Button>
                  <Button variant={'ghost'} size={'icon'} onClick={() => handleForceDelete(jemaat.id)}>
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </AppLayout>
  );
};

export default ArchivedJemaatList;