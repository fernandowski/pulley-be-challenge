import {IGameRepository} from "../../interfaces/database/IGameRepository";
import {Game, QuestionResult} from "../../domain/Game";
import {ILeaderboardRepository} from "../../interfaces/database/ILeaderboardRepository";

export class AnswerQuestion {
    constructor(private gameRepo: IGameRepository, private leaderboardRepo: ILeaderboardRepository) {
    }

    async execute(gameId: string, questionAsked: string, attemptedAnswer: number, username: string): Promise<void> {
        const game: Game = await this.gameRepo.fetchByGameId(gameId);
        game.processAnswer(username, questionAsked, attemptedAnswer.toString());
        await this.gameRepo.save(gameId, game);
        await this.updateLeaderboard(username, game, questionAsked);
    }

    async updateLeaderboard(username: string, game: Game, questionAskedId: string) {
        const leaderboardEntry = await this.leaderboardRepo.findByUserName(username);
        const userAnswers: QuestionResult[] = game.userAnswers.get(questionAskedId) || [];

        const answer = userAnswers.find((answer:QuestionResult) => {
            return answer.name === username;
        })

        let totalQuestions = leaderboardEntry?.total_questions || 0;
        let totalCorrectAnswers = leaderboardEntry?.correct_questions || 0;

        totalQuestions += 1;
        if (answer?.questionResult) {
            totalCorrectAnswers += 1;
        }

        const accuracy = totalCorrectAnswers / totalQuestions;

        const updatedLeaderboardEntry = {
            player_name: username,
            accuracy: accuracy,
            average_milliseconds: 0,
            correct_questions: totalCorrectAnswers,
            total_questions: totalQuestions,
            last_updated: Date.now()
        }

        await this.leaderboardRepo.save(username, updatedLeaderboardEntry);
    }
}
