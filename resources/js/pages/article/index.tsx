import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useViewMode } from '@/hooks/use-view-mode';
import AppLayout from '@/layouts/app-layout';
import { capitalizeWords, dateDFY, strLimit } from '@/lib/utils';
import { SharedData } from '@/types';
import { Article } from '@/types/article';
import { Link, usePage } from '@inertiajs/react';
import { Edit, Filter, Folder, Grid2X2, Image, TableIcon, Trash2 } from 'lucide-react';
import { FC, useState } from 'react';
import ArticleBulkDeleteDialog from './components/article-bulk-delete-dialog';
import ArticleBulkEditSheet from './components/article-bulk-edit-sheet';
import ArticleDeleteDialog from './components/article-delete-dialog';
import ArticleFilterSheet from './components/article-filter-sheet';
import ArticleFormSheet from './components/article-form-sheet';
import ArticleItemCard from './components/article-item-card';
import ArticleUploadMediaSheet from './components/article-upload-sheet';

type Props = {
  articles: Article[];
  query: { [key: string]: string };
};

const ArticleList: FC<Props> = ({ articles, query }) => {
  const { mode, toggle } = useViewMode();
  const [ids, setIds] = useState<number[]>([]);
  const [cari, setCari] = useState('');

  const { permissions } = usePage<SharedData>().props;

  return (
    <AppLayout
      title="Articles"
      description="Manage your articles"
      actions={[
        {
          title: capitalizeWords(mode) + ' view',
          icon: mode === 'grid' ? Grid2X2 : TableIcon,
          onClick: toggle,
        },
      ]}
    >
      <div className="flex gap-2">
        <Input placeholder="Search articles..." value={cari} onChange={(e) => setCari(e.target.value)} />
        <ArticleFilterSheet query={query}>
          <Button>
            <Filter />
            Filter data
            {Object.values(query).filter((val) => val && val !== '').length > 0 && (
              <Badge variant="secondary">{Object.values(query).filter((val) => val && val !== '').length}</Badge>
            )}
          </Button>
        </ArticleFilterSheet>
        {ids.length > 0 && (
          <>
            <Button variant={'ghost'} disabled>
              {ids.length} item selected
            </Button>
            <ArticleBulkEditSheet articleIds={ids} onSuccess={() => setIds([])}>
              <Button>
                <Edit /> Edit selected
              </Button>
            </ArticleBulkEditSheet>
            <ArticleBulkDeleteDialog articleIds={ids} onSuccess={() => setIds([])}>
              <Button variant={'destructive'}>
                <Trash2 /> Delete selected
              </Button>
            </ArticleBulkDeleteDialog>
          </>
        )}
        {permissions?.canAdd && <ArticleFormSheet purpose="create" buttonLabel="New article" />}
      </div>
      {mode === 'table' ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant={'ghost'} size={'icon'} asChild>
                  <Label>
                    <Checkbox
                      checked={ids.length === articles.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setIds(articles.map((article) => article.id));
                        } else {
                          setIds([]);
                        }
                      }}
                    />
                  </Label>
                </Button>
              </TableHead>
              <TableHead>Komunitas</TableHead>
              <TableHead>Judul Artikel</TableHead>
              <TableHead>Isi Artikel</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles
              .filter((article) => JSON.stringify(article).toLowerCase().includes(cari.toLowerCase()))
              .map((article) => (
                <TableRow key={article.id}>
                  <TableCell>
                    <Button variant={'ghost'} size={'icon'} asChild>
                      <Label>
                        <Checkbox
                          checked={ids.includes(article.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setIds([...ids, article.id]);
                            } else {
                              setIds(ids.filter((id) => id !== article.id));
                            }
                          }}
                        />
                      </Label>
                    </Button>
                  </TableCell>
                  <TableCell>{article.komunitas?.name || '-'}</TableCell>
                  <TableCell>{strLimit(article.title, 30)}</TableCell>
                  <TableCell>{strLimit(article.content, 30)}</TableCell>
                  <TableCell>{article.user?.name || '-'}</TableCell>
                  <TableCell>{dateDFY(article.created_at)}</TableCell>
                  <TableCell>
                    {permissions?.canShow && (
                      <Button variant={'ghost'} size={'icon'}>
                        <Link href={route('article.show', article.id)}>
                          <Folder />
                        </Link>
                      </Button>
                    )}
                    {permissions?.canUpdate && (
                      <>
                        <ArticleUploadMediaSheet article={article}>
                          <Button variant={'ghost'} size={'icon'}>
                            <Image />
                          </Button>
                        </ArticleUploadMediaSheet>
                        <ArticleFormSheet purpose="edit" article={article} variant="icon" />
                      </>
                    )}
                    {permissions?.canDelete && (
                      <ArticleDeleteDialog article={article}>
                        <Button variant={'ghost'} size={'icon'}>
                          <Trash2 />
                        </Button>
                      </ArticleDeleteDialog>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      ) : (
        <div className="grid-responsive grid gap-4">
          {articles
            .filter((article) => JSON.stringify(article).toLowerCase().includes(cari.toLowerCase()))
            .map((article) => (
              <ArticleItemCard key={article.id} article={article} />
            ))}
        </div>
      )}
    </AppLayout>
  );
};

export default ArticleList;
