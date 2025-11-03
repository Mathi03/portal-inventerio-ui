import { useCallback, useEffect, useState, useRef } from 'react';
import { ComponenteRedService } from '@/core/componente-red/componente-red.service';
import { ComponenteRedType } from '@/core/componente-red/componente-red.type';
import { useSnackbar } from '@telefonica/mistica';

interface UseHierarchyRelationsProps {
  componenteRedId?: number;
  mode: 'create' | 'update' | 'approve' | 'popup' | 'read';
  shouldLoad: boolean; // Solo cargar cuando sea necesario
}

interface HierarchyRelationsState {
  parents: ComponenteRedType[];
  children: ComponenteRedType[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook optimizado para manejar relaciones jerárquicas
 * - Carga relaciones existentes solo cuando es necesario
 * - Maneja paginación (preparado para futuro)
 * - Evita re-fetching innecesario
 */
export function useHierarchyRelations({
  componenteRedId,
  mode,
  shouldLoad
}: UseHierarchyRelationsProps) {
  const { openSnackbar } = useSnackbar();
  const [state, setState] = useState<HierarchyRelationsState>({
    parents: [],
    children: [],
    isLoading: false,
    error: null
  });

  // Ref para evitar llamadas duplicadas
  const hasFetchedRef = useRef(false);
  const lastIdRef = useRef<number | undefined>();

  const fetchHierarchyRelations = useCallback(async () => {
    if (
      !componenteRedId ||
      !shouldLoad ||
      mode === 'create' ||
      mode === 'popup'
    ) {
      setState({ parents: [], children: [], isLoading: false, error: null });
      return;
    }

    // ⚡ Evitar duplicados
    if (hasFetchedRef.current && lastIdRef.current === componenteRedId) {
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    const service = new ComponenteRedService();

    try {
      const { data } = await service.getHierarchyRelations(componenteRedId, {
        limit_parent: 1000,
        limit_children: 1000,
        page_parent: 1,
        page_children: 1
      });

      const parents = data.data.parents?.data || [];
      const children = data.data.children?.data || [];

      setState({
        parents,
        children,
        isLoading: false,
        error: null
      });

      hasFetchedRef.current = true;
      lastIdRef.current = componenteRedId;
    } catch (error) {
      console.error('Error fetching hierarchy relations:', error);
      const errorMessage = 'Error al cargar las relaciones jerárquicas';

      setState({
        parents: [],
        children: [],
        isLoading: false,
        error: errorMessage
      });

      openSnackbar({
        message: errorMessage,
        type: 'CRITICAL'
      });
    }
  }, [componenteRedId, mode, shouldLoad, openSnackbar]);

  useEffect(() => {
    if (lastIdRef.current !== componenteRedId || mode === 'create') {
      hasFetchedRef.current = false;
      lastIdRef.current = undefined;
    }
  }, [componenteRedId, mode]);

  useEffect(() => {
    fetchHierarchyRelations();
  }, [fetchHierarchyRelations]);

  const refresh = useCallback(() => {
    hasFetchedRef.current = false;
    fetchHierarchyRelations();
  }, [fetchHierarchyRelations]);

  return {
    parents: state.parents,
    children: state.children,
    isLoading: state.isLoading,
    error: state.error,
    refresh
  };
}
