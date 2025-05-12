import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud } from "lucide-react";
import toast from "react-hot-toast";

export default function VerificationDialog({ onClose, onSubmit }) {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate image type
        const validTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (!validTypes.includes(file.type)) {
            toast.error("Only JPG, JPEG, and PNG images are allowed");
            return;
        }

        // Validate image size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be smaller than 5MB");
            return;
        }

        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleClickUpload = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = async () => {
        if (!image) {
            toast.error("Please select an image");
            return;
        }

        try {
            await onSubmit(image);
            onClose();
        } catch (error) {
            toast.error(error.message || "Failed to submit verification");
        }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-800">
                        Doctor Verification
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="verificationImage" className="text-base font-medium text-gray-700">
                            Medical License Image
                        </Label>

                        <div
                            className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                            onClick={handleClickUpload}
                        >
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Verification preview"
                                    className="max-h-60 rounded-md object-contain mx-auto"
                                />
                            ) : (
                                <>
                                    <UploadCloud className="h-10 w-10 text-gray-400 mx-auto" />
                                    <p className="text-sm text-gray-600 mt-2">
                                        <span className="font-medium text-teal-600">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        JPG, JPEG, or PNG (max. 5MB)
                                    </p>
                                </>
                            )}
                        </div>

                        <Input
                            id="verificationImage"
                            type="file"
                            accept="image/jpeg, image/jpg, image/png"
                            onChange={handleImageChange}
                            ref={fileInputRef}
                            className="hidden"
                        />

                        <div className="flex justify-center mt-4">
                            <Button
                                variant="outline"
                                onClick={handleClickUpload}
                                className="gap-2"
                            >
                                {preview ? "Change Image" : "Select Image"}
                            </Button>
                        </div>

                        <p className="text-sm text-muted-foreground mt-2 text-center">
                            Upload a clear image of your medical license
                        </p>
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={!image}>
                        Submit for Verification
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}