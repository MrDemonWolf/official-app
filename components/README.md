# Components Structure

This directory contains all React Native components organized in a clean, production-ready structure.

## Directory Structure

```
components/
├── screens/                 # Page-level components
│   ├── BlogScreen.tsx
│   ├── ContactScreen.tsx
│   ├── DebugScreen.tsx
│   └── PortfolioScreen.tsx
├── ui/                      # Reusable UI components
│   ├── navigation/
│   │   └── BottomNav.tsx
│   └── cards/
│       ├── BlogCard.tsx
│       └── BlogPostDetail.tsx
├── hooks/                   # Custom React hooks
│   ├── useContactForm.ts
│   ├── useBlogScreen.ts
│   └── index.ts
├── types/                   # TypeScript type definitions
│   └── index.ts
├── constants/               # Application constants
│   └── index.ts
├── index.ts                 # Main barrel export
└── README.md                # This file
```

## Component Categories

### Screens (`/screens`)

Full-page components that represent entire app views:

- **BlogScreen**: Blog listing with pagination and detail modal
- **ContactScreen**: Contact form with validation
- **DebugScreen**: Development/debug information display
- **PortfolioScreen**: Portfolio projects showcase

### UI Components (`/ui`)

Reusable, presentational components:

#### Navigation (`/ui/navigation`)

- **BottomNav**: Tabbed navigation at the bottom of the app

#### Cards (`/ui/cards`)

- **BlogCard**: Individual blog post preview card
- **BlogPostDetail**: Full blog post detail view with animations

### Custom Hooks (`/hooks`)

- **useContactForm**: Manages contact form state and validation
- **useBlogScreen**: Manages blog data fetching and state

### Types (`/types`)

TypeScript interfaces for type safety:

```typescript
export interface NavigationTab {
  name: string;
  component: React.ComponentType<any>;
  icon: string;
  label: string;
}

export interface BlogCardProps {
  post: WordPressPost;
  onPress: () => void;
  formatDate: (date: string) => string;
  stripHtml: (html: string) => string;
}
// ... more types
```

### Constants (`/constants`)

- **NAV_TABS**: Navigation tab configuration
- **PORTFOLIO_PROJECTS**: Portfolio project data
- **CONTACT_FORM_MESSAGES**: Form validation and success messages
- **DEBUG_INFO**: Debug screen information items

## Import Patterns

### From barrel export (recommended)

```typescript
import { BlogScreen, BottomNav, useContactForm, NAV_TABS } from 'components';
```

### Direct imports

```typescript
import { BlogScreen } from 'components/screens/BlogScreen';
import { BottomNav } from 'components/ui/navigation/BottomNav';
import { useContactForm } from 'components/hooks/useContactForm';
```

## Best Practices

1. **Keep screens clean**: Use hooks to extract state logic
2. **Reuse UI components**: Put presentational components in `/ui`
3. **Type everything**: All components should be properly typed
4. **Extract constants**: Hardcoded values belong in `/constants`
5. **Use barrel exports**: Index files make imports cleaner

## Adding New Components

### Adding a new screen:

```typescript
// components/screens/NewScreen.tsx
export function NewScreen() {
  return <View>New Screen</View>;
}
```

### Adding a new UI component:

```typescript
// components/ui/NewComponent.tsx
import { View, Text } from 'react-native';

interface NewComponentProps {
  title: string;
}

export function NewComponent({ title }: NewComponentProps) {
  return <Text>{title}</Text>;
}
```

### Adding a new hook:

```typescript
// components/hooks/useNewHook.ts
import { useState } from 'react';

export function useNewHook() {
  const [state, setState] = useState(null);

  return { state, setState };
}
```

Update `components/hooks/index.ts` to export it:

```typescript
export { useNewHook } from './useNewHook';
```

## Performance Considerations

- Components are modular for better tree-shaking
- Heavy business logic is extracted into hooks
- Constants are centralized to avoid duplication
- Type definitions provide compile-time safety
