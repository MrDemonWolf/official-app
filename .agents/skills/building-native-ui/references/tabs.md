# Native Tabs

Always prefer NativeTabs from 'expo-router/unstable-native-tabs' for the best iOS experience.

**Requires SDK 55+**

## Basic Usage

```tsx
import { NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabLayout() {
  return (
    <NativeTabs minimizeBehavior="onScrollDown">
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" />
        <NativeTabs.Trigger.Badge>9+</NativeTabs.Trigger.Badge>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Icon sf="gear" />
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(search)" role="search">
        <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

## SDK 55 Import Changes

In SDK 55, `Icon`, `Label`, and `Badge` are no longer separate exports. They are accessed as sub-components of `NativeTabs.Trigger`:

```tsx
// SDK 54 (old)
import { NativeTabs, Icon, Label, Badge } from "expo-router/unstable-native-tabs";
<Icon sf="house.fill" />
<Label>Home</Label>
<Badge>3</Badge>

// SDK 55+ (new)
import { NativeTabs } from "expo-router/unstable-native-tabs";
<NativeTabs.Trigger.Icon sf="house.fill" />
<NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
<NativeTabs.Trigger.Badge>3</NativeTabs.Trigger.Badge>
```

## Rules

- You must include a trigger for each tab
- The `NativeTabs.Trigger` 'name' must match the route name, including parentheses (e.g. `<NativeTabs.Trigger name="(search)">`)
- Prefer search tab to be last in the list so it can combine with the search bar
- Use the 'role' prop for common tab types

## Platform Features

Native Tabs use platform-specific tab bar implementations:

- **iOS 26+**: Liquid glass effects with system-native appearance
- **Android**: Material 3 bottom navigation
- Better performance and native feel

## Icon Component

```tsx
// SF Symbol only (iOS)
<NativeTabs.Trigger.Icon sf="house.fill" />

// With Material icon for Android
<NativeTabs.Trigger.Icon sf="house.fill" md="home" />

// Custom image source
<NativeTabs.Trigger.Icon src={require('./icon.png')} />

// State variants (default/selected)
<NativeTabs.Trigger.Icon sf={{ default: "house", selected: "house.fill" }} />
```

## Label Component

```tsx
// Basic label
<NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>

// Hidden label (icon only)
<NativeTabs.Trigger.Label hidden>Home</NativeTabs.Trigger.Label>
```

## Badge Component

```tsx
// Numeric badge
<NativeTabs.Trigger.Badge>9+</NativeTabs.Trigger.Badge>

// Dot indicator (empty badge)
<NativeTabs.Trigger.Badge />
```

## iOS 26 Features

### Liquid Glass Tab Bar

The tab bar automatically adopts liquid glass appearance on iOS 26+.

### Minimize on Scroll

```tsx
<NativeTabs minimizeBehavior="onScrollDown">
```

### Search Tab

Add a dedicated search tab that integrates with the tab bar search field:

```tsx
<NativeTabs.Trigger name="(search)" role="search">
  <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
</NativeTabs.Trigger>
```

**Note**: Place search tab last for best UX.

### Role Prop

Use semantic roles for special tab types:

```tsx
<NativeTabs.Trigger name="search" role="search" />
<NativeTabs.Trigger name="favorites" role="favorites" />
<NativeTabs.Trigger name="more" role="more" />
```

Available roles: `search` | `more` | `favorites` | `bookmarks` | `contacts` | `downloads` | `featured` | `history` | `mostRecent` | `mostViewed` | `recents` | `topRated`

## Customization

### Tint Color

```tsx
<NativeTabs tintColor="#007AFF">
```

### Dynamic Colors (iOS)

Use DynamicColorIOS for colors that adapt to liquid glass:

```tsx
import { DynamicColorIOS, Platform } from 'react-native';

const adaptiveBlue = Platform.select({
  ios: DynamicColorIOS({ light: '#007AFF', dark: '#0A84FF' }),
  default: '#007AFF',
});

<NativeTabs tintColor={adaptiveBlue}>
```

## Conditional Tabs

Hide tabs conditionally:

```tsx
<NativeTabs.Trigger name="admin" hidden={!isAdmin}>
  <NativeTabs.Trigger.Label>Admin</NativeTabs.Trigger.Label>
  <NativeTabs.Trigger.Icon sf="shield.fill" />
</NativeTabs.Trigger>
```

## Behavior Options

```tsx
<NativeTabs.Trigger
  name="home"
  disablePopToTop    // Don't pop stack when tapping active tab
  disableScrollToTop // Don't scroll to top when tapping active tab
>
```

## Structure with Stacks

Native tabs don't render headers. Nest Stacks inside each tab for navigation headers:

```tsx
// app/(tabs)/_layout.tsx
import { NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="(home)">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

// app/(tabs)/(home)/_layout.tsx
import Stack from "expo-router/stack";

export default function HomeStack() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Home", headerLargeTitle: true }}
      />
      <Stack.Screen name="details" options={{ title: "Details" }} />
    </Stack>
  );
}
```

## Migration from JS Tabs

### Before (JS Tabs)

```tsx
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <IconSymbol name="gear" color={color} />,
        }}
      />
    </Tabs>
  );
}
```

### After (Native Tabs — SDK 55+)

```tsx
import { NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="gear" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

### Key Differences

| JS Tabs                    | Native Tabs                            |
| -------------------------- | -------------------------------------- |
| `<Tabs.Screen>`            | `<NativeTabs.Trigger>`                 |
| `options={{ title }}`      | `<NativeTabs.Trigger.Label>`           |
| `options={{ tabBarIcon }}` | `<NativeTabs.Trigger.Icon sf="..." />` |
| Props-based API            | React component-based API              |
| `tabBarBadge` option       | `<NativeTabs.Trigger.Badge>`           |

### Migration Steps

1. **Change imports**

   ```tsx
   // Remove
   import { Tabs } from "expo-router";

   // Add
   import { NativeTabs } from "expo-router/unstable-native-tabs";
   ```

2. **Replace Tabs with NativeTabs**

   ```tsx
   // Before
   <Tabs screenOptions={{ ... }}>

   // After
   <NativeTabs>
   ```

3. **Convert each Screen to Trigger**

   ```tsx
   // Before
   <Tabs.Screen
     name="home"
     options={{
       title: 'Home',
       tabBarIcon: ({ color }) => <Icon name="house" color={color} />,
       tabBarBadge: 3,
     }}
   />

   // After
   <NativeTabs.Trigger name="home">
     <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
     <NativeTabs.Trigger.Icon sf="house.fill" />
     <NativeTabs.Trigger.Badge>3</NativeTabs.Trigger.Badge>
   </NativeTabs.Trigger>
   ```

4. **Move headers to nested Stack** - Native tabs don't render headers
   ```
   app/
     (tabs)/
       _layout.tsx      <- NativeTabs
       (home)/
         _layout.tsx    <- Stack with headers
         index.tsx
       (settings)/
         _layout.tsx    <- Stack with headers
         index.tsx
   ```

## Limitations

- **Android**: Maximum 5 tabs (Material Design constraint)
- **Nesting**: Native tabs cannot nest inside other native tabs
- **Tab bar height**: Cannot be measured programmatically
- **FlatList transparency**: Use `disableTransparentOnScrollEdge` to fix issues

## Keyboard Handling (Android)

Configure in app.json:

```json
{
  "expo": {
    "android": {
      "softwareKeyboardLayoutMode": "resize"
    }
  }
}
```

## Common Issues

1. **Icons not showing on Android**: Use `md` prop for Material icons (e.g. `<NativeTabs.Trigger.Icon sf="house.fill" md="home" />`)
2. **Headers missing**: Nest a Stack inside each tab group
3. **Trigger name mismatch**: Ensure `name` matches exact route name including parentheses
4. **Badge not visible**: Badge must be a child of Trigger, not a prop
