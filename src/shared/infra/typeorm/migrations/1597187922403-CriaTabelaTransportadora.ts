import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CriaTabelaTransportadora1597187922403
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'transportadora',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            generationStrategy: 'increment',
            isGenerated: true,
          },
          {
            name: 'cnpj',
            type: 'char',
            length: '18',
            isUnique: true,
          },
          {
            name: 'razao_social',
            type: 'varchar',
          },
          {
            name: 'nome_fantasia',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'telefone',
            type: 'varchar',
          },
          {
            name: 'endereco',
            type: 'varchar',
          },
          {
            name: 'bairro',
            type: 'varchar',
          },
          {
            name: 'numero',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'complemento',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'cep',
            type: 'varchar',
          },
          {
            name: 'id_usuario',
            type: 'integer',
          },
          {
            name: 'cidade_id',
            type: 'integer',
          },
          {
            name: 'status',
            type: 'varchar',
            default: "'criado'",
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
            name: 'TransportadoraUser',
            referencedTableName: 'usuario',
            referencedColumnNames: ['id'],
            onDelete: 'NO ACTION',
            onUpdate: 'CASCADE',
            columnNames: ['id_usuario'],
          },
          {
            name: 'TransportadoraCidade',
            referencedTableName: 'cidade',
            referencedColumnNames: ['id'],
            onDelete: 'NO ACTION',
            onUpdate: 'CASCADE',
            columnNames: ['cidade_id'],
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('transportadora');
  }
}
