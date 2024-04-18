import mongoose from "mongoose";
import Roles from "../enum/roles";
export const ScriptSchema = new mongoose.Schema({
  nameScript: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  trade:{
    permanently: {
      status: { type: Boolean, required: true, default: false },
      price: { type: Number, required: true , default: 0},
    },
    rent: {
      status: { type: Boolean, required: true, default: false },
      Unitprice: { type: Number, required: true, default: 0}
    },
  },
  promote: {
    youTube: { type: String, required: true },
    image: [
      {
        url: { type: String, required: true },
        alt: { type: String, required: true },
      },
    ],
  },
  Changelogs: [
    {
      version: { type: String, required: true },
      description: { type: String, required: true },
    },
  ],
  webhook: { type: String, required: true },
  recommended: { type: Boolean, required: true, default: false },
  status: { type: String, required: true, default: "active" },
});

export const Scripts = mongoose.model("Scripts", ScriptSchema);

export const getScripts = () => Scripts.find();
export const getScriptById = (scriptId: string) =>
  Scripts.findById(scriptId).then((script) => script?.toObject()).catch(() => null);
export const getScriptByName = (nameScript: string) => Scripts.findOne({ nameScript });
export const createScript = (values: Record<string, any>) =>
  new Scripts(values).save().then((scripts) => scripts.toObject());
export const deleteScript = (nameScript: string) =>
  Scripts.findOneAndDelete({ nameScript });
