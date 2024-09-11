import {Game, GameState} from "../../domain/Game";

export interface  IGameRepository {
    addGame(game: Game): Promise<void>
    getId(): string
    addPlayerToGame(game: Game, playerName: string): Promise<void>
    fetchAllGames(): Promise<Game[]>
    fetchByGameId(gameId: string): Promise<Game>
    updatePlayerIsReady(game: Game, playerName: string, newStatus: number): Promise<void>
    updateGameStatus(gameId: string, newStatus: GameState): Promise<void>
    save(gameId: string, game: Game): Promise<void>
}
