const { MongoClient } = require('mongodb');

async function main() {
    const url = "mongodb://localhost:27017"; // Replace with your MongoDB URL
    const client = new MongoClient(url);

    try {
        // Start the timer
        const startTime = Date.now();

        await client.connect();
        console.log("Connected to MongoDB!");

        // End the timer and calculate the duration
        const endTime = Date.now();
        const duration = endTime - startTime;
        console.log(`Connection time: ${duration} milliseconds`);

        const db = client.db("testDB");
        const collection = db.collection("users");

        // Insert a document
        await collection.insertOne({ name: "Alice", age: 25 });
        console.log("Document inserted!");

        // Query the document
        const result = await collection.findOne({ name: "Alice" });
        console.log("Query result:", result);
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}

main();