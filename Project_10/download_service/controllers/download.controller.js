import { Downloads } from "../models/download.model.js";
import "dotenv/config.js";

const makeDownload = async (req, res) => {
  const { name } = req.body;

  try {
    if (!name) {
      return res.status(400).send({ error: "Name is required" });
    }

    let download = await Downloads.findOne({ name });

    if (download) {
      download.downloaded = (download.downloaded || 0) + 1;
      await download.save();
    } else {
      download = await Downloads.create({ name, downloaded: 1 });
    }

    return res.status(201).send({ download });
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: e.message });
  }
};

const testDownload = async (req, res) => {

  try {

    return res.status(201).send({ message: "Hello from download service" });
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: e.message });
  }
};

export { makeDownload, testDownload };