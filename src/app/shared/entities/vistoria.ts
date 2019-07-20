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
  laudo: any;
  endereco: string;
  numero: number;
  partes: any;
  solicitacoes: any[];
  fotoCaracterizacao: any;
  tipos_laudo: string;
  updateAt: string;
  user: User;
  visita: string;
  status: StatusEnum
}
