import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatsCard({ title, value, icon }) {
    return (
        <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
            <CardContent className="p-6 text-center">
                <CardHeader className="text-2xl font-bold text-blue-500">
                    {value}
                </CardHeader>
                <CardTitle className="text-gray-600">{title}</CardTitle>
                <div className="text-4xl text-blue-500">{icon}</div>
            </CardContent>
        </Card>
    );
}
