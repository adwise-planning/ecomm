import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Lock, Mail } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSendOtp = (e) => {
    e.preventDefault();
    if(email) setStep(2);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, otp);
    setLoading(false);
    if (success) navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 border border-slate-200 dark:border-slate-700">
        <div className="flex justify-center mb-8 text-primary">
          <BarChart3 size={48} />
        </div>
        <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-2">
          Welcome to EcomEZ
        </h2>
        <p className="text-center text-slate-500 mb-8">Sign in to access your analytics</p>

        <form onSubmit={step === 1 ? handleSendOtp : handleLogin} className="space-y-4">
          {step === 1 ? (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Enter OTP (Use 1234)</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                  placeholder="1234"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <p className="text-xs text-right text-primary cursor-pointer mt-2 hover:underline" onClick={() => setStep(1)}>Change Email</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-70"
          >
            {loading ? 'Verifying...' : (step === 1 ? 'Send OTP' : 'Login')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;