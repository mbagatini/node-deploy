import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CriaTabelaViagens1598046353485
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'viagem',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            generationStrategy: 'increment',
            isGenerated: true,
          },
          {
            name: 'titulo',
            type: 'varchar',
          },
          {
            name: 'descricao',
            type: 'varchar',
          },
          {
            name: 'data_saida',
            type: 'date',
          },
          {
            name: 'hora_saida',
            type: 'integer',
          },
          {
            name: 'local_origem',
            type: 'varchar',
          },
          {
            name: 'id_cidade_origem',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'local_destino',
            type: 'varchar',
          },
          {
            name: 'id_cidade_destino',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'id_organizador',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'assentos',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'data_limite',
            type: 'date',
          },
          {
            name: 'minimo_de_pessoas',
            type: 'integer',
          },
          {
            name: 'valor_por_pessoa',
            type: 'integer',
          },
          {
            name: 'percentual_organizador',
            type: 'decimal(4,2)',
          },
          {
            name: 'status',
            type: 'varchar',
            isNullable: false,
            default: "'criada'",
          },
          {
            name: 'data_criacao',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'data_atualizacao',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['id_cidade_origem'],
            referencedColumnNames: ['id'],
            referencedTableName: 'cidade',
            name: 'CidadeOrigemViagem',
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          },
          {
            columnNames: ['id_cidade_destino'],
            referencedColumnNames: ['id'],
            referencedTableName: 'cidade',
            name: 'CidadeDestinoViagem',
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          },
          {
            columnNames: ['id_organizador'],
            referencedColumnNames: ['id'],
            referencedTableName: 'usuario',
            name: 'OrganizadorViagem',
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('viagem');
  }
}
