type FieldProps = {
  label: string;
  helper?: string;
  children: React.ReactNode;
};

export function Field({ label, helper, children }: FieldProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {helper ? <span className="block text-xs text-muted-foreground">{helper}</span> : null}
    </label>
  );
}
