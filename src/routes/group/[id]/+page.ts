export async function load({ params }) {
    const id = params['id'] as str;

    return { id };
}