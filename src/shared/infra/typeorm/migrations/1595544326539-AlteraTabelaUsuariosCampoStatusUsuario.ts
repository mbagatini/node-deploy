import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AlteraTabelaUsuariosCampoStatusUsuario1595544326539
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'usuario',
      new TableColumn({
        name: 'status',
        type: 'varchar',
        isNullable: false,
        default: "'ativo'",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('usuario', 'status');
  }
}
