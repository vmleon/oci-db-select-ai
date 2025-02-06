import { useQuery } from '@tanstack/react-query';
import { useState } from 'react'
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { ResultTable } from './ResultTable';
import SQLCode from './SQLCode';

interface SelectAiQueryResponse {
    prompt: string,
    sqlQuery: string,
    result: object[]
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
        <div className="flex flex-col gap-8">
            <div className='flex-1 flex gap-10'>
                <div className='flex-1 grid gap-3'>
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
                <div className='flex-1'>
                    <SQLCode isLoading={isLoading}>{data?.sqlQuery}</SQLCode>
                </div>
            </div>
            <Separator />
            <div>
                <Label className='text-xl'>Results</Label>
                <div className='h-full'>
                    <ResultTable isLoading={isLoading}>{data?.result}</ResultTable>
                </div>
            </div>
        </div >
    )
}

export default SelectAiView;
