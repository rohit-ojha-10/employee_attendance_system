import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';

const Admin = () => {
    const { user } = useContext(AuthContext);
    const [alerts, setAlerts] = useState([]);

    const triggerSystemAction = async (action) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            await api.post(`/api/system/${action}`, {}, config);
            alert(`Action ${action} triggered successfully`);
            // Refresh alerts
            const alertsRes = await api.get('/api/alerts', config);
            setAlerts(alertsRes.data);
        } catch (error) {
            console.error(error);
            alert('Failed to trigger action');
        }
    };

    if (!user || user.role !== 'admin') {
        return <div className="p-8 text-red-600">Access Denied. Admin only.</div>;
    }

    return (
        <div className="admin-container p-6 space-y-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Panel</h2>

            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">System Actions (.NET Service)</h3>
                <div className="flex gap-4 flex-wrap">
                    <button onClick={() => triggerSystemAction('reconcile')} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">
                        Run Reconciliation
                    </button>
                    <button onClick={() => triggerSystemAction('calculate-productivity')} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                        Calc Productivity
                    </button>
                    <button onClick={() => triggerSystemAction('evaluate-rules')} className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors">
                        Evaluate Rules
                    </button>
                    <button onClick={() => triggerSystemAction('run-all')} className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors">
                        Run All Checks
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">System Alerts</h3>
                {alerts.length === 0 ? <p className="text-gray-500">No active alerts (trigger an action to refresh).</p> : (
                    <div className="space-y-4">
                        {alerts.map(alert => (
                            <div key={alert._id} className="p-4 border-l-4 border-red-500 bg-red-50 rounded">
                                <h5 className="font-bold text-red-700">{alert.type}</h5>
                                <p className="text-red-600">{alert.message}</p>
                                <small className="text-red-400">{new Date(alert.generatedAt).toLocaleString()}</small>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
