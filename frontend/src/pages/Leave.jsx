import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';

const Leave = () => {
    const { user, loading } = useContext(AuthContext);
    const [leaves, setLeaves] = useState([]);
    const [allLeaves, setAllLeaves] = useState([]);
    const [leaveType, setLeaveType] = useState('Sick');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            fetchLeaves();
            if (user.role === 'admin' || user.role === 'hr') {
                fetchAllLeaves();
            }
        }
    }, [user]);

    if (loading) return <div>Loading...</div>;
    if (!user) return <div>Please log in to view leaves.</div>;

    const fetchLeaves = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await api.get('/api/leaves/my-leaves', config);
            setLeaves(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchAllLeaves = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await api.get('/api/leaves/all', config);
            setAllLeaves(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await api.post(
                '/api/leaves/apply',
                { leaveType, startDate, endDate, reason },
                config
            );
            setMessage('Leave applied successfully!');
            fetchLeaves();
            setReason('');
            setStartDate('');
            setEndDate('');
        } catch (error) {
            setMessage(error.response.data.message);
        }
    };

    const updateLeaveStatus = async (id, status) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await api.put(
                `/api/leaves/${id}/status`,
                { status },
                config
            );
            setMessage(`Leave ${status.toLowerCase()} successfully!`);
            fetchAllLeaves();
            fetchLeaves();
        } catch (error) {
            setMessage('Failed to update leave status');
        }
    };

    return (
        <div className="leave-container">
            <h3>Leave Management</h3>
            {message && <div className="alert">{message}</div>}

            <div className="card">
                <h4>Apply for Leave</h4>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Leave Type</label>
                        <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                            <option value="Sick">Sick Leave</option>
                            <option value="Casual">Casual Leave</option>
                            <option value="Earned">Earned Leave</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Reason</label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                            rows="3"
                            style={{ width: '100%', padding: '0.5rem' }}
                        ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary">Apply</button>
                </form>
            </div>

            {(user.role === 'admin' || user.role === 'hr') && (
                <div className="card">
                    <h4>All Leave Requests (Admin)</h4>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Type</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allLeaves.map((leave) => (
                                <tr key={leave._id}>
                                    <td>{leave.user?.name || 'N/A'}</td>
                                    <td>{leave.leaveType}</td>
                                    <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                                    <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                                    <td>{leave.reason}</td>
                                    <td>
                                        <span className={`status-badge ${leave.status.toLowerCase()}`}>
                                            {leave.status}
                                        </span>
                                    </td>
                                    <td>
                                        {leave.status === 'Pending' && (
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => updateLeaveStatus(leave._id, 'Approved')}
                                                    className="btn"
                                                    style={{ backgroundColor: '#10b981', color: 'white', padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => updateLeaveStatus(leave._id, 'Rejected')}
                                                    className="btn"
                                                    style={{ backgroundColor: '#ef4444', color: 'white', padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="card">
                <h4>My Leaves</h4>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Reason</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaves.map((leave) => (
                            <tr key={leave._id}>
                                <td>{leave.leaveType}</td>
                                <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                                <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                                <td>{leave.reason}</td>
                                <td>
                                    <span className={`status-badge ${leave.status.toLowerCase()}`}>
                                        {leave.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Leave;
