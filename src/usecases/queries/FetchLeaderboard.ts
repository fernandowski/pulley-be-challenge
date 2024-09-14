import {ILeaderboardRepository} from "../../interfaces/database/ILeaderboardRepository";

export class FetchLeaderboard {
    constructor(private iLeaderboardRepo: ILeaderboardRepository) {
    }

    async execute() {
        const records = await this.iLeaderboardRepo.fetchAllEntries();
        return records.sort((entry1, entry2) => {
            return entry2.accuracy - entry1.accuracy;
        });
    }
}
