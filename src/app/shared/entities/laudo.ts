import { Ambiente } from './ambiente';

export class Laudo {
  _id: string;
  id: string;
  ambientes: Ambiente[];
  data: string;
  saved: boolean;
}
