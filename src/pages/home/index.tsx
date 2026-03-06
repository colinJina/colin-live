import { useParams } from 'react-router-dom';

import BreadcrumbCategory from './components/breadcrumb-category';

function HomeContent() {
    const { categoryCode } = useParams();
    const showBreadcrumb = Boolean(categoryCode && categoryCode !== 'hot');

    return <>{showBreadcrumb && <BreadcrumbCategory />}</>;
}

export default function Home() {
    return (
        <main>
            <div className="mx-auto w-full">
                <HomeContent />
            </div>
        </main>
    );
}
