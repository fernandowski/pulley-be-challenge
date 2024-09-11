import http from 'http';
import cors from 'cors';
import express from 'express';
import {WebSocketServer} from 'ws';
import {WebSocketController, WebSocketWithMeta} from './controllers/WebSocketController';
import {ConnectUser} from './usecases/commands/ConnectUser';
import {InMemoryUserRepository} from './infrastructure/databases/memory/InMemoryUserRepository';
import {InMemoryGameRepository} from "./infrastructure/databases/memory/InMemoryGameRepository";
import {PlayerCreateGame} from "./usecases/commands/PlayerCreateGame";
import {JoinGame} from "./usecases/commands/JoinGame";
import {FetchGames} from "./usecases/queries/FetchGames";
import {Game, GameState, Player, Question} from "./domain/Game";
import {ChangePlayerInGameStatusReady} from "./usecases/commands/ChangePlayerInGameStatusReady";
import {PlayerStartGame} from "./usecases/commands/PlayerStartGame";
import {FetchGameQuestion} from "./usecases/queries/FetchGameQuestion";
import {AnswerQuestion} from "./usecases/commands/AnswerQuestion";
import {IsRoundCompleted} from "./usecases/queries/IsRoundCompleted";
import {FetchAGame} from "./usecases/queries/FetchAGame";
import {IsCorrectAnswer} from "./usecases/queries/IsCorrectAnswer";
import {DisconnectUser} from "./usecases/commands/DisconnectUser";

const app = express();
app.use(cors());

const userRepository = new InMemoryUserRepository();
const gameRepository = new InMemoryGameRepository();

const addGameCommand = new PlayerCreateGame(gameRepository);
const joinGameCommand = new JoinGame(gameRepository);
const changePlayerInGameStatusCommand = new ChangePlayerInGameStatusReady(gameRepository);
const playerStartGame = new PlayerStartGame(gameRepository);
const answerQuestionCommand = new AnswerQuestion(gameRepository);
const connectUserCommand = new ConnectUser(userRepository);

const fetchAGameQuery = new FetchAGame(gameRepository);
const isCorrectAnswerQuery = new IsCorrectAnswer(gameRepository);
const isRoundCompletedQuery = new IsRoundCompleted(gameRepository);
const fetchAllGamesQuery = new FetchGames(gameRepository);
const fetchNextQuestionQuery = new FetchGameQuestion(gameRepository);
const disconnectUserCommand = new DisconnectUser(userRepository);

enum MessageTypes {
    PlayerConnect= 'player_connect',
    PlayerDisconnect = 'player_disconnect',
    GameCreate = 'game_create',
    GamePlayerJoin = 'game_player_join',
    GamePlayerCount = 'game_player_count',
    GamePlayerEnter = 'game_player_enter',
    GamePlayerReady = 'game_player_ready',
    GameStart = 'game_start',
    GameQuestion = 'game_question',
    GamePlayerCorrect = 'game_player_correct',
    GamePlayerIncorrect = 'game_player_incorrect',
    GameEnd = 'game_end',
    GameDestroy = 'game_destroy',
    GameStateChange = 'game_state_change'
}

app.get('/games', (req, res) => {
    fetchAllGamesQuery.execute()
        .then((games: Game[]) => {
            const response = games.map((game) => {
                return {
                    id: game.id,
                    name: game.name,
                    question_count: game.questionCount,
                    state: game.state,
                    player_count: game.players.length
                }
            });
            res.json(response);
        })
});

const useCaseHandlers = {
    connect: async (ws: WebSocketWithMeta, payload: any, broadcastToAll: (message: any) => void) => {
        await connectUserCommand.execute(payload.name);
        broadcastToAll({
            type: MessageTypes.PlayerConnect,
            player: payload.name,
            payload: {}
        });
    },
    disconnect: async (ws: WebSocketWithMeta, payload: any, broadcastToAll: (message: any) => void) => {
        console.log(`user ${payload.name} has disconnected.`);
        await disconnectUserCommand.execute(payload.name);
        broadcastToAll({
            type: MessageTypes.PlayerDisconnect,
            player: payload.name,
            payload: {}
        });
    },
    create: async (ws: WebSocketWithMeta, payload: any, broadcastToAll: (message: any) => void) => {
        const gameId = await addGameCommand.execute(payload.name, payload.question_count);
        const game = await fetchAGameQuery.execute(gameId);

        broadcastToAll({
            id: game.id,
            payload: {
                name: game.name,
                question_count: game.questionCount
            },
            type: MessageTypes.GameCreate
        })
    },
    join: async (ws: WebSocketWithMeta, payload: any, broadcastToAll: (message: any) => void)=> {
        const name = ws.metadata?.name || '';
        await joinGameCommand.execute(payload.game_id, name);
        const game = await fetchAGameQuery.execute(payload.game_id);

        broadcastToAll({
            id: payload.game_id,
            payload: {
                player: name
            },
            type: MessageTypes.GamePlayerJoin
        })

        const playerNames = game.players.map((player: Player) => {
            return player.name;
        })

        const playerStatus: {[key: string]: Boolean} = {};
        game.players.forEach((player: Player) => {
            playerStatus[player.name] = !!player.is_ready;
        })


        broadcastToAll({
            id: payload.game_id,
            payload: {
                player_count: playerNames.length
            },
            type: MessageTypes.GamePlayerCount
        })

        ws.send(JSON.stringify(
            {
                id: payload.game_id,
                payload: {
                    name: name,
                    players: playerNames,
                    players_ready: playerStatus,
                    question_count: game.questionCount
                },
                type: MessageTypes.GamePlayerEnter
            }
        ));
    },
    ready: async (ws: WebSocketWithMeta, payload: any, broadcastToAll: (message: any) => void)=> {
        const name = ws.metadata?.name || '';
        await changePlayerInGameStatusCommand.execute(payload.game_id, name);

        broadcastToAll({
            id: payload.game_id,
            payload: {
                player: name
            },
            type: MessageTypes.GamePlayerReady
        })
    },
    start: async (ws: WebSocketWithMeta, payload: any, broadcastToAll: (message: any) => void) => {
        await playerStartGame.execute(payload.game_id);
        broadcastToAll({
            id: payload.game_id,
            payload: {},
            type: MessageTypes.GameStart
        });

        const question : Question = await fetchNextQuestionQuery.execute(payload.game_id);
        broadcastToAll({
            id: payload.game_id,
            payload: {
                id: question.id,
                options: question.options,
                question: question.questionText,
                seconds: 3600
            },
            type: MessageTypes.GameQuestion
        });
    },
    answer: async (ws: WebSocketWithMeta, payload: any, broadcastToAll: (message: any) => void) => {
        const name = ws.metadata?.name || '';
        await answerQuestionCommand.execute(payload.game_id, payload.question_id, payload.index, name)

        let eventPayload = {
                id: payload.game_id,
                player: name
        }

        const isCorrectAnswer = await isCorrectAnswerQuery.execute(payload.game_id, payload.question_id, payload.index);
        let eventType = ''
        if (isCorrectAnswer) {
            eventType = MessageTypes.GamePlayerCorrect;
        } else {
            eventType = MessageTypes.GamePlayerIncorrect;
        }

        broadcastToAll({
            id: payload.game_id,
            payload: eventPayload,
            type: eventType
        });

        const nextQuestion = await isRoundCompletedQuery.execute(payload.game_id, payload.question_id);

        if (nextQuestion) {
            const question : Question = await fetchNextQuestionQuery.execute(payload.game_id);
            broadcastToAll({
                id: payload.game_id,
                payload: {
                    id: question.id,
                    options: question.options,
                    question: question.questionText,
                    seconds: 3600
                },
                type: MessageTypes.GameQuestion
            });
        }

        const game = await fetchAGameQuery.execute(payload.game_id);

        if (game.state === GameState.Ended) {
            broadcastToAll({
                id: payload.game_id,
                payload: {
                    scores: game.scores
                },
                type: MessageTypes.GameEnd
            });

            broadcastToAll({
                id: payload.game_id,
                payload: {},
                type: MessageTypes.GameDestroy
            });

            broadcastToAll({
                id: payload.game_id,
                payload: {
                    state: 'ended'
                },
                type: MessageTypes.GameStateChange
            });
        }
    }
};

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const webSocketController = new WebSocketController(wss, useCaseHandlers);

wss.on('connection', (ws: WebSocketWithMeta, request: { url: string; }) => {
    webSocketController.handleConnection(ws, request.url!);
});

server.listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
});
