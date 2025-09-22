
'use client';

import { useActionState, useEffect, useState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ImageUp, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadGameAsset, FormState } from '../actions';
import { cn } from '@/lib/utils';

const initialState: FormState = {
  success: false,
  message: '',
};

function SubmitButton({ hasFile }: { hasFile: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || !hasFile} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <><Upload className="mr-2 h-4 w-4" /> Guardar Imagen</>}
    </Button>
  );
}

interface AssetUploadFormProps {
  assetKey: string;
  gameType: 'penalty_shootout' | 'mines' | 'cartas';
  title?: string;
  description?: string;
  currentImageUrl: string | null;
}

export function AssetUploadForm({ assetKey, gameType, title = '', description = '', currentImageUrl: initialImageUrl }: AssetUploadFormProps) {
  const [state, formAction] = useActionState(uploadGameAsset, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentImageUrl, setCurrentImageUrl] = useState(initialImageUrl);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({ title: '¡Éxito!', description: state.message });
        if (state.imageUrl) {
          setCurrentImageUrl(state.imageUrl);
          setPreviewUrl(null); // Clear preview after successful upload
          setSelectedFile(null);
          formRef.current?.reset();
        }
      } else {
        toast({ variant: 'destructive', title: 'Error', description: state.message });
      }
    }
  }, [state, toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
        setSelectedFile(null);
        setPreviewUrl(null);
    }
  };

  const displayUrl = previewUrl || currentImageUrl;

  return (
    <Card>
        <form action={formAction} ref={formRef}>
            <CardHeader>
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <input type="hidden" name="assetKey" value={assetKey} />
                <input type="hidden" name="gameType" value={gameType} />

                <div className="space-y-2">
                    <Label>Vista Previa</Label>
                    <div className={cn(
                        "relative flex justify-center items-center w-full h-40 border-2 border-dashed rounded-lg bg-muted/50",
                        {
                            'border-primary': !!previewUrl
                        }
                    )}>
                        {displayUrl ? (
                        <Image src={displayUrl} alt={`${title} preview`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-contain rounded-lg p-2" />
                        ) : (
                        <div className="text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
                            <ImageUp className="h-8 w-8 text-gray-400"/>
                            <span>No hay imagen.</span>
                        </div>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor={`file-${assetKey}`}>Subir Nueva Imagen (.png)</Label>
                    <Input
                        id={`file-${assetKey}`}
                        name="assetImageFile"
                        type="file"
                        accept="image/png"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="file:text-primary-foreground file:font-bold"
                    />
                </div>
            </CardContent>
            <CardFooter>
                <SubmitButton hasFile={!!selectedFile} />
            </CardFooter>
      </form>
    </Card>
  );
}
