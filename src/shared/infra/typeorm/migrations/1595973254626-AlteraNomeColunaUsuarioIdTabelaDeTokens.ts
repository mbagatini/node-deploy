import { MigrationInterface, QueryRunner } from 'typeorm';

export default class AlteraNomeColunaUsuarioIdTabelaDeTokens1595973254626
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn(
      'tokens_usuario',
      'usuario_id',
      'id_usuario',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn(
      'tokens_usuario',
      'id_usuario',
      'usuario_id',
    );
  }
}
