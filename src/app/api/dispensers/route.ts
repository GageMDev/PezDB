import {MongoClient, ObjectId} from 'mongodb';
import {v4 as uuidv4} from "uuid";
import {promises as fs} from "fs";

const url = 'mongodb://mongodb:27017';

// Database Name
const dbName = 'pez';

// Create a new MongoClient
const client = new MongoClient(url);

export async function GET(request: Request) {
    // Use connect method to connect to the server
    await client.connect();
    console.log("Connected successfully to server");

    const db = client.db(dbName);

    // Get the documents collection
    const collection = db.collection('dispensers');

    // Find all documents
    const dispensers = await collection.find().toArray();

    await client.close();

    // Send the dispensers as the response
    return Response.json(dispensers)
}

export async function POST(req: Request) {
    const formData = await req.formData()
    let imagePath = '';

    const image = formData.get('image')

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

    // Prepare the document to be inserted
    const document: { [key: string]: any; image: string } = {
        image: imagePath,
    };


    // Add all form data to the document
    for (let entry of formData.entries()) {
        const key = entry[0];
        const value = entry[1];

        // Skip the image field as it's already handled
        if (key !== 'image') {
            document[key] = value;
        }
    }

    // Insert the document
    const result = await collection.insertOne(document);

    await client.close();

    return Response.json({id: result.insertedId});
}


export async function DELETE(req: Request) {
    // Parse the JSON body of the request
    const data = await req.json();
    const _id = data._id;

    // Use connect method to connect to the server
    await client.connect();
    console.log("Connected successfully to server");

    const db = client.db(dbName);

    // Get the documents collection
    const collection = db.collection('dispensers');

    // Delete document
    const result = await collection.deleteOne({ _id: new ObjectId(_id) });

    await client.close();

    return Response.json({ deletedCount: result.deletedCount });
}

