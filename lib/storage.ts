import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function saveFile(file: File): Promise<{ filename: string; url: string; size: number; type: string }> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const uniqueId = uuidv4();
    const originalName = file.name;
    const ext = originalName.split('.').pop();
    const filename = `${uniqueId}.${ext}`;

    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    // Save file
    const filePath = join(uploadDir, filename);
    await writeFile(filePath, buffer);

    return {
        filename: originalName,
        url: `/uploads/${filename}`,
        size: file.size,
        type: file.type,
    };
}

export async function deleteFile(url: string) {
    try {
        // url is like /uploads/filename.ext
        const filename = url.split('/').pop();
        if (!filename) return;

        const filePath = join(process.cwd(), 'public', 'uploads', filename);
        const fs = await import('fs/promises');
        await fs.unlink(filePath);
    } catch (error) {
        console.error('Error deleting file:', error);
        // Don't throw, just log. we don't want to break the DB delete transaction if file is missing
    }
}
