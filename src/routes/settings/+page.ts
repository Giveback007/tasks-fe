export async function load({ fetch }) {
    let data: {
        sounds: str | { file: str; name: str }[]
    } = {
        sounds: []
    };

    try {
        const fetchRes = await fetch('/data/sounds.json');
        if (fetchRes.status !== 200) throw fetchRes;

        data.sounds = await fetchRes.json();
    } catch(err: any) {
        console.error(err);
        if (err['status'])
            data.sounds = `Failed To Fetch Sounds ::: ${err.status} - ${err.statusText}`
        else
            data.sounds = err instanceof Error ? err.message : String(err);
    }

    return data;
}