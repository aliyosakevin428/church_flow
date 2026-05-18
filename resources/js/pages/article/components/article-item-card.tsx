import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FC } from 'react';
import { Article } from '@/types/article';

type Props = {
  article: Article;
  className?: string;
};

const ArticleItemCard: FC<Props> = ({ article, className }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="leading-normal">{ article.name }</CardTitle>
        <CardDescription>
          ID: { article.id }
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default ArticleItemCard;
