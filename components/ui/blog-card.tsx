import { Image } from "expo-image";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  post: any;
  onPress?: (post: any) => void;
};

export default function BlogCard({ post, onPress }: Props) {
  const image =
    post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    post?.featured_image ||
    null;

  const excerpt = post?.excerpt?.rendered || post?.content?.rendered || "";
  const short = excerpt.replace(/<[^>]+>/g, "");
  const description = short.length > 160 ? `${short.slice(0, 157)}...` : short;

  const terms = Array.isArray(post?._embedded?.["wp:term"])
    ? post._embedded["wp:term"].flat()
    : [];

  const categories = terms
    .filter((t: any) => t.taxonomy === "category")
    .map((c: any) => c.name);
  const tags = terms
    .filter((t: any) => t.taxonomy === "post_tag")
    .map((t: any) => t.name);

  return (
    <TouchableOpacity onPress={() => onPress?.(post)} className="w-full">
      <View className="bg-white rounded-lg overflow-hidden shadow mb-4">
        {image ? (
          <Image
            source={{ uri: image }}
            className="w-full h-48"
            contentFit="cover"
            transition={250}
          />
        ) : (
          <View className="w-full h-48 bg-gray-200 items-center justify-center">
            <Text className="text-gray-500">No image</Text>
          </View>
        )}

        <View className="p-4">
          <Text className="text-lg font-bold mb-2">
            {post?.title?.rendered || post?.title}
          </Text>
          <Text className="text-sm text-gray-600 mb-3">{description}</Text>

          <View className="flex-row flex-wrap">
            {categories.map((c: string) => (
              <View key={c} className="bg-blue-100 px-2 py-1 rounded mr-2 mb-2">
                <Text className="text-blue-800 text-xs">{c}</Text>
              </View>
            ))}

            {tags.map((t: string) => (
              <View key={t} className="bg-gray-100 px-2 py-1 rounded mr-2 mb-2">
                <Text className="text-gray-700 text-xs">{t}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
