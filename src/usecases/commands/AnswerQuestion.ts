import {IGameRepository} from "../../interfaces/database/IGameRepository";
import {Game} from "../../domain/Game";

export class AnswerQuestion {
    constructor(private gameRepo: IGameRepository) {
    }

    async execute(gameId: string, questionAsked: string, attemptedAnswer: number, username: string): Promise<void> {
        const game: Game = await this.gameRepo.fetchByGameId(gameId);
        game.processAnswer(username, questionAsked, attemptedAnswer.toString());
        await this.gameRepo.save(gameId, game);
    }
}
