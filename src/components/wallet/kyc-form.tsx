
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useRef, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Loader2, ShieldQuestion, Upload, Mail } from 'lucide-react';
import { submitVerificationRequest } from '@/app/wallet/actions';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

// Define the initial state for our form action
const initialState = {
  success: false,
  message: '',
};

// A submit button that shows a loading state
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Enviar para Verificación
    </Button>
  );
}

// The main KYC form component
export function KycForm() {
  const { user } = useAuth();
  const [state, formAction] = useActionState(submitVerificationRequest, initialState);
  const [preview, setPreview] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  // Effect to show toast notifications based on the server action result
  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: '¡Éxito!',
          description: state.message,
        });
        // The parent will re-render and hide the form, so no need to reset
      } else {
        toast({
          variant: 'destructive',
          title: 'Error en el envío',
          description: state.message,
        });
      }
    }
  }, [state, toast]);

  // Handler to create a local preview of the selected image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    } else {
      setPreview(null);
    }
  };

  if (!user) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error de autenticación</AlertTitle>
        <AlertDescription>Debes iniciar sesión para verificar tu cuenta.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4 rounded-lg border p-4">
        <div className="flex items-start gap-3">
            <ShieldQuestion className="h-6 w-6 text-primary flex-shrink-0" />
            <div>
                <h3 className="font-semibold text-lg">Verifica tu Identidad</h3>
                <p className="text-sm text-muted-foreground">Completa tus datos y sube una foto de tu documento de identidad para poder empezar a jugar.</p>
            </div>
        </div>

        <form ref={formRef} action={formAction} className="space-y-6">
            <input type="hidden" name="uid" value={user.uid} />
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input id="firstName" name="firstName" placeholder="Tu nombre" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input id="lastName" name="lastName" placeholder="Tu apellido" required />
                </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" name="email" type="email" value={user.email || ''} readOnly className="pl-10 bg-muted/50" />
              </div>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="idPhoto">Foto de tu Documento (Cédula o Pasaporte)</Label>
                <div className="relative flex justify-center items-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <Input
                        id="idPhoto"
                        name="idPhoto"
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleFileChange}
                        required
                    />
                    {preview ? (
                        <Image src={preview} alt="ID preview" fill className="object-contain rounded-lg p-2" />
                    ) : (
                        <div className="flex flex-col items-center gap-1 text-center text-muted-foreground">
                            <Upload className="h-8 w-8" />
                            <p className="font-semibold">Haz clic o arrastra para subir</p>
                            <p className="text-xs">PNG, JPG o WEBP</p>
                        </div>
                    )}
                </div>
            </div>

            {state.message && !state.success && (
                <Alert variant="destructive" className="text-sm">
                    <AlertDescription>{state.message}</AlertDescription>
                </Alert>
            )}
             
            <SubmitButton />
        </form>
    </div>
  );
}
