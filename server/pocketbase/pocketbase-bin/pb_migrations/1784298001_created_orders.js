/// <reference path="../pb_data/types.d.ts" />
// ساخت کالکشن orders — فقط با فیلد id، چون میگریشن
// 1784299283_updated_orders.js بقیه فیلدها را اضافه می‌کند.
migrate((app) => {
  let existing = null
  try {
    existing = app.findCollectionByNameOrId("pbc_3527180448")
  } catch (_) {
    existing = null
  }
  if (existing) {
    return null
  }

  const collection = new Collection({
    "id": "pbc_3527180448",
    "name": "orders",
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
      }
    ]
  })

  return app.save(collection)
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("pbc_3527180448")
    return app.delete(collection)
  } catch (_) {
    return null
  }
})
