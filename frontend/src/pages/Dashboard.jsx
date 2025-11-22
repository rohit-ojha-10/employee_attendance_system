import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';
import { calculateSummary, processProjectHours, processDailyHours, processTaskDistribution } from '../utils/DashboardStats';
import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        present: 0,
        earlyLeave: 0,
        leaves: 0,
        totalTasks: 0,
        pendingTasks: 0,
        resolvedTasks: 0
    });
    const [projectHoursData, setProjectHoursData] = useState([]);
    const [dailyHoursData, setDailyHoursData] = useState([]);
    const [taskDistributionData, setTaskDistributionData] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };

                const [attendanceRes, leavesRes, tasksRes] = await Promise.all([
                    api.get('/api/attendance/my-attendance', config),
                    api.get('/api/leaves/my-leaves', config),
                    api.get('/api/tasks/my-tasks', config)
                ]);

                const attendance = attendanceRes.data;
                const leaves = leavesRes.data;
                const allTasks = tasksRes.data;

                // Set Stats
                setStats(calculateSummary(attendance, leaves, allTasks));

                // Set Charts Data
                setProjectHoursData(processProjectHours(attendance));
                setDailyHoursData(processDailyHours(attendance));
                setTaskDistributionData(processTaskDistribution(allTasks));
                setTasks(allTasks);

                setLoading(false);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user]);

    if (loading) return <div className="p-8 text-gray-800">Loading Dashboard...</div>;

    return (
        <div className="dashboard-container p-6 space-y-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center">
                    <h4 className="text-gray-600 text-lg font-medium mb-2">Present Summary</h4>
                    <div className="flex justify-between w-full px-8 mt-2">
                        <div className="text-center">
                            <span className="text-4xl font-bold text-gray-800">{stats.present}</span>
                            <p className="text-xs text-gray-500 mt-1">Days Present</p>
                        </div>
                        <div className="text-center">
                            <span className="text-4xl font-bold text-gray-800">0</span>
                            <p className="text-xs text-gray-500 mt-1">Late</p>
                        </div>
                        <div className="text-center">
                            <span className="text-4xl font-bold text-gray-800">{stats.earlyLeave}</span>
                            <p className="text-xs text-gray-500 mt-1">Early Leave</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center">
                    <h4 className="text-gray-600 text-lg font-medium mb-2">Leave Summary</h4>
                    <div className="flex justify-between w-full px-8 mt-2">
                        <div className="text-center">
                            <span className="text-4xl font-bold text-gray-800">{stats.leaves}</span>
                            <p className="text-xs text-gray-500 mt-1">Approved</p>
                        </div>
                        <div className="text-center">
                            <span className="text-4xl font-bold text-gray-800">0</span>
                            <p className="text-xs text-gray-500 mt-1">Rejected</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center">
                    <h4 className="text-gray-600 text-lg font-medium mb-2">Task Summary</h4>
                    <div className="flex justify-between w-full px-8 mt-2">
                        <div className="text-center">
                            <span className="text-4xl font-bold text-gray-800">{stats.totalTasks}</span>
                            <p className="text-xs text-gray-500 mt-1">Total</p>
                        </div>
                        <div className="text-center">
                            <span className="text-4xl font-bold text-gray-800">{stats.pendingTasks}</span>
                            <p className="text-xs text-gray-500 mt-1">Pending</p>
                        </div>
                        <div className="text-center">
                            <span className="text-4xl font-bold text-gray-800">{stats.resolvedTasks}</span>
                            <p className="text-xs text-gray-500 mt-1">Resolved</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Productivity Chart (Task List) */}
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 lg:col-span-1">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800">Productivity Chart</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-gray-600">
                            <thead>
                                <tr className="border-b border-gray-200 text-sm uppercase tracking-wider">
                                    <th className="pb-3 font-medium">Project Name</th>
                                    <th className="pb-3 font-medium">Task Title</th>
                                    <th className="pb-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {tasks.slice(0, 5).map(task => (
                                    <tr key={task._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-3">{task.project}</td>
                                        <td className="py-3">{task.title}</td>
                                        <td className="py-3">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold
                                                ${task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                    task.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-blue-100 text-blue-800'}`}>
                                                {task.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Hours Spent per Project (Pie Chart) */}
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center justify-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Hours spent on per project</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={projectHoursData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {projectHoursData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px', color: '#333' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Hours Worked per Day (Line Chart) */}
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Hour worked per day</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={dailyHoursData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                            <XAxis dataKey="date" stroke="#888" />
                            <YAxis stroke="#888" />
                            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px', color: '#333' }} />
                            <Line type="monotone" dataKey="hours" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Task per Project (Bar Chart) */}
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Task per project</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={taskDistributionData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                            <XAxis dataKey="name" stroke="#888" />
                            <YAxis stroke="#888" />
                            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px', color: '#333' }} />
                            <Legend />
                            <Bar dataKey="Completed" stackId="a" fill="#00C49F" />
                            <Bar dataKey="In Progress" stackId="a" fill="#0088FE" />
                            <Bar dataKey="Pending" stackId="a" fill="#FFBB28" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
