import { promises as fs } from 'fs';
import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

// Connection URL
const url = process.env.NODE_ENV === "development" ? 'mongodb://localhost:27017' : 'mongodb://mongodb:27017';

// Database Name
const dbName = 'pez';

// Create a new MongoClient
const client = new MongoClient(url);

export async function POST(req: Request) {
    const formData = await req.formData()
    const name = formData.get("name")
    const stemColor = formData.get("stemColor")

    const image = formData.get('image')
    let imagePath = '';

    // Ensure image is an instance of Blob
    if (image instanceof Blob) {
        const buffer = await image.arrayBuffer();
        const uniqueName = uuidv4(); // Generate a unique name for the image
        imagePath = `/storage/photos/${uniqueName}.png`;
        await fs.writeFile(imagePath, Buffer.from(buffer));
    }

    // Use connect method to connect to the server
    await client.connect();
    console.log("Connected successfully to server");

    const db = client.db(dbName);

    // Get the documents collection
    const collection = db.collection('dispensers');

    // Insert some documents
    const result = await collection.insertOne({
        name: name,
        stemColor: stemColor,
        image: imagePath
    });

    await client.close();

    return Response.json({id: result.insertedId});
}
