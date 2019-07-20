import { Ambiente } from './ambiente';
import { Vistoria } from './vistoria';

export class Laudo {
  _id: string;
  id: string;
  ambientes: Ambiente[];
  vistoria: Vistoria;
  data: string;
  saved: boolean;
}
