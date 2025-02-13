import { Skeleton } from "@/components/ui/skeleton"
import { format } from 'sql-formatter';

interface Props {
    children: string | undefined,
    isLoading: boolean
}

export default function SQLCode({ children, isLoading }: Props) {
    if (isLoading) {
        return <div className='flex-1 flex p-11 items-center space-x-4'>
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className='space-y-2'>
                <Skeleton className='h-4 w-[250px]' />
                <Skeleton className='h-4 w-[250px]' />
            </div>
        </div>;
    }

    if (!children) {
        return null;
    }

    return <div className='flex-1 min-w-max'>
        <pre className='text-sm min-w-10 sm:text-base inline-flex text-left items-center space-x-4 bg-gray-800 text-white rounded-lg p-4 pl-6'>
            {format(children, { language: 'plsql', tabWidth: 2, keywordCase: "upper", expressionWidth: 30 })}
        </pre>
    </div>;
}