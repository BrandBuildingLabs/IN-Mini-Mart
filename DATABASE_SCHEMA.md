# MongoDB schema map

The Express API uses Mongoose. Set `MONGODB_URI` to the target database; Mongoose creates these collections when documents are first written. Collection names below are Mongoose's pluralized names.

| Collection | Model | Main fields and links |
| --- | --- | --- |
| `users` | `User` | Email, password hash, role, status, verification and profile fields. `address_details` → `addresses`; `shopping_cart` → `cartproducts`; `orderHistory` → `orders`. |
| `addresses` | `address` | Address/contact fields; `userId` → `users`. |
| `categories` | `category` | Legacy product taxonomy: name and image. Referenced by `products.category`. |
| `subcategories` | `subCategory` | Name/image; `category` → `categories`. |
| `products` | `product` | Legacy product details, stock, price, publish state; category and subcategory references; text index on name/description. |
| `cartproducts` | `cartProduct` | `productId` → `products`, `userId` → `users`, quantity. |
| `orders` | `order` | Existing checkout records; `userId` → `users`, `productId` → `products`, `delivery_address` → `addresses`, payment and totals. |
| `storecatalogcategories` | `StoreCatalogCategory` | Storefront category ID, name, image and active flag. Seeded idempotently from `Products/catalog.json`; stable string IDs are used by storefront products. |
| `storecatalogproducts` | `StoreCatalogProduct` | Storefront product ID, categoryId, category name, image, unit, price, description and active flag. Seeded idempotently from `Products/catalog.json`; admin edits are persisted here. |
| `storeorders` | `StoreOrder` | WhatsApp checkout order snapshot with customer, line items, total, payment method and status. `items[].productId` refers to storefront product IDs by value, preserving the purchase-time snapshot. |

`categories`/`subcategories`/`products` are the original account-based catalog. `storecatalogcategories`/`storecatalogproducts` are the public storefront catalog; they intentionally use stable string IDs from the supplied catalog file. Storefront categories now seed into MongoDB alongside products. `storeorders` is separate from the existing Stripe/account checkout `orders` collection.

To seed missing storefront records, start the server with `MONGODB_URI`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` configured. Startup only inserts missing IDs; it does not overwrite existing catalog edits.
