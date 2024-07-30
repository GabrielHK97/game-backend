import { SexEnum } from "src/utils/enum/sex.enum";

export class CreateAccountDto {
    name: string;
    birthDate: string;
    sex: SexEnum;
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
}
