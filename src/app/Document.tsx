import styles from "./styles.css?url";
import { requestInfo } from "rwsdk/worker";

function getThemeFromCookies(cookieHeader: string | null): string {
  if (!cookieHeader) return "light";
  
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
  
  return cookies.theme === "dark" ? "dark" : "light";
}

export const Document: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { request } = requestInfo;
  const theme = getThemeFromCookies(request.headers.get('Cookie'));
  
  return (
    <html lang="en" className={theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>@redwoodjs/starter-standard</title>
        <link rel="modulepreload" href="/src/client.tsx" />
        <link rel="stylesheet" href={styles} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Prevent FOUC by immediately applying theme
              (function() {
                try {
                  const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.add('light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <div id="root">{children}</div>
        <script>import("/src/client.tsx")</script>
      </body>
    </html>
  );
};
