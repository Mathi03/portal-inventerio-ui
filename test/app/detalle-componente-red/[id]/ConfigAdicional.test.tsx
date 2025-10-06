import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { TipoComponenteType } from '@/core/tipo-componente/tipo-componente.type';
import ConfigAdicional from '@/app/detalle-componente-red/[id]/ConfigAdicional';

// Mock de los componentes externos para simplificar las pruebas
jest.mock('@/components/Icon', () => {
  return function MockIcon(props: any) {
    return <span data-testid="mock-icon" {...props}>Icon</span>;
  };
});

jest.mock('@/components/InputDynamic', () => {
  return function MockInputDynamic(props: any) {
    return (
      <input
        data-testid={`input-${props.name}`}
        aria-label={props.label || props.name}
        onChange={(e) => props.onChange(props.name, e.target.value)}
        value={props.value}
      />
    );
  };
});

jest.mock('@telefonica/mistica', () => ({
  ...jest.requireActual('@telefonica/mistica'),
  Tabs: ({ selectedIndex, onChange, tabs }: any) => (
    <div data-testid="tabs-mock">
      {tabs.map((tab: any, index: number) => (
        <button
          key={index}
          role="tab"
          aria-selected={selectedIndex === index}
          onClick={() => onChange(index)}
        >
          {tab.text}
        </button>
      ))}
    </div>
  ),
  Box: (props: any) => <div {...props} data-testid="box-mock" />,
  TextField: (props: any) => <input data-testid="text-field-mock" {...props} />,
  IconShowerFilled: (props: any) => <span data-testid="icon-shower-mock" {...props} />,
}));

describe('ConfigAdicional Component', () => {

  // Datos de prueba para el tipo de componente
  const mockTipoComponente: TipoComponenteType = {
    id: 1,
    name: 'Router',
    configData: [
      {
        configAttributes: [
          { name: 'modelo', label: 'Modelo', type: 'text', required: true, defaultValue: 'A' },
          { name: 'ip_address', label: 'Dirección IP', type: 'text', required: true, defaultValue: '192.168.1.1' },
          {
            name: 'hardware',
            label: 'Hardware',
            type: 'nested',
            atribs_config: [
              { name: 'cpu', label: 'CPU', type: 'text', required: true, defaultValue: '' },
              { name: 'ram', label: 'RAM', type: 'text', required: true, defaultValue: '' },
            ],
          },
        ],
        configServices: [
          { name: 'service_1', label: 'Servicio 1', type: 'text', required: true, defaultValue: 'Enabled' },
          {
            name: 'nested_service',
            label: 'Servicio anidado',
            type: 'nested',
            atribs_config: [
              { name: 'sub_service_a', label: 'Subservicio A', type: 'text', required: true, defaultValue: 'Active' },
              { name: 'sub_service_b', label: 'Subservicio B', type: 'text', required: true, defaultValue: 'Inactive' },
            ],
          },
        ],
      },
    ],
  };

  const initialAttributes = {
    modelo: 'B',
    ip_address: '10.0.0.1',
    hardware: {
      cpu: '2GHz',
      ram: '4GB',
    },
  };

  const initialServices = {
    service_1: 'Disabled',
    nested_service: {
      sub_service_a: 'Active',
      sub_service_b: 'Inactive',
    },
  };

  // Mocks de las funciones onChange
  const mockOnAttributes = jest.fn();
  const mockOnServices = jest.fn();

  it('renders correctly with default state', () => {
    render(
      <ConfigAdicional
        tipoComponente={mockTipoComponente}
        attribute={initialAttributes}
        service={initialServices}
        onAttributes={mockOnAttributes}
        onServices={mockOnServices}
      />
    );

    // Verifica que el título y la descripción se rendericen
    expect(screen.getByText('Configuración adicional')).toBeInTheDocument();
    expect(screen.getByText(/Esta configuración es dinámica/)).toBeInTheDocument();
    
    // Verifica que las pestañas se rendericen y "Atributos" esté activo
    expect(screen.getByRole('tab', { name: 'Atributos', selected: true })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Servicios', selected: false })).toBeInTheDocument();
    
    // Verifica que los inputs de atributos se rendericen con los valores correctos
    expect(screen.getByRole('heading', { name: 'Atributos' })).toBeInTheDocument();
    expect(screen.getByLabelText('Modelo')).toHaveValue('B');
    expect(screen.getByLabelText('Dirección IP')).toHaveValue('10.0.0.1');

    // Verifica que los inputs anidados de hardware se rendericen
    expect(screen.getByLabelText('CPU')).toHaveValue('2GHz');
    expect(screen.getByLabelText('RAM')).toHaveValue('4GB');

  });

  it('changes tab when a tab is clicked', () => {
    render(
      <ConfigAdicional
        tipoComponente={mockTipoComponente}
        attribute={initialAttributes}
        service={initialServices}
        onAttributes={mockOnAttributes}
        onServices={mockOnServices}
      />
    );

    // Clic en la pestaña de "Servicios"
    const servicesTab = screen.getByRole('tab', { name: 'Servicios' });
    fireEvent.click(servicesTab);

    // Verifica que la pestaña "Servicios" esté activa
    expect(screen.getByRole('tab', { name: 'Servicios', selected: true })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Servicios' })).toBeInTheDocument();

    // Verifica que los inputs de servicios se rendericen
    expect(screen.getByLabelText('Servicio 1')).toHaveValue('Disabled');
    
    // Verifica que los inputs anidados de servicios se rendericen
    expect(screen.getByLabelText('Subservicio A')).toHaveValue('Active');
    expect(screen.getByLabelText('Subservicio B')).toHaveValue('Inactive');
  });


  it('calls onAttributes with the correct values when a nested attribute input changes', () => {
    render(
      <ConfigAdicional
        tipoComponente={mockTipoComponente}
        attribute={initialAttributes}
        service={initialServices}
        onAttributes={mockOnAttributes}
        onServices={mockOnServices}
      />
    );

    // Simula el cambio en el input anidado "CPU"
    const cpuInput = screen.getByLabelText('CPU');
    fireEvent.change(cpuInput, { target: { value: '3GHz' } });

    // Verifica que la función onAttributes se haya llamado con el nombre del padre
    expect(mockOnAttributes).toHaveBeenCalledWith('cpu', '3GHz', 'hardware');
  });

 

  it('calls onServices with the correct values when a nested service input changes', () => {
    render(
      <ConfigAdicional
        tipoComponente={mockTipoComponente}
        attribute={initialAttributes}
        service={initialServices}
        onAttributes={mockOnAttributes}
        onServices={mockOnServices}
      />
    );
    // Cambia a la pestaña de "Servicios"
    fireEvent.click(screen.getByRole('tab', { name: 'Servicios' }));

    // Simula el cambio en el input anidado "Subservicio B"
    const subServiceBInput = screen.getByLabelText('Subservicio B');
    fireEvent.change(subServiceBInput, { target: { value: 'Active' } });

    // Verifica que la función onServices se haya llamado con el nombre del padre
    expect(mockOnServices).toHaveBeenCalledWith('sub_service_b', 'Active', 'nested_service');
  });
});