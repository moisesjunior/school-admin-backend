import { MigrationInterface, QueryRunner } from 'typeorm';

export class createDatabase1619671676771 implements MigrationInterface {
  name = 'createDatabase1619671676771';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "payment" ("id" character varying NOT NULL, "generateAssasPayment" boolean NOT NULL, "type" character varying NOT NULL, "status" character varying, "billingType" character varying NOT NULL, "value" numeric NOT NULL, "dueDate" character varying NOT NULL, "description" character varying NOT NULL, "externalReference" character varying, "installmentCount" integer, "installmentValue" numeric, "discount" json, "interest" json, "fine" json, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "customerId" character varying, CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "customer" ("id" character varying NOT NULL, "name" character varying NOT NULL, "cpf" character varying NOT NULL, "email" character varying, "phoneNumber" character varying, "mobilePhone" character varying NOT NULL, "birthdate" TIMESTAMP, "nationality" character varying, "maritalStatus" character varying, "address" character varying NOT NULL, "addressNumber" numeric NOT NULL, "complement" character varying, "province" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, "postalCode" character varying NOT NULL, "rg" character varying, "emitter" character varying, "emissionDate" TIMESTAMP, "voterRegistration" character varying, "reservist" character varying, "fatherName" character varying, "motherName" character varying, "highSchool" boolean, "whichSchool" character varying, "whichYear" character varying, "whichCity" character varying, "chronicDisease" boolean, "hepatitis" boolean, "useMedication" boolean, "whichMedication" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "courseId" uuid, CONSTRAINT "UQ_e96edf3964ada73dc7e048d4f31" UNIQUE ("cpf"), CONSTRAINT "UQ_012e6c4ab33460ab0774a44940b" UNIQUE ("rg"), CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "course" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "startAt" TIMESTAMP NOT NULL, "endAt" TIMESTAMP NOT NULL, "monthlyPayment" numeric NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_bf95180dd756fd204fb01ce4916" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "expenditure" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "dueDate" TIMESTAMP NOT NULL, "value" numeric NOT NULL, "expenditureType" character varying NOT NULL, "description" character varying NOT NULL, "referenceDate" TIMESTAMP NOT NULL, "paymentDay" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_1c52384775d22bfcd87d886d502" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "FK_967ae37468fd0c08ea0fec41720" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer" ADD CONSTRAINT "FK_aeceeabf2da0a9c84d97e0fa38b" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customer" DROP CONSTRAINT "FK_aeceeabf2da0a9c84d97e0fa38b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "FK_967ae37468fd0c08ea0fec41720"`,
    );
    await queryRunner.query(`DROP TABLE "expenditure"`);
    await queryRunner.query(`DROP TABLE "course"`);
    await queryRunner.query(`DROP TABLE "customer"`);
    await queryRunner.query(`DROP TABLE "payment"`);
  }
}
