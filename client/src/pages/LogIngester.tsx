import { useState } from 'react';

function LogIngester() {
  const [logs, setLogs] = useState('');
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logs }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit logs');
      }

      setStatus('success');
      setLogs(''); // Clear the text area after successful submission
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="log-ingester">
      <h1>Log Ingester</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={logs}
          onChange={(e) => setLogs(e.target.value)}
          placeholder="Paste your error logs here..."
          rows={20}
          style={{ width: '100%', maxWidth: '800px', marginBottom: '1rem' }}
        />
        <button 
          type="submit" 
          disabled={status === 'loading' || !logs.trim()}
          style={{ padding: '0.5rem 1rem' }}
        >
          {status === 'loading' ? 'Submitting...' : 'Submit Logs'}
        </button>
      </form>
      {status === 'success' && (
        <p className="success">Logs submitted successfully!</p>
      )}
      {status === 'error' && (
        <p className="error">Failed to submit logs. Please try again.</p>
      )}
    </div>
  );
}

export default LogIngester; 