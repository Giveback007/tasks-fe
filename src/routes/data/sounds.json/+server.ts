import { json, type RequestHandler } from "@sveltejs/kit";
import { readdir } from "fs/promises";

export const prerender = true;

export const GET: RequestHandler = async ({ fetch }) => {
    const sounds = await readdir('./static/sounds')
    const data = sounds.map(file => ({
        file: `/sounds/${file}`,
        name: file.split('.')[0],
    }));

    return json(data);
}