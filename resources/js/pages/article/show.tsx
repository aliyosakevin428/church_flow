import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { backAction } from '@/lib/utils';
import { Article } from '@/types/article';
import { format } from 'date-fns';
import { Calendar, Edit, Folder, User } from 'lucide-react';
import { FC, useState } from 'react';
import ArticleFormDialog from './components/article-form-sheet';

type Props = {
  article: Article;
};

const ShowArticle: FC<Props> = ({ article }) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);

  return (
    <AppLayout
      title="Preview Artikel"
      description="Tampilan artikel saat diterbitkan nanti"
      actions={[
        backAction(),
        {
          title: 'Edit Artikel',
          onClick: () => setOpenEditDialog(true),
          icon: Edit,
        },
      ]}
    >
      <ArticleFormDialog
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        purpose="edit"
        article={article}
        onSuccess={() => setOpenEditDialog(false)}
        withChildren={false}
      />

      <div className="mx-auto max-w-4xl space-y-6 pb-10">
        <Card className="overflow-hidden border-none shadow-lg">
          <div className="relative h-[400px] w-full bg-muted">
            {article.media && article.media.length > 0 ? (
              <img src={article.media[0].original_url} alt={article.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-secondary">
                <span className="text-muted-foreground italic">No Featured Image</span>
              </div>
            )}

            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="px-3 py-1 shadow-md">
                <Folder className="mr-2 h-3 w-3" />
                {article.komunitas?.name || 'General'}
              </Badge>
            </div>
          </div>

          <CardHeader className="space-y-4 pt-8">
            <h1 className="text-4xl leading-tight font-bold tracking-tight text-foreground">{article.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{article.user?.name || 'Admin'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{article.created_at ? format(new Date(article.created_at), 'dd MMMM yyyy') : '-'}</span>
              </div>
            </div>
          </CardHeader>

          <Separator className="mx-8 w-auto" />

          <CardContent className="px-8 pt-8 pb-12">
            <div className="prose max-w-none prose-slate dark:prose-invert">
              <p className="text-lg leading-relaxed whitespace-pre-wrap">{article.content}</p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          Selesai membaca artikel dari <span className="font-semibold">{article.komunitas?.name || 'Pekerja Gereja'}</span>
        </div>
      </div>
    </AppLayout>
  );
};

export default ShowArticle;
