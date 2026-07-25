/// <reference path="../pb_data/types.d.ts" />
// ساخت کالکشن garment_parts — نگه‌دارنده‌ی بخش‌های لباس (پایه، یقه، آستین)
// و تصویر هر گزینه. تصاویر مشترک بین جنسیت‌ها فقط یک رکورد دارند و در
// فیلد چندانتخابی genders هر دو جنسیت مجاز مشخص می‌شود (بدون تکرار تصویر).
migrate((app) => {
  let existing = null
  try {
    existing = app.findCollectionByNameOrId("pbc_2891004417")
  } catch (_) {
    existing = null
  }
  if (existing) {
    return null
  }

  const collection = new Collection({
    "id": "pbc_2891004417",
    "name": "garment_parts",
    "type": "base",
    "system": false,
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "indexes": [],
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "select1749093243",
        "maxSelect": 1,
        "name": "partType",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "select",
        "values": [
          "base",
          "neckline",
          "sleeve"
        ]
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text2551471165",
        "max": 0,
        "min": 0,
        "name": "name",
        "pattern": "",
        "presentable": true,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text724990059",
        "max": 0,
        "min": 0,
        "name": "label",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "select3526408902",
        "maxSelect": 2,
        "name": "genders",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "select",
        "values": [
          "men",
          "women"
        ]
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text1358539265",
        "max": 0,
        "min": 0,
        "name": "baseKey",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "file1628037420",
        "maxSelect": 1,
        "maxSize": 0,
        "mimeTypes": [],
        "name": "image",
        "presentable": false,
        "protected": false,
        "required": false,
        "system": false,
        "thumbs": [],
        "type": "file"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ]
  })

  return app.save(collection)
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("pbc_2891004417")
    return app.delete(collection)
  } catch (_) {
    return null
  }
})
