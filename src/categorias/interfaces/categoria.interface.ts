import { Document } from 'mongoose';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';

export interface Evento {
  nome: string;
  operacao: string;
  valor: number;
}

export interface Categoria extends Document {
  readonly categoria: string;
  descricao: string;
  eventos: Array<Evento>;
  jogadores: Array<Jogador>;
}
