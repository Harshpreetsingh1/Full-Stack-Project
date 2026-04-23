import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import VoiceInput from '../components/VoiceInput';
import { HiPaperAirplane, HiTicket, HiTranslate, HiTag, HiCheckCircle } from 'react-icons/hi';

const ComplaintForm = () => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleVoiceTranscript = useCallback((transcript) => {
    setDescription((prev) => {
      const separator = prev.trim() ? ' ' : '';
      return prev + separator + transcript;
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(null);

    if (!description.trim() || description.trim().length < 10) {
      setError('Please provide a description of at least 10 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/complaints', { description: description.trim() });
      setSuccess(response.data.data);
      setDescription('');
    } catch (err) {
      setError(err.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="page-title">Submit a Complaint</h1>
          <p className="text-gray-500 mt-2">
            Describe your issue in English or Hindi — we'll auto-categorize and translate it
          </p>
        </div>

        {/* Success state */}
        {success && (
          <div className="glass-card p-8 mb-8 animate-slide-up border-emerald-500/20">
            <div className="text-center mb-6">
              <HiCheckCircle className="text-5xl text-emerald-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-white">Complaint Submitted!</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
                <HiTicket className="text-brand-400 text-xl flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Ticket ID</p>
                  <p className="text-white font-mono font-semibold">{success.ticketId}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
                <HiTag className="text-brand-400 text-xl flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Category</p>
                  <p className="text-white capitalize font-semibold">{success.category}</p>
                </div>
              </div>

              {success.translatedText && (
                <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
                  <HiTranslate className="text-brand-400 text-xl flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Translation</p>
                    <p className="text-gray-300 text-sm mt-1">{success.translatedText}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setSuccess(null)}
                className="btn-secondary flex-1"
                id="submit-another"
              >
                Submit Another
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-primary flex-1"
                id="go-to-dashboard"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        {!success && (
          <div className="glass-card p-8">
            {error && (
              <div className="error-message mb-6" id="complaint-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="description" className="label-text">
                  Describe your issue
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your complaint in detail (English or Hindi)..."
                  rows={6}
                  className="input-field resize-none"
                  maxLength={2000}
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    Min 10 characters required
                  </span>
                  <span className={`text-xs ${description.length > 1800 ? 'text-yellow-400' : 'text-gray-500'}`}>
                    {description.length}/2000
                  </span>
                </div>
              </div>

              {/* Voice Input */}
              <div>
                <label className="label-text">Or use voice input</label>
                <VoiceInput onTranscript={handleVoiceTranscript} disabled={loading} />
              </div>

              {/* Preview */}
              {description.trim().length >= 10 && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/5 animate-fade-in">
                  <p className="text-xs text-gray-500 font-medium mb-2">Preview</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || description.trim().length < 10}
                className="btn-primary w-full flex items-center justify-center gap-2"
                id="complaint-submit"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <HiPaperAirplane className="rotate-90" />
                    Submit Complaint
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintForm;
