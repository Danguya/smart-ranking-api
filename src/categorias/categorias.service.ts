/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Categoria } from './interfaces/categoria.interface';
import mongoose, { Model } from 'mongoose';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dtos';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';
import { JogadoresService } from 'src/jogadores/jogadores.service';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
    private readonly jogadoresService: JogadoresService,
  ) {}

  async criarCategoria(
    criarCategoriaDto: CriarCategoriaDto,
  ): Promise<Categoria> {
    const { categoria } = criarCategoriaDto;

    const categoriaEncontrada = await this.categoriaModel
      .findOne({
        categoria,
      })
      .exec();

    if (categoriaEncontrada) {
      throw new BadRequestException(`Categoria ${categoria} ja cadastrada`);
    }
    const categoriaCriada = new this.categoriaModel(criarCategoriaDto);
    return await categoriaCriada.save();
  }

  async consultarTodasCategorias(): Promise<Array<Categoria>> {
    return await this.categoriaModel.find().populate('jogadores').exec();
  }

  async consultarCategoriaPeloId(categoria: string): Promise<Categoria> {
    const categoriaEncontrada = await this.categoriaModel
      .findOne({ categoria })
      .exec();

    if (!categoriaEncontrada) {
      throw new NotFoundException(`Categoria ${categoria} não encontrada!`);
    }

    return categoriaEncontrada;
  }

  async atualizarCategoria(
    categoria: string,
    atualizarCategoriaDto: AtualizarCategoriaDto,
  ) {
    const categoriaEncontrada = await this.categoriaModel
      .findOne({ categoria })
      .exec();

    if (!categoriaEncontrada) {
      throw new NotFoundException(`Categoria ${categoria} nao encontrada!`);
    }

    await this.categoriaModel
      .findOneAndUpdate({ categoria }, { $set: atualizarCategoriaDto })
      .exec();
  }

  async atribuirCategoriaJogador(params: string[]): Promise<void> {
    const idJogador = params['idJogador'];
    const categoria = params['categoria'];
    const categoriaEncontrada: any = await this.categoriaModel
      .findOne({ categoria })
      .exec();

    const jogadorJaCadastradoCategoria = await this.categoriaModel
      .find({ categoria })
      .where('jogadores')
      .in(idJogador)
      .exec();

    if(jogadorJaCadastradoCategoria.length > 0){
      throw new BadRequestException(`Jogador ${idJogador} já cadastrado na Categoria ${categoria}`)
    }

    await this.jogadoresService.consultarJogadorPeloId(idJogador);
    if (!categoriaEncontrada) {
      throw new BadRequestException(`Categoria ${categoria} nao encontrada!`);
    }

    categoriaEncontrada.jogadores.push(idJogador);

    await this.categoriaModel
      .findOneAndUpdate({ categoria }, { $set: categoriaEncontrada })
      .exec();
  }
}
