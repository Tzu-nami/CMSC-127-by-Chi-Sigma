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
import { SelectDropdown } from "@/components/select-dropdown";

interface Field {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required: boolean;
  maxLength?: number;
  pattern?: string;
  format?: string;
  readonly?: boolean;
  fieldType?: 'input' | 'select';
  options?: Array<{ value: string; label: string }>;
  autoCalculate?: {
    basedOn: String;
    addDays: number;
  }
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

  // For automation of due date
  const calculateDueDate = (dateString: string, days: number): string => {
    if (!dateString) return "";

    const date = new Date(dateString);
    date.setDate(date.getDate() + days);

    // Fix formatting to YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2,"0");

    return `${year}-${month}-${day}`;
  };

  // Auto calculate
  const handleFieldChange = (fieldName: string, value: string) => {
    setData(fieldName, value);
    
    fields.forEach((field) => {
      if (field.autoCalculate && field.autoCalculate.basedOn === fieldName) {
        if (field.type ===  "date" && value) {
          const calculatedDate = calculateDueDate(value, field.autoCalculate.addDays);
          setData(field.name, calculatedDate);
        }
      }
    });
  };

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
        <Button
          variant={triggerVariant}
          className="p-2 h-auto w-auto bg-[#F0E7C6] hover:bg-[#444034] rounded-lg transition-colors duration-100 ease-in-out"
        >
          <PencilIcon className="h-5 w-5 text-[#8C9657] hover:text-[#F0E7C6]" />
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
              {field.fieldType === 'select' ? (
                <SelectDropdown
                  id={field.name}
                  label={field.label}
                  value={data[field.name]}
                  onChange={(value) => handleFieldChange(field.name, value)}
                  options={field.options || []}
                  placeholder={field.placeholder || `Search ${field.label}...`}
                  required={field.required}
                  disabled={field.readonly}
                  error={errors[field.name]}
                  />
              ) : (
                
              <>
              <label htmlFor={field.name} className="text-sm font-medium text-foreground"> {field.label} {field.required && <span className="text-red-500">*</span>}
              {field.autoCalculate && (<span className="text-xs text-muted-foreground ml-2">
                (Auto calculated: +{field.autoCalculate.addDays} This can be manually adjusted)
              </span>)} </label>
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
                handleFieldChange(field.name, value);
                }} 
                onKeyDown={(e) => {
                  if (field.type == "number"){
                    if (["e", "E", "-", "=", ".", ","].includes(e.key)) {
                      //console.log("ds");
                      e.preventDefault();
                    }
                  }
                }} 
               className={`h-2 px-3 py-4 text-base rounded ${errors[field.name] ? "border-red-500 ring-red-500/50" : ""}`}
               disabled={field.readonly}
               required={field.required || false}
               maxLength={field.maxLength}
               pattern={field.pattern}
               />
              {errors[field.name] && (<p className="text-red-500">{errors[field.name]}</p>)}
              </>
              )}
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

