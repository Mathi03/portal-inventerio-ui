// @jest-environment jsdom

import NavMenu from '@/app/detalle-componente-red/[id]/NavMenu';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

// 1. Mock del hook `usePathname` de Next.js
const mockUsePathname = jest.fn();
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  usePathname: () => mockUsePathname(),
}));

// 2. Mock de los componentes de Mistica
// En pruebas unitarias, mockeamos los componentes de UI complejos.
jest.mock('@telefonica/mistica', () => ({
  ...jest.requireActual('@telefonica/mistica'),
  Accordion: ({ children }: any) => <div data-testid="accordion">{children}</div>,
  AccordionItem: ({ title, content }: any) => (
    <div data-testid="accordion-item" data-title={title}>
      <h4>{title}</h4>
      <div>{content}</div>
    </div>
  ),
}));

// 3. Mock del componente Link de Next.js
// Esto evita la navegación real y permite probar que los `Link` se renderizan.
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});


describe('NavMenu Component', () => {
  
  // 4. Prueba del "Happy Path" de renderizado
  it('renders the navigation menu with all sections and links', () => {
    // Configura el mock del pathname para una prueba inicial
    mockUsePathname.mockReturnValue('#datos');

    render(<NavMenu />);

    // Verifica que el encabezado del menú se renderice
    expect(screen.getByRole('heading', { level: 5, name: 'Navegacion' })).toBeInTheDocument();

    // Verifica que el Accordion y el AccordionItem se rendericen
    expect(screen.getByTestId('accordion')).toBeInTheDocument();
    expect(screen.getByTestId('accordion-item')).toBeInTheDocument();
    
    // Verifica que el título de la sección se muestre
    expect(screen.getByRole('heading', { level: 4, name: 'Información Basíca' })).toBeInTheDocument();

    // Verifica que todos los enlaces se rendericen con los títulos correctos
    expect(screen.getByRole('link', { name: 'Datos del componente de red' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Configuración adicional' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Relación jerarquica' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Observación' })).toBeInTheDocument();

    // Verifica que el enlace activo tenga la clase de estilo correcta
    const activeLink = screen.getByText('Datos del componente de red');
    expect(activeLink).toHaveClass('font-semibold');
    expect(activeLink).toHaveClass('text-[#0066FF]');
  });
  
  // 5. Prueba de la lógica de "activo"
  it('highlights the correct link based on the current pathname', () => {
    // Caso 1: Pathname coincide con un enlace
    mockUsePathname.mockReturnValue('#relacion-jerarquica');
    const { rerender } = render(<NavMenu />);

    const activeLink = screen.getByText('Relación jerarquica');
    expect(activeLink).toHaveClass('font-semibold');
    expect(activeLink).toHaveClass('text-[#0066FF]');

    // Caso 2: Pathname no coincide con ningún enlace
    mockUsePathname.mockReturnValue('/otra-ruta');
    rerender(<NavMenu />);
    
    // Busca los enlaces y verifica que ninguno tenga la clase activa
    const allLinks = screen.getAllByRole('link');
    allLinks.forEach(link => {
      // Obtenemos el span hijo, que es el que tiene los estilos.
      const spanElement = link.querySelector('span');
      if (spanElement) {
          expect(spanElement).not.toHaveClass('font-semibold');
      }
    });
  });

  // 6. Prueba de los atributos de Link
  it('applies the correct Next.js Link props', () => {
    mockUsePathname.mockReturnValue('#datos');
    render(<NavMenu />);
    
    const linkElement = screen.getByRole('link', { name: 'Datos del componente de red' });
    
    // Verifica los atributos que pasaste al componente Link
    expect(linkElement).toHaveAttribute('href', '#datos');
  });
});