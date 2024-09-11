import {IUserRepository} from "../../interfaces/database/IUserRepository";
import {User} from "../../domain/User";

export class ConnectUser {
    constructor(private userRepository: IUserRepository) {
    }

    async execute(name: string): Promise<void> {
        const existingUser: User | null = await this.userRepository.findUserByName(name);

        if (existingUser) {
            throw new Error('Name already taken');
        }

        await this.userRepository.addUser(new User(name));
    }
}
