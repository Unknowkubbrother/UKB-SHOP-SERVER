import mongoose from "mongoose";
import Roles from "../enum/roles";

const LicenseSchema = new mongoose.Schema({
    license: { type: String, required: true,default: 'ยังไม่ได้เชื่อมต่อ License'},
    nameScript: { type: String, required: true},
    scriptId: { type: String, required: true},
    ipaddress: { type: String, required: true, default: 'ยังไม่ได้เชื่อมต่อ IP'},
    status: { type: String, required: true, default: 'inactive' },
    resetlicenseTime: { type: Number, required: true, default: 0},
    rent:{
        status:{ type: Boolean, required: true, default: false},
        startDate:{ type: Number, required: true, default: 0},
        endDate:{ type: Number, required: true, default: 0},
    },
    owner: { type: String, required: true}
});
    
export const Licenses = mongoose.model('Licenses', LicenseSchema);


export const getLicenses = () => Licenses.find();
export const getLicense = (license: string) => Licenses.findOne({ license });
export const getLicenseByLicenseAndUsername = (license: string,username:string) => Licenses.findOne({ license,owner:username });
export const getLicenseByNameScriptAndUsername = (nameScript: string,username:string) => Licenses.findOne({ nameScript,owner:username });
export const checkLicense = (license: string,ipaddress: string )=> Licenses.findOne({ 
    "license": license,
    "ipaddress": ipaddress
});
export const getLicenseByUsername = (username:string) => Licenses.find({ owner:username });
export const getLicenseById = (id: string) => Licenses.findById(id);
export const createLicense = (values: Record<string, any>) => new Licenses(values)
    .save().then((license) => license.toObject());
export const deleteLicenseByusername = (license: string,username:string) => Licenses.findOneAndDelete({ license,owner:username });
export const getLicenseByScriptId = (scriptId: string) => Licenses.find({ scriptId });
export const deleteManyLicenseByScriptId = (scriptId: string) => Licenses.deleteMany({ scriptId });
