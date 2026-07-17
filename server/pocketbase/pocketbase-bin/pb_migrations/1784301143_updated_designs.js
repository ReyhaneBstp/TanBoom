/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1550871894")

  // remove field
  collection.fields.removeById("text1628037420")

  // remove field
  collection.fields.removeById("text2456709134")

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "file1628037420",
    "maxSelect": 1,
    "maxSize": 10485760,
    "mimeTypes": [
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/gif"
    ],
    "name": "frontImage",
    "presentable": false,
    "protected": false,
    "required": true,
    "system": false,
    "thumbs": null,
    "type": "file"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "file2456709134",
    "maxSelect": 1,
    "maxSize": 10485760,
    "mimeTypes": [
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/gif"
    ],
    "name": "backImage",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": null,
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1550871894")

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1628037420",
    "max": 0,
    "min": 0,
    "name": "frontImage",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2456709134",
    "max": 0,
    "min": 0,
    "name": "backImage",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // remove field
  collection.fields.removeById("file1628037420")

  // remove field
  collection.fields.removeById("file2456709134")

  return app.save(collection)
})
