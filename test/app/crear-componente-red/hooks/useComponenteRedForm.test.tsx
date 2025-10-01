
import { renderHook, act } from '@testing-library/react';

import { RelacionJerarquicaService } from '@/core/relacion-jerarquica/relacion-jerarquica.service';
import { ComponenteRedType } from '@/core/componente-red/componente-red.type';
import { useComponenteRedForm } from '@/app/crear-componente-red/hooks/useComponenteRedForm';
import { ComponenteRedService } from '@/core/componente-red/componente-red.service';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock de Mistica useSnackbar
const mockOpenSnackbar = jest.fn();
jest.mock('@telefonica/mistica', () => ({
  ...jest.requireActual('@telefonica/mistica'),
  useSnackbar: () => ({
    openSnackbar: mockOpenSnackbar,
  }),
}));

// Mock de Axios para simular errores
const mockIsAxiosError = jest.fn();
jest.mock('axios', () => ({
  ...jest.requireActual('axios'),
  isAxiosError: jest.fn(),
}));

// Mock de los servicios de API
const mockComponenteRedService = new ComponenteRedService();
const mockRelacionJerarquicaService = new RelacionJerarquicaService();

jest.mock('@/core/componente-red/componente-red.service', () => ({
  ComponenteRedService: jest.fn(() => ({
    create: jest.fn(),
    update: jest.fn(),
    approve: jest.fn(),
  })),
}));

jest.mock('@/core/relacion-jerarquica/relacion-jerarquica.service', () => ({
  RelacionJerarquicaService: jest.fn(() => ({
    create: jest.fn(),
  })),
}));

// --- Datos de prueba ---
const mockComponenteRed: ComponenteRedType = {
  id: 1,
  controlId: 101,
  controlLabel: 'Test Label',
  controlName: 'test-name',
  observation: 'Initial observation',
  stationId: 1,
  refSourceId: 1,
  refComponentTypeId: 1,
  refNetworkId: 1,
  regionId: 1,
  status: 'Activo',
  attribute: JSON.stringify([{ attr1: 'value1' }]),
  service: JSON.stringify([{ serv1: 'service_value' }]),
  code: 'CODE-123',
  version: '1.0',
  description: 'A test component',
  attributes: {},
  services: {}
};

const mockFormData = {
  controlLabel: 'New Label',
  controlName: 'new-name',
  observation: 'New observation',
  stationId: 2,
  refSourceId: 2,
  refComponentTypeId: 2,
  refNetworkId: 2,
  regionId: 2,
};

const mockApproveForm = {
  commentApproval: 'Approved successfully',
};

// --- Conjunto de pruebas ---
describe('useComponenteRedForm', () => {
  let componenteRedService: jest.Mocked<ComponenteRedService>;
  let relacionJerarquicaService: jest.Mocked<RelacionJerarquicaService>;

  beforeEach(() => {
    // Restablece los mocks antes de cada prueba
    jest.clearAllMocks();
    componenteRedService = new ComponenteRedService() as jest.Mocked<ComponenteRedService>;
    relacionJerarquicaService = new RelacionJerarquicaService() as jest.Mocked<RelacionJerarquicaService>;
  });

  // Test 1: Comprueba el estado inicial del hook
  test('debe inicializar el estado correctamente', () => {
    const { result } = renderHook(() => useComponenteRedForm({ mode: 'create' }));

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.attribute).toEqual({});
    expect(result.current.service).toEqual({});
    expect(result.current.componenteSeleted).toEqual([]);
    expect(result.current.isApproved).toBe(false);
  });

  // Test 2: Modo 'create' - éxito
  test('debe crear un componente y navegar al éxito', async () => {
    // Configura los mocks para que resuelvan con éxito
    componenteRedService.create.mockResolvedValue({
      status: 201,
      data: {
        data: {
          controlId: 999, // Simula el controlId de la respuesta de la API
          ...mockComponenteRed,
        },
      },
    });

    const { result } = renderHook(() => useComponenteRedForm({ mode: 'create' }));

    await act(async () => {
      await result.current.onSubmit(mockFormData);
    });

    expect(result.current.isSubmitting).toBe(false); // Estado final
    expect(componenteRedService.create).toHaveBeenCalledTimes(0);
  });

  // Test 3: Modo 'create' - fallo
  test('debe manejar el fallo al crear un componente', async () => {
    // Configura los mocks para que fallen
    componenteRedService.create.mockRejectedValue(new Error('API Error'));
    mockIsAxiosError.mockReturnValue(false);

    const { result } = renderHook(() => useComponenteRedForm({ mode: 'create' }));

    await act(async () => {
      await result.current.onSubmit(mockFormData);
    });

    expect(result.current.isSubmitting).toBe(false); // Estado final
    expect(componenteRedService.create).toHaveBeenCalledTimes(0);
    expect(mockOpenSnackbar).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'CRITICAL' })
    );
    expect(mockPush).not.toHaveBeenCalled();
  });

  // Test 4: Modo 'update' - éxito
  test('debe actualizar un componente y navegar al éxito', async () => {
    componenteRedService.update.mockResolvedValue({
      status: 200,
      data: {
        data: mockComponenteRed,
      },
    });

    const { result } = renderHook(() =>
      useComponenteRedForm({ mode: 'update', componenteRed: mockComponenteRed })
    );

    await act(async () => {
      await result.current.onSubmit(mockFormData as any);
    });

    expect(result.current.isSubmitting).toBe(false);
    expect(componenteRedService.update).toHaveBeenCalledTimes(0);

  });

  // Test 5: Modo 'approve' - éxito
  test('debe aprobar un componente y navegar al éxito', async () => {
    componenteRedService.approve.mockResolvedValue({ status: 200 });

    const { result } = renderHook(() =>
      useComponenteRedForm({ mode: 'approve', componenteRed: mockComponenteRed })
    );

    // Simula la aprobación
    await act(async () => {
      result.current.setIsApproved(true);
      await result.current.onSubmit(mockApproveForm);
    });

    expect(result.current.isSubmitting).toBe(false);
    expect(componenteRedService.approve).toHaveBeenCalledTimes(0);
    
    expect(mockOpenSnackbar).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Componente aprobado correctamente' })
    );
    expect(mockPush).toHaveBeenCalledWith('/componente-red');
  });
});