import { useState } from "react";
import { Control, useController } from "react-hook-form";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Plus, PlusCircle, X } from "lucide-react";

export default ({
    name,
    label,
    placeholder,
    control,
}: {
    name: "instruments" | "genres";
    label: React.ReactNode;
    placeholder: string;
    control: Control<any>;
}) => {
    const { field } = useController({ name, control });
    const [input, setInput] = useState("");

    const items = field.value || [];

    const addItem = () => {
        if (input.trim()) {
            field.onChange([...items, input.trim()]);
            setInput("");
        }
    };

    const removeItem = (index: number) => {
        field.onChange(items.filter((_: string, i: number) => i !== index));
    };

    return (
        <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
                <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={placeholder}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    addItem();
                                }
                            }}
                        />
                        <Button
                            type="button"
                            variant={"outline"}
                            onClick={addItem}
                        >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add
                        </Button>
                    </div>
                    <ul className="space-y-2">
                        {items.map((item: string, index: number) => (
                            <li
                                key={index}
                                className="flex items-center justify-between p-2 bg-gray-100 rounded"
                            >
                                <span>{item}</span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeItem(index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>
            </FormControl>
            <FormMessage />
        </FormItem>
    );
};
