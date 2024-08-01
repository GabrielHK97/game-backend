import { SexEnum } from 'src/utils/enum/sex.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    type: 'date',
    nullable: false,
  })
  birthDate: Date;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  sex: SexEnum;

  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  email: string;
}
