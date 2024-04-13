import { SERVER_URL_USER } from "../config";

export function getInfo(userId) {
    return fetch(`${SERVER_URL_USER}/getUserInfo/${userId}`, {
        method: "GET"
    })
    .then(response => response.json());
}