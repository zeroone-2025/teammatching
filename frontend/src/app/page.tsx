"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTeamStore, MemberSlot } from "@/stores/use-team-store";
import { X, Shuffle, RotateCcw, Lock, Unlock, Copy, Check } from "lucide-react";

const ROLE_ICON = { 기획: "🎯", 마케팅: "📢", 개발: "💻" } as const;

export default function Home() {
  const [name, setName] = useState("");
  const [isDeveloper, setIsDeveloper] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<MemberSlot | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    members,
    result,
    topic,
    numTeams,
    lockedTeamNames,
    addMember,
    removeMember,
    assign,
    reset,
    setTopic,
    setNumTeams,
    toggleLockTeam,
    swapMembers,
  } = useTeamStore();

  const effectiveNumTeams =
    numTeams === "auto" ? Math.floor(members.length / 3) : numTeams;

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    addMember(trimmed, isDeveloper);
    setName("");
    setIsDeveloper(false);
  };

  const handleAssign = () => {
    try {
      assign();
      setSelectedSlot(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "배정 중 오류가 발생했습니다.");
    }
  };

  const handleMemberClick = (slot: MemberSlot) => {
    if (!selectedSlot) {
      setSelectedSlot(slot);
      return;
    }
    const isSame =
      selectedSlot.teamIndex === slot.teamIndex &&
      selectedSlot.field === slot.field &&
      selectedSlot.extraIndex === slot.extraIndex;
    if (isSame) {
      setSelectedSlot(null);
      return;
    }
    swapMembers(selectedSlot, slot);
    setSelectedSlot(null);
  };

  const handleCopy = async () => {
    if (!result) return;
    const lines: string[] = ["🏆 팀 배정 결과"];
    if (topic) lines.push(`📌 주제: ${topic}`);
    lines.push("");
    result.teams.forEach((team) => {
      const parts = (["기획", "마케팅", "개발"] as const).flatMap((role) => {
        const base = role === "기획" ? team.기획 : role === "마케팅" ? team.마케팅 : team.개발;
        const extras = team.extra.filter((e) => e.role === role).map((e) => e.member);
        return [base, ...extras].map((m) => `${m.name}(${role})`);
      });
      lines.push(`${team.name}: ${parts.join(", ")}`);
    });
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      toast.success("클립보드에 복사되었습니다!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("복사에 실패했습니다.");
    }
  };

  const canAssign = members.length >= 3;

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      {/* 헤더 */}
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <Image src="/logo.png" alt="팀 로고" width={64} height={64} />
        </div>
        <Badge variant="secondary" className="mb-4">제로톤 팀 매칭</Badge>
        <h1 className="text-3xl font-bold tracking-tight mb-2">팀 랜덤 배정</h1>
        <p className="text-muted-foreground mb-4">참가자를 입력하고 팀을 구성하세요.</p>
        <div className="inline-flex flex-col gap-1.5 text-sm bg-muted rounded-lg px-5 py-3 text-left">
          <p className="text-foreground font-medium">역할 배정 규칙</p>
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">개발자</span> — 기획 · 마케팅 · 개발 모든 역할에 랜덤 배정
          </p>
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">비개발자</span> — 기획 · 마케팅 역할에만 배정 (개발 제외)
          </p>
        </div>
      </div>

      {/* 오늘의 주제 */}
      <div className="mb-4">
        <Input
          placeholder="오늘의 주제를 입력하세요 (선택 · 결과 공유 시 포함됩니다)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
      </div>

      {/* 참가자 입력 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">참가자 추가</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="이름 입력"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => setIsDeveloper((v) => !v)}
              className="shrink-0"
            >
              <Badge variant={isDeveloper ? "default" : "outline"} className="cursor-pointer px-3 py-1.5 text-sm">
                {isDeveloper ? "개발자" : "비개발자"}
              </Badge>
            </button>
            <Button onClick={handleAdd} disabled={!name.trim()}>
              추가
            </Button>
          </div>

          {members.length > 0 && (
            <ul className="space-y-2">
              {members.map((m) => (
                <li key={m.id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                  <span className="font-medium">{m.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={m.isDeveloper ? "default" : "secondary"} className="text-xs">
                      {m.isDeveloper ? "개발자" : "비개발자"}
                    </Badge>
                    <button
                      onClick={() => removeMember(m.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* 팀 수 + 배정 버튼 */}
          <div className="flex items-center gap-2 pt-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground shrink-0">
              <span>팀 수</span>
              <Input
                type="number"
                min={1}
                max={Math.max(1, Math.floor(members.length / 3))}
                value={effectiveNumTeams || ""}
                onChange={(e) => {
                  const v = parseInt(e.target.value);
                  if (!isNaN(v) && v >= 1) setNumTeams(v);
                }}
                className="w-14 h-8 text-center px-1"
              />
              {numTeams !== "auto" && (
                <button
                  onClick={() => setNumTeams("auto")}
                  className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
                >
                  자동
                </button>
              )}
            </div>
            <Button
              onClick={handleAssign}
              disabled={!canAssign}
              className="flex-1 min-w-32"
            >
              <Shuffle className="h-4 w-4 mr-2" />
              {canAssign ? `${members.length}명 배정하기` : "3명 이상 필요합니다"}
            </Button>
            {result && (
              <Button variant="outline" onClick={() => { reset(); setSelectedSlot(null); }}>
                <RotateCcw className="h-4 w-4 mr-2" />
                초기화
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 결과 영역 */}
      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {selectedSlot
                ? "바꿀 팀원을 선택하세요 · ESC로 취소"
                : "팀원을 클릭하면 서로 바꿀 수 있어요"}
            </p>
            <div className="flex gap-2">
              {selectedSlot && (
                <Button variant="ghost" size="sm" onClick={() => setSelectedSlot(null)}>
                  취소
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4 mr-1.5" /> : <Copy className="h-4 w-4 mr-1.5" />}
                {copied ? "복사됨" : "결과 복사"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {result.teams.map((team, teamIndex) => {
              const isLocked = lockedTeamNames.includes(team.name);
              return (
                <Card
                  key={team.name}
                  className={`border transition-colors ${isLocked ? "border-primary/50 bg-primary/5" : ""}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{team.name}</CardTitle>
                      <button
                        onClick={() => toggleLockTeam(team.name)}
                        className="text-muted-foreground hover:text-primary transition-colors p-1 rounded"
                        title={isLocked ? "잠금 해제 — 다시 뽑기 시 이 팀도 섞입니다" : "팀 고정 — 다시 뽑기 시 이 팀 유지"}
                      >
                        {isLocked ? (
                          <Lock className="h-4 w-4 text-primary" />
                        ) : (
                          <Unlock className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {(["기획", "마케팅", "개발"] as const).map((role) => {
                      const base =
                        role === "기획" ? team.기획 : role === "마케팅" ? team.마케팅 : team.개발;
                      const extrasForRole = team.extra
                        .map((e, ei) => ({ member: e.member, role: e.role, extraIndex: ei }))
                        .filter((e) => e.role === role);

                      const allSlots: { member: typeof base; slot: MemberSlot }[] = [
                        { member: base, slot: { teamIndex, field: role } },
                        ...extrasForRole.map((e) => ({
                          member: e.member,
                          slot: { teamIndex, field: "extra" as const, extraIndex: e.extraIndex },
                        })),
                      ];

                      return (
                        <div key={role} className="flex items-center gap-3 text-sm">
                          <span className="w-20 shrink-0 text-muted-foreground">
                            {ROLE_ICON[role]} {role}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {allSlots.map(({ member, slot }) => {
                              const isSelected =
                                selectedSlot &&
                                selectedSlot.teamIndex === slot.teamIndex &&
                                selectedSlot.field === slot.field &&
                                selectedSlot.extraIndex === slot.extraIndex;
                              return (
                                <button
                                  key={member.id}
                                  onClick={() => handleMemberClick(slot)}
                                  className={`font-medium rounded px-1.5 py-0.5 transition-colors ${
                                    isSelected
                                      ? "bg-primary text-primary-foreground"
                                      : selectedSlot
                                        ? "hover:bg-accent cursor-pointer ring-1 ring-border"
                                        : "hover:bg-accent cursor-pointer"
                                  }`}
                                >
                                  {member.name}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
