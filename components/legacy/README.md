# Legacy Components Archive

This folder contains deprecated and unused components from earlier versions of the application. These are kept for reference and historical purposes.

## Files

### BottomNav.legacy.tsx

**Status**: ❌ Deprecated  
**Replaced By**: `components/ui/navigation/BottomNav.tsx`  
**Reason**: Refactored to use constants and proper type definitions  
**Used By**: None (use the new version in `ui/navigation/`)

### EditScreenInfo.legacy.tsx

**Status**: ❌ Unused  
**Reason**: Legacy demo component, not used in current application  
**Note**: Can be safely deleted if not needed for reference

### ScreenContent.legacy.tsx

**Status**: ❌ Unused  
**Reason**: Legacy wrapper component, functionality replaced by individual screens  
**Dependencies**: EditScreenInfo.legacy.tsx  
**Note**: Can be safely deleted if not needed for reference

## Migration Path

If you were previously using these components:

### Before (Old)

```typescript
import { BottomNav } from 'components/BottomNav';
import { EditScreenInfo } from 'components/EditScreenInfo';
import { ScreenContent } from 'components/ScreenContent';
```

### After (New - Recommended)

```typescript
// For BottomNav - use the new organized version
import { BottomNav } from 'components/ui/navigation/BottomNav';
// or from barrel export
import { BottomNav } from 'components';

// For EditScreenInfo and ScreenContent - use individual screens instead
// These are no longer needed as screens are self-contained
```

## Cleanup Notes

These files are safe to delete if:

1. You've migrated to the new component structure
2. You no longer need historical reference
3. Your codebase doesn't import from these files

To safely delete:

```bash
rm -rf components/legacy
```

Then verify no imports reference these files:

```bash
grep -r "components/legacy" src/
grep -r "EditScreenInfo" src/
grep -r "ScreenContent" src/
```

## Reference

See `components/README.md` for information about the current, production-ready component structure.
