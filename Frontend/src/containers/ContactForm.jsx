"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";

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
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <Label htmlFor="firstName">First Name</Label>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your first name"
                                                {...field}
                                                isInvalid={fieldState?.invalid}
                                            />
                                        </FormControl>
                                        {fieldState?.invalid && (
                                            <FormMessage>{fieldState?.error?.message}</FormMessage>
                                        )}
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
                                            <Input
                                                placeholder="Enter your last name"
                                                {...field}
                                                isInvalid={fieldState?.invalid}
                                            />
                                        </FormControl>
                                        {fieldState?.invalid && (
                                            <FormMessage>{fieldState?.error?.message}</FormMessage>
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
                                        <Label htmlFor="email">Email</Label>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="Enter your email"
                                                {...field}
                                                isInvalid={fieldState?.invalid}
                                            />
                                        </FormControl>
                                        {fieldState?.invalid && (
                                            <FormMessage>{fieldState?.error?.message}</FormMessage>
                                        )}
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <Label htmlFor="phoneNumber">Phone Number</Label>
                                        <FormControl>
                                            <Input
                                                type="tel"
                                                placeholder="Enter your phone number"
                                                {...field}
                                                isInvalid={fieldState?.invalid}
                                            />
                                        </FormControl>
                                        {fieldState?.invalid && (
                                            <FormMessage>{fieldState?.error?.message}</FormMessage>
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
                                    <Label htmlFor="message">Message</Label>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter your message"
                                            className="min-h-[120px]"
                                            {...field}
                                            isInvalid={fieldState?.invalid}
                                        />
                                    </FormControl>
                                    {fieldState?.invalid && (
                                        <FormMessage>{fieldState?.error?.message}</FormMessage>
                                    )}
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full">
                            Send Message
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}


















// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import {
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormMessage,
// } from "@/components/ui/form";
// import { toast } from "sonner";
// import {
//     Send,
//     User,
//     Mail,
//     Phone,
//     MessageSquare,
//     Loader2,
// } from "lucide-react";
//
// export default function ContactForm() {
//     const [isSubmitting, setIsSubmitting] = useState(false);
//
//     const form = useForm({
//         defaultValues: {
//             firstName: "",
//             lastName: "",
//             email: "",
//             phoneNumber: "",
//             message: "",
//         },
//     });
//
//     const {
//         control,
//         handleSubmit,
//         reset,
//         formState: { errors },
//         register,
//     } = form;
//
//     const onSubmit = async (values) => {
//         setIsSubmitting(true);
//         try {
//             await new Promise((resolve) => setTimeout(resolve, 1000));
//             console.log("Form submitted:", values);
//             toast.success("Message sent successfully! We'll be in touch soon.");
//             reset();
//         } catch (error) {
//             toast.error("Something went wrong. Please try again.");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };
//
//     return (
//         <div className="w-full max-w-4xl mx-auto px-4">
//             <Card className="overflow-hidden border-0 shadow-lg bg-white dark:bg-slate-900">
//                 <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800/30 dark:to-slate-900/30 opacity-50 pointer-events-none" />
//
//                 <CardHeader className="relative pb-0 pt-8">
//                     <div className="text-center space-y-2">
//                         <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-2">
//                             <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
//                         </div>
//                         <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
//                             Get in Touch
//                         </h2>
//                         <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
//                             Have questions or feedback? We'd love to hear from you.
//                         </p>
//                     </div>
//                 </CardHeader>
//
//                 <CardContent className="relative p-6 sm:p-8 mt-4">
//                     <Form {...form}>
//                         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                                 <FormItem>
//                                     <Label htmlFor="firstName" className="text-slate-700 dark:text-slate-200 font-medium">
//                                         First Name
//                                     </Label>
//                                     <div className="relative mt-1.5">
//                                         <FormControl>
//                                             <Input
//                                                 placeholder="John"
//                                                 {...register("firstName", {
//                                                     required: "First name is required",
//                                                     minLength: {
//                                                         value: 2,
//                                                         message: "First name must be at least 2 characters",
//                                                     },
//                                                 })}
//                                                 className="pl-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/20 rounded-lg"
//                                             />
//                                         </FormControl>
//                                         <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//                                     </div>
//                                     {errors.firstName && (
//                                         <FormMessage className="text-red-500 text-sm mt-1">
//                                             {errors.firstName.message}
//                                         </FormMessage>
//                                     )}
//                                 </FormItem>
//
//                                 <FormItem>
//                                     <Label htmlFor="lastName" className="text-slate-700 dark:text-slate-200 font-medium">
//                                         Last Name
//                                     </Label>
//                                     <div className="relative mt-1.5">
//                                         <FormControl>
//                                             <Input
//                                                 placeholder="Doe"
//                                                 {...register("lastName", {
//                                                     required: "Last name is required",
//                                                     minLength: {
//                                                         value: 2,
//                                                         message: "Last name must be at least 2 characters",
//                                                     },
//                                                 })}
//                                                 className="pl-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/20 rounded-lg"
//                                             />
//                                         </FormControl>
//                                         <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//                                     </div>
//                                     {errors.lastName && (
//                                         <FormMessage className="text-red-500 text-sm mt-1">
//                                             {errors.lastName.message}
//                                         </FormMessage>
//                                     )}
//                                 </FormItem>
//                             </div>
//
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                                 <FormItem>
//                                     <Label htmlFor="email" className="text-slate-700 dark:text-slate-200 font-medium">
//                                         Email
//                                     </Label>
//                                     <div className="relative mt-1.5">
//                                         <FormControl>
//                                             <Input
//                                                 type="email"
//                                                 placeholder="you@example.com"
//                                                 {...register("email", {
//                                                     required: "Email is required",
//                                                     pattern: {
//                                                         value: /^\S+@\S+\.\S+$/,
//                                                         message: "Please enter a valid email address",
//                                                     },
//                                                 })}
//                                                 className="pl-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/20 rounded-lg"
//                                             />
//                                         </FormControl>
//                                         <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//                                     </div>
//                                     {errors.email && (
//                                         <FormMessage className="text-red-500 text-sm mt-1">
//                                             {errors.email.message}
//                                         </FormMessage>
//                                     )}
//                                 </FormItem>
//
//                                 <FormItem>
//                                     <Label htmlFor="phoneNumber" className="text-slate-700 dark:text-slate-200 font-medium">
//                                         Phone Number <span className="text-slate-400 text-sm">(Optional)</span>
//                                     </Label>
//                                     <div className="relative mt-1.5">
//                                         <FormControl>
//                                             <Input
//                                                 type="tel"
//                                                 placeholder="+1 (555) 000-0000"
//                                                 {...register("phoneNumber")}
//                                                 className="pl-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/20 rounded-lg"
//                                             />
//                                         </FormControl>
//                                         <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//                                     </div>
//                                 </FormItem>
//                             </div>
//
//                             <FormItem>
//                                 <Label htmlFor="message" className="text-slate-700 dark:text-slate-200 font-medium">
//                                     Message
//                                 </Label>
//                                 <div className="relative mt-1.5">
//                                     <FormControl>
//                                         <Textarea
//                                             placeholder="Your message here..."
//                                             {...register("message", {
//                                                 required: "Message is required",
//                                                 minLength: {
//                                                     value: 10,
//                                                     message: "Message must be at least 10 characters",
//                                                 },
//                                             })}
//                                             className="min-h-[160px] pl-10 pt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/20 rounded-lg resize-none"
//                                         />
//                                     </FormControl>
//                                     <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
//                                 </div>
//                                 {errors.message && (
//                                     <FormMessage className="text-red-500 text-sm mt-1">
//                                         {errors.message.message}
//                                     </FormMessage>
//                                 )}
//                             </FormItem>
//
//                             <div>
//                                 <Button
//                                     type="submit"
//                                     disabled={isSubmitting}
//                                     className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 group"
//                                 >
//                                     {isSubmitting ? (
//                                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                                     ) : (
//                                         <Send className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
//                                     )}
//                                     {isSubmitting ? "Sending..." : "Send Message"}
//                                 </Button>
//                             </div>
//                         </form>
//                     </Form>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// }
