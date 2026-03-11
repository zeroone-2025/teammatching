"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTeamStore } from "@/stores/use-team-store";
import { X, Shuffle, RotateCcw } from "lucide-react";

export default function Home() {
  const [name, setName] = useState("");
  const [isDeveloper, setIsDeveloper] = useState(false);
  const { members, result, addMember, removeMember, assign, reset } = useTeamStore();

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
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "배정 중 오류가 발생했습니다.");
    }
  };

  const canAssign = members.length >= 3;

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
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

      {/* 입력 영역 */}
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

          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleAssign}
              disabled={!canAssign}
              className="flex-1"
            >
              <Shuffle className="h-4 w-4 mr-2" />
              {canAssign ? `${members.length}명 배정하기` : "3명 이상 필요합니다"}
            </Button>
            {result && (
              <Button variant="outline" onClick={reset}>
                <RotateCcw className="h-4 w-4 mr-2" />
                다시 뽑기
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 결과 영역 */}
      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {result.teams.map((team) => (
              <Card key={team.name} className="border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{team.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="w-20 text-muted-foreground">🎯 기획</span>
                    <span className="font-medium">{team.기획.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="w-20 text-muted-foreground">💻 개발</span>
                    <span className="font-medium">{team.개발.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="w-20 text-muted-foreground">📢 마케팅</span>
                    <span className="font-medium">{team.마케팅.name}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {result.unassigned.length > 0 && (
            <Card className="border border-dashed">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-muted-foreground">미배정</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {result.unassigned.map((m) => (
                    <Badge key={m.id} variant="outline" className="text-sm px-3 py-1">
                      {m.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
