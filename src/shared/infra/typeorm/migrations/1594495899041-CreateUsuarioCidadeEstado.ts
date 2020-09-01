/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreateUsuarioCidadeEstado1594495899041
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'estado',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            generationStrategy: 'increment',
            isGenerated: true,
          },
          {
            name: 'nome',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'uf',
            type: 'char',
            length: '2',
            isUnique: true,
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
      }),
    );
    await queryRunner.createTable(
      new Table({
        name: 'cidade',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            generationStrategy: 'increment',
            isGenerated: true,
          },
          {
            name: 'nome',
            type: 'varchar',
          },
          {
            name: 'cep',
            type: 'char',
            length: '9',
          },
          {
            name: 'estado_id',
            type: 'integer',
            isNullable: true,
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
      }),
    );
    await queryRunner.createForeignKey(
      'cidade',
      new TableForeignKey({
        name: 'EstadoCidade',
        columnNames: ['estado_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'estado',
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'usuario',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            generationStrategy: 'increment',
            isGenerated: true,
          },
          {
            name: 'nome',
            type: 'varchar',
          },
          {
            name: 'rg',
            type: 'char',
            length: '10',
            isUnique: true,
          },
          {
            name: 'cpf',
            type: 'char',
            length: '14',
            isUnique: true,
          },
          {
            name: 'data_nascimento',
            type: 'date',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'senha',
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
            isNullable: true,
          },
          {
            name: 'cidade_id',
            type: 'integer',
            isNullable: true,
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
      }),
    );

    await queryRunner.createForeignKey(
      'usuario',
      new TableForeignKey({
        name: 'CidadeUsuario',
        columnNames: ['cidade_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'cidade',
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('usuario');
    await queryRunner.dropTable('cidade');
    await queryRunner.dropTable('estado');
  }
}
