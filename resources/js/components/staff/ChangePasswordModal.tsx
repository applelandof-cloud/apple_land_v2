import InputError from '@/components/input-error';
import PasswordVisibilityToggle from '@/components/password-visibility-toggle';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { updateStaffPassword } from '@/services/staffService';
import { useState } from 'react';

interface ChangePasswordModalProps {
    open: boolean;
    onClose: () => void;
    userId: number;
}

export function ChangePasswordModal({
    open,
    onClose,
    userId,
}: ChangePasswordModalProps) {
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] =
        useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [processing, setProcessing] = useState(false);
    const { showSuccessToast, showErrorToast } = useCustomToast();

    const handleSave = async () => {
        setProcessing(true);
        setErrors({});

        const result = await updateStaffPassword(
            userId,
            password,
            passwordConfirmation,
        );

        setProcessing(false);

        if (result.errors) {
            setErrors(result.errors);
            showErrorToast('Error de validación. Por favor, revisa tus datos.');
        } else if (result.message) {
            showErrorToast(result.message);
        } else if (result.success) {
            onClose();
            showSuccessToast('Contraseña actualizada correctamente.');
        }
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Cambiar Password</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="relative">
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Nuevo Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={errors.password ? 'border-red-500' : ''}
                        />
                        <PasswordVisibilityToggle
                            isVisible={showPassword}
                            onToggle={() => setShowPassword(!showPassword)}
                        />
                        <InputError
                            message={
                                errors.password ? errors.password.join(' ') : ''
                            }
                            className="mt-2"
                        />
                    </div>
                    <div className="relative">
                        <Input
                            type={
                                showPasswordConfirmation ? 'text' : 'password'
                            }
                            placeholder="Confirmar Nuevo Password"
                            value={passwordConfirmation}
                            onChange={(e) =>
                                setPasswordConfirmation(e.target.value)
                            }
                            className={
                                errors.password_confirmation
                                    ? 'border-red-500'
                                    : ''
                            }
                        />
                        <PasswordVisibilityToggle
                            isVisible={showPasswordConfirmation}
                            onToggle={() =>
                                setShowPasswordConfirmation(
                                    !showPasswordConfirmation,
                                )
                            }
                        />
                        <InputError
                            message={
                                errors.password_confirmation
                                    ? errors.password_confirmation.join(' ')
                                    : ''
                            }
                            className="mt-2"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} disabled={processing}>
                        Guardar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
