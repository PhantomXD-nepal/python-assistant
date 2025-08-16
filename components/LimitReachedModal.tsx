"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

interface LimitReachedModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const LimitReachedModal = ({ isOpen, onClose, message }: LimitReachedModalProps) => {
  const router = useRouter();

  const handleUpgradeClick = () => {
    router.push("/plans");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Limit Reached</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Card className="p-4 text-center">
            <p className="text-lg font-semibold">Upgrade your plan to continue!</p>
          </Card>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleUpgradeClick}>Upgrade Plan</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LimitReachedModal;
