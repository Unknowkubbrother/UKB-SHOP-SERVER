require("dotenv").config();
import express, { response } from "express";
import axios from "axios";
import multer from "multer";
import FormData from "form-data";
import fs from "fs";
import { getpeymentBytransRefId } from "../models/payments";

////////////////////////////////////////////////////// easy slip //////////////////////////////////////////////////
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./imagePayment-slip");
//   },

//   filename: async function (req: any, file: any, cb: any) {
//     let extArray = file.mimetype.split("/");
//     let extension = extArray[extArray.length - 1];
//     cb(null, file.fieldname + "-" + Date.now() + "." + extension);
//   },
// });
// const fileFilter = (req: any, file: any, cb: any) => {
//   if (
//     file.mimetype === "image/jpg" ||
//     file.mimetype === "image/jpeg" ||
//     file.mimetype === "image/png"
//   ) {
//     cb(null, true);
//   } else {
//     cb(new Error("Image uploaded is not of type jpg/jpeg or png"), false);
//   }
// };
// export const uploadSlip = multer({
//   storage: storage,
//   fileFilter: fileFilter,
// }).single("paymentSlip");

// export const verifySlip = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
//     try{
//         let { storeData, total } = req.body;
//         storeData = await JSON.parse(storeData);
//         const cookies = JSON.parse(req.cookies['ukb-data']);
//         const username = cookies.username;
//         if (!storeData || !username || !req.file || !total) {
//             return res.sendStatus(400);
//         }

//         const formData = new FormData();
//         formData.append('file', fs.createReadStream(req.file.path));

//         const config = {
//         method: 'post',
//         maxBodyLength: Infinity,
//         url: 'https://developer.easyslip.com/api/v1/verify',
//         headers: {
//             'Authorization': 'Bearer a6cc2c81-7cb0-4b3c-a594-221f8e144228',
//             ...formData.getHeaders()
//         },
//         data: formData
//         };

//         const response = await axios.request(config);
//         if(response.data.status === 200) {
//             const name = response.data.data.receiver.account.name.en.split(" ");
//             if(name[0] === "NUTCHANON"){
//                 const tranRefCheck = await getpeymentBytransRefId(response.data.data.transRef);
//                 if(tranRefCheck){
//                     return res.status(409).send("This slip has been verified").end();
//                 }
//                 if(parseFloat(response.data.data.amount.amount) !== parseFloat(total)){
//                     return res.status(400).send("Total amount is not equal to the slip amount").end();
//                 }
//                 req.body.transRefId = response.data.data.transRef;
//                 req.body.data = storeData;
//                 req.body.total = parseFloat(total);
//                 req.body.dateSlip = response.data.data.date;
//                 req.body.username = username;
//                 req.body.imageSlip = req.file.filename;
//                 next();
//             }else{
//                 return res.status(400).send("This slip is not from the account holder").end();
//             }
//         }

//     }catch (error) {
//         console.log(error);
//         if(error.response.status === 404){
//             return res.status(404).send(error.response.data.message).end();
//         }
//         return res.sendStatus(400);
//     }
// }

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////

const storage = multer.memoryStorage();
export const uploadSlip = multer({ storage: storage }).single("paymentSlip");

export const verifySlip = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    let { storeData, total } = req.body;
    storeData = await JSON.parse(storeData);
    const cookies = JSON.parse(req.cookies["ukb-data"]);
    const username = cookies.username;
    if (!storeData || !username || !req.file || !total) {
      return res.sendStatus(400);
    }

    const branchId = process.env.branchId;
    const apiKey = process.env.apiKey;

    const file = req.file;
    const formData = new FormData();
    formData.append("files", file.buffer, file.originalname);
    formData.append("log", "true");
    formData.append("amount", total);

    // ส่งข้อมูลผ่าน axios
    const response = await axios.postForm(
      `https://api.slipok.com/api/line/apikey/${branchId}`,
      formData,
      {
        headers: {
          "x-authorization": apiKey,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.status == 200) {
      const tranRefCheck = await getpeymentBytransRefId(
        response.data.data.transRef
      );
      if (tranRefCheck) {
        return res.status(409).send("This slip has been verified").end();
      }
      req.body.transRefId = response.data.data.transRef;
      req.body.data = storeData;
      req.body.total = parseFloat(total);
      req.body.dateSlip = `${response.data.data.transDate} ${response.data.data.transTime}`;
      req.body.username = username;
      next();
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send(error.response.data.message).end();
  }
};
