# 🎯 Athlete Signal - Feature Showcase

A comprehensive fitness dashboard that combines Strava training data with Oura Ring recovery metrics. Train smarter, recover better.

**Live Demo:** [https://athletesignal-production.up.railway.app](https://athletesignal-production.up.railway.app)

---

## 📊 Dashboard Overview

### Date Range Selection

Select from preset ranges or choose custom dates to analyze your training and recovery data.

![Date Range Selector](docs/screenshots/date-range-selector.png)

**Features:**
- Quick preset buttons: Today, Last 7 Days, Last 30 Days, This Month, Last Month, This Year, Last Year
- Custom date picker for any range
- Instant data updates when range changes

---

## 📈 Interactive Charts

### Sleep Breakdown & Training Metrics

Track your sleep quality and running performance with comprehensive visualizations.

![Sleep and Running Data Charts](docs/screenshots/sleep-run-data.png)

**Sleep Breakdown Features:**
- Stacked bar chart showing all sleep stages (Light, REM, Deep)
- Daily sleep duration tracking
- Visual indicators for quality sleep
- Hover tooltips with exact values

**Training Metrics Features:**
- Multi-axis chart displaying distance, pace, heart rate, and cadence
- Comprehensive visualization of your running performance
- Multiple metrics on a single chart for easy comparison

**Metrics Tracked:**
- **Distance**: Total miles run per day
- **Pace**: Minutes per mile (min/mile)
- **Heart Rate**: Average and maximum BPM
- **Cadence**: Steps per minute (SPM)

**Features:**
- Multi-axis chart for different metric scales
- Color-coded lines for easy identification
- Interactive tooltips with detailed information
- Smooth line connections showing trends

### Weekly Mileage Overview

Track your weekly running volume compared to your 4-week average.

![Weekly Mileage Chart](docs/screenshots/weekly-mileage-chart.png)

**Features:**
- Bar chart showing weekly totals
- Overlaid line graph with 4-week rolling average
- Run count indicators
- Easy comparison of current vs. average performance

---

## 🎯 Goals & Progress Tracking

Set and track goals for mileage, runs, sleep, and readiness with beautiful visual progress indicators.

![Goals & Progress](docs/screenshots/goals-and-progress.png)

### Weekly Goals
- **Weekly Mileage**: Set target miles per week
- **Weekly Runs**: Target number of runs
- **Average Sleep**: Target hours per night
- **Average Readiness**: Target readiness score

### Monthly Goals
- **Monthly Mileage**: Long-term distance goals
- **Monthly Runs**: Consistency tracking
- **Average Metrics**: Monthly averages for sleep and readiness

### Progress Indicators
- **Gradient Cards**: Beautiful visual representation of progress
- **Progress Bars**: Visual completion percentage
- **Goal Complete Badges**: Celebrate achievements! 🎉
- **Remaining Targets**: Clear indication of what's left to achieve

### Streak Tracking

Monitor your consistency with current and best streaks.

![Streaks](docs/screenshots/goals-and-progress.png)

**Tracked Streaks:**
- **Sleep Goal Streaks**: Consecutive days of 8+ hours
- **Run Streaks**: Consecutive days with runs
- **Readiness Streaks**: Consecutive days with 85+ readiness

---

## 📊 Performance Statistics

### Recovery & Performance Metrics

Monitor your recovery and track your fitness progress with comprehensive statistics.

![Recovery and Performance Metrics](docs/screenshots/recovery-metrics-performance-metrics.png)

**Recovery Metrics:**
- **Average Sleep**: Total sleep duration per night
- **Sleep Score**: Average quality score with crown indicators 👑
- **Readiness Score**: Average readiness with crown indicators 👑
- **Total Crowns**: Achievement tracking for excellent days

**Performance Metrics:**

**Tracked Metrics:**
- **Total Distance**: Cumulative miles for the period
- **Longest Run**: Maximum single-run distance
- **Total Runs**: Number of completed runs
- **Fastest Pace**: Best pace achieved
- **Maximum Heart Rate**: Peak HR during training
- **Average Distance**: Mean distance per run
- **Average Pace**: Mean pace across all runs
- **Average Heart Rate**: Mean HR during runs
- **Average Cadence**: Mean steps per minute

**Features:**
- Color-coded cards for easy scanning
- Crown indicators for exceptional performances
- Organized layout for quick reference

---

## 🎯 Training Load & Recovery Analysis

Smart analytics to optimize your training and prevent injuries.

### Acute:Chronic Workload Ratio (ACWR)

**What it measures:**
- Compares your last 7 days of training to your last 28 days
- Optimal range: 0.8 - 1.3 (safe training zone)
- High risk: > 1.5 (injury risk warning)

**Features:**
- Real-time calculation from your training data
- Risk level indicators (Low/Optimal/Moderate/High)
- Actionable recommendations based on risk level
- Visual warnings when load increases too quickly

### Recovery Score

**Combined Recovery Metric:**
- Weighted combination of Sleep Score (40%) and Readiness Score (60%)
- 0-100 scale with color-coded levels
- Classification: Excellent (85+), Good (70-84), Fair (50-69), Poor (<50)

**Features:**
- Today's recovery score display
- 7-day average trend
- Color-coded indicators for quick assessment

### 14-Day Training Calendar

Visual planning tool showing recommended training intensity for each day.

**Daily Recommendations:**
- 💪 **Green**: Perfect for hard training or long runs (Recovery 85+)
- ✓ **Blue**: Good for moderate training (Recovery 70-84)
- ⚡ **Yellow**: Easy run or cross-training recommended (Recovery 50-69)
- 🛑 **Red**: Rest day recommended (Recovery <50)

**Features:**
- Color-coded borders for quick scanning
- Recovery scores displayed for each day
- Actual run distance shown when available
- Visual guide for planning your week

---

## 📅 Yearly Mileage Planning

Plan your entire year with custom weekly mileage goals.

![Yearly Goals](docs/screenshots/yearly-mileage-goals.png)

### Custom Weekly Goals

**Features:**
- Set individual mileage goals for all 52 weeks
- Organized by quarters (Q1-Q4) with tab navigation
- Easy-to-use input grid for quick entry
- Flexible planning - rest weeks allowed (set to 0)

### Plan Summary

**Overview Cards:**
- **Starting Mileage**: Your first week's target
- **Target Mileage**: Your peak week's goal
- **Total Year**: Sum of all 52 weeks
- **Increase %**: Percentage increase from start to peak

### Quarterly Breakdown

**Quarter Analysis:**
- Q1 (Weeks 1-13): January - March
- Q2 (Weeks 14-26): April - June
- Q3 (Weeks 27-39): July - September
- Q4 (Weeks 40-52): October - December

Each quarter shows:
- Total mileage for the quarter
- Average weekly mileage
- Progress toward annual goals

### Plan Management

**Actions Available:**
- ✏️ **Edit Goals**: Modify any week's mileage
- 🗑️ **Clear Plan**: Start over from scratch
- 💾 **Auto-Save**: Plans saved to browser localStorage

---

## 🎨 Design Features

### Modern UI Elements

- **Gradient Backgrounds**: Beautiful color transitions
- **Card-Based Layout**: Clean, organized sections
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Polished user experience
- **Color-Coded Indicators**: Quick visual recognition

### Data Visualization

- **Chart.js Integration**: Professional-quality charts
- **Interactive Tooltips**: Detailed information on hover
- **Multi-Axis Charts**: Compare different metrics simultaneously
- **Crown Indicators**: Highlight exceptional performances 👑
- **Progress Bars**: Visual goal completion tracking

---

## 🔐 Security & Privacy

- **OAuth 2.0 Authentication**: Secure login via Strava and Oura
- **Session Management**: Redis-backed sessions in production
- **No Password Storage**: All authentication via OAuth providers
- **Data Privacy**: Your data stays in your session

---

## 🚀 Getting Started

1. **Visit**: [https://athletesignal-production.up.railway.app](https://athletesignal-production.up.railway.app)
2. **Connect Strava**: Authorize access to your running data
3. **Connect Oura**: Authorize access to your sleep/recovery data
4. **Explore**: Start tracking your training and recovery!

---

## 📚 Additional Resources

- [Setup Instructions](./SETUP_INSTRUCTIONS.md)
- [OAuth Configuration Guide](./OAUTH_SETUP.md)
- [Railway Deployment Guide](./RAILWAY_DEPLOYMENT.md)
- [Goal Tracking Documentation](./GOAL_TRACKING_FEATURE.md)

---

**Made with ❤️ by athletes, for athletes**

*Train smarter. Recover better. Run stronger.* 🏃‍♂️💤

