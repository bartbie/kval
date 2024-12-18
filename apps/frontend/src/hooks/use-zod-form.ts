import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";

type RequireKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

type UseFormOpts<T extends FieldValues> = Exclude<
  Parameters<typeof useForm<T>>[0],
  undefined
>;
type Opts<T extends FieldValues> = RequireKeys<
  Omit<UseFormOpts<T>, "resolver">,
  "defaultValues"
>;

export const useZodForm = <T extends z.Schema<any, any>>(
  schema: T,
  opts: Opts<z.infer<T>>
) => {
  return useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    ...opts,
  });
};
