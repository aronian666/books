import Editorial from "../../Models/Editorial"
export async function get({ params, request }) {
    const url = new URL(request.url)
    await Editorial.del(params.id)
    return Response.redirect(url.origin + "/editorials")
}