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
import { Trash as TrashIcon } from "lucide-react";

interface DeleteFormProps {
    route: string;
    item: string;
    triggerVariant?: "default" | "outline" | "ghost" | "destructive";
}

export const DeleteForm = ({
  route, item, triggerVariant = "ghost",
  }: DeleteFormProps) => {
  // Check if modal is can be accessed
  const [open, setOpen] = useState(false);
  const { delete : destroy, processing} = useForm();

  const confirmDelete = () => {
    destroy(route, {
        onSuccess: () => {
          setOpen(false);
        },
      });
    }

  const cancelDelete = () => {
    setOpen(false);
  };

    return (
    <>
    {/* Delete Dialog */}
    <Dialog open={open} onOpenChange={setOpen}>

      <DialogTrigger asChild>
        <Button
          variant={triggerVariant}
          className="p-2 h-auto w-auto bg-[#F0E7C6] hover:bg-[#444034] rounded-lg transition-colors duration-100 ease-in-out"
        >
          <TrashIcon className="h-5 w-5 text-[#8C9657] hover:text-[#F0E7C6]" />
        </Button>
        </DialogTrigger>
        
      <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this <span className="block mt-2 font-semibold text-black">{item}?</span>
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. 
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={cancelDelete}> Cancel </Button>
            </DialogClose>
                <Button type="button" onClick={confirmDelete} disabled={processing}>{processing ? "Deleting" : "Confirm"}</Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>

    </>
  );
};

