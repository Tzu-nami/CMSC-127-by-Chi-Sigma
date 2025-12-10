import { useState } from "react"
import { useForm } from "@inertiajs/react"
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
import { PlusIcon } from "lucide-react";
import { ShuffleIcon } from "lucide-react";
import { SelectDropdown } from "@/components/select-dropdown";
import { router } from "@inertiajs/react";

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

interface CreateModalFormProps {
  title: string;
  route: string;
  fields: Field[];
  triggerLabel?: string;
  newAuthor?: boolean;
  newGenre?: boolean;
  initialData?: Record<string, string>;
}

function randomId(length: number = 5) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  let result = '';
  let hasLetter = false;
  do {
    result = '';
    hasLetter = false;

    for (let i = 0; i < length; i++) {
      const randomIndex = chars[Math.floor(Math.random() * chars.length)];
      result += randomIndex;
      
      if (letters.includes(result)) {
        hasLetter = true;
      }
    }
  }  while (!hasLetter);
  return result;
}

export const CreateModalForm = ({
  title, route, fields, triggerLabel = "Add", newAuthor = false, newGenre = false,
  }: CreateModalFormProps) => {
  // Check if modal is can be accessed
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState(false);

  const [showNewAuthorFields, setShowNewAuthorFields] = useState(false);
  const [showNewGenreFields, setShowNewGenreFields] = useState(false);

  // Prepare initial data
  const initialData = fields.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {} as Record<string, string>);

  const additionalData: Record<string, string> = {
    ...initialData,
    new_author_firstname: "",
    new_author_lastname: "",
    new_author_middleinitial: "",
    new_genre_name: "",
    new_author_id: "",
    new_genre_id: "",
    new_genre_location: "",
    create_new_author: "false",
    create_new_genre: "false",
  };

const { data, setData, post, processing, errors, reset, transform } = useForm(additionalData || {});

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
    setData(fieldName as keyof typeof data, value);
    
    fields.forEach((field) => {
      if (field.autoCalculate && field.autoCalculate.basedOn === fieldName) {
        if (field.type ===  "date" && value) {
          const calculatedDate = calculateDueDate(value, field.autoCalculate.addDays);
          setData(field.name as keyof typeof data, calculatedDate);
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
  // Modify the data before submitting
  transform((data) => {
    const payload: Record<string, any> = {
      ...data,
      create_new_author: showNewAuthorFields ? 'true' : 'false',
      create_new_genre: showNewGenreFields ? 'true' : 'false',
    };

    if (showNewAuthorFields) {
      payload.new_author_id = data.new_author_id;
      payload.new_author_firstname = data.new_author_firstname;
      payload.new_author_lastname = data.new_author_lastname;
      payload.new_author_middleinitial = data.new_author_middleinitial;
    } else {
      payload.author_id = data.author_id;
    }

    if (showNewGenreFields) {
      payload.new_genre_id = data.new_genre_id;
      payload.new_genre_name = data.new_genre_name;
      payload.new_genre_location = data.new_genre_location;
    } else {
      payload.genre_id = data.genre_id;
    }

    return payload;
  });

  post(route, {
    onSuccess: () => {
      reset();
      setOpen(false);
      setConfirmation(false);
      setShowNewAuthorFields(false);
      setShowNewGenreFields(false);
    },
    // For error handling
    onError: () => {
      setConfirmation(false);
      setOpen(true);
    },
  });
};

  // For cancelling
  const cancelSubmit = () => {
    setConfirmation(false);
  };

    return (
    <>
    {/* Add new Dialog */}
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) {
        //reset();
        setShowNewAuthorFields(false);
        setShowNewGenreFields(false);
      }
    }}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <PlusIcon className="h-4 w-4 mr-2" />
            {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={submitForm} className="flex flex-col h-full">
          <DialogHeader>
            <DialogTitle>
              {title}
            </DialogTitle>
            <DialogDescription>
              Please fill out all required fields. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 pr-2"> 
            <div className="grid gap-4 py-6 px-1">
              {fields.map((field) => {

                if (field.name === "author_id" && newAuthor) {
                  return (
                    <div key={field.name} className="space-y-2">
                      {!showNewAuthorFields ? (
                        <>
                          <SelectDropdown
                            id={field.name}
                            label={field.label}
                            value={data[field.name]}
                            onChange={(value) =>
                              handleFieldChange(field.name, value)
                            }
                            options={field.options || []}
                            required={field.required}
                            disabled={field.readonly}
                            placeholder={"Select Author..."}
                            error={errors[field.name]}
                          />

                          <button
                            type="button"
                            onClick={() => {
                              setShowNewAuthorFields(true);
                              setData("author_id", null as any);
                            }}
                            className="text-sm text-blue-600 hover:text-blue-800 underline"
                          >
                            Click here to add new author
                          </button>
                        </>
                      ) : (
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 space-y-4">

                          <div>
                            <label className="text-xs font-medium text-gray-700">
                              Author ID <span className="text-red-500">*</span>
                            </label>
                            <input
                              value={data.new_author_id}
                              maxLength={6}
                              onChange={(e) =>
                                setData(
                                  "new_author_id",
                                  e.target.value.toUpperCase()
                                )
                              }
                              className="h-9 px-3 py-2 text-sm rounded border w-full"
                              placeholder="e.g., 16500"
                              required
                            />
                            {errors.new_author_id && (
                              <p className="text-xs text-red-500">
                                {errors.new_author_id}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="text-xs font-medium text-gray-700">
                              First Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={data.new_author_firstname}
                              maxLength={255}
                              onChange={(e) =>
                                setData("new_author_firstname", e.target.value)
                              }
                              className="h-9 px-3 py-2 text-sm rounded border w-full"
                              placeholder="e.g., John"
                              required
                            />
                            {errors.new_author_firstname && (
                              <p className="text-xs text-red-500">
                                {errors.new_author_firstname}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="text-xs font-medium text-gray-700">
                              Last Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={data.new_author_lastname}
                              maxLength={255}
                              onChange={(e) =>
                                setData("new_author_lastname", e.target.value)
                              }
                              className="h-9 px-3 py-2 text-sm rounded border w-full"
                              placeholder="e.g., Doe"
                              required
                            />
                            {errors.new_author_lastname && (
                              <p className="text-xs text-red-500">
                                {errors.new_author_lastname}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="text-xs font-medium text-gray-700">
                              Middle Initial
                            </label>
                            <input
                              type="text"
                              maxLength={2}
                              value={data.new_author_middleinitial}
                              onChange={(e) =>
                                setData(
                                  "new_author_middleinitial",
                                  e.target.value.toUpperCase()
                                )
                              }
                              className="h-9 px-3 py-2 text-sm rounded border w-full"
                              placeholder="e.g., A"
                            />
                            {errors.new_author_middleinitial && (
                              <p className="text-xs text-red-500">
                                {errors.new_author_middleinitial}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
                
                if (field.name === "genre_id" && newGenre) {
                  return (
                    <div key={field.name} className="space-y-2">
                      {!showNewGenreFields ? (
                        <>
                          <SelectDropdown
                            id={field.name}
                            label={field.label}
                            value={data[field.name]}
                            onChange={(value) =>
                              handleFieldChange(field.name, value)
                            }
                            options={field.options || []}
                            required={field.required}
                            disabled={field.readonly}
                            placeholder="Select Genre..."
                            error={errors[field.name]}
                          />

                          <button
                            type="button"
                            onClick={() => {
                              setShowNewGenreFields(true);
                              setData("genre_id", null as any);
                            }}
                            className="text-sm text-blue-600 hover:text-blue-800 underline"
                          >
                            Click here to add new genre
                          </button>
                        </>
                      ) : (
                        <div className="bg-green-50 border border-green-200 rounded-md p-4 space-y-4">

                          <div>
                            <label className="text-xs font-medium text-gray-700">
                              Genre ID <span className="text-red-500">*</span>
                            </label>
                            <input
                              value={data.new_genre_id}
                              maxLength={8}
                              onChange={(e) =>
                                setData("new_genre_id", e.target.value)
                              }
                              className="h-9 px-3 py-2 text-sm rounded border w-full"
                              placeholder="e.g., 7052000"
                              required
                            />
                            {errors.new_genre_id && (
                              <p className="text-xs text-red-500">
                                {errors.new_genre_id}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="text-xs font-medium text-gray-700">
                              Genre Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={data.new_genre_name}
                              maxLength={255}
                              onChange={(e) =>
                                setData("new_genre_name", e.target.value)
                              }
                              className="h-9 px-3 py-2 text-sm rounded border w-full"
                              placeholder="e.g., Science Fiction"
                              required
                            />
                            {errors.new_genre_name && (
                              <p className="text-xs text-red-500">
                                {errors.new_genre_name}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-700">
                              Genre Location <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={data.new_genre_location}
                              maxLength={255}
                              onChange={(e) =>
                                setData("new_genre_location", e.target.value)
                              }
                              className="h-9 px-3 py-2 text-sm rounded border w-full"
                              placeholder="e.g., Aisle Y"
                              required
                            />
                            {errors.new_genre_location && (
                              <p className="text-xs text-red-500">
                                {errors.new_genre_location}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                  );
                }

                if (field.fieldType === "select") {
                  return (
                    <SelectDropdown
                      key={field.name}
                      id={field.name}
                      label={field.label}
                      value={data[field.name]}
                      onChange={(value) => handleFieldChange(field.name, value || "")}
                      options={field.options || []}
                      placeholder={field.placeholder}
                      required={field.required}
                      disabled={field.readonly}
                      error={errors[field.name]}
                    />
                  );
                }

                return (
                  <div key={field.name} className="grid gap-1">
                    <label className="text-sm font-medium text-foreground">
                      {field.label}{" "}
                      {field.required && <span className="text-red-500">*</span>}
                    </label>

                    <input
                      id={field.name}
                      type={field.type || "text"}
                      placeholder={field.placeholder}
                      value={data[field.name]}
                      onChange={(e) =>
                        handleFieldChange(field.name, e.target.value)
                      }
                      readOnly={field.readonly}
                      maxLength={field.type !== "number" ? field.maxLength : undefined}
                      className={`h-10 px-3 py-2 rounded border ${
                        errors[field.name] ? "border-red-500 ring-red-500/50" : ""
                      }`}
                      required={field.required}
                    />

                    {(field.name === "book_id" ||
                      field.name === "transaction_id" ||
                      field.name === "borrower_id" ||
                      field.name === "staff_id") && (
                      <button
                        type="button"
                        className="h-6 w-6 bg-[#8c9567] text-white rounded hover:bg-[#444c2f]"
                        onClick={() =>
                          handleFieldChange(field.name, randomId())
                        }
                      >
                        <ShuffleIcon className="h-4 w-4" />
                      </button>
                    )}

                    {errors[field.name] && (
                      <p className="text-red-500 text-xs">{errors[field.name]}</p>
                    )}
                  </div>
                );
              })}
              </div>
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
            Are you sure you want to add this?
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

