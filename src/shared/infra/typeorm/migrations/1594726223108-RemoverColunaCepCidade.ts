import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
import { query } from "express";

export class RemoverColunaCepCidade1594726223108 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('cidade', 'cep');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('cidade', new TableColumn({
            name: "cep",
            type: "char",
            length: "9",
        }))
    }

}
