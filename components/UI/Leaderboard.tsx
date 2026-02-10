import React, { useEffect, useState, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../../utils/supabaseClient';
import { LeaderboardEntry } from '../../types';
import { ArrowLeft, Trophy, Loader, Download, Instagram } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';
import html2canvas from 'html2canvas';

interface LeaderboardProps {
    onBack: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ onBack }) => {
    const [scores, setScores] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sharing, setSharing] = useState(false);

    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchScores = async () => {
            if (!isSupabaseConfigured()) {
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('leaderboard')
                    .select('username, score')
                    .order('score', { ascending: false })
                    .limit(200);

                if (error) throw error;

                // Filter unique usernames, keeping the highest score (first occurrence)
                const uniqueScores: LeaderboardEntry[] = [];
                const seenUsernames = new Set<string>();

                if (data) {
                    for (const entry of data) {
                        // Normalize by stripping leading @ for unique comparison
                        let normalizedName = entry.username.trim();
                        if (normalizedName.startsWith('@')) {
                            normalizedName = normalizedName.substring(1);
                        }
                        normalizedName = normalizedName.toUpperCase();

                        if (!seenUsernames.has(normalizedName)) {
                            seenUsernames.add(normalizedName);
                            uniqueScores.push(entry);
                        }
                        if (uniqueScores.length >= 50) break;
                    }
                }

                setScores(uniqueScores);
            } catch (err: any) {
                console.error('Error fetching leaderboard:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchScores();
    }, []);

    const handleBack = () => {
        soundEngine.playClick();
        onBack();
    };

    const handleShare = async () => {
        if (!contentRef.current || sharing) return;
        soundEngine.playClick();
        setSharing(true);

        try {
            const canvas = await html2canvas(contentRef.current, {
                backgroundColor: '#171717', // Match neutral-900
                scale: 2,
                useCORS: true
            });

            const image = canvas.toDataURL("image/png");
            const link = document.createElement('a');
            link.href = image;
            link.download = 'issy-fruit-slash-leaders.png';
            link.click();
        } catch (e) {
            console.error("Share failed", e);
            alert("Could not capture leaderboard image.");
        } finally {
            setSharing(false);
        }
    };

    return (
        <div className="absolute inset-0 bg-neutral-900 z-30 flex flex-col font-retro text-white overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b-4 border-issy-pink flex items-center justify-between bg-black/40">
                <button
                    onClick={handleBack}
                    className="p-2 hover:bg-white/10 rounded transition-colors group"
                >
                    <ArrowLeft className="w-6 h-6 text-issy-pink group-hover:-translate-x-1 transition-transform" />
                </button>
                <h2 className="text-xl sm:text-2xl text-issy-accent drop-shadow-[2px_2px_0_#FFF]">TOP SLICERS</h2>
                <button
                    onClick={handleShare}
                    disabled={loading || scores.length === 0}
                    className="p-2 hover:bg-white/10 rounded transition-colors text-issy-pastelBlue disabled:opacity-50"
                >
                    {sharing ? <Loader className="w-6 h-6 animate-spin" /> : <Download className="w-6 h-6" />}
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar" ref={contentRef}>
                {!isSupabaseConfigured() ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50">
                        <Trophy className="w-16 h-16 mb-4 text-gray-600" />
                        <p className="text-gray-400 mb-2">LEADERBOARD OFFLINE</p>
                        <p className="text-[10px] text-gray-600">Database connection missing.</p>
                    </div>
                ) : loading ? (
                    <div className="h-full flex flex-col items-center justify-center">
                        <Loader className="w-12 h-12 text-issy-pink animate-spin mb-4" />
                        <p className="text-issy-pink animate-pulse">LOADING SCORES...</p>
                    </div>
                ) : error ? (
                    <div className="h-full flex flex-col items-center justify-center text-red-400 text-center p-4">
                        <p className="mb-2">ERROR LOADING DATA</p>
                        <p className="text-[10px] opacity-70">{error}</p>
                    </div>
                ) : scores.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                        <p>NO SCORES YET.</p>
                        <p className="text-[10px] mt-2">BE THE FIRST!</p>
                    </div>
                ) : (
                    <div className="space-y-3 pb-8">
                        {scores.map((entry, index) => {
                            // Formatting
                            let rankColor = "text-white";
                            let borderColor = "border-white/20";
                            if (index === 0) { rankColor = "text-yellow-400"; borderColor = "border-yellow-400"; }
                            if (index === 1) { rankColor = "text-gray-300"; borderColor = "border-gray-300"; }
                            if (index === 2) { rankColor = "text-orange-400"; borderColor = "border-orange-400"; }

                            // Ensure handle format
                            const displayHandle = entry.username.startsWith('@') ? entry.username : `@${entry.username}`;

                            return (
                                <div
                                    key={index}
                                    className={`flex items-center bg-issy-darkCard p-3 border-2 ${borderColor} shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] transform hover:-translate-y-1 transition-transform`}
                                >
                                    <div className={`w-12 sm:w-14 text-center text-lg sm:text-xl font-bold ${rankColor} drop-shadow-md shrink-0`}>
                                        #{index + 1}
                                    </div>
                                    <div className="flex-1 px-4 flex flex-col">
                                        <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                            <Instagram className="w-3 h-3" />
                                            <span>INSTAGRAM</span>
                                        </div>
                                        <div className="text-sm sm:text-base text-white truncate max-w-[150px] sm:max-w-xs uppercase">
                                            {displayHandle}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-issy-pink text-lg sm:text-xl drop-shadow-[1px_1px_0_#FFF]">
                                            {entry.score.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        <div className="pt-8 text-center">
                            <p className="text-[10px] text-gray-500 animate-pulse">
                                TOP 50 GLOBAL SCORES • UPDATED LIVE
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;