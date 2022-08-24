## Challenge Gold

### Criteria

- Rancangan database menggunakan ERD sesuai studi kasus (1 point).
- Server REST API dibuat dengan Express (2 point).
- Penyimpanan data ke PostgreSQL dilakukan dengan Sequelize (2 point).
- Terdapat API register & login (2.5 point).
- Terdapat API untuk membaca, menyimpan, memperbarui, dan menghapus data (2.5 point).

- Register pelanggan baru

http://localhost:3000/api/v1/auth/register

- Login pelanggan

http://localhost:3000/api/v1/auth/login

- Menampilkan data item

http://localhost:3000/api/v1/get-products

- Membuat pesanan baru

http://localhost:3000/api/v1/customer/checkout/:product_id

- Memperbarui status pesanan

http://localhost:3000/api/v1/admin/update/status_order/:checkout_id

## ERD

![alt text](https://github.com/DDV2412/challenge_bootcamp/blob/master/ERD%20Plus.png?raw=true)
