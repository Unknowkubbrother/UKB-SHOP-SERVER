import mongoose from "mongoose";
import Roles from "../enum/roles";
export const ScriptSchema = new mongoose.Schema({
  nameScript: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
//   promote: {
//     youTube: { type: String, required: true },
//     image: [{ type: String, required: true }],
//   },
//   Changelogs: [
//     {
//       version: { type: String, required: true },
//       description: { type: String, required: true },
//     },
//   ],
  webhook: { type: String, required: true },
  status: { type: String, required: true, default: "active" },
});

export const Scripts = mongoose.model("Scripts", ScriptSchema);

export const getScripts = () => Scripts.find();
export const getScript = (nameScript: string) =>
  Scripts.findOne({ nameScript });
export const createScript = (values: Record<string, any>) =>
  new Scripts(values).save().then((scripts) => scripts.toObject());
export const deleteScript = (nameScript: string) =>
  Scripts.findOneAndDelete({ nameScript });
