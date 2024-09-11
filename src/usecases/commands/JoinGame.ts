import {IGameRepository} from "../../interfaces/database/IGameRepository";
import {Game} from "../../domain/Game";

export class JoinGame {
    constructor(private gameRepo: IGameRepository) {}

    async execute (gameId: string, username: string): Promise<void> {
        const game: Game = await this.gameRepo.fetchByGameId(gameId);
        await this.gameRepo.addPlayerToGame(game, username);
    }
}
