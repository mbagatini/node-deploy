import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CriarTabelaTokensUsuarios1595541218233
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tokens_usuario',
        columns: [
          {
            name: 'token',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'usuario_id',
            type: 'integer',
            isNullable: false,
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
            name: 'TokenUser',
            referencedTableName: 'usuario',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            columnNames: ['usuario_id'],
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tokens_usuario');
  }
}
