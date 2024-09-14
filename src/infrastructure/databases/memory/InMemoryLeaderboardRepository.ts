import {ILeaderboardRepository} from "../../../interfaces/database/ILeaderboardRepository";

export class InMemoryLeaderboardRepository implements ILeaderboardRepository {
    private leadboard = new Map();
    async fetchAllEntries(): Promise<any[]> {
        return Array.from(this.leadboard.values());
    }

    async findByUserName(username): Promise<any> {
        return this.leadboard.get(username) || null
    }

    async save(username: string, record: any): Promise<void> {
        this.leadboard.set(username, record)
    }

}
