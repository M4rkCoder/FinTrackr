import { Separator } from "./ui/separator";

export default function PageWrapper({ children, title }) {
  return (
    <div className="flex flex-col w-[80%] justify-between mx-auto mt-4">
      <div className="flex flex-row justify-between">
        <h2 className="text-3xl font-semibold tracking-tight pb-2 text-left">
          {title}
        </h2>
      </div>
      <Separator className="mt-4" />
      {children}
    </div>
  );
}
