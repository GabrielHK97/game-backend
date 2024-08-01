import { AccountDetailsDto } from "../dto/account-dateils.dto";
import { Account } from "../entities/account.entity";

function getAge(birthdate: Date): string {
    const today = new Date();
    const birthYear = birthdate.getFullYear();
    const birthMonth = birthdate.getMonth();
    const birthDay = birthdate.getDate();

    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    let age = currentYear - birthYear;
    if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
        age--;
    }

    return age.toString();
}

export class AccountConverter {
    static accountToAccountDetailsDto(account: Account) {
        const dto = new AccountDetailsDto();
        dto.id = account.id;
        dto.name = account.name;
        dto.username = account.username;
        dto.birthDate = account.birthDate;
        dto.age = getAge(new Date(account.birthDate));
        dto.sex = account.sex;
        dto.email = account.email;
        return dto;
    }
}