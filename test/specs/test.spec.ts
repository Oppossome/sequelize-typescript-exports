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
        assert.deepStrictEqual(dave.Expose(dave), { name: 'Dave', secret: "dave secret", favcookies: [{ name: "Oatmeal Raisin" }] })
        assert.deepStrictEqual(dave.Expose(kevin), { name: 'Dave' })
    })

    it("Metadata keys expose only relevant fields", () => {
        assert.deepStrictEqual(dave.Expose(dave, "testly"), { password: "dave123", favcookies: [{ userId: 0 }] })
    })
});
