/// <reference path="../pb_data/types.d.ts" />
// ساخت کالکشن designs — روی هاست تازه این کالکشن وجود ندارد و
// میگریشن‌های updated_* بدون آن fail می‌شوند.
// اسکیمای اولیه (قبل از updateها) با همان fieldId ها ساخته می‌شود
// تا میگریشن‌های بعدی بدون خطا اعمال شوند.
migrate((app) => {
  let existing = null
  try {
    existing = app.findCollectionByNameOrId("pbc_1550871894")
  } catch (_) {
    existing = null
  }
  if (existing) {
    return null
  }

  const collection = new Collection({
    "id": "pbc_1550871894",
    "name": "designs",
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
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text724990059",
        "max": 0,
        "min": 0,
        "name": "title",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "file1628037420",
        "maxSelect": 1,
        "maxSize": 0,
        "mimeTypes": [],
        "name": "frontImage",
        "presentable": false,
        "protected": false,
        "required": false,
        "system": false,
        "thumbs": [],
        "type": "file"
      },
      {
        "hidden": false,
        "id": "file2456709134",
        "maxSelect": 1,
        "maxSize": 0,
        "mimeTypes": [],
        "name": "backImage",
        "presentable": false,
        "protected": false,
        "required": false,
        "system": false,
        "thumbs": [],
        "type": "file"
      },
      {
        "hidden": false,
        "id": "bool2282622326",
        "name": "isPublic",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "bool"
      },
      {
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "hidden": false,
        "id": "relation2375276105",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "user",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
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
    const collection = app.findCollectionByNameOrId("pbc_1550871894")
    return app.delete(collection)
  } catch (_) {
    return null
  }
})
