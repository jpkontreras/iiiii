import { LabelHTMLAttributes } from 'react';

export default function InputLabel({
    value,
    className = '',
    children,
    required = false,
    ...props
}: LabelHTMLAttributes<HTMLLabelElement> & { 
    value?: string | React.ReactNode;
    required?: boolean;
}) {
    const renderContent = () => {
        const content = value || children;
        if (required) {
            return (
                <>
                    {content} <span className="text-red-500">*</span>
                </>
            );
        }
        return content;
    };

    return (
        <label
            {...props}
            className={
                `block text-sm font-medium text-gray-700 dark:text-gray-300 ` +
                className
            }
        >
            {renderContent()}
        </label>
    );
}
