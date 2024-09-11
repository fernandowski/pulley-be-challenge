import {IGameRepository} from "../../interfaces/database/IGameRepository";
import {Question} from "../../domain/Game";

export class FetchGameQuestion {
    constructor(private gameRepo: IGameRepository) {
    }

    async execute(gameId: string): Promise<Question> {
        const game = await this.gameRepo.fetchByGameId(gameId);
        const question = game.getNextQuestion();

        if (!question) {
            throw new Error('Out of questions');
        }

        await this.gameRepo.save(gameId, game);
        return question;
    }
}
