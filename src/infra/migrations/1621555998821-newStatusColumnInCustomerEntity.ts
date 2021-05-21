import { MigrationInterface, QueryRunner } from 'typeorm';

export class newStatusColumnInCustomerEntity1621555998821
  implements MigrationInterface {
  name = 'newStatusColumnInCustomerEntity1621555998821';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customer" ADD "status" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "status"`);
  }
}
