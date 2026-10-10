import { Layout, Menu, MenuItemLink, type LayoutProps } from "react-admin";
import { Settings } from "lucide-react";

function CustomMenu() {
  return (
    <Menu>
      <Menu.DashboardItem />
      <Menu.ResourceItem name="projects" />
      <Menu.ResourceItem name="experience" />
      <Menu.ResourceItem name="skills" />
      <MenuItemLink
        to="/settings"
        primaryText="Settings"
        leftIcon={<Settings size={20} />}
      />
    </Menu>
  );
}

export default function CustomLayout(props: LayoutProps) {
  return <Layout {...props} menu={CustomMenu} />;
}
