import Student from "../../Models/Student"
export async function get({ params, request }) {
    const url = new URL(request.url)
    await Student.del(params.id)
    return Response.redirect(url.origin + "/students")
}