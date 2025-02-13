import { Label } from "@/components/ui/label"

interface Props {
    narrationTimeInMillis: number,
    resultTimeInMillis: number,
    sqlQueryTimeInMillis: number
}

export default function TechResultsTitle({ narrationTimeInMillis, resultTimeInMillis, sqlQueryTimeInMillis }: Props) {
    return <div className="flex flex-col justify-between space-x-4 ">
        <Label className='text-2xl'>Tech Results</Label>
        <div className="flex justify-around align-middle gap-6">
            <span className="text-sm flex gap-1">
                NQL to SQL: <pre className="font-bold">{sqlQueryTimeInMillis}</pre> ms
            </span>
            <span className="text-sm flex gap-1">
                Narration: <pre className="font-bold">{narrationTimeInMillis}</pre> ms
            </span>
            <span className="text-sm flex gap-1">
                Fetch: <pre className="font-bold">{resultTimeInMillis}</pre> ms
            </span>
        </div>
    </div>
}