"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTimerStore } from "@/stores/use-timer-store";
import { cn } from "@/lib/utils";
import { playPhaseChange, playWarning, playComplete } from "@/lib/sound";
import { Play, Pause, RotateCcw, SkipForward, RefreshCw } from "lucide-react";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function TimerSection() {
  const {
    phases,
    currentPhaseIndex,
    secondsLeft,
    status,
    startTimer,
    pauseTimer,
    resetTimer,
    resetAll,
    setDuration,
    tick,
    nextPhase,
  } = useTimerStore();

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevPhaseIndexRef = useRef(currentPhaseIndex);
  const prevStatusRef = useRef(status);

  // Track editing state per phase
  const [editingValues, setEditingValues] = useState<Record<number, string>>({});

  // Interval-based countdown
  useEffect(() => {
    if (status === "running") {
      intervalRef.current = setInterval(() => {
        tick();
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [status, tick]);

  // Phase transition & done detection
  useEffect(() => {
    const prevIndex = prevPhaseIndexRef.current;
    const prevStatus = prevStatusRef.current;

    if (status === "done" && prevStatus !== "done") {
      toast.success("제로톤 완료! 🎉", { duration: 5000 });
      playComplete();
    } else if (currentPhaseIndex !== prevIndex && status === "running") {
      toast.success(`${phases[currentPhaseIndex].label} 페이즈 시작!`);
      playPhaseChange();
    }

    prevPhaseIndexRef.current = currentPhaseIndex;
    prevStatusRef.current = status;
  }, [currentPhaseIndex, status, phases]);

  // 60초 경고음
  useEffect(() => {
    if (secondsLeft === 60 && status === "running") {
      playWarning();
    }
  }, [secondsLeft, status]);

  const currentPhase = phases[currentPhaseIndex];
  const totalSec = currentPhase.durationMin * 60;
  const progress = totalSec > 0 ? (totalSec - secondsLeft) / totalSec : 0;
  const isLowTime = secondsLeft <= 60 && status !== "idle" && status !== "done";

  const handleDurationBlur = (index: number) => {
    const val = editingValues[index];
    if (val === undefined) return;
    const parsed = parseInt(val);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 999) {
      setDuration(index, parsed);
    }
    setEditingValues((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  };

  const handleDurationChange = (index: number, value: string) => {
    setEditingValues((prev) => ({ ...prev, [index]: value }));
  };

  const handleNextPhase = () => {
    if (currentPhaseIndex < phases.length - 1) {
      toast(`${phases[currentPhaseIndex + 1].label} 페이즈로 이동합니다.`);
    }
    nextPhase();
  };

  return (
    <Card>
      <CardContent className="pt-8 pb-8 space-y-6">
        {/* Phase Tabs */}
        <Tabs value={String(currentPhaseIndex)}>
          <TabsList className="w-full">
            {phases.map((phase, i) => (
              <TabsTrigger
                key={i}
                value={String(i)}
                className={cn(
                  "flex-1",
                  i === currentPhaseIndex && "font-semibold"
                )}
                disabled
              >
                {phase.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Timer Display */}
        <div className="text-center">
          <span
            className={cn(
              "text-8xl font-mono font-bold tabular-nums tracking-tight",
              isLowTime ? "text-destructive" : "text-foreground",
              status === "done" && "text-muted-foreground"
            )}
          >
            {status === "done" ? "완료!" : formatTime(secondsLeft)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div
            className={cn(
              "h-3 rounded-full transition-all duration-1000",
              isLowTime ? "bg-destructive" : "bg-primary"
            )}
            style={{ width: `${Math.min(progress * 100, 100)}%` }}
          />
        </div>

        {/* Duration Editors */}
        <div className="flex gap-3 justify-center">
          {phases.map((phase, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-xs text-muted-foreground">{phase.label}</span>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  min={1}
                  max={999}
                  value={editingValues[i] !== undefined ? editingValues[i] : phase.durationMin}
                  onChange={(e) => handleDurationChange(i, e.target.value)}
                  onBlur={() => handleDurationBlur(i)}
                  onKeyDown={(e) => e.key === "Enter" && handleDurationBlur(i)}
                  className="w-16 h-7 text-center text-sm px-1"
                  disabled={status === "running" && i === currentPhaseIndex}
                />
                <span className="text-xs text-muted-foreground">분</span>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={resetAll} title="전체 처음으로">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={resetTimer} title="현재 페이즈 리셋">
            <RotateCcw className="h-4 w-4" />
          </Button>

          {status === "running" ? (
            <Button size="sm" onClick={pauseTimer} className="min-w-20">
              <Pause className="h-4 w-4 mr-1.5" />
              일시정지
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={startTimer}
              disabled={status === "done"}
              className="min-w-20"
            >
              <Play className="h-4 w-4 mr-1.5" />
              {status === "paused" ? "재개" : "시작"}
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPhase}
            disabled={status === "done"}
            title="다음 페이즈"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
