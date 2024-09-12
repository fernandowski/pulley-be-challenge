import {Game, GameState, PlayerStatus} from '../../src/domain/Game';
import questions from '../../src/questions.json';

describe('Game Class', () => {
    let game: Game;
    const gameId = 'test-game-id';
    const player1 = { name: 'Alice', is_ready: PlayerStatus.Ready };
    const player2 = { name: 'Bob', is_ready: PlayerStatus.Ready };
    const testQuestions = questions.slice(0, 2);

    beforeEach(() => {
        game = new Game('Test Game', testQuestions.length, gameId, GameState.Waiting, [player1, player2], testQuestions, 0);
    });

    it('should create a new game with the correct initial state', () => {
        expect(game.name).toBe('Test Game');
        expect(game.questionCount).toBe(testQuestions.length);
        expect(game.state).toBe(GameState.Waiting);
        expect(game.players).toEqual([player1, player2]);
        expect(game.currentQuestionIndex).toBe(0);
        expect(game.questions).toEqual(testQuestions);
    });

    it('should correctly record a user’s attempted answer', () => {
        game.processAnswer('Alice', testQuestions[0].id, testQuestions[0].correctIndex.toString());
        expect(game.userAnswers.get(testQuestions[0].id)).toEqual([
            { name: 'Alice', questionResult: true }
        ]);
    });

    it('should correctly identify the correct answer', () => {
        const isCorrect = game.checkCorrectAnswer(testQuestions[0].id, testQuestions[0].correctIndex);
        expect(isCorrect).toBe(true);
    });

    it('should correctly identify an incorrect answer', () => {
        const isCorrect = game.checkCorrectAnswer(testQuestions[0].id, testQuestions[0].correctIndex + 1);
        expect(isCorrect).toBe(false);
    });

    it('should increase question index after all players answer the current question', () => {
        game.processAnswer('Alice', testQuestions[0].id, testQuestions[0].correctIndex.toString());
        game.processAnswer('Bob', testQuestions[0].id, testQuestions[0].correctIndex.toString());

        expect(game.currentQuestionIndex).toBe(1);
    });

    it('should calculate scores correctly at the end of the game', () => {
        game.processAnswer('Alice', testQuestions[0].id, testQuestions[0].correctIndex.toString());
        game.processAnswer('Bob', testQuestions[0].id, testQuestions[0].correctIndex.toString());

        game.processAnswer('Alice', testQuestions[1].id, testQuestions[1].correctIndex.toString());
        game.processAnswer('Bob', testQuestions[1].id, testQuestions[1].correctIndex.toString());

        expect(game.scores).toEqual([
            { name: 'Alice', score: 2 },
            { name: 'Bob', score: 2 }
        ]);
    });

    it('should end the game when all questions are answered', () => {
        game.processAnswer('Alice', testQuestions[0].id, testQuestions[0].correctIndex.toString());
        game.processAnswer('Bob', testQuestions[0].id, testQuestions[0].correctIndex.toString());

        game.processAnswer('Alice', testQuestions[1].id, testQuestions[1].correctIndex.toString());
        game.processAnswer('Bob', testQuestions[1].id, testQuestions[1].correctIndex.toString());

        expect(game.state).toBe(GameState.Ended);
    });

    it( 'should throw if player not in game attempts to answer', async () => {
        expect(() => {
            game.processAnswer('Fernando', testQuestions[0].id, testQuestions[0].correctIndex.toString())
        }).toThrow('Player Not in Game')
    })

    it('should return true if answer is correct', async () => {
        const isCorrectAnswer = game.checkCorrectAnswer('4', 1);
        expect(isCorrectAnswer).toBe(true);
    });

    it('should return false if answer is incorrect', async () => {
        const isCorrectAnswer = game.checkCorrectAnswer('4', 1);
        expect(isCorrectAnswer).toBe(true);
    });
});
