import { IsRoundCompleted } from '../../../src/usecases/queries/IsRoundCompleted';
import { IGameRepository } from '../../../src/interfaces/database/IGameRepository';
import { Game } from '../../../src/domain/Game';

describe('IsRoundCompleted', () => {
    let isRoundCompleted: IsRoundCompleted;
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

        isRoundCompleted = new IsRoundCompleted(mockGameRepo);

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
            isRoundCompleted: jest.fn(),
        } as unknown as jest.Mocked<Game>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return true if the round is completed', async () => {
        mockGameRepo.fetchByGameId.mockResolvedValue(mockGame);
        mockGame.isRoundCompleted.mockReturnValue(true);

        const result = await isRoundCompleted.execute('game-id-123', 'question-id-1');

        expect(mockGameRepo.fetchByGameId).toHaveBeenCalledWith('game-id-123');
        expect(mockGame.isRoundCompleted).toHaveBeenCalledWith('question-id-1');
        expect(result).toBe(true);
    });

    it('should return false if the round is not completed', async () => {
        mockGameRepo.fetchByGameId.mockResolvedValue(mockGame);
        mockGame.isRoundCompleted.mockReturnValue(false);

        const result = await isRoundCompleted.execute('game-id-123', 'question-id-1');

        expect(mockGameRepo.fetchByGameId).toHaveBeenCalledWith('game-id-123');
        expect(mockGame.isRoundCompleted).toHaveBeenCalledWith('question-id-1');
        expect(result).toBe(false);
    });
});
