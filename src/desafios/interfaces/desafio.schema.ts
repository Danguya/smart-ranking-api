import * as mongoose from 'mongoose';

export const DesafioSchema = new mongoose.Schema(
  {
    dataHoraDesafio: { type: Date },
    dataHoraSolicitacao: { type: Date },
    dataHoraResposta: { type: Date },
    status: { type: String },
    categoria: { type: String },
    solicitante: { type: mongoose.Schema.Types.ObjectId, ref: 'Jogador' },
    jogadores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Jogador' }],
    partida: { type: mongoose.Schema.Types.ObjectId, ref: 'Partida' },
  },
  { timestamps: true, collection: 'desafios' },
);
