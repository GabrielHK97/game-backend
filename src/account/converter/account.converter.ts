import { AccountDetailsDto } from "../dto/account_details.dto";
import { Account } from "../entities/account.entity";

export class AccountConverter {
    static accountToAccountDetailsDto(account: Account): AccountDetailsDto {
        const dto = new AccountDetailsDto();
        dto.birthdate = account.birthdate;
        dto.email = account.email;
        dto.name = account.name;
        dto.username = account.username;
        return dto;
    }
}