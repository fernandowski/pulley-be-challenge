import {FetchGames} from '../../../src/usecases/queries/FetchGames';
import {IGameRepository} from '../../../src/interfaces/database/IGameRepository';
import {Game, GameState} from '../../../src/domain/Game';

describe('FetchGames', () => {
    let fetchGames: FetchGames;
    let mockGameRepo: jest.Mocked<IGameRepository>;
    let mockGames: Game[];

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

        fetchGames = new FetchGames(mockGameRepo);

        mockGames = [
            new Game('Game 1', 3, 'game-id-1', GameState.Waiting, [], [], 0),
            new Game('Game 2', 5, 'game-id-2', GameState.Countdown, [], [], 0),
            new Game('Game 3', 7, 'game-id-3', GameState.Ended, [], [], 0),
        ];
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch all games from the repository', async () => {
        mockGameRepo.fetchAllGames.mockResolvedValue(mockGames);

        const result = await fetchGames.execute();

        expect(mockGameRepo.fetchAllGames).toHaveBeenCalled();
        expect(result).toEqual(mockGames);
    });

    it('should return an empty array if no games are found', async () => {
        mockGameRepo.fetchAllGames.mockResolvedValue([]);

        const result = await fetchGames.execute();

        expect(mockGameRepo.fetchAllGames).toHaveBeenCalled();
        expect(result).toEqual([]);
    });
});
