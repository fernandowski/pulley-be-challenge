import {IGameRepository} from "../../interfaces/database/IGameRepository";
import {Game} from "../../domain/Game";

export class PlayerStartGame {
    constructor(private gameRepo: IGameRepository) {
    }

    async execute(gameId: string): Promise<void> {
        const game: Game = await this.gameRepo.fetchByGameId(gameId);
        game.start();
        await this.gameRepo.save(gameId, game);
    }
}
