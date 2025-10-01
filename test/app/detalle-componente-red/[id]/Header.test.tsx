// @jest-environment jsdom
// Esto asegura que Jest use un entorno de navegador para las pruebas

import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponenteRedType } from '@/core/componente-red/componente-red.type';
import Header from '@/app/detalle-componente-red/[id]/Header';

// 1. Mock de los módulos y hooks de Next.js
// Esto es crucial porque los componentes de Next.js necesitan un entorno especial.
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// 2. Mock de los componentes hijos
// Para simplificar las pruebas, reemplazamos los componentes hijos por mocks.
jest.mock('@/components/IconButton', () => {
  return function MockIconButton(props: any) {
    // Usamos data-testid para encontrar el componente en el DOM de prueba.
    return (
      <button data-testid={`icon-button-${props.icon}`} onClick={props.onClick}>
        {props.icon}
      </button>
    );
  };
});

// Mock del componente Avatar de Mistica
jest.mock('@telefonica/mistica', () => ({
  ...jest.requireActual('@telefonica/mistica'),
  Avatar: (props: any) => <div data-testid="mistica-avatar">{props.initials}</div>,
}));

// 3. Definir los datos de prueba
const mockComponenteRed: ComponenteRedType = {
  id: 1,
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

describe('Header Component', () => {
  // 4. Prueba del "Happy Path" de renderizado
  it('renders correctly with the provided data', () => {
    // Renderizamos el componente con los datos de prueba
    render(<Header componenteRed={mockComponenteRed} />);

    // Verificamos que el título del componente se muestre correctamente.
    // Usamos un regex para ser menos sensibles a los espacios o guiones.
   expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Router-001 - (1) - ()');

    // Verificamos que la imagen del logo se muestre.
    expect(screen.getByRole('img', { name: /telefonica/i })).toBeInTheDocument();

    // Verificamos que los iconos se rendericen correctamente usando sus data-testid
    expect(screen.getByTestId('icon-button-arrow_back_ios')).toBeInTheDocument();
    expect(screen.getByTestId('icon-button-notifications_unread')).toBeInTheDocument();

    // Verificamos que el Avatar se renderice con las iniciales correctas.
    expect(screen.getByTestId('mistica-avatar')).toHaveTextContent('RM');
  });

  // 5. Prueba de la funcionalidad de navegación
  it('navigates to the correct path when the back button is clicked', () => {
    // Renderizamos el componente
    render(<Header componenteRed={mockComponenteRed} />);

    // Obtenemos el botón de "volver atrás" por su data-testid
    const backButton = screen.getByTestId('icon-button-arrow_back_ios');
    
    // Simulamos un clic en el botón
    fireEvent.click(backButton);

    // Verificamos que la función 'push' del mock de useRouter haya sido llamada
    // con la ruta correcta.
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/componente-red');
  });

  // 6. Prueba de un caso borde: componenteRed es null
  it('handles null componenteRed prop gracefully', () => {
    // Renderizamos el componente con un valor nulo
    render(<Header componenteRed={null} />);

    // Verificamos que el título muestre un texto predeterminado o esté vacío
    // En este caso, el componente renderiza " - " si `componenteRed` es null.
    // Un simple regex o texto literal es suficiente para la prueba.
    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(/-/);

    // Verificamos que otros elementos se sigan renderizando correctamente
    expect(screen.getByRole('img', { name: /telefonica/i })).toBeInTheDocument();
  });
});