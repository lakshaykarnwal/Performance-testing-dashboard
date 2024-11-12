import React, { useState, useEffect } from 'react';
import MetricsChart from './MetricsChart';
import './JMeterDashboard.css';

const JMeterDashboard = () => {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [timeRange, setTimeRange] = useState('all');
  const [rawData, setRawData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('responseTime');

  // Calculate stats
  const calculateStats = (values) => {
    if (!values || values.length === 0) return null;

    const sorted = [...values].sort((a, b) => a - b);
    const sum = sorted.reduce((acc, val) => acc + val, 0);

    return {
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: Math.round(sum / sorted.length),
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      total: sorted.length,
      failureRate: (values.filter(v => v > 1000).length / values.length * 100).toFixed(2)
    };
  };

  const filterDataByTimeRange = (data, range) => {
    if (!data || range === 'all') return data;

    const now = new Date(Math.max(...data.timestamps.map(t => new Date(t))));
    const cutoff = new Date(now);

    switch (range) {
      case 'hour':
        cutoff.setHours(now.getHours() - 1);
        break;
      case '6hours':
        cutoff.setHours(now.getHours() - 6);
        break;
      case 'day':
        cutoff.setDate(now.getDate() - 1);
        break;
      default:
        return data;
    }

    const filteredIndexes = data.timestamps.reduce((acc, time, index) => {
      if (new Date(time) >= cutoff) acc.push(index);
      return acc;
    }, []);

    return {
      timestamps: filteredIndexes.map(i => data.timestamps[i]),
      values: filteredIndexes.map(i => data.values[i])
    };
  };

  const processCSV = (csvText) => {
    setLoading(true);
    try {
      const lines = csvText.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',');

      const columns = {
        timestamp: headers.findIndex(h => h.toLowerCase().includes('timestamp')),
        responseTime: headers.findIndex(h => h.toLowerCase().includes('elapsed')),
        status: headers.findIndex(h => h.toLowerCase().includes('success')),
        label: headers.findIndex(h => h.toLowerCase().includes('label')),
        thread: headers.findIndex(h => h.toLowerCase().includes('thread'))
      };

      if (columns.timestamp === -1 || columns.responseTime === -1) {
        throw new Error('Required columns not found in CSV');
      }

      const processed = lines.slice(1).reduce((acc, line) => {
        const values = line.split(',');
        const timestamp = new Date(parseInt(values[columns.timestamp]));
        const responseTime = parseInt(values[columns.responseTime]);
        const status = values[columns.status] === 'true';
        const label = values[columns.label];

        if (!isNaN(timestamp) && !isNaN(responseTime)) {
          acc.timestamps.push(timestamp.toLocaleString());
          acc.values.push(responseTime);
          acc.statuses.push(status);
          acc.labels.push(label);
        }
        return acc;
      }, { timestamps: [], values: [], statuses: [], labels: [] });

      setRawData(processed);
      setChartData(processed);
      setStats(calculateStats(processed.values));
      setError(null);
    } catch (err) {
      setError(err.message);
      setChartData(null);
      setStats(null);
    }
    setLoading(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => processCSV(e.target.result);
      reader.onerror = () => setError('Error reading file');
      reader.readAsText(file);
    }
  };

  // Fetch the default CSV file when the component mounts
  useEffect(() => {
    fetch(process.env.REACT_APP_CSV_URL) // Path to the CSV file in the public folder
      .then(response => response.text())
      .then(data => processCSV(data))
      .catch(err => setError('Failed to load default CSV file'));
  }, []);

  useEffect(() => {
    if (rawData) {
      const filtered = filterDataByTimeRange(rawData, timeRange);
      setChartData(filtered);
      setStats(calculateStats(filtered.values));
    }
  }, [timeRange, rawData]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>JMeter Test Results</h2>
        <div className="header-controls">
          <label className="upload-button">
            Upload JMeter CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden-input"
            />
          </label>
          
          {chartData && (
            <select 
              className="time-range-select"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="hour">Last Hour</option>
              <option value="6hours">Last 6 Hours</option>
              <option value="day">Last 24 Hours</option>
            </select>
          )}
        </div>
      </div>
      
      {loading && (
        <div className="loading-indicator">
          Processing data...
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Requests</div>
            <div className="stat-value">{stats.total.toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Average Response Time</div>
            <div className="stat-value">{stats.avg}ms</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">95th Percentile</div>
            <div className="stat-value">{stats.p95}ms</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Failure Rate</div>
            <div className="stat-value">{stats.failureRate}%</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Min Response Time</div>
            <div className="stat-value">{stats.min}ms</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Max Response Time</div>
            <div className="stat-value">{stats.max}ms</div>
          </div>
        </div>
      )}

      {chartData && (
        <div className="chart-section">
          <div className="chart-container">
            <MetricsChart 
              data={chartData}
              title="Response Time (ms)"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default JMeterDashboard;
