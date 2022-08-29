import { expect } from "chai"
import { TrivialBookHandler } from "./lib/TrivialBookHandler"

describe("Entity Type handling", () => {
    const handler = new TrivialBookHandler()
    describe("JOINed", () => {
        const bigResponse = [...new Array(1000)].map((_, i) => ({
            id: "" + (i + 1),
            author: {
                id: "42",
                name: "D Adams",
            },
        }))
        it("can handle a big JOINed response", () => {
            const response = handler.postProcess(bigResponse, 1000, "book")
            expect(response).to.haveOwnProperty("data").which.is.instanceOf(Array).with.ownProperty("length").eq(1000)
            expect(response.data[0].relationships).to.haveOwnProperty("author").to.haveOwnProperty("data").which.deep.eq({type: "author", id: "42"})
            expect(response).to.haveOwnProperty("included").which.is.instanceOf(Array).with.ownProperty("length").eq(1)
            expect(response.included[0].attributes).to.haveOwnProperty("name").eq("D Adams")
        })
        it("can handle a big JOINed response (iterated)", () => {
            function *responseIterator(count: number) {
                for(let i = 0; i < count; i++) {
                    yield {
                        id: "" + (i + 1),
                        author: {
                            id: "42",
                            name: "D Adams",
                        },
                    }
                }
            }
            const response = handler.postProcess(responseIterator(10000), 10000, "book")
            expect(response).to.haveOwnProperty("data").which.is.instanceOf(Array).with.ownProperty("length").eq(10000)
            expect(response.data[0].relationships).to.haveOwnProperty("author").to.haveOwnProperty("data").which.deep.eq({type: "author", id: "42"})
            expect(response).to.haveOwnProperty("included").which.is.instanceOf(Array).with.ownProperty("length").eq(1)
            expect(response.included[0].attributes).to.haveOwnProperty("name").eq("D Adams")
        })
    })
    describe("Unjoined", () => {
        const bigResponseObject = [...new Array(1000)].map((_, i) => ({
            id: "" + (i + 1),
            author: {
                id: "42",
            },
        }))
        const bigResponseNumber = [...new Array(1000)].map((_, i) => ({
            id: "" + (i + 1),
            author: 42,
        }))
        it("can handle a big unJOINed response (object)", () => {
            const response = handler.postProcess(bigResponseObject, 1000, "book")
            expect(response).to.haveOwnProperty("data").which.is.instanceOf(Array).with.ownProperty("length").eq(1000)
            expect(response.data[0].relationships).to.haveOwnProperty("author").to.haveOwnProperty("data").which.deep.eq({type: "author", id: "42"})
            expect(response).to.haveOwnProperty("included").which.is.instanceOf(Array).with.ownProperty("length").eq(0)
        })
        it("can handle a big unJOINed response (number)", () => {
            const response = handler.postProcess(bigResponseNumber, 1000, "book")
            expect(response).to.haveOwnProperty("data").which.is.instanceOf(Array).with.ownProperty("length").eq(1000)
            expect(response.data[0].relationships).to.haveOwnProperty("author").to.haveOwnProperty("data").which.deep.eq({type: "author", id: "42"})
            expect(response).to.haveOwnProperty("included").which.is.instanceOf(Array).with.ownProperty("length").eq(0)
        })
    })
})