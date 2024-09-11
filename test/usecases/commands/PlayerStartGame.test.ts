import { PlayerStartGame } from '../../../src/usecases/commands/PlayerStartGame';
import { IGameRepository } from '../../../src/interfaces/database/IGameRepository';
import { Game, GameState } from '../../../src/domain/Game';

describe('PlayerStartGame', () => {
    let playerStartGame: PlayerStartGame;
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

        playerStartGame = new PlayerStartGame(mockGameRepo);

        mockGame = {
            id: 'game-id-123',
            name: 'Test Game',
            questionCount: 3,
            state: GameState.Waiting,
            players: [],
            questions: [],
            currentQuestionIndex: 0,
            userAnswers: new Map(),
            scores: [],
            start: jest.fn(),
        } as unknown as jest.Mocked<Game>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should start the game and save it', async () => {
        mockGameRepo.fetchByGameId.mockResolvedValue(mockGame);

        await playerStartGame.execute('game-id-123');

        expect(mockGameRepo.fetchByGameId).toHaveBeenCalledWith('game-id-123');
        expect(mockGame.start).toHaveBeenCalled();
        expect(mockGameRepo.save).toHaveBeenCalledWith('game-id-123', mockGame);
    });
});
