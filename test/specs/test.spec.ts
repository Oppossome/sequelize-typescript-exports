import { LoadSequelize } from "../utils/sequelize";
import { User } from "../models/user";
import assert from "node:assert"
import { Cookie } from "../models/cookie";

describe("ExposedTo Usage Suite", () => {
    let kevin: User
    let dave: User

    before(async () => {
        await LoadSequelize("./test/specs/test.json");
        kevin = await User.findOne({ where: { name: "Kevin" }, include: [Cookie] }) as User
        dave = await User.findOne({ where: { name: "Dave" }, include: [Cookie] }) as User
    });

    it("Fields are omitted appropriately", () => {
        assert.deepStrictEqual(dave.Export(dave), { name: 'Dave', secret: "dave secret", favcookies: [{ name: "Oatmeal Raisin" }] })
        assert.deepStrictEqual(dave.Export(kevin), { name: 'Dave', unseenByDave: "👁️ 👁️" })
    })

    it("Metadata keys export only relevant fields", () => {
        assert.deepStrictEqual(dave.Export(dave, "testly"), { password: "dave123", favcookies: [{ userId: 0 }] })
    })
});
