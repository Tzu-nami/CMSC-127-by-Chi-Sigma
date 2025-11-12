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
import { PlusIcon } from "lucide-react";

interface Field {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
}

interface CustomModalFormProps {
  title: string;
  route: string;
  fields: Field[];
  triggerLabel?: string;
  method?: 'post' | 'put' | 'delete';
  initialData?: Record<string, string>;
}

export const CustomModalForm = ({
  title, route, fields, triggerLabel = "Add New", method = 'post',
  }: CustomModalFormProps) => {
  // Check if modal is can be accessed
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState(false);

  // Prepare initial data
  const initialData = fields.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {} as Record<string, string>);

  // User input is stored here
  /*const { data, setData, post, processing, errors, reset } = useForm({
    book_id: "",
    book_title: "",
    book_year: "",
    book_publisher: "",
    book_copies: "",
  });*/

  const { data, setData, post, processing, errors, reset } = useForm(initialData || {});

  // Check if everything is valid before submitting
  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmation(true);

    if (method === 'put') {
      router.put(route, data, {
        onSuccess: () => {
          reset();
          setOpen(false);
          setConfirmation(false);
        },
      });
    } else {
      post(route, {
        onSuccess: () => {
          reset();
          setOpen(false);
          setConfirmation(false);
        },
      });
    }

    /*if (!data.book_id || !data.book_title || !data.book_year || !data.book_publisher || !data.book_copies) {
      alert("Please fill in all required fields.");
      return;
    }*/


  };

  // Save and confirm submission
  const confirmSubmit = () => {
    post(/*"/booksdatabase"*/route, {
      onSuccess: () => {
        reset();
        setOpen(false);
        setConfirmation(false);
      },
      onError: () => {
        setConfirmation(false);
      }
    });
  };

  // For cancelling
  const cancelSubmit = () => {
    setConfirmation(false);
  };

  /*
  return (
    <>
    {/* Add book Dialog *}
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <PlusIcon className="h-4 w-4 mr-2" />
            Add New Book
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={submitForm}>
          <DialogHeader>
            <DialogTitle>
              Add a new book.
            </DialogTitle>
            <DialogDescription>
              Please fill out all required fields. Click save when you are done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="book_id"> Book ID </label>
              <input id="book_id" value={data.book_id} onChange={(e) => setData("book_id", e.target.value)}
              placeholder="e.g. A1Z26" className={errors.book_id ? "border-red-500": ""} required/>
              {errors.book_id && (<p className="text-red-500">{errors.book_id}</p>)}
            </div>

            <div className="grid gap-2">
              <label htmlFor="book_title"> Book Title </label>
              <input id="book_title" value={data.book_title} onChange={(e) => setData("book_title", e.target.value)}
              placeholder="Enter Book Title" className={errors.book_title ? "border-red-500": ""} required/>
              {errors.book_title && (<p className="text-red-500">{errors.book_title}</p>)}
            </div>

            <div className="grid gap-2">
              <label htmlFor="book_year"> Book Year </label>
              <input id="book_year" value={data.book_year} onChange={(e) => setData("book_year", e.target.value)}
              placeholder="Enter Book Year" className={errors.book_year ? "border-red-500": ""} required/>
              {errors.book_year && (<p className="text-red-500">{errors.book_year}</p>)}
            </div>

            <div className="grid gap-2">
              <label htmlFor="book_publisher"> Book Publisher </label>
              <input id="book_publisher" value={data.book_publisher} onChange={(e) => setData("book_publisher", e.target.value)}
              placeholder="Enter Book Publisher" className={errors.book_publisher ? "border-red-500": ""} required/>
              {errors.book_publisher && (<p className="text-red-500">{errors.book_publisher}</p>)}
            </div>

            <div className="grid gap-2">
              <label htmlFor="book_copies"> Book Copies </label>
              <input id="BOOK_COPIES" value={data.book_copies} onChange={(e) => setData("book_copies", e.target.value)}
              placeholder="Enter number of copies" className={errors.book_copies ? "border-red-500": ""} required/>
              {errors.book_copies && (<p className="text-red-500">{errors.book_copies}</p>)}
            </div>

          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline"> Cancel  </Button>
            </DialogClose>
            <Button type="submit" disabled={processing}>{processing ? "Saving" : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    */

    return (
    <>
    {/* Add new Dialog */}
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <PlusIcon className="h-4 w-4 mr-2" />
            {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={submitForm}>
          <DialogHeader>
            <DialogTitle>
              {title}
            </DialogTitle>
            <DialogDescription>
              Please fill out all required fields. Click save when you are done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-6 px-1">
            {fields.map((field) => (
            <div key={field.name} className="grid gap-2">
              <label htmlFor={field.name} className="text-sm font-medium text-foreground"> {field.label} </label>
              <input id={field.name}
               type={field.type || "text"} 
               placeholder={field.placeholder || ""}
               value={data[field.name]}
               onChange={(e) => setData(field.name, e.target.value)}
               className={`h-2 px-3 py-4 text-base rounded ${errors[field.name] ? "border-red-500 ring-red-500/50" : ""}`}required/>
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

