import Category from "../../Models/Category"
export async function get({ params, request }) {
    const url = new URL(request.url)
    await Category.del(params.id)
    return Response.redirect(url.origin + "/categories")
}