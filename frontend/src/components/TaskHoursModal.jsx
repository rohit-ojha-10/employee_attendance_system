import { useState, useEffect } from 'react';

const TaskHoursModal = ({ isOpen, onClose, onSubmit, tasks, totalWorkHours }) => {
    const [hours, setHours] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            // Initialize hours for each task to 0
            const initialHours = {};
            tasks.forEach(task => {
                initialHours[task._id] = 0;
            });
            setHours(initialHours);
            setError('');
        }
    }, [isOpen, tasks]);

    const handleChange = (taskId, value) => {
        setHours(prev => ({
            ...prev,
            [taskId]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const totalInputHours = Object.values(hours).reduce((acc, curr) => acc + Number(curr), 0);

        // Allow small margin for floating point
        if (totalInputHours > totalWorkHours + 0.1) {
            setError(`Total hours (${totalInputHours.toFixed(2)}) cannot exceed work hours (${totalWorkHours.toFixed(2)})`);
            return;
        }

        // Format data for backend
        const taskHoursData = Object.entries(hours).map(([taskId, h]) => {
            const task = tasks.find(t => t._id === taskId);
            return {
                taskId,
                taskTitle: task?.title,
                project: task?.project,
                hours: Number(h)
            };
        });

        onSubmit(taskHoursData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-xl w-full max-w-md text-white">
                <h2 className="text-2xl font-bold mb-6 text-center">Task Timesheet</h2>

                <div className="mb-6 bg-white/5 p-4 rounded-lg">
                    <p className="text-gray-300 text-sm">Total Work Duration</p>
                    <p className="text-3xl font-bold text-blue-400">{totalWorkHours.toFixed(2)} hrs</p>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {tasks.map((task) => (
                            <div key={task._id} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                                <div className="flex flex-col">
                                    <span className="text-gray-200 font-medium">{task.title}</span>
                                    <span className="text-xs text-gray-400">{task.project}</span>
                                </div>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={hours[task._id] || ''}
                                    onChange={(e) => handleChange(task._id, e.target.value)}
                                    className="w-20 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors text-right"
                                    placeholder="0.0"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-4 mt-6 pt-4 border-t border-white/10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg transition-all transform hover:scale-[1.02]"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskHoursModal;
