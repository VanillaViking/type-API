import SimpleSchema from "simpl-schema"

const cleanSchemas = {
  clean: {
    filter: true,
    autoConvert: true,
    removeEmptyStrings: true,
    trimStrings: true,
    getAutoValues: true,
    removeNullsFromArrays: true,
  }
}


const sortObject = new SimpleSchema({
  sortBy: {
    type: String,
    allowedValues: ['date', 'accuracy', 'wpm', 'tp'],
  },
  order: {
    type: Number,
    // in accordance with mongo 
    // 1: ascending
    // -1: descending
    allowedValues: [1, -1]
  }
})

export const getTests = new SimpleSchema({
  discordId: {
    type: String,
    optional: true,
  },
  beforeDate: {
    type: Date,
    optional: true,
    defaultValue: new Date()
  },
  afterDate: {
    type: Date,
    optional: true,
    defaultValue: new Date(2020, 1) //set to early enough value to not interfere with query
  },
  sort: {
    type: sortObject,
    optional: true,
  },
  limit: {
    type: Number,
    optional: true,
    defaultValue: 300,
  },
})

const Test = new SimpleSchema({
  discordId: String,
  wpm: Number, 
  accuracy: Number,
  promptId: String,
  tp: Number,
  date: {
    type: Date,
    optional: true,
    defaultValue: new Date()
  }
}, cleanSchemas)


export const addTests = new SimpleSchema({
  tests: [Test]
}, cleanSchemas)
