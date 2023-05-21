import mongoose from "mongoose";

//definir el esquema
export const cartSchema = new mongoose.Schema({
    // carritoTimestamP:{
    //     type: Date,
    //     required: true
    // },
    products: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products"
          },
          quantity: {
            type: Number,
            required: true
          },
        }
      ]
})

