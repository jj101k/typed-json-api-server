import { expect } from "chai"
import { TrivialAuthorHandler } from "./lib/TestHandler/TrivialAuthorHandler"
import { TrivialBookHandler } from "./lib/TestHandler/TrivialBookHandler"
import { TrivialPersonHandler } from "./lib/TestHandler/TrivialPersonHandler"

describe("Entity Type handling", () => {
    const authorHandler = new TrivialAuthorHandler()
    const bookHandler = new TrivialBookHandler()
    describe("JOINed", () => {
        const bigResponse = [...new Array(1000)].map((_, i) => ({
            id: "" + (i + 1),
            name: "HHGG",
            author: {
                id: "42",
                name: "D Adams",
            },
        }))
        it("can handle a big response", () => {
            const response = bookHandler.postProcess(bigResponse, 1000)
            expect(response).to.haveOwnProperty("data").which.is.instanceOf(Array).with.ownProperty("length").eq(1000)
            expect(response.data[0].relationships).to.haveOwnProperty("author").to.haveOwnProperty("data").which.deep.eq({type: "author", id: "42"})
            expect(response).to.haveOwnProperty("included").which.is.instanceOf(Array).with.ownProperty("length").eq(1)
            expect(response.included[0].attributes).to.haveOwnProperty("name").eq("D Adams")
        })
        it("can handle a big response (iterated)", () => {
            function *responseIterator(count: number) {
                for(let i = 0; i < count; i++) {
                    yield {
                        id: "" + (i + 1),
                        name: "Test",
                        author: {
                            id: "42",
                            name: "D Adams",
                        },
                    }
                }
            }
            const response = bookHandler.postProcess(responseIterator(10000), 10000)
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
            const response = authorHandler.postProcess(responseData, 2)
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
            const response = bookHandler.postProcess(responseData, 2)
            expect(response).to.haveOwnProperty("data").which.is.instanceOf(Array).with.ownProperty("length").eq(2)
            expect(response.data[0].relationships).to.haveOwnProperty("forewordAuthor").to.haveOwnProperty("data").is.null
            expect(response.data[1].relationships).to.haveOwnProperty("forewordAuthor").to.haveOwnProperty("data").haveOwnProperty("id").eq("43")
            expect(response).to.haveOwnProperty("included").which.is.instanceOf(Array).with.ownProperty("length").eq(2)
            expect(response.included[1].attributes).to.haveOwnProperty("name").eq("T Pratchett")
        })
        it("can exclude peer links", () => {
            const personHandler = new TrivialPersonHandler()
            const responseData = [
                {
                    id: "1",
                    name: "Doug",
                    bestFriend: {
                        id: "2",
                        name: "Terry"
                    },
                },
                {
                    id: "2",
                    name: "Terry",
                    bestFriend: {
                        id: "1",
                        name: "Doug"
                    },
                },
                {
                    id: "3",
                    name: "Timothy",
                    bestFriend: {
                        id: "77",
                        name: "George"
                    }
                },
                {
                    id: "3",
                    name: "Timothy",
                    bestFriend: {
                        id: "77",
                        name: "George"
                    }
                }
            ]
            const response = personHandler.postProcess(responseData, 2)
            expect(response).to.haveOwnProperty("data").which.is.instanceOf(Array).with.ownProperty("length").eq(3)
            expect(response).to.haveOwnProperty("included").which.is.instanceOf(Array).with.ownProperty("length").eq(1)
            expect(response.included[0].attributes).to.haveOwnProperty("name").eq("George")
        })
    })
    describe("Unjoined", () => {
        const bigResponseObject = [...new Array(1000)].map((_, i) => ({
            id: "" + (i + 1),
            name: "Test",
            author: {
                id: "42",
            },
        }))
        const bigResponseNumber = [...new Array(1000)].map((_, i) => ({
            id: "" + (i + 1),
            name: "Test",
            author: 42,
        }))
        it("can handle a big response (object)", () => {
            const response = bookHandler.postProcess(bigResponseObject, 1000)
            expect(response).to.haveOwnProperty("data").which.is.instanceOf(Array).with.ownProperty("length").eq(1000)
            expect(response.data[0].relationships).to.haveOwnProperty("author").to.haveOwnProperty("data").which.deep.eq({type: "author", id: "42"})
            expect(response).to.haveOwnProperty("included").which.is.instanceOf(Array).with.ownProperty("length").eq(0)
        })
        it("can handle a big response (number)", () => {
            const response = bookHandler.postProcess(bigResponseNumber, 1000)
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
            const response = authorHandler.postProcess(responseData, 2)
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
            const response = bookHandler.postProcess(responseData, 2)
            expect(response).to.haveOwnProperty("data").which.is.instanceOf(Array).with.ownProperty("length").eq(2)
            expect(response.data[0].relationships).to.haveOwnProperty("forewordAuthor").to.haveOwnProperty("data").is.null
            expect(response.data[1].relationships).to.haveOwnProperty("forewordAuthor").to.haveOwnProperty("data").haveOwnProperty("id").eq("43")
            expect(response).to.haveOwnProperty("included").which.is.instanceOf(Array).with.ownProperty("length").eq(0)
        })
    })
    describe("Storage", () => {
        it("can store, retrieve and delete a value", () => {
            const book = {
                name: "HHGG"
            }
            const bookId = "42"
            expect(() => bookHandler.getOne(bookId)).to.throw
            const result = bookHandler.create(bookId, book)
            expect(result).to.be.true
            const stored = bookHandler.getOne(bookId)
            expect(stored.data).to.haveOwnProperty("attributes").with.ownProperty("name").eq("HHGG")
            const deleteResult = bookHandler.delete(bookId)
            expect(deleteResult).to.be.true
            expect(() => bookHandler.getOne(bookId)).to.throw
        })
    })
})