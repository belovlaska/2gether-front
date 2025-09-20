import {api, Page} from "@/api/api";


export interface Game {
    id: number;
    name: string;
    genre: string;
    age_constraint: number;
    description: string;
    universe: string;
}


export async function GetGames(page: number, id: number): Promise<Page<Game[]>> {
    console.log(page, id);
    try {
        const res = await api.get(`/cafes/${id}/games?page=${page}`);
        return res.data;
    } catch (e: any) {
        console.error(e);
        return {content: [], totalPages: 0};
    }
}

export async function AddGame(id: number, game: Partial<Game>): Promise<Game | null> {
    try {
        game.age_constraint = 18;
        game.universe = 'universe';
        game.genre = 'genre';
        game.description = 'description';
        const res = await api.post(`/cafes/${id}/games`, game);
        return res.data;
    } catch (e: any) {
        console.error(e);
        return null;
    }
}

export async function DeleteGame(id: number): Promise<Game | null> {
    try {
        const res = await api.delete(`/games/${id}`);
        return res.data;
    } catch (e: any) {
        console.error(e);
        return null;
    }
}
