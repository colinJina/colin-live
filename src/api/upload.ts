import request from './request';
import type { ResponseVO } from './video';

// 预上传接口
export const preUploadVideo = (fileName: string, chunks: number): Promise<ResponseVO<string>> => {
    return request<string>({
        url: '/file/preUploadVideo',
        method: 'POST',
        data: {
            fileName,
            chunks,
        },
    }) as Promise<ResponseVO<string>>;
};

export const uploadVideoChunk = (
    chunkIndex: number,
    uploadId: string,
    chunkFile: Blob,
): Promise<ResponseVO<null>> => {
    const formData = new FormData();
    formData.append('chunkFile', chunkFile);

    return request<null>({
        url: '/file/uploadVideo',
        method: 'POST',
        params: {
            chunkIndex,
            uploadId,
        },
        data: formData,
    }) as Promise<ResponseVO<null>>;
};
