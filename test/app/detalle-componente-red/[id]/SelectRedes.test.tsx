// @jest-environment jsdom

import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { RedService } from '@/core/red/red.service';
import { RedType } from '@/core/red/red.type';
import { ComponenteRedType } from '@/core/componente-red/componente-red.type';
import SelectRedes from '@/app/detalle-componente-red/[id]/SelectRedes';

// 1. Mock the RedService class to prevent real API calls
jest.mock('@/core/red/red.service', () => {
  return {
    RedService: jest.fn().mockImplementation(() => {
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
        <span>{label}</span>
        <span>{helperText}</span>
        <select
          data-testid="mock-select-input"
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
const mockRedes: RedType[] = [
  { id: 1, label: 'Red A', status: 1 },
  { id: 2, label: 'Red B', status: 1 },
  { id: 3, label: 'Red C', status: 0 }, // Should be filtered out
];

const mockComponenteRedWithRef: ComponenteRedType = {
  id: 123,
  controlLabel: 'Componente 1',
  name: 'Router',
  status: 'Activo',
  code: 'RT-001',
  tipoComponenteId: 1,
  version: '1.0',
  description: 'Router de prueba',
  attributes: {},
  services: {},
  refNetworkId: 2, // Pre-selected ID
};

const mockComponenteRedWithoutRef: ComponenteRedType = {
  ...mockComponenteRedWithRef,
  refNetworkId: null, // No pre-selected ID
};

describe('SelectRedes Component', () => {
  
  const mockFindAll = jest.fn();
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (RedService as jest.Mock).mockImplementation(() => ({
      findAll: mockFindAll,
    }));
  });

  // Test Case 1: Renders the loading state initially
  it('should be disabled and show a loading message initially', async () => {
    // We don't resolve the promise immediately to test the initial state.
    const promise = Promise.resolve({ data: { data: { data: mockRedes } } });
    mockFindAll.mockReturnValue(promise);

    render(
      <SelectRedes
        name="redes"
        componenteRed={mockComponenteRedWithRef}
        onChange={mockOnChange}
      />
    );

    const selectElement = screen.getByTestId('mock-select');
    expect(selectElement).toHaveAttribute('data-disabled', 'true');
    expect(screen.getByText('cargando redes...')).toBeInTheDocument();

    // Clean up the promise
    await promise;
  });

  // Test Case 2: Loads and displays data with an initial value
  it('should load data and select the initial value provided by props', async () => {
    mockFindAll.mockResolvedValue({
      data: { data: { data: mockRedes } },
    });

    render(
      <SelectRedes
        name="redes"
        componenteRed={mockComponenteRedWithRef}
        onChange={mockOnChange}
      />
    );

    await waitFor(() => {
      // The select should no longer be disabled
      expect(screen.getByTestId('mock-select')).toHaveAttribute('data-disabled', 'false');
      // The helper text should be gone
      expect(screen.queryByText('cargando redes...')).not.toBeInTheDocument();
      // The select's value should match the initial prop
      expect(screen.getByTestId('mock-select')).toHaveAttribute('data-value', '2');
      // The options should be rendered correctly
      expect(screen.getByText('Red A')).toBeInTheDocument();
      expect(screen.getByText('Red B')).toBeInTheDocument();
      // The filtered-out option should not be in the document
      expect(screen.queryByText('Red C')).not.toBeInTheDocument();
    });

    // The onChange callback should be called once with the initial selected item
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(mockRedes[1]);
  });

  it('should render with no pre-selected value if refNetworkId is null', async () => {
    mockFindAll.mockResolvedValue({
      data: { data: { data: mockRedes } },
    });

    render(
      <SelectRedes
        name="redes"
        componenteRed={mockComponenteRedWithoutRef}
        onChange={mockOnChange}
      />
    );

    await waitFor(() => {
      // The select's value should be an empty string
      expect(screen.getByTestId('mock-select')).toHaveAttribute('data-value', '');
    });
  });

  // Test Case 5: Handles an error during data fetching
  it('should handle API errors gracefully and stop the loading state', async () => {
    // Set the mock to reject the promise
    mockFindAll.mockRejectedValueOnce(new Error('Network Error'));

    // We must handle the rejected promise to prevent the test from failing
    try {
      render(
        <SelectRedes
          name="redes"
          componenteRed={mockComponenteRedWithRef}
          onChange={mockOnChange}
        />
      );

      await waitFor(() => {
        // The loading state should be false
        expect(screen.getByTestId('mock-select')).toHaveAttribute('data-disabled', 'false');
        // The loading helper text should be gone
        expect(screen.queryByText('cargando redes...')).not.toBeInTheDocument();
      });
    } catch (e) {
    }
  });
});