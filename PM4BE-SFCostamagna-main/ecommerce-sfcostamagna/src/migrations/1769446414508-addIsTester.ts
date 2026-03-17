import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsTester1769446414508 implements MigrationInterface {
    name = 'AddIsTester1769446414508'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "USERS" ADD "isTester" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "USERS" DROP COLUMN "isTester"`);
    }

}
