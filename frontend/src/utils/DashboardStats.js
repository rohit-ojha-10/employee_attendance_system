export const calculateSummary = (attendance = [], leaves = [], tasks = []) => {
    let presentCount = 0;
    let earlyLeaveCount = 0;
    let absentCount = 0; // Track absent if needed, though not currently displayed

    attendance.forEach(record => {
        if (record.status === 'Present') {
            const hours = record.workHours || 0;

            if (hours < 4) {
                // Less than 4 hours = Absent
                earlyLeaveCount++;
            }
            else if (hours >= 4) {
                presentCount++;
            }
        }
    });

    // Leave Summary: Count approved leaves
    const leaveCount = leaves.filter(l => l.status === 'Approved').length;

    // Task Summary: Total tasks
    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
    const resolvedTasks = tasks.filter(t => t.status === 'Completed').length;

    return {
        present: presentCount,
        earlyLeave: earlyLeaveCount,
        leaves: leaveCount,
        totalTasks,
        pendingTasks,
        resolvedTasks
    };
};

export const processProjectHours = (attendance = []) => {
    const projectMap = {};

    attendance.forEach(record => {
        if (record.taskHours) {
            record.taskHours.forEach(th => {
                const project = th.project || 'Unknown';
                projectMap[project] = (projectMap[project] || 0) + th.hours;
            });
        }
    });

    return Object.entries(projectMap).map(([name, value]) => ({
        name,
        value: Number(value.toFixed(2))
    }));
};

export const processDailyHours = (attendance = []) => {
    // Get last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        last7Days.push(d.toISOString().split('T')[0]);
    }

    return last7Days.map(date => {
        const record = attendance.find(a => a.date === date);
        return {
            date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
            hours: record ? record.workHours : 0
        };
    });
};

export const processTaskDistribution = (tasks = []) => {
    const projectMap = {};

    tasks.forEach(task => {
        const project = task.project || 'Unknown';
        if (!projectMap[project]) {
            projectMap[project] = { name: project, Pending: 0, 'In Progress': 0, Completed: 0, total: 0 };
        }
        projectMap[project][task.status] = (projectMap[project][task.status] || 0) + 1;
        projectMap[project].total += 1;
    });

    return Object.values(projectMap);
};
