import { useState, useRef } from 'react';
import { toast } from '../../pages/header/message';
import { preUploadVideo, uploadVideoChunk } from '../../api/upload';

const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_UPLOADING = 3;

export interface UploadTask {
    uid: string;
    status: 'uploading' | 'success' | 'fail' | 'paused';
    chunkIndex: number;
    uploadId?: string;
    percent: number;
}

export const useVideoUpload = () => {
    const [tasks, setTasks] = useState<Record<string, UploadTask>>({});
    const uploadingCount = useRef(0);

    const updateTask = (uid: string, data: Partial<UploadTask>) => {
        setTasks((prev) => ({
            ...prev,
            [uid]: { ...prev[uid], ...data },
        }));
    };

    const handleCustomRequest = async (options: any) => {
        const { file, onSuccess, onError, onProgress } = options;
        const uid = file.uid;

        if (uploadingCount.current >= MAX_UPLOADING) {
            toast.warning('上传队列已满，请稍候');
            onError(new Error('上传队列已满'));
            return;
        }

        uploadingCount.current++;
        setTasks((prev) => ({
            ...prev,
            [uid]: { uid, status: 'uploading', chunkIndex: 0, percent: 0 },
        }));

        try {
            const fileSize = file.size;
            const chunks = Math.ceil(fileSize / CHUNK_SIZE);

            // 1. 预上传 (获取 uploadId)
            const preResult = await preUploadVideo(file.name, chunks);
            if (preResult?.code !== 200) {
                throw new Error(preResult?.info || '预上传失败');
            }
            const uploadId = preResult.data;
            updateTask(uid, { uploadId });

            // 2. 循环分片上传
            for (let i = 0; i < chunks; i++) {
                const start = i * CHUNK_SIZE;
                const end = Math.min(start + CHUNK_SIZE, fileSize);
                const chunkBlob = file.slice(start, end);

                const uploadResult = await uploadVideoChunk(i, uploadId, chunkBlob);
                if (uploadResult?.code !== 200) {
                    throw new Error(uploadResult?.info || `分片 ${i} 上传失败`);
                }

                const percent = Math.floor(((i + 1) / chunks) * 100);
                updateTask(uid, { chunkIndex: i + 1, percent });
                onProgress({ percent });
            }
            updateTask(uid, { status: 'success', percent: 100 });
            onSuccess('ok');
            toast.success(`${file.name} 上传成功`);
        } catch (err: any) {
            updateTask(uid, { status: 'fail' });
            onError(err);
            console.log(err);

            toast.error(`${file.name} 上传失败: ${err.msg}`);
        } finally {
            uploadingCount.current--;
        }
    };

    return {
        tasks,
        handleCustomRequest,
        uploadingCount: uploadingCount.current,
    };
};
