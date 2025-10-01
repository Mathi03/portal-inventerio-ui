// test/app/detalle-componente-red/RelacionJerarquica.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { ComponenteRedType } from '@/core/componente-red/componente-red.type';
import { RedType } from '@/core/red/red.type';
import RelacionJerarquica from '@/app/detalle-componente-red/Relatcion-jerarquica';

// Mock del servicio para evitar llamadas reales
jest.mock('@/core/componente-red/componente-red.service', () => {
  return {
    ComponenteRedService: jest.fn().mockImplementation(() => ({
      findAll: async () => ({
        data: {
          data: {
            data: [
              { id: '1', name: 'Comp A', label: 'Etiqueta A' },
              { id: '2', name: 'Comp B', label: 'Etiqueta B' },
            ],
          },
        },
      }),
    })),
  };
});

// Mock de Mistica Checkbox
jest.mock('@telefonica/mistica', () => ({
  Checkbox: ({ defaultChecked, onChange }: any) => (
    <input
      type="checkbox"
      defaultChecked={defaultChecked}
      onChange={(e) => onChange(e.target.checked)}
      data-testid="mock-checkbox"
    />
  ),
}));

jest.mock('@/components/Table/TLoading', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-loading">Loading...</div>,
}));

describe('RelacionJerarquica', () => {
  const mockComponenteRed: ComponenteRedType = {
    id: 'parent-id',
    name: 'Padre',
    label: 'Etiqueta Padre',
    relations: {
      parents: {
        data: [{ id: '1' }],
      },
    },
  };

  const mockRed: RedType = {
    id: 'red-123',
    name: 'Red Principal',
  };

  it('renders RelacionJerarquica table with fetched rows', async () => {
    render(
      <RelacionJerarquica
        componenteRed={mockComponenteRed}
        red={mockRed}
        onSelected={jest.fn()}
        onDeselected={jest.fn()}
      />
    );

    // Esperamos a que se carguen los datos
    await waitFor(() => {
      expect(screen.getByText('Comp A')).toBeInTheDocument();
      expect(screen.getByText('Comp B')).toBeInTheDocument();
    });

    // Verificamos que los títulos de columna estén presentes
    expect(screen.getByText('id')).toBeInTheDocument();
    expect(screen.getByText('Nombre')).toBeInTheDocument();
    expect(screen.getByText('Etiqueta')).toBeInTheDocument();

    // Verificamos que el checkbox mock esté presente
    expect(screen.getAllByTestId('mock-checkbox')).toHaveLength(2);
  });
});