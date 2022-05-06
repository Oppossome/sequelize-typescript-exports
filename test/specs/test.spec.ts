import { Cookie, User, NonExportable, NoExports } from "../models"
import { LoadSequelize } from "../utils/sequelize";
import assert from "node:assert"

describe("ExposedTo Usage Suite", () => {
    let kevin: User
    let dave: User

    before(async () => {
        await LoadSequelize("./test/specs/test.json");
        kevin = await User.findOne({ where: { name: "Kevin" }, include: [Cookie] }) as User
        dave = await User.findOne({ where: { name: "Dave" }, include: [Cookie, NonExportable] }) as User
    });

    it("Fields are omitted appropriately", () => {
        assert.deepStrictEqual(dave.Export(dave), { name: 'Dave', secret: "dave secret", NonExportables: [] })
        assert.deepStrictEqual(dave.Export(kevin), { name: 'Dave', favcookies: [{ name: "Oatmeal Raisin" }] })
    })

    it("Metadata keys export only relevant fields", () => {
        assert.deepStrictEqual(dave.Export(dave, "testly"), { password: "dave123", favcookies: [{ userId: 0 }] })
    })

    it("Returns an empty table for ExportableModels with no exports", async () => {
        const noExports = await NoExports.findOne({ where: { id: 0 } }) as NoExports
        assert.deepStrictEqual(noExports.Export(noExports), {})
    });
});
