import {api, Page} from "@/api/api";
import {Cafe} from "@/api/cafe";

export interface Lobby {
    id: number;
    cafe: Cafe;
    description: string;
    date: number;
    maxParticipants: number;
    currentParticipants: number;
    participants: {id: number}[];
}


export async function CreateLobby(id: number, lobby: Partial<Lobby>): Promise<Lobby | null> {
    try {
        const res = await api.post(`/cafes/${id}/lobbies`, lobby);
        return res.data;
    } catch (e: any) {
        console.error(e);
        return null;
    }
}

export async function GetLobbies(page: number, id: number): Promise<Page<Lobby[]>> {
    try {
        const res = await api.get(`/cafes/${id}/lobbies?page=${page}`);
        return res.data;
    } catch (e: any) {
        console.error(e);
        return {content: [], totalPages: 0};
    }
}

export async function GetUserLobbies(page: number, id: number): Promise<Page<Lobby[]>> {
    try {
        const res = await api.get(`/users/${id}/lobbies?page=${page}`);
        return res.data;
    } catch (e: any) {
        console.warn(e);
        return {content: [], totalPages: 0};
    }
}

export async function DeleteLobby(id: number) {
    try {
        await api.delete(`/lobbies/${id}`);
    } catch (e: any) {
        console.warn(e);
    }
}

export async function JoinLobby(id: number) {
    try {
        await api.post(`/lobbies/${id}/users`);
    } catch (e: any) {
        console.warn(e);
    }
}

export async function UnjoinLobby(id: number) {
    try {
        await api.delete(`/lobbies/${id}/users`);
    } catch (e: any) {
        console.warn(e);
    }
}