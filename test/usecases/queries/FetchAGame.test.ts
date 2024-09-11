import {FetchAGame} from '../../../src/usecases/queries/FetchAGame';
import {IGameRepository} from '../../../src/interfaces/database/IGameRepository';
import {Game, GameState} from '../../../src/domain/Game';

describe('FetchAGame', () => {
    let fetchAGame: FetchAGame;
    let mockGameRepo: jest.Mocked<IGameRepository>;
    let mockGame: Game;

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
        fetchAGame = new FetchAGame(mockGameRepo);

        mockGame = new Game('Test Game', 3, 'game-id-123', GameState.Waiting, [], [], 0);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch a game by its ID', async () => {
        mockGameRepo.fetchByGameId.mockResolvedValue(mockGame);

        const result = await fetchAGame.execute('game-id-123');

        expect(mockGameRepo.fetchByGameId).toHaveBeenCalledWith('game-id-123');
        expect(result).toEqual(mockGame);
    });

    it('should throw an error if game is not found', async () => {
        mockGameRepo.fetchByGameId.mockRejectedValue(new Error('Game not found'));

        await expect(fetchAGame.execute('non-existent-id')).rejects.toThrow('Game not found');
        expect(mockGameRepo.fetchByGameId).toHaveBeenCalledWith('non-existent-id');
    });
});
