export class User {
    constructor(public readonly name: string) {
        if(!name || name.trim() === '') throw new Error('User Name cannot be empty');
    }
}
