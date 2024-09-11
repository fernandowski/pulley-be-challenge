import { DisconnectUser } from '../../../src/usecases/commands/DisconnectUser';
import { IUserRepository } from '../../../src/interfaces/database/IUserRepository';

describe('DisconnectUser', () => {
    let disconnectUser: DisconnectUser;
    let mockUserRepo: jest.Mocked<IUserRepository>;

    beforeEach(() => {
        mockUserRepo = {
            addUser: jest.fn(),
            findUserByName: jest.fn(),
            remove: jest.fn(),
        };

        disconnectUser = new DisconnectUser(mockUserRepo);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should remove the user from the repository', async () => {
        await disconnectUser.execute('username');

        expect(mockUserRepo.remove).toHaveBeenCalledWith('username');
    });

    it('should not throw an error if the user does not exist', async () => {
        mockUserRepo.remove.mockResolvedValueOnce();

        await expect(disconnectUser.execute('non-existent-username')).resolves.not.toThrow();

        expect(mockUserRepo.remove).toHaveBeenCalledWith('non-existent-username');
    });
});
