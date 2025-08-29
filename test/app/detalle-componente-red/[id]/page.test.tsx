// @jest-environment jsdom
// This directive ensures Jest runs in a browser-like environment

import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { ComponenteRedService } from '@/core/componente-red/componente-red.service';
import { ComponenteRedType } from '@/core/componente-red/componente-red.type';
import DetalleComponenteRed from '@/app/detalle-componente-red/[id]/page';

// 1. Mocking Next.js hooks
// We need to mock useParams to control the `id` value.
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}));

// 2. Mocking application-specific components and services
// We mock the service to prevent real API calls and provide controlled data.
// We also mock child components to simplify the test and focus on the parent's logic.
jest.mock('@/core/componente-red/componente-red.service');



jest.mock('@/app/detalle-componente-red/[id]/Header', () => {
  return function MockHeader(props: any) {
    return <div data-testid="mock-header">{JSON.stringify(props.componenteRed)}</div>;
  };
});

jest.mock('@/app/detalle-componente-red/[id]/NavMenu', () => {
  return function MockNavMenu() {
    return <nav data-testid="mock-nav-menu">NavMenu</nav>;
  };
});

jest.mock('@/app/crear-componente-red/CreateForm', () => {
  return function MockCreateForm(props: any) {
    return <div data-testid="mock-create-form">{JSON.stringify(props.componenteRed)}</div>;
  };
});

describe('DetalleComponenteRed Component', () => {
  
  // Test data for the happy path
  const mockComponenteRed: ComponenteRedType = {
    id: 123,
    controlLabel: 'Router-001',
    name: 'Router',
    status: 'Activo',
    code: 'RT-001',
    tipoComponenteId: 1,
    version: '1.0',
    description: 'Router de prueba',
    attributes: {},
    services: {},
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  // Test Case 1: Renders correctly with data from the service
  it('renders Header, NavMenu, and CreateForm with fetched data', async () => {
    // Configure the mocks before rendering
    require('next/navigation').useParams.mockReturnValue({ id: '123' });
    ComponenteRedService.prototype.getById = jest.fn().mockResolvedValue(mockComponenteRed);

    render(<DetalleComponenteRed />);

    // Initially, the state is null, so Header and CreateForm will receive a null prop.
    // The component is loading, so we can check for an initial state if needed.
    // We'll skip this to focus on the loaded state.

    // Use `waitFor` to wait for the asynchronous data fetching to complete.
    await waitFor(() => {
      // After the data is fetched and the state is updated, the children should receive the data.
      const headerMock = screen.getByTestId('mock-header');
      expect(headerMock).toHaveTextContent(JSON.stringify(mockComponenteRed));
      
      const createFormMock = screen.getByTestId('mock-create-form');
      expect(createFormMock).toHaveTextContent(JSON.stringify(mockComponenteRed));

      // NavMenu doesn't depend on `componenteRed`, so it should always be there.
      expect(screen.getByTestId('mock-nav-menu')).toBeInTheDocument();
    });

    // Verify that the service was called correctly with the ID from the URL.
    expect(ComponenteRedService.prototype.getById).toHaveBeenCalledTimes(1);
    expect(ComponenteRedService.prototype.getById).toHaveBeenCalledWith(123);
  });

  // Test Case 2: Renders correctly when data is null (e.g., ID not found)
  it('handles null data gracefully', async () => {
    // Configure the mocks for a null data scenario
    require('next/navigation').useParams.mockReturnValue({ id: '999' });
    ComponenteRedService.prototype.getById = jest.fn().mockResolvedValue(null);

    render(<DetalleComponenteRed />);

    await waitFor(() => {
      // The `Header` component should render with a null prop.
      expect(screen.getByTestId('mock-header')).toHaveTextContent('null');
      
      // The `CreateForm` component should not be in the document because of the conditional rendering.
      expect(screen.queryByTestId('mock-create-form')).not.toBeInTheDocument();
      
      // NavMenu should still render.
      expect(screen.getByTestId('mock-nav-menu')).toBeInTheDocument();
    });
    
    // Verify that the service was called with the correct ID.
    expect(ComponenteRedService.prototype.getById).toHaveBeenCalledWith(999);
  });
});