import {api, Page} from "@/api/api";


export interface Food {
    name: string;
    ingredients: string;
    cost: number;
    isHot: boolean;
    isSpicy: boolean;
    id: number;
}


export async function GetFoods(page: number, id: number): Promise<Page<Food[]>> {
    console.log(page, id);
    try {
        const res = await api.get(`/cafes/${id}/foods?page=${page}`);
        return res.data;
    } catch (e: any) {
        console.error(e);
        return {content: [], totalPages: 0};
    }
}

export async function AddFood(id: number, game: Partial<Food>): Promise<Food | null> {
    try {
        const res = await api.post(`/cafes/${id}/foods`, game);
        return res.data;
    } catch (e: any) {
        console.error(e);
        return null;
    }
}

export async function DeleteFood(id: number): Promise<Food | null> {
    try {
        const res = await api.delete(`/foods/${id}`);
        return res.data;
    } catch (e: any) {
        console.error(e);
        return null;
    }
}
