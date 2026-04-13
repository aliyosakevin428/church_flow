import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useViewMode } from '@/hooks/use-view-mode';
import AppLayout from '@/layouts/app-layout';
import { capitalizeWords, strLimit } from '@/lib/utils';
import { SharedData } from '@/types';
import { Community } from '@/types/community';
import { Link, router, usePage } from '@inertiajs/react';
import { Archive, Edit, Filter, Folder, Grid2X2, TableIcon, Trash2 } from 'lucide-react';
import { FC, useState } from 'react';
import CommunityBulkDeleteDialog from './components/community-bulk-delete-dialog';
import CommunityBulkEditSheet from './components/community-bulk-edit-sheet';
import CommunityDeleteDialog from './components/community-delete-dialog';
import CommunityFilterSheet from './components/community-filter-sheet';
import CommunityFormSheet from './components/community-form-sheet';
import CommunityItemCard from './components/community-item-card';

type Props = {
  communities: Community[];
  query: { [key: string]: string };
};

const CommunityList: FC<Props> = ({ communities, query }) => {
  const { mode, toggle } = useViewMode();
  const [ids, setIds] = useState<number[]>([]);
  const [cari, setCari] = useState('');

  const { permissions } = usePage<SharedData>().props;

  return (
    <AppLayout
      title="Communitys"
      description="Manage your communities"
      actions={[
        {
          title: capitalizeWords(mode) + ' view',
          icon: mode === 'grid' ? Grid2X2 : TableIcon,
          onClick: toggle,
        },
        {
          title: 'Archived',
          icon: Archive,
          onClick: () => router.visit(route('community.archived')),
        },
      ]}
    >
      <div className="flex gap-2">
        <Input placeholder="Search communities..." value={cari} onChange={(e) => setCari(e.target.value)} />
        <CommunityFilterSheet query={query}>
          <Button>
            <Filter />
            Filter data
            {Object.values(query).filter((val) => val && val !== '').length > 0 && (
              <Badge variant="secondary">{Object.values(query).filter((val) => val && val !== '').length}</Badge>
            )}
          </Button>
        </CommunityFilterSheet>
        {ids.length > 0 && (
          <>
            <Button variant={'ghost'} disabled>
              {ids.length} item selected
            </Button>
            <CommunityBulkEditSheet communityIds={ids} onSuccess={() => setIds([])}>
              <Button>
                <Edit /> Edit selected
              </Button>
            </CommunityBulkEditSheet>
            <CommunityBulkDeleteDialog communityIds={ids} onSuccess={() => setIds([])}>
              <Button variant={'destructive'}>
                <Trash2 /> Delete selected
              </Button>
            </CommunityBulkDeleteDialog>
          </>
        )}
        {permissions?.canAdd && <CommunityFormSheet purpose="create" buttonLabel="New community" />}
      </div>
      {mode === 'table' ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant={'ghost'} size={'icon'} asChild>
                  <Label>
                    <Checkbox
                      checked={ids.length === communities.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setIds(communities.map((community) => community.id));
                        } else {
                          setIds([]);
                        }
                      }}
                    />
                  </Label>
                </Button>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {communities
              .filter((community) => JSON.stringify(community).toLowerCase().includes(cari.toLowerCase()))
              .map((community) => (
                <TableRow key={community.id}>
                  <TableCell>
                    <Button variant={'ghost'} size={'icon'} asChild>
                      <Label>
                        <Checkbox
                          checked={ids.includes(community.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setIds([...ids, community.id]);
                            } else {
                              setIds(ids.filter((id) => id !== community.id));
                            }
                          }}
                        />
                      </Label>
                    </Button>
                  </TableCell>
                  <TableCell>{community.name}</TableCell>
                  <TableCell>{strLimit(community.description, 50)}</TableCell>
                  <TableCell>
                    {permissions?.canShow && (
                      <Button variant={'ghost'} size={'icon'}>
                        <Link href={route('community.show', community.id)}>
                          <Folder />
                        </Link>
                      </Button>
                    )}
                    {permissions?.canUpdate && (
                      <>
                        <CommunityFormSheet purpose="edit" community={community} variant="icon" />
                      </>
                    )}
                    {permissions?.canDelete && (
                      <CommunityDeleteDialog community={community}>
                        <Button variant={'ghost'} size={'icon'}>
                          <Trash2 />
                        </Button>
                      </CommunityDeleteDialog>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      ) : (
        <div className="grid-responsive grid gap-4">
          {communities
            .filter((community) => JSON.stringify(community).toLowerCase().includes(cari.toLowerCase()))
            .map((community) => (
              <CommunityItemCard key={community.id} community={community} />
            ))}
        </div>
      )}
    </AppLayout>
  );
};

export default CommunityList;
