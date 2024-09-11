import { InMemoryGameRepository } from '../../../../src/infrastructure/databases/memory/InMemoryGameRepository';
import { Game, GameState, PlayerStatus } from '../../../../src/domain/Game';

describe('InMemoryGameRepository', () => {
    let gameRepository: InMemoryGameRepository;
    let game: Game;
    const gameId = 'test-game-id';

    beforeEach(() => {
        gameRepository = new InMemoryGameRepository();
        game = new Game('Test Game', 3, gameId, GameState.Waiting, [], [], 0);
    });

    it('should add a new game', async () => {
        await gameRepository.addGame(game);
        const fetchedGame = await gameRepository.fetchByGameId(gameId);
        expect(fetchedGame).toEqual(game);
    });

    it('should generate a unique ID for a new game', () => {
        const id1 = gameRepository.getId();
        const id2 = gameRepository.getId();
        expect(id1).not.toEqual(id2);
    });

    it('should add a player to the game', async () => {
        await gameRepository.addGame(game);
        await gameRepository.addPlayerToGame(game, 'Alice');
        const updatedGame = await gameRepository.fetchByGameId(gameId);
        expect(updatedGame.players).toEqual([{ name: 'Alice', is_ready: PlayerStatus.Not_Ready }]);
    });

    it('should fetch all games', async () => {
        await gameRepository.addGame(game);
        const games = await gameRepository.fetchAllGames();
        expect(games).toEqual([game]);
    });

    it('should throw an error if game is not found by ID', async () => {
        await expect(gameRepository.fetchByGameId('non-existent-id')).rejects.toThrow('Game with ID non-existent-id not found');
    });

    it('should update player readiness status', async () => {
        await gameRepository.addGame(game);
        await gameRepository.addPlayerToGame(game, 'Alice');
        await gameRepository.updatePlayerIsReady(game, 'Alice', 1);
        const updatedGame = await gameRepository.fetchByGameId(gameId);
        expect(updatedGame.players[0].is_ready).toBe(PlayerStatus.Ready);
    });

    it('should throw an error if player is not found when updating readiness', async () => {
        await gameRepository.addGame(game);
        await expect(gameRepository.updatePlayerIsReady(game, 'NonExistentPlayer', 1)).rejects.toThrow(`Player with name NonExistentPlayer not found in game ${gameId}`);
    });

    it('should update the game status', async () => {
        await gameRepository.addGame(game);
        await gameRepository.updateGameStatus(gameId, GameState.Ended);
        const updatedGame = await gameRepository.fetchByGameId(gameId);
        expect(updatedGame.state).toBe(GameState.Ended);
    });

    it('should save the game state', async () => {
        game.state = GameState.Countdown;
        await gameRepository.save(gameId, game);
        const savedGame = await gameRepository.fetchByGameId(gameId);
        expect(savedGame.state).toBe(GameState.Countdown);
    });
});
