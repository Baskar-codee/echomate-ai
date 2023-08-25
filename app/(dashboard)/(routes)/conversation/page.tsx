"use client"

import axios from "axios";
import * as z from "zod";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
 
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

const Conversationpage = (values: z.infer<typeof formSchema>) => { 
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

            const response = await axios.post('/api/conversation', {
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
        title="Conversation"
        description="Try our most advanced conversation model."
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"/>
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
                                    placeholder="How to calculate percentage of a number?"
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
            <div className="space-y-4 mt-4">
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
                                <p className="text-sm">
                                    {message.content}
                                </p>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    </div>  
  )
}

export default Conversationpage
