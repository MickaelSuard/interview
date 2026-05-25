import { useState, useEffect, useRef, useCallback, type MouseEvent, type KeyboardEvent } from "react";

const C = {
    primary: "#2563eb",
    primaryLight: "#3b82f6",
    primaryPale: "#eff6ff",
    primaryBorder: "#bfdbfe",
    primaryShadow: "rgba(37,99,235,0.18)",
    accent: "#0ea5e9",
    bg: "#f0f7ff",
    bgCard: "#ffffff",
    text: "#1e3a5f",
    textMuted: "#64a0cc",
    textPlaceholder: "#93c5fd",
    dot: "#7dd3fc",
    waveEmpty: "#dbeafe",
    border: "#e0eeff",
};

type ConversationItem = {
    readonly id: number;
    readonly question: string;
    readonly audioLabel: string;
    readonly audioDuration: string;
    readonly audioWaveform: number[];
    readonly audioSrc?: string;
};

type AudioPlayerProps = Readonly<{
    waveform: number[];
    duration: string;
    audioSrc?: string;
    animate?: boolean;
    onMounted?: () => void;
}>;

type AvatarProps = Readonly<{
    label: string;
    gradient: string;
    textColor: string;
    border?: string;
    shadow?: string;
    size?: number;
}>;

type StaticMessageProps = Readonly<{
    item: ConversationItem;
}>;

type ActiveMessageProps = Readonly<{
    item: ConversationItem;
    onAudioMounted?: () => void;
}>;

type TypeIntoInputCallback = (text: string, onDone?: () => void) => void;

const SOUND_SRC = "/sound1.mp3";

const CONVERSATION: ConversationItem[] = [
    {
        id: 1,
        question: "Bonjour ! Pouvez-vous vous présenter et décrire votre rôle dans l'entreprise ?",
        audioLabel: "Présentation du maître de stage",
        audioDuration: "0:42",
        audioWaveform: [3, 5, 7, 9, 6, 8, 10, 7, 5, 8, 11, 9, 6, 4, 7, 9, 5, 8, 10, 6, 7, 4, 6, 9, 8, 5, 7, 10, 6, 4],
    },
    {
        id: 2,
        question: "Quelles missions m'avez-vous confiées durant ce stage ?",
        audioLabel: "Les missions confiées",
        audioDuration: "1:05",
        audioWaveform: [4, 8, 6, 10, 7, 5, 9, 11, 6, 8, 4, 7, 10, 8, 5, 9, 6, 11, 7, 4, 8, 6, 9, 5, 10, 7, 4, 8, 6, 9],
        audioSrc: "/sound.mp3",
    },
    {
        id: 3,
        question: "Comment avez-vous évalué ma progression tout au long du stage ?",
        audioLabel: "Évaluation et progression",
        audioDuration: "0:58",
        audioWaveform: [6, 4, 9, 7, 11, 5, 8, 6, 10, 4, 7, 9, 5, 8, 11, 6, 4, 9, 7, 5, 10, 8, 6, 4, 9, 7, 11, 5, 8, 6],
        audioSrc: "/sound2.mp3",
    },
    {
        id: 4,
        question: "Quelles compétences avez-vous observées ou développées chez moi ?",
        audioLabel: "Compétences développées",
        audioDuration: "1:12",
        audioWaveform: [5, 9, 7, 4, 10, 8, 6, 11, 5, 7, 9, 4, 8, 6, 10, 5, 7, 11, 4, 9, 6, 8, 5, 10, 7, 4, 9, 6, 11, 8],
        audioSrc: "/sound3.mp3",
    },
    {
        id: 5,
        question: "Avez-vous des conseils pour la suite de mon parcours professionnel ?",
        audioLabel: "Conseils et perspectives",
        audioDuration: "1:20",
        audioWaveform: [7, 5, 10, 8, 4, 11, 6, 9, 5, 8, 10, 6, 4, 9, 7, 11, 5, 8, 6, 10, 4, 7, 9, 5, 11, 8, 6, 4, 10, 7],
        audioSrc: "/sound4.mp3",
    },
];


function AudioPlayer({ waveform, duration, animate = false, onMounted, audioSrc }: AudioPlayerProps) {
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [durationSeconds, setDurationSeconds] = useState(0);
    const [visible, setVisible] = useState(!animate);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const calledRef = useRef(false);

    useEffect(() => {
        const audio = new Audio((audioSrc) || SOUND_SRC);
        audio.preload = "auto";
        audioRef.current = audio;

        const handleTimeUpdate = () => {
            if (audio.duration > 0) {
                setProgress((audio.currentTime / audio.duration) * 100);
            }
        };

        const handleLoadedMetadata = () => {
            if (audio.duration > 0) {
                setDurationSeconds(audio.duration);
                setProgress((audio.currentTime / audio.duration) * 100);
            }
        };

        const handleEnded = () => {
            setPlaying(false);
            setProgress(100);
        };

        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.pause();
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("ended", handleEnded);
            audioRef.current = null;
        };
    }, [audioSrc]);

    useEffect(() => {
        if (!animate) return;
        const timer = globalThis.setTimeout(() => setVisible(true), 60);
        return () => globalThis.clearTimeout(timer);
    }, [animate]);

    useEffect(() => {
        if (visible && !calledRef.current) {
            calledRef.current = true;
            onMounted?.();
        }
    }, [visible, onMounted]);

    const togglePlayback = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (playing) {
            audio.pause();
            setPlaying(false);
            return;
        }

        if (audio.duration > 0 && audio.currentTime >= audio.duration) {
            audio.currentTime = 0;
            setProgress(0);
        }

        audio.play().catch(() => {
            // Ignore playback errors when autoplay is blocked
        });
        setPlaying(true);
    };

    const seekTo = (time: number) => {
        const audio = audioRef.current;
        if (!audio || durationSeconds <= 0) return;
        const nextTime = Math.min(Math.max(0, time), durationSeconds);
        audio.currentTime = nextTime;
        setProgress((nextTime / durationSeconds) * 100);
    };

    const handleRewind = () => {
        const audio = audioRef.current;
        if (!audio) return;
        seekTo(audio.currentTime - 10);
    };

    const handleForward = () => {
        const audio = audioRef.current;
        if (!audio) return;
        seekTo(audio.currentTime + 10);
    };

    const handleWaveformKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            handleRewind();
            return;
        }
        if (event.key === "ArrowRight") {
            event.preventDefault();
            handleForward();
            return;
        }
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            const audio = audioRef.current;
            if (!audio || durationSeconds <= 0) return;
            const nextTime = (progress / 100) * durationSeconds;
            seekTo(nextTime);
        }
    };
    return (
        <div style={{
            display: "flex", alignItems: "center", gap: 12,
            borderRadius: 18, padding: "12px 16px",
            maxWidth: 280, width: "100%",
            background: C.bgCard,
            boxShadow: `0 2px 16px ${C.primaryShadow}`,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(10px)",
            transition: animate ? "opacity 0.45s ease, transform 0.45s ease" : "none",
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button onClick={togglePlayback} style={{
                    flexShrink: 0, width: 36, height: 36, borderRadius: "50%",
                    border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: playing
                        ? "linear-gradient(135deg,#f97316,#fb923c)"
                        : `linear-gradient(135deg,${C.primary},${C.accent})`,
                    boxShadow: playing
                        ? "0 3px 12px rgba(249,115,22,0.35)"
                        : `0 3px 12px ${C.primaryShadow}`,
                    transition: "all 0.2s",
                }}>
                    {playing
                        ? <svg width="12" height="12" viewBox="0 0 12 12" fill="white"><rect x="1" y="1" width="4" height="10" rx="1" /><rect x="7" y="1" width="4" height="10" rx="1" /></svg>
                        : <svg width="12" height="12" viewBox="0 0 12 12" fill="white"><path d="M2 1 L11 6 L2 11 Z" /></svg>
                    }
                </button>
            </div>

            <div
                role="button"
                tabIndex={0}
                onKeyDown={handleWaveformKeyDown}
                onClick={(e) => {
                    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();

                    const ratio =
                        Math.min(
                            Math.max(0, (e as MouseEvent).clientX - rect.left),
                            rect.width
                        ) / rect.width;

                    seekTo(ratio * durationSeconds);
                }}
                className={`
    flex items-end gap-[2px] flex-1 h-7 min-w-0
    cursor-pointer overflow-hidden
  `}
            >
                {waveform.map((h, i) => {
                    const filled = (i / waveform.length) * 100 <= progress;

                    return (
                        <div
                            key={`${i}-${h}`}
                            data-wave-index={i}
                            onClick={(ev) => {
                                ev.stopPropagation();

                                if (durationSeconds <= 0) return;

                                const ratio = (i + 0.5) / waveform.length;
                                seekTo(ratio * durationSeconds);
                            }}
                            className={`
          rounded-full transition-all duration-150
          min-w-[3px]
        `}
                            style={{
                                width: "100%",
                                height: `${Math.max(6, h * 2)}px`,
                                background: filled
                                    ? playing
                                        ? "linear-gradient(to top,#f97316,#fbbf24)"
                                        : `linear-gradient(to top,${C.primary},${C.accent})`
                                    : C.waveEmpty,
                            }}
                        />
                    );
                })}
            </div>

            <span style={{ fontSize: "0.7rem", color: C.textMuted, fontFamily: "monospace", flexShrink: 0 }}>
                {duration}
            </span>
        </div>
    );
}

function TypingDots() {
    return (
        <div style={{
            display: "flex", gap: 5, alignItems: "center",
            padding: "10px 16px", borderRadius: 16,
            background: C.bgCard, border: `1px solid ${C.border}`,
            boxShadow: `0 1px 8px ${C.primaryShadow}`,
            width: "fit-content", animation: "fadeUp 0.3s ease",
        }}>
            {[0, 1, 2].map(i => (
                <span key={i} style={{
                    display: "block", width: 7, height: 7, borderRadius: "50%",
                    background: C.dot,
                    animation: `dotBounce 1s ease-in-out ${i * 0.18}s infinite`,
                }} />
            ))}
        </div>
    );
}

function Avatar({ label, gradient, textColor, border, shadow, size = 32 }: AvatarProps) {
    return (
        <div style={{
            width: size, height: size, borderRadius: "50%", flexShrink: 0,
            background: gradient, border, boxShadow: shadow,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: size * 0.22, fontWeight: 700, color: textColor,
        }}>{label}</div>
    );
}

function StaticMessage({ item }: StaticMessageProps) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end", gap: 8 }}>
                <div style={{
                    maxWidth: 320, borderRadius: "20px 20px 6px 20px",
                    padding: "12px 18px",
                    background: `linear-gradient(135deg,${C.primary},${C.primaryLight})`,
                    color: "#fff", fontSize: "0.92rem", lineHeight: 1.55,
                    fontFamily: "'Lora', Georgia, serif",
                    boxShadow: `0 4px 20px ${C.primaryShadow}`,
                }}>{item.question}</div>
                <Avatar label="TM"
                    gradient={`linear-gradient(135deg,${C.primary},${C.primaryLight})`}
                    textColor="#fff" border="2px solid #fff"
                    shadow={`0 2px 8px ${C.primaryShadow}`} />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "flex-end", gap: 8 }}>
                <Avatar label="MS"
                    gradient={`linear-gradient(135deg,${C.primaryPale},${C.border})`}
                    textColor={C.primary} border={`2px solid ${C.border}`}
                    shadow={`0 2px 8px ${C.primaryShadow}`} />
                <div>
                    <AudioPlayer
                        waveform={item.audioWaveform}
                        duration={item.audioDuration}
                        audioSrc={item.audioSrc}
                        animate={false}
                    />
                    <p style={{ marginTop: 4, fontSize: "0.7rem", color: C.textMuted, fontFamily: "monospace" }}>
                        {item.audioLabel}
                    </p>
                </div>
            </div>
        </div>
    );
}

function ActiveMessage({ item, onAudioMounted }: ActiveMessageProps) {
    const [displayed, setDisplayed] = useState("");
    const [qDone, setQDone] = useState(false);
    const [showDots, setShowDots] = useState(false);
    const [showAudio, setShowAudio] = useState(false);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        let i = 0;
        timerRef.current = globalThis.setInterval(() => {
            i++;
            setDisplayed(item.question.slice(0, i));
            if (i >= item.question.length) {
                if (timerRef.current !== null) globalThis.clearInterval(timerRef.current);
                setQDone(true);
            }
        }, 34);
        return () => {
            if (timerRef.current !== null) globalThis.clearInterval(timerRef.current);
        };
    }, [item.question]);

    useEffect(() => {
        if (!qDone) return;
        const timer = globalThis.setTimeout(() => setShowDots(true), 500);
        return () => globalThis.clearTimeout(timer);
    }, [qDone]);

    useEffect(() => {
        if (!showDots) return;
        const timer = globalThis.setTimeout(() => {
            setShowDots(false);
            setShowAudio(true);
        }, 1600);
        return () => globalThis.clearTimeout(timer);
    }, [showDots]);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end", gap: 8 }}>
                <div style={{
                    maxWidth: 320, borderRadius: "20px 20px 6px 20px",
                    padding: "12px 18px",
                    background: `linear-gradient(135deg,${C.primary},${C.primaryLight})`,
                    color: "#fff", fontSize: "0.92rem", lineHeight: 1.55,
                    fontFamily: "'Lora', Georgia, serif",
                    boxShadow: `0 4px 20px ${C.primaryShadow}`,
                    animation: "slideRight 0.35s ease",
                }}>
                    {displayed}
                    {!qDone && (
                        <span style={{
                            display: "inline-block", width: 2, height: "1em",
                            background: "rgba(255,255,255,0.75)", marginLeft: 2, verticalAlign: "middle",
                            animation: "blink 0.55s step-end infinite",
                        }} />
                    )}
                </div>
                <Avatar label="TM"
                    gradient={`linear-gradient(135deg,${C.primary},${C.primaryLight})`}
                    textColor="#fff" border="2px solid #fff"
                    shadow={`0 2px 8px ${C.primaryShadow}`} />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "flex-end", gap: 8 }}>
                <Avatar label="MS"
                    gradient={`linear-gradient(135deg,${C.primaryPale},${C.border})`}
                    textColor={C.primary} border={`2px solid ${C.border}`}
                    shadow={`0 2px 8px ${C.primaryShadow}`} />
                <div>
                    {showDots && <TypingDots />}
                    {showAudio && (
                        <div>
                            <AudioPlayer
                                waveform={item.audioWaveform}
                                duration={item.audioDuration}
                                audioSrc={item.audioSrc}
                                animate={true}
                                onMounted={onAudioMounted}
                            />
                            <p style={{
                                marginTop: 4, fontSize: "0.7rem", color: C.textMuted,
                                fontFamily: "monospace", animation: "fadeUp 0.4s ease",
                            }}>{item.audioLabel}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function InterviewStage() {
    const [doneIds, setDoneIds] = useState<number[]>([]);
    const [activeIdx, setActiveIdx] = useState(-1);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [canSend, setCanSend] = useState(false);
    const [pillReady, setPillReady] = useState(true);

    const typeRef = useRef<number | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    const nextIdx = doneIds.length;
    const isFinished = doneIds.length >= CONVERSATION.length;

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [doneIds, inputValue, activeIdx]);

    const typeIntoInput: TypeIntoInputCallback = useCallback((text, onDone) => {
        if (typeRef.current !== null) globalThis.clearInterval(typeRef.current);
        setInputValue("");
        setIsTyping(true);
        setCanSend(false);
        let i = 0;
        typeRef.current = globalThis.setInterval(() => {
            i++;
            setInputValue(text.slice(0, i));
            if (i >= text.length) {
                if (typeRef.current !== null) globalThis.clearInterval(typeRef.current);
                setIsTyping(false);
                setCanSend(true);
                onDone?.();
            }
        }, 32);
    }, []);

    const handlePillClick = () => {
        setPillReady(false);
        typeIntoInput(CONVERSATION[0].question);
    };

    const handleSend = useCallback(() => {
        if (!canSend || activeIdx >= 0) return;
        const idx = nextIdx;
        setCanSend(false);
        setInputValue("");
        setActiveIdx(idx);
    }, [canSend, activeIdx, nextIdx]);

    const handleAudioMounted = useCallback(() => {
        const justDone = activeIdx;
        setDoneIds(prev => [...prev, justDone]);
        setActiveIdx(-1);

        const next = justDone + 1;
        if (next < CONVERSATION.length) {
            globalThis.setTimeout(() => {
                typeIntoInput(CONVERSATION[next].question);
            }, 600);
        }
    }, [activeIdx, typeIntoInput]);

    return (
        <> 
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:${C.bg}}
        @keyframes slideRight{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:translateX(0)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes dotBounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes pillPop{from{opacity:0;transform:scale(0.88) translateY(6px)}to{opacity:1;transform:scale(1) translateY(0)}}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:${C.primaryBorder};border-radius:2px}
      `}</style>

            <div style={{
                height: "100vh", display: "flex", flexDirection: "column",
                background: `linear-gradient(160deg,#f0f7ff 0%,#e8f2ff 60%,#f5f9ff 100%)`,
                fontFamily: "'DM Sans',sans-serif",
                color: C.text, overflow: "hidden", maxWidth: 720, margin: "0 auto",
            }}>
                <header style={{
                    flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 24px",
                    borderBottom: `1px solid ${C.border}`,
                    background: "rgba(255,255,255,0.75)",
                    backdropFilter: "blur(16px)",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ display: "flex" }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: "50%",
                                background: `linear-gradient(135deg,${C.primary},${C.primaryLight})`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "0.7rem", fontWeight: 700, color: "#fff",
                                border: "2px solid #fff", zIndex: 2,
                                boxShadow: `0 2px 8px ${C.primaryShadow}`,
                            }}>TM</div>
                            <div style={{
                                width: 36, height: 36, borderRadius: "50%",
                                background: `linear-gradient(135deg,${C.primaryPale},${C.border})`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "0.65rem", fontWeight: 700, color: C.primary,
                                border: "2px solid #fff", marginLeft: -10,
                                boxShadow: `0 2px 8px ${C.primaryShadow}`,
                            }}>MS</div>
                             <div style={{
                                width: 36, height: 36, borderRadius: "50%",
                                background: `linear-gradient(135deg,${C.primaryPale},${C.border})`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "0.65rem", fontWeight: 700, color: C.primary,
                                border: "2px solid #fff", marginLeft: -10,
                                boxShadow: `0 2px 8px ${C.primaryShadow}`,
                            }}>NW</div>
                        </div>
                        <div>
                            <h1 style={{
                                fontFamily: "'Playfair Display',serif",
                                fontSize: "1rem", fontWeight: 700, color: C.text, lineHeight: 1.2,
                            }}>Rapport de Stage</h1>
                            <p style={{ fontSize: "0.72rem", color: C.textMuted, fontFamily: "monospace" }}>
                                Entretien · {CONVERSATION.length} questions
                            </p>
                        </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{
                            width: 8, height: 8, borderRadius: "50%",
                            background: "#4ade80", boxShadow: "0 0 6px #4ade80", display: "inline-block",
                        }} />
                        <span style={{ fontSize: "0.72rem", color: C.textMuted, fontFamily: "monospace" }}>En ligne</span>
                    </div>
                </header>

                <div style={{
                    flex: 1, overflowY: "auto",
                    padding: "24px 16px",
                    display: "flex", flexDirection: "column", gap: 28,
                }}>
                    {doneIds.length === 0 && activeIdx === -1 && (
                        <div style={{
                            textAlign: "center", maxWidth: 340, margin: "32px auto 0",
                            animation: "fadeUp 0.6s ease",
                        }}>
                            <div style={{
                                width: 60, height: 60, borderRadius: 16, margin: "0 auto 16px",
                                background: C.primaryPale, border: `1px solid ${C.primaryBorder}`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                                    <path d="M13 2C7.5 2 3 6.5 3 12s4.5 10 10 10 10-4.5 10-10S18.5 2 13 2zm1 15h-2v-5h2v5zm0-7h-2V8h2v2z" fill={C.primary} />
                                </svg>
                            </div>
                            <h2 style={{
                                fontFamily: "'Playfair Display',serif",
                                fontSize: "1.2rem", fontWeight: 700, color: C.text, marginBottom: 8,
                            }}>Interview de stage</h2>
                            <p style={{ fontSize: "0.88rem", color: C.textMuted, lineHeight: 1.6 }}>
                                Cliquez sur la question suggérée pour démarrer l'entretien avec votre maître de stage.
                            </p>
                        </div>
                    )}

                    {doneIds.map(idx => (
                        <StaticMessage key={`done-${CONVERSATION[idx].id}`} item={CONVERSATION[idx]} />
                    ))}

                    {activeIdx >= 0 && (
                        <ActiveMessage
                            key={`active-${CONVERSATION[activeIdx].id}`}
                            item={CONVERSATION[activeIdx]}
                            onAudioMounted={handleAudioMounted}
                        />
                    )}

                    {isFinished && (
                        <div style={{ textAlign: "center", padding: "8px 0", animation: "fadeUp 0.5s ease" }}>
                            <span style={{
                                display: "inline-block", padding: "6px 18px", borderRadius: 99,
                                background: C.primaryPale, border: `1px solid ${C.primaryBorder}`,
                                fontSize: "0.75rem", color: C.primary, fontFamily: "monospace",
                            }}>Entretien terminé ✓</span>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>

                <div style={{
                    flexShrink: 0, padding: "12px 16px 16px",
                    borderTop: `1px solid ${C.border}`,
                    background: "rgba(255,255,255,0.85)",
                    backdropFilter: "blur(16px)",
                }}>
                    {pillReady && doneIds.length === 0 && activeIdx === -1 && !isTyping && !canSend && (
                        <div style={{ marginBottom: 10, display: "flex" }}>
                            <button
                                onClick={handlePillClick}
                                style={{
                                    padding: "8px 18px", borderRadius: 99,
                                    border: `1px solid ${C.primaryBorder}`,
                                    background: C.primaryPale,
                                    color: C.primary, fontSize: "0.84rem",
                                    cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
                                    maxWidth: 500, textAlign: "left",
                                    boxShadow: `0 2px 12px ${C.primaryShadow}`,
                                    animation: "pillPop 0.35s ease",
                                    transition: "box-shadow 0.18s",
                                }}
                                onMouseEnter={e => e.currentTarget.style.boxShadow = `0 4px 18px rgba(37,99,235,0.25)`}
                                onMouseLeave={e => e.currentTarget.style.boxShadow = `0 2px 12px ${C.primaryShadow}`}
                            >
                                💬 {CONVERSATION[0].question.length > 55
                                    ? CONVERSATION[0].question.slice(0, 52) + "…"
                                    : CONVERSATION[0].question}
                            </button>
                        </div>
                    )}

                    <div style={{
                        display: "flex", alignItems: "center", gap: 10,
                        borderRadius: 18, padding: "10px 14px",
                        background: C.bgCard,
                        border: `1.5px solid ${canSend ? C.primary : C.border}`,
                        boxShadow: canSend
                            ? `0 0 0 3px rgba(37,99,235,0.12)`
                            : `0 1px 6px rgba(37,99,235,0.05)`,
                        transition: "border-color 0.2s, box-shadow 0.2s",
                    }}>
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, opacity: 0.35 }}>
                            <path d="M18 13a2 2 0 0 1-2 2H6l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8z"
                                stroke={C.primary} strokeWidth="1.5" strokeLinejoin="round" />
                        </svg>

                        <span style={{
                            flex: 1,
                            fontSize: "0.92rem", fontFamily: "'Lora',Georgia,serif",
                            color: inputValue ? C.text : C.textPlaceholder,
                            whiteSpace: "nowrap", overflow: "hidden",
                            minHeight: "1.4em", display: "block",
                        }}>
                            {inputValue || (!isTyping && "Sélectionnez une question…")}
                            {isTyping && (
                                <span style={{
                                    display: "inline-block", width: 2, height: "1em",
                                    background: C.primary, marginLeft: 2, verticalAlign: "middle",
                                    animation: "blink 0.55s step-end infinite",
                                }} />
                            )}
                        </span>

                        <button
                            onClick={handleSend}
                            disabled={!canSend}
                            style={{
                                flexShrink: 0, width: 34, height: 34, borderRadius: 10,
                                border: "none", cursor: canSend ? "pointer" : "not-allowed",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                background: canSend
                                    ? `linear-gradient(135deg,${C.primary},${C.accent})`
                                    : C.primaryPale,
                                boxShadow: canSend ? `0 3px 12px ${C.primaryShadow}` : "none",
                                transform: canSend ? "scale(1)" : "scale(0.88)",
                                transition: "all 0.2s",
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M13 7L1 1l3 6-3 6 12-6z" fill={canSend ? "white" : C.primaryBorder} />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
