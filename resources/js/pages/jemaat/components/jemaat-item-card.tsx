import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FC } from 'react';
import { Jemaat } from '@/types/jemaat';

type Props = {
  jemaat: Jemaat;
  className?: string;
};

const JemaatItemCard: FC<Props> = ({ jemaat, className }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="leading-normal">{ jemaat.name }</CardTitle>
        <CardDescription>
          ID: { jemaat.id }
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default JemaatItemCard;
