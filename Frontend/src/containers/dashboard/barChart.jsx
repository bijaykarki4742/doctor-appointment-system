import * as React from 'react';
import { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function DoctorAppointmentStats() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error('No authentication token found');
                }

                // 1. First fetch user info to get doctorId
                const userInfoResponse = await fetch("http://localhost:3000/v1/api/users/me", {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!userInfoResponse.ok) {
                    throw new Error('Failed to fetch user information');
                }

                const userData = await userInfoResponse.json();
                const doctorId = userData.user?._id;

                if (!doctorId) {
                    throw new Error('Doctor ID not found in user data');
                }

                // 2. Now fetch appointment stats
                const statsResponse = await fetch('http://localhost:3000/v1/api/doctors/stats/appointments', {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ doctorId })
                });

                if (!statsResponse.ok) {
                    const errorData = await statsResponse.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Failed to fetch appointment stats');
                }

                const statsData = await statsResponse.json();
                setStats(statsData);
            } catch (err) {
                setError(err.message || 'Failed to fetch statistics');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="loading-spinner">Loading...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;
    if (!stats) return <div className="no-data">No appointment data available</div>;

    return (
        <div className="appointment-stats-container">
            <div className="today-stats-section">
                <h3>Today's Appointments</h3>
                <div className="stats-cards">
                    <StatCard title="Total" value={stats.todayStats.total} />
                    <StatCard title="Completed" value={stats.todayStats.completed} />
                    <StatCard title="Scheduled" value={stats.todayStats.scheduled} />
                    <StatCard title="Cancelled" value={stats.todayStats.cancelled || 0} />
                    <StatCard title="In Progress" value={stats.todayStats.inProgress || 0} />
                </div>
            </div>

            <div className="weekly-stats-section">
                <h3>Weekly Appointments</h3>
                <div className="chart-container">
                    <BarChart
                        series={[
                            {
                                data: stats.weeklyStats.map(day => day.total),
                                label: 'Total',
                                color: '#1976d2'
                            },
                            {
                                data: stats.weeklyStats.map(day => day.completed),
                                label: 'Completed',
                                color: '#4caf50'
                            },
                            {
                                data: stats.weeklyStats.map(day => day.scheduled),
                                label: 'Scheduled',
                                color: '#ff9800'
                            }
                        ]}
                        height={400}
                        xAxis={[{
                            data: stats.weeklyStats.map(day => day.day),
                            scaleType: 'band'
                        }]}
                        margin={{ top: 20, bottom: 60, left: 40, right: 20 }}
                    />
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value }) {
    return (
        <div className="stat-card">
            <div className="stat-title">{title}</div>
            <div className="stat-value">{value}</div>
        </div>
    );
}

// Add this CSS to your stylesheet
/*
.appointment-stats-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.today-stats-section, .weekly-stats-section {
    margin-bottom: 2rem;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stats-cards {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.stat-card {
    padding: 1rem;
    border-radius: 8px;
    background: #f5f5f5;
    min-width: 100px;
    text-align: center;
    flex: 1;
}

.stat-title {
    font-size: 0.9rem;
    color: #666;
}

.stat-value {
    font-size: 1.5rem;
    font-weight: bold;
}

.chart-container {
    background: white;
    padding: 20px;
    border-radius: 8px;
}

.loading-spinner {
    text-align: center;
    padding: 40px;
}

.error-message {
    color: #d32f2f;
    padding: 20px;
    background: #ffebee;
    border-radius: 4px;
}

.no-data {
    padding: 20px;
    text-align: center;
    color: #666;
}
*/
