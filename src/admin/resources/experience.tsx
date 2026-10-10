import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  DateField,
  EditButton,
  Edit,
  Create,
  SimpleForm,
  TextInput,
  BooleanInput,
  DateInput,
  NumberInput,
  required,
} from "react-admin";
import StringListInput from "../components/StringListInput";

export function ExperienceList() {
  return (
    <List sort={{ field: "sort_order", order: "ASC" }}>
      <Datagrid rowClick="edit">
        <TextField source="company" />
        <TextField source="position" />
        <DateField source="start_date" />
        <BooleanField source="current" />
        <EditButton />
      </Datagrid>
    </List>
  );
}

function ExperienceForm() {
  return (
    <SimpleForm>
      <TextInput source="company" validate={required()} fullWidth />
      <TextInput source="organization" fullWidth />
      <TextInput source="position" validate={required()} fullWidth />
      <DateInput source="start_date" />
      <DateInput source="end_date" />
      <BooleanInput source="current" />
      <TextInput source="description" multiline minRows={3} fullWidth />
      <StringListInput
        source="responsibilities"
        label="Responsibilities"
        helperText="One responsibility per line"
      />
      <NumberInput source="sort_order" defaultValue={0} />
    </SimpleForm>
  );
}

export function ExperienceEdit() {
  return (
    <Edit>
      <ExperienceForm />
    </Edit>
  );
}

export function ExperienceCreate() {
  return (
    <Create>
      <ExperienceForm />
    </Create>
  );
}
