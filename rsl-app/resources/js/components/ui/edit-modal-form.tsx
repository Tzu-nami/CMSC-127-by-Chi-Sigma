import { useState } from "react"
import { router, useForm } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Pencil as PencilIcon } from "lucide-react";

interface Field {
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
    required: boolean;
    maxLength: number;
    pattern?: string;
    readonly?: boolean;
}

interface EditModalFormProps {
    title: string;
    route: string;
    fields: Field[];
    initialData: Record<string, string>;
    triggerVariant?: "default" | "outline" | "ghost";
}

export const EditModalForm = ({
  title, route, fields, initialData, triggerVariant = "ghost",
  }: EditModalFormProps) => {
  // Check if modal is can be accessed
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState(false);


  const { data, setData, put, processing, errors, reset } = useForm(initialData || {});

  // Open confirmation dialog
  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmation(true);
  };

  // Check and confirm submission
  const confirmSubmit = () => {
      put(route, {
        onSuccess: () => {
          setOpen(false);
          setConfirmation(false);
        },
        onError: () => {
          setConfirmation(false);
        },
      });
    };

  // For cancelling
  const cancelSubmit = () => {
    setConfirmation(false);
  };

    return (
    <>
    {/* Edit Dialog */}
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant}>
          <PencilIcon className="h-4 w-4 mr-2 text-blue-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={submitForm}>
          <DialogHeader>
            <DialogTitle>
              {title}
            </DialogTitle>
            <DialogDescription>
              Update the information below. Click save when you are done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-6 px-1">
            {fields.map((field) => (
            <div key={field.name} className="grid gap-2">
              <label htmlFor={field.name} className="text-sm font-medium text-foreground"> {field.label} {field.required && <span className="text-red-500">*</span>} </label>
              <input id={field.name}
               type={field.type || "text"} 
               placeholder={field.placeholder || ""}
               value={data[field.name]}
               onChange={(e) => {
                // Brute force error handling for number limits
                let value = e.target.value;
                
                if (field.type == "number"){
                    value = value.slice(0, field.maxLength);
                }
                setData(field.name, value)}
               } 
               className={`h-2 px-3 py-4 text-base rounded ${errors[field.name] ? "border-red-500 ring-red-500/50" : ""}`}
               disabled={field.readonly}
               required={field.required || false}
               maxLength={field.maxLength}
               pattern={field.pattern}
               />
              {errors[field.name] && (<p className="text-red-500">{errors[field.name]}</p>)}
            </div>
            ))}
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline"> Cancel </Button>
            </DialogClose>
            <Button type="submit" disabled={processing}>{processing ? "Saving" : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    {/* Confirmation Dialog */}
    <Dialog open={confirmation} onOpenChange={setConfirmation}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Confirm Submission
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to update this?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
              <Button type="button" variant="outline" onClick={cancelSubmit}> Cancel  </Button>
          </DialogClose>
              <Button type="button" onClick={confirmSubmit}> Confirm </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    </>
  );
};

