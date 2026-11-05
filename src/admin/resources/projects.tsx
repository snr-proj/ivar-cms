import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  NumberField,
  EditButton,
  Edit,
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  BooleanInput,
  NumberInput,
  required,
  useRecordContext,
  ReferenceField,
  ReferenceInput,
} from "react-admin";
import ImageUploadInput from "../components/ImageUploadInput";
import StringListInput from "../components/StringListInput";
import GalleryUploadInput from "../components/GalleryUploadInput";

const categoryChoices = [
  { id: "commercial", name: "Commercial" },
  { id: "digital-ooh", name: "Digital OOH" },
  { id: "film", name: "Film" },
  { id: "photography", name: "Photography" },
  { id: "early-production", name: "Early Production" },
];

export function ProjectList() {
  return (
    <List sort={{ field: "sort_order", order: "ASC" }}>
      <Datagrid rowClick="edit">
        <TextField source="title" />
        <TextField source="category" />
        <TextField source="client" />
        <ReferenceField source="parent_id" reference="projects" label="Parent brand" emptyText="—" link={false}>
        <TextField source="title" />
        </ReferenceField>
        <BooleanField source="featured" />
        <BooleanField source="published" />
        <NumberField source="sort_order" />
        <EditButton />
      </Datagrid>
    </List>
  );
}

function OOHFields() {
  const record = useRecordContext();
  if (record?.category !== "digital-ooh") return null;
  return (
    <>
      <TextInput source="ooh_format" label="Format (gantry, standard LED, 3D billboard…)" fullWidth />
      <TextInput source="ooh_location" label="Location" fullWidth />
      <ImageUploadInput source="ooh_original_material" label="Original client material" />
      <ImageUploadInput source="ooh_adapted_material" label="Adapted material" />
      <ImageUploadInput source="ooh_live_display_image" label="Final / live display image" />
    </>
  );
}

function ProjectForm() {
  return (
    <SimpleForm>
      <TextInput source="title" validate={required()} fullWidth />
      <TextInput
        source="slug"
        validate={required()}
        helperText="Used in the URL: /work/this-slug — lowercase, hyphenated"
        fullWidth
      />
      <TextInput source="client" fullWidth />
      <SelectInput source="category" choices={categoryChoices} validate={required()} />
      <ReferenceInput
  source="parent_id"
  reference="projects"
  label="Parent brand"
  perPage={100}
  sort={{ field: "title", order: "ASC" }}
>
  <SelectInput
    optionText="title"
    emptyText="— None (top-level brand) —"
    parse={(v: string) => (v === "" ? null : v)}
    helperText="Leave empty for a brand that shows in the carousel. Pick a brand to list this project inside that brand's page instead."
    fullWidth
  />
      </ReferenceInput>
      <TextInput source="project_type" label="Project type" fullWidth />
      <TextInput source="production_company" label="Production company" fullWidth />
      <TextInput source="role" fullWidth />
      <TextInput source="year" fullWidth />
      <TextInput source="description" multiline minRows={3} fullWidth />
      <StringListInput
        source="contributions"
        label="Contributions"
        helperText="One contribution per line"
      />
      <BooleanInput source="featured" />
      <BooleanInput source="published" defaultValue={true} />
      <NumberInput source="sort_order" defaultValue={0} />

      <ImageUploadInput source="cover_image" label="Cover image" />
      <GalleryUploadInput
        source="gallery_images"
        label="Gallery pictures (add at least 3)"
        minimum={3}
      />
      <TextInput source="video_url" label="Video URL" fullWidth />

      <OOHFields />
    </SimpleForm>
  );
}

export function ProjectEdit() {
  return (
    <Edit>
      <ProjectForm />
    </Edit>
  );
}

export function ProjectCreate() {
  return (
    <Create>
      <ProjectForm />
    </Create>
  );
}
