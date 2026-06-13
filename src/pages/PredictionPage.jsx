import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { predictStressLevel } from '../services/api';

export default function PredictionPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const [formData, setFormData] = useState({
    Age: '18-22', Gender: 'Male', University: '', Department: '', 
    Academic_Year: '3rd Year', CGPA: '3.50 - 4.00', Scholarship: 'No',
    Q1: null, Q2: null, Q3: null, Q4: null, Q5: null, Q6: null, Q7: null, Q8: null, Q9: null, Q10: null,
    AQ1: null, AQ2: null, AQ3: null, AQ4: null, AQ5: null, AQ6: null, AQ7: null,
    DQ1: null, DQ2: null, DQ3: null, DQ4: null, DQ5: null, DQ6: null, DQ7: null, DQ8: null, DQ9: null,
    text: ''
  });

  useEffect(() => {
    const progress = (currentStep / 5) * 100;
    const timer = setTimeout(() => setAnimatedProgress(progress), 100);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const stressQuestions = [
    { id: 'Q1', text: "How often have you felt upset due to something that happened in your academic affairs?" },
    { id: 'Q2', text: "How often you felt as if you were unable to control important things in your academic affairs?" },
    { id: 'Q3', text: "How often you felt nervous and stressed because of academic pressure?" },
    { id: 'Q4', text: "How often you felt as if you could not cope with all the mandatory academic activities?" },
    { id: 'Q5', text: "How often you felt confident about your ability to handle your academic problems?" },
    { id: 'Q6', text: "How often you felt as if things in your academic life is going your way?" },
    { id: 'Q7', text: "How often are you able to control irritations in your academic affairs?" },
    { id: 'Q8', text: "How often you felt as if your academic performance was on top?" },
    { id: 'Q9', text: "How often you got angered due to bad performance or low grades that is beyond your control?" },
    { id: 'Q10', text: "How often you felt as if academic difficulties are piling up so high that you could not overcome them?" }
  ];

  const anxietyQuestions = [
    { id: 'AQ1', text: "How often you felt nervous, anxious or on edge due to academic pressure?" },
    { id: 'AQ2', text: "How often have you been unable to stop worrying about your academic affairs?" },
    { id: 'AQ3', text: "How often have you had trouble relaxing due to academic pressure?" },
    { id: 'AQ4', text: "How often have you been easily annoyed or irritated because of academic pressure?" },
    { id: 'AQ5', text: "How often have you worried too much about academic affairs?" },
    { id: 'AQ6', text: "How often have you been so restless due to academic pressure that it is hard to sit still?" },
    { id: 'AQ7', text: "How often have you felt afraid, as if something awful might happen?" }
  ];

  const depressionQuestions = [
    { id: 'DQ1', text: "How often have you had little interest or pleasure in doing things?" },
    { id: 'DQ2', text: "How often have you been feeling down, depressed or hopeless?" },
    { id: 'DQ3', text: "How often have you had trouble falling or staying asleep, or sleeping too much?" },
    { id: 'DQ4', text: "How often have you been feeling tired or having little energy?" },
    { id: 'DQ5', text: "How often have you had poor appetite or overeating?" },
    { id: 'DQ6', text: "How often have you been feeling bad about yourself - or that you are a failure?" },
    { id: 'DQ7', text: "How often have you been having trouble concentrating on things?" },
    { id: 'DQ8', text: "How often have you moved or spoke too slowly, or been moving a lot more than usual?" },
    { id: 'DQ9', text: "How often have you had thoughts that you would be better off dead, or of hurting yourself?" }
  ];

  const scaleOptions = [
    { value: 0, label: "0 - Never" },
    { value: 1, label: "1 - Rarely" },
    { value: 2, label: "2 - Sometimes" },
    { value: 3, label: "3 - Often" },
    { value: 4, label: "4 - Always" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    const isQuestion = name.startsWith('Q') || name.startsWith('AQ') || name.startsWith('DQ');
    const parsedValue = isQuestion ? parseInt(value) : value;
    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const validateStep = () => {
    if (currentStep === 1) {
      if (!formData.University.trim()) { toast.error('University is required!'); return false; }
      if (!formData.Department.trim()) { toast.error('Department is required!'); return false; }
    } else if (currentStep === 2) {
      for (let i = 1; i <= 10; i++) if (formData[`Q${i}`] === null) { toast.error(`Please answer Stress Q${i}!`); return false; }
    } else if (currentStep === 3) {
      for (let i = 1; i <= 7; i++) if (formData[`AQ${i}`] === null) { toast.error(`Please answer Anxiety Q${i}!`); return false; }
    } else if (currentStep === 4) {
      for (let i = 1; i <= 9; i++) if (formData[`DQ${i}`] === null) { toast.error(`Please answer Depression Q${i}!`); return false; }
    } else if (currentStep === 5) {
      if (!formData.text.trim()) { toast.error('Please share your feelings before submitting!'); return false; }
      if (formData.text.trim().length < 20) { toast.error('Please write at least 20 characters!'); return false; }
    }
    return true;
  };

  const nextStep = () => { 
    if (validateStep()) {
      setCurrentStep((prev) => prev + 1); 
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
    }
  };

  const prevStep = () => { 
    setCurrentStep((prev) => prev - 1); 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setLoading(true);
    const toastId = toast.loading('Analyzing your responses...');

    try {
      const response = await predictStressLevel(formData);
      toast.success('Analysis Complete!', { id: toastId });
      navigate('/result', { 
        state: { 
          result: response,
          formData: formData 
        } 
      });
    } catch (err) {
      console.error('Error:', err);
      toast.error('Connection failed! Please try again.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const renderQuestions = (questionsArray) => (
    <div className="space-y-4">
      {questionsArray.map((q, index) => (
        <div key={q.id} className="bg-white p-5 sm:p-6 rounded-2xl border border-[#D2B48C]/30 shadow-sm hover:shadow-md transition-all duration-300">
          <p className="font-medium text-[#4A3728] mb-4 flex items-start gap-3">
            <span className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-[#8B7355] to-[#6B8FAD] text-white rounded-lg flex items-center justify-center text-xs font-semibold shadow-sm">
              {index + 1}
            </span>
            <span className="pt-0.5 text-sm sm:text-[15px] leading-relaxed">{q.text}</span>
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-2.5 ml-10">
            {scaleOptions.map((opt) => (
              <label 
                key={opt.value} 
                className={`flex items-center gap-1.5 cursor-pointer px-3.5 py-2 rounded-lg transition-all duration-200 border text-xs sm:text-sm ${
                  formData[q.id] === opt.value 
                    ? 'bg-gradient-to-r from-[#8B7355] to-[#6B8FAD] border-transparent shadow-md scale-105 text-white' 
                    : 'bg-[#F5F0E8] border-[#D2B48C]/30 text-[#4A3728] hover:bg-[#EDE4D3] hover:border-[#8B7355]/40'
                }`}
              >
                <input 
                  type="radio" 
                  name={q.id} 
                  value={opt.value} 
                  checked={formData[q.id] === opt.value} 
                  onChange={handleChange} 
                  className="sr-only" 
                />
                <span className="font-semibold">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const StepIcon = ({ step, icon, label }) => {
    const isActive = currentStep === step;
    const isCompleted = currentStep > step;
    
    return (
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
          isCompleted ? 'bg-gradient-to-br from-[#8B7355] to-[#6B8FAD] text-white shadow-lg' :
          isActive ? 'bg-white text-[#8B7355] shadow-lg ring-2 ring-[#8B7355] scale-110' :
          'bg-[#E8DFD3] text-[#A09080]'
        }`}>
          {isCompleted ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <span>{icon}</span>
          )}
        </div>
        <span className={`text-[11px] sm:text-xs mt-2 font-semibold hidden sm:block ${
          isCompleted ? 'text-[#8B7355]' : isActive ? 'text-[#6B8FAD] font-bold' : 'text-[#A09080]'
        }`}>{label}</span>
      </div>
    );
  };

  // SVG Icons
  const UserIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const BrainIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );

  const HeartIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );

  const ChatIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );

  const PenIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  );

  return (
    <div className="min-h-screen relative py-8 sm:py-12 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(135deg, #F5F0E8 0%, #E8DFD3 30%, #D6E4F0 70%, #C4D9E8 100%)' }}>
      {/* Decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#D2B48C]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#6B8FAD]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#F5DEB3]/5 to-[#87CEEB]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative">
        {/* Back link */}
        <a href="/" className="group inline-flex items-center gap-2 text-[#6B8FAD] hover:text-[#8B7355] font-medium mb-6 sm:mb-8 transition bg-white/70 backdrop-blur-sm px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md text-sm border border-[#D2B48C]/30">
          <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </a>
        
        {/* Main card */}
        <div className="bg-white/85 backdrop-blur-md p-6 sm:p-8 md:p-10 rounded-3xl shadow-2xl border border-[#D2B48C]/20" 
             style={{ boxShadow: '0 25px 50px -12px rgba(139, 115, 85, 0.15), 0 0 0 1px rgba(210, 180, 140, 0.1)' }}>
          
          {/* Header with steps */}
          {currentStep <= 5 && (
            <div className="mb-8 sm:mb-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: '#4A3728' }}>
                  Mental Health Assessment
                </h2>
                <p className="text-[#8B7355] text-sm sm:text-base">Answer thoughtfully for accurate results</p>
              </div>

              {/* Step indicators */}
              <div className="flex items-center justify-between mb-4 px-2">
                {[
                  { step: 1, icon: '1', label: 'Profile' },
                  { step: 2, icon: '2', label: 'Stress' },
                  { step: 3, icon: '3', label: 'Anxiety' },
                  { step: 4, icon: '4', label: 'Depression' },
                  { step: 5, icon: '5', label: 'Express' }
                ].map((item) => (
                  <StepIcon key={item.step} {...item} />
                ))}
              </div>

              {/* Progress bar */}
              <div className="relative w-full h-2 bg-[#E8DFD3] rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full rounded-full transition-all duration-700 ease-out"
                  style={{ 
                    width: `${animatedProgress}%`,
                    background: 'linear-gradient(90deg, #8B7355 0%, #A0845C 40%, #6B8FAD 100%)'
                  }}
                />
              </div>
              <p className="text-right text-xs font-semibold text-[#A09080] mt-2">
                Step {currentStep} of 5
              </p>
            </div>
          )}

          {/* STEP 1: Personal Information */}
          {currentStep === 1 && (
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 bg-gradient-to-br from-[#8B7355] to-[#A0845C] rounded-xl flex items-center justify-center text-white shadow-md">
                  <UserIcon />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#4A3728]">Personal Information</h3>
                  <p className="text-sm text-[#8B7355]">Fill in your academic details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-8">
                {['Age', 'Gender', 'University', 'Department', 'Academic_Year', 'CGPA', 'Scholarship'].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-semibold text-[#4A3728] mb-2">{field.replace('_', ' ')}</label>
                    {field === 'Gender' || field === 'Scholarship' ? (
                      <select 
                        name={field} 
                        value={formData[field]} 
                        onChange={handleChange} 
                        className="w-full border-2 border-[#D2B48C]/40 rounded-xl p-3 outline-none focus:border-[#8B7355] focus:ring-4 focus:ring-[#8B7355]/10 transition-all bg-white text-[#4A3728] text-sm"
                      >
                        {field === 'Gender' ? 
                          <><option value="Male">Male</option><option value="Female">Female</option></> : 
                          <><option value="Yes">Yes</option><option value="No">No</option></>
                        }
                      </select>
                    ) : (
                      <input 
                        type="text" 
                        name={field} 
                        value={formData[field]} 
                        onChange={handleChange} 
                        placeholder={`Enter ${field.replace('_', ' ')}...`}
                        className="w-full border-2 border-[#D2B48C]/40 rounded-xl p-3 outline-none focus:border-[#8B7355] focus:ring-4 focus:ring-[#8B7355]/10 transition-all bg-white text-[#4A3728] text-sm placeholder-[#C4B5A5]" 
                      />
                    )}
                  </div>
                ))}
              </div>
              
              <button 
                onClick={nextStep} 
                className="w-full py-3.5 rounded-2xl font-bold text-white text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-95"
                style={{ background: 'linear-gradient(135deg, #8B7355 0%, #6B8FAD 100%)' }}
              >
                Continue
              </button>
            </div>
          )}

          {/* STEP 2: Stress */}
          {currentStep === 2 && (
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 bg-gradient-to-br from-[#8B7355] to-[#A0845C] rounded-xl flex items-center justify-center text-white shadow-md">
                  <BrainIcon />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#4A3728]">Stress Assessment</h3>
                  <p className="text-sm text-[#8B7355]">How often have you experienced the following?</p>
                </div>
              </div>
              {renderQuestions(stressQuestions)}
              <div className="flex gap-4 mt-8">
                <button onClick={prevStep} className="w-1/3 py-3.5 rounded-2xl font-bold text-[#8B7355] bg-[#F5F0E8] border border-[#D2B48C]/30 hover:bg-[#EDE4D3] transition-all shadow-sm text-sm">
                  Back
                </button>
                <button onClick={nextStep} className="w-2/3 py-3.5 rounded-2xl font-bold text-white text-sm transition-all duration-300 shadow-lg hover:shadow-xl"
                  style={{ background: 'linear-gradient(135deg, #8B7355 0%, #6B8FAD 100%)' }}>
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Anxiety */}
          {currentStep === 3 && (
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 bg-gradient-to-br from-[#8B7355] to-[#A0845C] rounded-xl flex items-center justify-center text-white shadow-md">
                  <HeartIcon />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#4A3728]">Anxiety Assessment</h3>
                  <p className="text-sm text-[#8B7355]">How often have you experienced the following?</p>
                </div>
              </div>
              {renderQuestions(anxietyQuestions)}
              <div className="flex gap-4 mt-8">
                <button onClick={prevStep} className="w-1/3 py-3.5 rounded-2xl font-bold text-[#8B7355] bg-[#F5F0E8] border border-[#D2B48C]/30 hover:bg-[#EDE4D3] transition-all shadow-sm text-sm">
                  Back
                </button>
                <button onClick={nextStep} className="w-2/3 py-3.5 rounded-2xl font-bold text-white text-sm transition-all duration-300 shadow-lg hover:shadow-xl"
                  style={{ background: 'linear-gradient(135deg, #8B7355 0%, #6B8FAD 100%)' }}>
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Depression */}
          {currentStep === 4 && (
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 bg-gradient-to-br from-[#8B7355] to-[#A0845C] rounded-xl flex items-center justify-center text-white shadow-md">
                  <ChatIcon />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#4A3728]">Depression Assessment</h3>
                  <p className="text-sm text-[#8B7355]">How often have you experienced the following?</p>
                </div>
              </div>
              {renderQuestions(depressionQuestions)}
              <div className="flex gap-4 mt-8">
                <button onClick={prevStep} className="w-1/3 py-3.5 rounded-2xl font-bold text-[#8B7355] bg-[#F5F0E8] border border-[#D2B48C]/30 hover:bg-[#EDE4D3] transition-all shadow-sm text-sm">
                  Back
                </button>
                <button onClick={nextStep} className="w-2/3 py-3.5 rounded-2xl font-bold text-white text-sm transition-all duration-300 shadow-lg hover:shadow-xl"
                  style={{ background: 'linear-gradient(135deg, #8B7355 0%, #6B8FAD 100%)' }}>
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Text Expression */}
          {currentStep === 5 && (
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 bg-gradient-to-br from-[#8B7355] to-[#A0845C] rounded-xl flex items-center justify-center text-white shadow-md">
                  <PenIcon />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#4A3728]">Express Your Feelings</h3>
                  <p className="text-sm text-[#C0392B] font-medium">Required - Minimum 20 characters</p>
                </div>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl border-2 border-[#D2B48C]/30 shadow-inner mb-8" 
                   style={{ background: 'linear-gradient(135deg, #F5F0E8 0%, #E8DFD3 50%, #D6E4F0 100%)' }}>
                <div className="text-center mb-5">
                  <h4 className="text-lg font-bold text-[#4A3728]">Share Your Story</h4>
                  <p className="text-[#8B7355] mt-1 text-sm">Describe how you've been feeling in your own words.</p>
                </div>
                
                <textarea
                  name="text"
                  value={formData.text}
                  onChange={handleChange}
                  placeholder="I feel overwhelmed with assignments, deadlines, exams, and academic pressure. I am exhausted and stressed every day..."
                  rows="5"
                  className="w-full border-2 border-[#D2B48C]/40 rounded-2xl p-4 sm:p-5 outline-none focus:border-[#8B7355] focus:ring-4 focus:ring-[#8B7355]/10 transition-all resize-none text-[#4A3728] placeholder-[#C4B5A5] bg-white/80 backdrop-blur-sm text-sm sm:text-base"
                />
                
                <div className="flex items-center justify-between mt-3 text-xs sm:text-sm">
                  <p className="text-[#8B7355]">Minimum 20 characters</p>
                  <p className={`font-bold ${formData.text.length >= 20 ? 'text-[#6B8FAD]' : 'text-[#C0392B]'}`}>
                    {formData.text.length}/20
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={prevStep} className="w-1/3 py-3.5 rounded-2xl font-bold text-[#8B7355] bg-[#F5F0E8] border border-[#D2B48C]/30 hover:bg-[#EDE4D3] transition-all shadow-sm text-sm">
                  Back
                </button>
                <button 
                  onClick={handleSubmit} 
                  disabled={loading} 
                  className={`w-2/3 py-3.5 rounded-2xl font-bold text-white text-sm transition-all duration-300 shadow-lg ${
                    loading ? 'bg-[#B8A898] cursor-not-allowed' : 'hover:shadow-xl hover:scale-[1.01] active:scale-95'
                  }`}
                  style={!loading ? { background: 'linear-gradient(135deg, #8B7355 0%, #6B8FAD 100%)' } : {}}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    'Submit & See Results'
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}