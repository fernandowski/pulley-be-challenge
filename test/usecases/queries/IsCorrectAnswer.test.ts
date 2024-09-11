import { IsCorrectAnswer } from '../../../src/usecases/queries/IsCorrectAnswer';
import { IGameRepository } from '../../../src/interfaces/database/IGameRepository';
import { Game } from '../../../src/domain/Game';

describe('IsCorrectAnswer', () => {
    let isCorrectAnswer: IsCorrectAnswer;
    let mockGameRepo: jest.Mocked<IGameRepository>;
    let mockGame: jest.Mocked<Game>;

    beforeEach(() => {
        mockGameRepo = {
            fetchByGameId: jest.fn(),
            addGame: jest.fn(),
            getId: jest.fn(),
            addPlayerToGame: jest.fn(),
            fetchAllGames: jest.fn(),
            updatePlayerIsReady: jest.fn(),
            updateGameStatus: jest.fn(),
            save: jest.fn(),
        };

        isCorrectAnswer = new IsCorrectAnswer(mockGameRepo);

        mockGame = {
            id: 'game-id-123',
            name: 'Test Game',
            questionCount: 3,
            state: 'waiting',
            players: [],
            questions: [],
            currentQuestionIndex: 0,
            userAnswers: new Map(),
            scores: [],
            checkCorrectAnswer: jest.fn(),
        } as unknown as jest.Mocked<Game>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return true if the answer is correct', async () => {
        mockGameRepo.fetchByGameId.mockResolvedValue(mockGame);
        mockGame.checkCorrectAnswer.mockReturnValue(true);

        const result = await isCorrectAnswer.execute('game-id-123', 'question-id-1', 2);

        expect(mockGameRepo.fetchByGameId).toHaveBeenCalledWith('game-id-123');
        expect(mockGame.checkCorrectAnswer).toHaveBeenCalledWith('question-id-1', 2);
        expect(result).toBe(true);
    });

    it('should return false if the answer is incorrect', async () => {
        mockGameRepo.fetchByGameId.mockResolvedValue(mockGame);
        mockGame.checkCorrectAnswer.mockReturnValue(false);

        const result = await isCorrectAnswer.execute('game-id-123', 'question-id-1', 3);

        expect(mockGameRepo.fetchByGameId).toHaveBeenCalledWith('game-id-123');
        expect(mockGame.checkCorrectAnswer).toHaveBeenCalledWith('question-id-1', 3);
        expect(result).toBe(false);
    });
});
