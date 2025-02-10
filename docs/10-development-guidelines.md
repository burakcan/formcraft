# Development Guidelines

## Code Style and Standards

### TypeScript Configuration

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "target": "es2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### ESLint Configuration

```javascript
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended"
  ],
  "plugins": ["@typescript-eslint", "sort"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "sort/imports": "error",
    "sort/exports": "error"
  }
}
```

### Code Formatting

```javascript
// prettier.config.js
module.exports = {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: "es5",
  printWidth: 80,
  bracketSpacing: true,
  arrowParens: "always",
};
```

## Project Structure

### Directory Organization

```
src/
├── actions/           # Server actions
├── app/              # Next.js app router pages
├── components/       # React components
│   ├── ui/          # Base UI components
│   ├── forms/       # Form components
│   └── layout/      # Layout components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
├── services/        # External service integrations
└── types/           # TypeScript type definitions
```

### Naming Conventions

```typescript
// File naming
components / Button.tsx; // Component files: PascalCase
hooks / useFormState.ts; // Hook files: camelCase with 'use' prefix
types / form.types.ts; // Type files: camelCase with '.types'
utils / formatDate.ts; // Utility files: camelCase

// Component naming
const ButtonComponent: React.FC<ButtonProps> = () => {};
const useFormState = () => {};
const formatDate = (date: Date): string => {};
```

## Component Development

### Component Template

```typescript
import { type FC } from "react";
import { cn } from "@/lib/utils";

interface ComponentProps {
  /** Description of the prop */
  prop1: string;
  /** Description of optional prop */
  prop2?: number;
}

/**
 * Component description
 */
export const Component: FC<ComponentProps> = ({ prop1, prop2 = 0 }) => {
  // State and hooks

  // Event handlers

  // Render helpers

  return (
    <div className={cn("base-styles", "conditional-styles")}>
      {/* Component content */}
    </div>
  );
};
```

### Hook Template

```typescript
import { useState, useEffect, useCallback } from "react";

interface HookOptions {
  // Hook options
}

interface HookReturn {
  // Hook return values
}

export const useHook = (options: HookOptions): HookReturn => {
  // State

  // Effects

  // Callbacks

  // Return values
  return {
    // Hook return object
  };
};
```

## Testing Guidelines

### Component Testing

```typescript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Component } from "./Component";

describe("Component", () => {
  it("renders correctly", () => {
    render(<Component prop1="test" />);
    expect(screen.getByText("test")).toBeInTheDocument();
  });

  it("handles user interaction", async () => {
    render(<Component prop1="test" />);
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByText("clicked")).toBeInTheDocument();
  });
});
```

### Hook Testing

```typescript
import { renderHook, act } from "@testing-library/react";
import { useHook } from "./useHook";

describe("useHook", () => {
  it("returns initial state", () => {
    const { result } = renderHook(() => useHook({ initial: 0 }));
    expect(result.current.value).toBe(0);
  });

  it("updates state", () => {
    const { result } = renderHook(() => useHook({ initial: 0 }));
    act(() => {
      result.current.setValue(1);
    });
    expect(result.current.value).toBe(1);
  });
});
```

## State Management

### Zustand Store Pattern

```typescript
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface State {
  // State properties
}

interface Actions {
  // Action methods
}

export const useStore = create<State & Actions>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state

        // Actions
        action: () => set((state) => ({ ...state, updated: true })),
      }),
      {
        name: "store-name",
      }
    )
  )
);
```

### React Query Pattern

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Query hook
export const useData = (id: string) => {
  return useQuery({
    queryKey: ["data", id],
    queryFn: () => fetchData(id),
  });
};

// Mutation hook
export const useUpdateData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["data"] });
    },
  });
};
```

## Error Handling

### Error Boundary Pattern

```typescript
import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
```

## Performance Optimization

### React.memo Usage

```typescript
import { memo } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const Component = memo(
  ({ value, onChange }: Props) => {
    return <input value={value} onChange={(e) => onChange(e.target.value)} />;
  },
  (prev, next) => prev.value === next.value
);
```

### useMemo and useCallback

```typescript
import { useMemo, useCallback } from "react";

const Component = ({ data, onUpdate }) => {
  const processedData = useMemo(() => {
    return expensiveOperation(data);
  }, [data]);

  const handleUpdate = useCallback(
    (value: string) => {
      onUpdate(value);
    },
    [onUpdate]
  );

  return (
    <div>
      {processedData.map((item) => (
        <Item key={item.id} data={item} onUpdate={handleUpdate} />
      ))}
    </div>
  );
};
```

## Git Workflow

### Branch Naming

```
feature/feature-name
bugfix/bug-description
hotfix/urgent-fix
release/version-number
```

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

Types:

- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance

### Pull Request Template

```markdown
## Description

Brief description of the changes

## Type of change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?

Describe the tests you ran

## Checklist:

- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests
- [ ] All tests pass
```

## Documentation

### Component Documentation

````typescript
/**
 * Component description
 *
 * @example
 * ```tsx
 * <Component prop1="value" />
 * ```
 *
 * @param props - Component props
 * @param props.prop1 - Description of prop1
 * @param [props.prop2] - Description of optional prop2
 */
````

### Function Documentation

````typescript
/**
 * Function description
 *
 * @param param1 - Description of param1
 * @param [param2] - Description of optional param2
 * @returns Description of return value
 * @throws Description of potential errors
 *
 * @example
 * ```ts
 * const result = function('value');
 * ```
 */
````

## Best Practices

1. **Code Organization**

   - Keep files focused and single-responsibility
   - Use appropriate file structure
   - Follow naming conventions
   - Document code thoroughly

2. **Component Development**

   - Use TypeScript for type safety
   - Implement proper prop validation
   - Handle loading and error states
   - Follow accessibility guidelines

3. **State Management**

   - Choose appropriate state solution
   - Implement proper state hydration
   - Handle side effects properly
   - Use proper caching strategies

4. **Performance**

   - Implement proper memoization
   - Optimize bundle size
   - Use code splitting
   - Monitor performance metrics

5. **Testing**
   - Write comprehensive tests
   - Use appropriate testing patterns
   - Maintain good test coverage
   - Test edge cases
