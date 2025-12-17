import { cnr } from '../config';

export interface DocumentUploadResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    contentType: string;
    file: string;
    referenced: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
  };
  timestamp: number;
}

export interface DocumentDownloadResponse {
  name: string;
  content: string;
}

/**
 * Servicio para manejar la carga y descarga de documentos
 */
class DocumentService {
  /**
   * Sube un archivo al servidor
   * @param file - Archivo a subir
   * @param name - Nombre del archivo (opcional, se usa el nombre del file si no se proporciona)
   * @returns Promise con la respuesta del servidor incluyendo el ID del documento
   */
  async uploadDocument(
    file: File,
    name?: string
  ): Promise<DocumentUploadResponse> {
    const formData = new FormData();
    formData.append('name', name || file.name);
    formData.append('file', file);
    formData.append('contentType', ''); // Campo requerido pero vacío
    formData.append('referenced', ''); // Campo requerido pero vacío

    const response = await cnr.post<DocumentUploadResponse>(
      '/api/v1/cnr/document',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          accept: 'application/json'
        }
      }
    );

    return response.data;
  }

  /**
   * Descarga un documento del servidor
   * @param documentId - ID del documento a descargar
   * @returns Promise con el nombre y contenido del archivo
   */
  async downloadDocument(
    documentId: string
  ): Promise<DocumentDownloadResponse> {
    const response = await cnr.get(`/api/v1/cnr/document/${documentId}`, {
      headers: {
        accept: 'application/octet-stream'
      },
      responseType: 'text'
    });

    // Validar que el status sea 200
    if (response.status !== 200) {
      throw new Error(
        `Error al descargar el documento: status ${response.status}`
      );
    }

    // Parsear la respuesta
    // Formato esperado:
    // name: archivo-cargado
    //
    // contenido del archivo
    const textContent = response.data as string;
    const lines = textContent.split('\n');

    // La primera línea contiene el nombre
    const nameLine = lines[0] || '';
    const name = nameLine.replace(/^name:\s*/, '').trim();

    // El contenido comienza desde la línea 2 (después de la línea en blanco)
    const content = lines.slice(2).join('\n');

    return {
      name,
      content
    };
  }

  /**
   * Descarga un documento y lo guarda en el sistema de archivos del navegador
   * @param documentId - ID del documento a descargar
   */
  async downloadDocumentAsFile(documentId: string): Promise<void> {
    const { name, content } = await this.downloadDocument(documentId);
    
    // Crear un blob con el contenido
    const blob = new Blob([content], { type: 'text/plain' });
    
    // Crear un enlace temporal y hacer click para descargar
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    
    // Limpiar
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

export const documentService = new DocumentService();
