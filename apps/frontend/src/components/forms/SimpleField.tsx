import { Control, FieldPath, FieldValues } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { cloneElement, isValidElement } from "react";

export default <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
    props: Exclude<React.ComponentProps<"input">, "name"> & {
        label: string;
        control: Control<TFieldValues>;
        name: TName;
        element?: React.ReactNode;
    },
) => {
    const { element, name, label, placeholder, type, control, ...rest } = props;
    const childrenProps = { type, placeholder, ...rest };
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        {isValidElement(element) ? (
                            cloneElement(element, { ...element, ...field })
                        ) : (
                            <Input {...childrenProps} {...field} />
                        )}
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
