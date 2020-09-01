import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export default class AlterarTabelaUsuarioAvatarURL1594685548610 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('usuario',
            new TableColumn({
                name: 'avatar_url',
                type: 'varchar',
                isNullable: true,
            }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('usuario', 'avatar_url');
    }

}
