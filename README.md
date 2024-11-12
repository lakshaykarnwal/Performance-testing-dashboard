# Performance Testing Dashboard

A real-time visualization dashboard for analyzing JMeter performance test results. This application provides insights into API performance metrics through an intuitive interface, making it easier to interpret load test data.

View the live application: [Performance Testing Dashboard](https://lakshaykarnwal.github.io/Performance-testing-dashboard/)

## Tech Stack

### Backend (API Under Test)
- **Flask**: Python web framework for the test API
- **Cryptography**: Using Fernet for message encryption/decryption
- **RESTful endpoints** for message handling

### Frontend (Dashboard)
- **React**: Frontend framework for building the user interface
- **Chart.js**: Used for data visualization
- **React-Chartjs-2**: React wrapper for Chart.js
- **CSS**: Custom styling for the dashboard components

### Testing
- **Apache JMeter**: Performance testing tool used to generate test data
- **CSV**: Data storage format for test results

## Features

### Message API
- Secure message encryption and storage
- RESTful endpoints for sending and retrieving messages:
  - POST `/send_message`: Encrypt and store messages
  - GET `/retrieve_message/<id>`: Retrieve and decrypt messages

### Dashboard
1. **Real-time Metrics Display**
   - Total number of requests
   - Average response time
   - 95th percentile response time
   - Failure rate percentage
   - Minimum response time
   - Maximum response time

2. **Interactive Data Visualization**
   - Line chart showing response time trends
   - Timestamp-based X-axis
   - Clear metric visualization

3. **File Management**
   - CSV file upload functionality
   - Automatic data processing and visualization
   - Error handling for invalid files

## How It Works

1. **Data Collection**
   - The Flask API processes encrypted messages
   - JMeter runs performance tests against the API
   - Test results are exported to CSV format

2. **Data Processing**
   - Dashboard reads and parses CSV files
   - Calculates key performance metrics
   - Processes timestamps for visualization

3. **Data Visualization**
   - Metrics are displayed in an easy-to-read grid
   - Response times are plotted on an interactive line chart
   - Real-time updates as new data is loaded

## Getting Started

### Prerequisites
- Node.js and npm
- Python 3.x
- Apache JMeter

### Running the API
```bash
# Install dependencies
pip install flask cryptography

# Run the Flask application
python app.py
```

### Running the Dashboard
```bash
# Install dependencies
npm install

# Start the development server
npm start
```

### Running Performance Tests
1. Open Apache JMeter
2. Configure test plan for the Flask API endpoints
3. Run the test
4. Export results as CSV
5. Upload CSV to the dashboard

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
