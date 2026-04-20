import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useViewMode } from '@/hooks/use-view-mode';
import AppLayout from '@/layouts/app-layout';
import { capitalizeWords, formatPhone } from '@/lib/utils';
import { SharedData } from '@/types';
import { Jemaat } from '@/types/jemaat';
import { Link, router, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import { Archive, Edit, Filter, Folder, Grid2X2, TableIcon, Trash2 } from 'lucide-react';
import { FC, useState } from 'react';
import JemaatBulkDeleteDialog from './components/jemaat-bulk-delete-dialog';
import JemaatBulkEditSheet from './components/jemaat-bulk-edit-sheet';
import JemaatDeleteDialog from './components/jemaat-delete-dialog';
import JemaatFilterSheet from './components/jemaat-filter-sheet';
import JemaatFormSheet from './components/jemaat-form-sheet';
import JemaatItemCard from './components/jemaat-item-card';

type Props = {
  jemaats: Jemaat[];
  query: { [key: string]: string };
};

const JemaatList: FC<Props> = ({ jemaats, query }) => {
  const { mode, toggle } = useViewMode();
  const [ids, setIds] = useState<number[]>([]);
  const [cari, setCari] = useState('');

  const { permissions } = usePage<SharedData>().props;

  return (
    <AppLayout
      title="Data Warga Jemaat"
      description="Olah data jemaat gereja dengan mudah dan efisien menggunakan fitur manajemen jemaat kami yang lengkap."
      actions={[
        {
          title: capitalizeWords(mode) + ' view',
          icon: mode === 'grid' ? Grid2X2 : TableIcon,
          onClick: toggle,
        },
        {
          title: 'Archived',
          icon: Archive,
          onClick: () => router.visit(route('jemaat.archived')),
        },
      ]}
    >
      <div className="flex gap-2">
        <Input placeholder="Search Anggota Jemaat..." value={cari} onChange={(e) => setCari(e.target.value)} />
        <JemaatFilterSheet query={query}>
          <Button>
            <Filter />
            Filter data
            {Object.values(query).filter((val) => val && val !== '').length > 0 && (
              <Badge variant="secondary">{Object.values(query).filter((val) => val && val !== '').length}</Badge>
            )}
          </Button>
        </JemaatFilterSheet>
        {ids.length > 0 && (
          <>
            <Button variant={'ghost'} disabled>
              {ids.length} item selected
            </Button>
            <JemaatBulkEditSheet jemaatIds={ids} onSuccess={() => setIds([])}>
              <Button>
                <Edit /> Edit selected
              </Button>
            </JemaatBulkEditSheet>
            <JemaatBulkDeleteDialog jemaatIds={ids} onSuccess={() => setIds([])}>
              <Button variant={'destructive'}>
                <Trash2 /> Delete selected
              </Button>
            </JemaatBulkDeleteDialog>
          </>
        )}
        {permissions?.canAdd && <JemaatFormSheet purpose="create" buttonLabel="Tambah Jemaat" />}
      </div>
      {mode === 'table' ? (
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
              <TableHead>Staff Gereja</TableHead>
              <TableHead>Komunitas</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Tanggal Lahir</TableHead>
              <TableHead>No Hp</TableHead>
              <TableHead>Email</TableHead>
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
                  <TableCell>{jemaat.user?.name || '-'}</TableCell>
                  <TableCell>{jemaat.komunitas?.name || '-'}</TableCell>
                  <TableCell>{jemaat.name}</TableCell>
                  <TableCell>{dayjs(jemaat.tanggal_lahir).format('DD-MM-YYYY')}</TableCell>
                  <TableCell>{formatPhone(jemaat.no_hp) || '-'}</TableCell>
                  <TableCell>{jemaat.email}</TableCell>

                  <TableCell>
                    {permissions?.canShow && (
                      <Button variant={'ghost'} size={'icon'}>
                        <Link href={route('jemaat.show', jemaat.id)}>
                          <Folder />
                        </Link>
                      </Button>
                    )}
                    {permissions?.canUpdate && (
                      <>
                        <JemaatFormSheet purpose="edit" jemaat={jemaat} variant="icon" />
                      </>
                    )}
                    {permissions?.canDelete && (
                      <JemaatDeleteDialog jemaat={jemaat}>
                        <Button variant={'ghost'} size={'icon'}>
                          <Trash2 />
                        </Button>
                      </JemaatDeleteDialog>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      ) : (
        <div className="grid-responsive grid gap-4">
          {jemaats
            .filter((jemaat) => JSON.stringify(jemaat).toLowerCase().includes(cari.toLowerCase()))
            .map((jemaat) => (
              <JemaatItemCard key={jemaat.id} jemaat={jemaat} />
            ))}
        </div>
      )}
    </AppLayout>
  );
};

export default JemaatList;
