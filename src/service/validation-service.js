const joi = require("joi");

module.exports = {
  loginValidation: (data) => {
    const schema = joi.object().keys({
      email: joi.string().email().required().messages({
        "string.empty": "Email cannot be an empty field",
        "any.required": "Email is a required field",
        "string.email": "Please insert a valid email address",
      }),
      password: joi
        .string()
        .required()
        .pattern(
          new RegExp("^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$")
        )
        .messages({
          "string.empty": "Password cannot be an empty field",
          "string.pattern.base":
            "Invalid password, alphanumeric and characters",
          "string.min": `Password should have a minimum length of {#limit}`,
          "any.required": `Password is a required field`,
        }),
    });

    return schema.validateAsync(data);
  },

  registerValidation: (data) => {
    const schema = joi.object().keys({
      firstname: joi.string().required().messages({
        "string.empty": "Firstname cannot be an empty field",
        "any.required": "Firstname is a required field",
      }),
      lastname: joi.string().required().messages({
        "string.empty": "Lastname cannot be an empty field",
        "any.required": "Lastname is a required field",
      }),
      email: joi.string().email().required().messages({
        "string.empty": "Email cannot be an empty field",
        "any.required": "Email is a required field",
        "string.email": "Please insert a valid email address",
      }),
      password: joi
        .string()
        .required()
        .pattern(
          new RegExp("^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$")
        )
        .messages({
          "string.empty": "Password cannot be an empty field",
          "string.pattern.base":
            "Invalid password, alphanumeric and characters",
          "string.min": `Password should have a minimum length of {#limit}`,
          "any.required": `Password is a required field`,
        }),
      confirmPassword: joi
        .string()
        .required()
        .pattern(
          new RegExp("^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$")
        )
        .messages({
          "string.empty": "Confirm password cannot be an empty field",
          "string.pattern.base":
            "Invalid confirm password, alphanumeric and characters",
          "string.min": `Confirm password should have a minimum length of {#limit}`,
          "any.required": `Confirm password is a required field`,
        }),
    });

    return schema.validateAsync(data);
  },
  forgotPasswordValidation: (data) => {
    const schema = joi.object().keys({
      email: joi.string().email().required().messages({
        "string.empty": "Email cannot be an empty field",
        "any.required": "Email is a required field",
        "string.email": "Please insert a valid email address",
      }),
    });

    return schema.validateAsync(data);
  },
  resetPasswordValidation: (data) => {
    const schema = joi.object().keys({
      password: joi
        .string()
        .required()
        .min(8)
        .pattern(
          new RegExp("^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$")
        )
        .messages({
          "string.empty": "Password cannot be an empty field",
          "string.pattern.base":
            "Invalid password, alphanumeric and characters",
          "string.min": `Password should have a minimum length of {#limit}`,
          "any.required": `Password is a required field`,
        }),
      confirmPassword: joi
        .string()
        .required()
        .min(8)
        .pattern(
          new RegExp("^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$")
        )
        .messages({
          "string.empty": "Password cannot be an empty field",
          "string.pattern.base":
            "Invalid password, alphanumeric and characters",
          "string.min": `Password should have a minimum length of {#limit}`,
          "any.required": `Password is a required field`,
        }),
    });

    return schema.validateAsync(data);
  },
  addressValidation: (data) => {
    const schema = joi.object().keys({
      city: joi.string().required().messages({
        "string.empty": "City cannot be an empty field",
        "any.required": "City is a required field",
      }),
      districts: joi.string().required().messages({
        "string.empty": "Districts cannot be an empty field",
        "any.required": "Districts is a required field",
      }),
      sub_districts: joi.string().required().messages({
        "string.empty": "Sub districts cannot be an empty field",
        "any.required": "Sub districts is a required field",
      }),
      detail_address: joi.string().required().messages({
        "string.empty": "Detail address cannot be an empty field",
        "any.required": "Detail address is a required field",
      }),
      zip_code: joi.string().required().messages({
        "string.empty": "Zip code cannot be an empty field",
        "any.required": "Zip code is a required field",
      }),
      status: joi.string().required().messages({
        "string.empty": "Status cannot be an empty field",
        "any.required": "Status is a required field or add by default",
      }),
    });

    return schema.validateAsync(data);
  },

  profileValidation: (data) => {
    const schema = joi.object().keys({
      firstname: joi.string().required().messages({
        "string.empty": "Firstname cannot be an empty field",
        "any.required": "Firstname is a required field",
      }),
      lastname: joi.string().required().messages({
        "string.empty": "Lastname cannot be an empty field",
        "any.required": "Lastname is a required field",
      }),
      email: joi.string().email().required().messages({
        "string.empty": "Email cannot be an empty field",
        "any.required": "Email is a required field",
        "string.email": "Please insert a valid email address",
      }),
    });

    return schema.validateAsync(data);
  },

  passwordValidation: (data) => {
    const schema = joi.object().keys({
      currentPassword: joi
        .string()
        .required()
        .pattern(
          new RegExp("^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$")
        )
        .messages({
          "string.empty": "Current password cannot be an empty field",
          "string.pattern.base":
            "Invalid current password, alphanumeric and characters",
          "string.min": `Current password should have a minimum length of {#limit}`,
          "any.required": `Current password is a required field`,
        }),
      newPassword: joi
        .string()
        .required()
        .pattern(
          new RegExp("^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$")
        )
        .messages({
          "string.empty": "New password cannot be an empty field",
          "string.pattern.base":
            "Invalid new password, alphanumeric and characters",
          "string.min": `New password should have a minimum length of {#limit}`,
          "any.required": `New password is a required field`,
        }),
      confirmPassword: joi
        .string()
        .required()
        .pattern(
          new RegExp("^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$")
        )
        .messages({
          "string.empty": "Confirm password cannot be an empty field",
          "string.pattern.base":
            "Invalid confirm password, alphanumeric and characters",
          "string.min": `Confirm password should have a minimum length of {#limit}`,
          "any.required": `Confirm password is a required field`,
        }),
    });

    return schema.validateAsync(data);
  },

  quantityValidation: (data) => {
    const schema = joi.object().keys({
      quantity: joi.string().required().messages({
        "string.empty": "Quantity cannot an be empty field",
        "any.required": "Quantity is a required field",
      }),
    });

    return schema.validateAsync(data);
  },
  reasonValidation: (data) => {
    const schema = joi.object().keys({
      reason: joi.string().required().messages({
        "string.empty": "Reason cannot an be empty field",
        "any.required": "Reason is a required field",
      }),
    });

    return schema.validateAsync(data);
  },

  storeValidation: (data) => {
    const schema = joi.object().keys({
      store_name: joi.string().required().messages({
        "string.empty": "Store name cannot an be empty field",
        "any.required": "Store name is a required field",
      }),
      city: joi.string().required().messages({
        "string.empty": "City cannot an be empty field",
        "any.required": "City is a required field",
      }),
      districts: joi.string().required().messages({
        "string.empty": "Districts cannot an be empty field",
        "any.required": "Districts is a required field",
      }),
      sub_districts: joi.string().required().messages({
        "string.empty": "Sub districts cannot an be empty field",
        "any.required": "Sub districts is a required field",
      }),
      detail_address: joi.string().required().messages({
        "string.empty": "Detail address cannot an be empty field",
        "any.required": "Detail address is a required field",
      }),
      zip_code: joi.string().required().messages({
        "string.empty": "Zip code cannot an be empty field",
        "any.required": "Zip code is a required field",
      }),
    });

    return schema.validateAsync(data);
  },

  productValidation: (data) => {
    const schema = joi.object().keys({
      name: joi.string().required().messages({
        "string.empty": "Product name cannot be an empty field",
        "any.required": "Product name is a required field",
      }),
      description: joi.string().required().messages({
        "string.empty": "Product description cannot be an empty field",
        "any.required": "Product description is a required field",
      }),
      category_id: joi.string().required().messages({
        "string.empty": "Category ID cannot be an empty field",
        "any.required": "Category ID is a required field",
      }),
      price: joi.string().required().messages({
        "string.empty": "Price ID cannot be an empty field",
        "any.required": "Price ID is a required field",
      }),
      stock: joi.string().required().messages({
        "string.empty": "Stock ID cannot be an empty field",
        "any.required": "Stock ID is a required field",
      }),
    });

    return schema.validateAsync(data);
  },
};
