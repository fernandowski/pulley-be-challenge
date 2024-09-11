import { IUserRepository } from "../../../interfaces/database/IUserRepository";
import { User } from "../../../domain/User";
export class InMemoryUserRepository implements IUserRepository {
    private users: Map<string, User> = new Map();

    async addUser(user: User): Promise<void> {
        this.users.set(user.name, user);
    }

    async findUserByName(name: string): Promise<User | null> {
        return this.users.get(name) || null;
    }

    async remove(user: string): Promise<void> {
        this.users.delete(user)
    }
}
