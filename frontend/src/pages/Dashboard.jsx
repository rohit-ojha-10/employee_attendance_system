import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="dashboard-container">
            <div className="card welcome-card">
                <h3>Overview</h3>
                <p>Welcome to your employee dashboard. Use the sidebar to navigate to different sections.</p>
            </div>

            <div className="stats-grid">
                <div className="card stat-card">
                    <h4>Attendance</h4>
                    <p>Check your daily attendance and work hours.</p>
                </div>
                <div className="card stat-card">
                    <h4>Leave Balance</h4>
                    <p>View your remaining leave balance.</p>
                </div>
                <div className="card stat-card">
                    <h4>Tasks</h4>
                    <p>View your assigned tasks and productivity.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
