/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';

@Injectable()
export class JogadoresService {
  private readonly logger = new Logger(JogadoresService.name);

  constructor(@InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>){}

  async criarJogador(criarJogadorDto: CriarJogadorDto) : Promise<Jogador> {
    const {email} = criarJogadorDto;
    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();

    if(jogadorEncontrado) throw new BadRequestException(`Jogador com e-mail ${email} ja cadastrado`)
    await this.criar(criarJogadorDto)

    const jogadorCriado = new this.jogadorModel(criarJogadorDto)
    return await jogadorCriado.save();

  }

  async atualizarJogador(_id: string, atualizarJogadorDto: AtualizarJogadorDto) : Promise<void> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec();

    if(!jogadorEncontrado){
      throw new NotFoundException(`Jogador com id ${_id} não encontrado!`)
    }
    await this.jogadorModel.findOneAndUpdate({_id}, {$set: atualizarJogadorDto}).exec()

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

  async consultarJogadorPeloId(_id : string): Promise<Jogador>{
    const jogadorEncontrado = await this.jogadorModel.findOne({_id}).exec();

    if(!jogadorEncontrado){
      throw new NotFoundException(`Jogador com ID ${_id} não encontrado!`)
    }

    return jogadorEncontrado
  }

  private async criar(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const jogadorCriado = new this.jogadorModel(criarJogadorDto);
    return await jogadorCriado.save();
  }

  async deletarJogador(_id:string): Promise<any> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec();

    if(!jogadorEncontrado){
      throw new NotFoundException(`Jogador com id ${_id} não encontrado!`)
    }

    return await this.jogadorModel.findOneAndRemove({_id}).exec();
  }
}
