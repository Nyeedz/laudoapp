import { Fachada } from './fachada';
import { User } from './user';
import { StatusEnum } from '../enums/status.enum';

export class Vistoria {
  _id: string;
  id: string;
  bairro: string;
  cep: string;
  cidade: string;
  createdAt: string;
  endereco: string;
  fachada: Fachada;
  numero: number;
  partes: any;
  solicitacoes: any[];
  tipos_laudo: string;
  updateAt: string;
  user: User;
  visita: string;
  status: StatusEnum
}
