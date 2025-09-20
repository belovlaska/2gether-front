import { api, Page } from "@/api/api";

export interface Drink {
    id: number;
    name: string;
    ingredients: string;
    cost: number;
    isAlcoholic: boolean;
}

export async function GetDrinks(page: number, cafeId: number): Promise<Page<Drink[]>> {
    try {
        const res = await api.get(`/cafes/${cafeId}/drinks?page=${page}`);
        return res.data;
    } catch (e: any) {
        console.error(e);
        return { content: [], totalPages: 0 };
    }
}

export async function AddDrink(cafeId: number, drink: Partial<Drink>): Promise<Drink | null> {
    try {
        const res = await api.post(`/cafes/${cafeId}/drinks`, drink);
        return res.data;
    } catch (e: any) {
        console.error(e);
        return null;
    }
}

export async function DeleteDrink(id: number): Promise<Drink | null> {
    try {
        const res = await api.delete(`/drinks/${id}`);
        return res.data;
    } catch (e: any) {
        console.error(e);
        return null;
    }
}