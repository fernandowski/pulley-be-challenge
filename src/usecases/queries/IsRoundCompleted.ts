import {Game} from "../../domain/Game";
import {IGameRepository} from "../../interfaces/database/IGameRepository";

export class IsRoundCompleted {
    constructor(private gameRepo: IGameRepository) {
    }
    async execute(gameId: string, questionAskedId: string): Promise<boolean> {
        const game: Game = await this.gameRepo.fetchByGameId(gameId);

        return game.isRoundCompleted(questionAskedId);
    }
}
