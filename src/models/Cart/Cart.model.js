const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartModel = new Schema(
  {
    cart_userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      require: true,
    },
    cart_status: {
      type: String,
      enum: ["active", "pending", "failed", "completed"],
      default: "active",
    },
    cart_products: {
      type: Array,
      default: [],
    },
    /*
        {
            shop_id,
            products: [
                {
                    product_id,
                    variant
                    quantity,
                    price
                }
            ]
        }
        
        case 1: Nếu chưa tồn tại sản phẩm thì thêm mới vào
        case 2: nếu đã tồn tại thì thêm số lượng (variation giong nhau)
    */
    cart_cout: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
// create user + create cart
const KeyToken = mongoose.model("cart", CartModel);

module.exports = KeyToken;
