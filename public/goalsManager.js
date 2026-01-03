// Goals Management System
// Handles goal storage, progress tracking, and calculations

class GoalsManager {
  constructor() {
    this.goals = this.loadGoals();
    this.currentData = null;
  }

  // Load goals from localStorage
  loadGoals() {
    const stored = localStorage.getItem('athletesignal_goals');
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Default goals structure
    return {
      weekly: {
        mileage: { enabled: false, target: 20, current: 0 },
        runs: { enabled: false, target: 4, current: 0 },
        avgSleep: { enabled: false, target: 8, current: 0 },
        avgReadiness: { enabled: false, target: 85, current: 0 }
      },
      monthly: {
        mileage: { enabled: false, target: 80, current: 0 },
        runs: { enabled: false, target: 16, current: 0 },
        avgSleep: { enabled: false, target: 8, current: 0 },
        avgReadiness: { enabled: false, target: 85, current: 0 }
      },
      streaks: {
        consecutiveSleepGoal: 0,
        consecutiveRunDays: 0,
        consecutiveReadinessGoal: 0,
        bestSleepStreak: 0,
        bestRunStreak: 0,
        bestReadinessStreak: 0
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    };
  }

  // Save goals to localStorage
  saveGoals() {
    localStorage.setItem('athletesignal_goals', JSON.stringify(this.goals));
  }

  // Update a specific goal
  updateGoal(period, metric, enabled, target) {
    if (this.goals[period] && this.goals[period][metric]) {
      this.goals[period][metric].enabled = enabled;
      this.goals[period][metric].target = target;
      this.saveGoals();
    }
  }

  // Get all active goals
  getActiveGoals() {
    const active = [];
    
    ['weekly', 'monthly'].forEach(period => {
      Object.keys(this.goals[period]).forEach(metric => {
        if (this.goals[period][metric].enabled) {
          active.push({
            period,
            metric,
            target: this.goals[period][metric].target,
            current: this.goals[period][metric].current,
            progress: this.calculateProgress(period, metric)
          });
        }
      });
    });
    
    return active;
  }

  // Calculate progress for a specific goal
  calculateProgress(period, metric) {
    const goal = this.goals[period][metric];
    if (!goal || !goal.enabled || goal.target === 0) return 0;
    
    return Math.min(100, Math.round((goal.current / goal.target) * 100));
  }

  // Update progress based on data
  updateProgress(data) {
    if (!data || data.length === 0) return;
    
    this.currentData = data;
    const today = new Date().toISOString().split('T')[0];
    
    // Calculate weekly progress (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekStart = weekAgo.toISOString().split('T')[0];
    
    const weekData = data.filter(d => d.date >= weekStart && d.date <= today);
    
    // Calculate monthly progress (current month)
    const monthStart = new Date();
    monthStart.setDate(1);
    const monthStartStr = monthStart.toISOString().split('T')[0];
    
    const monthData = data.filter(d => d.date >= monthStartStr && d.date <= today);
    
    // Update weekly goals
    this.updateWeeklyProgress(weekData);
    
    // Update monthly goals
    this.updateMonthlyProgress(monthData);
    
    // Update streaks
    this.updateStreaks(data);
    
    this.goals.lastUpdated = today;
    this.saveGoals();
  }

  // Update weekly goal progress
  updateWeeklyProgress(weekData) {
    // Total mileage
    const weekMileage = weekData.reduce((sum, d) => sum + (d.distance || 0), 0);
    this.goals.weekly.mileage.current = Math.round(weekMileage * 10) / 10;
    
    // Number of runs
    const weekRuns = weekData.filter(d => d.distance > 0).length;
    this.goals.weekly.runs.current = weekRuns;
    
    // Average sleep (hours)
    const sleepDays = weekData.filter(d => d.sleep);
    if (sleepDays.length > 0) {
      const avgSleep = sleepDays.reduce((sum, d) => {
        const [hours, mins] = d.sleep.split('h ').map(s => parseFloat(s));
        return sum + hours + (mins / 60);
      }, 0) / sleepDays.length;
      this.goals.weekly.avgSleep.current = Math.round(avgSleep * 10) / 10;
    }
    
    // Average readiness
    const readinessDays = weekData.filter(d => d.readinessScore);
    if (readinessDays.length > 0) {
      const avgReadiness = readinessDays.reduce((sum, d) => sum + d.readinessScore, 0) / readinessDays.length;
      this.goals.weekly.avgReadiness.current = Math.round(avgReadiness);
    }
  }

  // Update monthly goal progress
  updateMonthlyProgress(monthData) {
    // Total mileage
    const monthMileage = monthData.reduce((sum, d) => sum + (d.distance || 0), 0);
    this.goals.monthly.mileage.current = Math.round(monthMileage * 10) / 10;
    
    // Number of runs
    const monthRuns = monthData.filter(d => d.distance > 0).length;
    this.goals.monthly.runs.current = monthRuns;
    
    // Average sleep (hours)
    const sleepDays = monthData.filter(d => d.sleep);
    if (sleepDays.length > 0) {
      const avgSleep = sleepDays.reduce((sum, d) => {
        const [hours, mins] = d.sleep.split('h ').map(s => parseFloat(s));
        return sum + hours + (mins / 60);
      }, 0) / sleepDays.length;
      this.goals.monthly.avgSleep.current = Math.round(avgSleep * 10) / 10;
    }
    
    // Average readiness
    const readinessDays = monthData.filter(d => d.readinessScore);
    if (readinessDays.length > 0) {
      const avgReadiness = readinessDays.reduce((sum, d) => sum + d.readinessScore, 0) / readinessDays.length;
      this.goals.monthly.avgReadiness.current = Math.round(avgReadiness);
    }
  }

  // Update streak tracking
  updateStreaks(data) {
    if (!data || data.length === 0) return;
    
    // Sort data by date (most recent first)
    const sortedData = [...data].sort((a, b) => b.date.localeCompare(a.date));
    
    // Track sleep goal streak (8+ hours)
    let currentSleepStreak = 0;
    for (const day of sortedData) {
      if (day.sleep) {
        const [hours] = day.sleep.split('h ').map(s => parseFloat(s));
        if (hours >= 8) {
          currentSleepStreak++;
        } else {
          break;
        }
      } else {
        break;
      }
    }
    this.goals.streaks.consecutiveSleepGoal = currentSleepStreak;
    if (currentSleepStreak > this.goals.streaks.bestSleepStreak) {
      this.goals.streaks.bestSleepStreak = currentSleepStreak;
    }
    
    // Track run day streak (any run)
    let currentRunStreak = 0;
    for (const day of sortedData) {
      if (day.distance > 0) {
        currentRunStreak++;
      } else {
        break;
      }
    }
    this.goals.streaks.consecutiveRunDays = currentRunStreak;
    if (currentRunStreak > this.goals.streaks.bestRunStreak) {
      this.goals.streaks.bestRunStreak = currentRunStreak;
    }
    
    // Track readiness goal streak (85+)
    let currentReadinessStreak = 0;
    for (const day of sortedData) {
      if (day.readinessScore && day.readinessScore >= 85) {
        currentReadinessStreak++;
      } else {
        break;
      }
    }
    this.goals.streaks.consecutiveReadinessGoal = currentReadinessStreak;
    if (currentReadinessStreak > this.goals.streaks.bestReadinessStreak) {
      this.goals.streaks.bestReadinessStreak = currentReadinessStreak;
    }
  }

  // Get streak information
  getStreaks() {
    return this.goals.streaks;
  }

  // Get goal summary for display
  getGoalSummary(period, metric) {
    const goal = this.goals[period][metric];
    if (!goal || !goal.enabled) return null;
    
    const progress = this.calculateProgress(period, metric);
    const remaining = Math.max(0, goal.target - goal.current);
    const isComplete = progress >= 100;
    
    // Format display text
    let displayText = '';
    let unit = '';
    
    switch(metric) {
      case 'mileage':
        unit = 'mi';
        displayText = `${goal.current} / ${goal.target} ${unit}`;
        break;
      case 'runs':
        unit = 'runs';
        displayText = `${goal.current} / ${goal.target} ${unit}`;
        break;
      case 'avgSleep':
        unit = 'hrs';
        displayText = `${goal.current} / ${goal.target} ${unit} avg`;
        break;
      case 'avgReadiness':
        unit = 'score';
        displayText = `${goal.current} / ${goal.target} avg`;
        break;
    }
    
    return {
      period,
      metric,
      target: goal.target,
      current: goal.current,
      remaining,
      progress,
      isComplete,
      displayText,
      unit
    };
  }

  // Reset weekly goals (call this at the start of each week)
  resetWeeklyGoals() {
    Object.keys(this.goals.weekly).forEach(metric => {
      this.goals.weekly[metric].current = 0;
    });
    this.saveGoals();
  }

  // Reset monthly goals (call this at the start of each month)
  resetMonthlyGoals() {
    Object.keys(this.goals.monthly).forEach(metric => {
      this.goals.monthly[metric].current = 0;
    });
    this.saveGoals();
  }
}

// Export for use in dashboard
window.GoalsManager = GoalsManager;

