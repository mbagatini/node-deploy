/* eslint-disable camelcase */
import { v4 } from 'uuid';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  PrimaryColumn,
} from 'typeorm';
import Usuario from './Usuario';

@Entity('tokens_usuario')
class TokensUsuario {
  @PrimaryColumn({
    type: 'varchar',
  })
  token: string;

  @Column()
  id_usuario: number;

  @ManyToOne(() => Usuario, usuario => usuario.id, { eager: true })
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @CreateDateColumn()
  data_criacao: Date;

  @UpdateDateColumn()
  data_atualizacao: Date;

  @BeforeInsert()
  private setToken() {
    this.token = v4();
  }
}

export default TokensUsuario;
