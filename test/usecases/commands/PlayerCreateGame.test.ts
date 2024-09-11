import { PlayerCreateGame } from '../../../src/usecases/commands/PlayerCreateGame';
import { IGameRepository } from '../../../src/interfaces/database/IGameRepository';
import { Game } from '../../../src/domain/Game';

describe('PlayerCreateGame', () => {
    let playerCreateGame: PlayerCreateGame;
    let mockGameRepo: jest.Mocked<IGameRepository>;
    let mockGame: jest.Mocked<Game>;

    beforeEach(() => {
        mockGameRepo = {
            fetchByGameId: jest.fn(),
            addGame: jest.fn(),
            getId: jest.fn().mockReturnValue('new-game-id'),
            addPlayerToGame: jest.fn(),
            fetchAllGames: jest.fn(),
            updatePlayerIsReady: jest.fn(),
            updateGameStatus: jest.fn(),
            save: jest.fn(),
        };

        playerCreateGame = new PlayerCreateGame(mockGameRepo);

        mockGame = {
            id: 'new-game-id',
            name: 'New Game',
            questionCount: 5,
            state: 'waiting',
            players: [],
            questions: [],
            currentQuestionIndex: 0,
            userAnswers: new Map(),
            scores: [],
        } as unknown as jest.Mocked<Game>;

        jest.spyOn(Game, 'createNewGame').mockReturnValue(mockGame);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new game and save it', async () => {
        const result = await playerCreateGame.execute('New Game', 5);

        expect(Game.createNewGame).toHaveBeenCalledWith('New Game', 5, 'new-game-id');
        expect(mockGameRepo.save).toHaveBeenCalledWith('new-game-id', mockGame);
        expect(result).toBe('new-game-id');
    });
});
