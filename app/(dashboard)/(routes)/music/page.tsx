"use client"

import axios from "axios";
import * as z from "zod";
import { Music } from "lucide-react";
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

const MusicPage = (values: z.infer<typeof formSchema>) => { 
    const router= useRouter();

    const [music, setMusic] = useState<string>(); // <> This symbole is used to set a input type

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt:""
        }
    });

    const isLoding = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) =>{
        try{
           setMusic(undefined)

            const response = await axios.post('/api/music', values);

            setMusic(response.data.audio);

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
        title="Music Generation"
        description="Turn your prompt into music."
        icon={Music}
        iconColor="text-emerald-500"
        bgColor="bg-emerald-500/10"/>
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
                                    placeholder="Guitar music"
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
                    !music && !isLoding && (
                       <div>
                            <Empty label="No Music generated."/>
                       </div>
                    )
                }
                {
                    music && (
                        <audio className="w-full mt-8" controls>
                            <source src={music}/>
                        </audio>
                    )
                }
            </div>
        </div>
    </div>  
  )
}

export default MusicPage
