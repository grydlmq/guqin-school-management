import './globals.css';

export const metadata = {
  title: '古琴教学点管理系统',
  description: '古琴教学点的一体化管理系统',
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{props.children}</body>
    </html>
  );
}
