import mongoose from "mongoose";
import Roles from "../enum/roles";

const ScriptSchema = new mongoose.Schema({
    nameScript: { type: String, required: true,unique: true},
    description: { type: String, required: true},
    price: { type: Number, required: true},
    webhook: { type: String, required: true},
    status: { type: String, required: true, default: 'active' },
});

export const Scripts = mongoose.model('Scripts', ScriptSchema);


// export const getLicenses = () => Licenses.find();
export const getScript = (nameScript: string) => Scripts.findOne({ nameScript });
// export const getLicenseByLicenseAndUsername = (license: string,username:string) => Licenses.findOne({ license,owner:username });
// export const checkLicense = (license: string,ipaddress: string )=> Licenses.findOne({ 
//     "license": license,
//     "ipaddress": ipaddress
// });
// export const getLicenseByUsername = (username:string) => Licenses.find({ owner:username });
export const createScript = (values: Record<string, any>) => new Scripts(values)
    .save().then((scripts) => scripts.toObject());
// export const deleteLicense = (license: string) => Licenses.findOneAndDelete({ license });