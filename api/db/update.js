import { MongoClient } from "mongodb";

const uri = "mongodb+srv://Database:Veryard@cluster0.nwum1yn.mongodb.net/?appName=Cluster0";
let client;
let db;
let key = [ "ab97jsu42" ]

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      status: "error",
      message: "Method not allowed. Use POST."
    });
  }
  if (!req.body.apikey || !key.includes(req.body.apikey)) return res.status(403).json({message:"APIKEY required"})

  try {
    const { filter, update } = req.body;

    if (!filter || !update) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields: filter and update are required."
      });
    }

    if (typeof update !== "object") {
      return res.status(400).json({
        status: "error",
        message: "Invalid format: update must be a JSON object."
      });
    }

    if (!client) {
      client = new MongoClient(uri);
      await client.connect();
      db = client.db("DB");
    }

    const result = await db.collection("user").updateOne(
      filter,
      update,
      { upsert: true }
    );

    return res.status(200).json({
      status: "success",
      message: "Data updated successfully.",
      data: {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
        upsertedId: result.upsertedId || null
      }
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: "error",
      message: "Internal server error.",
      error: err.message
    });
  }
}