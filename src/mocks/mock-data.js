const { faker } = require("@faker-js/faker");
const bcryptjs = require("bcryptjs");
const {
  User,
  Role,
  Store,
  Product,
  Category,
} = require("../repository/database/models");
const { v4: uuidv4 } = require("uuid");

const seller = async (length = 50) => {
  const sellers = [];

  const role = await Role.findOne({
    where: {
      name: "seller",
    },
  });

  for (let i = 0; i < length; i++) {
    const seller = {
      id: faker.datatype.uuid(),
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      email: faker.internet.email(),
      password: bcryptjs.hashSync(faker.internet.password()),
      photo_profile: `https://ui-avatars.com/api/?name=${faker.name.firstName()}+${faker.name.lastName()}&background=random&size=128`,
    };

    sellers.push(seller);

    const user = await User.create(seller);

    await user.addRole(role);
  }

  return sellers;
};

const companyStore = async () => {
  const sellers = await seller();
  const stores = [];

  for await (const seller of sellers) {
    const store = {
      id: faker.datatype.uuid(),
      seller_id: seller.id,
      name: faker.company.name(),
      city: faker.address.city(),
      districts: faker.address.cityName(),
      sub_districts: faker.address.street(),
      detail_address: faker.address.streetAddress(),
      zip_code: faker.address.zipCode("#####"),
    };

    await Store.create(store);
    stores.push(store);
  }

  return stores;
};

module.exports = {
  async generateProduct(length = 150) {
    const stores = await companyStore();

    const products = [];

    for await (const store of stores) {
      for (let i = 0; i < length; i++) {
        let category_id;

        const category = await Category.findOne({
          where: {
            name: faker.commerce.product(),
          },
        });

        if (!category) {
          await Category.create({
            id: uuidv4(),
            name: faker.commerce.product(),
          }).then((data) => {
            category_id = data.id;
          });
        } else {
          category_id = category.id;
        }

        const product = {
          id: faker.datatype.uuid(),
          store_id: store.id,
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          category_id,
          price: faker.commerce.price(),
          stock: 10,
        };

        await Product.create(product);
        products.push(product);
      }
    }

    return products;
  },
};
