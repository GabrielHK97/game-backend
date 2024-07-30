import { SexEnum } from 'src/utils/enum/sex.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'date',
    nullable: false,
    // transformer: {
    //   from(value: string) {
    //     return value.split('-').reverse().join('/');
    //   },
    //   to(value: string) {
    //     return new Date(value  + 'T00:00:00');
    //   },
    // },
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
