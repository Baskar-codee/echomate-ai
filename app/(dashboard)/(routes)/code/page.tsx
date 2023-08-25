"use client"

import axios from "axios";
import * as z from "zod";
import { Code } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
 
import { Heading } from "@/components/heading";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { formSchema } from "./constants";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChatCompletionRequestMessage } from "openai"; 
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";

const CodePage = (values: z.infer<typeof formSchema>) => { 
    const router= useRouter();

    const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]); // <> This symbole is used to set a input type

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt:""
        }
    });

    const isLoding = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) =>{
        try{
            const userMessage: ChatCompletionRequestMessage = {
                role:"user",
                content: values.prompt,
            };

            const newMessages = [...messages, userMessage];

            const response = await axios.post('/api/code', {
                messages: newMessages,
            });

            setMessages((current) => [...current, userMessage, response.data]);

            form.reset();

        } catch(error: any){
            //TODO pro model
            console.log(error);
        } finally{
            router.refresh(); //It is used to refresh the router
        }
    }
  return (
    <div>
        <Heading 
        title="Code Generation"
        description="Generate code by typing the description."
        icon={Code}
        iconColor="text-green-700"
        bgColor="bg-green-700/10"/>
        <div className="px-4 lg:px-8">
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2">
                        <FormField name="prompt" 
                        render={({field}) =>(
                            <FormItem className="col-span-12 lg:col-span-10">
                                <FormControl className="m-0 p-0">
                                    <Input className="px-2 border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                    disabled={isLoding}
                                    placeholder="Write a code in react to find the user is logged in or not."
                                    {...field}/>
                                </FormControl>
                            </FormItem>
                            )
                        }/>
                        <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoding}>
                            Generate
                        </Button>
                    </form>
                </Form>
            </div>
            <div className="space-y-4 mt-4 pb-8">
                {
                    isLoding && (
                        <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                            <Loader />
                        </div>
                    )
                }
                {
                    messages.length === 0 && !isLoding && (
                       <div>
                            <Empty label="No Converstion started."/>
                       </div>
                    )
                }
                <div className="flex flex-col-reverse gap-y-4">
                    {
                        messages.map((message) =>(
                            <div 
                                key={message.content}
                                className={cn("p-8 w-full flex items-start rounded-lg gap-x-8",
                                message.role === 'user' ? "items-center bg-white border border-black/10" : "bg-muted")}
                            >
                                {message.role === "user" ? <UserAvatar/> : <BotAvatar /> }
                                <ReactMarkdown
                                    components={{
                                        pre: ({node, ...props}) =>(
                                            <div className="overflow-auto my-2 w-full bg-black/10 p-2 rounded-lg">
                                                <pre {...props}/>
                                            </div>
                                        ),
                                        code: ({node, ...props}) => (
                                            <code className="bg-black/10 p-1 rounded-lg" {...props}></code>
                                        )
                                    }}
                                    className="text-sm overflow-hidden leading-7"
                                >
                                    {message.content || ""}
                                </ReactMarkdown>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    </div>  
  )
}

export default CodePage
