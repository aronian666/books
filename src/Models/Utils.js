import { utils, writeFile } from "xlsx";
export async function toXLSX(model) {
    const columnLengths = model.table.map(() => ({ wch: 20 }))
    const workbook = utils.book_new();
    const response = await model.find({ limit: 1000 })
    let { results } = Object.values(response)[0];
    results = results.map(r => new model(r))
    const data = [model.table.map(r => r.name)]
    results.forEach(result => {
        const row = model.table.map(({ key, transform }) => transform ? transform(result[key]) : result[key])
        data.push(row)
    })
    const worksheet = utils.aoa_to_sheet(data)
    worksheet["!cols"] = columnLengths
    utils.book_append_sheet(workbook, worksheet, model.name + "s")
    writeFile(workbook, model.name + 's.xlsx');
}