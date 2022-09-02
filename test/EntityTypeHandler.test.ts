import { expect } from "chai"
import { TrivialBookHandler } from "./lib/TrivialBookHandler"

describe("Entity Type handling", () => {
    const handler = new TrivialBookHandler()
    describe("JOINed", () => {
        const bigResponse = [...new Array(1000)].map((_, i) => ({
            id: "" + (i + 1),
            name: "HHGG",
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
        it("can handle initially empty many linkages", () => {
            const responseData = [
                {
                    id: "5",
                    name: "T Pratchett",
                    books: [],
                },
                {
                    id: "42",
                    name: "D Adams",
                    books: [
                        {
                            id: "43",
                            name: "HHGG"
                        }
                    ],
                }
            ]
            const response = handler.postProcess(responseData, 2, "author")
            expect(response).to.haveOwnProperty("data").which.is.instanceOf(Array).with.ownProperty("length").eq(2)
            expect(response.data[0].relationships).to.haveOwnProperty("books").to.haveOwnProperty("data").to.haveOwnProperty("length").which.eq(0)
            expect(response.data[1].relationships).to.haveOwnProperty("books").to.haveOwnProperty("data").to.haveOwnProperty("length").which.eq(1)
            expect(response).to.haveOwnProperty("included").which.is.instanceOf(Array).with.ownProperty("length").eq(1)
            expect(response.included[0].attributes).to.haveOwnProperty("name").eq("HHGG")
        })
        it("can handle initially empty single linkages", () => {
            const responseData = [
                {
                    id: "42",
                    name: "HHGG",
                    author: {
                        id: "42",
                        name: "D Adams",
                    },
                    forewordAuthor: null,
                },
                {
                    id: "43",
                    name: "RAEOU",
                    author: {
                        id: "42",
                        name: "D Adams",
                    },
                    forewordAuthor: {
                        id: "43",
                        name: "T Pratchett",
                    },
                }
            ]
            const response = handler.postProcess(responseData, 2, "book")
            expect(response).to.haveOwnProperty("data").which.is.instanceOf(Array).with.ownProperty("length").eq(2)
            expect(response.data[0].relationships).to.haveOwnProperty("forewordAuthor").to.haveOwnProperty("data").is.null
            expect(response.data[1].relationships).to.haveOwnProperty("forewordAuthor").to.haveOwnProperty("data").haveOwnProperty("id").eq("43")
            expect(response).to.haveOwnProperty("included").which.is.instanceOf(Array).with.ownProperty("length").eq(2)
            expect(response.included[1].attributes).to.haveOwnProperty("name").eq("T Pratchett")
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
        it("can handle initially empty many linkages", () => {
            const responseData = [
                {
                    id: "5",
                    name: "T Pratchett",
                    books: [],
                },
                {
                    id: "42",
                    name: "D Adams",
                    books: [
                        43
                    ],
                }
            ]
            const response = handler.postProcess(responseData, 2, "author")
            expect(response).to.haveOwnProperty("data").which.is.instanceOf(Array).with.ownProperty("length").eq(2)
            expect(response.data[0].relationships).to.haveOwnProperty("books").to.haveOwnProperty("data").to.haveOwnProperty("length").which.eq(0)
            expect(response.data[1].relationships).to.haveOwnProperty("books").to.haveOwnProperty("data").to.haveOwnProperty("length").which.eq(1)
            expect(response).to.haveOwnProperty("included").which.is.instanceOf(Array).with.ownProperty("length").eq(0)
        })
        it("can handle initially empty single linkages", () => {
            const responseData = [
                {
                    id: "42",
                    name: "HHGG",
                    author: 42,
                    forewordAuthor: null,
                },
                {
                    id: "43",
                    name: "RAEOU",
                    author: 42,
                    forewordAuthor: 43,
                }
            ]
            const response = handler.postProcess(responseData, 2, "book")
            expect(response).to.haveOwnProperty("data").which.is.instanceOf(Array).with.ownProperty("length").eq(2)
            expect(response.data[0].relationships).to.haveOwnProperty("forewordAuthor").to.haveOwnProperty("data").is.null
            expect(response.data[1].relationships).to.haveOwnProperty("forewordAuthor").to.haveOwnProperty("data").haveOwnProperty("id").eq("43")
            expect(response).to.haveOwnProperty("included").which.is.instanceOf(Array).with.ownProperty("length").eq(0)
        })
    })
})