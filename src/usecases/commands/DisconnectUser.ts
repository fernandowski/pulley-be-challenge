import {IUserRepository} from "../../interfaces/database/IUserRepository";

export class DisconnectUser {
    constructor(private userRepo: IUserRepository) {}
    async execute(username: string): Promise<void> {
        await this.userRepo.remove(username);
    }
}
