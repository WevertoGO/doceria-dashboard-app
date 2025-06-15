
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function validatePassword(password: string): string | null {
  const requirements = [
    { regex: /.{9,}/, message: "Mínimo de 9 caracteres" },
    { regex: /[a-z]/, message: "Inclua letras minúsculas" },
    { regex: /[A-Z]/, message: "Inclua letras maiúsculas" },
    { regex: /[0-9]/, message: "Inclua pelo menos um número" },
  ];
  for (const req of requirements) {
    if (!req.regex.test(password)) return req.message;
  }
  return null;
}

export function ChangePasswordModal({ open, onOpenChange }: ChangePasswordModalProps) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    const errorMsg = validatePassword(password);
    if (errorMsg) {
      toast.error(errorMsg);
      return;
    }
    if (password !== confirm) {
      toast.error("As senhas não coincidem");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message || "Erro ao alterar senha");
    } else {
      toast.success("Senha alterada com sucesso!");
      setPassword("");
      setConfirm("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Alterar Senha</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="password">Nova senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              disabled={loading}
              autoFocus
              placeholder="Digite a nova senha"
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="confirm">Confirmar senha</Label>
            <Input
              id="confirm"
              type="password"
              value={confirm}
              disabled={loading}
              placeholder="Confirme a nova senha"
              onChange={e => setConfirm(e.target.value)}
            />
          </div>
          <ul className="pl-5 text-xs text-gray-500 list-disc">
            <li>Mínimo de 9 caracteres</li>
            <li>Inclua ao menos 1 letra maiúscula, 1 minúscula e 1 número</li>
          </ul>
        </div>
        <DialogFooter>
          <Button onClick={handleChangePassword} disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
