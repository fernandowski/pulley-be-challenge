import {IGameRepository} from "../../interfaces/database/IGameRepository";
import {Game} from "../../domain/Game";

export class FetchAGame {
    constructor(private gameRepo: IGameRepository) {}

    async execute(gameId: string): Promise<Game> {
        return this.gameRepo.fetchByGameId(gameId);
    }
}
