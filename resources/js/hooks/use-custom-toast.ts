import { useToast } from "@/components/ui/use-toast";

export const useCustomToast = () => {
  const { toast } = useToast();

  const showSuccessToast = (description: string, title?: string) => {
    toast({
      title: title || 'Success',
      description: description,
    });
  };

  const showErrorToast = (description: string, title?: string) => {
    toast({
      variant: 'destructive',
      title: title || 'Error',
      description: description,
    });
  };

  return { showSuccessToast, showErrorToast };
};
