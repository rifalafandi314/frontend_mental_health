import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, formData } = location.state || {};
  const [animateIn, setAnimateIn] = useState(false);
  const [chartAnimate, setChartAnimate] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
  const reportRef = useRef(null);

  useEffect(() => {
    if (!result) {
      navigate('/predict');
      return;
    }
    setTimeout(() => setAnimateIn(true), 100);
    setTimeout(() => setChartAnimate(true), 600);
  }, [result, navigate]);

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    
    setIsGeneratingPdf(true);
    
    try {
      const element = reportRef.current;
      
      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: 'mental-health-report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2.5,
          useCORS: true,
          letterRendering: true,
          logging: false,
          backgroundColor: '#FFFFFF'
        },
        jsPDF: { 
          unit: 'in', 
          format: 'a4', 
          orientation: 'portrait' 
        }
      };
      
      await html2pdf().set(opt).from(element).save();
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Gagal menghasilkan PDF. Silakan coba lagi.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (!result) return null;

  // ============ DYNAMIC HELPERS ============
  
  const getSeverityStyle = (prediction) => {
    if (!prediction) return { bg: 'bg-[#F5F0E8] border-[#D2B48C]/40', text: 'text-[#8B7355]', dot: 'bg-[#8B7355]' };
    const text = prediction.toLowerCase();
    if (text.includes('high') || text.includes('severe')) 
      return { bg: 'bg-[#FDF2F2] border-[#E8B4B4]/60', text: 'text-[#8B3A3A]', dot: 'bg-[#C0392B]' };
    if (text.includes('moderate')) 
      return { bg: 'bg-[#FDF8F0] border-[#D2B48C]/60', text: 'text-[#8B6914]', dot: 'bg-[#D4A017]' };
    if (text.includes('mild') || text.includes('minimal')) 
      return { bg: 'bg-[#F0F4F8] border-[#B8CFE0]/60', text: 'text-[#3A6B8B]', dot: 'bg-[#6B8FAD]' };
    if (text.includes('no') || text.includes('low')) 
      return { bg: 'bg-[#F0F5F0] border-[#B8D4B8]/60', text: 'text-[#3A6B3A]', dot: 'bg-[#6B8F6B]' };
    return { bg: 'bg-[#F5F0E8] border-[#D2B48C]/40', text: 'text-[#8B7355]', dot: 'bg-[#8B7355]' };
  };

  const getAssessmentStyle = (assessment) => {
    if (!assessment) return { bg: 'from-[#8B7355] to-[#6B8FAD]', text: 'Severity Level' };
    const text = assessment.toLowerCase();
    if (text.includes('high') || text.includes('severe')) 
      return { bg: 'from-[#8B3A3A] to-[#A05252]', text: 'High Risk' };
    if (text.includes('moderate')) 
      return { bg: 'from-[#D4A017] to-[#B8860B]', text: 'Moderate Risk' };
    if (text.includes('low') || text.includes('minimal')) 
      return { bg: 'from-[#6B8FAD] to-[#4A7A9B]', text: 'Low Risk' };
    return { bg: 'from-[#6B8F6B] to-[#4A7A4A]', text: 'Normal' };
  };

  const getEmotionColor = (emotion) => {
    if (!emotion) return '#8B7355';
    const colorMap = {
      'stress': '#D4A017', 'anxiety': '#C8961E', 'depression': '#8B6914',
      'normal': '#6B8F6B', 'neutral': '#8B7355', 'happy': '#6B8FAD',
      'sadness': '#4A7A9B', 'anger': '#C0392B', 'fear': '#8B3A3A',
      'surprise': '#5B9B8B', 'disgust': '#7B8B3A', 'joy': '#B8860B'
    };
    return colorMap[emotion.toLowerCase()] || '#8B7355';
  };

  // ============ EXTRACT REAL DATA ============
  
  const questionnaireData = result.questionnaire || {};
  const textData = result.text || {};
  const finalAssessment = result.final_assessment || '';
  const recommendation = result.recommendation || '';

  const questionnaireCategories = Object.keys(questionnaireData).filter(
    key => questionnaireData[key] && questionnaireData[key].prediction
  );

  const nlpPrediction = textData.prediction || '';
  const nlpConfidence = textData.confidence ? Math.round(textData.confidence * 100) : 0;
  const nlpTopPredictions = textData.top2 || [];

  // ============ CHART COMPONENTS ============

  const DonutChart = ({ percentage, color, emotion, size = 140 }) => {
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (chartAnimate ? percentage / 100 : 0) * circumference;

    return (
      <div className="flex flex-col items-center">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="transform -rotate-90">
            <circle 
              cx={size / 2} 
              cy={size / 2} 
              r={radius} 
              stroke="#E8DFD3" 
              strokeWidth={strokeWidth} 
              fill="none" 
            />
            <circle 
              cx={size / 2} 
              cy={size / 2} 
              r={radius} 
              stroke={color} 
              strokeWidth={strokeWidth} 
              fill="none" 
              strokeLinecap="round"
              strokeDasharray={circumference} 
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold" style={{ color }}>{chartAnimate ? percentage : 0}</span>
            <span className="text-xs text-[#A09080] mt-1 font-medium">confidence</span>
          </div>
        </div>
        {emotion && (
          <div className="flex items-center gap-2 mt-3">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></div>
            <span className="text-sm font-semibold text-[#4A3728]">{emotion}</span>
          </div>
        )}
      </div>
    );
  };

  const TopPredictionsChart = ({ predictions }) => {
    if (!predictions || predictions.length === 0) return null;
    
    const maxScore = Math.max(...predictions.map(p => p.score), 0.0001);

    return (
      <div className="space-y-4">
        {predictions.map((item, idx) => {
          const scorePercent = (item.score * 100).toFixed(1);
          const barWidth = chartAnimate ? (item.score / maxScore) * 100 : 0;
          
          return (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getEmotionColor(item.label) }}></div>
                  <span className="text-sm font-semibold text-[#4A3728]">{item.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    idx === 0 ? 'bg-[#D6E4F0] text-[#3A6B8B]' : 'bg-[#E8DFD3] text-[#8B7355]'
                  }`}>
                    #{idx + 1}
                  </span>
                </div>
                <span className="text-sm font-bold text-[#4A3728]">{scorePercent}%</span>
              </div>
              <div className="w-full bg-[#E8DFD3] rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${barWidth}%`,
                    backgroundColor: getEmotionColor(item.label)
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // ============ SVG ICONS ============
  
  const IconChart = () => (
    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );

  const IconBrain = () => (
    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );

  const IconTarget = () => (
    <svg className="w-5 h-5 text-[#8B7355]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10a6 6 0 110-12 6 6 0 010 12z" />
    </svg>
  );

  const IconLightbulb = () => (
    <svg className="w-5 h-5 text-[#D4A017]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );

  const IconDocument = () => (
    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  const IconCheck = () => (
    <svg className="w-5 h-5 text-[#6B8F6B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );

  const IconArrow = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );

  const IconShield = () => (
    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );

  const IconDownload = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );

  const IconActivity = () => (
    <svg className="w-5 h-5 text-[#8B7355]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8" 
         style={{ background: 'linear-gradient(135deg, #F5F0E8 0%, #E8DFD3 50%, #DDD0C0 100%)' }}>
      
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 sm:mb-8">
          <button 
            onClick={() => navigate('/predict')} 
            className="group inline-flex items-center gap-2 text-[#8B7355] hover:text-[#4A3728] font-medium transition-all duration-300 bg-white/80 backdrop-blur-sm px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md text-sm border border-[#D2B48C]/40"
          >
            <span className="transform group-hover:-translate-x-1 transition"><IconArrow /></span>
            Back to Assessment
          </button>

          <button
            onClick={downloadPDF}
            disabled={isGeneratingPdf}
            className={`inline-flex items-center gap-2 font-semibold py-2.5 px-6 rounded-xl text-white text-sm transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 ${
              isGeneratingPdf ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'
            }`}
            style={{ background: 'linear-gradient(135deg, #8B7355, #6B8FAD)' }}
          >
            <IconDownload />
            {isGeneratingPdf ? 'Generating PDF...' : 'Download PDF Report'}
          </button>
        </div>

        {/* PDF Report Area */}
        <div ref={reportRef}>
          <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-700 ${
            animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            
            {/* Header with Brown Gradient */}
            <div className="relative px-6 sm:px-8 md:px-12 py-8 sm:py-10 text-center"
                 style={{ background: 'linear-gradient(135deg, #8B7355 0%, #6B8FAD 100%)' }}>
              <div className="absolute inset-0 bg-black opacity-5"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm mb-5 shadow-lg">
                  <IconChart />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
                  Mental Health Assessment Report
                </h1>
                <p className="text-white/80 text-sm sm:text-base">
                  AI-Powered Analysis Based on Your Responses
                </p>
                <div className="mt-4 text-xs text-white/60">
                  Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 md:p-10">
              
              {/* Section 1: Questionnaire Results */}
              {questionnaireCategories.length > 0 && (
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-5 pb-2 border-b-2 border-[#E8DFD3]">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                         style={{ background: 'linear-gradient(135deg, #8B7355, #6B8FAD)' }}>
                      <IconDocument />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[#4A3728]">Questionnaire Results</h2>
                      <p className="text-sm text-[#8B7355]">Multi-dimensional assessment analysis</p>
                    </div>
                  </div>
                  
                  <div className={`grid gap-5 ${
                    questionnaireCategories.length === 1 ? 'grid-cols-1' :
                    questionnaireCategories.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
                    'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  }`}>
                    {questionnaireCategories.map((category) => {
                      const data = questionnaireData[category];
                      const prediction = data.prediction || 'Unknown';
                      const style = getSeverityStyle(prediction);
                      
                      return (
                        <div key={category} className={`rounded-xl border-2 overflow-hidden transition-all duration-300 hover:shadow-lg ${style.bg}`}>
                          <div className="p-5">
                            <div className="flex items-start justify-between mb-3">
                              <div className={`w-3 h-3 rounded-full ${style.dot}`}></div>
                              <span className="text-xs font-medium text-[#A09080] uppercase tracking-wider">
                                Score
                              </span>
                            </div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-[#A09080] mb-1">
                              {category.replace(/_/g, ' ')}
                            </p>
                            <p className={`text-lg font-bold ${style.text}`}>
                              {prediction}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Section 2: Final Assessment */}
              {finalAssessment && (
                <div className="mb-10">
                  <div className={`rounded-2xl bg-gradient-to-r ${getAssessmentStyle(finalAssessment).bg} p-6 sm:p-8 text-white shadow-xl`}>
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <IconShield />
                      <p className="text-xs font-semibold uppercase tracking-wider opacity-90">
                        {getAssessmentStyle(finalAssessment).text}
                      </p>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-center mb-4">
                      {finalAssessment}
                    </h3>
                    
                    {recommendation && (
                      <div className="mt-5 p-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <IconLightbulb />
                          <p className="text-sm font-semibold">Professional Recommendation</p>
                        </div>
                        <p className="text-sm sm:text-base leading-relaxed text-center">
                          {recommendation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Section 3: Text Emotion Analysis */}
              {(nlpPrediction || nlpTopPredictions.length > 0) && (
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-5 pb-2 border-b-2 border-[#E8DFD3]">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                         style={{ background: 'linear-gradient(135deg, #8B7355, #6B8FAD)' }}>
                      <IconBrain />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[#4A3728]">Text Emotion Analysis</h2>
                      <p className="text-sm text-[#8B7355]">AI-detected emotional patterns from your writing</p>
                    </div>
                  </div>

                  {/* User Expression Card */}
                  {formData?.text && (
                    <div className="mb-6 p-5 rounded-xl"
                         style={{ background: 'linear-gradient(135deg, #F5F0E8, #E8DFD3)' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <IconActivity />
                        <p className="text-xs font-semibold text-[#8B7355] uppercase tracking-wider">Your Expression</p>
                      </div>
                      <p className="text-[#4A3728] italic text-base leading-relaxed">
                        "{formData.text}"
                      </p>
                    </div>
                  )}

                  {/* Analysis Grid */}
                  <div className="grid gap-6 lg:grid-cols-2">
                    
                    {/* Confidence Donut Chart */}
                    {nlpPrediction && nlpConfidence > 0 && (
                      <div className="p-6 rounded-xl border border-[#D2B48C]/30"
                           style={{ background: 'linear-gradient(135deg, #FAF7F2, #F0EBE3)' }}>
                        <div className="flex items-center gap-2 mb-4">
                          <IconTarget />
                          <h3 className="text-sm font-bold text-[#4A3728]">Confidence Score</h3>
                        </div>
                        <div className="flex justify-center py-4">
                          <DonutChart 
                            percentage={nlpConfidence} 
                            color={getEmotionColor(nlpPrediction)} 
                            emotion={nlpPrediction}
                          />
                        </div>
                        <div className="mt-4 p-3 rounded-lg bg-white/60 text-center">
                          <p className="text-xs text-[#8B7355] leading-relaxed">
                            The AI model is <strong className="text-[#4A3728]">{nlpConfidence}%</strong> confident that your text 
                            expresses <strong className="text-[#4A3728]">{nlpPrediction}</strong>
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Top Predictions Bar Chart */}
                    {nlpTopPredictions.length > 0 && (
                      <div className="p-6 rounded-xl border border-[#D2B48C]/30"
                           style={{ background: 'linear-gradient(135deg, #FAF7F2, #F0EBE3)' }}>
                        <div className="flex items-center gap-2 mb-4">
                          <IconChart />
                          <h3 className="text-sm font-bold text-[#4A3728]">Top Emotion Predictions</h3>
                        </div>
                        <TopPredictionsChart predictions={nlpTopPredictions} />
                        
                        {nlpTopPredictions.length >= 2 && (
                          <div className="mt-5 p-3 rounded-lg bg-[#D6E4F0]/30 border border-[#B8CFE0]">
                            <p className="text-xs text-[#8B7355] leading-relaxed">
                              <span className="font-semibold text-[#3A6B8B]">{nlpTopPredictions[0].label}</span> is the dominant emotion 
                              ({(nlpTopPredictions[0].score * 100).toFixed(1)}%), 
                              followed by <span className="font-semibold text-[#4A3728]">{nlpTopPredictions[1].label}</span> 
                              ({(nlpTopPredictions[1].score * 100).toFixed(1)}%).
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Detailed Breakdown */}
                  {nlpPrediction && (
                    <div className="mt-6 p-5 rounded-xl border border-[#B8CFE0]"
                         style={{ background: 'linear-gradient(135deg, #F0F4F8, #E8EFF5)' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <IconCheck />
                        <h3 className="text-sm font-bold text-[#3A6B8B]">Detailed Analysis Breakdown</h3>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="p-3 bg-white rounded-lg text-center border border-[#D2B48C]/20">
                          <p className="text-xs text-[#A09080] mb-1">Primary Emotion Detected</p>
                          <p className="text-base font-bold text-[#4A3728]">{nlpPrediction}</p>
                        </div>
                        {nlpConfidence > 0 && (
                          <div className="p-3 bg-white rounded-lg text-center border border-[#D2B48C]/20">
                            <p className="text-xs text-[#A09080] mb-1">Model Confidence</p>
                            <p className="text-base font-bold text-[#6B8F6B]">{nlpConfidence}%</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Footer Note */}
              <div className="mt-8 pt-6 text-center border-t border-[#E8DFD3]">
                <p className="text-xs text-[#A09080]">
                  This report is generated by an AI system and should not replace professional medical advice. 
                  If you're experiencing severe mental health issues, please consult a qualified healthcare provider.
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}