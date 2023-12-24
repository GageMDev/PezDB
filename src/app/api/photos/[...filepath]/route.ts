import { MongoClient } from 'mongodb';
import {v4 as uuidv4} from "uuid";
import {promises as fs} from "fs";


export async function GET(request: Request,  { params }: { params: { filepath: string[] } }) {
    const buffer = await fs.readFile(`/${params.filepath.join("/")}`)
    return new Response(buffer)
}

