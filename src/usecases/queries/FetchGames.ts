import {IGameRepository} from "../../interfaces/database/IGameRepository";
import {Game} from "../../domain/Game";

export class FetchGames {
    constructor(private gameRepo: IGameRepository) {
    }
    async execute(): Promise<Game[]> {
        return await this.gameRepo.fetchAllGames();
    }
}
