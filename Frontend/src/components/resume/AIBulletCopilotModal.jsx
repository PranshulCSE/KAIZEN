import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  TrendingUp,
  Scissors,
  Users,
  Target,
  Check,
  X,
  RefreshCw,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../ui/Button.jsx';
import { aiApi } from '../../api/ai.api.js';

export default function AIBulletCopilotModal({
  isOpen,
  onClose,
  initialBulletText = '',
  targetRole = 'Software Engineer',
  onApplyBullet
}) {
  const [bulletText, setBulletText] = useState(initialBulletText);
  const [selectedAction, setSelectedAction] = useState('stronger');
  const [isLoading, setIsLoading] = useState(false);
  const [resultData, setResultData] = useState(null);

  React.useEffect(() => {
    setBulletText(initialBulletText);
    setResultData(null);
  }, [initialBulletText, isOpen]);

  if (!isOpen) return null;

  const actions = [
    { id: 'stronger', label: 'Make Stronger', icon: Zap, desc: 'High-impact verbs & ownership' },
    { id: 'metrics', label: 'Add Metrics', icon: TrendingUp, desc: 'Quantify scale & efficiency' },
    { id: 'shorten', label: 'Shorten / 1-Line', icon: Scissors, desc: 'Concise ATS punchiness' },
    { id: 'leadership', label: 'Leadership Focus', icon: Users, desc: 'Mentorship & architecture' },
    { id: 'tailor', label: 'Tailor to Role', icon: Target, desc: `Align to ${targetRole}` }
  ];

  const handleImprove = async (actionToRun = selectedAction) => {
    if (!bulletText.trim() || bulletText.trim().length < 5) {
      toast.error('Bullet point must be at least 5 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await aiApi.improveBullet({
        bulletText: bulletText.trim(),
        action: actionToRun,
        targetRole
      });

      setResultData(data.data);
      toast.success('Generated 3 AI improvements!');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to improve bullet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSuggestion = (suggestedText) => {
    onApplyBullet(suggestedText);
    toast.success('Applied to resume bullet!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 shadow-2xl overflow-hidden animate-scale-in">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-dark-100 dark:border-dark-800 bg-gradient-to-r from-primary-50/50 via-white to-white dark:from-dark-950 dark:to-dark-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary-600 text-white shadow-md shadow-primary-600/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-dark-900 dark:text-white">
                AI Bullet Point Copilot
              </h3>
              <p className="text-xs text-dark-500 dark:text-dark-400">
                Rewrite achievements with ATS action verbs and metrics
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-dark-400 hover:text-dark-700 dark:hover:text-white hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Current Bullet Textarea */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-dark-600 dark:text-dark-400 mb-1.5">
              Original Bullet Point
            </label>
            <textarea
              rows={3}
              value={bulletText}
              onChange={(e) => setBulletText(e.target.value)}
              placeholder="e.g. Worked on the API and fixed backend latency issues..."
              className="w-full p-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-dark-50/60 dark:bg-dark-950 text-dark-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none font-sans"
            />
          </div>

          {/* Action Strategy Grid */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-dark-600 dark:text-dark-400 mb-2">
              Optimization Goal
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {actions.map((act) => {
                const Icon = act.icon;
                const isSelected = selectedAction === act.id;
                return (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => {
                      setSelectedAction(act.id);
                      handleImprove(act.id);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-primary-600 bg-primary-50/70 dark:bg-primary-950/40 text-primary-900 dark:text-primary-200 font-bold shadow-2xs'
                        : 'border-dark-100 dark:border-dark-800 bg-white dark:bg-dark-900 text-dark-600 dark:text-dark-400 hover:border-dark-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-primary-600' : 'text-dark-400'}`} />
                      <span>{act.label}</span>
                    </div>
                    <p className="text-[10px] text-dark-400 dark:text-dark-500 mt-1 line-clamp-1 font-mono">
                      {act.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            variant="lime"
            size="md"
            onClick={() => handleImprove(selectedAction)}
            isLoading={isLoading}
            className="w-full justify-center font-bold text-xs shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-ink" />
            <span>Generate 3 High-Impact Alternatives</span>
          </Button>

          {/* Results Suggestions List */}
          {resultData && (
            <div className="space-y-3 pt-3 border-t border-dark-100 dark:border-dark-800 animate-scale-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-dark-700 dark:text-dark-300">
                  Select Best Rewrite to Apply:
                </span>
                {resultData.atsTips && (
                  <span className="text-[11px] text-dark-500 dark:text-dark-400 flex items-center gap-1 font-mono">
                    <Lightbulb className="w-3 h-3 text-amber-500" />
                    <span>{resultData.atsTips}</span>
                  </span>
                )}
              </div>

              <div className="space-y-2.5">
                {resultData.suggestions?.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-dark-100 dark:border-dark-800 bg-white dark:bg-dark-900 hover:border-primary-500 dark:hover:border-primary-500 transition-all group flex flex-col justify-between gap-3 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-xs font-medium text-dark-900 dark:text-white leading-relaxed">
                        • {item.text}
                      </p>
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 whitespace-nowrap">
                        {item.highlight || `${item.impactScore}% Impact`}
                      </span>
                    </div>

                    <div className="flex items-center justify-end">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleSelectSuggestion(item.text)}
                        className="text-xs font-bold"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Use This Bullet</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
