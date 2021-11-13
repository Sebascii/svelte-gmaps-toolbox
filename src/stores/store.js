import { writable } from 'svelte/store';

let stored_api_key = localStorage.getItem("google_api_key");
if(!stored_api_key){
    stored_api_key = 'null';
}
export const google_api_key = writable(stored_api_key);