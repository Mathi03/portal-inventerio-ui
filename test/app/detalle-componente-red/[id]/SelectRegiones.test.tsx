// @jest-environment jsdom

import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { msDirecciones } from '@/core/config';
import SelectRegiones from '@/app/detalle-componente-red/[id]/SelectRegiones';

// 1. Mock the Axios instance (msDirecciones)
// We need to mock the `.get()` method and control its resolved or rejected value.
jest.mock('@/core/config', () => ({
  msDirecciones: {
    get: jest.fn(),
  },
}));

// 2. Mock the child Select component
// This isolates the test to the logic of SelectRegiones.
jest.mock('@/components/Select', () => {
  return function MockSelect({ disabled, name, label, options, helperText }: any) {
    return (
      <div data-testid="mock-select" data-disabled={disabled}>
        <span>{label}</span>
        <span>{helperText}</span>
        {options.map((option: any) => (
          <div key={option.value} data-testid="mock-option">
            {option.text}
          </div>
        ))}
      </div>
    );
  };
});

describe('SelectRegiones Component', () => {
  
  // Define mock data for the happy path
  const mockRegionesData = {
    data: {
      data: {
        regiones: [
          { id: 10, nombre: 'Región Norte' },
          { id: 20, nombre: 'Región Sur' },
        ],
      },
    },
  };

  // Test Case 1: Renders the loading state and then fetched data
  it('should display a loading message and then render the fetched regions', async () => {
    // Configure the mock to simulate a successful API call
    (msDirecciones.get as jest.Mock).mockResolvedValue(mockRegionesData);

    render(<SelectRegiones name="regiones" />);

    // Initial state: The select should be disabled and show the loading message.
    const selectComponent = screen.getByTestId('mock-select');
    expect(selectComponent).toHaveAttribute('data-disabled', 'true');
    expect(screen.getByText('cargando regiones...')).toBeInTheDocument();

    // Wait for the asynchronous API call to complete
    await waitFor(() => {
      // After data is loaded:
      // The select should no longer be disabled.
      expect(selectComponent).toHaveAttribute('data-disabled', 'false');
      // The loading message should be gone.
      expect(screen.queryByText('cargando regiones...')).not.toBeInTheDocument();

      // The correct options should be rendered based on the mock data.
      expect(screen.getByText('Región Norte')).toBeInTheDocument();
      expect(screen.getByText('Región Sur')).toBeInTheDocument();
    });

    // Verify that the get method was called correctly
    expect(msDirecciones.get).toHaveBeenCalledTimes(1);
    expect(msDirecciones.get).toHaveBeenCalledWith(
      '/api/v1/direcciones/regiones',
      expect.objectContaining({ timeout: 2000 })
    );
  });

  // Test Case 2: Handles a failed API call gracefully
  it('should handle API errors and fall back to default data', async () => {
    // Configure the mock to simulate an API error
    (msDirecciones.get as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

    render(<SelectRegiones name="regiones" />);

    // Wait for the asynchronous call (and the error) to complete
    await waitFor(() => {
      // The select should be disabled initially, then become enabled
      expect(screen.getByTestId('mock-select')).toHaveAttribute('data-disabled', 'false');
      // The loading message should be gone
      expect(screen.queryByText('cargando regiones...')).not.toBeInTheDocument();

      // The fallback data should be rendered.
      expect(screen.getByText('Gran Caracas')).toBeInTheDocument();
      expect(screen.queryByText('Región Norte')).not.toBeInTheDocument();
    });

    // Verify the API call was made
    expect(msDirecciones.get).toHaveBeenCalledTimes(2);
  });

  // Test Case 3: Handles a successful call but with no data
  it('should render an empty list if no regions are returned in the API response', async () => {
    // Configure the mock to return an empty array
    (msDirecciones.get as jest.Mock).mockResolvedValue({
      data: {
        data: {
          regiones: [],
        },
      },
    });

    render(<SelectRegiones name="regiones" />);

    await waitFor(() => {
      // The select should be enabled
      expect(screen.getByTestId('mock-select')).toHaveAttribute('data-disabled', 'false');
      // No options should be rendered
      expect(screen.queryByTestId('mock-option')).not.toBeInTheDocument();
    });
  });
});