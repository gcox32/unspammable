import LockIcon from '@/src/components/icons/LockIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '@/src/styles/telehealth.css';

// Mock data structure aligned with Inception's services
const MOCK_TELEHEALTH_DATA = {
  hormoneTherapy: {
    lastUpdated: '2024-03-05',
    metrics: {
      testosterone: { value: 750, unit: 'ng/dL', trend: 'stable' },
      estradiol: { value: 25, unit: 'pg/mL', trend: 'increasing' },
      thyroidStimulating: { value: 2.5, unit: 'mIU/L', trend: 'stable' }
    },
    history: [
      { date: '2024-03-01', testosterone: 720, estradiol: 22, thyroidStimulating: 2.3 },
      { date: '2024-03-02', testosterone: 735, estradiol: 23, thyroidStimulating: 2.4 },
      { date: '2024-03-03', testosterone: 745, estradiol: 24, thyroidStimulating: 2.4 },
      { date: '2024-03-04', testosterone: 748, estradiol: 24, thyroidStimulating: 2.5 },
      { date: '2024-03-05', testosterone: 750, estradiol: 25, thyroidStimulating: 2.5 }
    ]
  },
  weightManagement: {
    currentPhase: 'Active Weight Loss',
    metrics: {
      startingWeight: 200,
      currentWeight: 185,
      targetWeight: 175,
      weeklyLoss: 1.5
    },
    medications: [
      { name: 'Semaglutide', dosage: '0.5mg', frequency: 'weekly' }
    ],
    history: [
      { date: '2024-03-01', weight: 188, bodyFat: 24 },
      { date: '2024-03-02', weight: 187, bodyFat: 23.8 },
      { date: '2024-03-03', weight: 186, bodyFat: 23.5 },
      { date: '2024-03-04', weight: 185.5, bodyFat: 23.3 },
      { date: '2024-03-05', weight: 185, bodyFat: 23.1 }
    ]
  },
  peptideTherapy: {
    currentProtocol: 'Performance & Recovery',
    activePeptides: [
      { name: 'BPC-157', dosage: '250mcg', frequency: '2x daily' },
      { name: 'TB-500', dosage: '2mg', frequency: '2x weekly' }
    ],
    metrics: {
      recoveryScore: 85,
      inflammationMarkers: 'Low',
      sleepQuality: 'Improved'
    }
  },
  nextAppointment: {
    date: '2024-03-15',
    provider: 'Dr. Smith',
    type: 'Protocol Review'
  }
};

export default function TelehealthMetrics({ isLocked }: { isLocked: boolean }) {
  if (isLocked) {
    return (
      <div className="telehealth-section">
        <div className="telehealth-locked">
          <div className="lock-message">
            <h3>Inception Telehealth</h3>
            <LockIcon className="lock-icon" isLocked={true} />
            <p>Enable telehealth tracking in your profile settings to access health monitoring features.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="telehealth-section">
      <div className="telehealth-header">
        <h2>Inception Telehealth</h2>
        <div className="next-appointment">
          Next Appointment: {MOCK_TELEHEALTH_DATA.nextAppointment.date} - {MOCK_TELEHEALTH_DATA.nextAppointment.type}
        </div>
      </div>

      <div className="telehealth-dashboard">
        {/* Hormone Therapy Section */}
        <section className="therapy-section hormone-therapy">
          <h3>Hormone Therapy</h3>
          <div className="hormone-metrics">
            <div className="hormone-card">
              <h4>Testosterone</h4>
              <div className="hormone-value">
                <span className="value">{MOCK_TELEHEALTH_DATA.hormoneTherapy.metrics.testosterone.value}</span>
                <span className="unit">{MOCK_TELEHEALTH_DATA.hormoneTherapy.metrics.testosterone.unit}</span>
              </div>
              <span className={`trend ${MOCK_TELEHEALTH_DATA.hormoneTherapy.metrics.testosterone.trend}`}>
                {MOCK_TELEHEALTH_DATA.hormoneTherapy.metrics.testosterone.trend}
              </span>
            </div>
            <div className="hormone-chart">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={MOCK_TELEHEALTH_DATA.hormoneTherapy.history}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="testosterone" stroke="#4F46E5" name="Testosterone" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Weight Management Section */}
        <section className="therapy-section weight-management">
          <h3>Weight Management</h3>
          <div className="weight-progress">
            <div className="progress-metrics">
              <div className="metric">
                <label>Starting Weight</label>
                <span>{MOCK_TELEHEALTH_DATA.weightManagement.metrics.startingWeight} lbs</span>
              </div>
              <div className="metric">
                <label>Current Weight</label>
                <span>{MOCK_TELEHEALTH_DATA.weightManagement.metrics.currentWeight} lbs</span>
              </div>
              <div className="metric">
                <label>Target Weight</label>
                <span>{MOCK_TELEHEALTH_DATA.weightManagement.metrics.targetWeight} lbs</span>
              </div>
            </div>
            <div className="weight-chart">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={MOCK_TELEHEALTH_DATA.weightManagement.history}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="weight" stroke="#10B981" name="Weight" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="medications">
              <h4>Current Medications</h4>
              {MOCK_TELEHEALTH_DATA.weightManagement.medications.map((med, index) => (
                <div key={index} className="medication">
                  <span className="med-name">{med.name}</span>
                  <span className="med-dosage">{med.dosage}</span>
                  <span className="med-frequency">{med.frequency}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Peptide Therapy Section */}
        <section className="therapy-section peptide-therapy">
          <h3>Peptide Therapy</h3>
          <div className="protocol-info">
            <div className="current-protocol">
              <h4>Current Protocol: {MOCK_TELEHEALTH_DATA.peptideTherapy.currentProtocol}</h4>
              <div className="peptides-grid">
                {MOCK_TELEHEALTH_DATA.peptideTherapy.activePeptides.map((peptide, index) => (
                  <div key={index} className="peptide-card">
                    <h5>{peptide.name}</h5>
                    <div className="peptide-details">
                      <span className="dosage">{peptide.dosage}</span>
                      <span className="frequency">{peptide.frequency}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="therapy-metrics">
              <div className="metric-card">
                <label>Recovery Score</label>
                <span className="score">{MOCK_TELEHEALTH_DATA.peptideTherapy.metrics.recoveryScore}</span>
              </div>
              <div className="metric-card">
                <label>Inflammation</label>
                <span>{MOCK_TELEHEALTH_DATA.peptideTherapy.metrics.inflammationMarkers}</span>
              </div>
              <div className="metric-card">
                <label>Sleep Quality</label>
                <span>{MOCK_TELEHEALTH_DATA.peptideTherapy.metrics.sleepQuality}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 