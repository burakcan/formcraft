# Frontend Architecture

## Overview

FormCraft's frontend is built with Next.js 14 using the App Router, React 18, TypeScript, and Tailwind CSS. The architecture follows modern React patterns and best practices for state management, component composition, and performance optimization.

## Directory Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/             # Shared components
│   ├── ui/                # Base UI components
│   ├── forms/             # Form-related components
│   └── layout/            # Layout components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and configs
├── craftPages/            # Form builder components
├── services/              # API service functions
└── types/                 # TypeScript type definitions
```

## Component Architecture

### Atomic Design Pattern

```
Components/
├── atoms/                 # Basic building blocks
│   ├── Button/
│   ├── Input/
│   └── Typography/
├── molecules/            # Combinations of atoms
│   ├── FormField/
│   ├── SearchBar/
│   └── Notification/
├── organisms/           # Complex components
│   ├── FormBuilder/
│   ├── Navigation/
│   └── Dashboard/
└── templates/          # Page layouts
    ├── DashboardLayout/
    └── FormLayout/
```

## State Management

### Zustand Store Structure

```typescript
interface FormBuilderStore {
  // Form Structure
  elements: FormElement[];
  selectedElement: string | null;

  // Actions
  addElement: (element: FormElement) => void;
  removeElement: (id: string) => void;
  updateElement: (id: string, updates: Partial<FormElement>) => void;

  // UI State
  isDragging: boolean;
  isPreviewMode: boolean;

  // History
  history: FormHistoryState[];
  currentHistoryIndex: number;
  undo: () => void;
  redo: () => void;
}

interface UIStore {
  theme: "light" | "dark";
  sidebarOpen: boolean;
  notifications: Notification[];

  // Actions
  toggleTheme: () => void;
  toggleSidebar: () => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
}
```

### React Query Usage

```typescript
// API Hooks
const useFormQuery = (formId: string) => {
  return useQuery({
    queryKey: ["form", formId],
    queryFn: () => fetchForm(formId),
  });
};

const useSubmissionsQuery = (formId: string) => {
  return useQuery({
    queryKey: ["submissions", formId],
    queryFn: () => fetchSubmissions(formId),
  });
};

// Mutations
const useUpdateForm = () => {
  return useMutation({
    mutationFn: updateForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["form"] });
    },
  });
};
```

## Form Builder Components

### Core Components

```typescript
// Element Registry
interface ElementRegistry {
  [key: string]: {
    component: React.ComponentType<ElementProps>;
    icon: React.ComponentType;
    defaults: Partial<ElementConfig>;
    validate: (value: any) => boolean;
  };
}

// Drag and Drop
interface DragItem {
  type: string;
  id: string;
  index: number;
  data: ElementConfig;
}

// Element Configuration
interface ElementConfig {
  id: string;
  type: string;
  label: string;
  required: boolean;
  validation?: ValidationRule[];
  styling?: ElementStyling;
  conditional?: ConditionalRule;
}
```

### Form Rendering Engine

```typescript
interface FormEngine {
  // Core
  elements: FormElement[];
  values: FormValues;
  errors: FormErrors;

  // Methods
  validate: () => boolean;
  submit: () => Promise<void>;
  reset: () => void;

  // Helpers
  evaluateCondition: (condition: Condition) => boolean;
  formatValue: (value: any, format: string) => string;

  // Events
  onChange: (field: string, value: any) => void;
  onBlur: (field: string) => void;
  onFocus: (field: string) => void;
}
```

## Styling System

### Tailwind Configuration

```typescript
// tailwind.config.ts
const config = {
  theme: {
    extend: {
      colors: {
        primary: {...},
        secondary: {...},
        accent: {...}
      },
      spacing: {
        form: {...}
      },
      animation: {
        'slide-up': '...',
        'fade-in': '...'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
};
```

### Theme System

```typescript
interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography: {
    fontFamily: string;
    fontSize: Record<string, string>;
    fontWeight: Record<string, number>;
  };
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
}
```

## Performance Optimizations

### Code Splitting

```typescript
// Dynamic Imports
const FormBuilder = dynamic(() => import("@/components/FormBuilder"), {
  loading: () => <FormBuilderSkeleton />,
  ssr: false,
});

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  loading: () => <Skeleton height={200} />,
  ssr: false,
});
```

### Memoization

```typescript
// Component Memoization
const MemoizedFormElement = memo(FormElement, (prev, next) => {
  return (
    prev.id === next.id &&
    prev.value === next.value &&
    prev.error === next.error
  );
});

// Callback Memoization
const handleSubmit = useCallback(async (values: FormValues) => {
  await submitForm(values);
}, []);
```

## Client-Side Validation

```typescript
interface ValidationRule {
  type: "required" | "email" | "pattern" | "custom";
  message: string;
  value?: any;
  validator?: (value: any) => boolean;
}

const validateField = (value: any, rules: ValidationRule[]) => {
  for (const rule of rules) {
    switch (rule.type) {
      case "required":
        if (!value) return rule.message;
        break;
      case "email":
        if (!EMAIL_REGEX.test(value)) return rule.message;
        break;
      case "pattern":
        if (!rule.value.test(value)) return rule.message;
        break;
      case "custom":
        if (!rule.validator?.(value)) return rule.message;
        break;
    }
  }
  return null;
};
```

## Error Handling

```typescript
// Error Boundary
class FormErrorBoundary extends React.Component<Props, State> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <FormErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

## Testing Strategy

```typescript
// Component Testing
describe("FormBuilder", () => {
  it("renders empty state correctly", () => {
    render(<FormBuilder />);
    expect(screen.getByText("Add your first element")).toBeInTheDocument();
  });

  it("allows adding new elements", async () => {
    render(<FormBuilder />);
    await userEvent.click(screen.getByText("Add Element"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});

// Integration Testing
describe("Form Submission", () => {
  it("validates required fields", async () => {
    render(<FormRenderer form={testForm} />);
    await userEvent.click(screen.getByText("Submit"));
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });
});
```

## Best Practices

1. **Component Design**

   - Keep components focused and single-responsibility
   - Use composition over inheritance
   - Implement proper prop typing
   - Document component APIs

2. **State Management**

   - Use local state for UI-only state
   - Leverage Zustand for global state
   - Implement proper state hydration
   - Handle loading and error states

3. **Performance**

   - Implement proper memoization
   - Use virtual scrolling for long lists
   - Optimize images and assets
   - Monitor and optimize bundle size

4. **Accessibility**
   - Follow ARIA best practices
   - Implement keyboard navigation
   - Provide proper focus management
   - Test with screen readers
