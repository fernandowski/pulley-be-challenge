import { User } from '../../domain/User'

export interface IUserRepository {
    addUser(user: User): Promise<void>;
    remove(user: string): Promise<void>
    findUserByName(name: string): Promise<User | null>;
}


