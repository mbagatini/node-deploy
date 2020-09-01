/* eslint-disable camelcase */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import Cidade from '@modules/cidades/infra/typeorm/entities/Cidade';

@Entity('estado')
class Estado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  nome: string;

  @Column({
    type: 'char',
    length: 2,
  })
  uf: string;

  @OneToMany(() => Cidade, cidade => cidade.estado)
  cidade: Cidade;

  @CreateDateColumn()
  data_criacao: Date;

  @UpdateDateColumn()
  data_atualizacao: Date;
}

export default Estado;
