/* eslint-disable prettier/prettier */
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import {v4 as uuid} from 'uuid'
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JogadoresService {
  private readonly logger = new Logger(JogadoresService.name);

  constructor(@InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>){}

  async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto) : Promise<void> {
    const {email} = criarJogadorDto;
    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();
    if(jogadorEncontrado){
      await this.atualizar(jogadorEncontrado)
    }else{
      await this.criar(criarJogadorDto)
    }
  }

  async consultarTodosJogadores(){
    return await this.jogadorModel.find().exec();
  }

  async consultarJogadoresPeloEmail(email : string): Promise<Jogador>{
    const jogadorEncontrado = await this.jogadorModel.findOne({email}).exec();

    if(!jogadorEncontrado){
      throw new NotFoundException(`Jogador com e-mail ${email} não encontrado!`)
    }

    return jogadorEncontrado
  }

  private async criar(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const jogadorCriado = new this.jogadorModel(criarJogadorDto);
    return await jogadorCriado.save();
  }

  private async atualizar(criarJogadorDto: CriarJogadorDto):Promise<Jogador>{
    return await this.jogadorModel.findOneAndUpdate({email: criarJogadorDto.email}, {$set: criarJogadorDto}).exec()
  }

  async deletarJogador(email:string): Promise<any> {
    return await this.jogadorModel.findOneAndRemove({email}).exec();
  }
}
