import fs from 'fs-extra';
import archiver from "archiver";
import path from "path";
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

/**
 * 压缩指定目录到一个 ZIP 文件
 * @param sourceDir 要压缩的目录路径
 * @param outZipFilePath 输出的 ZIP 文件路径
 */
export async function zipDirectory(sourceDir: string, outZipFilePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        // 确保输出目录存在
        fs.ensureDirSync(path.dirname(outZipFilePath));

        // 创建文件写入流
        const output = fs.createWriteStream(outZipFilePath);
        const archive = archiver('zip', {
            zlib: { level: 9 } // 压缩级别
        });

        // 监听关闭事件
        output.on('close', () => resolve());
        // 监听错误事件
        archive.on('error', (err) => reject(err));

        // 将输出流与归档器关联
        archive.pipe(output);

        // 使用 glob 模式将指定目录内的所有内容添加到压缩文件
        archive.glob('**/*', { cwd: sourceDir });

        // 完成归档
        archive.finalize();
    });
}

export async function compressPngImages(directory: string): Promise<void> {
    const files = await fs.promises.readdir(directory);

    for (const file of files) {
        const filePath = path.join(directory, file);
        const stats = await fs.promises.stat(filePath);

        if (stats.isDirectory()) {
            await compressPngImages(filePath);
        } else if (path.extname(file) === '.png') {
            const command = `pngquant --force ${filePath} -o ${filePath}`;
            try {
                await execAsync(command);
                console.log(`Compressed ${filePath}`);
            } catch (err) {
                console.error(`Error compressing ${filePath}: ${err}`);
            }
        }
    }
}