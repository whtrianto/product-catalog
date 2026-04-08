// Struktur data dummy untuk katalog produk
export const dummyData = {
  // Daftar kategori utama (Level 1)
  "categories": [
    { "id": "C1", "name": "Electronics" },
    { "id": "C2", "name": "Apparel" }
  ],
  // Daftar sub-kategori yang terhubung ke categoryId (Level 2)
  "subCategories": [
    { "id": "S1", "categoryId": "C1", "name": "Laptop" },
    { "id": "S2", "categoryId": "C1", "name": "Smartphone" },
    { "id": "S3", "categoryId": "C2", "name": "Men's Tops" },
    { "id": "S4", "categoryId": "C2", "name": "Footwear" }
  ],
  // Daftar brand yang terhubung ke subCategoryId (Level 3)
  "brands": [
    { "id": "B1", "subCategoryId": "S1", "name": "Asus" },
    { "id": "B2", "subCategoryId": "S1", "name": "Apple" },
    { "id": "B3", "subCategoryId": "S2", "name": "Samsung" },
    { "id": "B4", "subCategoryId": "S2", "name": "Xiaomi" },
    { "id": "B5", "subCategoryId": "S3", "name": "Erigo" },
    { "id": "B6", "subCategoryId": "S3", "name": "Uniqlo" },
    { "id": "B7", "subCategoryId": "S4", "name": "Nike" },
    { "id": "B8", "subCategoryId": "S4", "name": "Adidas" }
  ],
  // Daftar produk akhir yang terhubung ke brandId
  "products": [
    { "id": "P1", "brandId": "B1", "name": "Asus ROG Zephyrus", "price": 25000000 },
    { "id": "P2", "brandId": "B2", "name": "MacBook Pro M3", "price": 30000000 },
    { "id": "P3", "brandId": "B3", "name": "Samsung Galaxy S24", "price": 15000000 },
    { "id": "P4", "brandId": "B4", "name": "Xiaomi 14 Pro", "price": 12000000 },
    { "id": "P5", "brandId": "B5", "name": "Erigo T-Shirt Black", "price": 150000 },
    { "id": "P6", "brandId": "B6", "name": "Uniqlo Flannel Shirt", "price": 399000 },
    { "id": "P7", "brandId": "B7", "name": "Nike Air Force 1", "price": 1500000 },
    { "id": "P8", "brandId": "B8", "name": "Adidas Ultraboost", "price": 2800000 }
  ]
};
