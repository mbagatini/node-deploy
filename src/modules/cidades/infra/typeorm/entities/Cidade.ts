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
import Transportadora from '@modules/transportadoras/infra/typeorm/entities/Transportadora';
import Viagem from '@modules/viagens/infra/typeorm/entities/Viagem';

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

  @OneToMany(() => Transportadora, transportadora => transportadora.cidade)
  transportadora: Transportadora;

  @ManyToOne(() => Estado, estado => estado.cidade, { eager: true })
  @JoinColumn({ name: 'estado_id' })
  estado: Estado;

  @CreateDateColumn()
  data_criacao: Date;

  @UpdateDateColumn()
  data_atualizacao: Date;
}

export default Cidade;
