import { useState, useRef, ChangeEvent } from 'react';
import { documentService } from '@/core/document/document.service';
import Icon from '@/components/Icon';

interface FileUploadProps {
  name: string;
  label: string;
  required?: boolean;
  value?: string; // Document ID
  onChange: (name: string, value: string) => void;
  acceptedFileTypes?: string[]; // e.g., ['.txt', '.pdf']
}

export default function FileUpload({
  name,
  label,
  required = true,
  value = '',
  onChange,
  acceptedFileTypes = ['.txt']
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar el tipo de archivo
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedFileTypes.includes(fileExtension)) {
      setError(
        `Tipo de archivo no permitido. Solo se permiten: ${acceptedFileTypes.join(', ')}`
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const response = await documentService.uploadDocument(file);
      const documentId = response.data.id;
      setFileName(file.name);
      onChange(name, documentId);
    } catch (err: any) {
      console.error('Error uploading file:', err);
      setError(err?.response?.data?.message || 'Error al subir el archivo');
      onChange(name, '');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDownload = async () => {
    if (!value) return;

    setDownloading(true);
    setError(null);

    try {
      await documentService.downloadDocumentAsFile(value);
    } catch (err: any) {
      console.error('Error downloading file:', err);
      setError(err?.response?.data?.message || 'Error al descargar el archivo');
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = () => {
    setFileName(null);
    setError(null);
    onChange(name, '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Si hay un valor (document ID) pero no fileName, significa que es un archivo pre-existente
  const hasFile = !!value;

  return (
    <div>
      <div className="flex flex-col gap-2 w-full border border-[#D1D5E4] h-full justify-center p-2">
        <div className="flex items-center gap-2">
          <div className="flex-grow grid">
            <label className="text-sm text-gray-700 font-medium">
              {label} {!required && '(opcional)'}
            </label>
            {fileName && (
              <p
                className="text-xs text-gray-600 mt-1 truncate"
                title={fileName}
              >
                {fileName}
              </p>
            )}
            {hasFile && !fileName && (
              <p className="text-xs text-gray-600 mt-1">Archivo cargado</p>
            )}
            {/* File type hint */}
            {!hasFile && (
              <p className="text-xs text-gray-500">
                Tipos permitidos: {acceptedFileTypes.join(', ')}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Upload button */}
            {!hasFile && (
              <button
                type="button"
                onClick={handleUploadClick}
                disabled={uploading}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                title="Subir archivo"
              >
                {uploading ? (
                  <Icon icon="sync" className="animate-spin" />
                ) : (
                  <Icon icon="upload_file" />
                )}
              </button>
            )}

            {/* Download button */}
            {hasFile && (
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                title="Descargar archivo"
              >
                {downloading ? (
                  <Icon icon="sync" className="animate-spin" />
                ) : (
                  <Icon icon="download" />
                )}
              </button>
            )}

            {/* Delete button */}
            {hasFile && (
              <button
                type="button"
                onClick={handleDelete}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                title="Eliminar archivo"
              >
                <Icon icon="delete" />
              </button>
            )}
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFileTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
      {/* Error message */}
      {error && (
        <p className="text-xs text-red-600 mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
