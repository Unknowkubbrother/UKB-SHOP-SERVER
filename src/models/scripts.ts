import mongoose from "mongoose";
import Roles from "../enum/roles";
export const ScriptSchema = new mongoose.Schema({
  nameScript: { type: String, required: true, unique: true },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  plan:{
    day: { type: Number, default: null },
    monthly: { type: Number, default: null },
    permanently:{ type:Number,require:true , default: null }
  },
  thumbnail:{type:String,require:true},
  video: { type: String, default: null },
  image: [],
  Changelogs: [
    {
      version: { type: String, required: true },
      logs: [],
    },
  ],
  webhook: { type: String, required: true },
  recommended: { type: Boolean, required: true, default: false },
  download: { type: String, required: true },
  status: { type: String, required: true, default: "active" },
});

export const Scripts = mongoose.model("Scripts", ScriptSchema);

export const getScriptsByStaff = () => Scripts.find();
export const getScriptById = (scriptId: string) =>
  Scripts.findById(scriptId).then((script) => script?.toObject()).catch(() => null);
export const getScriptByName = (nameScript: string) => Scripts.findOne({ nameScript });
export const createScript = (values: Record<string, any>) =>
  new Scripts(values).save().then((scripts) => scripts.toObject());
export const deleteScript = (id: string) =>
  Scripts.findByIdAndDelete(id);
  export const updateScriptById = (scriptId: string, updates: Record<string, any>) =>
    Scripts.findByIdAndUpdate(scriptId, updates, { new: true }).then((script) => script?.toObject()).catch(() => null);

export const getScriptsRecommended = () => Scripts.find({ recommended: true,status:"active" });

export const getScripts = () => Scripts.find({ status: "active" });
