import {User} from "../../src/domain/User";

describe('User Domain Object', () => {

    it('should throw an error if the name empty string',() => {
        expect(() => new User('')).toThrow('User Name cannot be empty')
        expect(() => new User('  ')).toThrow('User Name cannot be empty')
        expect(() => new User(undefined as any)).toThrow('User Name cannot be empty')
    });

    it('should create a user with valid name', () => {
        const newUser = new User('userName');
        expect(newUser.name).toBe('userName')
    })
});
