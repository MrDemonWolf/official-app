import { ScrollView } from 'react-native';

import { ComingSoon } from '@/components/coming-soon';

export default function ContactScreen() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ flex: 1 }}
      className="bg-zinc-50 dark:bg-zinc-950"
    >
      <ComingSoon title="Contact" message="Contact form coming soon. Stay tuned!" />
    </ScrollView>
  );
}
