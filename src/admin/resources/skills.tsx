import {
  List,
  Datagrid,
  TextField,
  NumberField,
  EditButton,
  Edit,
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  NumberInput,
  required,
} from "react-admin";

const categoryChoices = [
  { id: "Production", name: "Production" },
  { id: "Digital & LED", name: "Digital & LED" },
  { id: "Camera & Visual", name: "Camera & Visual" },
  { id: "Software", name: "Software" },
];

export function SkillList() {
  return (
    <List sort={{ field: "sort_order", order: "ASC" }}>
      <Datagrid rowClick="edit">
        <TextField source="category" />
        <TextField source="name" />
        <NumberField source="sort_order" />
        <EditButton />
      </Datagrid>
    </List>
  );
}

function SkillForm() {
  return (
    <SimpleForm>
      <SelectInput source="category" choices={categoryChoices} validate={required()} />
      <TextInput source="name" validate={required()} fullWidth />
      <NumberInput source="sort_order" defaultValue={0} />
    </SimpleForm>
  );
}

export function SkillEdit() {
  return (
    <Edit>
      <SkillForm />
    </Edit>
  );
}

export function SkillCreate() {
  return (
    <Create>
      <SkillForm />
    </Create>
  );
}
