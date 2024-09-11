import { FetchGameQuestion } from '../../../src/usecases/queries/FetchGameQuestion';
import { IGameRepository } from '../../../src/interfaces/database/IGameRepository';
import { Game, Question } from '../../../src/domain/Game';

describe('FetchGameQuestion', () => {
    let fetchGameQuestion: FetchGameQuestion;
    let mockGameRepo: jest.Mocked<IGameRepository>;
    let mockGame: Game;
    let mockQuestion: Question;

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

        fetchGameQuestion = new FetchGameQuestion(mockGameRepo);

        mockQuestion = {
            id: 'question-id-123',
            questionText: 'question text',
            options: ['1', '2', '3', '4'],
            correctIndex: 3,
        };

        mockGame = {
            id: 'game-id-123',
            name: 'Test Game',
            questionCount: 3,
            state: 'waiting',
            players: [],
            questions: [mockQuestion],
            currentQuestionIndex: 0,
            userAnswers: new Map(),
            scores: [],
            getNextQuestion: jest.fn().mockReturnValue(mockQuestion),
        } as unknown as Game;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch the next question from the game', async () => {
        mockGameRepo.fetchByGameId.mockResolvedValue(mockGame);

        const result = await fetchGameQuestion.execute('game-id-123');

        expect(mockGameRepo.fetchByGameId).toHaveBeenCalledWith('game-id-123');
        expect(mockGame.getNextQuestion).toHaveBeenCalled();
        expect(mockGameRepo.save).toHaveBeenCalledWith('game-id-123', mockGame);
        expect(result).toEqual(mockQuestion);
    });

    it('should throw an error if there are no more questions', async () => {
        mockGame.getNextQuestion = jest.fn().mockReturnValue(null);
        mockGameRepo.fetchByGameId.mockResolvedValue(mockGame);

        await expect(fetchGameQuestion.execute('game-id-123')).rejects.toThrow('Out of questions');
        expect(mockGameRepo.fetchByGameId).toHaveBeenCalledWith('game-id-123');
        expect(mockGame.getNextQuestion).toHaveBeenCalled();
        expect(mockGameRepo.save).not.toHaveBeenCalled();
    });
});
