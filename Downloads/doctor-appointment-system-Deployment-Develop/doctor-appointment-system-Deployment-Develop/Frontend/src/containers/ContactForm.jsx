"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";

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
        console.log("Form submitted:", values);
        // Optional: Replace with actual API call or integration
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
                        {/* First and Last Name */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <Label htmlFor="firstName">First Name</Label>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    placeholder="Enter your first name"
                                                    className="pl-10"
                                                />
                                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    placeholder="Enter your last name"
                                                    className="pl-10"
                                                />
                                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Email and Phone */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label htmlFor="email">Email</Label>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    type="email"
                                                    placeholder="Enter your email"
                                                    className="pl-10"
                                                />
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label htmlFor="phoneNumber">Phone Number</Label>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    type="tel"
                                                    placeholder="Enter your phone number"
                                                    className="pl-10"
                                                />
                                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Message */}
                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <Label htmlFor="message">Message</Label>
                                    <FormControl>
                                        <div className="relative">
                                            <Textarea
                                                {...field}
                                                placeholder="Enter your message"
                                                className="pl-10 pt-3 min-h-[150px]"
                                            />
                                            <MessageSquare className="absolute left-3 top-4 text-blue-500 h-5 w-5" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Submit Button */}
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
