import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import Estado from '@modules/estados/infra/typeorm/entities/Estado';
import Usuario from '@modules/usuarios/infra/typeorm/entities/Usuario';

@Entity('cidade')
class Cidade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  nome: string;

  @Column({ type: 'integer', select: false })
  estado_id: number;

  @OneToMany(() => Usuario, usuario => usuario.cidade)
  usuario: Usuario;

  @ManyToOne(() => Estado, estado => estado.cidade, { eager: true })
  @JoinColumn({ name: 'estado_id' })
  estado: Estado;

  @CreateDateColumn()
  data_criacao: Date;

  @UpdateDateColumn()
  data_atualizacao: Date;
}

export default Cidade;
