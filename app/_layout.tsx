import {
  Icon,
  Label,
  NativeTabs,
  VectorIcon,
} from "expo-router/unstable-native-tabs";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Platform } from "react-native";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="(tabs)/index">
        <Label>Home</Label>
        {Platform.select({
          ios: <Icon sf="person.fill" />,
          android: (
            <Icon src={<VectorIcon family={MaterialIcons} name="person" />} />
          ),
        })}
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(tabs)/blog">
        <Label>Blog</Label>
        {Platform.select({
          ios: <Icon sf="book.fill" />,
          android: (
            <Icon src={<VectorIcon family={MaterialIcons} name="book" />} />
          ),
        })}
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(tabs)/portfolio">
        <Label>Portfolio</Label>
        {Platform.select({
          ios: <Icon sf="briefcase.fill" />,
          android: (
            <Icon src={<VectorIcon family={MaterialIcons} name="work" />} />
          ),
        })}
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(tabs)/contact">
        <Label>Contact</Label>
        {Platform.select({
          ios: <Icon sf="envelope.fill" />,
          android: (
            <Icon src={<VectorIcon family={MaterialIcons} name="email" />} />
          ),
        })}
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
