// src/pages/admin/VerifyDoctors.jsx
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Check, X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import api from '@/api/axios';
import toast from 'react-hot-toast';

export default function VerifyDoctors() {
    const [verifications, setVerifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        fetchPendingVerifications();
    }, []);

    const fetchPendingVerifications = async () => {
        try {
            const response = await api.get('/verification/submissions');
            setVerifications(response.data.verifications);
        } catch (error) {
            console.error("Error fetching verifications:", error);
            toast.error('Failed to fetch verifications');
        } finally {
            setLoading(false);
        }
    };

    const handleVerification = async (verificationId, status) => {
        try {
            await api.patch(`/admin/verifications/${verificationId}`, { status });
            toast.success(`Verification ${status}`);
            fetchPendingVerifications();
        } catch (error) {
            toast.error(`Failed to ${status} verification`);
        }
    };

    const getFullImageUrl = (imageUrl) => {
        if (!imageUrl) return null;
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
            return imageUrl;
        }
        return `http://localhost:3000${imageUrl}`; // concatinate with the base URL to solve the iamge accessing issue
    };

    const openImageModal = (imageUrl) => {
        setSelectedImage(getFullImageUrl(imageUrl));
        setShowModal(true);
        setZoomLevel(1); // Reset zoom when opening new image
        setRotation(0); // Reset rotation when opening new image
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedImage(null);
    };

    const zoomIn = () => setZoomLevel(prev => Math.min(prev + 0.1, 3));
    const zoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
    const rotate = () => setRotation(prev => (prev + 90) % 360);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Doctor Verifications</h1>

            {verifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No pending verifications found</div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Doctor</TableHead>
                            <TableHead>Document</TableHead>
                            <TableHead>Submitted</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    {/* table contents  */}
                    <TableBody>
                        {verifications.map((verification) => (
                            <TableRow key={verification._id || verification.id}>
                                <TableCell>
                                    {verification.doctor ? (
                                        <div>
                                            <div>ID: {verification.doctor._id || verification.doctor.id}</div>
                                        </div>
                                    ) : (
                                        "Doctor info not available"
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="link"
                                        onClick={() => openImageModal(verification.imageUrl)}
                                        className="text-teal-600 hover:underline flex items-center gap-1"
                                    >
                                        <ZoomIn className="h-4 w-4" />
                                        View Document
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    {verification.createdAt
                                        ? new Date(verification.createdAt).toLocaleDateString()
                                        : "N/A"
                                    }
                                </TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded text-white ${verification.status === 'approved' ? 'bg-green-500' :
                                        verification.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                                        }`}>
                                        {verification.status || "pending"}
                                    </span>
                                </TableCell>
                                <TableCell className="flex gap-2">
                                    <Button
                                        size="sm"
                                        onClick={() => handleVerification(verification._id || verification.id, 'approved')}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        <Check className="mr-2 h-4 w-4" /> Approve
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="bg-red-600 hover:bg-red-700 text-white shadow-sm focus-visible:ring-2 focus-visible:ring-red-500"
                                        onClick={() => handleVerification(verification._id || verification.id, 'rejected')}
                                    >
                                        <X className="mr-2 h-4 w-4" /> Reject
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {showModal && selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-[90vw] max-h-[90vh] overflow-auto relative">
                        <div className="absolute top-4 right-4 flex gap-2 z-10">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={zoomIn}
                                className="bg-white hover:bg-gray-100"
                                title="Zoom In"
                            >
                                <ZoomIn className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={zoomOut}
                                className="bg-white hover:bg-gray-100"
                                title="Zoom Out"
                            >
                                <ZoomOut className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={rotate}
                                className="bg-white hover:bg-gray-100"
                                title="Rotate"
                            >
                                <RotateCw className="h-4 w-4" />
                            </Button>
                            <Button
                                size="icon"
                                onClick={closeModal}
                                className="bg-red-600 hover:bg-red-700 text-white shadow-sm focus-visible:ring-2 focus-visible:ring-red-500"
                                title="Close"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="p-4 flex justify-center items-center h-full">
                            <img
                                src={selectedImage}
                                alt="Verification Document"
                                className="rounded shadow-lg max-w-full max-h-[80vh] object-contain"
                                style={{
                                    transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                                    transition: 'transform 0.3s ease'
                                }}
                                onError={(e) => {
                                    console.error("Image failed to load:", selectedImage);
                                    e.target.src = "/placeholder-document.png";
                                    toast.error("Failed to load image");
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}