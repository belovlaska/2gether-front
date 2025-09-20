import {create} from "zustand";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {RefreshToken} from "@/api/auth";

interface IntUser {
	"id": number,
	"username": string,
	"email": string,
	"roles": string[]
}

interface User {
	inited: boolean;
	user: IntUser | null;
	token: string | null;
	timeout: NodeJS.Timeout | null;
	isAdmin: boolean;
	Login: (user: IntUser, token: string, isAdmin?: boolean, refresh?: string) => void;
	Logout: () => void;
	init: (router: AppRouterInstance, pathname: string) => void;
	start_token_update: (time: number) => void;
}

const TOKEN_LIFETIME = 60 * 1000 * 30;

export const useUserStore = create<User>((set) => ({
    inited: false,
	user: null,
	token: null,
	isAdmin: false,
	Login: function (user, token, isAdmin = false, refresh) {
		localStorage.setItem("user", JSON.stringify(user));
		localStorage.setItem("token", token);
		localStorage.setItem("isAdmin", isAdmin.toString());
		if(refresh) localStorage.setItem("refreshToken", refresh);
		set({user, token: token, isAdmin});
		useUserStore.getState().start_token_update(TOKEN_LIFETIME);
	},
	Logout: function () {
		console.log('logout')
		localStorage.removeItem("user");
		localStorage.removeItem("token");
		localStorage.removeItem("isAdmin");
		localStorage.removeItem("refreshToken");
		if(this.timeout)
			clearTimeout(this.timeout);
		set({user: null, token: null, isAdmin: false, timeout: null});
	},
	init: function(router, pathname) {
		try {
			const user: IntUser = JSON.parse(localStorage.getItem("user") || "");
			const token = localStorage.getItem("token");
			const isAdmin = localStorage.getItem("isAdmin") === "true";
			set({token: token, inited: true, isAdmin: isAdmin, user});
			if (user) {
				RefreshToken(localStorage.getItem('refreshToken') || '')
					.then(new_auth => {
						if (!new_auth) {
							useUserStore.getState().Logout();
							return;
						}
						useUserStore.getState().start_token_update(TOKEN_LIFETIME);
					})
			}
			if(!user && pathname !== "/login" && pathname !== "/register") router.push("/login");
		} catch (e) {
			console.warn(e);
			set({inited: true});
			if(pathname !== "/login" && pathname !== "/register") router.push("/login");
		}
	},
	timeout: null,
	start_token_update: function (time: number){
		if(this.user && this.timeout == null) {
			console.log("Next token update in " + (Date.now() + time)/1000 + "s");
			set({
				timeout: setTimeout(async () => {
					const context = useUserStore.getState();
					set({ timeout: null });
					if (!context.user) return;
					const new_auth = await RefreshToken(localStorage.getItem('refreshToken') || '');
					if (!new_auth) {
						context.Logout();
						return;
					}
					set({ token: new_auth.accessToken });
					localStorage.setItem("token", new_auth.accessToken);
					localStorage.setItem("refreshToken", new_auth.refreshToken);
					useUserStore.getState().start_token_update(TOKEN_LIFETIME);
				}, (Date.now() + time)/1000)
			})
		}
	}
}));
