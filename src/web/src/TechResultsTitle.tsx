import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface Props {
    narrationTimeInMillis: number,
    resultTimeInMillis: number,
    sqlQueryTimeInMillis: number
}

export default function TechResultsTitle({ narrationTimeInMillis, resultTimeInMillis, sqlQueryTimeInMillis }: Props) {
    return <HoverCard>
        <HoverCardTrigger asChild>
            <Button variant="link">
                <Label className='text-xl'>Tech Results</Label>
            </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
            <div className="flex flex-col justify-between space-x-4 ">
                <h4 className="text-lg font-semibold">Elasted Time:</h4>
                <p className="text-sm">
                    SQL Query Time: <span className="font-bold">{sqlQueryTimeInMillis}</span> ms
                </p>
                <p className="text-sm">
                    Narration Time: <span className="font-bold">{narrationTimeInMillis}</span> ms
                </p>
                <p className="text-sm">
                    Result Time: <span className="font-bold">{resultTimeInMillis}</span> ms
                </p>
            </div>
        </HoverCardContent>
    </HoverCard>
}