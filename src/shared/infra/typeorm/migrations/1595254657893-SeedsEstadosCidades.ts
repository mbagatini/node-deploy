/* eslint-disable no-console */
import {
  MigrationInterface,
  QueryRunner,
  getRepository,
  getConnection,
} from 'typeorm';
import { EstadosIbge } from '@modules/estados/infra/typeorm/seeds/SeedEstados';
import Estado from '@modules/estados/infra/typeorm/entities/Estado';
import { CidadesIbge } from '@modules/cidades/infra/typeorm/seeds/SeedCidades';
import Cidade from '@modules/cidades/infra/typeorm/entities/Cidade';

export default class SeedsEstadosCidades1595254657893
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const estados = EstadosIbge;
    const repositorioEstados = await getRepository(Estado);
    await getConnection().createQueryBuilder().delete().from(Estado).execute();
    await getConnection().createQueryBuilder().delete().from(Cidade).execute();

    console.log('Carregando estados');
    const estadosASalvar = await Promise.all(
      estados.map(async estado => {
        const estadoCriado = await repositorioEstados.create(estado);
        return estadoCriado;
      }),
    );
    console.log('Inserindo estados no DB');
    await repositorioEstados.save(estadosASalvar);

    const cidades = CidadesIbge;
    const repositorioCidades = getRepository(Cidade);

    console.log('Carregando cidades');
    const cidadesASalvar = await Promise.all(
      cidades
        .map(async cidade => {
          const estado = await repositorioEstados.findOne({
            where: { uf: cidade.uf },
          });
          if (!estado) {
            return { nome: 'SEM ESTADO' } as Cidade;
          }

          const novaCidade = await repositorioCidades.create(cidade);
          const cidadeNova: Cidade = { ...novaCidade, estado };

          return cidadeNova;
        })
        .filter(async cidade => (await cidade).nome !== 'SEM ESTADO'),
    );
    console.log('Inserindo cidades no DB');
    await repositorioCidades.save(cidadesASalvar);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('Deletando cidades e estados');
    await getConnection().createQueryBuilder().delete().from(Estado).execute();
    await getConnection().createQueryBuilder().delete().from(Cidade).execute();
    console.log('Concluído');
  }
}
