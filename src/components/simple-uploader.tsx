
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { uploadFile } from '@/app/upload/actions';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const initialState = {
  message: '',
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
    >
      {pending ? 'Uploading...' : 'Upload File'}
    </button>
  );
}

export function SimpleUploader() {
  const [state, formAction] = useFormState(uploadFile, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({ title: 'Success!', description: state.message });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: state.message });
      }
    }
  }, [state, toast]);

  return (
    <div className="w-full max-w-md mx-auto bg-gray-800 p-6 rounded-xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">Simple File Uploader</h2>
      <form action={formAction}>
        <div className="mb-4">
          <label htmlFor="file" className="sr-only">Choose a file</label>
          <input 
            id="file"
            name="file" 
            type="file" 
            required
            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600" 
          />
        </div>
        <SubmitButton />
      </form>
    </div>
  );
}
