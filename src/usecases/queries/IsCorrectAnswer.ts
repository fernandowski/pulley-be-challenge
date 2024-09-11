import {IGameRepository} from "../../interfaces/database/IGameRepository";

export class IsCorrectAnswer {
    constructor(private gameRepo: IGameRepository) {
    }

    async execute(gameId: string, questionAsked: string, attemptedAnswer: number): Promise<boolean> {
        const game = await this.gameRepo.fetchByGameId(gameId);
        return game.checkCorrectAnswer(questionAsked, attemptedAnswer);
    }
}
