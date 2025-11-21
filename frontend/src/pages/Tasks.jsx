import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';

const Tasks = () => {
    const { user, loading } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            fetchTasks();
            if (user.role === 'admin') {
                fetchUsers();
            }
        }
    }, [user]);

    if (loading) return <div>Loading...</div>;
    if (!user) return <div>Please log in to view tasks.</div>;

    const fetchTasks = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await api.get('/api/tasks/my-tasks', config);
            setTasks(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchUsers = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await api.get('/api/tasks/users', config);
            setUsers(data);
            if (data.length > 0) {
                setAssignedTo(data[0]._id);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await api.post(
                '/api/tasks',
                { title, description, assignedTo, dueDate },
                config
            );
            setMessage('Task assigned successfully!');
            setTitle('');
            setDescription('');
            setDueDate('');
        } catch (error) {
            setMessage(error.response.data.message);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await api.put(
                `/api/tasks/${id}/status`,
                { status },
                config
            );
            fetchTasks();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="tasks-container">
            <h3>Productivity & Tasks</h3>
            {message && <div className="alert">{message}</div>}

            {user.role === 'admin' && (
                <div className="card">
                    <h4>Assign New Task</h4>
                    <form onSubmit={handleCreateTask}>
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="2"
                                style={{ width: '100%', padding: '0.5rem' }}
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <label>Assign To</label>
                            <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
                                {users.map((u) => (
                                    <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Due Date</label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Assign Task</button>
                    </form>
                </div>
            )}

            <div className="card">
                <h4>My Tasks</h4>
                <div className="task-list">
                    {tasks.length === 0 ? <p>No tasks assigned.</p> : (
                        tasks.map((task) => (
                            <div key={task._id} className="task-item" style={{ border: '1px solid #e5e7eb', padding: '1rem', marginBottom: '1rem', borderRadius: '0.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h5 style={{ margin: '0 0 0.5rem 0' }}>{task.title}</h5>
                                    <span className={`status-badge ${task.status.toLowerCase().replace(' ', '-')}`}>
                                        {task.status}
                                    </span>
                                </div>
                                <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>{task.description}</p>
                                <p style={{ fontSize: '0.8rem' }}>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</p>

                                {task.status !== 'Completed' && (
                                    <div style={{ marginTop: '1rem' }}>
                                        {task.status === 'Pending' && (
                                            <button
                                                onClick={() => updateStatus(task._id, 'In Progress')}
                                                className="btn"
                                                style={{ backgroundColor: '#f59e0b', color: 'white', padding: '0.5rem', fontSize: '0.8rem' }}
                                            >
                                                Start Task
                                            </button>
                                        )}
                                        {task.status === 'In Progress' && (
                                            <button
                                                onClick={() => updateStatus(task._id, 'Completed')}
                                                className="btn"
                                                style={{ backgroundColor: '#10b981', color: 'white', padding: '0.5rem', fontSize: '0.8rem' }}
                                            >
                                                Mark Completed
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Tasks;
