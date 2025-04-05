"use client"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { cn } from "@/components/lib/utils"

export default function PersonalInformation({
                                                data,
                                                userType,
                                                isEditing,
                                                handleChange,
                                                handleSelectChange,
                                                date,
                                                handleDateChange,
                                                setData,
                                            }) {
    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        {isEditing ? (
                            <Input id="firstName" name="firstName" value={data.firstName} onChange={handleChange} />
                        ) : (
                            <p className="p-2 border rounded-md">{data.firstName}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        {isEditing ? (
                            <Input id="lastName" name="lastName" value={data.lastName} onChange={handleChange} />
                        ) : (
                            <p className="p-2 border rounded-md">{data.lastName}</p>
                        )}
                    </div>
                </div>

                {data.email !== undefined && (
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        {isEditing ? (
                            <Input id="email" name="email" type="email" value={data.email} onChange={handleChange} />
                        ) : (
                            <p className="p-2 border rounded-md">{data.email}</p>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="contact">Phone Number</Label>
                        {isEditing ? (
                            <Input id="contact" name="contact" value={data.contact} onChange={handleChange} />
                        ) : (
                            <p className="p-2 border rounded-md">{data.contact}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        {isEditing ? (
                            <Select value={data.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                                <SelectTrigger id="gender">
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        ) : (
                            <p className="p-2 border rounded-md capitalize">{data.gender}</p>
                        )}
                    </div>
                </div>

                {userType === "patient" && data.dateOfBirth && (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="dateOfBirth">Date of Birth</Label>
                            {isEditing ? (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus />
                                    </PopoverContent>
                                </Popover>
                            ) : (
                                <p className="p-2 border rounded-md">
                                    {data.dateOfBirth ? format(new Date(data.dateOfBirth), "PPP") : "Not specified"}
                                </p>
                            )}
                        </div>

                        {data.address && (
                            <div className="space-y-2">
                                <Label>Address</Label>
                                {isEditing ? (
                                    <div className="grid gap-2">
                                        <Input
                                            placeholder="Street"
                                            name="street"
                                            value={data.address.street}
                                            onChange={(e) => {
                                                const updatedAddress = { ...data.address, street: e.target.value }
                                                setData({ ...data, address: updatedAddress })
                                            }}
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input
                                                placeholder="City"
                                                name="city"
                                                value={data.address.city}
                                                onChange={(e) => {
                                                    const updatedAddress = { ...data.address, city: e.target.value }
                                                    setData({ ...data, address: updatedAddress })
                                                }}
                                            />
                                            <Input
                                                placeholder="State"
                                                name="state"
                                                value={data.address.state}
                                                onChange={(e) => {
                                                    const updatedAddress = { ...data.address, state: e.target.value }
                                                    setData({ ...data, address: updatedAddress })
                                                }}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input
                                                placeholder="Postal Code"
                                                name="postalCode"
                                                value={data.address.postalCode}
                                                onChange={(e) => {
                                                    const updatedAddress = { ...data.address, postalCode: e.target.value }
                                                    setData({ ...data, address: updatedAddress })
                                                }}
                                            />
                                            <Input
                                                placeholder="Country"
                                                name="country"
                                                value={data.address.country}
                                                onChange={(e) => {
                                                    const updatedAddress = { ...data.address, country: e.target.value }
                                                    setData({ ...data, address: updatedAddress })
                                                }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <p className="p-2 border rounded-md">
                                        {data.address.street}, {data.address.city}, {data.address.state} {data.address.postalCode},{" "}
                                        {data.address.country}
                                    </p>
                                )}
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    )
}

