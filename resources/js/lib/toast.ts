type ToastFunctions = {
    showSuccessToast: (description: string, title?: string) => void;
    showErrorToast: (description: string, title?: string) => void;
};

// Create a holder for the toast functions
const toastHolder: Partial<ToastFunctions> = {};

// Function to initialize the toast functions
export const initializeToast = (toasts: ToastFunctions) => {
    toastHolder.showSuccessToast = toasts.showSuccessToast;
    toastHolder.showErrorToast = toasts.showErrorToast;
};

// Export the toast object
export const toast = {
    success: (description: string, title?: string) => {
        if (toastHolder.showSuccessToast) {
            toastHolder.showSuccessToast(description, title || 'Éxito');
        }
    },
    error: (description: string, title?: string) => {
        if (toastHolder.showErrorToast) {
            toastHolder.showErrorToast(description, title || 'Error');
        }
    },
};
