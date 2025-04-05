"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ProfessionalInformation({
                                                    data,
                                                    isEditing,
                                                    handleChange,
                                                    handleSelectChange,
                                                    handleSave,
                                                    saving,
                                                    setIsEditing,
                                                }) {
    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Professional Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="specialization">Specialization</Label>
                        {isEditing ? (
                            <Select
                                value={data.specialization}
                                onValueChange={(value) => handleSelectChange("specialization", value)}
                            >
                                <SelectTrigger id="specialization">
                                    <SelectValue placeholder="Select specialization" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="None">None</SelectItem>
                                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                                    <SelectItem value="Dermatology">Dermatology</SelectItem>
                                    <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                                    <SelectItem value="Neurology">Neurology</SelectItem>
                                    <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                                    <SelectItem value="Gastroenterology">Gastroenterology</SelectItem>
                                    <SelectItem value="Ophthalmology">Ophthalmology</SelectItem>
                                    <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                                </SelectContent>
                            </Select>
                        ) : (
                            <p className="p-2 border rounded-md">{data.specialization}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="licenseNumber">License Number</Label>
                        {isEditing ? (
                            <Input id="licenseNumber" name="licenseNumber" value={data.licenseNumber} onChange={handleChange} />
                        ) : (
                            <p className="p-2 border rounded-md">{data.licenseNumber}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="experience">Years of Experience</Label>
                        {isEditing ? (
                            <Input
                                id="experience"
                                name="experience"
                                type="number"
                                value={data.experience.toString()}
                                onChange={handleChange}
                            />
                        ) : (
                            <p className="p-2 border rounded-md">{data.experience} years</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="consultationFee">Consultation Fee ($)</Label>
                        {isEditing ? (
                            <Input
                                id="consultationFee"
                                name="consultationFee"
                                type="number"
                                value={data.consultationFee.toString()}
                                onChange={handleChange}
                            />
                        ) : (
                            <p className="p-2 border rounded-md">${data.consultationFee}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="qualifications">Qualifications (comma separated)</Label>
                    {isEditing ? (
                        <Input
                            id="qualifications"
                            name="qualifications"
                            value={data.qualifications.join(", ")}
                            onChange={(e) => {
                                const quals = e.target.value
                                    .split(",")
                                    .map((q) => q.trim())
                                    .filter((q) => q)
                                handleSelectChange("qualifications", quals)
                            }}
                        />
                    ) : (
                        <p className="p-2 border rounded-md">
                            {data.qualifications.length > 0 ? data.qualifications.join(", ") : "None specified"}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="hospitalAffiliation">Hospital Affiliations (comma separated)</Label>
                    {isEditing ? (
                        <Input
                            id="hospitalAffiliation"
                            name="hospitalAffiliation"
                            value={data.hospitalAffiliation.join(", ")}
                            onChange={(e) => {
                                const affiliations = e.target.value
                                    .split(",")
                                    .map((a) => a.trim())
                                    .filter((a) => a)
                                handleSelectChange("hospitalAffiliation", affiliations)
                            }}
                        />
                    ) : (
                        <p className="p-2 border rounded-md">
                            {data.hospitalAffiliation.length > 0 ? data.hospitalAffiliation.join(", ") : "None specified"}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="languagesSpoken">Languages Spoken (comma separated)</Label>
                    {isEditing ? (
                        <Input
                            id="languagesSpoken"
                            name="languagesSpoken"
                            value={data.languagesSpoken.join(", ")}
                            onChange={(e) => {
                                const languages = e.target.value
                                    .split(",")
                                    .map((l) => l.trim())
                                    .filter((l) => l)
                                handleSelectChange("languagesSpoken", languages)
                            }}
                        />
                    ) : (
                        <p className="p-2 border rounded-md">
                            {data.languagesSpoken.length > 0 ? data.languagesSpoken.join(", ") : "None specified"}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    {isEditing ? (
                        <Textarea id="bio" name="bio" rows={4} value={data.bio || ""} onChange={handleChange} />
                    ) : (
                        <p className="p-2 border rounded-md">{data.bio ? data.bio : "No bio provided"}</p>
                    )}
                </div>
            </CardContent>
            {isEditing && (
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? (
                            <>
                                <span className="animate-spin mr-2">⟳</span>
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </CardFooter>
            )}
        </Card>
    )
}

