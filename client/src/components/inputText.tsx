export default function InputText({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex flex-col items-start gap-4 self-stretch">
      <input
        type={placeholder === "Password" ? "password" : "text"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="text-white-dark-hover p-4 items-start gap-2 self-stretch rounded-2xl border border-white-normal-hover bg-white"
      />
    </div>
  );
}
