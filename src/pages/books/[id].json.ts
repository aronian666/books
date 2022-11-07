import Book from "../../Models/Book"
export async function get({ params, request }) {
    const url = new URL(request.url)
    await Book.del(params.id)
    return Response.redirect(url.origin + "/books")
}