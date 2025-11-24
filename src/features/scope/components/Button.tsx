type ButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLButtonElement>;
export default function Button({ onClick, children, ...rest }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="border-red text-yellowish-white large-text hover:shadow-light-red/50 shadow-light-red/30 rounded-6px flex cursor-pointer items-center gap-x-1.5 border bg-transparent px-3 py-2 font-bold shadow-[0_0_15px] transition-shadow"
      {...rest}
    >
      {children}
    </button>
  );
}
