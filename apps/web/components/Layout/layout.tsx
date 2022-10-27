import { Layout, Menu } from 'antd';
import { useRouter } from 'next/router';
const { Header, Content, Footer } = Layout;

const MainLayout = ({ children }) => {
  const router = useRouter();
  return (
    <Layout>
      <Header>
        <Menu
          mode="horizontal"
          theme="dark"
          onSelect={(e) => router.push(e.key === 'home' ? '/' : '/' + e.key)}
          items={[
            { key: 'home', label: 'AI' },
            { key: 'result', label: 'Kết quả' },
          ]}
        />
      </Header>
      <Content>{children}</Content>
    </Layout>
  );
};

export default MainLayout;
