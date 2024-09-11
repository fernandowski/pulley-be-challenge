import { AnswerQuestion } from '../../../src/usecases/commands/AnswerQuestion';
import { IGameRepository } from '../../../src/interfaces/database/IGameRepository';
import { Game } from '../../../src/domain/Game';

describe('AnswerQuestion', () => {
    let answerQuestion: AnswerQuestion;
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

        answerQuestion = new AnswerQuestion(mockGameRepo);

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
            processAnswer: jest.fn(),
        } as unknown as jest.Mocked<Game>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should process the answer and save the game', async () => {
        mockGameRepo.fetchByGameId.mockResolvedValue(mockGame);

        await answerQuestion.execute('game-id-123', 'question-id-1', 2, 'username');

        expect(mockGameRepo.fetchByGameId).toHaveBeenCalledWith('game-id-123');
        expect(mockGame.processAnswer).toHaveBeenCalledWith('username', 'question-id-1', '2');
        expect(mockGameRepo.save).toHaveBeenCalledWith('game-id-123', mockGame);
    });

    it('should throw an error if the game is not found', async () => {
        mockGameRepo.fetchByGameId.mockRejectedValue(new Error('Game not found'));

        await expect(answerQuestion.execute('game-id-123', 'question-id-1', 2, 'username')).rejects.toThrow('Game not found');
        expect(mockGameRepo.fetchByGameId).toHaveBeenCalledWith('game-id-123');
        expect(mockGame.processAnswer).not.toHaveBeenCalled();
        expect(mockGameRepo.save).not.toHaveBeenCalled();
    });
});
