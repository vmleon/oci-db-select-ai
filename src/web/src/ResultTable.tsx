import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

interface Props {
    children: any,
    isLoading: boolean
}

export function ResultTable({ children, isLoading }: Props) {

    if (isLoading) {
        return <div className='flex-1 flex items-center space-x-4'>
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className='space-y-2'>
                <Skeleton className='h-4 w-[250px]' />
                <Skeleton className='h-4 w-[250px]' />
            </div>
        </div>
    }

    if (!children) {
        return <div className="flex flex-col items-center"><span className="flex-1">No data</span></div>;
    }

    const allHeaders: string[] = children.reduce((acc: any, obj: object) => {
        return [...acc, ...Object.keys(obj)];
    }, []);

    const headers: string[] = [...new Set(allHeaders)]

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {headers.map(((header) => <TableHead key={header}>{header}</TableHead>))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {children.map((row: string[], idx: number) => (
                    <TableRow key={idx}>
                        {headers.map((h: any) => (<TableCell key={h}>{row[h]}</TableCell>))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}