import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeReservistType1620144836689 implements MigrationInterface {
  name = 'changeReservistType1620144836689';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "reservist"`);
    await queryRunner.query(`ALTER TABLE "customer" ADD "reservist" boolean`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "reservist"`);
    await queryRunner.query(
      `ALTER TABLE "customer" ADD "reservist" character varying`,
    );
  }
}
