import {api, Page} from "@/api/api";
import {useUserStore} from "@/context/user-store";


export interface Cafe {
    id: number;
    name: string;
    description: string;
    address: string;
    workingHours: string;
    alcoholPermission: boolean;
    smokingPermission: boolean;
    rating: number;
    poster?: string;
}

export enum Operation {
    CONTAINS = "cn",
    DOES_NOT_CONTAIN = "nc",
    STR_CONTAINS = "sc",
    STR_DOES_NOT_CONTAIN = "sd",
    EQUAL = "eq",
    NOT_EQUAL = "ne",
    STR_EQUAL = "se",
    STR_NOT_EQUAL = "sn",
    BEFORE = "be",
    AFTER = "af",
    BEGINS_WITH = "bw",
    DOES_NOT_BEGIN_WITH = "bn",
    ENDS_WITH = "ew",
    DOES_NOT_END_WITH = "en",
    NUL = "nu",
    NOT_NULL = "nn",
    GREATER_THAN = "gt",
    GREATER_THAN_EQUAL = "ge",
    LESS_THAN = "lt",
    LESS_THAN_EQUAL = "le"
}

export enum FilterKey {
    ID = "id",
    NAME = "name",
    DESCRIPTION = "description",
    ADDRESS = "address",
    WORKING_HOURS = "workingHours",
    ALCOHOL_PERMISSION = "alcoholPermission",
    SMOKING_PERMISSION = "smokingPermission",
}

export interface Criteria {
    filterKey: FilterKey;
    operation: Operation;
    value: string | number | boolean;
}

export interface SearchCafe {
    searchCriteriaList: Criteria[];
    dataOption: string;
}

export async function GetCafes(page: number): Promise<Page<Cafe[]>> {
    try {
        const res = await api.get('/cafes');
        return res.data;
    } catch (e: any) {
        console.warn(e);
        if (e?.response?.status === 403)
            useUserStore.getState().Logout();
        return {content: [], totalPages: 0}
    }
}

export async function GetCafe(id: number): Promise<Cafe | null> {
    try {
        const res = await api.get('/cafes/' + id);
        return res.data;
    } catch (e: any) {
        console.error(e);
        return null;
    }
}

export async function CreateCafe(cafe: Partial<Cafe>): Promise<Cafe | null> {
    try {
        (cafe as any).ownerId = useUserStore.getState().user?.id;
        const res = await api.post('/cafes', cafe);
        return res.data;
    } catch (e: any) {
        console.error(e);
        return null;
    }
}

export async function UpdateCafe(cafe: Partial<Cafe>, id: number): Promise<Cafe | null> {
    try {
        (cafe as any).ownerId = useUserStore.getState().user?.id;
        const res = await api.patch('/cafes/' + id, cafe);
        return res.data;
    } catch (e: any) {
        console.error(e);
        return null;
    }
}

export async function UploadPoster(id: number, file: File): Promise<Cafe | null> {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await api.post('/cafes/' + id + '/poster', formData);
        console.log(res.data)
        return res.data;
    } catch (e: any) {
        console.error(e);
        return null;
    }
}

export async function SearchCafe(page: number, filter: SearchCafe): Promise<Page<Cafe[]>> {
    try {
        const res = await api.post('/cafes/search?page=' + page, filter);
        return res.data;
    } catch (e: any) {
        console.error(e);
        return {content: [], totalPages: 0};
    }
}

export async function DeleteCafe(id: number){
    try {
        await api.delete('/cafes/' + id);
    } catch (e: any) {
        console.error(e);
    }
}