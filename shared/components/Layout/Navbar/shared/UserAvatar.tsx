interface UserAvatarProps {
  initials: string;
  className?: string;
}

export function UserAvatar({ initials, className }: UserAvatarProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-muted text-xs font-bold text-foreground ${
        className ?? "w-8 h-8"
      }`}
    >
      {initials}
    </div>
  );
}
