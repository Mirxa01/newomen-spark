# AI Development Rules

## Tech Stack

- **React 18.3.1** - Frontend framework for building user interfaces
- **TypeScript** - Type-safe JavaScript with static typing
- **Vite** - Fast build tool and development server
- **React Router v6** - Client-side routing and navigation
- **Tailwind CSS** - Utility-first CSS framework for styling
- **shadcn/ui (Radix UI)** - Pre-built, accessible UI component library
- **Supabase** - Backend as a service for authentication, database, and real-time features
- **React Hook Form + Zod** - Form handling and validation
- **TanStack Query (React Query)** - Server state management and data fetching
- **Lucide React** - Icon library for consistent icons

## Library Usage Rules

### UI Components
- **ALWAYS use shadcn/ui components** from `src/components/ui/` for all UI elements
- Available shadcn components include: button, card, input, dialog, dropdown-menu, select, checkbox, radio-group, switch, slider, tabs, accordion, alert, toast, sheet, popover, tooltip, and more
- Do NOT edit shadcn/ui component files directly - create new components if you need customization
- For complex forms, use `src/components/ui/form.tsx` which integrates React Hook Form with shadcn components

### Styling
- **ALWAYS use Tailwind CSS classes** for all styling needs
- Use utility classes for layout, spacing, colors, typography, and responsiveness
- Use `clsx` and `tailwind-merge` from `src/lib/utils.ts` for conditional class merging
- Avoid custom CSS unless absolutely necessary

### Icons
- **ALWAYS use Lucide React** icons from `lucide-react` package
- Import icons like `import { IconName } from 'lucide-react'`
- Consistent icon sizing with Tailwind classes (e.g., `w-4 h-4`, `w-6 h-6`)

### Routing
- **ALWAYS use React Router v6** - routes defined in `src/App.tsx`
- Use `useNavigate`, `useLocation`, and other hooks from `react-router-dom`
- Pages go in `src/pages/`
- Update `src/App.tsx` when adding new pages

### Forms & Validation
- **ALWAYS use React Hook Form** (`react-hook-form`) for form management
- **ALWAYS use Zod** (`zod`) for schema validation
- Use `@hookform/resolvers` to integrate Zod with React Hook Form
- Use `src/lib/validation.ts` for reusable validation schemas

### Data Fetching
- **ALWAYS use TanStack Query** (`@tanstack/react-query`) for server state and data fetching
- Use Supabase client from `src/integrations/supabase/client.ts`
- Leverage `useQuery` for GET operations and `useMutation` for POST/PUT/DELETE
- Use the `useAuth` hook from `src/hooks/useAuth.tsx` for authentication state

### Authentication & Backend
- **ALWAYS use Supabase** for authentication, database, and real-time features
- Use the Supabase client from `src/integrations/supabase/client.ts`
- Authentication helpers available in `src/hooks/useAuth.tsx`
- Database types in `src/integrations/supabase/types.ts`

### Date Handling
- **ALWAYS use date-fns** for date manipulation and formatting
- Avoid native Date object manipulation - use date-fns utilities

### Charts & Data Visualization
- **ALWAYS use Recharts** (`recharts`) for charts and graphs
- Use `src/components/ui/chart.tsx` for styled chart components

### Toasts & Notifications
- **ALWAYS use Sonner** (`sonner`) for toast notifications
- Use `src/components/ui/sonner.tsx` and the `use-toast` hook

### Carousels
- **ALWAYS use Embla Carousel** (`embla-carousel-react`) for carousel components
- Use `src/components/ui/carousel.tsx` for pre-built carousel UI

### Theme
- Use `next-themes` for dark/light mode support if needed

## File Structure Rules

- **Pages**: All page components in `src/pages/`
- **Components**: Reusable components in `src/components/`
- **UI Components**: shadcn/ui components in `src/components/ui/` (do NOT edit)
- **Custom Components**: New custom components in `src/components/` with descriptive names
- **Layout Components**: Layout-related components in `src/components/layout/`
- **Hooks**: Custom hooks in `src/hooks/`
- **Lib**: Utility functions and helpers in `src/lib/`
- **Integrations**: Third-party integrations in `src/integrations/`

## Development Best Practices

1. **Keep components small and focused** - Single responsibility per component
2. **Use TypeScript for all new code** - Type everything possible
3. **Follow existing code patterns** - Match the style and structure of existing files
4. **Update `src/App.tsx`** - Always update the main page to include new components so they're visible
5. **Use semantic HTML** - Proper HTML5 elements for accessibility
6. **Make components responsive** - Use Tailwind's responsive modifiers (md:, lg:, etc.)
7. **Handle loading and error states** - Use TanStack Query's loading/error states or skeleton components
8. **Use existing hooks** - Check `src/hooks/` before creating new custom hooks
9. **Maintain consistency** - Use existing components and patterns over reinventing

## Important Notes

- All shadcn/ui components are already installed and ready to use
- Do NOT install new UI component libraries unless absolutely necessary
- Do NOT make partial implementations - all features must be fully functional
- Do NOT overengineer - keep solutions simple and elegant
- Always verify changes by reading the edited file after modifications
- Run type checks when working with TypeScript files
