import { times } from "lodash";
import mongoose from "mongoose";

const PaymentsSchema = new mongoose.Schema({
  transRefId: { type: String, required: true, unique: true },
  data: [
    {
      scriptId: { type: String, required: true },
      nameScript: { type: String, required: true },
      plan: {
        permanently: { type: Number, default: null },
        monthly: { type: Number, default: null },
        day: { type: Number, default: null },
        UnitPrice: { type: Number, default: null },
        unit: { type: Number, default: null },
    }
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
export const getPaymentsbyUser = (username:string) => Payments.find({username});
export const getPayments = () => Payments.find();