import { promises as fs } from 'fs';

export async function POST(req: Request) {
    const formD = await req.formData()

    const image = formD.get('image')

    // Ensure image is an instance of Blob
    if (image instanceof Blob) {
        const buffer = await image.arrayBuffer();
        await fs.writeFile('./test.png', Buffer.from(buffer));
    }

    return Response.json({'hey': 1})
}