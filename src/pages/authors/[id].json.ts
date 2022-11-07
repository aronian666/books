import Author from "../../Models/Author"
export async function get({ params, request }) {
    const url = new URL(request.url)
    await Author.del(params.id)
    return Response.redirect(url.origin + "/authors")
}