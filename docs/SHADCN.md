# shadcn/ui Component Guide

This document outlines the usage of shadcn/ui components in the Tinylink project.

## Critical Rule

⚠️ **ALL UI elements MUST use shadcn/ui components. DO NOT create custom components.**

---

## What is shadcn/ui?

shadcn/ui is a collection of re-usable components built with Radix UI and Tailwind CSS. Components are copied into your project, not installed as dependencies.

**Official Documentation:** https://ui.shadcn.com

---

## Installation

Install shadcn/ui CLI and initialize:

```bash
npx shadcn@latest init
```

Follow the prompts to configure:
- TypeScript: Yes
- Style: Default
- Base color: Slate
- CSS variables: Yes
- Tailwind config: Yes
- Import alias: @/components

---

## Adding Components

Use the CLI to add components as needed:

```bash
# Add a single component
npx shadcn@latest add button

# Add multiple components
npx shadcn@latest add button input card dialog

# Add all components (not recommended)
npx shadcn@latest add --all
```

Components are added to `components/ui/` directory.

---

## Available Components

### Core UI Components

```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add select
npx shadcn@latest add label
npx shadcn@latest add form
npx shadcn@latest add table
npx shadcn@latest add badge
npx shadcn@latest add avatar
npx shadcn@latest add alert
npx shadcn@latest add toast
npx shadcn@latest add skeleton
```

---

## Usage Examples

### Button Component

```typescript
import { Button } from '@/components/ui/button';

export function MyComponent() {
  return (
    <div className="flex gap-4">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button size="sm">Small</Button>
      <Button size="lg">Large</Button>
    </div>
  );
}
```

### Input Component

```typescript
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function Form() {
  return (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        type="email"
        placeholder="you@example.com"
      />
    </div>
  );
}
```

### Card Component

```typescript
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function LinkCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Short Link</CardTitle>
        <CardDescription>Your shortened URL</CardDescription>
      </CardHeader>
      <CardContent>
        <p>https://tiny.link/abc123</p>
      </CardContent>
      <CardFooter>
        <Button>Copy Link</Button>
      </CardFooter>
    </Card>
  );
}
```

### Dialog (Modal) Component

```typescript
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function CreateLinkDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Link</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Link</DialogTitle>
          <DialogDescription>
            Enter the URL you want to shorten
          </DialogDescription>
        </DialogHeader>
        {/* Form content */}
      </DialogContent>
    </Dialog>
  );
}
```

### Form Component

```typescript
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL' }),
});

export function CreateLinkForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormDescription>
                Enter the URL you want to shorten
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Shorten Link</Button>
      </form>
    </Form>
  );
}
```

### Table Component

```typescript
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function LinksTable({ links }: { links: Link[] }) {
  return (
    <Table>
      <TableCaption>Your shortened links</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Short Code</TableHead>
          <TableHead>Original URL</TableHead>
          <TableHead>Clicks</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {links.map((link) => (
          <TableRow key={link.id}>
            <TableCell>{link.shortCode}</TableCell>
            <TableCell>{link.originalUrl}</TableCell>
            <TableCell>{link.clicks}</TableCell>
            <TableCell>{link.createdAt}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

---

## Component Variants

Most shadcn/ui components support variants via props:

### Button Variants

```typescript
<Button variant="default">Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

### Button Sizes

```typescript
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>
```

---

## Styling shadcn/ui Components

shadcn/ui components use Tailwind CSS. Customize via `className`:

```typescript
<Button className="w-full">Full Width Button</Button>

<Input className="max-w-md" />

<Card className="border-blue-500 shadow-lg">
  <CardContent>Custom styled card</CardContent>
</Card>
```

---

## DO NOT Create Custom Components

❌ **Bad:**

```typescript
// DO NOT DO THIS
export function CustomButton({ children, onClick }: Props) {
  return (
    <button
      className="px-4 py-2 bg-blue-600 text-white rounded"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

✅ **Good:**

```typescript
// USE shadcn/ui instead
import { Button } from '@/components/ui/button';

export function MyComponent() {
  return <Button onClick={handleClick}>Click Me</Button>;
}
```

---

## Extending shadcn/ui Components

If you need to extend a component, wrap it instead of creating from scratch:

```typescript
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
  loading?: boolean;
}

export function LoadingButton({ loading, children, ...props }: LoadingButtonProps) {
  return (
    <Button disabled={loading} {...props}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}
```

---

## Icons

shadcn/ui uses **lucide-react** for icons:

```bash
npm install lucide-react
```

```typescript
import { Check, X, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function IconButtons() {
  return (
    <div className="flex gap-2">
      <Button size="icon">
        <Check className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="destructive">
        <X className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="outline">
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
}
```

---

## Theme Configuration

shadcn/ui uses CSS variables for theming. Configure in `app/globals.css`:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    /* ... other variables */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... other dark mode variables */
  }
}
```

---

## Commonly Used Components for Tinylink

### Dashboard Layout

```typescript
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export function Dashboard() {
  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create Short Link</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input placeholder="Enter URL" className="flex-1" />
            <Button>Shorten</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Link List

```typescript
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function LinkItem({ link }: { link: Link }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">{link.shortCode}</p>
          <p className="text-sm text-muted-foreground">{link.originalUrl}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge>{link.clicks} clicks</Badge>
          <Button size="sm" variant="outline">Copy</Button>
        </div>
      </div>
    </Card>
  );
}
```

---

## Best Practices

✓ Always use shadcn/ui components  
✓ Install components as needed (not all at once)  
✓ Use `className` for custom styling  
✓ Leverage component variants (size, variant props)  
✓ Use lucide-react for icons  
✓ Extend components by wrapping, not recreating  
✓ Follow shadcn/ui documentation for component APIs  

## DO NOT

✗ Create custom button/input/card components from scratch  
✗ Install shadcn/ui as an npm package (it's CLI-based)  
✗ Modify components in `components/ui/` directly (wrap instead)  
✗ Use other UI libraries alongside shadcn/ui  
✗ Ignore component accessibility features  

---

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [shadcn/ui Components](https://ui.shadcn.com/docs/components)
- [Radix UI Documentation](https://www.radix-ui.com/primitives)
- [lucide-react Icons](https://lucide.dev)

---

**Last Updated:** January 20, 2026
