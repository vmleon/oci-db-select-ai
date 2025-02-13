import { useQuery } from '@tanstack/react-query';
import { useState } from 'react'
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ResultTable } from './ResultTable';
import SQLCode from './SQLCode';
import Narration from './Narration';
import TechResultsTitle from './TechResultsTitle';

interface SelectAiQueryResponse {
    prompt: string,
    sqlQuery: string,
    sqlQueryTimeInMillis: number,
    narration: string,
    narrationTimeInMillis: number,
    result: object[]
    resultTimeInMillis: number,
}

function SelectAiView() {
    const { toast } = useToast()
    const [promptValue, setPromptValue] = useState<string>("");

    const promptOnChange = (e: any) => {
        e.preventDefault();
        setPromptValue(e.target.value);
    }

    const sendOnClick = () => {
        refetch();
    }

    const {
        data, isError, error, isLoading, refetch
    } = useQuery({
        enabled: false,
        queryKey: ["select-ai-response", { promptValue }],
        staleTime: 1000,
        queryFn: async () => {
            const res = await fetch("/api/v1.0.0/selectai/query", {
                method: "POST",
                body: JSON.stringify({ prompt: promptValue }),
                headers: { "Content-Type": "application/json" }
            });
            return (await res.json()) as SelectAiQueryResponse;
        }
    })

    if (isError) {
        toast({
            variant: "destructive",
            title: "Error POST Select AI query",
            description: error.message
        })
    }

    return (
        <div className="flex flex-col gap-4">
            <div className='flex-1 flex py-6 px-2 gap-10'>
                <div className='flex-none flex flex-col py-10 justify-start gap-3'>
                    <div className='flex flex-col gap-3'>
                        <Label htmlFor="prompt">What do you want to know about your business?</Label>
                        <Textarea
                            id="prompt"
                            name="prompt"
                            required
                            placeholder='Business Prompt'
                            value={promptValue}
                            onChange={promptOnChange}></Textarea>
                        <Button disabled={!promptValue.length} onClick={sendOnClick}>Get Answer</Button>
                    </div>
                    <div className="flex flex-col gap-3 py-10">
                        <Label htmlFor="prompt">Prompt examples</Label>
                        <Select defaultValue="" onValueChange={(value) => { setPromptValue(value ? value : "") }}>
                            <SelectTrigger className="w-[280px] text-foreground">
                                <SelectValue placeholder="Examples" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={null!}>-</SelectItem>
                                <SelectItem value="how many customers do we have?">how many customers do we have?</SelectItem>
                                <SelectItem value="top 10 best selling products by category">top 10 best selling products by category</SelectItem>
                                <SelectItem value="show the top 10 customers who are buying Hardware">show the top 10 customers who are buying Hardware</SelectItem>
                                <SelectItem value="show the top 10 customers with all the details who are buying Hardware">show the top 10 customers with all the details who are buying Hardware</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className='flex-2 py-6 px-2'>
                    <TechResultsTitle
                        narrationTimeInMillis={data?.narrationTimeInMillis || 0}
                        resultTimeInMillis={data?.resultTimeInMillis || 0}
                        sqlQueryTimeInMillis={data?.sqlQueryTimeInMillis || 0} />
                    <SQLCode isLoading={isLoading}>{data?.sqlQuery}</SQLCode>
                </div>
            </div>
            <Separator />
            <div className="flex flex-col gap-4  py-4 px-2 border-2">
                <Label className='text-2xl'>Business Results</Label>
                <Narration isLoading={isLoading}>{data?.narration}</Narration>
                <div className='h-full'>
                    <ResultTable isLoading={isLoading}>{data?.result}</ResultTable>
                </div>
            </div>
        </div >
    )
}

export default SelectAiView;
