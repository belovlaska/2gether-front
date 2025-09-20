import { api, Page } from "@/api/api";

export interface Hookah {
    tobacco: string;
    strength: number;
    cost: number;
    taste: string;
    id: number;
}

export async function GetHookahs(page: number, cafeId: number): Promise<Page<Hookah[]>> {
    try {
        const res = await api.get(`/cafes/${cafeId}/hookahs?page=${page}`);
        return res.data;
    } catch (e: any) {
        console.error(e);
        return { content: [], totalPages: 0 };
    }
}

export async function AddHookah(cafeId: number, hookah: Partial<Hookah>): Promise<Hookah | null> {
    try {
        const res = await api.post(`/cafes/${cafeId}/hookahs`, hookah);
        return res.data;
    } catch (e: any) {
        console.error(e);
        return null;
    }
}

export async function DeleteHookah(id: number): Promise<Hookah | null> {
    try {
        const res = await api.delete(`/hookahs/${id}`);
        return res.data;
    } catch (e: any) {
        console.error(e);
        return null;
    }
}