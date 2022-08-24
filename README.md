## Challenge Gold

### Criteria

- Rancangan database menggunakan ERD sesuai studi kasus (1 point).
- Server REST API dibuat dengan Express (2 point).
- Penyimpanan data ke PostgreSQL dilakukan dengan Sequelize (2 point).
- Terdapat API register & login (2.5 point).
- Terdapat API untuk membaca, menyimpan, memperbarui, dan menghapus data (2.5 point).

- Register pelanggan baru

http://127.0.0.1:3000/api/auth/register

- Login pelanggan

http://127.0.0.1:3000/api/auth/login

- Menampilkan data item

http://127.0.0.1:3000/api/product

- Membuat pesanan baru

http://127.0.0.1:3000/api/customer/checkout/:product_id

- Memperbarui status pesanan

http://127.0.0.1:3000/api/seller/order/:checkout_id

http://127.0.0.1:3000/api/admin/checkout/:checkout_id

## ERD

![alt text](https://github.com/DDV2412/gold_challenge/blob/master/ERD%20Plus.png?raw=true)
