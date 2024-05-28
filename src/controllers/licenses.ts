require("dotenv").config();
import express from "express";
import {
  getLicense,
  createLicense,
  getLicenses,
  checkLicense,
  deleteLicenseByusername,
  getLicenseByLicenseAndUsername,
  getLicenseByUsername,
  getLicenseByNameScriptAndUsername,
  getLicenseById,
  getLicenseByScriptId,
} from "../models/licenses";
import { getScriptByName, getScriptById } from "../models/scripts";
import { random, generateLicense } from "../helpers";
import { Discordwebhook } from "../webhook";

export const AddLicenseByStaff = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { nameScript, ipaddress, owner, rent, scriptId, status } = req.body;
    const license = `license-${nameScript}-${generateLicense(
      scriptId,
      ipaddress
    )}`;
    if (!license || !nameScript || !ipaddress || !owner || !rent || !scriptId || !status) {
      return res.sendStatus(400);
    }
    const License = await getLicense(license);
    if (License) {
      return res.sendStatus(409);
    }

    if (rent.status) {
    const startDate = new Date(rent.startDate);
    const endDate = new Date(rent.endDate);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

      const startTime = startDate.getTime();
      const endTime = endDate.getTime();

      var newLicense = await createLicense({
        license,
        nameScript,
        scriptId,
        ipaddress,
        owner: owner,
        rent: {
          status: rent.status,
          startDate: startTime,
          endDate: endTime,
        },
        status
      });
    }else{
      var newLicense = await createLicense({
        license,
        nameScript,
        scriptId,
        ipaddress,
        owner: owner,
        rent: {
          status: rent.status,
          startDate: 0,
          endDate: 0,
        },
        status
      });
    }

    return res.status(201).send(newLicense.license).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const Addlicense = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { nameScript, ipaddress, id, scriptId } = req.body;
    const license = await `license-${nameScript}-${generateLicense(
      scriptId,
      ipaddress.trim()
    )}`;
    if (!license || !nameScript || !ipaddress) {
      return res.sendStatus(400);
    }
    const CheckLicense = await getLicense(license);
    if (CheckLicense) {
      return res.sendStatus(409);
    }

    const License = await getLicenseById(id);
    if (!License) {
      return res.sendStatus(404);
    }

    License.license = license;
    License.ipaddress = ipaddress;
    License.status = "active";
    License.save();

    return res.status(201).send(License.license).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const getAllLicenses = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const licenses = await getLicenses();
    const getDate = (NextTime: number) => {
      let today = new Date(NextTime);
      let date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      let time = today.getHours() + ":" + today.getMinutes();
      return date + " " + time;
    };

    const scriptLicenses = licenses.map((license) => {
      return {
        nameScript: license.nameScript,
        license: license.license,
        ipaddress: license.ipaddress,
        owner: license.owner,
        status: license.status,
        rent: {
          status: license.rent.status,
          startDate:
            license.rent.startDate === 0
              ? "ไม่มีวันหมดอายุ"
              : getDate(license.rent.startDate),
          endDate:
            license.rent.endDate === 0
              ? "ไม่มีวันหมดอายุ"
              : getDate(license.rent.endDate),
        },
      };
    });

    return res.status(200).json(scriptLicenses).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const getLicenseByScriptIdForstaff = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.sendStatus(400);
    }
    const License = await getLicenseByScriptId(id);
    if (!License) {
      return res.sendStatus(404);
    }

    const getDate = (NextTime: number) => {
      let today = new Date(NextTime);
      let date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      let time = today.getHours() + ":" + today.getMinutes();
      return date + " " + time;
    };

    const scriptLicenses = License.map((license) => {
      return {
        nameScript: license.nameScript,
        license: license.license,
        ipaddress: license.ipaddress,
        owner: license.owner,
        status: license.status,
        rent: {
          status: license.rent.status,
          startDate:
            license.rent.startDate === 0
              ? "ไม่มีวันหมดอายุ"
              : getDate(license.rent.startDate),
          endDate:
            license.rent.endDate === 0
              ? "ไม่มีวันหมดอายุ"
              : getDate(license.rent.endDate),
        },
      };
    });
    
    return res.status(200).json(scriptLicenses).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const delete_a_license = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { license, owner } = req.body;
    if (!license || !owner) {
      return res.sendStatus(400);
    }
    const License = await deleteLicenseByusername(license, owner);
    if (!License) {
      return res.sendStatus(404);
    }
    return res.status(200).send("License deleted successfully!").end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const Checklicense = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { license, ipaddress } = req.body;
    console.log(license, ipaddress);
    res.sendStatus(200)
    // if (!license || !ipaddress) {
    //   return res.sendStatus(400);
    // }
    // const License = await checkLicense(license, ipaddress);
    // if (!License) {
    //   return res.status(404).send("License inactive").end();
    // }

    // if (License.status === "inactive") {
    //   return res.send("License is inactive").status(200).end();
    // }

    // const Script = await getScriptById(License.scriptId);
    // if (!Script) {
    //   return res.sendStatus(404);
    // }

    // if (Script.status === "inactive") {
    //   return res.send("Script is inactive").status(200).end();
    // }

    // const getDate = (NextTime: number) => {
    //   let today = new Date(NextTime);
    //   let date =
    //     today.getFullYear() +
    //     "-" +
    //     (today.getMonth() + 1) +
    //     "-" +
    //     today.getDate();
    //   let time = today.getHours() + ":" + today.getMinutes();
    //   return date + " " + time;
    // };

    // if (License.rent.status) {
    //   const startDate = License.rent.startDate;
    //   const endDate = License.rent.endDate;
    //   if (process.env.TimeZoneTH == "true") {
    //     var now = Date.now() + 7 * 60 * 60 * 1000;
    //   } else {
    //     var now = Date.now();
    //   }
    //   console.log(getDate(now), getDate(startDate), getDate(endDate));
    //   if (now < startDate || now > endDate) {
    //     const rentLicense = await deleteLicenseByusername(
    //       license,
    //       License.owner
    //     );
    //     if (!rentLicense) {
    //       return res.sendStatus(404);
    //     } else {
    //       return res.send("License is expired").status(200).end();
    //     }
    //   }
    // }

    // await Discordwebhook(
    //   License.nameScript,
    //   ipaddress,
    //   License.owner,
    //   Script.webhook
    // );
    // return res.send(License.scriptId).status(200).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const ResetLicense = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { license, username, Newipaddress, scriptId } = req.body;
    if (!license || !username || !Newipaddress || !scriptId) {
      return res.sendStatus(400);
    }
    const licenseSplit = license.split("-");
    const License = await getLicenseByLicenseAndUsername(license, username);
    if (!License) {
      return res.sendStatus(404);
    }

    const getDate = (NextTime: number) => {
      let today = new Date(NextTime);
      let date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      let time = today.getHours() + ":" + today.getMinutes();
      return date + " " + time;
    };

    if (
      License.resetlicenseTime > Date.now() &&
      License.resetlicenseTime !== 0
    ) {
      return res
        .status(400)
        .send(
          `You can reset your license after ${getDate(
            License.resetlicenseTime
          )}`
        );
    }

    const day = parseInt(process.env.RESET_LICENSE_TIME);
    if (process.env.TimeZoneTH == "true") {
      var DateNextReset =
        Date.now() + 7 * 60 * 60 * 1000 + day * 24 * 60 * 60 * 1000;
    } else {
      var DateNextReset = Date.now() + day * 24 * 60 * 60 * 1000;
    }
    License.resetlicenseTime = DateNextReset;
    const Newlicense = `license-${licenseSplit[1]}-${generateLicense(
      scriptId,
      Newipaddress.trim()
    )}`;

    const CheckLicense = await getLicense(Newlicense);
    if (CheckLicense) {
      return res.sendStatus(409);
    }

    License.license = Newlicense;
    License.ipaddress = Newipaddress;
    License.save();
    return res
      .send({
        Newlicense: Newlicense,
        Newipaddress: Newipaddress,
        NextReset: getDate(DateNextReset),
      })
      .status(200)
      .end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const getAllLicenseForUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.sendStatus(400);
    }
    const Licenses = await getLicenseByUsername(username);
    if (!Licenses) {
      return res.sendStatus(404);
    }
    const getDate = (NextTime: number) => {
      let today = new Date(NextTime);
      let date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      let time = today.getHours() + ":" + today.getMinutes();
      return date + " " + time;
    };

    const LicensesArray = await Promise.all(
      Licenses.map(async (license) => {
        const script = await getScriptById(license.scriptId);
        return {
          license: license.license,
          nameScript: license.nameScript,
          scriptId: license.scriptId,
          ipaddress: license.ipaddress,
          owner: license.owner,
          status: license.status,
          rent: {
            status: license.rent.status,
            startDate:
              license.rent.startDate === 0
                ? "ไม่มีวันหมดอายุ"
                : getDate(license.rent.startDate),
            endDate:
              license.rent.endDate === 0
                ? "ไม่มีวันหมดอายุ"
                : getDate(license.rent.endDate),
          },
          id: license._id,
          download: script.download,
          show: false,
        };
      })
    );
    return res.json(LicensesArray).status(200).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const ActiveControl = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { license, username } = req.body;
    if (!username || !license) {
      return res.sendStatus(400);
    }
    const Licenses = await getLicenseByLicenseAndUsername(license, username);
    if (!Licenses) {
      return res.sendStatus(404);
    }
    Licenses.status = Licenses.status === "active" ? "inactive" : "active";
    Licenses.save();
    return res.send(Licenses.status).status(200).end();
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};
