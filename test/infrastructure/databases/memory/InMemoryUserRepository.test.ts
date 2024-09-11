import { InMemoryUserRepository } from '../../../../src/infrastructure/databases/memory/InMemoryUserRepository';
import { User } from '../../../../src/domain/User';

describe('InMemoryUserRepository', () => {
    let userRepository: InMemoryUserRepository;
    let user: User;

    beforeEach(() => {
        userRepository = new InMemoryUserRepository();
        user = new User('Alice');
    });

    it('should add a new user', async () => {
        await userRepository.addUser(user);
        const fetchedUser = await userRepository.findUserByName('Alice');
        expect(fetchedUser).toEqual(user);
    });

    it('should return null if user is not found by name', async () => {
        const fetchedUser = await userRepository.findUserByName('NonExistentUser');
        expect(fetchedUser).toBeNull();
    });

    it('should remove a user by name', async () => {
        await userRepository.addUser(user);
        await userRepository.remove('Alice');
        const fetchedUser = await userRepository.findUserByName('Alice');
        expect(fetchedUser).toBeNull();
    });

    it('should not throw an error when removing a non-existent user', async () => {
        await expect(userRepository.remove('NonExistentUser')).resolves.not.toThrow();
    });
});
