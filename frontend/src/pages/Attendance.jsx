import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import TaskHoursModal from '../components/TaskHoursModal';

const Attendance = () => {
    const { user, loading } = useContext(AuthContext);
    const [attendance, setAttendance] = useState([]);
    const [todayStatus, setTodayStatus] = useState(null);
    const [componentLoading, setComponentLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentWorkHours, setCurrentWorkHours] = useState(0);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        if (user) {
            fetchAttendance();
            fetchTasks();
        }
    }, [user]);

    if (loading) return <div>Loading...</div>;
    if (!user) return <div>Please log in to view attendance.</div>;

    const fetchAttendance = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await api.get('/api/attendance/my-attendance', config);
            setAttendance(data);

            // Check if already checked in today
            const today = new Date().toISOString().split('T')[0];
            const todayRecord = data.find(a => a.date === today);
            setTodayStatus(todayRecord);

            setComponentLoading(false);
        } catch (error) {
            console.error(error);
            setComponentLoading(false);
        }
    };

    const fetchTasks = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await api.get('/api/tasks/my-tasks', config);
            // Filter out completed tasks if needed, or show all. Let's show all pending/in-progress
            setTasks(data.filter(task => task.status !== 'Completed'));
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleCheckIn = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await api.post('/api/attendance/checkin', {}, config);
            setMessage('Checked In Successfully!');
            fetchAttendance();
        } catch (error) {
            setMessage(error.response.data.message);
        }
    };

    const handleCheckOutClick = () => {
        if (todayStatus && todayStatus.checkIn) {
            const checkInTime = new Date(todayStatus.checkIn);
            const now = new Date();
            const duration = (now - checkInTime) / (1000 * 60 * 60);
            setCurrentWorkHours(duration);
            setIsModalOpen(true);
        }
    };

    const submitCheckOut = async (taskHours) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await api.post('/api/attendance/checkout', { taskHours }, config);
            setMessage('Checked Out Successfully!');
            setIsModalOpen(false);
            fetchAttendance();
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error checking out');
        }
    };

    return (
        <div className="attendance-container">
            <h3>Attendance Management</h3>
            {message && <div className="alert">{message}</div>}

            <div className="actions-card card">
                <h4>Today's Action</h4>
                <div className="action-buttons">
                    {!todayStatus ? (
                        <button onClick={handleCheckIn} className="btn btn-primary">Punch In</button>
                    ) : !todayStatus.checkOut ? (
                        <button onClick={handleCheckOutClick} className="btn btn-danger">Punch Out</button>
                    ) : (
                        <div className="completed-status">
                            <p>You have completed your work day.</p>
                            <p>Work Hours: {todayStatus.workHours} hrs</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="history-card card">
                <h4>Attendance History</h4>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Check In</th>
                            <th>Check Out</th>
                            <th>Status</th>
                            <th>Hours</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendance.map((record) => (
                            <tr key={record._id}>
                                <td>{record.date}</td>
                                <td>{record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : '-'}</td>
                                <td>{record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : '-'}</td>
                                <td>{record.status}</td>
                                <td>{record.workHours || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <TaskHoursModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={submitCheckOut}
                tasks={tasks}
                totalWorkHours={currentWorkHours}
            />
        </div>
    );
};

export default Attendance;
