declare module 'cmdk' {
  import * as React from 'react';

  // Props for the main Command component
  interface CommandProps extends React.ComponentPropsWithoutRef<'div'> {
    label?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    loop?: boolean;
    filter?: (value: string, search: string) => number;
    // Add any other props that the main Command component might accept
  }

  // Props for sub-components
  interface CommandInputProps extends React.ComponentPropsWithoutRef<'input'> {
    value?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    // Add any other props specific to CommandInput
  }

type CommandListProps = React.ComponentPropsWithoutRef<'div'>;

  type CommandEmptyProps = React.ComponentPropsWithoutRef<'div'>;

  interface CommandGroupProps extends React.ComponentPropsWithoutRef<'div'> {
    heading?: string;
    // Add any other props specific to CommandGroup
  }

  interface CommandItemProps extends React.ComponentPropsWithoutRef<'div'> {
    value?: string;
    onSelect?: (value: string) => void;
    disabled?: boolean;
    // Add any other props specific to CommandItem
  }

  type CommandSeparatorProps = React.ComponentPropsWithoutRef<'div'>;

  interface CommandDialogProps extends React.ComponentPropsWithoutRef<'div'> {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    // Add any other props specific to CommandDialog
  }


  // Declare the main Command component and its static properties
  export const Command: React.ForwardRefExoticComponent<CommandProps & React.RefAttributes<HTMLDivElement>> & {
    Input: React.ForwardRefExoticComponent<CommandInputProps & React.RefAttributes<HTMLInputElement>>;
    List: React.ForwardRefExoticComponent<CommandListProps & React.RefAttributes<HTMLDivElement>>;
    Empty: React.ForwardRefExoticComponent<CommandEmptyProps & React.RefAttributes<HTMLDivElement>>;
    Group: React.ForwardRefExoticComponent<CommandGroupProps & React.RefAttributes<HTMLDivElement>>;
    Item: React.ForwardRefExoticComponent<CommandItemProps & React.RefAttributes<HTMLDivElement>>;
    Separator: React.ForwardRefExoticComponent<CommandSeparatorProps & React.RefAttributes<HTMLDivElement>>;
    Dialog: React.ForwardRefExoticComponent<CommandDialogProps & React.RefAttributes<HTMLDivElement>>;
  };

  // Export the main component under its alias for consistency with the shadcn/ui component
  export { Command as CommandPrimitive };
}
