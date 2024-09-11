import { ChangePlayerInGameStatusReady } from '../../../src/usecases/commands/ChangePlayerInGameStatusReady';
import { IGameRepository } from '../../../src/interfaces/database/IGameRepository';
import { Game } from '../../../src/domain/Game';

describe('ChangePlayerInGameStatusReady', () => {
    let changePlayerInGameStatusReady: ChangePlayerInGameStatusReady;
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

        changePlayerInGameStatusReady = new ChangePlayerInGameStatusReady(mockGameRepo);

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
        } as unknown as jest.Mocked<Game>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should update the player status to ready', async () => {
        mockGameRepo.fetchByGameId.mockResolvedValue(mockGame);

        await changePlayerInGameStatusReady.execute('game-id-123', 'playerName');

        expect(mockGameRepo.fetchByGameId).toHaveBeenCalledWith('game-id-123');
        expect(mockGameRepo.updatePlayerIsReady).toHaveBeenCalledWith(mockGame, 'playerName', 1);
    });

    it('should throw an error if the game is not found', async () => {
        mockGameRepo.fetchByGameId.mockRejectedValue(new Error('Game not found'));

        await expect(changePlayerInGameStatusReady.execute('game-id-123', 'playerName')).rejects.toThrow('Game not found');
        expect(mockGameRepo.fetchByGameId).toHaveBeenCalledWith('game-id-123');
        expect(mockGameRepo.updatePlayerIsReady).not.toHaveBeenCalled();
    });
});
