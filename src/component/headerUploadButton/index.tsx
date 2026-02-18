import { Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import clsx from 'clsx';

interface HeaderUploadButtonProps {
    onClick?: () => void;
    loading?: boolean;
    className?: string;
}

export default function HeaderUploadButton({
    onClick,
    loading,
    className,
}: HeaderUploadButtonProps) {
    return (
        <Button
            type="primary"
            icon={<UploadOutlined />}
            loading={loading}
            onClick={onClick}
            className={clsx(
                // B站风格
                'h-8 px-4',
                'rounded-full',
                'font-medium',
                '!bg-[#FB7299] hover:!bg-[#FB7299]',
                'shadow-sm',
                className,
            )}
        >
            投稿
        </Button>
    );
}
