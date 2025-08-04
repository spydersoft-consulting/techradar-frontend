# PrimeReact + Tailwind CSS Configuration

This document explains how PrimeReact has been configured to work with Tailwind CSS in the techradar-ui project.

## Installation

The following packages have been installed:

```bash
yarn add primereact primeicons
yarn add -D @tailwindcss/postcss
```

## Configuration

### 1. Tailwind CSS Configuration (`tailwind.config.js`)

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/primereact/**/*.{js,ts,jsx,tsx}", // Include PrimeReact components
  ],
  theme: {
    extend: {
      colors: {
        primary: '#62419a',
        secondary: '#001c71',
        info: '#007ac9',
        danger: '#f32735',
        light: '#e6e7e8',
        dark: '#222223',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
  corePlugins: {
    preflight: false, // Disable Tailwind's base styles to avoid conflicts with PrimeReact
  },
};
```

**Important**: `preflight: false` is set to prevent Tailwind from overriding PrimeReact's component styles.

### 2. CSS Imports (`styles.css`)

```css
/* PrimeReact Theme */
@import 'primereact/resources/themes/lara-light-blue/theme.css';

/* PrimeReact Core */
@import 'primereact/resources/primereact.min.css';

/* PrimeIcons */
@import 'primeicons/primeicons.css';

@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 3. PrimeReact Provider Setup

A `PrimeReactProvider` has been created in `src/context/PrimeReactProvider.tsx` to configure PrimeReact globally:

```tsx
import React from "react";
import { PrimeReactProvider as PrimeProvider } from "primereact/api";

export const PrimeReactProvider: React.FC<PrimeReactProviderProps> = ({ children }) => {
  const value = {
    ripple: true,
    inputStyle: 'outlined' as const,
    locale: 'en',
    cssTransition: true,
    autoZIndex: true,
    hideOverlaysOnDocumentScrolling: false,
    nullSortOrder: 1,
    zIndex: {
      modal: 1100,
      overlay: 1000,
      menu: 1000,
      tooltip: 1100,
      toast: 1200,
    },
  };

  return <PrimeProvider value={value}>{children}</PrimeProvider>;
};
```

### 4. Integration in main.tsx

The provider is integrated into the application root:

```tsx
root.render(
  <React.StrictMode>
    <PrimeReactProvider>
      <AuthProvider>
        <Provider store={store}>
          <AppRouter />
        </Provider>
      </AuthProvider>
    </PrimeReactProvider>
  </React.StrictMode>,
);
```

## Usage

### Basic Component Example

```tsx
import React, { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";

export const MyComponent: React.FC = () => {
  const [value, setValue] = useState("");

  return (
    <Card className="shadow-md max-w-md mx-auto">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Input
          </label>
          <InputText
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter text..."
            className="w-full"
          />
        </div>
        <Button
          label="Submit"
          icon="pi pi-check"
          className="p-button-primary w-full"
        />
      </div>
    </Card>
  );
};
```

### Styling with Tailwind + PrimeReact

1. **Use Tailwind for layout and spacing**: `flex`, `grid`, `space-y-4`, `p-6`, `max-w-md`, etc.
2. **Use PrimeReact's built-in classes for component-specific styling**: `p-button-primary`, `p-button-outlined`, etc.
3. **Combine both approaches**: Apply Tailwind classes directly to PrimeReact components via the `className` prop.

### Available PrimeReact Themes

The project uses the `lara-light-blue` theme. Other available themes include:

- `lara-light-indigo`
- `lara-light-purple`
- `lara-dark-blue`
- `lara-dark-indigo`
- `bootstrap4-light-blue`
- `material-design-light`
- And many more...

To change themes, update the CSS import in `styles.css`:

```css
@import 'primereact/resources/themes/lara-dark-blue/theme.css';
```

## Demo Component

A comprehensive demo component has been created at `src/components/PrimeReactDemo/PrimeReactDemo.tsx` that showcases various PrimeReact components working with Tailwind CSS. This includes:

- Form inputs (InputText, Dropdown, Calendar, InputTextarea)
- Buttons with different styles
- Data tables
- Dialogs
- Checkboxes and radio buttons
- Cards and layouts

## Best Practices

1. **Don't disable preflight entirely in production**: Consider using Tailwind's `@layer` directive to scope styles instead.
2. **Use PrimeReact's pass-through API**: For advanced customization, use the `pt` prop to apply Tailwind classes directly to component parts.
3. **Consistent spacing**: Use Tailwind's spacing utilities (`space-y-4`, `gap-6`, etc.) for consistent layouts.
4. **Responsive design**: Combine PrimeReact's responsive props with Tailwind's responsive utilities.

## Troubleshooting

### Common Issues

1. **Styles not applying**: Ensure PrimeReact paths are included in Tailwind's `content` array.
2. **Component styling conflicts**: Check if `preflight: false` is set in Tailwind config.
3. **Missing icons**: Verify that `primeicons.css` is imported correctly.

### Performance Considerations

- PrimeReact adds significant bundle size (~200KB CSS, additional JS)
- Consider tree-shaking by importing only needed components
- Use dynamic imports for heavy components like DataTable when possible
