import { ItemAmbiente } from './item-ambiente';
import { File } from './file';

export class Ambiente {
  _id: string;
  id:  string;
  fotoFachada: any;
  nome: string;
  itens: ItemAmbiente[];
}
