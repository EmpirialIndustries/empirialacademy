import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border-border group-[.toaster]:shadow-card group-[.toaster]:rounded-xl",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-md",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-md",
          success:
            "group-[.toaster]:!bg-card group-[.toaster]:!text-card-foreground group-[.toaster]:!border-l-4 group-[.toaster]:!border-l-success",
          error:
            "group-[.toaster]:!bg-card group-[.toaster]:!text-card-foreground group-[.toaster]:!border-l-4 group-[.toaster]:!border-l-destructive",
          warning:
            "group-[.toaster]:!bg-card group-[.toaster]:!text-card-foreground group-[.toaster]:!border-l-4 group-[.toaster]:!border-l-warning",
          info:
            "group-[.toaster]:!bg-card group-[.toaster]:!text-card-foreground group-[.toaster]:!border-l-4 group-[.toaster]:!border-l-primary",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
