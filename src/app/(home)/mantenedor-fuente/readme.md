# MantenedorFuentePage Technical Documentation

## Overview

`MantenedorFuentePage` is a React client component that implements a data management interface for "Fuentes" (Sources). It provides CRUD operations through a table interface with filtering, pagination, and column customization capabilities.

## Key Features

- Data table with sortable columns
- Search functionality
- Column visibility toggling
- Export to XLS
- Filtering system
- Create/Edit/Delete operations
- Pagination
- Persistent column preferences

## Technical Specifications

### State Management

The component uses several React hooks to manage its state:

- search: string | null // Search query
- openFilter: boolean // Filter panel visibility
- openCreate: boolean // Create modal visibility
- openEdit: boolean // Edit modal visibility
- page: number // Current page number
- items: number // Total number of items
- limit: number // Items per page
- fuentes: FuenteType[] // Data array
- selectedFuente: FuenteType | null // Selected item for editing

### Dependencies

- @telefonica/mistica: For UI components (Dialog, Snackbar, Tag)
- Custom components:
  - Table
  - Filter
  - Button
  - Icon
  - InputSearch
  - ExportXLS
  - ShowColumns
  - Pagination
  - MenuList
  - Create/Edit modals

### API Integration

Uses `FuenteService` for backend communication with the following operations:

- `findAll`: Fetches paginated data with optional search
- `delete`: Removes a source entry

### Table Columns

The table displays the following columns (configurable visibility):

1. ID
2. Label
3. Name
4. Component Type
5. Network
6. Version
7. Status
8. Actions Menu

### Storage

Uses custom `useStorage` hook to persist column visibility preferences with key "filtro-mantenedor-fuente"

### User Interactions

1. **Search**: Real-time filtering of data
2. **Filtering**: Toggle-able side panel for advanced filters
3. **Column Management**: Show/hide columns
4. **CRUD Operations**:
   - Create: Opens modal form
   - Edit: Opens pre-filled modal form
   - Delete: Shows confirmation dialog
5. **Pagination**: Change page and items per page

### Error Handling

- Uses snackbar notifications for operation feedback
- Confirmation dialogs for destructive actions

## Usage Example

## env

```tsx
import MantenedorFuentePage from "./MantenedorFuentePage";
// Inside a React component:
<MantenedorFuentePage />;
```
