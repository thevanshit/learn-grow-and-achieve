// Minimal inline SVG icon set (stroke-based, inherits currentColor)
const S = ({ children, size = 18, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {children}
  </svg>
);

export const IconHome = (p) => <S {...p}><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/></S>;
export const IconPlanner = (p) => <S {...p}><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 9h18"/><path d="M8 14h3M8 17h6"/></S>;
export const IconBook = (p) => <S {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></S>;
export const IconTasks = (p) => <S {...p}><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></S>;
export const IconFlag = (p) => <S {...p}><path d="M4 22V4a2 2 0 0 1 2-2h12l-3 5 3 5H6"/></S>;
export const IconClock = (p) => <S {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></S>;
export const IconNote = (p) => <S {...p}><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></S>;
export const IconSettings = (p) => <S {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></S>;
export const IconLogout = (p) => <S {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></S>;
export const IconCheck = (p) => <S {...p}><path d="M20 6 9 17l-5-5"/></S>;
export const IconPlus = (p) => <S {...p}><path d="M12 5v14M5 12h14"/></S>;
export const IconTrash = (p) => <S {...p}><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></S>;
export const IconFire = (p) => <S {...p}><path d="M12 22c4.4 0 8-3.6 8-8 0-5-4-8-8-12 0 4-2 5.5-4 7-1.6 1.2-2 2.6-2 5a8 8 0 0 0 6 8z"/></S>;
export const IconTarget = (p) => <S {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></S>;
export const IconRocket = (p) => <S {...p}><path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2 0-2.8-.8-.7-2.2-.7-3 .8z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></S>;
export const IconCalendar = (p) => <S {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></S>;
export const IconGithub = (p) => <S {...p}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></S>;
export const IconBrain = (p) => <S {...p}><path d="M9.5 2a2.5 2.5 0 0 0-2.5 2.5v.55A3.5 3.5 0 0 0 4 8.5c0 .6.15 1.16.41 1.65A3.5 3.5 0 0 0 3 13.5c0 1.3.7 2.4 1.75 3A3.5 3.5 0 0 0 8 20.5c.5 0 .97-.1 1.4-.28A3.5 3.5 0 0 0 12.5 23a3.5 3.5 0 0 0 3.1-2.78A3.5 3.5 0 0 0 17 20.5a3.5 3.5 0 0 0 3.25-4A3.5 3.5 0 0 0 21 13.5c0-.6-.2-1.3-.41-1.65A3.5 3.5 0 0 0 20 8.5a3.5 3.5 0 0 0-3-3.45V4.5A2.5 2.5 0 0 0 14.5 2c-.5 0-.97.15-1.5.28A3.5 3.5 0 0 0 9.5 2z"/><path d="M12 5v14"/></S>;
export const IconChevron = (p) => <S {...p}><path d="m6 9 6 6 6-6"/></S>;
export const IconInbox = (p) => <S {...p}><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></S>;