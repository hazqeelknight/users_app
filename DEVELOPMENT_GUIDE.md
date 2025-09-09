# NovaMeet Frontend Development Guide

## 🎯 Module Assignment Overview

Each developer is assigned one backend module to implement the frontend for a calendly.com like platform called as NovaMeet with the following Moduled intotal :

1. **Users Module** - Authentication, profiles, team management, security
2. **Events Module** - Event types, bookings, analytics
3. **Availability Module** - Scheduling rules, overrides, blocked times
4. **Integrations Module** - Calendar, video, webhook integrations
5. **Notifications Module** - Templates, preferences, logs
6. **Contacts Module** - Contact management, groups, interactions
7. **Workflows Module** - Automation, templates, execution

## Each developer is given only one module to build frontend for.

## You will find your module in the backend directory in the codebase, first read the following instructions !.

## 📋 Developer Responsibilities

### Before You Start
1. **Study Your Module Comprehensively**: 
   - **Deep Dive Analysis**: Spend significant time studying your assigned backend module in extreme detail
   - **Complete Coverage**: Ensure you understand EVERY model, view, endpoint, serializer, task, signal, and utility function
   - **Business Logic Mastery**: Understand the complete business logic flow, edge cases, and error handling
   - **API Mapping**: Map out every single API endpoint and understand its purpose, parameters, and responses
   - **Data Relationships**: Understand how your module's models relate to other modules
   - **100% Utilization Goal**: Your frontend implementation must utilize 100% of your backend module's functionality - no endpoint, feature, or capability should be left unused
2. **Review the Design System**: Familiarize yourself with the established theme and components
3. **Understand the API**: Study the backend endpoints and data structures
4. **Plan Your Implementation**: Create a development plan for your module
5. **Document Integration Needs**: If you need integration with other modules' frontend components, document this in `src/[your-module]/notes.md`

### Development Standards

#### 0. Critical Rules
- **DO NOT EDIT OTHER MODULES**: You may only edit files within your assigned module directory (`src/[your-module]/`)
- **DO NOT MODIFY CORE FILES**: Never edit files in `src/components/core/`, `src/theme/`, `src/api/`, `src/store/`, `src/utils/`, or any other shared directories
- **INTEGRATION DOCUMENTATION**: If you need integration with other modules' frontend components, document your requirements in `src/[your-module]/notes.md` - do not implement cross-module integrations yourself
- **100% BACKEND COVERAGE**: Every single backend endpoint, model field, and feature in your module must have corresponding frontend implementation

#### 1. File Organization
```
src/[your-module]/
├── pages/                 # Top-level page components
├── components/            # Module-specific components
├── hooks/                 # Custom hooks for your module
├── api/                   # API service functions
├── types/                 # TypeScript type definitions
├── utils/                 # Module-specific utilities
├── assets/                # Module-specific assets
├── routes.tsx             # Module routing configuration
├── index.ts               # Module exports
└── notes.md               # Integration requirements and notes
```

#### 2. Backend Module Study Requirements
- **Model Analysis**: Understand every field, relationship, and method in your module's models
- **View Analysis**: Map every view function to a frontend page or component
- **Serializer Analysis**: Understand all data transformations and validation rules
- **Task Analysis**: Identify which async operations need frontend status tracking
- **Signal Analysis**: Understand what triggers automatic updates that might affect your UI
- **URL Analysis**: Map every endpoint to frontend functionality
- **Admin Analysis**: Study the admin interface to understand the full scope of management features needed
- **Test Analysis**: Review test files to understand edge cases and expected behaviors

#### 3. Complete Feature Coverage Checklist
For your assigned module, ensure you implement:
- [ ] **All CRUD Operations**: Every model that has Create, Read, Update, Delete operations
- [ ] **All List Views**: With proper filtering, sorting, and pagination
- [ ] **All Detail Views**: Complete information display and editing capabilities
- [ ] **All Custom Endpoints**: Special endpoints beyond basic CRUD
- [ ] **All Form Fields**: Every field from your models and serializers
- [ ] **All Validation Rules**: Frontend validation matching backend validation
- [ ] **All Status Indicators**: Visual representation of all status fields
- [ ] **All Relationships**: Proper handling of foreign keys and many-to-many relationships
- [ ] **All Async Operations**: Status tracking for background tasks
- [ ] **All Error States**: Proper error handling for every possible error condition
- [ ] **All Success States**: Confirmation and feedback for every successful operation
- [ ] **All Edge Cases**: Handle empty states, loading states, and error conditions

#### 2. Component Guidelines
- **Use Core Components**: Always use components from `@/components/core` when possible
- **Follow MUI Theme**: Use theme values for colors, spacing, typography
- **Add Animations**: Use Framer Motion for smooth interactions
- **Handle Loading States**: Show loading spinners during async operations
- **Error Handling**: Implement proper error boundaries and user feedback
- **Responsive Design**: Ensure components work on all screen sizes

#### 3. API Integration
- **Use TanStack Query**: All API calls should use React Query hooks
- **Follow Query Key Patterns**: Use the established query key factory
- **Handle Errors**: Implement proper error handling and user feedback
- **Cache Appropriately**: Set proper cache times and invalidation

#### 4. State Management
- **Local State First**: Use local state (`useState`, `useReducer`) when possible
- **Global State**: Only use global state for truly shared data
- **Form State**: Use React Hook Form for all forms

#### 5. TypeScript
- **Strict Types**: No `any` types allowed
- **Define Interfaces**: Create proper interfaces for your data
- **Export Types**: Make types available for other modules if needed

### 📝 Module-Specific Implementation Requirements

#### Backend Module Mapping
Each developer must create a comprehensive mapping document in their `notes.md` file that includes:

1. **Endpoint Mapping**: List every backend endpoint and its corresponding frontend implementation
2. **Model Field Mapping**: Map every model field to frontend form fields or display components
3. **Business Logic Mapping**: Document how complex backend logic is represented in the UI
4. **Integration Requirements**: Document any needs for integration with other modules' frontend components
5. **Missing Features**: If any backend feature cannot be implemented due to dependencies, document it clearly

#### Example notes.md Structure:
```markdown
# [Module Name] Frontend Implementation Notes

## Backend Coverage Analysis
### Models Implemented
- [ ] Model1: All fields implemented
- [ ] Model2: Missing field X (reason: requires integration with Y module)

### Endpoints Implemented
- [ ] GET /api/endpoint1/ → Component/Page
- [ ] POST /api/endpoint2/ → Form/Action

### Integration Requirements
- Need access to User profile data from users module
- Requires notification triggering from notifications module

### Implementation Challenges
- Complex workflow builder needs custom drag-drop component
- Real-time updates require WebSocket integration
```

### 🎨 Design System Usage

#### Colors
```typescript
// Use theme colors
sx={{ color: 'primary.main' }}
sx={{ backgroundColor: 'background.paper' }}
sx={{ borderColor: 'divider' }}
```

#### Spacing
```typescript
// Use consistent spacing (8px grid)
sx={{ p: 3 }}        // 24px padding
sx={{ m: 2 }}        // 16px margin
sx={{ gap: 1.5 }}    // 12px gap
```

#### Typography
```typescript
<Typography variant="h3">Page Title</Typography>
<Typography variant="body1" color="text.secondary">Description</Typography>
<Typography variant="overline">Label</Typography>
```

#### Animations
```typescript
// Page transitions
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>

// Hover effects
<motion.div
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
```

### 📝 Implementation Checklist

For each page/component you create:

- [ ] **Backend Mapping**: Corresponds to specific backend functionality
- [ ] **Complete Coverage**: Implements all related backend features
- [ ] Uses the established file structure
- [ ] Implements proper TypeScript types
- [ ] Uses core design system components
- [ ] Includes loading and error states
- [ ] Has responsive design
- [ ] Uses TanStack Query for API calls
- [ ] Follows the established patterns
- [ ] Includes smooth animations
- [ ] Has proper form validation
- [ ] Implements accessibility features
- [ ] **No File Conflicts**: Only edits files within assigned module directory
- [ ] **Integration Documented**: Any cross-module needs documented in notes.md

### 🔄 API Integration Patterns

#### Query Hook Example
```typescript
export const useEventTypes = () => {
  return useQuery({
    queryKey: queryKeys.events.eventTypes(),
    queryFn: async () => {
      const response = await api.get('/events/event-types/');
      return response.data;
    },
  });
};
```

#### Mutation Hook Example
```typescript
export const useCreateEventType = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateEventTypeData) => {
      const response = await api.post('/events/event-types/', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.eventTypes() });
      toast.success('Event type created successfully');
    },
  });
};
```

### 🎯 Module-Specific Guidelines

#### Users Module
- **Complete Backend Coverage**: Implement ALL user management features including:
  - Authentication flows (login, register, logout, password reset, email verification)
  - Profile management (display name, bio, timezone, branding, privacy settings)
  - Team features (invitations, role management, permissions)
  - Security features (MFA setup, session management, audit logs)
  - SSO integration UI (SAML, OIDC configuration and flows)
- Implement MFA setup and security features
- Handle SSO integration UI
- **Key Focus Areas**: Password policies, account status handling, role-based UI, session management

#### Events Module
- **Complete Backend Coverage**: Implement ALL event and booking features including:
  - Event type creation and management (all fields, custom questions, recurrence)
  - Booking management (CRUD, status changes, attendee management)
  - Public booking pages (organizer profiles, event type selection, slot booking)
  - Group event handling (attendees, waitlists, capacity management)
  - Booking analytics and reporting
  - Audit trail visualization
- Implement booking management interfaces
- Build comprehensive analytics dashboards
- **Key Focus Areas**: Public booking flow, group event UI, booking lifecycle management

#### Availability Module
- **Complete Backend Coverage**: Implement ALL availability management features including:
  - Availability rules (recurring weekly schedules with time ranges)
  - Date overrides (specific date availability changes)
  - Blocked times (one-off and recurring blocks)
  - Buffer time settings (before/after meetings, minimum gaps)
  - Availability statistics and analytics
  - Cache management interfaces
- Create timezone-aware time pickers
- Implement conflict detection UI
- **Key Focus Areas**: Visual schedule builder, timezone handling, conflict resolution

#### Integrations Module
- **Complete Backend Coverage**: Implement ALL integration features including:
  - Calendar integrations (Google, Outlook, Apple) with OAuth flows
  - Video conferencing integrations (Zoom, Google Meet, Teams, Webex)
  - Webhook configurations and testing
  - Integration health monitoring and logs
  - OAuth token management and refresh handling
  - Calendar conflict detection and resolution
- Create integration status dashboards
- Implement webhook testing interfaces
- **Key Focus Areas**: OAuth flows, integration health monitoring, conflict resolution

#### Notifications Module
- **Complete Backend Coverage**: Implement ALL notification features including:
  - Template management (email/SMS templates with placeholders)
  - Notification preferences (timing, DND, weekend exclusions)
  - Notification logs and delivery tracking
  - Scheduled notifications management
  - Manual notification sending
  - Notification statistics and health monitoring
- Create preference management interfaces
- Build notification analytics
- **Key Focus Areas**: Template editor with preview, preference management, delivery tracking

#### Contacts Module
- **Complete Backend Coverage**: Implement ALL contact features including:
  - Contact CRUD with all fields (personal, professional, notes, tags)
  - Contact groups and organization
  - Interaction history tracking
  - Contact statistics and analytics
  - Import/export functionality (CSV handling)
  - Contact merging and deduplication
- Create import/export functionality
- Build interaction tracking
- **Key Focus Areas**: Contact organization, import/export flows, interaction timeline

#### Workflows Module
- **Complete Backend Coverage**: Implement ALL workflow features including:
  - Workflow creation and management (triggers, delays, event type filtering)
  - Action configuration (email, SMS, webhook, booking updates)
  - Conditional logic builder (complex rule evaluation)
  - Workflow execution monitoring and logs
  - Template management and usage
  - Performance analytics and health monitoring
  - Workflow testing and validation
- Create condition editors
- Implement execution monitoring
- **Key Focus Areas**: Visual workflow builder, condition editor, execution monitoring

### 🚀 Getting Started

1. **Set up your development environment**
2. **Study your assigned backend module in extreme detail**
   - Read every line of code in your module
   - Understand every model field and its purpose
   - Map every endpoint to required frontend functionality
   - Understand all business logic and edge cases
   - Document your findings in your module's notes.md
3. **Create your module's basic structure**
4. **Start with the overview page**
5. **Implement core functionality progressively**
6. **Ensure 100% backend feature coverage**
6. **Test thoroughly across different screen sizes**
7. **Ensure accessibility compliance**
8. **Document any cross-module integration needs**

### 📞 Communication

- **Daily Standups**: Share progress and blockers
- **Code Reviews**: Review each other's code for consistency
- **Design Reviews**: Ensure UI consistency across modules
- **Integration Testing**: Test cross-module interactions
- **Backend Coverage Reviews**: Verify 100% backend feature implementation
- **Integration Coordination**: Coordinate cross-module frontend integrations

Remember: You're building an enterprise-grade platform. Focus on quality, consistency, user experience, and COMPLETE backend feature coverage. Every backend capability must have a corresponding frontend implementation!