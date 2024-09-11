import {ConnectUser} from "../../../src/usecases/commands/ConnectUser";
import {IUserRepository} from "../../../src/interfaces/database/IUserRepository";
import {User} from "../../../src/domain/User";

describe('ConnectUser Use Case', () => {
    let mockUserRepository: jest.Mocked<IUserRepository>;
    let connectUser: ConnectUser;

    beforeEach(() => {
        mockUserRepository = {
            findUserByName: jest.fn(),
            remove: jest.fn(),
            addUser: jest.fn(),
        } as jest.Mocked<IUserRepository>;

        connectUser = new ConnectUser(mockUserRepository);
    });

    it('should throw an error if the name is already taken', async () => {
        const existingUser = new User('existingUser');
        mockUserRepository.findUserByName.mockResolvedValue(existingUser);

        await expect(connectUser.execute('existingUser'))
            .rejects
            .toThrow('Name already taken');
    });

    it('should add a new user if the name is not taken', async () => {
        mockUserRepository.findUserByName.mockResolvedValue(null);

        await connectUser.execute('newUser');

        expect(mockUserRepository.addUser).toHaveBeenCalledWith(new User('newUser'));
    });
});
