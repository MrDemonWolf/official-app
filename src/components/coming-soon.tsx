import { SymbolView } from 'expo-symbols';
import { Text, View } from 'react-native';

interface ComingSoonProps {
  title: string;
  message?: string;
}

export function ComingSoon({ title, message }: ComingSoonProps) {
  return (
    <View className="flex-1 items-center justify-center gap-4 p-8">
      <SymbolView
        name="hammer.fill"
        size={64}
        tintColor="#71717a"
        resizeMode="scaleAspectFit"
      />
      <Text className="text-center text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        {title}
      </Text>
      <Text className="text-center text-base text-zinc-500 dark:text-zinc-400">
        {message || 'This section is under construction. Check back soon!'}
      </Text>
    </View>
  );
}
