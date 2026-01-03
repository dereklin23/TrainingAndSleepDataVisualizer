# Release Notes - v1.2

**Release Date:** December 31, 2025  
**Branch:** release/v1.2  
**Tag:** v1.2

---

## 🎯 Major Features

### Goal Tracking System
A comprehensive goal tracking and progress monitoring system that helps athletes set, track, and achieve their training and recovery targets.

**Features:**
- ✅ Set weekly and monthly goals for:
  - Running mileage (miles)
  - Number of runs
  - Average sleep duration (hours)
  - Average readiness score
- ✅ Visual progress bars with gradient cards
- ✅ Real-time progress calculation from your data
- ✅ Streak tracking:
  - Sleep streak (8+ hours consecutive days)
  - Run streak (consecutive days with runs)
  - Readiness streak (85+ consecutive days)
- ✅ Personal best tracking for all streaks
- ✅ Goal setting modal with easy configuration
- ✅ LocalStorage persistence across sessions
- ✅ Smart visibility (hides for single-day views)

**Documentation:** See `GOAL_TRACKING_FEATURE.md` for full details

---

### Weekly Mileage Chart
A Strava-style weekly mileage visualization that provides clear insights into training load and consistency.

**Features:**
- ✅ Bar chart showing weekly totals (Sunday-Saturday)
- ✅ 4-week rolling average line overlay
- ✅ Interactive tooltips with:
  - Weekly mileage totals
  - Number of runs per week
  - Rolling average values
- ✅ Automatic weekly grouping
- ✅ Responsive design matching existing charts
- ✅ Smart visibility (hides for single-day views)

**Benefits:**
- Track training load trends over time
- Identify patterns in weekly mileage
- Monitor consistency with rolling average
- Visualize training progression

---

## 🎨 UI/UX Improvements

### Smart Contextual Display
Both the goals section and weekly mileage chart now intelligently show/hide based on the selected date range:

- **Single-Day Views** ("Today"): Both hidden for a clean, focused view
- **Multi-Day Views** (Weekly, Monthly, Yearly): Both visible with full insights

This keeps the interface clean and contextually relevant, showing information only when it's meaningful.

---

## 📁 New Files

- `public/goalsManager.js` (301 lines) - Core goal management class
- `GOAL_TRACKING_FEATURE.md` - Comprehensive documentation
- `RELEASE_NOTES_v1.2.md` - This file

---

## 🔧 Modified Files

- `public/dashboardClient.js` (+300 lines)
  - Goal tracking integration
  - Weekly mileage chart creation
  - Smart visibility logic
  - Data processing for weekly aggregation

- `public/trainingDashboard.html` (+400 lines)
  - Goals container and UI
  - Goals modal HTML
  - Weekly mileage chart container
  - CSS styling for all new components

- `README.md`
  - Updated features list
  - Added goal tracking section
  - Updated project structure
  - Added to recent updates

---

## 📊 Statistics

**Code Changes:**
- Files changed: 5
- Lines added: ~1,200
- New features: 2 major
- New files: 3

**Features Delivered:**
- Goal types: 4 metrics × 2 periods = 8 possible goals
- Streak types: 3
- Charts: 1 new (weekly mileage)
- UI components: Goals cards, modal, streak display, mileage chart

---

## 🚀 Deployment

### Production
- **URL:** https://athletesignal-production.up.railway.app
- **Platform:** Railway
- **Auto-Deploy:** Enabled from `main` branch
- **Session Store:** Redis
- **Status:** ✅ Live

### Development
- **Local:** `npm start` → http://localhost:3000
- **Branch Strategy:**
  - `main` - Production-ready code
  - `dev` - Development branch
  - `release/v1.2` - This release branch

---

## 🎓 Technical Details

### Goal Tracking Architecture

**Storage:** Browser localStorage under key `athletesignal_goals`

**Data Structure:**
```javascript
{
  weekly: {
    mileage: { enabled: boolean, target: number, current: number },
    runs: { enabled: boolean, target: number, current: number },
    avgSleep: { enabled: boolean, target: number, current: number },
    avgReadiness: { enabled: boolean, target: number, current: number }
  },
  monthly: { /* same structure */ },
  streaks: {
    consecutiveSleepGoal: number,
    consecutiveRunDays: number,
    consecutiveReadinessGoal: number,
    bestSleepStreak: number,
    bestRunStreak: number,
    bestReadinessStreak: number
  },
  lastUpdated: string
}
```

**Calculations:**
- Weekly goals: Last 7 days of data
- Monthly goals: Current calendar month
- Streaks: Consecutive days meeting criteria
- Progress: (current / target) × 100

### Weekly Mileage Algorithm

1. **Group by Week:** Data grouped by calendar week (Sunday-Saturday)
2. **Aggregate:** Sum mileage and count runs per week
3. **Rolling Average:** Calculate 4-week moving average
4. **Render:** Bar chart for totals, line chart for average

**Performance:**
- Time complexity: O(n) where n = number of days
- Space complexity: O(w) where w = number of weeks
- Efficient for large date ranges

---

## 🐛 Bug Fixes

### Session Persistence
- Reverted problematic authentication fixes from commits after v1.1
- Returned to stable v1.1 codebase
- Maintains reliable OAuth flow

### UI Consistency
- Goals section properly hides/shows based on date range
- Mileage chart properly destroys/recreates on range change
- No duplicate chart instances
- Clean transitions between views

---

## 🔜 Future Enhancements

### Potential Additions
- [ ] Backend storage for goal synchronization across devices
- [ ] Achievement badges for goal completions
- [ ] Email/push notifications for goal progress
- [ ] Goal templates (e.g., "5K Training Plan")
- [ ] Historical goal tracking
- [ ] Smart goal recommendations based on past performance
- [ ] Social sharing of achievements
- [ ] Pace improvement goals
- [ ] Heart rate zone goals

### Analytics Dashboard
- [ ] Correlation analysis (sleep vs performance)
- [ ] Trend detection and insights
- [ ] Training load calculations
- [ ] Recovery balance metrics
- [ ] Weekly/monthly summary reports

---

## 📝 Breaking Changes

**None** - This release is fully backward compatible with v1.1.

All new features are additive and don't affect existing functionality. Users upgrading from v1.1 will seamlessly see the new features without any configuration required.

---

## 🙏 Credits

**Developed by:** Athlete Signal Team  
**APIs Used:**
- Strava API v3
- Oura Ring API v2

**Libraries:**
- Chart.js for visualizations
- Express.js for backend
- Redis for session storage

---

## 📧 Support

For questions, issues, or feedback:
- Open an issue on GitHub
- Check documentation: `README.md`, `GOAL_TRACKING_FEATURE.md`
- Review deployment guide: `RAILWAY_DEPLOYMENT.md`

---

**Made with ❤️ by athletes, for athletes**

📊 Athlete Signal - Track Your Performance

