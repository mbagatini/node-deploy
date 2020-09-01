import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AlteraValorPadraoColunaStatusUsuario1596024589504
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'usuario',
      'status',
      new TableColumn({
        name: 'status',
        type: 'varchar',
        isNullable: false,
        default: "'inativo'",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'usuario',
      'status',
      new TableColumn({
        name: 'status',
        type: 'varchar',
        isNullable: false,
        default: "'ativo'",
      }),
    );
  }
}
