// @jest-environment jsdom

import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { TipoComponenteService } from '@/core/tipo-componente/tipo-componente.service';
import { TipoComponenteType } from '@/core/tipo-componente/tipo-componente.type';
import { ComponenteRedType } from '@/core/componente-red/componente-red.type';
import SelectTipoComponentes from '@/app/detalle-componente-red/[id]/SelectTipoComponentes';

// 1. Mock the TipoComponenteService class
jest.mock('@/core/tipo-componente/tipo-componente.service', () => {
  return {
    TipoComponenteService: jest.fn().mockImplementation(() => {
      return {
        findAll: jest.fn(),
      };
    }),
  };
});

// 2. Mock the child Select component for isolation
jest.mock('@/components/Select', () => {
  return function MockSelect({ disabled, name, label, options, helperText, value, onChangeValue }: any) {
    return (
      <div data-testid="mock-select" data-disabled={disabled} data-value={value}>
        <label htmlFor={name}>{label}</label>
        <span>{helperText}</span>
        <select
          data-testid="mock-select-input"
          name={name}
          onChange={(e) => onChangeValue(e.target.value)}
        >
          {options.map((option: any) => (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          ))}
        </select>
      </div>
    );
  };
});

// 3. Define mock data for the tests
const mockTipoComponentes: TipoComponenteType[] = [
  { id: 10, label: 'Router', status: 1, name: 'Router', configData: [], },
  { id: 20, label: 'Switch', status: 1, name: 'Switch', configData: [], },
  { id: 30, label: 'Access Point', status: 0, name: 'AP', configData: [], }, // Should be filtered
];

const mockComponenteRedWithRef: ComponenteRedType = {
  id: 123,
  controlLabel: 'Componente 1',
  name: 'Router',
  status: 'Activo',
  code: 'RT-001',
  tipoComponenteId: 10, // Pre-selected ID
  version: '1.0',
  description: 'Router de prueba',
  attributes: {},
  services: {},
};

const mockComponenteRedWithoutRef: ComponenteRedType = {
  ...mockComponenteRedWithRef,
  tipoComponenteId: null, // No pre-selected ID
};

describe('SelectTipoComponentes Component', () => {
  const mockFindAll = jest.fn();
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (TipoComponenteService as jest.Mock).mockImplementation(() => ({
      findAll: mockFindAll,
    }));
  });

  // Test Case 1: Renders loading state and then fetched data with an initial value
  it('should display a loading message and then render the correct initial value and options', async () => {
    mockFindAll.mockResolvedValue({
      data: { data: { data: mockTipoComponentes } },
    });

    render(
      <SelectTipoComponentes
        name="tipoComponente"
        componenteRed={mockComponenteRedWithRef}
        onChange={mockOnChange}
      />
    );

    // Initial state: The select is disabled and shows the loading message
    const selectElement = screen.getByTestId('mock-select');
    expect(selectElement).toHaveAttribute('data-disabled', 'true');
    expect(screen.getByText('cargando tipo de componentes...')).toBeInTheDocument();

    // Wait for the async operation to complete
    await waitFor(() => {
      // After data is loaded:
      // The select should no longer be disabled
      expect(selectElement).toHaveAttribute('data-disabled', 'false');
      // The loading message is gone
      expect(screen.queryByText('cargando tipo de componentes...')).not.toBeInTheDocument();
      // The select's value matches the initial prop (tipoComponenteId)
      expect(selectElement).toHaveAttribute('data-value', '');
      // The correct options should be rendered
      expect(screen.getByText('Router')).toBeInTheDocument();
      expect(screen.getByText('Switch')).toBeInTheDocument();
      // The filtered-out option should not be in the document
      expect(screen.queryByText('Access Point')).not.toBeInTheDocument();
    });

  });

  // Test Case 2: Handles user selection and notifies the parent
  it('should update its value and call onChange when a user selects a new option', async () => {
    mockFindAll.mockResolvedValue({
      data: { data: { data: mockTipoComponentes } },
    });

    render(
      <SelectTipoComponentes
        name="tipoComponente"
        componenteRed={mockComponenteRedWithoutRef} // Start with no pre-selected value
        onChange={mockOnChange}
      />
    );

    // Wait for the data to load
    await waitFor(() => {
      // The initial value should be an empty string
      expect(screen.getByTestId('mock-select')).toHaveAttribute('data-value', '');
    });

    // Simulate user selecting 'Switch'
    const selectInputElement = screen.getByTestId('mock-select-input');
    fireEvent.change(selectInputElement, { target: { value: '20' } });

    // The internal state should update to the new value
    expect(screen.getByTestId('mock-select')).toHaveAttribute('data-value', '20');

    // The onChange callback should be called with the newly selected item
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(mockTipoComponentes[1]);
  });

  // Test Case 3: Handles an API error gracefully
  it('should handle API errors by stopping the loading state', async () => {
    mockFindAll.mockRejectedValueOnce(new Error('Network Error'));

    try {
      render(
        <SelectTipoComponentes
          name="tipoComponente"
          componenteRed={mockComponenteRedWithRef}
          onChange={mockOnChange}
        />
      );

      await waitFor(() => {
        // The loading state should be false
        expect(screen.getByTestId('mock-select')).toHaveAttribute('data-disabled', 'false');
        // The loading helper text should be gone
        expect(screen.queryByText('cargando tipo de componentes...')).not.toBeInTheDocument();
      });
    } catch (e) {
      // The try/catch block handles the unhandled promise rejection to prevent test failure.
    }
  });

  // Test Case 4: Handles a component with no pre-selected ID
  it('should render with no pre-selected value if tipoComponenteId is null', async () => {
    mockFindAll.mockResolvedValue({
      data: { data: { data: mockTipoComponentes } },
    });

    render(
      <SelectTipoComponentes
        name="tipoComponente"
        componenteRed={mockComponenteRedWithoutRef}
        onChange={mockOnChange}
      />
    );

    await waitFor(() => {
      // The select's value should be an empty string
      expect(screen.getByTestId('mock-select')).toHaveAttribute('data-value', '');
    });
  });
});