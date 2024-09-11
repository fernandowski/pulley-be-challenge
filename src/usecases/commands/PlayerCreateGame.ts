import {IGameRepository} from "../../interfaces/database/IGameRepository";
import {Game} from "../../domain/Game";

export class PlayerCreateGame {
    constructor(private gameRepo: IGameRepository) {}

    async execute(name: string, questionCount: number): Promise<string> {
        const newGame: Game = Game.createNewGame(name, questionCount, this.gameRepo.getId());
        await this.gameRepo.save(newGame.id, newGame);
        return newGame.id;
    }
}
