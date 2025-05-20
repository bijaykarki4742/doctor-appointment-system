import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Plus, X } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/components/lib/utils";

export default function MedicalInformation({ data, isEditing, handleChange, handleSave, saving, setIsEditing }) {
    const [newAllergy, setNewAllergy] = useState("");
    const [newCondition, setNewCondition] = useState({
        condition: "",
        diagnosisDate: null,
        treatment: "",
    });

    // Handle adding a new allergy
    const addAllergy = () => {
        if (newAllergy.trim()) {
            const updatedAllergies = [...(data.allergies || []), newAllergy.trim()];
            handleChange({
                target: {
                    name: "allergies",
                    value: updatedAllergies,
                },
            });
            setNewAllergy("");
        }
    };

    // Handle removing an allergy
    const removeAllergy = (index) => {
        const updatedAllergies = [...(data.allergies || [])];
        updatedAllergies.splice(index, 1);
        handleChange({
            target: {
                name: "allergies",
                value: updatedAllergies,
            },
        });
    };

    const addMedicalCondition = () => {
        if (newCondition.condition.trim()) {
            const updatedMedicalHistory = [
                ...(data.medicalHistory || []),
                {
                    condition: newCondition.condition.trim(),
                    diagnosisDate: newCondition.diagnosisDate || null,
                    treatment: newCondition.treatment || null,
                },
            ];

            handleChange({
                target: {
                    name: "medicalHistory",
                    value: updatedMedicalHistory,
                },
            });

            setNewCondition({
                condition: "",
                diagnosisDate: null,
                treatment: "",
            });
        }
    };

    const removeMedicalCondition = (index) => {
        const updatedMedicalHistory = data.medicalHistory.filter((_, i) => i !== index);
        handleChange({
            target: {
                name: "medicalHistory",
                value: updatedMedicalHistory,
            },
        });
    };

    // Handle adding a new medical condition
    // const addMedicalCondition = () => {
    //     if (newCondition.condition.trim() && newCondition.diagnosisDate) {
    //         const updatedMedicalHistory = [
    //             ...(data.medicalHistory || []),
    //             {
    //                 ...newCondition,
    //                 diagnosisDate: new Date(newCondition.diagnosisDate),
    //             },
    //         ];
    //         handleChange({
    //             target: {
    //                 name: "medicalHistory",
    //                 value: updatedMedicalHistory,
    //             },
    //         });
    //         setNewCondition({
    //             condition: "",
    //             diagnosisDate: null,
    //             treatment: "",
    //         });
    //     }
    // };

    // // Handle removing a medical condition
    // const removeMedicalCondition = (index) => {
    //     const updatedMedicalHistory = [...(data.medicalHistory || [])];
    //     updatedMedicalHistory.splice(index, 1);
    //     handleChange({
    //         target: {
    //             name: "medicalHistory",
    //             value: updatedMedicalHistory,
    //         },
    //     });
    // };

    // Handle insurance info changes
    const handleInsuranceChange = (e) => {
        const { name, value } = e.target;
        const updatedInsuranceInfo = {
            ...(data.insuranceInfo || {}),
            [name]: value,
        };
        handleChange({
            target: {
                name: "insuranceInfo",
                value: updatedInsuranceInfo,
            },
        });
    };

    // Handle emergency contact changes
    const handleEmergencyContactChange = (e) => {
        const { name, value } = e.target;
        const updatedEmergencyContact = {
            ...(data.emergencyContact || {}),
            [name]: value,
        };
        handleChange({
            target: {
                name: "emergencyContact",
                value: updatedEmergencyContact,
            },
        });
    };

    return (
        <Card className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
            <CardHeader className="bg-blue-500 text-white p-4">
                <CardTitle className="text-2xl font-bold">Medical Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                {/* Insurance Information */}
                <div className="space-y-2">
                    <h3 className="text-lg font-medium">Insurance Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="provider" className="text-gray-600 font-medium">Insurance Provider</Label>
                            {isEditing ? (
                                <Input
                                    id="provider"
                                    name="provider"
                                    value={data.insuranceInfo?.provider || ""}
                                    onChange={handleInsuranceChange}
                                    className="w-full border border-gray-300 rounded-md p-2"
                                />
                            ) : (
                                <p className="p-2 border border-gray-300 rounded-md bg-gray-100">
                                    {data.insuranceInfo?.provider || "Not specified"}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="policyNumber" className="text-gray-600 font-medium">Policy Number</Label>
                            {isEditing ? (
                                <Input
                                    id="policyNumber"
                                    name="policyNumber"
                                    value={data.insuranceInfo?.policyNumber || ""}
                                    onChange={handleInsuranceChange}
                                    className="w-full border border-gray-300 rounded-md p-2"
                                />
                            ) : (
                                <p className="p-2 border border-gray-300 rounded-md bg-gray-100">
                                    {data.insuranceInfo?.policyNumber || "Not specified"}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="text-lg font-medium">Medical History</h3>
                    {isEditing ? (
                        <div className="space-y-4">
                            {/* List of existing conditions */}
                            {data.medicalHistory?.length > 0 && (
                                <div className="space-y-2">
                                    {data.medicalHistory.map((condition, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 p-2 border rounded-md bg-gray-100"
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium">{condition.condition}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Diagnosed: {condition.diagnosisDate ? format(new Date(condition.diagnosisDate), "PPP") : "Not specified"}
                                                </p>
                                                {condition.treatment && (
                                                    <p className="text-sm">{condition.treatment}</p>
                                                )}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeMedicalCondition(index)}
                                                className="hover:bg-gray-200"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Add new condition form */}
                            <div className="space-y-2 p-3 border rounded-md bg-gray-50">
                                <h4 className="font-medium">Add New Condition</h4>
                                <div className="space-y-2">
                                    <Label htmlFor="condition" className="text-gray-600 font-medium">Condition</Label>
                                    <Input
                                        id="condition"
                                        value={newCondition.condition}
                                        onChange={(e) =>
                                            setNewCondition(prev => ({ ...prev, condition: e.target.value }))
                                        }
                                        className="w-full border border-gray-300 rounded-md p-2"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="diagnosisDate" className="text-gray-600 font-medium">Diagnosis Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal border border-gray-300 rounded-md p-2",
                                                    !newCondition.diagnosisDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {newCondition.diagnosisDate ? (
                                                    format(newCondition.diagnosisDate, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={newCondition.diagnosisDate}
                                                onSelect={(date) =>
                                                    setNewCondition(prev => ({ ...prev, diagnosisDate: date }))
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="treatment" className="text-gray-600 font-medium">Treatment</Label>
                                    <Textarea
                                        id="treatment"
                                        value={newCondition.treatment || ''}
                                        onChange={(e) =>
                                            setNewCondition(prev => ({ ...prev, treatment: e.target.value }))
                                        }
                                        className="w-full border border-gray-300 rounded-md p-2"
                                    />
                                </div>
                                <Button
                                    className="mt-2 bg-blue-500 text-white hover:bg-blue-600"
                                    onClick={addMedicalCondition}
                                    disabled={!newCondition.condition.trim()}
                                >
                                    <Plus className="h-4 w-4 mr-2" /> Add Condition
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {data.medicalHistory?.length > 0 ? (
                                data.medicalHistory.map((condition, index) => (
                                    <div key={index} className="p-2 border rounded-md bg-gray-100">
                                        <p className="font-medium">{condition.condition}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Diagnosed: {condition.diagnosisDate ? format(new Date(condition.diagnosisDate), "PPP") : "Not specified"}
                                        </p>
                                        {condition.treatment && (
                                            <p className="text-sm">{condition.treatment}</p>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="p-2 border rounded-md w-full bg-gray-100">No medical history recorded</p>
                            )}
                        </div>
                    )}
                </div>
                {/* Medical History */}


                {/* Allergies */}
                <div className="space-y-2">
                    <h3 className="text-lg font-medium">Allergies</h3>
                    {isEditing ? (
                        <div className="space-y-4">
                            {/* List of existing allergies */}
                            <div className="flex flex-wrap gap-2">
                                {data.allergies &&
                                    data.allergies.map((allergy, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full hover:bg-gray-200"
                                        >
                                            <span>{allergy}</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-5 w-5"
                                                onClick={() => removeAllergy(index)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                            </div>

                            {/* Add new allergy */}
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add allergy"
                                    value={newAllergy}
                                    onChange={(e) => setNewAllergy(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addAllergy();
                                        }
                                    }}
                                    className="w-full border border-gray-300 rounded-md p-2"
                                />
                                <Button
                                    onClick={addAllergy}
                                    disabled={!newAllergy.trim()}
                                    className="bg-blue-500 text-white hover:bg-blue-600"
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {data.allergies && data.allergies.length > 0 ? (
                                data.allergies.map((allergy, index) => (
                                    <span
                                        key={index}
                                        className="p-2 border border-gray-300 rounded-md bg-gray-100"
                                    >
                                        {allergy}
                                    </span>
                                ))
                            ) : (
                                <p className="p-2 border rounded-md w-full bg-gray-100">No allergies recorded</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Emergency Contact */}
                <div className="space-y-2">
                    <h3 className="text-lg font-medium">Emergency Contact</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-gray-600 font-medium">Name</Label>
                            {isEditing ? (
                                <Input
                                    id="name"
                                    name="name"
                                    value={data.emergencyContact?.name || ""}
                                    onChange={handleEmergencyContactChange}
                                    className="w-full border border-gray-300 rounded-md p-2"
                                />
                            ) : (
                                <p className="p-2 border border-gray-300 rounded-md bg-gray-100">
                                    {data.emergencyContact?.name || "Not specified"}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="relationship" className="text-gray-600 font-medium">Relationship</Label>
                            {isEditing ? (
                                <Input
                                    id="relationship"
                                    name="relationship"
                                    value={data.emergencyContact?.relationship || ""}
                                    onChange={handleEmergencyContactChange}
                                    className="w-full border border-gray-300 rounded-md p-2"
                                />
                            ) : (
                                <p className="p-2 border border-gray-300 rounded-md bg-gray-100">
                                    {data.emergencyContact?.relationship || "Not specified"}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-600 font-medium">Phone Number</Label>
                        {isEditing ? (
                            <Input
                                id="phone"
                                name="phone"
                                value={data.emergencyContact?.phone || ""}
                                onChange={handleEmergencyContactChange}
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        ) : (
                            <p className="p-2 border border-gray-300 rounded-md bg-gray-100">
                                {data.emergencyContact?.phone || "Not specified"}
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>

            {isEditing && (
                <CardFooter className="flex justify-end gap-2 p-4">
                    <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="border border-gray-300 text-gray-600 hover:bg-gray-100"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-blue-500 text-white hover:bg-blue-600"
                    >
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
    );
}
