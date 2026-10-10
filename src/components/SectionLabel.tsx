interface SectionLabelProps {
  index: string;
  title: string;
}

/** The "01 / HOME" style numbered label used above every section heading. */
export default function SectionLabel({ index, title }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="label">{index}</span>
      <span className="editorial-rule flex-1 max-w-[48px]" />
      <span className="label">{title}</span>
    </div>
  );
}
