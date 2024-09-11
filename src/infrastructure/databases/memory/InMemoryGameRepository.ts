import { v4 as uuidv4 } from 'uuid';
import { IGameRepository } from "../../../interfaces/database/IGameRepository";
import { Game, GameState, Player, PlayerStatus } from "../../../domain/Game";

export class InMemoryGameRepository implements IGameRepository {
    private games: Map<string, Game> = new Map();

    async addGame(game: Game): Promise<void> {
        this.games.set(game.id, game);
    }

    getId(): string {
        return uuidv4();
    }

    async addPlayerToGame(game: Game, playerName: string): Promise<void> {
        const player: Player = { name: playerName, is_ready: PlayerStatus.Not_Ready };
        game.players.push(player);
        this.games.set(game.id, game);
    }

    async fetchAllGames(): Promise<Game[]> {
        return Array.from(this.games.values());
    }

    async fetchByGameId(gameId: string): Promise<Game> {
        const game = this.games.get(gameId);
        if (!game) {
            throw new Error(`Game with ID ${gameId} not found`);
        }
        return game;
    }

    async updatePlayerIsReady(game: Game, playerName: string, newStatus: number): Promise<void> {

        const player = game.players.find(p => p.name === playerName);
        if (!player) {
            throw new Error(`Player with name ${playerName} not found in game ${game.id}`);
        }

        player.is_ready = newStatus === 1 ? PlayerStatus.Ready : PlayerStatus.Not_Ready;
        this.games.set(game.id, game);
    }

    async updateGameStatus(gameId: string, newStatus: GameState): Promise<void> {
        const game = this.games.get(gameId);
        if (!game) {
            throw new Error(`Game with ID ${gameId} not found`);
        }

        game.state = newStatus;
        this.games.set(gameId, game);
    }

    async save(gameId: string, game: Game): Promise<void> {
        this.games.set(gameId, game);
    }
}
