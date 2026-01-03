// Yearly Goals Planner
// Analyzes current training and generates progressive weekly mileage goals for next year

class YearlyGoalsPlanner {
  constructor() {
    this.weeksPerYear = 52;
    this.safeProgressionRate = 0.10; // 10% max increase per week
    this.recommendedProgressionRate = 0.05; // 5% conservative increase
    this.deloadWeekFrequency = 4; // Deload every 4th week
    this.deloadReduction = 0.75; // 25% reduction on deload weeks
  }

  /**
   * Analyze current year's training to establish baseline
   */
  analyzeCurrentTraining(data) {
    if (!data || data.length === 0) {
      return null;
    }

    const currentYear = new Date().getFullYear();
    const currentYearData = data.filter(d => {
      const year = new Date(d.date).getFullYear();
      return year === currentYear;
    });

    if (currentYearData.length === 0) {
      return null;
    }

    // Calculate weekly statistics
    const weeklyMileage = this.calculateWeeklyMileage(currentYearData);
    const avgWeeklyMileage = weeklyMileage.length > 0
      ? weeklyMileage.reduce((sum, w) => sum + w.mileage, 0) / weeklyMileage.length
      : 0;

    const maxWeeklyMileage = weeklyMileage.length > 0
      ? Math.max(...weeklyMileage.map(w => w.mileage))
      : 0;

    const totalMileage = currentYearData.reduce((sum, d) => sum + (d.distance || 0), 0);
    const weeksWithRuns = weeklyMileage.filter(w => w.mileage > 0).length;
    const consistency = weeksWithRuns / Math.max(1, this.getCurrentWeekOfYear());

    return {
      totalMileage: Math.round(totalMileage),
      avgWeeklyMileage: Math.round(avgWeeklyMileage * 10) / 10,
      maxWeeklyMileage: Math.round(maxWeeklyMileage * 10) / 10,
      weeksWithRuns,
      consistency: Math.round(consistency * 100),
      weeklyMileage
    };
  }

  /**
   * Calculate weekly mileage from daily data
   */
  calculateWeeklyMileage(data) {
    const weeks = {};
    
    data.forEach(d => {
      const date = new Date(d.date);
      const weekNum = this.getWeekNumber(date);
      const year = date.getFullYear();
      const key = `${year}-W${weekNum}`;
      
      if (!weeks[key]) {
        weeks[key] = {
          week: weekNum,
          year,
          mileage: 0,
          runs: 0
        };
      }
      
      weeks[key].mileage += d.distance || 0;
      if (d.distance > 0) {
        weeks[key].runs++;
      }
    });

    return Object.values(weeks).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.week - b.week;
    });
  }

  /**
   * Get ISO week number
   */
  getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  }

  /**
   * Get current week of the year
   */
  getCurrentWeekOfYear() {
    return this.getWeekNumber(new Date());
  }

  /**
   * Create a custom plan with user-defined weekly goals
   */
  createCustomPlan(weeklyGoals) {
    if (!weeklyGoals || weeklyGoals.length !== this.weeksPerYear) {
      return null;
    }

    const nextYear = new Date().getFullYear() + 1;
    const plan = [];

    weeklyGoals.forEach((mileage, index) => {
      const week = index + 1;
      const plannedMileage = parseFloat(mileage) || 0;
      
      // Calculate safe range (±10%)
      const minMileage = plannedMileage * 0.9;
      const maxMileage = plannedMileage * 1.1;

      plan.push({
        week,
        year: nextYear,
        plannedMileage: Math.round(plannedMileage * 10) / 10,
        minMileage: Math.round(minMileage * 10) / 10,
        maxMileage: Math.round(maxMileage * 10) / 10,
        isDeloadWeek: false,
        phase: 'custom'
      });
    });

    const totalYearMileage = plan.reduce((sum, w) => sum + w.plannedMileage, 0);
    const avgWeeklyMileage = totalYearMileage / this.weeksPerYear;
    const nonZeroWeeks = plan.filter(w => w.plannedMileage > 0);
    const startingMileage = nonZeroWeeks.length > 0 ? nonZeroWeeks[0].plannedMileage : 0;
    const targetMileage = nonZeroWeeks.length > 0 ? nonZeroWeeks[nonZeroWeeks.length - 1].plannedMileage : 0;

    return {
      year: nextYear,
      plan,
      summary: {
        startingMileage: Math.round(startingMileage * 10) / 10,
        targetMileage: Math.round(targetMileage * 10) / 10,
        totalYearMileage: Math.round(totalYearMileage),
        avgWeeklyMileage: Math.round(avgWeeklyMileage * 10) / 10,
        increasePercent: startingMileage > 0 ? Math.round(((targetMileage - startingMileage) / startingMileage) * 100) : 0,
        deloadWeeks: 0,
        progressionType: 'custom'
      }
    };
  }

  /**
   * Generate progressive weekly mileage goals for next year
   */
  generateYearlyPlan(currentTraining, options = {}) {
    if (!currentTraining) {
      return null;
    }

    const {
      startingMileage = currentTraining.avgWeeklyMileage,
      targetIncrease = 20, // 20% increase over the year
      includeDeloadWeeks = true,
      progressionType = 'conservative' // 'conservative' or 'aggressive'
    } = options;

    const progressionRate = progressionType === 'aggressive' 
      ? this.safeProgressionRate 
      : this.recommendedProgressionRate;

    const plan = [];
    const nextYear = new Date().getFullYear() + 1;
    
    let currentMileage = Math.max(startingMileage, 5); // Minimum 5 miles per week
    const targetMileage = currentMileage * (1 + (targetIncrease / 100));
    const weeksToTarget = Math.floor(this.weeksPerYear * 0.8); // Build for 80% of year, maintain for 20%
    
    // Calculate weekly increase needed
    const totalIncrease = targetMileage - currentMileage;
    const weeklyIncrease = totalIncrease / weeksToTarget;

    for (let week = 1; week <= this.weeksPerYear; week++) {
      const isDeloadWeek = includeDeloadWeeks && week % this.deloadWeekFrequency === 0;
      
      let plannedMileage;
      
      if (isDeloadWeek) {
        // Deload week - reduce mileage
        plannedMileage = currentMileage * this.deloadReduction;
      } else if (week <= weeksToTarget) {
        // Build phase - progressive increase
        plannedMileage = currentMileage;
        currentMileage += weeklyIncrease;
      } else {
        // Maintenance phase - hold at target
        plannedMileage = targetMileage;
      }

      // Calculate safe range (±10%)
      const minMileage = plannedMileage * 0.9;
      const maxMileage = plannedMileage * 1.1;

      plan.push({
        week,
        year: nextYear,
        plannedMileage: Math.round(plannedMileage * 10) / 10,
        minMileage: Math.round(minMileage * 10) / 10,
        maxMileage: Math.round(maxMileage * 10) / 10,
        isDeloadWeek,
        phase: week <= weeksToTarget ? 'build' : 'maintain'
      });
    }

    return {
      year: nextYear,
      plan,
      summary: {
        startingMileage: Math.round(startingMileage * 10) / 10,
        targetMileage: Math.round(targetMileage * 10) / 10,
        totalYearMileage: Math.round(plan.reduce((sum, w) => sum + w.plannedMileage, 0)),
        avgWeeklyMileage: Math.round((plan.reduce((sum, w) => sum + w.plannedMileage, 0) / this.weeksPerYear) * 10) / 10,
        increasePercent: Math.round(((targetMileage - startingMileage) / startingMileage) * 100),
        deloadWeeks: plan.filter(w => w.isDeloadWeek).length,
        progressionType
      }
    };
  }

  /**
   * Get quarterly breakdown of the plan
   */
  getQuarterlyBreakdown(yearlyPlan) {
    if (!yearlyPlan) return null;

    const quarters = [
      { name: 'Q1', weeks: yearlyPlan.plan.slice(0, 13) },
      { name: 'Q2', weeks: yearlyPlan.plan.slice(13, 26) },
      { name: 'Q3', weeks: yearlyPlan.plan.slice(26, 39) },
      { name: 'Q4', weeks: yearlyPlan.plan.slice(39, 52) }
    ];

    return quarters.map(q => ({
      quarter: q.name,
      totalMileage: Math.round(q.weeks.reduce((sum, w) => sum + w.plannedMileage, 0)),
      avgWeeklyMileage: Math.round((q.weeks.reduce((sum, w) => sum + w.plannedMileage, 0) / q.weeks.length) * 10) / 10,
      weeksCount: q.weeks.length
    }));
  }

  /**
   * Generate recommendations based on analysis
   */
  generateRecommendations(currentTraining) {
    if (!currentTraining) {
      return ['Start tracking your runs to get personalized recommendations!'];
    }

    const recommendations = [];

    // Consistency recommendations
    if (currentTraining.consistency < 50) {
      recommendations.push('🎯 Focus on consistency first. Try to run at least 3x per week.');
    } else if (currentTraining.consistency >= 80) {
      recommendations.push('✅ Excellent consistency! You\'re ready for progressive mileage increases.');
    }

    // Mileage recommendations
    if (currentTraining.avgWeeklyMileage < 10) {
      recommendations.push('📈 Start with a base-building phase. Gradually increase to 15-20 miles/week.');
    } else if (currentTraining.avgWeeklyMileage < 30) {
      recommendations.push('📈 You can safely increase weekly mileage by 10-20% next year.');
    } else if (currentTraining.avgWeeklyMileage >= 50) {
      recommendations.push('🏃‍♂️ High-mileage runner! Focus on quality over quantity with strategic increases.');
    }

    // Progression recommendations
    recommendations.push('📅 Include deload weeks every 4 weeks to prevent overtraining.');
    recommendations.push('⚡ Increase mileage gradually - no more than 10% per week.');

    return recommendations;
  }

  /**
   * Save yearly plan to localStorage
   */
  savePlan(plan) {
    if (!plan) return;
    localStorage.setItem('athletesignal_yearly_plan', JSON.stringify({
      plan,
      createdAt: new Date().toISOString()
    }));
  }

  /**
   * Load yearly plan from localStorage
   */
  loadPlan() {
    const stored = localStorage.getItem('athletesignal_yearly_plan');
    if (!stored) return null;
    
    try {
      const data = JSON.parse(stored);
      return data.plan;
    } catch (e) {
      console.error('Error loading yearly plan:', e);
      return null;
    }
  }

  /**
   * Check if current week matches the plan
   */
  checkWeeklyProgress(plan, currentWeekMileage) {
    if (!plan) return null;

    const currentWeek = this.getCurrentWeekOfYear();
    const weekPlan = plan.plan.find(w => w.week === currentWeek);
    
    if (!weekPlan) return null;

    const isOnTrack = currentWeekMileage >= weekPlan.minMileage && 
                      currentWeekMileage <= weekPlan.maxMileage;

    return {
      week: currentWeek,
      planned: weekPlan.plannedMileage,
      actual: currentWeekMileage,
      min: weekPlan.minMileage,
      max: weekPlan.maxMileage,
      isOnTrack,
      difference: currentWeekMileage - weekPlan.plannedMileage,
      percentComplete: Math.round((currentWeekMileage / weekPlan.plannedMileage) * 100)
    };
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = YearlyGoalsPlanner;
}

