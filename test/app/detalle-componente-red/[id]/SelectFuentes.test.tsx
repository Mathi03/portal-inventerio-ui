// @jest-environment jsdom
// This sets up a simulated browser environment for the test

import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { FuenteService } from '@/core/fuente/fuente.service';
import SelectFuentes from '@/app/detalle-componente-red/[id]/SelectFuentes';

// 1. Mock the entire FuenteService class
// We replace the real class with a mock implementation.
jest.mock('@/core/fuente/fuente.service', () => {
  return {
    FuenteService: jest.fn().mockImplementation(() => {
      return {
        findAll: jest.fn(),
      };
    }),
  };
});

// 2. Mock the child component
// This isolates our test to the logic of SelectFuentes itself.
jest.mock('@/components/Select', () => {
  // Return a mock component that displays its props for easy assertion.
  return function MockSelect({ disabled, name, label, options, helperText, fullWidth }: any) {
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

// 3. Define a mock service instance and test data
const mockFindAll = jest.fn();
const mockFuentes = [
  { id: 1, label: 'Fuente A', status: 1 },
  { id: 2, label: 'Fuente B', status: 1 },
  { id: 3, label: 'Fuente C', status: 0 }, // This should be filtered out
];

describe('SelectFuentes Component', () => {

  // Before each test, set up the mock service to return the mock data.
  beforeEach(() => {
    // The mock implementation of FuenteService has an findAll method we can mock.
    (FuenteService as jest.Mock).mockImplementationOnce(() => ({
      findAll: mockFindAll,
    }));
  });

  // Test Case 1: Renders loading state initially and then the fetched data
  it('should display a loading message and then render the options after fetching', async () => {
    // Set the mock to resolve with our test data.
    mockFindAll.mockResolvedValueOnce({
      data: { data: { data: mockFuentes } },
    });

    render(<SelectFuentes name="fuente" />);

    // Initial state: The select should be disabled and show the loading message.
    const selectComponent = screen.getByTestId('mock-select');
    expect(selectComponent).toHaveAttribute('data-disabled', 'true');
    expect(screen.getByText('cargando fuentes...')).toBeInTheDocument();

    // Wait for the async operation to complete and the component to re-render.
    await waitFor(() => {
      // After data is loaded:
      // - The select should no longer be disabled.
      expect(selectComponent).toHaveAttribute('data-disabled', 'false');
      // - The loading message should be gone.
      expect(screen.queryByText('cargando fuentes...')).not.toBeInTheDocument();

      // - The correct options should be rendered.
      expect(screen.getByText('Fuente A')).toBeInTheDocument();
      expect(screen.getByText('Fuente B')).toBeInTheDocument();
      // - The filtered-out option should NOT be in the document.
      expect(screen.queryByText('Fuente C')).not.toBeInTheDocument();
    });

    // Verify that the findAll method was called exactly once.
    expect(mockFindAll).toHaveBeenCalledTimes(1);
    expect(mockFindAll).toHaveBeenCalledWith({});
  });

  // Test Case 2: Handles an empty data response gracefully
  it('should render an empty select if no active sources are returned', async () => {
    // Set the mock to return an empty array for data.
    mockFindAll.mockResolvedValueOnce({
      data: { data: { data: [] } },
    });

    render(<SelectFuentes name="fuente" />);

    // Wait for the async operation to complete.
    await waitFor(() => {
      // No options should be rendered.
      expect(screen.queryAllByTestId('mock-option')).toHaveLength(0);
      expect(screen.queryByText('cargando fuentes...')).not.toBeInTheDocument();
    });
  });

});