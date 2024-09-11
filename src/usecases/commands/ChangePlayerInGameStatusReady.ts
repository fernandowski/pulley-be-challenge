import {IGameRepository} from "../../interfaces/database/IGameRepository";
import {Game} from "../../domain/Game";

export class ChangePlayerInGameStatusReady {
    constructor(private gameRepo: IGameRepository) {}

    async execute(gameId: string, playerName: string) {
        const game: Game = await this.gameRepo.fetchByGameId(gameId);
        await this.gameRepo.updatePlayerIsReady(game, playerName, 1);
    }
}
