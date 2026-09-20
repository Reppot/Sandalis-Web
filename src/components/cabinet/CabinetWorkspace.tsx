"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface DiscordProfile {
  discordId: string;
  displayName: string;
  username: string;
  avatar: string;
  status: string;
  memberSince: string;
  profileUpdated: string;
  server: string;
  roles: string[];
}

interface MeResponse {
  authenticated: boolean;
  profile?: DiscordProfile;
  sessionExpiresAt?: number;
}

export function CabinetWorkspace() {
  const router = useRouter();
  const [profile, setProfile] = useState<DiscordProfile | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/auth/me", { credentials: "same-origin", cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Сессия истекла");
        return (await response.json()) as MeResponse;
      })
      .then((data) => {
        if (!cancelled && data.authenticated && data.profile) {
          setProfile(data.profile);
          setExpiresAt(data.sessionExpiresAt ?? null);
        }
      })
      .catch(() => {
        if (!cancelled) router.replace("/");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    if (!expiresAt) return;
    const timeout = window.setTimeout(() => router.replace("/"), Math.max(0, expiresAt - Date.now()));
    return () => window.clearTimeout(timeout);
  }, [expiresAt, router]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" }).catch(() => undefined);
    router.replace("/");
    router.refresh();
  }

  if (loading) {
    return <div className="panel hud-label flex min-h-64 items-center justify-center rounded-md text-muted"><span className="pulse">📡 СИНХРОНИЗАЦИЯ ПРОФИЛЯ...</span></div>;
  }

  if (!profile) return null;

  return (
    <div className="tab-fade cabinet-page">
      <section className="cabinet-hero panel panel-corners">
        <div className="cabinet-cover" aria-hidden />
        <div className="cabinet-hero-content">
          <div className="cabinet-avatar-wrap">
            <Image src={profile.avatar} alt={`Аватар ${profile.displayName}`} width={132} height={132} className="cabinet-avatar" priority />
            <span className="cabinet-online-dot" title={profile.status} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="hud-label text-accent">ЛИЧНЫЙ КАБИНЕТ • DISCORD LINK</div>
            <h1 className="cabinet-name">{profile.displayName}</h1>
            <div className="cabinet-username">@{profile.username} <span>•</span> {profile.server}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="cabinet-pill cabinet-pill-online">● {profile.status}</span>
              <span className="cabinet-pill">◈ Участник клана</span>
              <span className="cabinet-pill">ID {profile.discordId}</span>
            </div>
          </div>
          <button className="btn btn-danger cabinet-logout" onClick={() => void logout()}>Выйти из терминала</button>
        </div>
      </section>

      <div className="cabinet-grid">
        <section className="panel panel-corners cabinet-card">
          <div className="panel-title">▣ Идентификация участника</div>
          <div className="cabinet-rule" />
          <InfoRow label="Discord ID" value={profile.discordId} mono />
          <InfoRow label="Профиль" value={`@${profile.username}`} />
          <InfoRow label="Сервер" value={profile.server} />
          <InfoRow label="Статус канала" value="СИНДАРИС • AUTHORIZED" accent />
          <InfoRow label="Участник с" value={profile.memberSince} />
          <InfoRow label="Обновление профиля" value={profile.profileUpdated} />
        </section>

        <section className="panel panel-corners cabinet-card">
          <div className="flex items-center justify-between gap-2">
            <div className="panel-title">♟ Реестр ролей</div>
            <span className="badge-count min-w-0">{profile.roles.length} РОЛЕЙ</span>
          </div>
          <div className="cabinet-rule" />
          <div className="cabinet-roles">
            {profile.roles.map((role, index) => (
              <span className="cabinet-role" key={`${role}-${index}`}><span className="cabinet-role-dot" />{role}</span>
            ))}
          </div>
        </section>

        <section className="panel panel-corners cabinet-card cabinet-security-card">
          <div className="panel-title">◈ Сеанс терминала</div>
          <div className="cabinet-rule" />
          <div className="cabinet-session-grid">
            <div><span className="hud-label text-muted">Состояние</span><strong className="text-safe">АКТИВЕН</strong></div>
            <div><span className="hud-label text-muted">Доступ</span><strong className="text-accent">ПОЛНЫЙ</strong></div>
            <div><span className="hud-label text-muted">Хранилище</span><strong>SUPABASE ONLINE</strong></div>
          </div>
          <p className="mt-4 text-[0.78rem] leading-relaxed text-white/65">Токен хранится только в защищённой HttpOnly cookie. Секретный ключ и его значение не отображаются в личном кабинете.</p>
        </section>
      </div>
    </div>
  );
}

function InfoRow({ label, value, mono = false, accent = false }: { label: string; value: string; mono?: boolean; accent?: boolean }) {
  return (
    <div className="cabinet-info-row">
      <span className="hud-label text-muted">{label}</span>
      <span className={`${mono ? "font-mono" : ""} ${accent ? "text-accent" : "text-white"}`}>{value}</span>
    </div>
  );
}
