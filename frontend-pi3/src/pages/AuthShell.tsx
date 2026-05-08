import type { CSSProperties, ReactNode } from 'react';
import { useTheme } from '../ThemeContext';

interface AuthShellProps {
  title: string;
  subtitle: string;
  eyebrow: string;
  highlights: string[];
  footerActionLabel: string;
  footerActionText: string;
  onFooterAction: () => void;
  children: ReactNode;
}

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
  </svg>
);

const SparkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m13 2-2 7-7 2 7 2 2 7 2-7 7-2-7-2-2-7Z" />
  </svg>
);

export default function AuthShell({
  title,
  subtitle,
  eyebrow,
  highlights,
  footerActionLabel,
  footerActionText,
  onFooterAction,
  children,
}: AuthShellProps) {
  const { theme } = useTheme();

  const pageStyle: CSSProperties = {
    minHeight: '100vh',
    padding: 'clamp(24px, 4vw, 56px) 16px 40px',
    background: `radial-gradient(circle at top left, ${theme.primaryLight} 0%, transparent 34%), linear-gradient(180deg, ${theme.background} 0%, #f8fafc 100%)`,
    color: theme.textPrimary,
  };

  const shellStyle: CSSProperties = {
    position: 'relative',
    maxWidth: '1120px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) minmax(320px, 460px)',
    gap: '28px',
    alignItems: 'stretch',
  };

  const panelStyle: CSSProperties = {
    borderRadius: '28px',
    border: `1px solid ${theme.primaryLight}`,
    backgroundColor: 'rgba(255, 255, 255, 0.84)',
    boxShadow: '0 18px 50px rgba(15, 23, 42, 0.08)',
    backdropFilter: 'blur(14px)',
  };

  const badgeStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    borderRadius: '999px',
    backgroundColor: theme.primaryLight,
    color: theme.primaryDark,
    fontSize: '13px',
    fontWeight: 700,
    width: 'fit-content',
  };

  const highlightStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '16px 18px',
    borderRadius: '18px',
    backgroundColor: 'rgba(255,255,255,0.7)',
    border: `1px solid ${theme.primaryLight}`,
  };

  const footerButtonStyle: CSSProperties = {
    background: 'none',
    border: 'none',
    color: theme.link,
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
    padding: 0,
    textDecoration: 'underline',
    textUnderlineOffset: '3px',
  };

  return (
    <div style={pageStyle}>
      <div className="auth-shell-grid" style={shellStyle}>
        <section className="auth-shell-info" style={{ padding: '12px 8px' }}>
          <div style={badgeStyle}>
            <SparkIcon />
            {eyebrow}
          </div>

          <h1 style={{ margin: '18px 0 12px', fontSize: 'clamp(32px, 5vw, 54px)', lineHeight: 1.02, color: theme.textPrimary, letterSpacing: '-0.03em' }}>
            {title}
          </h1>

          <p style={{ margin: 0, maxWidth: '52ch', fontSize: '17px', lineHeight: 1.6, color: theme.textSecondary }}>
            {subtitle}
          </p>

          <div style={{ display: 'grid', gap: '14px', marginTop: '28px' }}>
            {highlights.map((item, index) => {
              const Icon = index === 0 ? CheckIcon : index === 1 ? ShieldIcon : SparkIcon;

              return (
                <div key={item} style={highlightStyle}>
                  <div style={{ color: theme.primary, marginTop: '2px' }}>
                    <Icon />
                  </div>
                  <div>
                    <strong style={{ display: 'block', marginBottom: '4px', fontSize: '15px', color: theme.textPrimary }}>
                      {item}
                    </strong>
                    <span style={{ fontSize: '14px', color: theme.textSecondary, lineHeight: 1.5 }}>
                      Tudo com o mesmo padrão visual do restante do sistema.
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <aside className="auth-shell-form" style={{ ...panelStyle, padding: '28px' }}>
          {children}

          <div style={{ marginTop: '22px', paddingTop: '18px', borderTop: `1px solid ${theme.primaryLight}`, display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '14px', color: theme.textSecondary }}>
              {footerActionText}
            </span>
            <button type="button" onClick={onFooterAction} style={footerButtonStyle}>
              {footerActionLabel}
            </button>
          </div>
        </aside>
      </div>

      <style>{`
        @media (max-width: 920px) {
          .auth-shell-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}