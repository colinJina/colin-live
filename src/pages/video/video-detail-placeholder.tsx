import { useParams } from 'react-router-dom';

export default function VideoDetailPlaceholder() {
    const { videoId } = useParams<{ videoId: string }>();

    return (
        <main className="mx-auto w-full max-w-[1280px] px-4 py-8">
            <section className="rounded-2xl bg-white px-6 py-8 shadow-[0_10px_30px_rgba(24,25,28,0.08)] ring-1 ring-black/5">
                <h1 className="text-2xl font-semibold text-[#18191c]">视频详情页建设中</h1>
                <p className="mt-3 text-sm text-[#61666d]">
                    当前视频 ID：
                    <span className="font-medium text-[#18191c]">{videoId || '-'}</span>
                </p>
            </section>
        </main>
    );
}
