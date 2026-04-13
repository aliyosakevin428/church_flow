import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Community } from '@/types/community';
import { FC } from 'react';

type Props = {
  community: Community;
  className?: string;
};

const CommunityItemCard: FC<Props> = ({ community, className }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="leading-normal">{community.name}</CardTitle>
        <CardDescription>
          ID: {community.id}
          <br />
          Description: {community.description}
          <br />
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default CommunityItemCard;
