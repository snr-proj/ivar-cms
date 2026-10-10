import { Admin, Resource, CustomRoutes } from "react-admin";
import { Route } from "react-router-dom";
import LoginPage from "@/admin/LoginPage";
import { dataProvider, authProvider } from "@/admin/providers";
import { adminTheme } from "@/admin/theme";
import CustomLayout from "@/admin/CustomLayout";
import Dashboard from "@/admin/Dashboard";
import SettingsPage from "@/admin/SettingsPage";
import { ProjectList, ProjectEdit, ProjectCreate } from "@/admin/resources/projects";
import {
  ExperienceList,
  ExperienceEdit,
  ExperienceCreate,
} from "@/admin/resources/experience";
import { SkillList, SkillEdit, SkillCreate } from "@/admin/resources/skills";

/**
 * The React Admin app, mounted at /admin by main.tsx. It owns its own
 * router internally — never nest this inside PublicApp's <BrowserRouter>
 * (see main.tsx for the pathname-based split that keeps the two apart).
 */
export default function AdminApp() {
  return (
    <Admin
      basename="/admin"
      dataProvider={dataProvider}
      authProvider={authProvider}
      loginPage={LoginPage}
      dashboard={Dashboard}
      layout={CustomLayout}
      theme={adminTheme}
      title="Ivar Delos Santos — Admin"
    >
      <Resource
        name="projects"
        list={ProjectList}
        edit={ProjectEdit}
        create={ProjectCreate}
      />
      <Resource
        name="experience"
        list={ExperienceList}
        edit={ExperienceEdit}
        create={ExperienceCreate}
      />
      <Resource name="skills" list={SkillList} edit={SkillEdit} create={SkillCreate} />

      <CustomRoutes>
        <Route path="/settings" element={<SettingsPage />} />
      </CustomRoutes>
    </Admin>
  );
}
