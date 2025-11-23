import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';

const Rules = () => {
    const { user, loading } = useContext(AuthContext);
    const [rules, setRules] = useState([]);
    const [name, setName] = useState('');
    const [condition, setCondition] = useState('');
    const [action, setAction] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchRules();
        }
    }, [user]);

    if (loading) return <div>Loading...</div>;
    if (!user || user.role !== 'admin') return <div>Access Denied. Admin only.</div>;

    const fetchRules = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await api.get('/api/rules', config);
            setRules(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateRule = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            await api.post('/api/rules', { name, condition, action }, config);
            setMessage('Rule created successfully!');
            setName('');
            setCondition('');
            setAction('');
            fetchRules();
        } catch (error) {
            setMessage('Failed to create rule');
        }
    };

    const handleDeleteRule = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };
                await api.delete(`/api/rules/${id}`, config);
                fetchRules();
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="rules-container">
            <h3>Access Control Rules</h3>
            {message && <div className="alert">{message}</div>}

            <div className="card">
                <h4>Create New Rule</h4>
                <form onSubmit={handleCreateRule}>
                    <div className="form-group">
                        <label>Rule Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Excessive Absence"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Condition</label>
                        <input
                            type="text"
                            value={condition}
                            onChange={(e) => setCondition(e.target.value)}
                            placeholder="e.g., ABSENT_COUNT > 3"
                            required
                        />
                        <small>Supported: ABSENT_COUNT &gt; X</small>
                    </div>
                    <div className="form-group">
                        <label>Action</label>
                        <select value={action} onChange={(e) => setAction(e.target.value)} required>
                            <option value="">Select Action</option>
                            <option value="SEND_ALERT">Send Alert</option>
                            <option value="BLOCK_ACCESS">Block Access</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary">Create Rule</button>
                </form>
            </div>

            <div className="card">
                <h4>Existing Rules</h4>
                <div className="rule-list">
                    {rules.length === 0 ? <p>No rules defined.</p> : (
                        rules.map((rule) => (
                            <div key={rule._id} className="rule-item" style={{ border: '1px solid #e5e7eb', padding: '1rem', marginBottom: '1rem', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h5 style={{ margin: 0 }}>{rule.name}</h5>
                                    <p style={{ margin: '0.2rem 0', fontSize: '0.9rem' }}>If {rule.condition} then {rule.action}</p>
                                </div>
                                <button onClick={() => handleDeleteRule(rule._id)} className="btn" style={{ backgroundColor: '#ef4444', color: 'white', padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>Delete</button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Rules;
