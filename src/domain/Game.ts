import questions from '../../src/questions.json'

export type GameId = string

export interface ScoreResult {
    name: string;
    score: number;
}
export enum PlayerStatus {
    Ready = 1,
    Not_Ready = 0
}

export enum GameState {
    Waiting = 'waiting',
    Countdown = 'countdown',
    Question = 'question',
    Ended = 'ended'
}

export interface Player {
    name: string;
    is_ready: PlayerStatus;
}

export interface QuestionResult {
    name: string;
    questionResult: boolean;
}

export interface Question {
    id: string,
    questionText: string,
    options: string [],
    correctIndex: number
}


export class Game {
    public readonly name : string;
    public questionCount: number;
    public readonly id: GameId;
    public state: GameState;
    public readonly players: Player[];
    public readonly questions: Question[];
    public currentQuestionIndex: number;
    public userAnswers: Map<string, QuestionResult[]> = new Map();
    public scores: ScoreResult[] = [];

    constructor(name: string, questionCount: number, id: GameId, state: GameState, players: Player[], q: Question[], currentQuestionIndex: number) {
        this.name = name;
        this.questionCount = questionCount;
        this.id = id;
        this.state = state;
        this.players = players;
        this.questions = q;
        this.currentQuestionIndex = currentQuestionIndex;
    }

    static createNewGame(name: string, questionCount: number, id: GameId): Game {
        this.shuffle(questions)
        return new Game(name, questionCount, id, GameState.Waiting, [], questions, 0);
    }

    static shuffle<T,>(arr: T[]) {
        let j, x, index;
        for (index = arr.length - 1; index > 0; index--) {
            j = Math.floor(Math.random() * (index + 1));
            x = arr[index];
            arr[index] = arr[j];
            arr[j] = x;
        }
    }

    public getNextQuestion(): Question | null {
        if (this.currentQuestionIndex >= this.questions.length) {
            return null;
        }

        return this.questions[this.currentQuestionIndex];
    }

    public checkCorrectAnswer(askedQuestionId: string, attemptedAnswerIndex: number) {
        const question: Question | undefined = this.questions.find(question => question.id === askedQuestionId);

        if (question === undefined) {
            return false;
        }

        return question.correctIndex === attemptedAnswerIndex;
    }

    private increaseQuestionIndex(): void {
        if (this.currentQuestionIndex < this.questions.length) {
            this.currentQuestionIndex += 1;
        }
    }

    private recordUserAttemptedAnswer(username: string, questionId: string, attemptedAnswerIndex: string): void {
        if (!this.userAnswers.has(questionId)) {
            this.userAnswers.set(questionId, []);
        }

        const userAnswers = this.userAnswers.get(questionId);
        if (userAnswers) {
            userAnswers.push({name: username, questionResult: this.checkCorrectAnswer(questionId, parseInt(attemptedAnswerIndex))});
            this.userAnswers.set(questionId, userAnswers);
        }
    }

    private isValidQuestion(questionId: string): boolean {
        return this.questions.some((question: Question) => {
            return question.id === questionId;
        })
    }

    public processAnswer(username: string, questionAsked: string, attemptedAnswer: string): void {
        if (!this.canAnswerQuestion(username)) {
            throw new Error('Player Not in Game');
        }

        if (!this.isValidQuestion(questionAsked)) {
            throw new Error('Invalid Question ID');
        }

        this.recordUserAttemptedAnswer(username, questionAsked, attemptedAnswer)

        if (this.moveToNextQuestion(questionAsked)) {
            this.increaseQuestionIndex();
        }

        if (this.isGameFinished()) {
            this.calculateScore();
            this.finish();
        }
    }

    private canAnswerQuestion(username: string): boolean {
        return this.players.some((player: Player) => {
            return player.name === username
        });
    }

    public isRoundCompleted(questionAsked: string): boolean {
        const users = this.userAnswers.get(questionAsked)
        if (!users) {
            return false
        }

        return users.length === this.players.length;
    }

    private moveToNextQuestion(questionAsked: string): boolean {
        const users = this.userAnswers.get(questionAsked)
        if (!users) {
            return false
        }

        if (users.length === this.players.length) {
            this.questionCount--;
            return true;
        }

        return false;
    }

    private isGameFinished(): boolean {
        return this.questionCount <= 0;
    }

    private calculateScore(): void {
        const scoreMap: Map<string, number> = new Map();

        this.userAnswers.forEach((results: QuestionResult[]) => {
            results.forEach((result: QuestionResult) => {
                const currentScore = scoreMap.get(result.name) || 0;
                const newScore = currentScore + (result.questionResult ? 1 : 0);
                scoreMap.set(result.name, newScore);
            });
        });

        const finalScores: ScoreResult[] = [];
        scoreMap.forEach((score, name) => {
            finalScores.push({ name, score });
        });

        this.scores = finalScores;
    }

    private finish(): void {
        this.state = GameState.Ended;
    }

    public start(): void {
        this.state = GameState.Countdown;
    }
}
