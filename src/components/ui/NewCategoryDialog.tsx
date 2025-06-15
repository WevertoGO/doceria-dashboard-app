
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { NovaCategoriaForm } from "@/components/forms/NovaCategoriaForm";
import React from "react";

interface Categoria {
  id: string;
  nome: string;
}

interface NewCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoriaPai: Categoria | null;
  keepCreatingSub: boolean;
  onSuccess: () => void;
  onAddAnother: () => void;
  onClose: () => void;
}

export function NewCategoryDialog({
  open, onOpenChange, categoriaPai, keepCreatingSub, onSuccess, onAddAnother, onClose
}: NewCategoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={open => { if (!open) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {categoriaPai ? `Adicionar Subcategoria em "${categoriaPai.nome}"` : 'Nova Categoria'}
          </DialogTitle>
        </DialogHeader>
        <NovaCategoriaForm 
          categoriaPai={categoriaPai}
          onSuccess={onSuccess}
        />
        {keepCreatingSub && (
          <div className="flex flex-col gap-2 mt-4">
            <Button 
              onClick={onAddAnother}
              variant="outline"
              className="w-full"
            >
              Adicionar outra subcategoria
            </Button>
            <Button 
              onClick={onClose}
              variant="ghost"
              className="w-full"
            >
              Fechar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
