"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Send, User, Phone, Mail, MessageSquare } from "lucide-react";

export default function ContactForm() {
    const form = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            message: "",
        },
    });

    const onSubmit = (values) => {
        // Add form submission logic here
        console.log("Form submitted:", values);
    };

    return (
        <Card className="max-w-2xl mx-auto border border-blue-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
                    <MessageSquare className="h-6 w-6" />
                    Send us a Message
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <Label htmlFor="firstName" className="text-gray-700 font-medium">First Name</Label>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    placeholder="Enter your first name"
                                                    className="pl-10 py-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                    {...field}
                                                    isInvalid={fieldState?.invalid}
                                                />
                                                <User className="h-5 w-5 text-blue-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                            </div>
                                        </FormControl>
                                        {fieldState?.invalid && (
                                            <FormMessage className="text-red-500">{fieldState?.error?.message}</FormMessage>
                                        )}
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <Label htmlFor="lastName" className="text-gray-700 font-medium">Last Name</Label>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    placeholder="Enter your last name"
                                                    className="pl-10 py-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                    {...field}
                                                    isInvalid={fieldState?.invalid}
                                                />
                                                <User className="h-5 w-5 text-blue-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                            </div>
                                        </FormControl>
                                        {fieldState?.invalid && (
                                            <FormMessage className="text-red-500">{fieldState?.error?.message}</FormMessage>
                                        )}
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type="email"
                                                    placeholder="Enter your email"
                                                    className="pl-10 py-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                    {...field}
                                                    isInvalid={fieldState?.invalid}
                                                />
                                                <Mail className="h-5 w-5 text-blue-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                            </div>
                                        </FormControl>
                                        {fieldState?.invalid && (
                                            <FormMessage className="text-red-500">{fieldState?.error?.message}</FormMessage>
                                        )}
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <Label htmlFor="phoneNumber" className="text-gray-700 font-medium">Phone Number</Label>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type="tel"
                                                    placeholder="Enter your phone number"
                                                    className="pl-10 py-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                    {...field}
                                                    isInvalid={fieldState?.invalid}
                                                />
                                                <Phone className="h-5 w-5 text-blue-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                            </div>
                                        </FormControl>
                                        {fieldState?.invalid && (
                                            <FormMessage className="text-red-500">{fieldState?.error?.message}</FormMessage>
                                        )}
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <Label htmlFor="message" className="text-gray-700 font-medium">Message</Label>
                                    <FormControl>
                                        <div className="relative">
                                            <Textarea
                                                placeholder="Enter your message"
                                                className="pl-10 pt-3 min-h-[150px] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                {...field}
                                                isInvalid={fieldState?.invalid}
                                            />
                                            <MessageSquare className="h-5 w-5 text-blue-500 absolute left-3 top-8" />
                                        </div>
                                    </FormControl>
                                    {fieldState?.invalid && (
                                        <FormMessage className="text-red-500">{fieldState?.error?.message}</FormMessage>
                                    )}
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 font-medium flex items-center justify-center gap-2 rounded-lg transition-all shadow-md hover:shadow-lg"
                        >
                            <Send className="h-5 w-5" />
                            Send Message
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
