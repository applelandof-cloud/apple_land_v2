import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PasswordVisibilityToggle from '@/components/password-visibility-toggle';
import InputError from '@/components/input-error';
import { useState } from 'react';
import axios, { isAxiosError } from 'axios';

interface ChangePasswordModalProps {
    open: boolean;
    onClose: () => void;
    userId: number;
}

export function ChangePasswordModal({ open, onClose, userId }: ChangePasswordModalProps) {
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [processing, setProcessing] = useState(false);

    const handleSave = async () => {
        setProcessing(true);
        setErrors({});

        try {
            await axios.patch(`/api/staff/${userId}/password`, {
                password,
                password_confirmation: passwordConfirmation,
            });
            setProcessing(false);
            onClose();
        } catch (error: unknown) {
            setProcessing(false);
            if (isAxiosError(error) && error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.error('Failed to update password:', error);
            }
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
                        />
                        <PasswordVisibilityToggle
                            isVisible={showPassword}
                            onToggle={() => setShowPassword(!showPassword)}
                        />
                        <InputError message={errors.password ? errors.password.join(' ') : ''} className="mt-2" />
                    </div>
                    <div className="relative">
                        <Input
                            type={showPasswordConfirmation ? 'text' : 'password'}
                            placeholder="Confirmar Nuevo Password"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                        />
                        <PasswordVisibilityToggle
                            isVisible={showPasswordConfirmation}
                            onToggle={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                        />
                        <InputError message={errors.password_confirmation ? errors.password_confirmation.join(' ') : ''} className="mt-2" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSave} disabled={processing}>Guardar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
