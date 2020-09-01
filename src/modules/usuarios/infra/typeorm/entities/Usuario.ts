/* eslint-disable camelcase */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import Cidade from '@modules/cidades/infra/typeorm/entities/Cidade';

@Entity('usuario')
class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  nome: string;

  @Column({
    type: 'char',
    unique: true,
    length: 10,
  })
  rg: string;

  @Column({
    type: 'char',
    unique: true,
    length: 14,
  })
  cpf: string;

  @Column('date')
  data_nascimento: Date;

  @Column({
    type: 'varchar',
    unique: true,
  })
  email: string;

  @Column({ select: false })
  senha: string;

  @Column('varchar')
  endereco: string;

  @Column('varchar')
  bairro: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  numero: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  complemento: string;

  @Column('varchar')
  cep: string;

  @Column({ select: false, type: 'integer' })
  cidade_id: number;

  @ManyToOne(() => Cidade, cidade => cidade.usuario, { eager: true })
  @JoinColumn({ name: 'cidade_id' })
  cidade: Cidade;

  @Column('varchar')
  avatar_url: string;

  @Column({
    type: 'varchar',
    default: 'inativo',
  })
  status: string;

  @CreateDateColumn()
  data_criacao: Date;

  @UpdateDateColumn()
  data_atualizacao: Date;
}

export default Usuario;
