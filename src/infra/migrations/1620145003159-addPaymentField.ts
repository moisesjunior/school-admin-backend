import {MigrationInterface, QueryRunner} from "typeorm";

export class addPaymentField1620145003159 implements MigrationInterface {
    name = 'addPaymentField1620145003159'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" ADD "payment" numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "payment"`);
    }

}
