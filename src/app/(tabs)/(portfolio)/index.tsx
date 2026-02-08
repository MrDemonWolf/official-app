import { ScrollView } from 'react-native';

import { ComingSoon } from '@/components/coming-soon';

export default function PortfolioScreen() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ flex: 1 }}
      className="bg-zinc-50 dark:bg-zinc-950"
    >
      <ComingSoon title="Portfolio" message="My portfolio is being curated. Check back soon!" />
    </ScrollView>
  );
}
