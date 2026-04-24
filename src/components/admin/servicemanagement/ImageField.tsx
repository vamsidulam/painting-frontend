import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Image as ImageIcon, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MAX_IMAGE_BYTES } from "./data";

type Props = {
  id: string;
  label?: string;
  initialUrl?: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  removed?: boolean;
  onRemovedChange?: (removed: boolean) => void;
  disabled?: boolean;
  helpText?: string;
};

export function ImageField({
  id,
  label = "Image",
  initialUrl = "",
  file,
  onFileChange,
  removed = false,
  onRemovedChange,
  disabled = false,
  helpText = "Optional. JPG or PNG, up to 5MB.",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview("");
  }, [file]);

  const showExisting = !file && !removed && !!initialUrl;
  const showPreview = !!file;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.files?.[0] ?? null;
    if (next && next.size > MAX_IMAGE_BYTES) {
      setError("Image must be 5MB or smaller.");
      e.target.value = "";
      return;
    }
    if (next && !/^image\//.test(next.type)) {
      setError("Please choose an image file.");
      e.target.value = "";
      return;
    }
    setError(null);
    onFileChange(next);
    if (next && onRemovedChange) onRemovedChange(false);
  };

  const handleRemoveExisting = () => {
    if (onRemovedChange) onRemovedChange(true);
    onFileChange(null);
  };

  const handleClearNew = () => {
    onFileChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-start gap-3">
        <div className="h-24 w-24 rounded-xl border border-border bg-muted overflow-hidden grid place-items-center shrink-0">
          {showPreview ? (
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          ) : showExisting ? (
            <img
              src={initialUrl}
              alt="Current"
              className="h-full w-full object-cover"
            />
          ) : (
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input
            ref={inputRef}
            id={id}
            type="file"
            accept="image/*"
            onChange={handleChange}
            disabled={disabled}
            className="hidden"
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={disabled}
              className="gap-2 rounded-xl"
            >
              <Upload className="h-4 w-4" />
              {showPreview || showExisting ? "Change" : "Upload"}
            </Button>
            {showPreview && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClearNew}
                disabled={disabled}
                className="gap-2 rounded-xl"
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </Button>
            )}
            {showExisting && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemoveExisting}
                disabled={disabled}
                className="gap-2 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{helpText}</p>
          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
