'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  foodCategories, dietByGoal, foodByHealthCondition, combinedConditionGuide,
  proteinRequirements, getFoodRecommendations
} from '@/lib/food-data';
import { getGoalColor } from '@/lib/utils';

interface MemberDetail {
  id: string; name: string; ageGroup: string; gender: string; fitnessGoal: string;
  experienceLevel: string; motivationLevel: string; personality: string;
  membershipPlan: string; healthConditions: string; mobileNo: string | null;
  personalTrainer: { name: string; specialization: string } | null;
}

export default function MemberFoodPage() {
  const params = useParams();
  const memberId = params.memberId as string;
  const [member, setMember] = useState<MemberDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'goal' | 'conditions' | 'general'>('goal');

  useEffect(() => {
    fetch(`/api/members/${memberId}`).then(r => r.json()).then(d => { setMember(d); setLoading(false); });
  }, [memberId]);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="skeleton h-40 rounded-2xl" />
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    );
  }

  if (!member) return <div className="p-6 text-zinc-400">Member not found</div>;

  const healthConditions = JSON.parse(member.healthConditions || '[]') as string[];
  const { goalDiet, conditionFoods } = getFoodRecommendations(member.fitnessGoal, healthConditions, member.experienceLevel);
  const protein = proteinRequirements[member.fitnessGoal] || '1.2–1.6g per kg';

  const hasCombined = healthConditions.length >= 2;

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Back */}
      <Link href="/trainer/members" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
        ← Back to Members
      </Link>

      {/* Member Info Card */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-48 opacity-10 rounded-full"
          style={{ background: 'radial-gradient(ellipse, #2563eb 0%, transparent 70%)', transform: 'translate(20%,-20%)' }}
        />
        <div className="relative flex flex-col md:flex-row md:items-start gap-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600/30 to-blue-900/30 border border-blue-800/40 flex items-center justify-center text-3xl font-black text-blue-400 flex-shrink-0">
            {member.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-white">{member.name}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getGoalColor(member.fitnessGoal)}`}>{member.fitnessGoal}</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-700 text-zinc-300">{member.ageGroup}</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-700 text-zinc-300">{member.experienceLevel}</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-700 text-zinc-300">{member.gender}</span>
              {healthConditions.map(hc => (
                <span key={hc} className="text-xs px-2.5 py-1 rounded-full bg-yellow-600/20 text-yellow-400 border border-yellow-600/30">⚠ {hc}</span>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <p className="text-xs text-zinc-500">Motivation</p>
                <p className="text-sm text-white font-medium">{member.motivationLevel}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Personality</p>
                <p className="text-sm text-white font-medium">{member.personality}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Membership</p>
                <p className="text-sm text-white font-medium">{member.membershipPlan}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Protein Need</p>
                <p className="text-sm text-emerald-400 font-bold">{protein}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 w-fit">
        {[
          { id: 'goal', label: '🎯 Goal Diet', desc: `Based on ${member.fitnessGoal}` },
          { id: 'conditions', label: '🏥 Health-Based', desc: `${healthConditions.length} condition(s)` },
          { id: 'general', label: '📚 Food Guide', desc: 'All categories' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.id ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Goal Diet Tab */}
      {activeTab === 'goal' && goalDiet && (
        <div className="space-y-4">
          <div className={`bg-gradient-to-br ${goalDiet.color} rounded-2xl p-6 text-white`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{goalDiet.icon}</span>
              <div>
                <h2 className="text-xl font-black">{goalDiet.goal}</h2>
                <p className="text-white/70 text-sm">Diet Protocol</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {goalDiet.principles.map((p, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
                  <span className="text-emerald-300 text-sm">✓</span>
                  <span className="text-sm text-white/90">{p}</span>
                </div>
              ))}
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-xs text-white/60 font-medium uppercase tracking-wide mb-1">Sample Meal</p>
              <p className="text-base font-bold">{goalDiet.sampleMeal}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-900 border border-emerald-800/30 rounded-2xl p-5">
              <h3 className="text-base font-bold text-emerald-400 mb-4 flex items-center gap-2">✅ Recommended Foods</h3>
              <div className="space-y-2">
                {goalDiet.foods.include.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-zinc-900 border border-red-800/30 rounded-2xl p-5">
              <h3 className="text-base font-bold text-red-400 mb-4 flex items-center gap-2">❌ Foods to Avoid</h3>
              <div className="space-y-2">
                {goalDiet.foods.avoid.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* All food categories for this goal */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <h3 className="text-base font-bold text-white mb-4">Food Category Reference</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {foodCategories.filter(fc => fc.id !== 'avoid').map(fc => (
                <div key={fc.id} className={`bg-gradient-to-br ${fc.color} rounded-xl p-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{fc.icon}</span>
                    <span className="text-sm font-bold text-white">{fc.name}</span>
                  </div>
                  {fc.timing && <p className="text-xs text-white/60 mb-1">⏰ {fc.timing}</p>}
                  {fc.bestFor && <p className="text-xs text-white/80">Best for: {fc.bestFor}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Health Conditions Tab */}
      {activeTab === 'conditions' && (
        <div className="space-y-4">
          {healthConditions.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
              <p className="text-4xl mb-3">✅</p>
              <p className="text-zinc-400">No special health conditions recorded for this member.</p>
              <p className="text-zinc-500 text-sm mt-1">Follow the goal-based diet plan on the Goal Diet tab.</p>
            </div>
          ) : (
            <>
              {hasCombined && (
                <div className="bg-gradient-to-br from-rose-950/60 to-zinc-950 border border-rose-800/30 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">❤️</span>
                    <h2 className="text-lg font-black text-white">Combined Condition Protocol</h2>
                  </div>
                  <p className="text-zinc-400 text-xs mb-4">Since this member has multiple conditions, follow this balanced approach:</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {combinedConditionGuide.idealPattern.map(p => (
                      <span key={p} className="text-xs bg-rose-600/10 text-rose-400 border border-rose-600/20 px-3 py-1 rounded-full font-medium">✓ {p}</span>
                    ))}
                  </div>
                  <h3 className="text-sm font-bold text-zinc-300 mb-3">Sample Day</h3>
                  <div className="space-y-2">
                    {combinedConditionGuide.sampleDay.map((item, i) => (
                      <div key={i} className="flex gap-3 bg-zinc-800/30 rounded-lg px-4 py-2.5">
                        <span className="text-xs font-semibold text-rose-400 w-24 flex-shrink-0">{item.meal}</span>
                        <span className="text-xs text-zinc-300">{item.items}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {conditionFoods.map(condFood => (
                <div key={condFood.conditionKey} className={`bg-gradient-to-br ${condFood.color} rounded-2xl p-6`}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{condFood.icon}</span>
                    <h2 className="text-lg font-black text-white">{condFood.condition}</h2>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-white/60 font-semibold uppercase tracking-wide mb-2">Key Focus</p>
                    <div className="flex flex-wrap gap-2">
                      {condFood.focus.map(f => (
                        <span key={f} className="text-xs bg-white/10 text-white/90 px-2.5 py-1 rounded-full">{f}</span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-white/60 font-semibold uppercase tracking-wide mb-2">Recommended Foods</p>
                      <div className="space-y-3">
                        {condFood.recommended.map(cat => (
                          <div key={cat.category}>
                            <p className="text-xs font-bold text-white/80 mb-1">{cat.category}</p>
                            <div className="space-y-1">
                              {cat.items.map(item => (
                                <div key={item} className="flex items-center gap-2 text-xs text-white/70">
                                  <span className="w-1 h-1 rounded-full bg-emerald-400 flex-shrink-0" />
                                  {item}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-white/60 font-semibold uppercase tracking-wide mb-2">Avoid / Limit</p>
                      <div className="space-y-1">
                        {condFood.avoid.map(item => (
                          <div key={item} className="flex items-center gap-2 text-xs text-red-300">
                            <span className="text-red-400">✗</span>
                            {item}
                          </div>
                        ))}
                      </div>
                      <div className="mt-4">
                        <p className="text-xs text-white/60 font-semibold uppercase tracking-wide mb-2">Gym Tips</p>
                        <p className="text-xs text-white/60 mb-1">✅ Do:</p>
                        {condFood.gymTips.do.map(t => (
                          <div key={t} className="text-xs text-emerald-300 flex items-center gap-1 mb-0.5">
                            <span>•</span> {t}
                          </div>
                        ))}
                        <p className="text-xs text-white/60 mt-2 mb-1">❌ Avoid:</p>
                        {condFood.gymTips.avoid.map(t => (
                          <div key={t} className="text-xs text-red-300 flex items-center gap-1 mb-0.5">
                            <span>•</span> {t}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* General Food Guide Tab */}
      {activeTab === 'general' && (
        <div className="space-y-4">
          {foodCategories.map(cat => (
            <div key={cat.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className={`bg-gradient-to-br ${cat.color} p-5`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cat.icon}</span>
                  <div>
                    <h3 className="text-base font-black text-white">{cat.name}</h3>
                    <p className="text-white/70 text-sm">{cat.purpose}</p>
                  </div>
                </div>
                {cat.timing && (
                  <p className="text-xs text-white/60 mt-2">⏰ Timing: {cat.timing}</p>
                )}
                {cat.bestFor && (
                  <p className="text-xs text-white/80 mt-1">Best for: <span className="font-semibold">{cat.bestFor}</span></p>
                )}
              </div>
              <div className="p-5">
                {cat.subcategories ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cat.subcategories.map(sub => (
                      <div key={sub.name}>
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wide mb-2">{sub.name}</p>
                        <div className="flex flex-wrap gap-2">
                          {sub.items.map(item => (
                            <span key={item} className="text-xs bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-lg border border-zinc-700">{item}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : cat.items ? (
                  <div className="flex flex-wrap gap-2">
                    {cat.items.map(item => (
                      <span key={item} className={`text-xs px-2.5 py-1 rounded-lg border ${cat.id === 'avoid' ? 'bg-red-950/30 text-red-400 border-red-800/30' : 'bg-zinc-800 text-zinc-300 border-zinc-700'}`}>
                        {cat.id === 'avoid' ? '✗ ' : ''}{item}
                      </span>
                    ))}
                  </div>
                ) : null}
                {cat.note && (
                  <p className="text-xs text-zinc-500 mt-3 italic">{cat.note}</p>
                )}
              </div>
            </div>
          ))}

          {/* Diet by Goal summary table */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <h3 className="text-base font-bold text-white mb-4">Diet Goals Quick Reference</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Goal</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Key Focus</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Sample Meal</th>
                  </tr>
                </thead>
                <tbody>
                  {dietByGoal.map(d => (
                    <tr key={d.goal} className={`border-b border-zinc-800/50 last:border-0 ${d.goal === member.fitnessGoal ? 'bg-red-950/20' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span>{d.icon}</span>
                          <span className={`text-sm font-semibold ${d.goal === member.fitnessGoal ? 'text-red-400' : 'text-white'}`}>{d.goal}</span>
                          {d.goal === member.fitnessGoal && <span className="text-xs bg-red-600/20 text-red-400 px-1.5 py-0.5 rounded-full">This member</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {d.principles.slice(0, 2).map(p => (
                            <span key={p} className="text-xs text-zinc-400">{p.split('(')[0].trim()}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-400">{d.sampleMeal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
