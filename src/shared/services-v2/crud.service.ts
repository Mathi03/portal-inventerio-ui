import HttpService from './http.service';
import { GetAllResponse } from './service.type';

class CrudService<T> {
  private http;
  private url: string;

  constructor(baseUrl: string, url: string) {
    this.url = url;
    this.http = HttpService({ baseUrl });
  }

  async create(data: T): Promise<T> {
    const response = await this.http.post<T>(`${this.url}`, data);
    return response.data;
  }

  async getAll(): Promise<{ data: T[]; totalItems: number }> {
    const response = await this.http.get<GetAllResponse<T>>(this.url);
    const { data, total } = response.data.data;
    return {
      data,
      totalItems: total
    };
  }

  async getAllByParams(
    params?: any
  ): Promise<{ data: T[]; totalItems: number }> {
    const response = await this.http.get<any>(this.url, {
      params
    });
    const { data } = response.data;
    return {
      data,
      totalItems: response.data.totalItems
    };
  }

  async getById(id: number): Promise<any> {
    const response = await this.http.get<any>(`${this.url}/${id}`);
    return response.data.data;
  }

  async update(id: number, data: any): Promise<any> {
    const response = await this.http.put<any>(`${this.url}/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await this.http.delete(`${this.url}/${id}`);
  }

  async exportCsv(
    params?: any,
    filename: string = 'downloaded_file.csv'
  ): Promise<void> {
    const url = `${this.url}/export`;

    try {
      const response = await this.http.post(url, '', {
        headers: {
          accept: 'application/octet-stream'
        },
        responseType: 'blob',
        params: params
      });

      const contentDisposition = response.headers['content-disposition'];

      if (!contentDisposition) throw new Error('Archivo invalido');

      const fileName =
        contentDisposition?.split('filename=')[1]?.replace(/"/g, '') ||
        'downloadedFile.xlsx';

      const blob = response.data;

    } catch (error) {
      console.error('Error al descargar el archivo', error);
    }
  }
}

export class urlParamService<T> {
  private http;
  private url: string;

  constructor(baseUrl: string, url: string) {
    this.url = url;
    this.http = HttpService({ baseUrl: baseUrl });
  }
  async getAllByOneId(
    id?: number,
    params?: any
  ): Promise<{ data: T[]; totalItems: number }> {
    const url = this.url.replace('{id}', String(id));

    const response = await this.http.get<any>(url, {
      params
    });
    const data = response.data;
    return data;
  }
}

export default CrudService;
