import { times } from "lodash";
import mongoose from "mongoose";

const PaymentsSchema = new mongoose.Schema({
  transRefId: { type: String, required: true, unique: true },
  data: [
    {
      scriptId: { type: String, required: true },
      nameScript: { type: String, required: true },
      Plan: {
        permanently: {
          status: { type: Boolean, required: true, default: false },
          price: { type: Number, required: true, default: 0 },
        },
        rent: {
          status: { type: Boolean, required: true, default: false },
          Unitprice: { type: Number, required: true, default: 0 },
          day: { type: Number, required: true, default: 0 },
          price: { type: Number, required: true, default: 0 },
        },
      },
    },
  ],
  total: { type: Number, required: true },
  dateSlip: { type: String, required: true },
  username: { type: String, required: true }
}, { timestamps: true});

export const Payments = mongoose.model("Payments", PaymentsSchema);

export const getpeymentBytransRefId = (transRefId: string) => Payments.findOne({ transRefId });
export const createPayment = (values: Record<string, any>) => new Payments(values)
    .save().then((payment) => payment.toObject());
