import { Image } from 'expo-image';
import { ScrollView, Text, View } from 'react-native';

const GRAVATAR_URL = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&s=200';

export default function AboutScreen() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: 24, gap: 24 }}
      className="bg-zinc-50 dark:bg-zinc-950"
    >
      <View className="items-center gap-4">
        <Image
          source={{ uri: GRAVATAR_URL }}
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
          }}
          contentFit="cover"
        />
        <Text className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          MrDemonWolf
        </Text>
      </View>

      <View
        className="rounded-2xl bg-white p-4 dark:bg-zinc-900"
        style={{
          borderCurve: 'continuous',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}
      >
        <View className="flex-row items-center gap-3">
          <Text className="text-3xl font-bold text-blue-500">11+</Text>
          <Text className="flex-1 text-base text-zinc-600 dark:text-zinc-400">
            Years of Experience in Development
          </Text>
        </View>
      </View>

      <View className="gap-4">
        <Text className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          About Me
        </Text>
        <Text
          className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300"
          selectable
        >
          I take great pride in crafting dynamic Web Applications and alluring WordPress websites. With years of experience under my belt I have honed my skills in Web Engineering, Design and maintenance.
        </Text>
        <Text
          className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300"
          selectable
        >
          These skills I now offer to those seeking to craft new and innovative opportunities in website and software development, my diverse experience in many exciting projects will ensure that I can bring any idea to life.
        </Text>
        <Text
          className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300"
          selectable
        >
          In order to maintain a healthy work-life balance I enjoy kicking back and playing games with friends and even some live streaming, when I am not doing that I use my spare time to continue learning or even experimenting with building websites and web applications.
        </Text>
        <Text
          className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300"
          selectable
        >
          Join me for some fun and engaging content that blends both business and pleasure.
        </Text>
      </View>
    </ScrollView>
  );
}
