
export interface ILeaderboardRepository {
    fetchAllEntries(): Promise<any[]>;
    findByUserName(username: string): Promise<any>;
    save(username: string, record: any): Promise<void>
}


