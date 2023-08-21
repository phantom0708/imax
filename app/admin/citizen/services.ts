import useSWR from 'swr';
import { BaseService } from '@/shared/services';
import api from '@/shared/services/axios-custom';
import { Meta } from '@/shared/model';
class services extends BaseService {
  GetList = (meta: Meta) => {
    const { data, error, isLoading, mutate } = useSWR([this.url, meta], () => this.getMany(meta));
    return {
      data,
      error,
      isLoading,
      mutate,
    };
  };
  GetById = (id: number) => {
    const { data, error, isLoading, mutate } = useSWR(id ? `${'/api/services/app/CitizenTemp/GetCitizenById'}${id}` : null, () => api.get(`${'/api/services/app/CitizenTemp/GetCitizenById?id='}${id}`));
    return {
      data: data?.result?.data,
      error,
      isLoading,
      mutate,
    };
  };

  
  createOrUpdate = async (data: any) => {
    const res: any = await api.post("/api/services/app/CitizenTemp/CreateOrUpdateCitizen", data);    
    return res;
  };
  delete = async (id: number) => {
    const res: any = await api.delete(`/api/services/app/CitizenTemp/DeleteCitizen?id=${id}`);
    return res;
  };

  GetCanHo = () => {
    const { data, isLoading } = useSWR('api/services/app/Citizen/GetAllSmarthomeByTenant', () => api.get('/api/services/app/Citizen/GetAllSmarthomeByTenant?skipCount=0&maxResultCount=1000'));
    return {
      data: data?.result?.data.map((item: any) => {
        return {
          value: item.name,
          label: item.name,
        };
      }),
      isLoading,
    };
  };
}
const citizenServices = new services("api/services/app/CitizenTemp/GetAllCitizen");
export { citizenServices };
