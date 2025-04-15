const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;

app.use(express.json());

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const dbName = "testDB";

let db, collection;

const drivers = [
    { name: "John Doe", age: 35, rating: 4.6, available: true },
    { name: "Jane Smith", age: 29, rating: 4.8, available: true },
    { name: "Carlos Alvarez", age: 42, rating: 4.2, available: false },
    { name: "Lina Lee", age: 31, rating: 4.7, available: true },
    { name: "Tom Walker", age: 40, rating: 4.1, available: false }
];

// Connect to MongoDB
async function initDB() {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    db = client.db(dbName);
    collection = db.collection("drivers");

    const existingCount = await collection.countDocuments();
    if (existingCount === 0) {
        await collection.insertMany(drivers);
        console.log("🚗 Sample drivers inserted");
    }
}

// GET all drivers
app.get('/drivers', async (req, res) => {
    const allDrivers = await collection.find().toArray();
    res.json(allDrivers);
});

// GET available drivers with rating ≥ 4.5
app.get('/drivers/high-rated', async (req, res) => {
    const highRated = await collection.find({
        available: true,
        rating: { $gte: 4.5 }
    }).toArray();
    res.json(highRated);
});

// PUT update rating of all available drivers by +0.1
app.put('/drivers/update-ratings', async (req, res) => {
    const result = await collection.updateMany(
        { available: true },
        { $inc: { rating: 0.1 } }
    );
    res.json({ modifiedCount: result.modifiedCount });
});

// DELETE all unavailable drivers
app.delete('/drivers/unavailable', async (req, res) => {
    const result = await collection.deleteMany({ available: false });
    res.json({ deletedCount: result.deletedCount });
});

// GET remaining drivers
app.get('/drivers/remaining', async (req, res) => {
    const remaining = await collection.find().toArray();
    res.json(remaining);
});

initDB().then(() => {
    app.listen(port, () => {
        console.log(`🌐 Server running on http://localhost:${port}`);
    });
}).catch(err => {
    console.error("❌ Failed to start server:", err);
});
