import { LoadSequelize } from "../utils/sequelize";
import { User, Upload, View } from "../models"
import assert from "node:assert"

describe("sequelize-typescript-exports Test Suite", () => {
    before(async () => await LoadSequelize("./test/specs/test.json"))

    it("Fields are omitted accordingly", async () => {
        const user1 = await User.findOne({ where: { id: 0 }, include: [Upload] }) as User;
        const user2 = await User.findOne({ where: { id: 1 }, include: [Upload] }) as User;

        assert.deepStrictEqual(user1.Export(user1), {
            name: 'David',
            password: 'david123',
            uploads: [{
                fileName: 'dog.jpg',
                uploader: null,
                views: null
            }]
        })

        assert.deepStrictEqual(user2.Export(user2, "instOf"), {
            uploads: []
        })

        assert.deepStrictEqual(user1.Export(user2), {
            name: 'David'
        })
    });

    it("Populate subfields", async () => {
        const post1 = await Upload.findOne({ where: { id: 0 }, include: [User, View] }) as Upload
        assert.deepStrictEqual(post1.Export(post1.uploader), {
            views: [],
            fileName: 'dog.jpg',
            uploader: { name: 'David', password: 'david123', uploads: null }
        })
    })
})
